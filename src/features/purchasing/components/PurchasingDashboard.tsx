import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { usePurchasingStore } from '../store/purchasingStore';
import { TrendingUp, FileText, Truck, Users } from 'lucide-react';

export function PurchasingDashboard() {
  const { suppliers, purchaseOrders } = usePurchasingStore();

  const totalValue = purchaseOrders.reduce((sum, po) => sum + po.grandTotal, 0);
  const pendingApprovals = purchaseOrders.filter(po => po.status === 'PENDING_APPROVAL').length;
  const pendingDeliveries = purchaseOrders.filter(po => po.status === 'APPROVED' || po.status === 'PARTIAL').length;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Monthly Spend" 
          value={`₹${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard 
          title="Pending Approvals" 
          value={pendingApprovals.toString()}
          icon={<FileText className="w-5 h-5 text-amber-500" />}
        />
        <StatCard 
          title="Outstanding Deliveries" 
          value={pendingDeliveries.toString()}
          icon={<Truck className="w-5 h-5 text-blue-500" />}
        />
        <StatCard 
          title="Active Suppliers" 
          value={suppliers.filter(s => s.status === 'ACTIVE').length.toString()}
          icon={<Users className="w-5 h-5 text-indigo-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Purchase Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {purchaseOrders.slice(0, 5).map(po => (
                <div key={po.id} className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{po.poNumber}</p>
                    <p className="text-sm text-slate-500">{po.supplierName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 dark:text-white">${po.grandTotal.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      po.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      po.status === 'PENDING_APPROVAL' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {po.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Supplier Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suppliers.slice(0, 5).map(supplier => (
                <div key={supplier.id} className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{supplier.name}</p>
                    <p className="text-sm text-slate-500">{supplier.category}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-amber-400">★</span>
                    <span className="font-medium text-slate-900 dark:text-white">{supplier.rating.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
            {icon}
          </div>
        </div>
        <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white truncate">{value}</h3>
      </CardContent>
    </Card>
  );
}
