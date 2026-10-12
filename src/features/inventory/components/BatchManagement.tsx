import React, { useState } from 'react';
import { useInventoryStore } from '../store/inventoryStore';
import { Search, Archive } from 'lucide-react';
import { ItemBatch } from '../models/inventory';

export function BatchManagement() {
  const { batches, items, warehouses } = useInventoryStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredBatches = batches.filter(batch => {
    const item = items.find(i => i.id === batch.itemId);
    const searchString = `${batch.batchNumber} ${item?.name || ''}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const getItemName = (id: string) => items.find(i => i.id === id)?.name || 'Unknown Item';
  const getWarehouseName = (id: string) => warehouses.find(w => w.id === id)?.name || 'Unknown Warehouse';

  const getDaysUntilExpiry = (expiryDate: string) => {
    const days = Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (1000 * 3600 * 24));
    return days;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search batch or item name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 md:w-80"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700/50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Batch Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Warehouse</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Expiry Date</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {filteredBatches.map((batch) => {
              const daysToExpiry = getDaysUntilExpiry(batch.expiryDate);
              const isExpired = daysToExpiry < 0;
              const isExpiringSoon = daysToExpiry >= 0 && daysToExpiry <= 30;

              return (
                <tr key={batch.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                    {batch.batchNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                    {getItemName(batch.itemId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {getWarehouseName(batch.warehouseId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-900 dark:text-white font-medium">
                    {batch.currentQuantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className={`${isExpired ? 'text-red-600 dark:text-red-400 font-medium' : isExpiringSoon ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                      {new Date(batch.expiryDate).toLocaleDateString()}
                    </div>
                    {isExpired && <div className="text-xs text-red-500">Expired</div>}
                    {isExpiringSoon && <div className="text-xs text-amber-500">Expiring in {daysToExpiry} days</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      batch.status === 'ACTIVE' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      batch.status === 'EXPIRED' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                      batch.status === 'DEPLETED' ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300' :
                      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {batch.status}
                    </span>
                  </td>
                </tr>
              );
            })}
            {filteredBatches.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  <Archive className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  No batches found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
