// tests/jest.setup.js
// Loads .env before any test module is evaluated so that
// process.env.MONGO_URI_TEST (and all other env vars) are available.
require('dotenv').config();
