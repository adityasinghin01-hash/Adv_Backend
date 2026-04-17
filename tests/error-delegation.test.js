// tests/error-delegation.test.js
// TDD RED: Verifies the 4 secondary controllers delegate errors to next(err)
// instead of returning inline res.status(500).

const fs = require('fs');
const path = require('path');

const CONTROLLERS = [
  { name: 'blogController', path: path.join(__dirname, '..', 'controllers', 'blogController.js') },
  { name: 'contactController', path: path.join(__dirname, '..', 'controllers', 'contactController.js') },
  { name: 'newsletterController', path: path.join(__dirname, '..', 'controllers', 'newsletterController.js') },
  { name: 'waitlistController', path: path.join(__dirname, '..', 'controllers', 'waitlistController.js') },
];

describe('Error Delegation — All Controllers Use next(err)', () => {
  test.each(CONTROLLERS)(
    '$name must NOT contain res.status(500)',
    ({ path: filePath }) => {
      const source = fs.readFileSync(filePath, 'utf-8');
      const lines = source.split('\n');
      const violations = lines.filter(
        (line) => /res\.status\s*\(\s*500\s*\)/.test(line) && !line.trim().startsWith('//')
      );
      expect(violations).toEqual([]);
    }
  );

  test.each(CONTROLLERS)(
    '$name all async handler functions must accept (req, res, next)',
    ({ path: filePath }) => {
      const source = fs.readFileSync(filePath, 'utf-8');
      // Match async (req, res) => without next — these are violations
      const violatingSignatures = source.match(/async\s*\(\s*req\s*,\s*res\s*\)\s*=>/g);
      expect(violatingSignatures).toBeNull();
    }
  );

  test.each(CONTROLLERS)(
    '$name catch blocks must call next(err) or next(error)',
    ({ path: filePath }) => {
      const source = fs.readFileSync(filePath, 'utf-8');
      // Each catch block should contain next(err) or next(error)
      const catchBlocks = source.match(/catch\s*\(\s*\w+\s*\)\s*\{[^}]+\}/g) || [];
      for (const block of catchBlocks) {
        expect(block).toMatch(/next\s*\(/);
      }
    }
  );
});
