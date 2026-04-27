// models/Subscriber.js
const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    unsubscribeToken: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// S-07 FIX: Index unsubscribeToken for O(1) unsubscribe lookups.
// Without this, every unsubscribe link click causes a full collection scan.
// sparse: true avoids null-key index entries (token is always set, but safe).
subscriberSchema.index({ unsubscribeToken: 1 }, { sparse: true });

module.exports = mongoose.model('Subscriber', subscriberSchema);
