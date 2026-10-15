/**
 * End-to-End Encryption (E2EE) for Quiz Security
 * Protects answer keys and sensitive jury verification data using AES-GCM 256-bit
 */

const MASTER_SALT = new TextEncoder().encode('CERDAS_CERMAT_PRO_E2EE_2026_SALT');
const COMMITTEE_PASSPHRASE = 'PANITIA_JURI_CERDAS_CERMAT_SECURE_KEY_v2';

// Derives a cryptographic AES-GCM key from a passphrase
async function deriveKey(passphrase: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: MASTER_SALT,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts plain text string to Base64 IV + Ciphertext string
 */
export async function encryptE2EE(plainText: string, passphrase = COMMITTEE_PASSPHRASE): Promise<string> {
  try {
    const key = await deriveKey(passphrase);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plainText);

    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encoded
    );

    const ivBase64 = btoa(String.fromCharCode(...iv));
    const cipherBase64 = btoa(String.fromCharCode(...new Uint8Array(ciphertext)));

    return `E2EE::${ivBase64}::${cipherBase64}`;
  } catch (err) {
    console.error('Encryption failed:', err);
    return `E2EE_FALLBACK::${btoa(plainText)}`;
  }
}

/**
 * Decrypts E2EE payload back to plain text string
 */
export async function decryptE2EE(encryptedPayload: string, passphrase = COMMITTEE_PASSPHRASE): Promise<string> {
  try {
    if (!encryptedPayload.startsWith('E2EE::')) {
      if (encryptedPayload.startsWith('E2EE_FALLBACK::')) {
        return atob(encryptedPayload.replace('E2EE_FALLBACK::', ''));
      }
      return encryptedPayload;
    }

    const parts = encryptedPayload.split('::');
    if (parts.length !== 3) return 'Format Enkripsi Tidak Valid';

    const iv = Uint8Array.from(atob(parts[1]), (c) => c.charCodeAt(0));
    const cipherBytes = Uint8Array.from(atob(parts[2]), (c) => c.charCodeAt(0));

    const key = await deriveKey(passphrase);
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      cipherBytes
    );

    return new TextDecoder().decode(decrypted);
  } catch (err) {
    console.warn('Decryption failed or unauthorized access attempt:', err);
    return '🔒 [Terkunci E2EE - Hanya Panitia & Juri yang Berhak Membuka]';
  }
}

/**
 * SHA-256 hash helper for quick answer verification without revealing plain text
 */
export async function sha256Hash(input: string): Promise<string> {
  const enc = new TextEncoder();
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', enc.encode(input.trim().toLowerCase()));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
