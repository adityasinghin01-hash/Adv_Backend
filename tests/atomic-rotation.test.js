// tests/atomic-rotation.test.js
// TDD RED: Verifies refresh token rotation uses a single atomic DB operation,
// not two separate findByIdAndUpdate calls.

const fs = require('fs');
const path = require('path');

const AUTH_CONTROLLER_PATH = path.join(__dirname, '..', 'controllers', 'authController.js');

describe('Refresh Token Rotation — Atomic Operation Check', () => {
  let source;

  beforeAll(() => {
    source = fs.readFileSync(AUTH_CONTROLLER_PATH, 'utf-8');
  });

  test('refreshToken function must NOT have two separate findByIdAndUpdate calls for $pull and $push', () => {
    // Extract the refreshToken function body
    const fnStart = source.indexOf('const refreshToken = async');
    const fnEnd = source.indexOf('module.exports');
    const fnBody = source.slice(fnStart, fnEnd);

    // Count findByIdAndUpdate calls within the refreshToken function
    const matches = fnBody.match(/findByIdAndUpdate/g);

    // Should be exactly 1 atomic call (not 2 separate ones)
    expect(matches).toBeTruthy();
    expect(matches.length).toBe(1);
  });

  test('atomic update must use aggregation pipeline syntax (array argument)', () => {
    // The atomic operation should use pipeline syntax: findByIdAndUpdate(id, [ ... ])
    // or use $concatArrays / $filter pattern
    const fnStart = source.indexOf('const refreshToken = async');
    const fnEnd = source.indexOf('module.exports');
    const fnBody = source.slice(fnStart, fnEnd);

    // Should contain $filter (for removing old token) in the atomic update
    expect(fnBody).toMatch(/\$filter/);
  });
});
