// ============================================================================
// Idempotency Utils - Generate unique keys for financial transactions
// ============================================================================

import * as Crypto from 'expo-crypto';

/**
 * Generate a unique idempotency key for payment/payout requests
 * Prevents double-charges on network retries
 */
export const generateIdempotencyKey = async (prefix = 'rentlk'): Promise<string> => {
  const timestamp = Date.now().toString(36);
  const randomBytes = await Crypto.getRandomBytesAsync(16);
  const hexString = Array.from(randomBytes as number[])
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return `${prefix}_${timestamp}_${hexString}`;
};

/**
 * Generate a simple unique ID (synchronous, for non-critical use)
 */
export const generateUniqueId = (prefix = 'id'): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `${prefix}_${timestamp}_${random}`;
};

/**
 * Hash a string (for PIN storage, etc.)
 * Note: For production, use server-side hashing with bcrypt/argon2
 */
export const hashString = async (input: string): Promise<string> => {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    input
  );
};

/**
 * Verify a string against a hash
 */
export const verifyHash = async (input: string, hash: string): Promise<boolean> => {
  const inputHash = await hashString(input);
  return inputHash === hash;
};
