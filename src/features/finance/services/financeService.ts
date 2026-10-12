import { collection, query, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';
import { Account, Transaction, Expense } from '../models/finance';
import { db } from '../../../core/firebase/firebaseConfig';

class FinanceService {
  async getAccounts(): Promise<Account[]> {
    if (!db) throw new Error("Firestore is not initialized");
    const q = query(collection(db, 'finance_accounts'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Account));
  }

  async getTransactions(): Promise<Transaction[]> {
    if (!db) throw new Error("Firestore is not initialized");
    const q = query(collection(db, 'finance_transactions'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
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
