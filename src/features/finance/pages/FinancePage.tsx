import React, { useState, useEffect } from 'react';
import { useFinanceStore } from '../store/financeStore';
import { FinanceDashboard } from '../components/FinanceDashboard';
import { AccountsList } from '../components/AccountsList';
import { TransactionsList } from '../components/TransactionsList';
import { LayoutDashboard, BookOpen, Receipt, FileText } from 'lucide-react';

export function FinancePage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'accounts' | 'transactions' | 'reports'>('dashboard');
  const { loadAccounts, loadTransactions, loading } = useFinanceStore();

  useEffect(() => {
    loadAccounts();
    loadTransactions();
  }, [loadAccounts, loadTransactions]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'accounts', label: 'Chart of Accounts', icon: BookOpen },
    { id: 'transactions', label: 'Journal Entries', icon: Receipt },
    { id: 'reports', label: 'Financial Reports', icon: FileText },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Finance & Accounting</h1>
          <p className="text-slate-500 mt-1">Manage accounts, journal entries, and financial statements</p>
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
          {activeTab === 'dashboard' && <FinanceDashboard />}
          {activeTab === 'accounts' && <AccountsList />}
          {activeTab === 'transactions' && <TransactionsList />}
          {activeTab === 'reports' && (
            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
              <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Financial Reports</h3>
              <p className="text-slate-500 max-w-md">
                Select a report to generate. Available reports include Profit & Loss, Balance Sheet, and Trial Balance.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700">Profit & Loss</button>
                <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700">Balance Sheet</button>
                <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700">Trial Balance</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
