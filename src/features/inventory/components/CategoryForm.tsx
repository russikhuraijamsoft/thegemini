import React, { useState } from 'react';
import { Category } from '../models/inventory';
import { useInventoryStore } from '../store/inventoryStore';

interface CategoryFormProps {
  onClose: () => void;
}

export function CategoryForm({ onClose }: CategoryFormProps) {
  const { categories, addCategory } = useInventoryStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    description: '',
    parentId: '',
    isActive: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.name) {
        throw new Error('Category Name is required');
      }

      await addCategory(formData as Omit<Category, 'id' | 'createdAt'>);
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
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Add Category</h2>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {error && <div className="mb-4 text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded">{error}</div>}
          
          <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category Name *</label>
              <input 
                type="text" 
                required
                value={formData.name || ''}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Parent Category</label>
              <select 
                value={formData.parentId || ''}
                onChange={e => setFormData({...formData, parentId: e.target.value})}
                className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">None (Top Level)</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea 
                rows={3}
                value={formData.description || ''}
                onChange={e => setFormData({...formData, description: e.target.value})}
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
            form="category-form"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </div>
    </div>
  );
}
