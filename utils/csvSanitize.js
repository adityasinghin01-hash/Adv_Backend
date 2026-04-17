// utils/csvSanitize.js
// Sanitizes CSV values to prevent formula injection attacks.
// Wraps values starting with =, +, -, @, tab, or carriage return in quotes.

const csvSanitize = (value) => {
  const str = String(value ?? '');
  if (/^[=+\-@\t\r]/.test(str) || str.includes(',') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

module.exports = csvSanitize;
