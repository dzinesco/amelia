import { webcrypto } from 'node:crypto';

export class EncryptionService {
  private static readonly ALGORITHM = 'AES-GCM';
  private static readonly KEY_LENGTH = 256;
  private static readonly SALT_LENGTH = 16;
  private static readonly IV_LENGTH = 12;

  private async generateKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await webcrypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return webcrypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      {
        name: this.ALGORITHM,
        length: this.KEY_LENGTH,
      },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async encrypt(data: string, password: string): Promise<string> {
    const encoder = new TextEncoder();
    const salt = webcrypto.getRandomValues(new Uint8Array(this.SALT_LENGTH));
    const iv = webcrypto.getRandomValues(new Uint8Array(this.IV_LENGTH));
    const key = await this.generateKey(password, salt);

    const encrypted = await webcrypto.subtle.encrypt(
      {
        name: this.ALGORITHM,
        iv,
      },
      key,
      encoder.encode(data)
    );

    const encryptedArray = new Uint8Array(encrypted);
    const resultArray = new Uint8Array(salt.length + iv.length + encryptedArray.length);
    resultArray.set(salt, 0);
    resultArray.set(iv, salt.length);
    resultArray.set(encryptedArray, salt.length + iv.length);

    return Buffer.from(resultArray).toString('base64');
  }

  async decrypt(encryptedData: string, password: string): Promise<string> {
    const decoder = new TextDecoder();
    const encrypted = Buffer.from(encryptedData, 'base64');
    const salt = encrypted.slice(0, this.SALT_LENGTH);
    const iv = encrypted.slice(this.SALT_LENGTH, this.SALT_LENGTH + this.IV_LENGTH);
    const data = encrypted.slice(this.SALT_LENGTH + this.IV_LENGTH);

    const key = await this.generateKey(password, salt);

    const decrypted = await webcrypto.subtle.decrypt(
      {
        name: this.ALGORITHM,
        iv,
      },
      key,
      data
    );

    return decoder.decode(decrypted);
  }
}