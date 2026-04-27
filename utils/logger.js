/**
 * Simple logger utility for professional console output
 */
const logger = {
    info: (message) => console.log(`[INFO] ${new Date().toISOString()}: ${message}`),
    error: (message) => console.error(`[ERROR] ${new Date().toISOString()}: ${message}`),
    test: (testName, message) => console.log(`[TEST: ${testName}] ${message}`)
};

module.exports = logger;
