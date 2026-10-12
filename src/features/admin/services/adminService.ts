import { collection, query, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { User, Branch, SystemConfig, AuditLog } from '../models/admin';
import { db } from '../../../core/firebase/firebaseConfig';

class AdminService {
  async getUsers(): Promise<User[]> {
    if (!db) throw new Error("Firestore is not initialized");
    const q = query(collection(db, 'admin_users'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  }

  async getBranches(): Promise<Branch[]> {
    if (!db) throw new Error("Firestore is not initialized");
    const q = query(collection(db, 'admin_branches'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Branch));
  }

  async getSystemConfig(): Promise<SystemConfig> {
    if (!db) throw new Error("Firestore is not initialized");
    const q = query(collection(db, 'admin_config'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
       return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as SystemConfig;
    }
    return {
      id: 'cfg_1',
      companyName: 'TalkOS Enterprises',
      defaultCurrency: 'INR',
      taxType: 'GST',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      timezone: 'Asia/Kolkata'
    };
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    if (!db) throw new Error("Firestore is not initialized");
    const q = query(collection(db, 'admin_audit_logs'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AuditLog));
  }

  async addUser(userData: Omit<User, 'id'>): Promise<User> {
    if (!db) throw new Error("Firestore is not initialized");
    const newUser: User = {
      ...userData,
      id: `usr_${Date.now()}`
    };
    await setDoc(doc(db, 'admin_users', newUser.id), newUser);
    return newUser;
  }

  async updateUser(id: string, data: Partial<User>): Promise<void> {
    if (!db) throw new Error("Firestore is not initialized");
    await updateDoc(doc(db, 'admin_users', id), data);
  }

  async deleteUser(id: string): Promise<void> {
    if (!db) throw new Error("Firestore is not initialized");
    await deleteDoc(doc(db, 'admin_users', id));
  }

  async addBranch(branchData: Omit<Branch, 'id'>): Promise<Branch> {
    if (!db) throw new Error("Firestore is not initialized");
    const newBranch: Branch = {
      ...branchData,
      id: `br_${Date.now()}`
    };
    await setDoc(doc(db, 'admin_branches', newBranch.id), newBranch);
    return newBranch;
  }

  async updateBranch(id: string, data: Partial<Branch>): Promise<void> {
    if (!db) throw new Error("Firestore is not initialized");
    await updateDoc(doc(db, 'admin_branches', id), data);
  }

  async deleteBranch(id: string): Promise<void> {
    if (!db) throw new Error("Firestore is not initialized");
    await deleteDoc(doc(db, 'admin_branches', id));
  }
}

export const adminService = new AdminService();
