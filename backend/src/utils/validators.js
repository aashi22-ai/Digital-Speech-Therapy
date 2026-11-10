// Shared, tiny validation helpers used across controllers so the same
// rules (e.g. what counts as a valid email) don't drift between routes.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (email) => typeof email === "string" && EMAIL_REGEX.test(email.trim());

const isValidPassword = (password) =>
  typeof password === "string" && password.length >= 6;

module.exports = { isValidEmail, isValidPassword };
