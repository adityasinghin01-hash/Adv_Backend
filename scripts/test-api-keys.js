#!/usr/bin/env node
// scripts/test-api-keys.js
// Smoke test for the API key lifecycle after review fixes

const http = require('http');

const BASE = 'http://localhost:5002';

function request(method, path, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const opts = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: { ...headers },
    };
    if (body) {
      const data = JSON.stringify(body);
      opts.headers['Content-Type'] = 'application/json';
      opts.headers['Content-Length'] = Buffer.byteLength(data);
    }
    const req = http.request(opts, (res) => {
      let chunks = '';
      res.on('data', d => chunks += d);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(chunks) }); }
        catch { resolve({ status: res.statusCode, data: chunks }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

(async () => {
  let pass = 0, fail = 0;
  const assert = (test, name) => {
    if (test) { pass++; console.log(`  ✅ ${name}`); }
    else { fail++; console.log(`  ❌ ${name}`); }
  };

  // Step 1: Login
  console.log('\n=== Step 1: Login ===');
  const login = await request('POST', '/api/v1/login', {}, {
    email: 'testadmin@spinx.dev', password: 'Test@12345'
  });
  assert(login.status === 200, `Login → ${login.status} (expected 200)`);
  const TOKEN = login.data.accessToken;

  // Step 2: No auth → 401
  console.log('\n=== Step 2: No auth → 401 ===');
  const noAuth = await request('GET', '/api/v1/profile');
  assert(noAuth.status === 401, `No auth → ${noAuth.status} (expected 401)`);
  assert(!noAuth.data.message.includes('API key'), `Message: "${noAuth.data.message}"`);

  // Step 3: Query string rejected
  console.log('\n=== Step 3: Query string API key → 400 ===');
  const qsKey = await request('GET', '/api/v1/profile?apiKey=sk_live_fake');
  assert(qsKey.status === 400, `Query key → ${qsKey.status} (expected 400)`);
  assert(qsKey.data.message.includes('query string'), `Message: "${qsKey.data.message}"`);

  // Step 4: Create API key
  console.log('\n=== Step 4: Create API key ===');
  const create = await request('POST', '/api/v1/apikeys', {
    Authorization: `Bearer ${TOKEN}`
  }, { name: 'Review Smoke Test', scopes: ['api:read'] });
  assert(create.status === 201, `Create → ${create.status} (expected 201)`);
  assert(create.data.data.key.expiresAt !== undefined, 'Response includes expiresAt');
  const RAW_KEY = create.data.data.rawKey;
  const KEY_ID = create.data.data.key.id;
  console.log(`  Key: ${RAW_KEY.substring(0, 20)}...`);

  // Step 5: List keys
  console.log('\n=== Step 5: List keys via JWT ===');
  const list = await request('GET', '/api/v1/apikeys', {
    Authorization: `Bearer ${TOKEN}`
  });
  assert(list.status === 200, `List → ${list.status} (expected 200)`);
  assert(list.data.count >= 1, `Count: ${list.data.count}`);

  // Step 6: X-API-Key on JWT-only route → 401 (no implicit fallback)
  console.log('\n=== Step 6: X-API-Key on JWT-only route → 401 ===');
  const noFallback = await request('GET', '/api/v1/profile', {
    'X-API-Key': RAW_KEY
  });
  assert(noFallback.status === 401, `No fallback → ${noFallback.status} (expected 401)`);

  // Step 7: Revoke key
  console.log('\n=== Step 7: Revoke key ===');
  const revoke = await request('DELETE', `/api/v1/apikeys/${KEY_ID}`, {
    Authorization: `Bearer ${TOKEN}`
  });
  assert(revoke.status === 200, `Revoke → ${revoke.status} (expected 200)`);

  // Step 8: Revoked key no longer works
  console.log('\n=== Step 8: Revoked key rejected ===');
  const revokedAttempt = await request('GET', '/api/v1/apikeys', {
    'X-API-Key': RAW_KEY
  });
  // Since apikeys routes use protect() (no allowApiKey), this should be 401
  assert(revokedAttempt.status === 401, `Revoked → ${revokedAttempt.status} (expected 401)`);

  // Summary
  console.log(`\n${'='.repeat(40)}`);
  console.log(`Results: ${pass} passed, ${fail} failed`);
  console.log(`${'='.repeat(40)}\n`);
  process.exit(fail > 0 ? 1 : 0);
})();
