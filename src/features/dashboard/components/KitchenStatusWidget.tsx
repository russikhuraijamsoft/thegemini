import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { ChefHat, Clock, AlertCircle } from 'lucide-react';

export function KitchenStatusWidget() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-slate-500" />
          Kitchen Status
        </CardTitle>
        <span className="px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-xs font-medium border border-amber-200 dark:border-amber-800">
          Busy
        </span>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">12</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Open Tickets</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">14m</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Avg Prep Time</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/50">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">3</p>
            <p className="text-xs text-red-600 dark:text-red-400">Delayed</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Delayed Tickets</h4>
          
          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 flex items-center justify-center font-bold text-sm">
                #42
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Table 4</p>
                <p className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3"/> 24 min ago</p>
              </div>
            </div>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>

          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 flex items-center justify-center font-bold text-sm">
                #45
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Takeout - John</p>
                <p className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3"/> 21 min ago</p>
              </div>
            </div>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
