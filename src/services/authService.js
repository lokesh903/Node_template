const jwt = require('jsonwebtoken');
const logger = require('./logger');

/**
 * Token Service Module
 * @module TokenService
 */
module.exports = {
  /**
   * Issues a JWT token.
   *
   * @param {object} payload - The payload to include in the JWT.
   * @returns {Promise<string>} - The issued JWT token.
   * @throws Will throw an error if token generation fails.
   */
  async issueToken(payload) {
    try {
      const secret = process.env.JWT_SECRET;
      const options = { expiresIn: '365d' };

      if (!secret) {
        throw new Error('JWT_SECRET environment variable not set');
      }
      return jwt.sign(payload, secret, options);
    } catch (error) {
      logger.error('Error issuing token:', error);
      throw new Error('Error issuing token');
    }
  },

  /**
   * Verifies a JWT token.
   *
   * @param {string} token - The JWT token to verify.
   * @returns {Promise<object>} - The decoded payload if the token is valid, otherwise throws an error.
   * @throws Will throw an error if token verification fails.
   */
  async verifyToken(token) {
    try {
      const secret = process.env.JWT_SECRET;

      if (!secret) {
        throw new Error('JWT_SECRET environment variable not set');
      }

      const decoded = jwt.verify(token, secret);
      return decoded;
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        logger.error('Invalid JWT token:', error);
        throw new Error('Invalid JWT token');
      } else if (error.name === 'TokenExpiredError') {
        logger.error('Expired JWT token:', error);
        throw new Error('JWT token has expired');
      } else {
        logger.error('Error verifying token:', error);
        throw new Error('Error verifying token');
      }
    }
  },
};
