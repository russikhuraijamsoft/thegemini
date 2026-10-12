import { create } from 'zustand';
import { Supplier, PurchaseOrder, GRN, SupplierInvoice } from '../models/purchasing';
import { purchasingService } from '../services/purchasingService';

interface PurchasingState {
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  loading: boolean;
  error: string | null;
  
  loadSuppliers: () => Promise<void>;
  loadPurchaseOrders: () => Promise<void>;
  createPO: (po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdAt'>) => Promise<void>;
  updatePOStatus: (poId: string, status: PurchaseOrder['status']) => Promise<void>;
}

export const usePurchasingStore = create<PurchasingState>((set, get) => ({
  suppliers: [],
  purchaseOrders: [],
  loading: false,
  error: null,

  loadSuppliers: async () => {
    set({ loading: true, error: null });
    try {
      const suppliers = await purchasingService.getSuppliers();
      set({ suppliers, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  loadPurchaseOrders: async () => {
    set({ loading: true, error: null });
    try {
      const purchaseOrders = await purchasingService.getPurchaseOrders();
      set({ purchaseOrders, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  createPO: async (po) => {
    set({ loading: true, error: null });
    try {
      const newPO = await purchasingService.createPurchaseOrder(po);
      set(state => ({
        purchaseOrders: [newPO, ...state.purchaseOrders],
        loading: false
      }));
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  updatePOStatus: async (poId, status) => {
    try {
      await purchasingService.updatePurchaseOrderStatus(poId, status);
      set(state => ({
        purchaseOrders: state.purchaseOrders.map(po => 
          po.id === poId ? { ...po, status } : po
        )
      }));
    } catch (e: any) {
      set({ error: e.message });
    }
  }
}));
