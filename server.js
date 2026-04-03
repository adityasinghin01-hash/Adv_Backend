// server.js
// Entry point — binds port FIRST, then connects DB, handles graceful shutdown.
// Fixes B-23 (listen before DB), B-24 (bind to 0.0.0.0), B-25 (retry logic in db.js).

const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const connectDB = require('./config/db');
const logger = require('./config/logger');

// ── Start Server ─────────────────────────────────────────────
// CRITICAL: Listen BEFORE DB connect — Render needs an open port within ~15s.
const server = app.listen(config.PORT, '0.0.0.0', () => {
    logger.info(`🚀 Server running in ${config.NODE_ENV} mode on port ${config.PORT}`);

    // Connect to MongoDB AFTER port is open
    connectDB();
});

// ── Graceful Shutdown ────────────────────────────────────────
// Fixes B-24: old version had no shutdown handler — process died mid-request.
const gracefulShutdown = async (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);

    server.close(() => {
        logger.info('HTTP server closed.');
        mongoose.connection.close(false).then(() => {
            logger.info('MongoDB connection closed.');
            process.exit(0);
        });
    });

    // Force exit after 10s if graceful shutdown hangs
    setTimeout(() => {
        logger.error('Forced shutdown after timeout.');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ── Unhandled Errors ─────────────────────────────────────────
process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection:', { reason: reason?.message || reason });
    // Let the process crash so Render auto-restarts it
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', { error: error.message, stack: error.stack });
    process.exit(1);
});

