import React, { useState, useEffect } from 'react';
import { useReportsStore } from '../store/reportsStore';
import { ReportsDashboard } from '../components/ReportsDashboard';
import { LayoutDashboard, FileBarChart, PieChart, ShoppingBag, Users, Wallet } from 'lucide-react';

export function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sales' | 'inventory' | 'kitchen' | 'crm' | 'finance'>('dashboard');
  const { loadReports, loading } = useReportsStore();

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const tabs = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'sales', label: 'Sales & POS', icon: FileBarChart },
    { id: 'inventory', label: 'Inventory', icon: ShoppingBag },
    { id: 'kitchen', label: 'Kitchen', icon: PieChart },
    { id: 'crm', label: 'CRM', icon: Users },
    { id: 'finance', label: 'Finance', icon: Wallet },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-slate-500 mt-1">Comprehensive business intelligence and reporting</p>
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

      {loading && activeTab === 'dashboard' ? (
        <div className="flex items-center justify-center h-64 text-slate-500">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="py-2">
          {activeTab === 'dashboard' && <ReportsDashboard />}
          {activeTab !== 'dashboard' && (
            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
              <FileBarChart className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                {tabs.find(t => t.id === activeTab)?.label} Reports
              </h3>
              <p className="text-slate-500 max-w-md">
                Detailed reporting for this module. Select a specific report type to generate.
              </p>
              <div className="mt-6">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Generate Report
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
