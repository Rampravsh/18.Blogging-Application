const mongoose = require("mongoose");

/**
 * Connects to MongoDB.
 * @param {string} url - The MongoDB connection URL.
 * @returns {Promise} - A promise that resolves when the connection is established.
 */
async function connectMongoDB(url) {
  return mongoose.connect(url);
}

module.exports = {
  connectMongoDB,
};