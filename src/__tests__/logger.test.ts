import { describe, it, expect, vi } from 'vitest';
import { logger } from '../core/logging/logger';

describe('Core Logger Service', () => {
  it('formats and outputs info logs', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    logger.info('System startup test', { module: 'auth' });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('formats and outputs error logs', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    logger.error('Failed test transaction', new Error('Network error'));
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
