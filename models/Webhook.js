// models/Webhook.js
// Stores registered webhook endpoints. Secrets are stored as HMAC hashes — never in plaintext.

const mongoose = require('mongoose');
const { VALID_EVENTS } = require('../config/webhookEvents');

const webhookSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    url: {
      type: String,
      required: [true, 'Webhook URL is required.'],
      validate: {
        validator: (v) => /^https:\/\/.+/.test(v),
        message: 'Webhook URL must use HTTPS.',
      },
    },
    events: {
      type: [String],
      required: [true, 'At least one event is required.'],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'Events array must contain at least one event.',
      },
    },
    secret: {
      type: String,
      required: [true, 'Webhook secret is required.'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      maxlength: [255, 'Description cannot exceed 255 characters.'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook: validate every event against the canonical VALID_EVENTS set
webhookSchema.pre('save', async function () {
  const invalidEvents = this.events.filter((e) => !VALID_EVENTS.has(e));
  if (invalidEvents.length > 0) {
    const err = new mongoose.Error.ValidationError(this);
    err.message = `Invalid webhook event(s): ${invalidEvents.join(', ')}`;
    throw err;
  }
});

// Compound index for fast lookups of active webhooks per user
webhookSchema.index({ userId: 1, isActive: 1 });

const Webhook = mongoose.model('Webhook', webhookSchema);

module.exports = Webhook;
