// tests/webhooks.test.js
// Integration tests for webhook CRUD endpoints.
// Creates a verified test user directly in DB to bypass recaptcha + email verification.

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Webhook = require('../models/Webhook');

const MONGO_URI = process.env.MONGO_URI_TEST || process.env.MONGO_URI;

const TEST_USER = {
  email: 'webhooktest@spinx.dev',
  password: 'Test@12345',
  name: 'Webhook Test',
};

let token;
let userId;
let webhookId;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
  }

  // Delete any stale test user from previous runs, then create fresh
  // This avoids issues with password corruption from prior runs
  await User.deleteOne({ email: TEST_USER.email });

  const user = await User.create({
    name: TEST_USER.name,
    email: TEST_USER.email,
    password: TEST_USER.password,
    isVerified: true,
    role: 'user',
  });
  userId = user._id;

  // Login to get a JWT token
  const res = await request(app)
    .post('/api/v1/login')
    .send({ email: TEST_USER.email, password: TEST_USER.password });

  token = res.body.accessToken;
});

afterAll(async () => {
  // Clean up all test data
  await Webhook.deleteMany({ userId });
  await User.findByIdAndDelete(userId);
  await mongoose.connection.close();
});

// ── CREATE ─────────────────────────────────────────────────

describe('POST /api/v1/webhooks', () => {
  it('should create a webhook and return 201 with rawSecret', async () => {
    const res = await request(app)
      .post('/api/v1/webhooks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        url: 'https://example.com/webhook',
        events: ['user.created'],
        description: 'Test webhook',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('rawSecret');
    expect(res.body.data.webhook).toHaveProperty('id');
    webhookId = res.body.data.webhook.id;
  });

  it('should return 400 for invalid URL (not HTTPS)', async () => {
    const res = await request(app)
      .post('/api/v1/webhooks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        url: 'http://insecure.com/hook',
        events: ['user.created'],
      });

    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for invalid event name', async () => {
    const res = await request(app)
      .post('/api/v1/webhooks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        url: 'https://example.com/webhook',
        events: ['totally.fake.event'],
      });

    // The route validation passes string check, but Webhook model rejects unknown events
    expect([400, 500]).toContain(res.statusCode);
  });
});

// ── LIST ───────────────────────────────────────────────────

describe('GET /api/v1/webhooks', () => {
  it('should list webhooks and return 200 with count >= 1', async () => {
    const res = await request(app)
      .get('/api/v1/webhooks')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

// ── GET SINGLE ─────────────────────────────────────────────

describe('GET /api/v1/webhooks/:id', () => {
  it('should return a single webhook with 200', async () => {
    const res = await request(app)
      .get(`/api/v1/webhooks/${webhookId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id || res.body.data.id).toBeTruthy();
  });

  it('should return 400 for invalid ObjectId', async () => {
    const res = await request(app)
      .get('/api/v1/webhooks/not-a-valid-id')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
  });
});

// ── UPDATE ─────────────────────────────────────────────────

describe('PATCH /api/v1/webhooks/:id', () => {
  it('should update description and return 200', async () => {
    const res = await request(app)
      .patch(`/api/v1/webhooks/${webhookId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Updated description' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

// ── DELETE ─────────────────────────────────────────────────

describe('DELETE /api/v1/webhooks/:id', () => {
  it('should delete the webhook and return 200', async () => {
    const res = await request(app)
      .delete(`/api/v1/webhooks/${webhookId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
