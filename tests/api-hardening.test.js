// tests/api-hardening.test.js
// TDD RED: Verifies API hardening fixes across multiple concerns.

const fs = require('fs');
const path = require('path');

describe('Blog Pagination Bounds — Task 4.1', () => {
  test('blogController must cap limit with Math.min', () => {
    const source = fs.readFileSync(
      path.join(__dirname, '..', 'controllers', 'blogController.js'),
      'utf-8'
    );
    // Should have Math.min(100, ...) to cap pagination
    expect(source).toMatch(/Math\.min\s*\(\s*100/);
  });

  test('blogController must enforce minimum page with Math.max', () => {
    const source = fs.readFileSync(
      path.join(__dirname, '..', 'controllers', 'blogController.js'),
      'utf-8'
    );
    expect(source).toMatch(/Math\.max\s*\(\s*1/);
  });
});

describe('CSV Injection Protection — Task 4.2', () => {
  let csvSanitize;

  beforeAll(() => {
    csvSanitize = require('../utils/csvSanitize');
  });

  test('escapes formula injection starting with =', () => {
    const result = csvSanitize('=SYSTEM("calc")');
    expect(result.startsWith('"')).toBe(true);
    expect(result.endsWith('"')).toBe(true);
  });

  test('escapes formula injection starting with +', () => {
    const result = csvSanitize('+cmd');
    expect(result).toBe('"+cmd"');
  });

  test('escapes formula injection starting with -', () => {
    const result = csvSanitize('-cmd');
    expect(result).toBe('"-cmd"');
  });

  test('escapes formula injection starting with @', () => {
    const result = csvSanitize('@import');
    expect(result).toBe('"@import"');
  });

  test('leaves normal text unchanged', () => {
    expect(csvSanitize('John Doe')).toBe('John Doe');
  });

  test('handles null/undefined gracefully', () => {
    expect(csvSanitize(null)).toBe('');
    expect(csvSanitize(undefined)).toBe('');
  });

  test('waitlistController must import csvSanitize', () => {
    const source = fs.readFileSync(
      path.join(__dirname, '..', 'controllers', 'waitlistController.js'),
      'utf-8'
    );
    expect(source).toMatch(/require\(.+csvSanitize.+\)/);
  });
});

describe('COEP Header Conflict — Task 4.3', () => {
  test('securityHeaders must NOT set Cross-Origin-Embedder-Policy', () => {
    const source = fs.readFileSync(
      path.join(__dirname, '..', 'middleware', 'securityHeaders.js'),
      'utf-8'
    );
    expect(source).not.toMatch(/Cross-Origin-Embedder-Policy/);
  });
});

describe('Hardcoded Emails Removed — Task 4.4', () => {
  test('config.js must NOT contain hardcoded email addresses as fallbacks', () => {
    const source = fs.readFileSync(path.join(__dirname, '..', 'config', 'config.js'), 'utf-8');
    // Should not have email@domain as a fallback default
    const lines = source.split('\n');
    const fallbackLines = lines.filter((line) => /\|\|\s*['"].*@.*\.com['"]/.test(line));
    expect(fallbackLines).toEqual([]);
  });
});

describe('Missing Env Vars in .env.example — Task 4.5', () => {
  test('.env.example must include UPSTASH vars', () => {
    const source = fs.readFileSync(path.join(__dirname, '..', '.env.example'), 'utf-8');
    expect(source).toMatch(/UPSTASH_REDIS_REST_URL/);
    expect(source).toMatch(/UPSTASH_REDIS_REST_TOKEN/);
  });

  test('.env.example must include BREVO_SENDER_EMAIL', () => {
    const source = fs.readFileSync(path.join(__dirname, '..', '.env.example'), 'utf-8');
    expect(source).toMatch(/BREVO_SENDER_EMAIL/);
  });
});
