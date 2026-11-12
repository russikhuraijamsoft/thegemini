import { collection, query, getDocs, doc, setDoc, updateDoc, deleteDoc, runTransaction } from 'firebase/firestore';
import { db } from '../../../core/firebase/firebaseConfig';
import { useAppStore } from '../../../core/store/appStore';
import {
  resolveInventoryBranchId,
  resolveTransactionBranchId,
  scopeInventoryItem,
  scopeInventoryItemsForBranch,
} from '../utils/branchScope';
import { InventoryItem, Category, Warehouse, StockTransaction, ItemBatch, StorageLocation, CycleCount } from '../models/inventory';

class InventoryService {
  private localCategories: Category[] = [
    { id: 'cat_raw', name: 'Raw Materials', isActive: true, createdAt: new Date().toISOString() },
    { id: 'cat_finished', name: 'Finished Goods', isActive: true, createdAt: new Date().toISOString() },
    { id: 'cat_packaging', name: 'Packaging', isActive: true, createdAt: new Date().toISOString() },
    { id: 'cat_consumables', name: 'Consumables', isActive: true, createdAt: new Date().toISOString() }
  ];

  private localWarehouses: Warehouse[] = [
    { id: 'wh_main', name: 'Main Store', type: 'MAIN_STORE', location: 'HQ', isActive: true }
  ];

  private localItems: InventoryItem[] = [
    {
      id: 'inv_flour_1',
      branchId: 'br_main',
      name: 'All Purpose Flour',
      sku: 'RM-FLOUR-01',
      categoryId: 'cat_raw',
      unit: 'KG',
      costPrice: 45,
      sellingPrice: 0,
      currentStock: 120,
      minimumStock: 25,
      maximumStock: 500,
      reorderLevel: 50,
      valuationMethod: 'FIFO',
      status: 'ACTIVE',
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString()
    },
    {
      id: 'inv_chicken_1',
      branchId: 'br_main',
      name: 'Fresh Chicken Breast',
      sku: 'RM-CHICKEN-01',
      categoryId: 'cat_raw',
      unit: 'KG',
      costPrice: 180,
      sellingPrice: 0,
      currentStock: 45,
      minimumStock: 15,
      maximumStock: 100,
      reorderLevel: 20,
      valuationMethod: 'FIFO',
      status: 'ACTIVE',
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString()
    },
    {
      id: 'inv_oil_1',
      branchId: 'br_main',
      name: 'Refined Sunflower Oil',
      sku: 'RM-OIL-01',
      categoryId: 'cat_raw',
      unit: 'L',
      costPrice: 135,
      sellingPrice: 0,
      currentStock: 60,
      minimumStock: 20,
      maximumStock: 200,
      reorderLevel: 30,
      valuationMethod: 'WEIGHTED_AVERAGE',
      status: 'ACTIVE',
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
  ];

  // --- Categories ---
  async getCategories(): Promise<Category[]> {
    if (!db) return this.localCategories;
    try {
      const q = query(collection(db, 'inventory_categories'));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return this.localCategories;
      }
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    } catch (err) {
      console.warn("Using local categories fallback due to Firestore permission/offline state:", err);
      return this.localCategories;
    }
  }

  async addCategory(categoryData: Omit<Category, 'id' | 'createdAt'>): Promise<Category> {
    const newCategory: Category = {
      ...categoryData,
      id: `cat_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.localCategories.push(newCategory);
    if (db) {
      try {
        await setDoc(doc(db, 'inventory_categories', newCategory.id), newCategory);
      } catch (err) {
        console.warn("Could not save category to Firestore (saved locally):", err);
      }
    }
    return newCategory;
  }

  // --- Warehouses ---
  async getWarehouses(): Promise<Warehouse[]> {
    if (!db) return this.localWarehouses;
    try {
      const q = query(collection(db, 'inventory_warehouses'));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return this.localWarehouses;
      }
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Warehouse));
    } catch (err) {
      console.warn("Using local warehouses fallback due to Firestore permission/offline state:", err);
      return this.localWarehouses;
    }
  }

  async addWarehouse(warehouseData: Omit<Warehouse, 'id'>): Promise<Warehouse> {
    const newWarehouse: Warehouse = {
      ...warehouseData,
      id: `wh_${Date.now()}`,
    };
    this.localWarehouses.push(newWarehouse);
    if (db) {
      try {
        await setDoc(doc(db, 'inventory_warehouses', newWarehouse.id), newWarehouse);
      } catch (err) {
        console.warn("Could not save warehouse to Firestore (saved locally):", err);
      }
    }
    return newWarehouse;
  }

  // --- Storage Locations ---
  async getStorageLocations(): Promise<StorageLocation[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, 'inventory_storage_locations'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StorageLocation));
    } catch (err) {
      console.warn("Using empty storage locations fallback:", err);
      return [];
    }
  }

  async addStorageLocation(locationData: Omit<StorageLocation, 'id'>): Promise<StorageLocation> {
    const newLocation: StorageLocation = {
      ...locationData,
      id: `loc_${Date.now()}`,
    };
    if (db) {
      try {
        await setDoc(doc(db, 'inventory_storage_locations', newLocation.id), newLocation);
      } catch (err) {
        console.warn("Could not save storage location to Firestore:", err);
      }
    }
    return newLocation;
  }

  // --- Items ---
  async getItems(): Promise<InventoryItem[]> {
    if (!db) return scopeInventoryItemsForBranch(this.localItems, useAppStore.getState().branchId);
    try {
      const q = query(collection(db, 'inventory_items'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem));
        this.localItems = items;
        return scopeInventoryItemsForBranch(items, useAppStore.getState().branchId);
      }
      return scopeInventoryItemsForBranch(this.localItems, useAppStore.getState().branchId);
    } catch (err) {
      console.warn("Using local items fallback due to Firestore permission/offline state:", err);
      return scopeInventoryItemsForBranch(this.localItems, useAppStore.getState().branchId);
    }
  }

  async addItem(itemData: Omit<InventoryItem, 'id' | 'lastUpdated' | 'createdAt' | 'currentStock'>): Promise<InventoryItem> {
    const newItem: InventoryItem = {
      ...itemData,
      branchId: resolveInventoryBranchId(itemData.branchId ?? useAppStore.getState().branchId),
      id: `inv_${Date.now()}`,
      currentStock: 0,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    this.localItems.unshift(newItem);
    if (db) {
      try {
        await setDoc(doc(db, 'inventory_items', newItem.id), newItem);
      } catch (err) {
        console.warn("Could not save inventory item to Firestore (saved locally):", err);
      }
    }
    return newItem;
  }

  async updateItem(id: string, data: Partial<InventoryItem>): Promise<void> {
    const idx = this.localItems.findIndex(i => i.id === id);
    if (idx > -1) {
      this.localItems[idx] = { ...this.localItems[idx], ...data, lastUpdated: new Date().toISOString() };
    }
    if (db) {
      try {
        await updateDoc(doc(db, 'inventory_items', id), { ...data, lastUpdated: new Date().toISOString() });
      } catch (err) {
        console.warn("Could not update item in Firestore (updated locally):", err);
      }
    }
  }

  async deleteItem(id: string): Promise<void> {
    if (!db) throw new Error("Firestore is not initialized");
    await deleteDoc(doc(db, 'inventory_items', id));
  }

  // --- Batches ---
  async getBatches(): Promise<ItemBatch[]> {
    if (!db) throw new Error("Firestore is not initialized");
    const q = query(collection(db, 'inventory_batches'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ItemBatch));
  }

  async addBatch(batchData: Omit<ItemBatch, 'id'>): Promise<ItemBatch> {
    if (!db) throw new Error("Firestore is not initialized");
    const newBatch: ItemBatch = {
      ...batchData,
      id: `bat_${Date.now()}`
    };
    await setDoc(doc(db, 'inventory_batches', newBatch.id), newBatch);
    return newBatch;
  }

  async updateBatch(id: string, data: Partial<ItemBatch>): Promise<void> {
    if (!db) throw new Error("Firestore is not initialized");
    await updateDoc(doc(db, 'inventory_batches', id), data);
  }

  // --- Cycle Counts ---
  async getCycleCounts(): Promise<CycleCount[]> {
    if (!db) throw new Error("Firestore is not initialized");
    const q = query(collection(db, 'inventory_cycle_counts'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CycleCount));
  }

  async addCycleCount(countData: Omit<CycleCount, 'id' | 'createdAt'>): Promise<CycleCount> {
    if (!db) throw new Error("Firestore is not initialized");
    const newCount: CycleCount = {
      ...countData,
      id: `cc_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'inventory_cycle_counts', newCount.id), newCount);
    return newCount;
  }

  async updateCycleCount(id: string, data: Partial<CycleCount>): Promise<void> {
    if (!db) throw new Error("Firestore is not initialized");
    await updateDoc(doc(db, 'inventory_cycle_counts', id), data);
  }

  // --- Transactions ---
  async recordTransaction(transactionData: Omit<StockTransaction, 'id' | 'date'>): Promise<StockTransaction> {
    if (!db) throw new Error("Firestore is not initialized");
    const newTransaction: StockTransaction = {
      ...transactionData,
      id: `txn_${Date.now()}`,
      date: new Date().toISOString()
    };

    if (db) {
      try {
        await runTransaction(db, async (transaction) => {
          if (!db) return;
          
          const itemRef = doc(db, 'inventory_items', newTransaction.itemId);
          const itemDoc = await transaction.get(itemRef);
          
          if (!itemDoc.exists()) {
            return;
          }

          const itemData = scopeInventoryItem(itemDoc.data() as InventoryItem);
          newTransaction.branchId = resolveTransactionBranchId(
            newTransaction.branchId,
            itemData.branchId,
          );
          const currentStock = itemData.currentStock || 0;
          let stockChange = 0;

          switch (newTransaction.type) {
            case 'STOCK_IN':
            case 'RETURN':
            case 'OPENING':
              stockChange = newTransaction.quantity;
              break;
            case 'STOCK_OUT':
            case 'DAMAGE':
            case 'WASTAGE':
            case 'EXPIRY':
              stockChange = -newTransaction.quantity;
              break;
            case 'ADJUSTMENT':
            case 'PHYSICAL_VERIFICATION':
              stockChange = newTransaction.quantity;
              break;
            case 'TRANSFER':
              stockChange = 0; 
              break;
          }

          const newStock = currentStock + stockChange;
          
          let newCostPrice = itemData.costPrice;

          // Basic Weighted Average Cost Update on STOCK_IN
          if (newTransaction.type === 'STOCK_IN' && itemData.valuationMethod === 'WEIGHTED_AVERAGE') {
            const totalCurrentValue = currentStock * itemData.costPrice;
            const totalNewValue = newTransaction.quantity * newTransaction.unitCost;
            if (newStock > 0) {
               newCostPrice = (totalCurrentValue + totalNewValue) / newStock;
            }
          }

          transaction.update(itemRef, { 
            currentStock: newStock,
            costPrice: newCostPrice,
            lastUpdated: new Date().toISOString()
          });

          // Update batch if applicable
          if (newTransaction.batchId) {
            const batchRef = doc(db, 'inventory_batches', newTransaction.batchId);
            const batchDoc = await transaction.get(batchRef);
            if (batchDoc.exists()) {
               const batchData = batchDoc.data() as ItemBatch;
               const newBatchStock = batchData.currentQuantity + stockChange;
               transaction.update(batchRef, {
                  currentQuantity: Math.max(0, newBatchStock),
                  status: newBatchStock <= 0 ? 'DEPLETED' : batchData.status
               });
            }
          }

          const txnRef = doc(db, 'inventory_transactions', newTransaction.id);
          transaction.set(txnRef, newTransaction);
        });
      } catch (err) {
        console.warn("Could not commit inventory transaction to Firestore (recorded locally):", err);
      }
    }

    // Always update in-memory item stock
    const localIdx = this.localItems.findIndex(i => i.id === newTransaction.itemId);
    if (localIdx > -1) {
      const current = this.localItems[localIdx].currentStock || 0;
      let change = 0;
      if (['STOCK_IN', 'RETURN', 'OPENING', 'ADJUSTMENT'].includes(newTransaction.type)) {
        change = newTransaction.quantity;
      } else if (['STOCK_OUT', 'DAMAGE', 'WASTAGE', 'EXPIRY'].includes(newTransaction.type)) {
        change = -newTransaction.quantity;
      }
      this.localItems[localIdx].currentStock = Math.max(0, current + change);
    }

    return newTransaction;
  }
}

export const inventoryService = new InventoryService();
