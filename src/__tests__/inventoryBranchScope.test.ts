import { describe, expect, it } from 'vitest';
import {
  FIRST_BRANCH_ID,
  resolveInventoryBranchId,
  resolveTransactionBranchId,
  scopeInventoryItem,
  scopeInventoryItemsForBranch,
} from '../features/inventory/utils/branchScope';

describe('inventory branch ownership', () => {
  it('assigns legacy unscoped inventory to the first branch', () => {
    const item = scopeInventoryItem({ id: 'inv-1', name: 'Rice' });

    expect(item.branchId).toBe(FIRST_BRANCH_ID);
  });

  it('preserves an explicit branch assignment', () => {
    expect(scopeInventoryItem({ id: 'inv-2', branchId: 'br_west' }).branchId).toBe('br_west');
  });

  it('returns only active-branch stock while mapping legacy items to the main branch', () => {
    const items = scopeInventoryItemsForBranch(
      [
        { id: 'legacy-item' },
        { id: 'main-item', branchId: FIRST_BRANCH_ID },
        { id: 'west-item', branchId: 'br_west' },
      ],
      FIRST_BRANCH_ID,
    );

    expect(items.map((item) => item.id)).toEqual(['legacy-item', 'main-item']);
    expect(items.every((item) => item.branchId === FIRST_BRANCH_ID)).toBe(true);
  });

  it('does not return main-branch legacy stock in another branch', () => {
    expect(
      scopeInventoryItemsForBranch([{ id: 'legacy-item' }], 'br_west'),
    ).toEqual([]);
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
