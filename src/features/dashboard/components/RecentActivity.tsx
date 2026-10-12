import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { Activity, ShoppingCart, UserMinus, PackageCheck, Banknote } from 'lucide-react';

export function RecentActivity() {
  const activities = [
    { id: 1, type: 'order', text: 'New order #1042 placed via Online Delivery', time: '2 mins ago', icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { id: 2, type: 'inventory', text: 'Purchase Order PO-2023 received in full', time: '15 mins ago', icon: PackageCheck, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { id: 3, type: 'void', text: 'Item voided on Ticket #1038 by Manager (Elena)', time: '45 mins ago', icon: UserMinus, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
    { id: 4, type: 'payout', text: 'Cash drawer payout: ₹1,500.00 for Supplies', time: '1 hour ago', icon: Banknote, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="w-5 h-5 text-slate-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="relative border-l border-slate-200 dark:border-slate-700 ml-3 space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="relative pl-6">
              <span className={`absolute -left-[17px] w-8 h-8 rounded-full ${activity.bg} flex items-center justify-center ring-4 ring-white dark:ring-slate-800`}>
                <activity.icon className={`w-4 h-4 ${activity.color}`} />
              </span>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {activity.text}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
