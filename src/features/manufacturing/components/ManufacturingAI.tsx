import React, { useState } from 'react';
import { useManufacturingStore } from '../store/manufacturingStore';
import { Brain, TrendingUp, TrendingDown, DollarSign, Activity, AlertTriangle, Lightbulb } from 'lucide-react';
import { calculateSellingPriceRecommendation } from '../utils/costCalculator';

export function ManufacturingAI() {
  const { recipes, productionOrders } = useManufacturingStore();
  const [analyzing, setAnalyzing] = useState(false);

  // Sorting recipes by profitability
  const sortedByProfit = [...recipes].sort((a, b) => (b.costing?.marginPercentage || 0) - (a.costing?.marginPercentage || 0));
  const mostProfitable = sortedByProfit.slice(0, 3);
  const leastProfitable = sortedByProfit.slice(-3).reverse();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-md flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center mb-2"><Brain className="w-6 h-6 mr-2" /> AI Menu Engineering</h2>
          <p className="text-indigo-100">Automatically analyze recipes, profitability, and ingredient impacts to optimize your menu.</p>
        </div>
        <button 
          onClick={() => {
            setAnalyzing(true);
            setTimeout(() => setAnalyzing(false), 1500);
          }}
          disabled={analyzing}
          className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold shadow-sm hover:bg-indigo-50 transition-colors disabled:opacity-80 flex items-center"
        >
          {analyzing ? (
            <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div> Analyzing...</>
          ) : (
            <><Brain className="w-4 h-4 mr-2" /> Run AI Analysis</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[400px]">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center bg-slate-50 dark:bg-slate-800/50">
            <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Most Profitable Recipes</h3>
          </div>
          <div className="p-4 overflow-y-auto flex-1 space-y-4">
            {mostProfitable.map(r => (
              <div key={r.id} className="flex justify-between items-center p-3 bg-green-50/50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/30">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{r.name}</p>
                  <p className="text-xs text-slate-500">Margin: {r.costing?.marginPercentage.toFixed(1)}%</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600 dark:text-green-400">₹{r.costing?.grossProfit.toFixed(2)} / unit</p>
                </div>
              </div>
            ))}
            {mostProfitable.length === 0 && <p className="text-slate-500 text-sm italic">Not enough data.</p>}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[400px]">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center bg-slate-50 dark:bg-slate-800/50">
            <TrendingDown className="w-5 h-5 text-red-500 mr-2" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Least Profitable Recipes</h3>
          </div>
          <div className="p-4 overflow-y-auto flex-1 space-y-4">
            {leastProfitable.map(r => (
              <div key={r.id} className="flex justify-between items-center p-3 bg-red-50/50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{r.name}</p>
                  <p className="text-xs text-slate-500">Margin: {r.costing?.marginPercentage.toFixed(1)}%</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600 dark:text-red-400">₹{r.costing?.grossProfit.toFixed(2)} / unit</p>
                </div>
              </div>
            ))}
            {leastProfitable.length === 0 && <p className="text-slate-500 text-sm italic">Not enough data.</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center bg-slate-50 dark:bg-slate-800/50">
            <Lightbulb className="w-5 h-5 text-amber-500 mr-2" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Suggested Selling Price Adjustments</h3>
          </div>
          <div className="p-4 space-y-4">
            {recipes.filter(r => (r.costing?.marginPercentage || 0) < 30).slice(0, 3).map(r => {
              const suggested = calculateSellingPriceRecommendation(r.costing?.totalCost || 0, 30);
              return (
                <div key={r.id} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-slate-900 dark:text-white">{r.name}</span>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">Target: 30% Margin</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Current Price: ₹{r.costing?.sellingPrice}</span>
                    <span className="text-slate-900 dark:text-white font-bold">Suggested: ₹{suggested.toFixed(2)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center bg-slate-50 dark:bg-slate-800/50">
            <AlertTriangle className="w-5 h-5 text-rose-500 mr-2" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Waste Analysis</h3>
          </div>
          <div className="p-4 space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">AI identified recipes with high production waste:</p>
            {productionOrders.filter(o => o.wasteQuantity && o.wasteQuantity > 0).slice(0, 3).map(o => (
               <div key={o.id} className="p-3 border border-rose-200 dark:border-rose-900/50 rounded-lg bg-rose-50 dark:bg-rose-900/10">
                 <div className="flex justify-between items-center mb-1">
                   <span className="font-medium text-slate-900 dark:text-white">{o.recipeName} (Batch {o.batchNumber})</span>
                   <span className="text-rose-600 font-bold">{o.wasteQuantity} {o.unit} wasted</span>
                 </div>
                 <p className="text-xs text-slate-500">Reason: {o.wasteReason || 'Unknown'}</p>
               </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
