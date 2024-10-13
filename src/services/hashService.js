const bcrypt = require("bcrypt");
const logger = require("./logger");

/**
 * Password Service Module
 * @module PasswordService
 */

/**
 * Generates a salt and hashes the given password.
 * 
 * @param {string} password - The plain text password to hash.
 * @returns {Promise<string>} - The hashed password.
 * @throws Will throw an error if hashing fails.
 */
const hashPassword = async (password) => {
    try {
        const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        logger.error("Error hashing password:", error);
        throw new Error("Error hashing password");
    }
};

/**
 * Compares a plain text password with a hashed password.
 * 
 * @param {string} password - The plain text password to compare.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} - True if the passwords match, otherwise false.
 * @throws Will throw an error if comparison fails.
 */
const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        logger.error("Error comparing passwords:", error);
        throw new Error("Error comparing passwords");
    }
};

module.exports = {
    hashPassword,
    comparePassword
};
