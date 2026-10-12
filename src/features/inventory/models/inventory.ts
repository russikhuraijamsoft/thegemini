export interface Category {
  id: string;
  name: string;
  parentId?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
  type: 'KITCHEN_STORE' | 'MAIN_STORE' | 'BRANCH_STORE' | 'VENDOR_STORE';
  location?: string;
  isActive: boolean;
}

export interface StorageLocation {
  id: string;
  warehouseId: string;
  name: string; // e.g. Aisle 1
  type: 'AISLE' | 'RACK' | 'SHELF' | 'BIN' | 'ZONE';
  isActive: boolean;
}

export interface ItemBatch {
  id: string;
  itemId: string;
  batchNumber: string;
  manufacturingDate?: string;
  expiryDate: string;
  receivedDate: string;
  initialQuantity: number;
  currentQuantity: number;
  unitCost: number; // For FIFO/FEFO valuation
  supplierId?: string;
  warehouseId: string;
  status: 'ACTIVE' | 'EXPIRED' | 'DEPLETED' | 'QUARANTINE';
}

export interface CycleCount {
  id: string;
  name: string;
  date: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  warehouseId: string;
  assignedTo?: string;
  items: {
    itemId: string;
    systemQuantity: number;
    countedQuantity?: number;
    variance?: number;
    reason?: string;
  }[];
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  barcode?: string;
  qrCode?: string;
  name: string;
  categoryId: string;
  brand?: string;
  unit: string;
  hsnCode?: string;
  gstRate?: number;
  costPrice: number; // Weighted average cost price
  sellingPrice: number;
  reorderLevel: number;
  maximumStock?: number;
  minimumStock: number;
  preferredSupplierId?: string;
  shelfLifeDays?: number;
  status: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';
  currentStock: number;
  valuationMethod: 'FIFO' | 'FEFO' | 'WEIGHTED_AVERAGE';
  lastUpdated: string;
  createdAt: string;
}

export interface StockTransaction {
  id: string;
  itemId: string;
  batchId?: string;
  type: 'STOCK_IN' | 'STOCK_OUT' | 'TRANSFER' | 'ADJUSTMENT' | 'OPENING' | 'CLOSING' | 'PHYSICAL_VERIFICATION' | 'DAMAGE' | 'WASTAGE' | 'EXPIRY' | 'RETURN';
  quantity: number;
  referenceId?: string; // e.g., PO ID or Order ID
  notes?: string;
  fromWarehouseId?: string;
  toWarehouseId?: string;
  fromLocationId?: string;
  toLocationId?: string;
  unitCost: number;
  totalCost: number;
  date: string;
  performedBy: string;
}


