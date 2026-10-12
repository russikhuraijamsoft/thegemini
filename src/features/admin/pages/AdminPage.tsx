import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../store/adminStore';
import { AdminDashboard } from '../components/AdminDashboard';
import { UserManagement } from '../components/UserManagement';
import { BranchManagement } from '../components/BranchManagement';
import { SystemConfigForm } from '../components/SystemConfigForm';
import { HardwareConfigCard } from '../components/HardwareConfigCard';
import { Settings, Users, Building, ShieldCheck, Printer } from 'lucide-react';

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'branches' | 'peripherals' | 'config'>('dashboard');
  const { loadAdminData, loading } = useAdminStore();

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const tabs = [
    { id: 'dashboard', label: 'System Overview', icon: ShieldCheck },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'branches', label: 'Branches', icon: Building },
    { id: 'peripherals', label: 'Hardware & Cross-Platform', icon: Printer },
    { id: 'config', label: 'Configuration', icon: Settings },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Administration & Configuration</h1>
          <p className="text-slate-500 mt-1">Manage users, branches, and system settings</p>
        </div>
      </div>

      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="-mb-px flex space-x-6 overflow-x-auto no-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                  ${isActive 
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'}
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-slate-500">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="py-2">
          {activeTab === 'dashboard' && <AdminDashboard />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'branches' && <BranchManagement />}
          {activeTab === 'peripherals' && <HardwareConfigCard />}
          {activeTab === 'config' && <SystemConfigForm />}
        </div>
      )}
    </div>
  );
}
