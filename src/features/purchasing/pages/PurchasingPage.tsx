import React, { useState, useEffect } from 'react';
import { usePurchasingStore } from '../store/purchasingStore';
import { PurchasingDashboard } from '../components/PurchasingDashboard';
import { SupplierList } from '../components/SupplierList';
import { PurchaseOrdersList } from '../components/PurchaseOrdersList';
import { LayoutDashboard, Users, FileText, Truck } from 'lucide-react';

export function PurchasingPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'suppliers' | 'pos' | 'grn'>('dashboard');
  const { loadSuppliers, loadPurchaseOrders, loading } = usePurchasingStore();

  useEffect(() => {
    loadSuppliers();
    loadPurchaseOrders();
  }, [loadSuppliers, loadPurchaseOrders]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'suppliers', label: 'Suppliers', icon: Users },
    { id: 'pos', label: 'Purchase Orders', icon: FileText },
    { id: 'grn', label: 'Goods Receiving', icon: Truck },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Purchasing & Suppliers</h1>
          <p className="text-slate-500 mt-1">Manage suppliers, purchase orders, and receiving</p>
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
          {activeTab === 'dashboard' && <PurchasingDashboard />}
          {activeTab === 'suppliers' && <SupplierList />}
          {activeTab === 'pos' && <PurchaseOrdersList />}
          {activeTab === 'grn' && (
            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
              <Truck className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Goods Receiving Note (GRN)</h3>
              <p className="text-slate-500 max-w-md">
                Select a Purchase Order to receive goods or scan a delivery barcode to automatically match items.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
