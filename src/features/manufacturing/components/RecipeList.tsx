import React, { useState } from 'react';
import { useManufacturingStore } from '../store/manufacturingStore';
import { Plus, Search, Filter, ScrollText, Clock, DollarSign } from 'lucide-react';
import { RecipeForm } from './RecipeForm';

export function RecipeList() {
  const { recipes } = useManufacturingStore();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full relative">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search recipes..."
              className="pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
          <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 bg-white dark:bg-slate-800 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> New Recipe
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400 py-12">
            <ScrollText className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" />
            <p>No recipes found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map(recipe => (
              <div key={recipe.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors bg-white dark:bg-slate-800 shadow-sm flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{recipe.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{recipe.description}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                    recipe.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800'
                      : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}>
                    {recipe.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mt-4 mb-4">
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> Time
                    </div>
                    <div className="font-medium text-slate-900 dark:text-white">
                      {recipe.prepTimeMinutes + recipe.cookTimeMinutes}m
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center">
                      <DollarSign className="w-3 h-3 mr-1" /> Cost
                    </div>
                    <div className="font-medium text-slate-900 dark:text-white">
                      ₹{recipe.costing?.totalCost?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg border ${
                    (recipe.costing?.marginPercentage || 0) >= 55 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400' 
                      : (recipe.costing?.marginPercentage || 0) >= 40 
                        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
                  }`}>
                    <div className="text-xs opacity-80 mb-1 flex items-center">
                      Margin
                    </div>
                    <div className="font-bold">
                      {recipe.costing?.marginPercentage?.toFixed(1) || '0.0'}%
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Yield: <span className="font-medium text-slate-700 dark:text-slate-300">{recipe.yieldQuantity} {recipe.yieldUnit}</span>
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    v{recipe.version}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {showForm && <RecipeForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
