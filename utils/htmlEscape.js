// utils/htmlEscape.js
// Escapes HTML special characters to prevent XSS in email templates.
// Used by contactController, waitlistController, newsletterController.

const htmlEscape = (str) => {
  if (str === null || str === undefined) {
    return '';
  }
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

module.exports = htmlEscape;
