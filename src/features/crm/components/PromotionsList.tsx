import React from 'react';
import { useCrmStore } from '../store/crmStore';
import { Search, Plus, Filter, Tag } from 'lucide-react';

export function PromotionsList() {
  const { promotions } = useCrmStore();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search promos..." 
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
            <span>New Promo</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Promo Code</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Name</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Value</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Valid Until</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 text-center">Status</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 text-right">Uses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {promotions.map((promo) => (
                <tr key={promo.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/25 transition-colors cursor-pointer">
                  <td className="p-4 font-medium text-indigo-600 dark:text-indigo-400">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 opacity-50" />
                      {promo.code}
                    </div>
                  </td>
                  <td className="p-4 text-slate-900 dark:text-white">
                    <div className="font-medium">{promo.name}</div>
                    <div className="text-sm text-slate-500">{promo.description}</div>
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">
                    {promo.type === 'PERCENTAGE' ? `₹{promo.value}%` : `₹₹{promo.value}`}
                  </td>
                  <td className="p-4 text-slate-500">
                    {new Date(promo.endDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 text-xs font-medium rounded-full ₹{
                      promo.isActive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {promo.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right text-slate-500 font-medium">
                    {promo.timesUsed} {promo.usageLimit ? `/ ₹{promo.usageLimit}` : ''}
                  </td>
                </tr>
              ))}
              {promotions.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No promotions found.
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
