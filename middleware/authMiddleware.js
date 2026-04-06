// middleware/authMiddleware.js
// JWT access token verification — attaches full DB user to req.user.
// Supports automatic fallback to API Key authentication for external integrations.

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');
const apiKeyMiddleware = require('./apiKeyMiddleware');

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Fallback: If no Bearer token is provided, check for API Key
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const rawKey = req.header('X-API-Key') || req.query.apiKey;
        if (rawKey) {
            // Delegate auth entirely to API key middleware
            return apiKeyMiddleware()(req, res, next);
        }
        return res.status(401).json({ message: 'Unauthorized — no Bearer token or API key provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET);

        // Fetch FULL user from DB — not stale JWT payload
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized — user not found' });
        }

        req.user = user; // Full Mongoose document, not JWT payload
        req.authType = 'jwt'; // Explicitly mark the auth context
        
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized — invalid token' });
    }
};

module.exports = { protect };
