import { describe, expect, it } from 'vitest';
import {
  FIRST_BRANCH_ID,
  resolveInventoryBranchId,
  resolveTransactionBranchId,
  scopeInventoryItem,
} from '../features/inventory/utils/branchScope';

describe('inventory branch ownership', () => {
  it('assigns legacy unscoped inventory to the first branch', () => {
    const item = scopeInventoryItem({ id: 'inv-1', name: 'Rice' });

    expect(item.branchId).toBe(FIRST_BRANCH_ID);
  });

  it('preserves an explicit branch assignment', () => {
    expect(scopeInventoryItem({ id: 'inv-2', branchId: 'br_west' }).branchId).toBe('br_west');
  });

  it('normalizes a selected branch and defaults blank values to the first branch', () => {
    expect(resolveInventoryBranchId(' br_west ')).toBe('br_west');
    expect(resolveInventoryBranchId('  ')).toBe(FIRST_BRANCH_ID);
    expect(resolveInventoryBranchId(null)).toBe(FIRST_BRANCH_ID);
  });

  it('rejects a stock transaction for a different branch', () => {
    expect(() => resolveTransactionBranchId('br_west', 'br_main')).toThrow(
      'Inventory transaction branch does not match the item branch.',
    );
  });

  it('assigns legacy stock transactions to the owning main branch', () => {
    expect(resolveTransactionBranchId(undefined, undefined)).toBe(FIRST_BRANCH_ID);
  });
});
