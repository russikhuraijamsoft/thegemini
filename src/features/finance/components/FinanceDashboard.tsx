import React from 'react';
import { useFinanceStore } from '../store/financeStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { DollarSign, TrendingUp, TrendingDown, Landmark } from 'lucide-react';

export function FinanceDashboard() {
  const { accounts, transactions } = useFinanceStore();

  const totalAssets = accounts.filter(a => a.type === 'ASSET').reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = accounts.filter(a => a.type === 'LIABILITY').reduce((sum, a) => sum + a.balance, 0);
  const totalRevenue = accounts.filter(a => a.type === 'INCOME').reduce((sum, a) => sum + a.balance, 0);
  const totalExpenses = accounts.filter(a => a.type === 'EXPENSE').reduce((sum, a) => sum + a.balance, 0);

  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Revenue" 
          value={`₹${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard 
          title="Total Expenses" 
          value={`₹${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          icon={<TrendingDown className="w-5 h-5 text-red-500" />}
        />
        <StatCard 
          title="Net Profit" 
          value={`₹${netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          icon={<DollarSign className="w-5 h-5 text-indigo-500" />}
        />
        <StatCard 
          title="Cash & Bank" 
          value={`₹${totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          icon={<Landmark className="w-5 h-5 text-blue-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.slice(0, 5).map(txn => (
                <div key={txn.id} className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{txn.reference}</p>
                    <p className="text-sm text-slate-500">{txn.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 dark:text-white">${txn.totalDebit.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      txn.status === 'POSTED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      txn.status === 'DRAFT' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {txn.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accounts.filter(a => a.type === 'EXPENSE').sort((a, b) => b.balance - a.balance).slice(0, 5).map(acc => (
                <div key={acc.id} className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{acc.name}</p>
                    <p className="text-sm text-slate-500">{acc.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 dark:text-white">${acc.balance.toFixed(2)}</p>
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
