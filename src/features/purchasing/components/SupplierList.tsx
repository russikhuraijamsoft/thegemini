import React from 'react';
import { usePurchasingStore } from '../store/purchasingStore';
import { Card, CardContent } from '../../../shared/components/ui/Card';
import { Search, Plus, Filter, MoreVertical, ShoppingCart } from 'lucide-react';

export function SupplierList() {
  const { suppliers } = usePurchasingStore();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search suppliers..." 
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
            <span>New Supplier</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No suppliers found</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-6">
              Add your first supplier to start creating purchase orders and tracking inventory costs.
            </p>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span>New Supplier</span>
            </button>
          </div>
        ) : (
          suppliers.map(supplier => (
            <Card key={supplier.id} className="hover:border-indigo-500/50 transition-colors">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1">{supplier.name}</h3>
                    <p className="text-sm text-slate-500">{supplier.category}</p>
                  </div>
                  <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-400">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Contact:</span>
                    <span className="font-medium truncate ml-2">{supplier.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Phone:</span>
                    <span className="font-medium">{supplier.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Balance:</span>
                    <span className={`font-medium ${supplier.outstandingBalance > 0 ? 'text-amber-600 dark:text-amber-400' : ''}`}>
                      ${supplier.outstandingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                    <span className="text-amber-400 text-xs">★</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{supplier.rating.toFixed(1)}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    supplier.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                    supplier.status === 'BLACKLISTED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {supplier.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
