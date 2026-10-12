import { collection, query, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Customer, Promotion, Feedback } from '../models/crm';
import { db } from '../../../core/firebase/firebaseConfig';

class CrmService {
  async getCustomers(): Promise<Customer[]> {
    if (!db) throw new Error("Firestore is not initialized");
    const q = query(collection(db, 'customers'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
  }

  async getPromotions(): Promise<Promotion[]> {
    if (!db) throw new Error("Firestore is not initialized");
    const q = query(collection(db, 'promotions'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Promotion));
  }

  async addCustomer(customerData: Omit<Customer, 'id' | 'createdAt' | 'loyaltyPoints' | 'tier' | 'status' | 'totalVisits' | 'totalSpent'>): Promise<Customer> {
    if (!db) throw new Error("Firestore is not initialized");
    const newCustomer: Customer = {
      ...customerData,
      id: `cust_${Date.now()}`,
      createdAt: new Date().toISOString(),
      loyaltyPoints: 0,
      tier: 'BRONZE',
      status: 'ACTIVE',
      totalVisits: 0,
      totalSpent: 0,
    };
    await setDoc(doc(db, 'customers', newCustomer.id), newCustomer);
    return newCustomer;
  }
  
  async updateCustomer(id: string, data: Partial<Customer>): Promise<void> {
    if (!db) throw new Error("Firestore is not initialized");
    await updateDoc(doc(db, 'customers', id), data);
  }

  async deleteCustomer(id: string): Promise<void> {
    if (!db) throw new Error("Firestore is not initialized");
    await deleteDoc(doc(db, 'customers', id));
  }

  async addPromotion(promotionData: Omit<Promotion, 'id' | 'timesUsed'>): Promise<Promotion> {
    if (!db) throw new Error("Firestore is not initialized");
    const newPromo: Promotion = {
      ...promotionData,
      id: `promo_${Date.now()}`,
      timesUsed: 0
    };
    await setDoc(doc(db, 'promotions', newPromo.id), newPromo);
    return newPromo;
  }

  async updatePromotion(id: string, data: Partial<Promotion>): Promise<void> {
    if (!db) throw new Error("Firestore is not initialized");
    await updateDoc(doc(db, 'promotions', id), data);
  }

  async deletePromotion(id: string): Promise<void> {
    if (!db) throw new Error("Firestore is not initialized");
    await deleteDoc(doc(db, 'promotions', id));
  }
}

export const crmService = new CrmService();
