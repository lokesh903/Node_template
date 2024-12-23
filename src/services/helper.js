const fs = require("fs");
const path = require("path");
const logger = require("./logger");

module.exports = {
  deleteFile: async function (filePath) {
    try {
      await fs.promises.unlink(filePath); // Delete the file
      logger.info(`Deleted file: ${filePath}`);
    } catch (error) {
      logger.error(`Error deleting file ${filePath}:`, error);
      throw error;
    }
  },
  makeRandomNumber: (length) => {
    let result = "";
    const characters = "0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },
  cleanUpFiles: async function (files) {
    try {
      for (const file of files) {
        await fs.promises.unlink(file.path);
        logger.info(`Deleted file: ${file.path}`);
      }
    } catch (error) {
      logger.error(`Error deleting files:`, error);
      throw error;
    }
  },
};
