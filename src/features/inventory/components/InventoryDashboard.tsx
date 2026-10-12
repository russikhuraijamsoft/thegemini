import React, { useMemo } from 'react';
import { useInventoryStore } from '../store/inventoryStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { Package, AlertTriangle, TrendingDown, RefreshCw, Archive, BarChart2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function InventoryDashboard() {
  const { items, categories, warehouses, batches } = useInventoryStore();

  const metrics = useMemo(() => {
    let totalItems = items.length;
    let totalValue = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    
    items.forEach(item => {
      totalValue += (item.currentStock * item.costPrice);
      if (item.currentStock <= 0) outOfStockCount++;
      else if (item.currentStock <= item.minimumStock) lowStockCount++;
    });

    const expiringSoon = batches.filter(b => {
      if (b.status === 'DEPLETED' || b.status === 'EXPIRED') return false;
      const expiryDate = new Date(b.expiryDate);
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 3600 * 24));
      return daysUntilExpiry > 0 && daysUntilExpiry <= 30; // Within 30 days
    }).length;

    return { totalItems, totalValue, lowStockCount, outOfStockCount, expiringSoon };
  }, [items, batches]);

  const valueByCategory = useMemo(() => {
    const data: Record<string, number> = {};
    items.forEach(item => {
      const cat = categories.find(c => c.id === item.categoryId)?.name || 'Unknown';
      data[cat] = (data[cat] || 0) + (item.currentStock * item.costPrice);
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [items, categories]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Inventory Value" 
          value={`₹${metrics.totalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          icon={<IndianRupeeIcon className="w-5 h-5 text-indigo-500" />}
          description={`${metrics.totalItems} unique items`}
        />
        <StatCard 
          title="Low Stock Alerts" 
          value={metrics.lowStockCount.toString()}
          icon={<TrendingDown className="w-5 h-5 text-amber-500" />}
          description="Items below minimum stock"
          trend="warning"
        />
        <StatCard 
          title="Out of Stock" 
          value={metrics.outOfStockCount.toString()}
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
          description="Requires immediate reorder"
          trend="danger"
        />
        <StatCard 
          title="Expiring Soon" 
          value={metrics.expiringSoon.toString()}
          icon={<Archive className="w-5 h-5 text-orange-500" />}
          description="Batches expiring in 30 days"
          trend="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><PieChartIcon className="w-5 h-5 mr-2" /> Value by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={valueByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {valueByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><BarChart2 className="w-5 h-5 mr-2" /> Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
               {/* Placeholders for action buttons that parent will provide or we can use React Router */}
               <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-500 cursor-pointer transition-colors text-center">
                 <RefreshCw className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                 <span className="font-medium text-slate-900 dark:text-white block">Physical Verification</span>
               </div>
               <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500 cursor-pointer transition-colors text-center">
                 <Package className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                 <span className="font-medium text-slate-900 dark:text-white block">Receive Stock</span>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, description, trend }: { title: string, value: string, icon: React.ReactNode, description?: string, trend?: 'success' | 'warning' | 'danger' }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
            {icon}
          </div>
        </div>
        <h3 className={`text-2xl lg:text-3xl font-bold truncate ${
          trend === 'danger' ? 'text-red-600 dark:text-red-400' :
          trend === 'warning' ? 'text-amber-600 dark:text-amber-400' :
          'text-slate-900 dark:text-white'
        }`}>{value}</h3>
        {description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{description}</p>}
      </CardContent>
    </Card>
  );
}

// Temporary icon fallbacks if not imported from lucide-react above
const IndianRupeeIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12"/><path d="M6 8h12"/><path d="m6 13 8.5 8"/><path d="M6 13h3"/><path d="M9 13c6.667 0 6.667-10 0-10"/></svg>;
const PieChartIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>;
