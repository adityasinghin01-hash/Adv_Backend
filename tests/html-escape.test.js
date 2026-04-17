// tests/html-escape.test.js
// TDD RED: Verifies htmlEscape utility escapes all dangerous characters
// AND that email templates use it for user-supplied data.

const fs = require('fs');
const path = require('path');

describe('htmlEscape Utility', () => {
  let htmlEscape;

  beforeAll(() => {
    htmlEscape = require('../utils/htmlEscape');
  });

  test('escapes < and > to prevent HTML injection', () => {
    expect(htmlEscape('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    );
  });

  test('escapes & to prevent entity injection', () => {
    expect(htmlEscape('Tom & Jerry')).toBe('Tom &amp; Jerry');
  });

  test('escapes double quotes', () => {
    expect(htmlEscape('"hello"')).toBe('&quot;hello&quot;');
  });

  test('escapes single quotes', () => {
    expect(htmlEscape("it's")).toBe('it&#39;s');
  });

  test('handles null and undefined gracefully', () => {
    expect(htmlEscape(null)).toBe('');
    expect(htmlEscape(undefined)).toBe('');
  });

  test('passes through safe strings unchanged', () => {
    expect(htmlEscape('hello world 123')).toBe('hello world 123');
  });

  test('does not double-escape already-escaped content', () => {
    const once = htmlEscape('<b>');
    const twice = htmlEscape(once);
    expect(once).toBe('&lt;b&gt;');
    expect(twice).toBe('&amp;lt;b&amp;gt;');
  });

  test('handles numbers by converting to string', () => {
    expect(htmlEscape(42)).toBe('42');
  });
});

describe('Email Templates — htmlEscape Usage', () => {
  const CONTROLLERS_TO_CHECK = [
    { name: 'contactController', path: path.join(__dirname, '..', 'controllers', 'contactController.js') },
    { name: 'waitlistController', path: path.join(__dirname, '..', 'controllers', 'waitlistController.js') },
  ];

  test.each(CONTROLLERS_TO_CHECK)(
    '$name must import htmlEscape',
    ({ path: filePath }) => {
      const source = fs.readFileSync(filePath, 'utf-8');
      expect(source).toMatch(/require\(.+htmlEscape.+\)/);
    }
  );

  test('contactController must escape name, email, subject, and message in HTML', () => {
    const source = fs.readFileSync(
      path.join(__dirname, '..', 'controllers', 'contactController.js'),
      'utf-8'
    );
    // Should use htmlEscape() around user-supplied values in html templates
    expect(source).toMatch(/htmlEscape\s*\(\s*name\s*\)/);
    expect(source).toMatch(/htmlEscape\s*\(\s*email\s*\)/);
    expect(source).toMatch(/htmlEscape\s*\(\s*subject\s*\)/);
    expect(source).toMatch(/htmlEscape\s*\(\s*message\s*\)/);
  });

  test('waitlistController must escape name and email in HTML', () => {
    const source = fs.readFileSync(
      path.join(__dirname, '..', 'controllers', 'waitlistController.js'),
      'utf-8'
    );
    expect(source).toMatch(/htmlEscape\s*\(\s*name\s*\)/);
    expect(source).toMatch(/htmlEscape\s*\(\s*email\s*\)/);
  });
});
