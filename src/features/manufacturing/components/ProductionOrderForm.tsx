import React, { useState } from 'react';
import { useManufacturingStore } from '../store/manufacturingStore';
import { X } from 'lucide-react';
import { ProductionOrder } from '../models/manufacturing';

interface ProductionOrderFormProps {
  onClose: () => void;
}

export function ProductionOrderForm({ onClose }: ProductionOrderFormProps) {
  const { recipes, addProductionOrder } = useManufacturingStore();
  const [formData, setFormData] = useState<Partial<ProductionOrder>>({
    recipeId: '',
    recipeName: '',
    batchNumber: `BCH-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    plannedQuantity: 0,
    unit: 'pcs',
    plannedDate: new Date().toISOString().split('T')[0],
    status: 'PLANNED',
  });

  const handleRecipeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const recipeId = e.target.value;
    const recipe = recipes.find(r => r.id === recipeId);
    if (recipe) {
      setFormData({
        ...formData,
        recipeId,
        recipeName: recipe.name,
        unit: recipe.yieldUnit,
        plannedQuantity: recipe.yieldQuantity
      });
    } else {
      setFormData({ ...formData, recipeId: '', recipeName: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recipeId) return;
    try {
      await addProductionOrder(formData as any);
      onClose();
    } catch (error) {
      console.error('Failed to save order:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Create Production Order
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="production-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Recipe / Target Item *</label>
              <select
                required
                value={formData.recipeId}
                onChange={handleRecipeChange}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="">Select a recipe</option>
                {recipes.map(r => (
                  <option key={r.id} value={r.id}>{r.name} (Yields: {r.yieldQuantity} {r.yieldUnit})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Batch Number</label>
              <input
                type="text"
                value={formData.batchNumber}
                onChange={e => setFormData({ ...formData, batchNumber: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Quantity *</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={formData.plannedQuantity || ''}
                  onChange={e => setFormData({ ...formData, plannedQuantity: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Unit</label>
                <input
                  type="text"
                  readOnly
                  value={formData.unit || ''}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Planned Date *</label>
              <input
                required
                type="date"
                value={formData.plannedDate?.split('T')[0]}
                onChange={e => setFormData({ ...formData, plannedDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="production-form"
            className="px-4 py-2 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create Order
          </button>
        </div>
      </div>
    </div>
  );
}
