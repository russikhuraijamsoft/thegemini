export type Role = 'OWNER' | 'ADMIN' | 'MANAGER' | 'ACCOUNTANT' | 'HR' | 'CASHIER' | 'CHEF' | 'WAITER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  branchIds: string[];
  status: 'ACTIVE' | 'INACTIVE';
  lastLogin?: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  fssaiNumber?: string;
  gstin?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface SystemConfig {
  id: string;
  companyName: string;
  defaultCurrency: string;
  taxType: string;
  dateFormat: string;
  timeFormat: string;
  timezone: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  details: string;
  timestamp: string;
}
