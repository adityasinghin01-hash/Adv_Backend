// middleware/planMiddleware.js
// Middleware to enforce plan-based access control and usage limits.
// MUST be executed after authMiddleware.js.

const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');
const logger = require('../config/logger');

/**
 * Middleware factory that restricts access to users on specific plans.
 * @param {...string} allowedPlans - Plan names that are allowed (e.g., 'pro', 'enterprise').
 */
const requirePlan = (...allowedPlans) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            const subscription = await Subscription.findOne({
                userId: req.user.id,
                status: 'active',
            }).populate('planId');

            if (!subscription || !subscription.planId) {
                logger.warn(`Plan check failed: No active subscription for user ${req.user.id}`);
                return res.status(403).json({
                    success: false,
                    message: 'No active subscription found. Please subscribe to a plan.',
                });
            }

            if (!allowedPlans.includes(subscription.planId.name)) {
                logger.warn(`Plan check failed: User ${req.user.id} on '${subscription.planId.name}' plan — requires [${allowedPlans.join(', ')}]`);
                return res.status(403).json({
                    success: false,
                    message: `This feature requires a ${allowedPlans.join(' or ')} plan.`,
                    currentPlan: subscription.planId.name,
                });
            }

            // Attach subscription and plan to request for downstream use
            req.subscription = subscription;
            req.plan = subscription.planId;
            next();
        } catch (err) {
            logger.error('Error in requirePlan middleware:', err);
            next(err);
        }
    };
};

/**
 * Middleware factory that checks if a user has exceeded a specific plan limit.
 * @param {string} limitKey - The limit to check (e.g., 'apiCallsPerMonth', 'maxApiKeys', 'webhooksAllowed').
 */
const checkLimit = (limitKey) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            const subscription = await Subscription.findOne({
                userId: req.user.id,
                status: 'active',
            }).populate('planId');

            if (!subscription || !subscription.planId) {
                return res.status(403).json({
                    success: false,
                    message: 'No active subscription found.',
                });
            }

            const plan = subscription.planId;
            const limit = plan.limits[limitKey];

            // -1 means unlimited
            if (limit === -1) {
                req.subscription = subscription;
                req.plan = plan;
                return next();
            }

            // Map limitKey to the corresponding usage field
            const usageMap = {
                apiCallsPerMonth: subscription.usage.apiCalls,
                maxApiKeys: null,       // checked at creation time, not via usage counter
                webhooksAllowed: null,   // checked at creation time, not via usage counter
            };

            const currentUsage = usageMap[limitKey];

            // For count-based limits (apiKeys, webhooks), skip — they are checked at resource creation
            if (currentUsage === null || currentUsage === undefined) {
                req.subscription = subscription;
                req.plan = plan;
                return next();
            }

            if (currentUsage >= limit) {
                logger.warn(`Limit exceeded: User ${req.user.id} hit ${limitKey} limit (${currentUsage}/${limit})`);
                return res.status(429).json({
                    success: false,
                    message: `Plan limit reached for ${limitKey}. Please upgrade your plan.`,
                    limit,
                    currentUsage,
                    currentPlan: plan.name,
                });
            }

            req.subscription = subscription;
            req.plan = plan;
            next();
        } catch (err) {
            logger.error('Error in checkLimit middleware:', err);
            next(err);
        }
    };
};

module.exports = { requirePlan, checkLimit };
