import React from 'react';
import { useManufacturingStore } from '../store/manufacturingStore';
import { TrendingUp, Package, AlertTriangle, CheckCircle2, Factory, ClipboardList } from 'lucide-react';

export function ManufacturingDashboard() {
  const { productionOrders, recipes } = useManufacturingStore();

  const activeOrders = productionOrders.filter(o => o.status === 'IN_PROGRESS');
  const completedOrders = productionOrders.filter(o => o.status === 'COMPLETED');
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Active Production</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{activeOrders.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Factory className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Recipes Managed</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{recipes.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Batches Completed</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{completedOrders.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Avg Yield Variance</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">-2.4%</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900 dark:text-white text-lg">Active Batches</h3>
            <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">View All</button>
          </div>
          <div className="p-0 overflow-auto max-h-[400px]">
            {activeOrders.length === 0 ? (
               <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                 No active production batches.
               </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 sticky top-0">
                  <tr>
                    <th className="px-5 py-3 font-medium">Batch No.</th>
                    <th className="px-5 py-3 font-medium">Recipe</th>
                    <th className="px-5 py-3 font-medium text-right">Target Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activeOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-4 font-medium text-indigo-600 dark:text-indigo-400">{order.batchNumber}</td>
                      <td className="px-5 py-4 text-slate-900 dark:text-white font-medium">{order.recipeName}</td>
                      <td className="px-5 py-4 text-right text-slate-600 dark:text-slate-300">{order.plannedQuantity} {order.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900 dark:text-white text-lg">Recent Recipes</h3>
            <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">View All</button>
          </div>
          <div className="p-0 overflow-auto max-h-[400px]">
             {recipes.length === 0 ? (
               <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                 No recipes found.
               </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 sticky top-0">
                  <tr>
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium text-right">Yield</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recipes.slice(0, 5).map(recipe => (
                    <tr key={recipe.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-4 text-slate-900 dark:text-white font-medium">{recipe.name}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          recipe.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {recipe.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right text-slate-600 dark:text-slate-300">{recipe.yieldQuantity} {recipe.yieldUnit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
