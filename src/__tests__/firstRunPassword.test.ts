import { describe, expect, it } from 'vitest';

import {
  hashOwnerPassword,
  OWNER_PASSWORD_STORAGE_KEY,
  validateOwnerPassword,
} from '../shared/components/firstRunPassword';

describe('first-run owner password helpers', () => {
  it('uses a stable SHA-256 digest instead of storing plaintext passwords', async () => {
    await expect(hashOwnerPassword('correct horse battery staple')).resolves.toBe(
      'c4bbcb1fbec99d65bf59d85c8cb62ee2db963f0fe106f483d9afa73bd4e39a8a',
    );
  });

  it('uses a dedicated storage key', () => {
    expect(OWNER_PASSWORD_STORAGE_KEY).toBe('talkos_owner_password_hash');
  });

  it.each([
    ['', '', 'Password must be at least 4 characters.'],
    ['abc', 'abc', 'Password must be at least 4 characters.'],
    ['password', 'different', 'Passwords do not match.'],
    ['password', 'password', null],
  ])('validates password setup input', (password, confirmation, expected) => {
    expect(validateOwnerPassword(password, confirmation)).toBe(expected);
  });
});
