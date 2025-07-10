import crypto from 'crypto';

if (!process.env.ENCRYPTION_SECRET) {
    throw new Error('❌ ENCRYPTION_SECRET is not defined!');
}

const algorithm = 'aes-256-cbc';
const key = crypto
    .createHash('sha256')
    .update(String(process.env.ENCRYPTION_SECRET))
    .digest(); // 32-byte Buffer

export const encrypt = (text) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};

export const decrypt = (encryptedText) => {
    const [ivHex, encrypted] = encryptedText.split(':');
    const ivBuffer = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, ivBuffer);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
