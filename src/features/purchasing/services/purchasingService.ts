import { collection, query, where, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Supplier, PurchaseOrder, PurchaseRequisition, GRN, SupplierInvoice } from '../models/purchasing';
import { db } from '../../../core/firebase/firebaseConfig';

class PurchasingService {
  async getSuppliers(): Promise<Supplier[]> {
    if (!db) throw new Error("Firestore is not initialized");
    const q = query(collection(db, 'suppliers'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Supplier));
  }

  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    if (!db) throw new Error("Firestore is not initialized");
    const q = query(collection(db, 'purchase_orders'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PurchaseOrder));
  }

  async createPurchaseOrder(po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdAt'>): Promise<PurchaseOrder> {
    if (!db) throw new Error("Firestore is not initialized");
    const newPO: PurchaseOrder = {
      ...po,
      id: `po_${Date.now()}`,
      poNumber: `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'purchase_orders', newPO.id), newPO);
    return newPO;
  }
  
  async updatePurchaseOrderStatus(poId: string, status: PurchaseOrder['status']): Promise<void> {
    if (!db) throw new Error("Firestore is not initialized");
    await updateDoc(doc(db, 'purchase_orders', poId), { status });
  }

  async addSupplier(supplierData: Omit<Supplier, 'id' | 'createdAt'>): Promise<Supplier> {
    if (!db) throw new Error("Firestore is not initialized");
    const newSupplier: Supplier = {
      ...supplierData,
      id: `sup_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'suppliers', newSupplier.id), newSupplier);
    return newSupplier;
  }

  async updateSupplier(id: string, data: Partial<Supplier>): Promise<void> {
    if (!db) throw new Error("Firestore is not initialized");
    await updateDoc(doc(db, 'suppliers', id), data);
  }

  async deleteSupplier(id: string): Promise<void> {
    if (!db) throw new Error("Firestore is not initialized");
    await deleteDoc(doc(db, 'suppliers', id));
  }

  async deletePurchaseOrder(id: string): Promise<void> {
    if (!db) throw new Error("Firestore is not initialized");
    await deleteDoc(doc(db, 'purchase_orders', id));
  }
}

export const purchasingService = new PurchasingService();
