import React from 'react';
import { usePurchasingStore } from '../store/purchasingStore';
import { Search, Plus, Filter, FileText } from 'lucide-react';

export function PurchaseOrdersList() {
  const { purchaseOrders } = usePurchasingStore();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search PO number or supplier..." 
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
            <span>Create PO</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">PO Number</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Supplier</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Date</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Expected</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 text-right">Amount</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 text-center">Status</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {purchaseOrders.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/25 transition-colors cursor-pointer">
                  <td className="p-4 font-medium text-indigo-600 dark:text-indigo-400">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 opacity-50" />
                      {po.poNumber}
                    </div>
                  </td>
                  <td className="p-4 font-medium text-slate-900 dark:text-white">
                    {po.supplierName}
                  </td>
                  <td className="p-4 text-slate-500">
                    {new Date(po.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-slate-500">
                    {new Date(po.expectedDeliveryDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right font-bold text-slate-900 dark:text-white">
                    ${po.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 text-xs font-medium rounded-full ${
                      po.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      po.status === 'PENDING_APPROVAL' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                      po.status === 'DRAFT' ? 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300' :
                      po.status === 'REJECTED' || po.status === 'CANCELLED' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {po.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {purchaseOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No purchase orders found</h3>
                      <p className="text-slate-500 max-w-sm mx-auto mb-6">
                        You haven't created any purchase orders yet. Start by creating a new PO.
                      </p>
                      <button className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        <Plus className="w-4 h-4" />
                        <span>Create PO</span>
                      </button>
                    </div>
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
