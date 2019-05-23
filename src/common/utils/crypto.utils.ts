import * as crypto from 'crypto';
import * as CryptoJS from 'crypto-js';

/**
 * 암호화
 *
 * @param text
 * @param cryptoKey
 * @returns {string}
 */
export const encrypt = (text: any, cryptoKey: string): string =>
    CryptoJS.AES.encrypt(JSON.stringify(text), cryptoKey).toString();

/**
 * 복호화
 *
 * @param text
 * @param cryptoKey
 * @returns {string}
 */
export const decrypt = (encrypted: string, cryptoKey: string): any => {
    try {
        return JSON.parse(CryptoJS.AES.decrypt(encrypted, cryptoKey).toString(CryptoJS.enc.Utf8));
    } catch (e) {
        try {
            const sha256 = crypto.createHash('sha256');
            sha256.update(cryptoKey.toString());

            const input = Buffer.from(encrypted, 'base64');

            if (input.length < 17) {
                throw new TypeError('Provided "encrypted" must decrypt to a non-empty string');
            }

            // Initialization Vector
            const iv = input.slice(0, 16);
            const decipher = crypto.createDecipheriv('aes-256-ctr', sha256.digest(), iv);

            const ciphertext = input.slice(16);

            return JSON.parse(decipher.update(ciphertext).toString() + decipher.final());
        } catch (e) {
            throw e;
        }
    }
};

export function getHash() {
    return crypto.createHash('sha256').update(Math.random().toString(36).replace(/[^a-z]+/g, '')).digest('hex');
}
