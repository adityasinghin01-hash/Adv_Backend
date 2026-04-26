# ═══════════════════════════════════════════════════════════════════

# ANTIGRAVITY MASTER PROMPT — SDG_HACK / Adv_Backend

# Paste this entire file at the start of every new session.

# ═══════════════════════════════════════════════════════════════════

## 0. AGENT BOOT INSTRUCTIONS (READ FIRST, EVERY SESSION)

You are working on the **SDG_HACK Auth Backend** — a production-grade Node.js/Express authentication backend.

### Mandatory First Steps (do these every session before anything else):

1. **Read the codebase structure:** `ls -la /Users/aditya/Desktop/Adv_Backend/`
2. **Read current test status:** `cd /Users/aditya/Desktop/Adv_Backend && npm test -- --forceExit 2>&1 | tail -10`
3. **Read current lint status:** `cd /Users/aditya/Desktop/Adv_Backend && npm run lint`
4. **Read this file:** `/Users/aditya/Desktop/Adv_Backend/MASTER_PROMPT.md` (you are reading it)
5. **Always run tests BEFORE and AFTER making any changes.** Never leave the repo with a failing test suite.
6. **Always run `npm run lint` after any code change.** Fix all errors before committing.

### Commit Rule:

Before ending any session, commit all changes:

```bash
cd /Users/aditya/Desktop/Adv_Backend
git add -A
git commit -m "phase X: <short description>"
git push origin main
```

---

## 1. PROJECT IDENTITY

| Field             | Value                                                                      |
| ----------------- | -------------------------------------------------------------------------- |
| **Project Name**  | SDG_HACK Auth Backend (also called `spinx-auth-backend`)                   |
| **Local Path**    | `/Users/aditya/Desktop/Adv_Backend/`                                       |
| **GitHub Repo**   | `https://github.com/adityasinghin01/SDG_HACK` (check with `git remote -v`) |
| **Runtime**       | Node.js, Express.js (CommonJS — no ESM)                                    |
| **Database**      | MongoDB Atlas via Mongoose                                                 |
| **Hosting**       | Render (single Render proxy → `trust proxy 1` in app.js)                   |
| **Auth**          | JWT (access + refresh token rotation), Google OAuth, OTP                   |
| **Email**         | Brevo (Sendinblue) SMTP                                                    |
| **Rate Limiting** | Upstash Redis via `@upstash/ratelimit`                                     |
| **Logging**       | Winston (structured JSON, with request-id correlation)                     |
| **Testing**       | Jest + Supertest                                                           |
| **Linting**       | ESLint flat config + Prettier                                              |
| **Git Hooks**     | Husky + lint-staged (pre-commit auto-lint + auto-format)                   |

---

## 2. ENVIRONMENT VARIABLES (Critical — Never Expose Publicly)

```
# Production DB
MONGO_URI=mongodb+srv://adityasinghin01_db_user:0jLgE71dsWXMFz8q@adv-backend.dtiohic.mongodb.net/adv_backend?retryWrites=true&w=majority&appName=Adv-Backend

# Test DB (isolated, safe to wipe)
MONGO_URI_TEST=mongodb+srv://adityasinghin01_db_user:0jLgE71dsWXMFz8q@adv-backend.dtiohic.mongodb.net/adv_backend_test?retryWrites=true&w=majority&appName=Adv-Backend

# Webhook secret (NEW - fixed the malformed key that had 'i' in it)
WEBHOOK_SECRET_KEY=61b1ec68fe6eb0b1f54c57a9308495bd658788d5137b7332c3c822c0ee88b237
# ⚠️ MUST also update this on Render dashboard if not done already!
```

All other env vars are in `.env` locally. The `.env.example` has the full list of required keys.

---

## 3. ARCHITECTURE OVERVIEW

```
Adv_Backend/
├── app.js                  # Express app: helmet, CORS, CSP, rate limiters, routes
├── server.js               # HTTP server: graceful shutdown, DB connect, webhook retry worker
├── config/
│   └── config.js           # All env vars loaded here. MUST add fail-fast for prod.
├── routes/v1/
│   ├── auth.routes.js      # /signup, /login, /logout, /refresh-token, /google-login
│   ├── admin.routes.js     # /admin/users — RBAC protected
│   ├── webhook.routes.js   # /webhooks CRUD
│   ├── newsletter.routes.js
│   ├── waitlist.routes.js
│   ├── blog.routes.js
│   ├── contact.routes.js
│   ├── plan.routes.js
│   ├── health.routes.js    # /health/deep — readiness probe
│   └── apiKey.routes.js
├── controllers/            # One controller per domain
├── services/               # Business logic (webhookService, emailService, etc.)
├── models/                 # Mongoose models (User, Webhook, WebhookDelivery, etc.)
├── middleware/
│   ├── authMiddleware.js   # JWT verification
│   ├── rbacMiddleware.js   # Role-based access control
│   ├── requestId.js        # Attaches UUID to every request for log correlation
│   ├── recaptchaMiddleware.js
│   ├── planMiddleware.js   # Checks subscription plan limits
│   ├── securityHeaders.js
│   └── validate.js         # express-validator wrapper
├── utils/
│   ├── hashToken.js        # SHA-256 token hashing
│   ├── htmlEscape.js       # XSS prevention
│   ├── csvSanitize.js      # CSV injection prevention
│   ├── passwordValidator.js
│   └── slugGenerator.js
├── scripts/                # Standalone CLI tools (console.log allowed here)
│   ├── seed-plans.js
│   ├── migrate-roles.js
│   ├── security-audit.js
│   ├── create-subscription.js
│   └── test-api-keys.js
├── tests/                  # Jest test suite
│   ├── jest.setup.js       # Loads dotenv BEFORE any test module (critical)
│   ├── webhooks.test.js    # Integration: full webhook CRUD via supertest
│   ├── health.test.js      # Integration: health check endpoints
│   ├── logging.test.js
│   ├── error-delegation.test.js
│   └── ... (8 more test files)
├── .vscode/
│   ├── extensions.json     # Recommends ESLint, Prettier, TS extensions
│   └── settings.json       # formatOnSave + eslint.fixAll on save
├── eslint.config.js        # ESLint flat config (Prettier integrated)
├── .prettierrc             # Prettier config
├── jest.config.js          # Jest config with setupFiles → jest.setup.js
├── .husky/pre-commit       # Runs lint-staged before every commit
└── MASTER_PROMPT.md        # THIS FILE
```

---

## 4. COMPLETED WORK (HISTORY OF ALL SESSIONS)

### Session 1 — Conversation 3439138a (Apr 8)

**Phase 4 partial: API Hardening**

- Implemented pagination bounds on admin list endpoints
- Added CSV injection protection (`csvSanitize.js`)
- Cleaned up security headers
- Purged hardcoded config fallbacks

### Session 2 — Conversation a080bddc (Apr 8-17)

**Phase 4 complete: API Hardening**

- Implemented API key management system (`apiKeyService.js`, `apiKey.routes.js`)
- Atomic key rotation with SHA-256 hashing
- API key rate limiting and usage stats
- Created `scripts/test-api-keys.js` smoke test

### Session 3 — Conversation 08b64b55 (Apr 17)

**Phase 1 complete: Critical Security Fixes (from prior audit)**

- Fixed insecure OTP generation → `crypto.randomInt()`
- Fixed inconsistent token expiry (`VERIFICATION_TOKEN_EXPIRY`)
- Fixed email-based XSS via `htmlEscape.js`
- All fixes validated with TDD (RED → GREEN → REFACTOR)

### Session 4 — Conversation 9552d001 (Apr 17)

**Phase 2 complete: Error Architecture Standardization**

- Replaced ALL `console.*` with structured Winston `logger.error()` calls
- Unified error delegation across ALL controllers using `next(err)`
- Centralized error handler in `app.js`
- Tests added: `error-delegation.test.js`, `logging.test.js`

### Session 5 — THIS SESSION (Conversation e72edb89, Apr 26)

**Tooling & Infrastructure Hardening — COMPLETE**

- ✅ ESLint flat config with Prettier, `no-console`, `no-eval`, security rules
- ✅ lint-staged + Husky pre-commit hook (auto-format + lint on commit)
- ✅ `scripts/` ESLint override (CLI tools may use console.log)
- ✅ `tests/jest.setup.js` — loads dotenv before test modules
- ✅ `jest.config.js` — added `setupFiles`, `testTimeout: 30000`
- ✅ `MONGO_URI_TEST` added to `.env` → isolated `adv_backend_test` DB
- ✅ Fixed `WEBHOOK_SECRET_KEY` (had invalid hex char `i`) → new valid key generated
- ✅ `.vscode/extensions.json` + `.vscode/settings.json` for VS Code integration
- ✅ **All 92 tests passing** ✅

---

## 5. REMAINING HARDENING ROADMAP

This is the full audit plan. Items marked ✅ are DONE. Items marked ⬜ are TODO.

### PHASE 1 — Critical Security (4 items remaining)

| ID   | Item                                                       | File                                | Status  |
| ---- | ---------------------------------------------------------- | ----------------------------------- | ------- |
| S-01 | `requestId` trusts client `X-Request-Id` (log injection)   | `middleware/requestId.js`           | ⬜ TODO |
| S-02 | reCAPTCHA secret in URL query string (secret leakage)      | `middleware/recaptchaMiddleware.js` | ⬜ TODO |
| S-03 | No reCAPTCHA v3 score threshold check (bots bypass)        | `middleware/recaptchaMiddleware.js` | ⬜ TODO |
| S-04 | `config.js` no fail-fast for missing secrets in production | `config/config.js`                  | ⬜ TODO |

**S-01 Fix:**

```js
// middleware/requestId.js
const incoming = req.headers['x-request-id'];
const id =
  incoming &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(incoming)
    ? incoming
    : uuidv4();
```

**S-02 Fix:**

```js
// Use POST body, not query string
const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: `secret=${encodeURIComponent(config.RECAPTCHA_SECRET)}&response=${encodeURIComponent(recaptchaToken)}`,
});
```

**S-03 Fix:**

```js
if (!data.success || (data.score !== undefined && data.score < 0.5)) {
  return res.status(400).json({ message: 'reCAPTCHA verification failed' });
}
```

**S-04 Fix (add to bottom of config.js):**

```js
if (config.NODE_ENV === 'production') {
  const required = [
    'MONGO_URI',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
    'API_KEY_SALT',
    'BREVO_API_KEY',
    'RECAPTCHA_SECRET',
  ];
  const missing = required.filter((k) => !config[k]);
  if (missing.length)
    throw new Error(`FATAL: Missing required env vars in production: ${missing.join(', ')}`);
}
```

---

### PHASE 1 — Medium Security

| ID   | Item                                                   | File                            | Status  |
| ---- | ------------------------------------------------------ | ------------------------------- | ------- |
| S-05 | `X-XSS-Protection: 1` deprecated (use `0` + CSP)       | `middleware/securityHeaders.js` | ⬜ TODO |
| S-06 | `/google-login` has no `authLimiter` (only global)     | `routes/v1/auth.routes.js`      | ⬜ TODO |
| S-07 | `unsubscribeToken` in Subscriber model has no DB index | `models/Subscriber.js`          | ⬜ TODO |

---

### PHASE 2 — Reliability & Data Integrity

| ID   | Item                                                        | File                                               | Status  |
| ---- | ----------------------------------------------------------- | -------------------------------------------------- | ------- |
| R-01 | `signup` returns auth tokens for unverified re-signup users | `controllers/authController.js:56-82`              | ⬜ TODO |
| R-02 | `getSubscribers` + `getWaitlist` unbounded (OOM risk)       | `newsletterController.js`, `waitlistController.js` | ⬜ TODO |
| R-03 | Comment says "15min" but `VERIFICATION_TOKEN_EXPIRY` is 24h | `controllers/authController.js:53`                 | ⬜ TODO |
| R-04 | `blogController.getPosts` no pagination                     | `controllers/blogController.js`                    | ⬜ TODO |
| R-05 | `Waitlist.position` race condition on concurrent signup     | `controllers/waitlistController.js:23-26`          | ⬜ TODO |
| R-06 | `exportWaitlist` CSV missing UTF-8 BOM for Excel            | `controllers/waitlistController.js:76-83`          | ⬜ TODO |

**R-02 Fix pattern (apply to all unbounded queries):**

```js
const page = Math.max(1, parseInt(req.query.page) || 1);
const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
const skip = (page - 1) * limit;
const results = await Model.find({}).skip(skip).limit(limit).sort({ createdAt: -1 });
```

---

### PHASE 3 — Configuration Hardening

| ID   | Item                                                     | File                                      | Status  |
| ---- | -------------------------------------------------------- | ----------------------------------------- | ------- |
| C-01 | `WEBHOOK_SECRET_KEY` validated on first use, not startup | `services/webhookService.js`, `server.js` | ⬜ TODO |
| C-02 | `'unsafe-inline'` in CSP `scriptSrc` (pure JSON API)     | `app.js`                                  | ⬜ TODO |
| C-03 | `trust proxy 1` undocumented (document why it's correct) | `app.js`                                  | ⬜ TODO |

---

### PHASE 4 — Performance & Scalability

| ID   | Item                                                      | File                           | Status  |
| ---- | --------------------------------------------------------- | ------------------------------ | ------- |
| P-01 | `verificationToken` + `resetToken` missing DB indexes     | `models/User.js`               | ⬜ TODO |
| P-02 | `planMiddleware.checkLimit` does 2 DB queries per request | `middleware/planMiddleware.js` | ⬜ TODO |
| P-03 | `refreshTokens[]` array grows unbounded (cap at 10)       | `models/User.js`               | ⬜ TODO |
| P-04 | `WebhookDelivery` has no TTL index (grows forever)        | `models/WebhookDelivery.js`    | ⬜ TODO |

**P-01 Fix:**

```js
// models/User.js
userSchema.index({ verificationToken: 1 }, { sparse: true });
userSchema.index({ resetToken: 1 }, { sparse: true });
```

**P-03 Fix:**

```js
// Before pushing new refresh token in authController
if (user.refreshTokens.length >= 10) {
  user.refreshTokens.sort((a, b) => a.createdAt - b.createdAt);
  user.refreshTokens.shift();
}
```

**P-04 Fix:**

```js
// models/WebhookDelivery.js
webhookDeliverySchema.index({ deliveredAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });
```

---

### PHASE 5 — Code Quality

| ID   | Item                                                | File                                                                       | Status  |
| ---- | --------------------------------------------------- | -------------------------------------------------------------------------- | ------- |
| Q-01 | Duplicate `validationResult` check in controllers   | `contactController.js`, `newsletterController.js`, `waitlistController.js` | ⬜ TODO |
| Q-02 | Missing 404 catch-all route in `app.js`             | `app.js`                                                                   | ⬜ TODO |
| Q-03 | `slugGenerator` produces non-unique slugs           | `utils/slugGenerator.js`                                                   | ⬜ TODO |
| Q-04 | `rbacMiddleware` has duplicate step "2" in comments | `middleware/rbacMiddleware.js`                                             | ⬜ TODO |

**Q-02 Fix (add before error handler in app.js):**

```js
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});
```

**Q-03 Fix:**

```js
const crypto = require('crypto');
const generateSlug = (title) => {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return `${base}-${crypto.randomBytes(3).toString('hex')}`;
};
```

---

### PHASE 6 — Test Coverage

| ID   | Item                                                                         | Status  |
| ---- | ---------------------------------------------------------------------------- | ------- |
| T-01 | Full auth flow integration test (signup → verify → login → refresh → logout) | ⬜ TODO |
| T-02 | Negative webhook decrypt tests (tampered IV, auth tag, truncated ciphertext) | ⬜ TODO |
| T-03 | Graceful shutdown sequence test                                              | ⬜ TODO |

---

## 6. CURRENT STATE SNAPSHOT

| Metric                  | Status                                           |
| ----------------------- | ------------------------------------------------ |
| Tests                   | **92/92 passing** ✅                             |
| Lint                    | **0 errors, 0 warnings** ✅                      |
| Formatting              | **Prettier configured + auto-runs on commit** ✅ |
| Pre-commit hook         | **Husky + lint-staged active** ✅                |
| VS Code integration     | **formatOnSave + eslint fixAll** ✅              |
| Critical security fixes | **4 remaining (S-01 to S-04)** ⬜                |
| WEBHOOK_SECRET_KEY      | **Fixed locally — update on Render!** ⚠️         |

---

## 7. KEY COMMANDS REFERENCE

```bash
# Run all tests
npm test -- --forceExit

# Run single test file
npm test -- --testPathPattern="webhooks" --forceExit

# Lint check
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Format all files
npm run format

# Check formatting without writing
npm run format:check

# Start dev server
npm run dev

# Seed subscription plans
node scripts/seed-plans.js

# Security audit
node scripts/security-audit.js

# Rotate API keys smoke test
node scripts/test-api-keys.js
```

---

## 8. OPEN DECISIONS (answer before executing)

1. **R-01 (unverified signup tokens):** Should we remove BOTH `accessToken` and `refreshToken` from the re-signup response, or keep `accessToken` for the Flutter app's "pending verification" screen?
2. **P-03 (session cap):** Is 10 concurrent sessions per user OK, or do you need more for multi-device use?

---

## 9. AGENT OPERATING MODE

- **Always use TDD:** Write the failing test FIRST, then implement the fix, then verify GREEN.
- **Never skip tests:** Run `npm test -- --forceExit` before AND after every change.
- **Never skip lint:** Run `npm run lint` after every code change.
- **Commit after each phase:** Don't let work pile up uncommitted.
- **Follow existing patterns:** Look at how other controllers/middlewares are written before adding new code.
- **Winston, not console:** All logging goes through `logger` from `config/logger.js`. Never `console.log` in app code.
- **Centralized errors:** All errors go through `next(err)` to the centralized error handler in `app.js`.
- **Read files before editing:** Always view the current file before making changes to avoid overwriting existing logic.

---

## 10. NEXT IMMEDIATE ACTIONS (start here next session)

1. ⚠️ **Update `WEBHOOK_SECRET_KEY` on Render** to `61b1ec68fe6eb0b1f54c57a9308495bd658788d5137b7332c3c822c0ee88b237`
2. 🔴 **Fix S-01:** `middleware/requestId.js` — validate X-Request-Id format
3. 🔴 **Fix S-02:** `middleware/recaptchaMiddleware.js` — move secret to POST body
4. 🔴 **Fix S-03:** `middleware/recaptchaMiddleware.js` — add score threshold check
5. 🔴 **Fix S-04:** `config/config.js` — add production fail-fast validator
6. 🟡 **Fix S-05:** `middleware/securityHeaders.js` — set `X-XSS-Protection: 0`
7. 🟡 **Fix S-06:** `routes/v1/auth.routes.js` — add `authLimiter` to `/google-login`
8. Run `npm test -- --forceExit` → all 92 must stay green
9. Commit: `git commit -m "phase 1: critical security hardening S-01 to S-06"`

═══════════════════════════════════════════════════════════════════
