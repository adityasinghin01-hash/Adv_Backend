// routes/v1/index.js
// Central v1 API router — mounts all versioned route modules.
// Mounted at /api/v1 in app.js.
// Health check stays unversioned at /api/health (for Render probe).

const express = require('express');
const router = express.Router();

// ── Auth ─────────────────────────────────────────────────
router.use('/', require('./auth.routes'));

// ── Verification ─────────────────────────────────────────
router.use('/', require('./verification.routes'));

// ── Password ─────────────────────────────────────────────
router.use('/password', require('./password.routes'));

// ── User (protected) ────────────────────────────────────
router.use('/', require('./user.routes'));

// ── Contact ──────────────────────────────────────────────
router.use('/contact', require('./contact.routes'));

// ── Newsletter ───────────────────────────────────────────
router.use('/newsletter', require('./newsletter.routes'));

// ── Waitlist ─────────────────────────────────────────────
router.use('/waitlist', require('./waitlist.routes'));

// ── Blog ─────────────────────────────────────────────────
router.use('/blog', require('./blog.routes'));

module.exports = router;
