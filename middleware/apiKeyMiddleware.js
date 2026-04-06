// middleware/apiKeyMiddleware.js
// Securely authenticates API requests via key, matching JWT behavior for downstream controllers.

const crypto = require('crypto');
const ApiKey = require('../models/ApiKey');
const User = require('../models/User');
const config = require('../config/config');
const logger = require('../config/logger');

/**
 * Validates incoming API key, checks scopes, and attaches the user.
 * Built as a factory to optionally require certain scopes.
 */
const apiKeyMiddleware = (requiredScope = null) => {
    return async (req, res, next) => {
        try {
            // Extract key from header or URL parameter (header is preferred)
            const rawKey = req.header('X-API-Key') || req.query.apiKey;

            if (!rawKey) {
                return res.status(401).json({
                    success: false,
                    message: 'Access denied. No API key provided.',
                });
            }

            // HMAC SHA-256 for secure comparison against DB
            const hash = crypto
                .createHmac('sha256', config.API_KEY_SALT || 'fallback_salt_value')
                .update(rawKey)
                .digest('hex');

            // Find key and verify it's active
            const apiKeyDoc = await ApiKey.findOne({ keyHash: hash, isActive: true });

            if (!apiKeyDoc) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid or inactive API key.',
                });
            }

            // Validate key expiration
            if (apiKeyDoc.expiresAt && apiKeyDoc.expiresAt < new Date()) {
                return res.status(401).json({
                    success: false,
                    message: 'API key has expired.',
                });
            }

            // Verify requested scope vs key scopes
            if (requiredScope && !apiKeyDoc.scopes.includes(requiredScope)) {
                return res.status(403).json({
                    success: false,
                    message: `Forbidden. Custom API key scope required: ${requiredScope}`,
                });
            }

            // Ensure the user account exists and is not banned
            const user = await User.findById(apiKeyDoc.userId);
            if (!user || user.isBanned) {
                return res.status(403).json({
                    success: false,
                    message: 'User account is inactive or banned.',
                });
            }

            // Attach identical JWT-style object so controllers don't break
            req.user = user;
            req.apiKey = apiKeyDoc;
            req.authType = 'apikey';

            // Proceed to the next middleware/controller
            next();

            // Fire-and-forget: background usage stats mapping immediately
            ApiKey.updateOne(
                { _id: apiKeyDoc._id },
                {
                    $inc: { usageCount: 1 },
                    $set: { lastUsedAt: new Date() },
                }
            ).catch(err => logger.error(`Failed to update API key stats for ID ${apiKeyDoc._id}:`, err));

        } catch (error) {
            logger.error('API Key Middleware Error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error during API key authentication.',
            });
        }
    };
};

module.exports = apiKeyMiddleware;
