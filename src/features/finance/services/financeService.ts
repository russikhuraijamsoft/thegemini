import { collection, query, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';
import { Account, Transaction, Expense } from '../models/finance';
import { db } from '../../../core/firebase/firebaseConfig';

class FinanceService {
  private localAccounts: Account[] = [
    { id: 'acc_cash', code: '1001', name: 'Cash Register 1', type: 'ASSET', group: 'CURRENT_ASSET', balance: 15420, isActive: true },
    { id: 'acc_bank', code: '1002', name: 'Primary HDFC Bank', type: 'ASSET', group: 'CURRENT_ASSET', balance: 845000, isActive: true },
    { id: 'acc_upi', code: '1003', name: 'UPI Gateway', type: 'ASSET', group: 'CURRENT_ASSET', balance: 34100, isActive: true }
  ];

  private localTransactions: Transaction[] = [];

  async getAccounts(): Promise<Account[]> {
    if (!db) return this.localAccounts;
    try {
      const q = query(collection(db, 'finance_accounts'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Account));
      }
      return this.localAccounts;
    } catch (err) {
      console.warn("Using local finance accounts fallback:", err);
      return this.localAccounts;
    }
  }

  async getTransactions(): Promise<Transaction[]> {
    if (!db) return this.localTransactions;
    try {
      const q = query(collection(db, 'finance_transactions'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
    } catch (err) {
      console.warn("Using local finance transactions fallback:", err);
      return this.localTransactions;
    }
  }

  async createTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    if (!db) throw new Error("Firestore is not initialized");
    const newTxn: Transaction = {
      ...transactionData,
      id: `txn_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'finance_transactions', newTxn.id), newTxn);
    return newTxn;
  }
}

export const financeService = new FinanceService();
