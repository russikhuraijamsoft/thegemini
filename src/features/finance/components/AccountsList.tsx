import React, { useState } from 'react';
import { useFinanceStore } from '../store/financeStore';
import { Search, Plus, Filter } from 'lucide-react';

export function AccountsList() {
  const { accounts } = useFinanceStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAccounts = accounts.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.code.includes(searchTerm)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search accounts..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Account</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Code</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Account Name</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Type</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Group</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 text-right">Balance</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/25 transition-colors cursor-pointer">
                  <td className="p-4 font-medium text-slate-900 dark:text-white">
                    {account.code}
                  </td>
                  <td className="p-4 font-medium text-slate-900 dark:text-white">
                    {account.name}
                  </td>
                  <td className="p-4 text-slate-500">
                    {account.type}
                  </td>
                  <td className="p-4 text-slate-500">
                    {account.group.replace(/_/g, ' ')}
                  </td>
                  <td className="p-4 text-right font-bold text-slate-900 dark:text-white">
                    ${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 text-xs font-medium rounded-full ${
                      account.isActive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {account.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredAccounts.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
