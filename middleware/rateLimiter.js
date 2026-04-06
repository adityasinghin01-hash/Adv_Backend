// middleware/rateLimiter.js

const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');
const { Ratelimit } = require('@upstash/ratelimit');
const { Redis } = require('@upstash/redis');
const logger = require('../config/logger');

let useRedis = false;
let upstashLimiters = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  useRedis = true;
  upstashLimiters = {
    global: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(200, '15 m'), prefix: 'rl:global' }),
    auth:   new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10,  '15 m'), prefix: 'rl:auth'   }),
    strict: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20,  '15 m'), prefix: 'rl:strict' }),
    api:    new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(1000, '15 m'), prefix: 'rl:api'    }),
  };
  logger.info('Rate limiter: using Upstash Redis');
} else {
  logger.warn('Rate limiter: falling back to in-memory store');
}

const makeRedisMiddleware = (limiterKey, fallbackMax, windowMs, keyGenerator = ipKeyGenerator) => {
  const fallback = rateLimit({
    windowMs,
    max: fallbackMax,
    keyGenerator: keyGenerator,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please try again later.' },
  });

  if (!useRedis) return fallback;

  return async (req, res, next) => {
    try {
      const identifier = keyGenerator(req);
      const { success, limit, remaining, reset } = await upstashLimiters[limiterKey].limit(identifier);
      res.setHeader('RateLimit-Limit', limit);
      res.setHeader('RateLimit-Remaining', remaining);
      res.setHeader('RateLimit-Reset', new Date(reset).toISOString());
      if (!success) {
        logger.warn({ message: 'Rate limit exceeded', identifier, url: req.originalUrl });
        return res.status(429).json({ success: false, message: 'Too many requests. Please try again later.' });
      }
      next();
    } catch (err) {
      logger.error({ message: 'Upstash error', error: err.message });
      next();
    }
  };
};

const globalLimiter = makeRedisMiddleware('global', 200, 15 * 60 * 1000);
const authLimiter   = makeRedisMiddleware('auth',   10,  15 * 60 * 1000);
const strictLimiter = makeRedisMiddleware('strict', 20,  15 * 60 * 1000);

// API Limiter tracking by X-API-Key header, query param, or fallback to IP
const apiLimiter    = makeRedisMiddleware('api', 1000, 15 * 60 * 1000, (req) => {
    return req.header('X-API-Key') || req.query.apiKey || ipKeyGenerator(req);
});

module.exports = { globalLimiter, authLimiter, strictLimiter, apiLimiter };
