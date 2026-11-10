export const OWNER_PASSWORD_STORAGE_KEY = 'talkos_owner_password_hash';

export async function hashOwnerPassword(password: string): Promise<string> {
  if (!globalThis.crypto?.subtle) {
    throw new Error('This browser does not support secure password storage.');
  }

  const data = new TextEncoder().encode(password);
  const hash = await globalThis.crypto.subtle.digest('SHA-256', data);

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export function validateOwnerPassword(password: string, confirmation: string): string | null {
  if (password.length < 4) {
    return 'Password must be at least 4 characters.';
  }

  if (password !== confirmation) {
    return 'Passwords do not match.';
  }

  return null;
}
