export const FIRST_BRANCH_ID = 'br_main';

export function resolveInventoryBranchId(branchId?: string | null): string {
  const normalized = branchId?.trim();
  return normalized ? normalized : FIRST_BRANCH_ID;
}

/** Treat old, unscoped inventory documents as belonging to the first branch. */
export function scopeInventoryItem<T extends object>(
  item: T & { branchId?: string | null },
): T & { branchId: string } {
  return { ...item, branchId: resolveInventoryBranchId(item.branchId) };
}

export function scopeInventoryItemsForBranch<T extends object>(
  items: Array<T & { branchId?: string | null }>,
  branchId?: string | null,
): Array<T & { branchId: string }> {
  const activeBranchId = resolveInventoryBranchId(branchId);
  return items
    .map((item) => scopeInventoryItem(item))
    .filter((item) => item.branchId === activeBranchId);
}

export function resolveTransactionBranchId(
  transactionBranchId: string | undefined,
  itemBranchId: string | undefined,
): string {
  const itemOwner = resolveInventoryBranchId(itemBranchId);
  if (
    transactionBranchId?.trim() &&
    resolveInventoryBranchId(transactionBranchId) !== itemOwner
  ) {
    throw new Error('Inventory transaction branch does not match the item branch.');
  }
  return itemOwner;
}
