// services/webhookService.js
// Core webhook engine — emit events, dispatch with retries, sign payloads.
// Uses only Node.js stdlib (crypto, https) — no external HTTP or queue packages.

const crypto = require('crypto');
const https = require('https');
const { URL } = require('url');
const Webhook = require('../models/Webhook');
const WebhookDelivery = require('../models/WebhookDelivery');
const logger = require('../config/logger');

const DISPATCH_TIMEOUT = 10000; // 10 seconds
const MAX_ATTEMPTS = 4;
const RETRY_DELAYS = [30000, 60000, 300000]; // 30s, 60s, 5min

// ── Helpers ──────────────────────────────────────────────

/**
 * Generate a random 32-byte hex string — the raw secret shown once to the user.
 */
const generateSecret = () => crypto.randomBytes(32).toString('hex');

/**
 * Hash a raw secret with SHA-256 for secure storage.
 */
const hashSecret = (rawSecret) =>
  crypto.createHash('sha256').update(rawSecret).digest('hex');

// ── Core ─────────────────────────────────────────────────

/**
 * Emit a webhook event to all matching active endpoints for a user.
 * Fire-and-forget — does NOT block the caller.
 *
 * @param {string} event   - One of the WEBHOOK_EVENTS values
 * @param {object} payload - The event data to send
 * @param {string} userId  - Owner of the webhooks
 */
const emit = async (event, payload, userId) => {
  try {
    const webhooks = await Webhook.find({
      userId,
      isActive: true,
      events: event,
    });

    logger.info(`Webhook emit: ${event} → ${webhooks.length} endpoint(s) found`, {
      event,
      userId,
      endpointCount: webhooks.length,
    });

    for (const webhook of webhooks) {
      // Fire and forget — do NOT await
      dispatchWithRetry(webhook, event, payload).catch((err) => {
        logger.error('Webhook dispatchWithRetry unexpected error', {
          webhookId: webhook._id,
          event,
          error: err.message,
        });
      });
    }
  } catch (err) {
    logger.error('Webhook emit failed', { event, userId, error: err.message });
  }
};

/**
 * Dispatch a single webhook delivery with retry on failure.
 *
 * @param {object} webhook  - Webhook document from MongoDB
 * @param {string} event    - Event name
 * @param {object} payload  - Event data
 * @param {number} attempt  - Current attempt number (1-indexed)
 */
const dispatchWithRetry = async (webhook, event, payload, attempt = 1) => {
  const deliveryId = crypto.randomUUID();
  const body = JSON.stringify({
    event,
    createdAt: new Date().toISOString(),
    data: payload,
  });

  // HMAC-SHA256 signature using the stored hashed secret
  const signature = crypto
    .createHmac('sha256', webhook.secret)
    .update(body)
    .digest('hex');

  const url = new URL(webhook.url);
  const options = {
    method: 'POST',
    hostname: url.hostname,
    port: url.port || 443,
    path: url.pathname + url.search,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      'X-Webhook-Signature': `sha256=${signature}`,
      'X-Webhook-ID': String(webhook._id),
      'X-Delivery-ID': deliveryId,
    },
    timeout: DISPATCH_TIMEOUT,
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let chunks = '';
      res.on('data', (d) => (chunks += d));
      res.on('end', async () => {
        const isSuccess = res.statusCode >= 200 && res.statusCode < 300;
        const truncatedBody = chunks.slice(0, 1000);

        try {
          await WebhookDelivery.create({
            webhookId: webhook._id,
            userId: webhook.userId,
            event,
            payload,
            responseStatus: res.statusCode,
            responseBody: truncatedBody,
            attempt,
            success: isSuccess,
            deliveredAt: new Date(),
          });
        } catch (dbErr) {
          logger.error('Failed to save WebhookDelivery', { error: dbErr.message });
        }

        if (isSuccess) {
          logger.info('Webhook delivered successfully', {
            webhookId: webhook._id,
            event,
            deliveryId,
            attempt,
            status: res.statusCode,
          });
        } else {
          logger.warn('Webhook delivery failed (non-2xx)', {
            webhookId: webhook._id,
            event,
            deliveryId,
            attempt,
            status: res.statusCode,
          });
          scheduleRetry(webhook, event, payload, attempt);
        }
        resolve();
      });
    });

    req.on('timeout', () => {
      req.destroy(new Error('Webhook request timed out'));
    });

    req.on('error', async (err) => {
      try {
        await WebhookDelivery.create({
          webhookId: webhook._id,
          userId: webhook.userId,
          event,
          payload,
          error: err.message,
          attempt,
          success: false,
          deliveredAt: new Date(),
        });
      } catch (dbErr) {
        logger.error('Failed to save WebhookDelivery', { error: dbErr.message });
      }

      logger.warn('Webhook delivery failed (network error)', {
        webhookId: webhook._id,
        event,
        deliveryId,
        attempt,
        error: err.message,
      });
      scheduleRetry(webhook, event, payload, attempt);
      resolve();
    });

    req.write(body);
    req.end();
  });
};

/**
 * Schedule a retry via setTimeout if attempts remain.
 */
const scheduleRetry = (webhook, event, payload, currentAttempt) => {
  if (currentAttempt >= MAX_ATTEMPTS) {
    logger.error('Webhook delivery exhausted all retries', {
      webhookId: webhook._id,
      event,
      totalAttempts: currentAttempt,
    });
    return;
  }

  const delay = RETRY_DELAYS[currentAttempt - 1] || RETRY_DELAYS[RETRY_DELAYS.length - 1];
  const nextAttempt = currentAttempt + 1;
  const nextRetryAt = new Date(Date.now() + delay);

  logger.info('Webhook retry scheduled', {
    webhookId: webhook._id,
    event,
    nextAttempt,
    delayMs: delay,
    nextRetryAt: nextRetryAt.toISOString(),
  });

  setTimeout(() => {
    dispatchWithRetry(webhook, event, payload, nextAttempt).catch((err) => {
      logger.error('Webhook retry unexpected error', {
        webhookId: webhook._id,
        event,
        attempt: nextAttempt,
        error: err.message,
      });
    });
  }, delay);
};

module.exports = {
  emit,
  dispatchWithRetry,
  generateSecret,
  hashSecret,
};
