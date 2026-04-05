// models/Plan.js
// Plan schema for the subscription system.
// Defines plan tiers, pricing, features, and resource limits.

const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            enum: ['free', 'pro', 'enterprise'],
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        displayName: {
            type: String,
            required: true,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        currency: {
            type: String,
            default: 'USD',
            uppercase: true,
        },

        billingPeriod: {
            type: String,
            enum: ['monthly', 'yearly', 'lifetime'],
            default: 'monthly',
        },

        features: {
            type: [String],
            default: [],
        },

        limits: {
            apiCallsPerMonth: { type: Number, required: true },  // -1 = unlimited
            maxApiKeys:       { type: Number, required: true },
            webhooksAllowed:  { type: Number, required: true },  // -1 = unlimited
            storageGB:        { type: Number, required: true },
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;
