import React, { useEffect, useState } from 'react';
import { useManufacturingStore } from '../store/manufacturingStore';
import { Settings, ClipboardList, PackagePlus, ScrollText, Layers, TrendingUp, Brain, FileText, ShoppingCart } from 'lucide-react';
import { RecipeList } from '../components/RecipeList';
import { ProductionOrderList } from '../components/ProductionOrderList';
import { ManufacturingDashboard } from '../components/ManufacturingDashboard';
import { ManufacturingAI } from '../components/ManufacturingAI';
import { ManufacturingReports } from '../components/ManufacturingReports';
import { ManufacturingPurchasing } from '../components/ManufacturingPurchasing';

type TabType = 'DASHBOARD' | 'RECIPES' | 'PRODUCTION' | 'PURCHASING' | 'AI' | 'REPORTS';

export function ManufacturingPage() {
  const { loadData, loading } = useManufacturingStore();
  const [activeTab, setActiveTab] = useState<TabType>('DASHBOARD');

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-none p-6 pb-0">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manufacturing</h1>
            <p className="text-slate-500 dark:text-slate-400">Manage recipes, BOM, and production orders</p>
          </div>
        </div>

        <div className="flex space-x-1 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center whitespace-nowrap ${
              activeTab === 'DASHBOARD'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('RECIPES')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center whitespace-nowrap ${
              activeTab === 'RECIPES'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            <ScrollText className="w-4 h-4 mr-2" />
            Recipes & BOM
          </button>
          <button
            onClick={() => setActiveTab('PRODUCTION')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center whitespace-nowrap ${
              activeTab === 'PRODUCTION'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            <ClipboardList className="w-4 h-4 mr-2" />
            Production Orders
          </button>
          <button
            onClick={() => setActiveTab('PURCHASING')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center whitespace-nowrap ${
              activeTab === 'PURCHASING'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Purchasing Recommendations
          </button>
          <button
            onClick={() => setActiveTab('AI')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center whitespace-nowrap ${
              activeTab === 'AI'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            <Brain className="w-4 h-4 mr-2" />
            AI & Analytics
          </button>
          <button
            onClick={() => setActiveTab('REPORTS')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center whitespace-nowrap ${
              activeTab === 'REPORTS'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4 mr-2" />
            Reports
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-900/50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="h-full">
            {activeTab === 'DASHBOARD' && <ManufacturingDashboard />}
            {activeTab === 'RECIPES' && <RecipeList />}
            {activeTab === 'PRODUCTION' && <ProductionOrderList />}
            {activeTab === 'AI' && <ManufacturingAI />}
            {activeTab === 'PURCHASING' && <ManufacturingPurchasing />}
            {activeTab === 'REPORTS' && <ManufacturingReports />}
          </div>
        )}
      </div>
    </div>
  );
}
