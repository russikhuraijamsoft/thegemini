import { create } from 'zustand';
import { Customer, Promotion } from '../models/crm';
import { crmService } from '../services/crmService';

interface CrmState {
  customers: Customer[];
  promotions: Promotion[];
  loading: boolean;
  error: string | null;

  loadCustomers: () => Promise<void>;
  loadPromotions: () => Promise<void>;
  addCustomer: (customerData: Omit<Customer, 'id' | 'createdAt' | 'loyaltyPoints' | 'tier' | 'status' | 'totalVisits' | 'totalSpent'>) => Promise<void>;
}

export const useCrmStore = create<CrmState>((set) => ({
  customers: [],
  promotions: [],
  loading: false,
  error: null,

  loadCustomers: async () => {
    set({ loading: true, error: null });
    try {
      const customers = await crmService.getCustomers();
      set({ customers, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  loadPromotions: async () => {
    set({ loading: true, error: null });
    try {
      const promotions = await crmService.getPromotions();
      set({ promotions, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  addCustomer: async (customerData) => {
    set({ loading: true, error: null });
    try {
      const newCust = await crmService.addCustomer(customerData);
      set(state => ({
        customers: [newCust, ...state.customers],
        loading: false
      }));
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  }
}));
