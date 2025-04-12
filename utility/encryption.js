const crypto = require('node:crypto');

// Encryption algorithm
const algorithm = 'aes-256-cbc';

// Function to encrypt data
function encrypt(text, iv) {
    // Validate input
    if (typeof text !== 'string' || !text) {
        throw new Error('Text must be a non-empty string');
    }

    // Validate IV
    if (!Buffer.isBuffer(iv) || iv.length !== 16) {
        throw new Error('IV must be a 16-byte Buffer');
    }

    // Get and validate key
    const keyHex = process.env.ENCRYPTION_KEY;
    if (!keyHex || typeof keyHex !== 'string') {
        throw new Error('ENCRYPTION_KEY environment variable is missing or invalid');
    }

    let key;
    try {
        key = Buffer.from(keyHex, 'hex');
        if (key.length !== 32) {
            throw new Error('Invalid key length');
        }
    } catch {
        throw new Error('ENCRYPTION_KEY must be a valid 64-character hex string');
    }

    try {
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    } catch (error) {
        throw new Error(`Encryption failed: ${error.message}`);
    }
}

module.exports = encrypt;