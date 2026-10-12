import React, { useState } from 'react';
import { useManufacturingStore } from '../store/manufacturingStore';
import { useInventoryStore } from '../../inventory/store/inventoryStore';
import { ShoppingCart, AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react';

export function ManufacturingPurchasing() {
  const { recipes, productionOrders } = useManufacturingStore();
  const { items: inventoryItems } = useInventoryStore();
  const [forecastDays, setForecastDays] = useState(7);
  
  // Calculate historical daily consumption
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  const recentOrders = productionOrders.filter(o => 
    (o.status === 'COMPLETED' || o.status === 'IN_PROGRESS') && 
    new Date(o.createdAt).getTime() >= thirtyDaysAgo
  );

  const consumptionMap = new Map<string, { unit: string, qty: number }>();
  recentOrders.forEach(order => {
     const recipe = recipes.find(r => r.id === order.recipeId);
     if (recipe) {
       const ratio = (order.actualQuantity || order.plannedQuantity) / recipe.yieldQuantity;
       recipe.ingredients.forEach(ing => {
         if (!consumptionMap.has(ing.itemName)) consumptionMap.set(ing.itemName, { unit: ing.unit, qty: 0 });
         consumptionMap.get(ing.itemName)!.qty += ing.quantity * ratio;
       });
     }
  });

  // Calculate daily average consumption
  const dailyConsumption = new Map<string, number>();
  consumptionMap.forEach((data, itemName) => {
    dailyConsumption.set(itemName, data.qty / 30);
  });

  const recommendations = inventoryItems.map(item => {
    const daily = dailyConsumption.get(item.name) || 0;
    const forecastedNeed = daily * forecastDays;
    const projectedStock = item.currentStock - forecastedNeed;
    
    let recommendation = 0;
    let status = 'OK';
    
    if (projectedStock <= item.minimumStock) {
      recommendation = (item.reorderLevel > 0 ? item.reorderLevel : item.minimumStock * 2) - projectedStock;
      status = 'REORDER';
    } else if (item.currentStock <= item.minimumStock) {
      recommendation = (item.reorderLevel > 0 ? item.reorderLevel : item.minimumStock * 2) - item.currentStock;
      status = 'CRITICAL';
    }

    return {
      ...item,
      daily,
      forecastedNeed,
      projectedStock,
      recommendation,
      status
    };
  }).filter(r => r.recommendation > 0 || r.daily > 0).sort((a, b) => b.recommendation - a.recommendation);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
            <ShoppingCart className="w-6 h-6 mr-2 text-indigo-500" /> 
            Smart Purchasing Recommendations
          </h2>
          <p className="text-sm text-slate-500 mt-1">AI-driven inventory forecasting based on actual production consumption and minimum stock levels.</p>
        </div>
        <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">Forecast Window:</label>
          <select 
            value={forecastDays}
            onChange={(e) => setForecastDays(Number(e.target.value))}
            className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-900 dark:text-white"
          >
            <option value={3}>Next 3 Days</option>
            <option value={7}>Next 7 Days</option>
            <option value={14}>Next 14 Days</option>
            <option value={30}>Next 30 Days</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current Stock</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Daily Avg</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{forecastDays}d Forecast</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Projected</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Recommended Order</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
              {recommendations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3 opacity-50" />
                    <p className="text-lg">Inventory levels are healthy.</p>
                    <p className="text-sm">No purchasing recommended for the selected forecast window.</p>
                  </td>
                </tr>
              ) : (
                recommendations.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                      {item.name}
                      <p className="text-xs text-slate-500 mt-0.5">Min: {item.minimumStock}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white text-right">
                      {item.currentStock} {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400 text-right">
                      {item.daily > 0 ? item.daily.toFixed(2) : '-'} {item.unit}/day
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400 text-right">
                      {item.forecastedNeed > 0 ? item.forecastedNeed.toFixed(2) : '-'} {item.unit}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${item.projectedStock <= item.minimumStock ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                      {item.projectedStock.toFixed(2)} {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600 dark:text-indigo-400 text-right bg-indigo-50/30 dark:bg-indigo-900/10">
                      {item.recommendation > 0 ? `${item.recommendation.toFixed(2)} ${item.unit}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      {item.status === 'CRITICAL' ? (
                         <span className="px-2 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 flex items-center justify-center w-max mx-auto">
                           <AlertTriangle className="w-3 h-3 mr-1" /> Critical
                         </span>
                      ) : item.status === 'REORDER' ? (
                         <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 flex items-center justify-center w-max mx-auto">
                           <TrendingUp className="w-3 h-3 mr-1" /> Reorder Soon
                         </span>
                      ) : (
                         <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center w-max mx-auto">
                           <CheckCircle2 className="w-3 h-3 mr-1" /> Healthy
                         </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
