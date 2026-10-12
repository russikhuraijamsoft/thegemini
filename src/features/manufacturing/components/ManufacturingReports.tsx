import React, { useState } from 'react';
import { useManufacturingStore } from '../store/manufacturingStore';
import { FileText, Download, TrendingUp, AlertTriangle, Printer } from 'lucide-react';

export function ManufacturingReports() {
  const { recipes, productionOrders } = useManufacturingStore();
  const [activeReport, setActiveReport] = useState<'RECIPE_COST' | 'CONSUMPTION' | 'PRODUCTION' | 'YIELD'>('RECIPE_COST');

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Manufacturing Reports</h2>
        <div className="flex space-x-2">
          <select 
            value={activeReport}
            onChange={e => setActiveReport(e.target.value as any)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="RECIPE_COST">Recipe Cost & Profitability</option>
            <option value="CONSUMPTION">Ingredient Consumption</option>
            <option value="PRODUCTION">Batch Production Report</option>
            <option value="YIELD">Yield & Waste Analysis</option>
          </select>
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors"
          >
            <Download className="w-4 h-4 mr-2" /> Export
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeReport === 'RECIPE_COST' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Recipe Cost & Profitability Report</h3>
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Recipe</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Food Cost</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Utilities</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Cost</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Selling Price</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Food Cost %</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Margin %</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                {recipes.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white text-right">₹{item.costing?.ingredientsCost?.toFixed(2) || '0.00'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white text-right">₹{((item.costing?.gasCost || 0) + (item.costing?.electricityCost || 0) + (item.costing?.waterCost || 0)).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white text-right font-bold">₹{item.costing?.totalCost?.toFixed(2) || '0.00'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white text-right">₹{item.costing?.sellingPrice?.toFixed(2) || '0.00'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white text-right">
                      {item.costing?.sellingPrice > 0 ? ((item.costing.totalCost / item.costing.sellingPrice) * 100).toFixed(1) + '%' : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white text-right font-bold text-green-600 dark:text-green-400">{item.costing?.marginPercentage?.toFixed(1) || '0.0'}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === 'PRODUCTION' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Batch Production Report</h3>
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Batch No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Recipe</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Target Qty</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actual Qty</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                {productionOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">{new Date(order.plannedDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 dark:text-indigo-400">{order.batchNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">{order.recipeName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white text-right">{order.plannedQuantity} {order.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white text-right font-medium">{order.actualQuantity || '-'} {order.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                        order.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === 'CONSUMPTION' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Estimated Ingredient Consumption</h3>
            <p className="text-sm text-slate-500 mb-4">Based on active and completed production orders.</p>
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ingredient</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Estimated Qty Consumed</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                {Array.from(
                  productionOrders.reduce((acc, order) => {
                    const recipe = recipes.find(r => r.id === order.recipeId);
                    if (recipe && (order.status === 'COMPLETED' || order.status === 'IN_PROGRESS')) {
                       const ratio = (order.actualQuantity || order.plannedQuantity) / recipe.yieldQuantity;
                       recipe.ingredients.forEach(ing => {
                         if (!acc.has(ing.itemName)) acc.set(ing.itemName, { unit: ing.unit, qty: 0 });
                         acc.get(ing.itemName)!.qty += ing.quantity * ratio;
                       });
                    }
                    return acc;
                  }, new Map<string, {unit: string, qty: number}>()).entries()
                ).map(([itemName, data]) => (
                  <tr key={itemName} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{itemName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white text-right font-medium">{data.qty.toFixed(2)} {data.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === 'YIELD' && (
           <div className="space-y-4">
             <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Yield & Waste Analysis</h3>
             <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
               <thead className="bg-slate-50 dark:bg-slate-800/50">
                 <tr>
                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Batch No</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Recipe</th>
                   <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Planned Qty</th>
                   <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actual Qty</th>
                   <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Waste</th>
                   <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Yield %</th>
                 </tr>
               </thead>
               <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                 {productionOrders.filter(o => o.status === 'COMPLETED').map((order) => {
                   const yieldPercent = (order.actualQuantity || 0) / order.plannedQuantity * 100;
                   return (
                   <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 dark:text-indigo-400">{order.batchNumber}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">{order.recipeName}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white text-right">{order.plannedQuantity} {order.unit}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white text-right font-medium">{order.actualQuantity || 0} {order.unit}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-rose-600 dark:text-rose-400 text-right">{order.wasteQuantity || 0} {order.unit}</td>
                     <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold ${yieldPercent < 90 ? 'text-amber-500' : 'text-green-500'}`}>
                       {yieldPercent.toFixed(1)}%
                     </td>
                   </tr>
                 )})}
               </tbody>
             </table>
           </div>
        )}
      </div>
    </div>
  );
}
