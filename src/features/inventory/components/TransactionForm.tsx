import React, { useState } from 'react';
import { InventoryItem, StockTransaction } from '../models/inventory';
import { useInventoryStore } from '../store/inventoryStore';

interface TransactionFormProps {
  onClose: () => void;
}

export function TransactionForm({ onClose }: TransactionFormProps) {
  const { items, warehouses, storageLocations, batches, recordTransaction } = useInventoryStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<Partial<StockTransaction>>({
    itemId: '',
    type: 'STOCK_IN',
    quantity: 0,
    unitCost: 0,
    totalCost: 0,
    notes: '',
    fromWarehouseId: '',
    fromLocationId: '',
    batchId: '',
    performedBy: 'Current User' // Should be from auth context
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (!formData.itemId || formData.quantity! <= 0) {
        throw new Error('Item and valid quantity are required');
      }
      await recordTransaction(formData as Omit<StockTransaction, 'id' | 'date'>);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (q: number) => {
    const item = items.find(i => i.id === formData.itemId);
    const unitCost = formData.unitCost || (item ? item.costPrice : 0);
    setFormData({
      ...formData,
      quantity: q,
      unitCost,
      totalCost: q * unitCost
    });
  };

  const handleItemChange = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    const unitCost = item ? item.costPrice : 0;
    setFormData({
      ...formData,
      itemId,
      unitCost,
      totalCost: (formData.quantity || 0) * unitCost,
      batchId: '' // reset batch when item changes
    });
  };

  const itemBatches = batches.filter(b => b.itemId === formData.itemId && b.status !== 'EXPIRED');

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Record Stock Movement</h2>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {error && <div className="mb-4 text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded">{error}</div>}
          
          <form id="txn-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Transaction Type *</label>
                <select 
                  required
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="STOCK_IN">Stock In (Add)</option>
                  <option value="STOCK_OUT">Stock Out (Deduct)</option>
                  <option value="ADJUSTMENT">Adjustment</option>
                  <option value="DAMAGE">Damage</option>
                  <option value="WASTAGE">Wastage</option>
                  <option value="EXPIRY">Expiry</option>
                  <option value="RETURN">Return</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Warehouse</label>
                <select 
                  value={formData.fromWarehouseId}
                  onChange={e => setFormData({...formData, fromWarehouseId: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Item *</label>
              <select 
                required
                value={formData.itemId}
                onChange={e => handleItemChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="">Select Item</option>
                {items.map(i => (
                  <option key={i.id} value={i.id}>{i.name} (Global Stock: {i.currentStock} {i.unit})</option>
                ))}
              </select>
            </div>

            {formData.itemId && itemBatches.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Batch</label>
                <select 
                  value={formData.batchId}
                  onChange={e => setFormData({...formData, batchId: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">No Batch Selected</option>
                  {itemBatches.map(b => (
                    <option key={b.id} value={b.id}>{b.batchNumber} (Stock: {b.currentQuantity}) - Expires {new Date(b.expiryDate).toLocaleDateString()}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quantity *</label>
                <input 
                  type="number" 
                  required
                  min="0.01" step="0.01"
                  value={formData.quantity || ''}
                  onChange={e => handleQuantityChange(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Unit Cost</label>
                <input 
                  type="number" 
                  min="0" step="0.01"
                  value={formData.unitCost || 0}
                  onChange={e => setFormData({
                    ...formData, 
                    unitCost: parseFloat(e.target.value) || 0,
                    totalCost: (parseFloat(e.target.value) || 0) * (formData.quantity || 0)
                  })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes / Reason</label>
              <textarea 
                rows={2}
                value={formData.notes || ''}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </form>
        </div>
        
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="txn-form"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Recording...' : 'Record Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
}
