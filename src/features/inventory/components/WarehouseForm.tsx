import React, { useState } from 'react';
import { Warehouse } from '../models/inventory';
import { useInventoryStore } from '../store/inventoryStore';

interface WarehouseFormProps {
  onClose: () => void;
}

export function WarehouseForm({ onClose }: WarehouseFormProps) {
  const { addWarehouse } = useInventoryStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<Partial<Warehouse>>({
    name: '',
    type: 'MAIN_STORE',
    location: '',
    isActive: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.name) {
        throw new Error('Warehouse Name is required');
      }

      await addWarehouse(formData as Omit<Warehouse, 'id'>);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Add Warehouse</h2>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {error && <div className="mb-4 text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded">{error}</div>}
          
          <form id="warehouse-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Warehouse Name *</label>
              <input 
                type="text" 
                required
                value={formData.name || ''}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type *</label>
              <select 
                required
                value={formData.type || ''}
                onChange={e => setFormData({...formData, type: e.target.value as any})}
                className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="MAIN_STORE">Main Store</option>
                <option value="KITCHEN_STORE">Kitchen Store</option>
                <option value="BRANCH_STORE">Branch Store</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
              <textarea 
                rows={2}
                value={formData.location || ''}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500" 
              />
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="isActive"
                checked={formData.isActive}
                onChange={e => setFormData({...formData, isActive: e.target.checked})}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded" 
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                Active
              </label>
            </div>
          </form>
        </div>
        
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="warehouse-form"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Warehouse'}
          </button>
        </div>
      </div>
    </div>
  );
}
