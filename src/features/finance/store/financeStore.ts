import { create } from 'zustand';
import { Account, Transaction } from '../models/finance';
import { financeService } from '../services/financeService';

interface FinanceState {
  accounts: Account[];
  transactions: Transaction[];
  loading: boolean;
  error: string | null;

  loadAccounts: () => Promise<void>;
  loadTransactions: () => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  accounts: [],
  transactions: [],
  loading: false,
  error: null,

  loadAccounts: async () => {
    set({ loading: true, error: null });
    try {
      const accounts = await financeService.getAccounts();
      set({ accounts, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  loadTransactions: async () => {
    set({ loading: true, error: null });
    try {
      const transactions = await financeService.getTransactions();
      set({ transactions, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },
}));
