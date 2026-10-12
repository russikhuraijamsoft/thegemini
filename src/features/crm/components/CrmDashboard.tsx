import React from 'react';
import { useCrmStore } from '../store/crmStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { Users, Star, Award, TrendingUp } from 'lucide-react';

export function CrmDashboard() {
  const { customers, promotions } = useCrmStore();

  const activeCustomers = customers.filter(c => c.status === 'ACTIVE').length;
  const totalPoints = customers.reduce((sum, c) => sum + c.loyaltyPoints, 0);
  const activePromos = promotions.filter(p => p.isActive).length;
  const totalVisits = customers.reduce((sum, c) => sum + c.totalVisits, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Customers" 
          value={activeCustomers.toString()}
          icon={<Users className="w-5 h-5 text-indigo-500" />}
        />
        <StatCard 
          title="Active Promos" 
          value={activePromos.toString()}
          icon={<Star className="w-5 h-5 text-amber-500" />}
        />
        <StatCard 
          title="Loyalty Points" 
          value={totalPoints.toString()}
          icon={<Award className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard 
          title="Total Visits" 
          value={totalVisits.toString()}
          icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customers.slice(0, 5).map(customer => (
                <div key={customer.id} className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {customer.firstName} {customer.lastName}
                    </p>
                    <p className="text-sm text-slate-500">{customer.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ₹{
                      customer.tier === 'PLATINUM' ? 'bg-slate-800 text-slate-200 dark:bg-slate-200 dark:text-slate-800' :
                      customer.tier === 'GOLD' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                      customer.tier === 'SILVER' ? 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300' :
                      'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                    }`}>
                      {customer.tier}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">{customer.loyaltyPoints} pts</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Promotions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {promotions.filter(p => p.isActive).map(promo => (
                <div key={promo.id} className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{promo.name}</p>
                    <p className="text-sm font-mono text-indigo-600 dark:text-indigo-400">{promo.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {promo.type === 'PERCENTAGE' ? `₹{promo.value}% OFF` : `₹₹{promo.value} OFF`}
                    </p>
                    <p className="text-xs text-slate-500">Used {promo.timesUsed} times</p>
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
