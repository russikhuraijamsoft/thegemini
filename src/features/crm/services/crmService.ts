import { collection, query, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Customer, Promotion, Feedback } from '../models/crm';
import { db } from '../../../core/firebase/firebaseConfig';

class CrmService {
  private localCustomers: Customer[] = [
    {
      id: 'cust_1',
      firstName: 'Rohan',
      lastName: 'Sharma',
      email: 'rohan.sharma@example.com',
      phone: '+91 98765 12345',
      loyaltyPoints: 340,
      tier: 'GOLD',
      status: 'ACTIVE',
      totalVisits: 14,
      totalSpent: 12450,
      preferences: [],
      dietary: [],
      allergies: [],
      addresses: [],
      createdAt: new Date().toISOString()
    },
    {
      id: 'cust_2',
      firstName: 'Priya',
      lastName: 'Patel',
      email: 'priya.patel@example.com',
      phone: '+91 98765 67890',
      loyaltyPoints: 120,
      tier: 'SILVER',
      status: 'ACTIVE',
      totalVisits: 6,
      totalSpent: 4800,
      preferences: [],
      dietary: [],
      allergies: [],
      addresses: [],
      createdAt: new Date().toISOString()
    }
  ];

  private localPromotions: Promotion[] = [
    {
      id: 'promo_1',
      code: 'WELCOME10',
      name: 'Welcome Offer',
      description: '10% off on your first dine-in order',
      type: 'PERCENTAGE',
      value: 10,
      minOrderValue: 500,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
      isActive: true,
      timesUsed: 42,
      targetSegments: ['ALL']
    }
  ];

  async getCustomers(): Promise<Customer[]> {
    if (!db) return this.localCustomers;
    try {
      const q = query(collection(db, 'customers'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
      }
      return this.localCustomers;
    } catch (err) {
      console.warn("Using local customers fallback:", err);
      return this.localCustomers;
    }
  }

  async getPromotions(): Promise<Promotion[]> {
    if (!db) return this.localPromotions;
    try {
      const q = query(collection(db, 'promotions'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Promotion));
      }
      return this.localPromotions;
    } catch (err) {
      console.warn("Using local promotions fallback:", err);
      return this.localPromotions;
    }
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
