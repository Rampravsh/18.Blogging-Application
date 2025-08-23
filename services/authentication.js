const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

/**
 * Generates a JWT token for a user.
 * @param {object} user - The user object.
 * @returns {string} - The JWT token.
 */
function generateToken(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
    profileImageURL: user.profileImageURL,
  };
  return jwt.sign(payload, JWT_SECRET);
}

/**
 * Verifies a JWT token.
 * @param {string} token - The JWT token.
 * @returns {object|null} - The decoded token payload or null if invalid.
 */
function verifyToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken,
};