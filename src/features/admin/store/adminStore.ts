import { create } from 'zustand';
import { User, Branch, SystemConfig, AuditLog } from '../models/admin';
import { adminService } from '../services/adminService';

interface AdminState {
  users: User[];
  branches: Branch[];
  config: SystemConfig | null;
  logs: AuditLog[];
  loading: boolean;
  error: string | null;

  loadAdminData: () => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
  users: [],
  branches: [],
  config: null,
  logs: [],
  loading: false,
  error: null,

  loadAdminData: async () => {
    set({ loading: true, error: null });
    try {
      const [users, branches, config, logs] = await Promise.all([
        adminService.getUsers(),
        adminService.getBranches(),
        adminService.getSystemConfig(),
        adminService.getAuditLogs()
      ]);
      set({ users, branches, config, logs, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  }
}));
