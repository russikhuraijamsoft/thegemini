import { collection, query, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { User, Branch, SystemConfig, AuditLog } from '../models/admin';
import { db } from '../../../core/firebase/firebaseConfig';

class AdminService {
  async getUsers(): Promise<User[]> {
    const defaultOwner: User = {
      id: 'DeQd1Y2YWjQt0eFjQ4iWPThuBAJ3',
      name: 'Talk of the Town (Owner)',
      email: 'talkofthetown312@gmail.com',
      role: 'OWNER',
      branchIds: ['br_main'],
      status: 'ACTIVE',
      lastLogin: new Date().toISOString()
    };

    if (!db) return [defaultOwner];
    try {
      const q = query(collection(db, 'admin_users'));
      const snapshot = await getDocs(q);
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      
      const ownerId = 'DeQd1Y2YWjQt0eFjQ4iWPThuBAJ3';
      const hasOwner = users.some(u => u.id === ownerId || u.email === 'talkofthetown312@gmail.com');
      if (!hasOwner) {
        users.unshift(defaultOwner);
      }
      return users;
    } catch (err) {
      console.warn("Using local admin users fallback due to permission/offline state:", err);
      return [defaultOwner];
    }
  }

  async getBranches(): Promise<Branch[]> {
    const defaultBranch: Branch = {
      id: 'br_main',
      name: 'Main Flagship Branch',
      code: 'MAIN',
      address: 'Main Commercial Hub',
      phone: '+91 98765 43210',
      status: 'ACTIVE'
    };

    if (!db) return [defaultBranch];
    try {
      const q = query(collection(db, 'admin_branches'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Branch));
      }
      return [defaultBranch];
    } catch (err) {
      console.warn("Using local branch fallback:", err);
      return [defaultBranch];
    }
  }

  async getSystemConfig(): Promise<SystemConfig> {
    const defaultConfig: SystemConfig = {
      id: 'cfg_1',
      companyName: 'Talk of the Town Restaurant & ERP',
      defaultCurrency: 'INR',
      taxType: 'GST',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      timezone: 'Asia/Kolkata'
    };

    if (!db) return defaultConfig;
    try {
      const q = query(collection(db, 'admin_config'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
         return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as SystemConfig;
      }
      return defaultConfig;
    } catch (err) {
      return defaultConfig;
    }
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, 'admin_audit_logs'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AuditLog));
    } catch (err) {
      return [];
    }
  }

  async addUser(userData: Omit<User, 'id'> & { id?: string }): Promise<User> {
    if (!db) throw new Error("Firestore is not initialized");
    const newUser: User = {
      ...userData,
      id: userData.id?.trim() || `usr_${Date.now()}`
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
