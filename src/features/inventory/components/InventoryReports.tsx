import React, { useState } from 'react';
import { useInventoryStore } from '../store/inventoryStore';
import { FileText, Download, TrendingUp, AlertTriangle } from 'lucide-react';

export function InventoryReports() {
  const { items, batches, cycleCounts } = useInventoryStore();
  const [activeReport, setActiveReport] = useState<'VALUATION' | 'EXPIRY' | 'ABC' | 'STOCK_LEDGER'>('VALUATION');

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Inventory Reports</h2>
        <div className="flex space-x-2">
          <select 
            value={activeReport}
            onChange={e => setActiveReport(e.target.value as any)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="VALUATION">Inventory Valuation</option>
            <option value="EXPIRY">Expiry Report</option>
            <option value="ABC">ABC Analysis</option>
            <option value="STOCK_LEDGER">Stock Ledger / Movement</option>
          </select>
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors"
          >
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeReport === 'VALUATION' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Current Valuation by Item</h3>
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current Stock</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Unit Cost</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Value</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white text-right">{item.currentStock} {item.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white text-right">₹{item.costPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white text-right font-bold">₹{(item.currentStock * item.costPrice).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === 'EXPIRY' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4 flex items-center">
               <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" /> 
               Upcoming Expiries (Next 30 Days)
            </h3>
            {batches.filter(b => b.status !== 'EXPIRED' && b.status !== 'DEPLETED' && Math.ceil((new Date(b.expiryDate).getTime() - Date.now()) / (1000 * 3600 * 24)) <= 30).length === 0 ? (
              <p className="text-slate-500">No items expiring within the next 30 days.</p>
            ) : (
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Batch</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Expiry Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                  {batches.filter(b => b.status !== 'EXPIRED' && b.status !== 'DEPLETED' && Math.ceil((new Date(b.expiryDate).getTime() - Date.now()) / (1000 * 3600 * 24)) <= 30).map((batch) => (
                    <tr key={batch.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">{batch.batchNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white text-right">{batch.currentQuantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">{new Date(batch.expiryDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {(activeReport === 'ABC' || activeReport === 'STOCK_LEDGER') && (
           <div className="flex flex-col items-center justify-center py-12 text-slate-500">
             <TrendingUp className="w-12 h-12 mb-4 text-slate-300" />
             <p className="text-lg">This report is being generated based on transaction history...</p>
           </div>
        )}
      </div>
    </div>
  );
}
