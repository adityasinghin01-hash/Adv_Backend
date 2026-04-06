// controllers/apiKeyController.js
// Handles API Key lifecycle: generation, listing, revoking, and rotating.

const ApiKey = require('../models/ApiKey');
const { createApiKey, rotateApiKey } = require('../services/apiKeyService');
const logger = require('../config/logger');

/**
 * @desc    Create a new API Key
 * @route   POST /api/v1/apikeys
 * @access  Private (JWT)
 */
exports.createKey = async (req, res, next) => {
    try {
        const { name, scopes } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'API Key name is required.' });
        }

        // Service handles plan limit enforcement and secure generation
        const { rawKey, apiKeyDoc } = await createApiKey(req.user.id, name, scopes);

        res.status(201).json({
            success: true,
            // SECURITY: Explicitly warn user that raw key is only shown once
            message: 'API Key created successfully. Please save the raw string; it will not be shown again.',
            data: {
                rawKey,
                key: {
                    id: apiKeyDoc._id,
                    name: apiKeyDoc.name,
                    keyPrefix: apiKeyDoc.keyPrefix,
                    scopes: apiKeyDoc.scopes,
                    expiresAt: apiKeyDoc.expiresAt,
                    createdAt: apiKeyDoc.createdAt,
                    isActive: apiKeyDoc.isActive,
                }
            }
        });
    } catch (error) {
        logger.error('Error creating API key:', error);
        next(error);
    }
};

/**
 * @desc    List all active keys for the user (masked)
 * @route   GET /api/v1/apikeys
 * @access  Private (JWT)
 */
exports.listKeys = async (req, res, next) => {
    try {
        // Only return active keys and explicitly strip the hash
        const keys = await ApiKey.find({ userId: req.user.id, isActive: true })
            .select('-keyHash -__v')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: keys.length,
            data: keys
        });
    } catch (error) {
        logger.error('Error listing API keys:', error);
        next(error);
    }
};

/**
 * @desc    Revoke (deactivate) an API key
 * @route   DELETE /api/v1/apikeys/:id
 * @access  Private (JWT)
 */
exports.revokeKey = async (req, res, next) => {
    try {
        const { id } = req.params;

        const apiKey = await ApiKey.findOne({ _id: id, userId: req.user.id, isActive: true });
        if (!apiKey) {
            return res.status(404).json({ success: false, message: 'API Key not found or already inactive.' });
        }

        apiKey.isActive = false;
        await apiKey.save();

        res.status(200).json({
            success: true,
            message: 'API Key revoked successfully.'
        });
    } catch (error) {
        logger.error('Error revoking API key:', error);
        next(error);
    }
};

/**
 * @desc    Rotate an existing API key (Revoke old + Generate new identically configured key)
 * @route   POST /api/v1/apikeys/:id/rotate
 * @access  Private (JWT)
 */
exports.rotateKey = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Service handles atomic transaction to prevent orphaned key invalidation
        const { rawKey, newApiKeyDoc } = await rotateApiKey(req.user.id, id);

        res.status(200).json({
            success: true,
            message: 'API Key rotated successfully. The previous key has been revoked.',
            data: {
                rawKey, // Returned exactly once
                key: {
                    id: newApiKeyDoc._id,
                    name: newApiKeyDoc.name,
                    keyPrefix: newApiKeyDoc.keyPrefix,
                    scopes: newApiKeyDoc.scopes,
                    createdAt: newApiKeyDoc.createdAt,
                    isActive: newApiKeyDoc.isActive,
                }
            }
        });
    } catch (error) {
        logger.error('Error rotating API key:', error);
        next(error);
    }
};
