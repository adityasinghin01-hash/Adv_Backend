// services/subscriptionService.js
// Core subscription business logic: default plan assignment, limit enforcement, usage tracking.

const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');
const logger = require('../config/logger');

/**
 * Creates a default free subscription for a newly registered user.
 * Called during signup (authController).
 * @param {string} userId - The MongoDB ObjectId of the new user.
 * @returns {Object} The created subscription document.
 */
const createDefaultFreeSubscription = async (userId) => {
    const freePlan = await Plan.findOne({ name: 'free', isActive: true });

    if (!freePlan) {
        logger.error('Free plan not found in database — cannot assign default subscription.');
        throw new Error('Free plan not configured. Please run the seed-plans script.');
    }

    // Check if user already has an active subscription (idempotent)
    const existing = await Subscription.findOne({ userId, status: 'active' });
    if (existing) {
        logger.info(`User ${userId} already has an active subscription — skipping default assignment.`);
        return existing;
    }

    const now = new Date();
    const subscription = await Subscription.create({
        userId,
        planId: freePlan._id,
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
        cancelAtPeriodEnd: false,
        usage: { apiCalls: 0, storage: 0 },
    });

    logger.info(`Default free subscription created for user ${userId}`);
    return subscription;
};

/**
 * Checks if a user's usage is within their plan limit for a given key.
 * @param {string} userId - The user's MongoDB ObjectId.
 * @param {string} limitKey - The limit to check (e.g., 'apiCallsPerMonth').
 * @returns {{ allowed: boolean, currentUsage: number, limit: number }}
 */
const enforceLimit = async (userId, limitKey) => {
    const subscription = await Subscription.findOne({
        userId,
        status: 'active',
    }).populate('planId');

    if (!subscription || !subscription.planId) {
        return { allowed: false, currentUsage: 0, limit: 0, reason: 'No active subscription' };
    }

    const limit = subscription.planId.limits[limitKey];

    // -1 = unlimited
    if (limit === -1) {
        return { allowed: true, currentUsage: 0, limit: -1 };
    }

    const usageMap = {
        apiCallsPerMonth: subscription.usage.apiCalls,
    };

    const currentUsage = usageMap[limitKey] ?? 0;

    return {
        allowed: currentUsage < limit,
        currentUsage,
        limit,
        remaining: Math.max(0, limit - currentUsage),
    };
};

/**
 * Increments a usage counter for the user's active subscription.
 * @param {string} userId - The user's MongoDB ObjectId.
 * @param {string} usageKey - The usage field to increment (e.g., 'apiCalls', 'storage').
 * @param {number} [amount=1] - The amount to increment by.
 * @returns {Object|null} The updated subscription or null if not found.
 */
const trackUsage = async (userId, usageKey, amount = 1) => {
    const updateField = `usage.${usageKey}`;

    const subscription = await Subscription.findOneAndUpdate(
        { userId, status: 'active' },
        { $inc: { [updateField]: amount } },
        { new: true }
    );

    if (!subscription) {
        logger.warn(`trackUsage: No active subscription found for user ${userId}`);
        return null;
    }

    return subscription;
};

module.exports = {
    createDefaultFreeSubscription,
    enforceLimit,
    trackUsage,
};
