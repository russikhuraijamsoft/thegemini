import React, { useState } from 'react';
import { useManufacturingStore } from '../store/manufacturingStore';
import { Plus, Search, Filter, ClipboardList, Calendar, CheckCircle2, Play, Check } from 'lucide-react';
import { ProductionStatus, ProductionOrder } from '../models/manufacturing';
import { ProductionOrderForm } from './ProductionOrderForm';

export function ProductionOrderList() {
  const { productionOrders, updateProductionOrder, completeProductionOrder } = useManufacturingStore();
  const [showForm, setShowForm] = useState(false);
  const [completingOrder, setCompletingOrder] = useState<ProductionOrder | null>(null);
  
  const [actualQty, setActualQty] = useState(0);
  const [wasteQty, setWasteQty] = useState(0);

  const getStatusColor = (status: ProductionStatus) => {
    switch(status) {
      case 'PLANNED': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const handleStart = async (id: string) => {
    await updateProductionOrder(id, { status: 'IN_PROGRESS' });
  };

  const openCompleteModal = (order: ProductionOrder) => {
    setCompletingOrder(order);
    setActualQty(order.plannedQuantity);
    setWasteQty(0);
  };

  const handleComplete = async (qcStatus: 'APPROVED' | 'REJECTED') => {
    if (!completingOrder) return;
    await completeProductionOrder(completingOrder.id, actualQty, wasteQty, qcStatus);
    setCompletingOrder(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full relative">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search orders..."
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
          <Plus className="w-4 h-4 mr-2" /> New Order
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {productionOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400 py-12">
            <ClipboardList className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" />
            <p>No production orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {productionOrders.map(order => (
              <div key={order.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors bg-white dark:bg-slate-800 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{order.recipeName}</h3>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <span className="text-sm font-mono text-slate-500 dark:text-slate-400">Batch: {order.batchNumber}</span>
                  </div>
                  
                  <div className="text-right flex items-center gap-4">
                    {order.status === 'PLANNED' && (
                      <button onClick={() => handleStart(order.id)} className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400 rounded-lg text-sm font-medium transition-colors">
                        <Play className="w-4 h-4 mr-1.5" /> Start
                      </button>
                    )}
                    {order.status === 'IN_PROGRESS' && (
                      <button onClick={() => openCompleteModal(order)} className="flex items-center px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400 rounded-lg text-sm font-medium transition-colors">
                        <Check className="w-4 h-4 mr-1.5" /> Complete
                      </button>
                    )}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {order.actualQuantity || order.plannedQuantity} <span className="text-sm font-normal text-slate-500">{order.unit}</span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Target: {order.plannedQuantity} {order.unit}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                    <span>Planned: {new Date(order.plannedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-center text-sm">
                    {order.qcStatus === 'APPROVED' ? (
                      <span className="flex items-center text-green-600 dark:text-green-400 font-medium">
                        <CheckCircle2 className="w-4 h-4 mr-2" /> QC Passed
                      </span>
                    ) : order.qcStatus === 'REJECTED' ? (
                      <span className="flex items-center text-red-600 dark:text-red-400 font-medium">
                         QC Failed
                      </span>
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400 italic">QC Pending</span>
                    )}
                  </div>
                  <div className="flex items-center justify-end">
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                      View Details &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && <ProductionOrderForm onClose={() => setShowForm(false)} />}

      {completingOrder && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-sm flex flex-col overflow-hidden p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Complete Batch: {completingOrder.batchNumber}</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Actual Yield ({completingOrder.unit})</label>
                <input
                  type="number"
                  value={actualQty}
                  onChange={e => setActualQty(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Waste ({completingOrder.unit})</label>
                <input
                  type="number"
                  value={wasteQty}
                  onChange={e => setWasteQty(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <button
                onClick={() => handleComplete('REJECTED')}
                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-lg font-medium"
              >
                Reject (Fail QC)
              </button>
              <button
                onClick={() => handleComplete('APPROVED')}
                className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-medium"
              >
                Approve (Pass QC)
              </button>
            </div>
            <button
              onClick={() => setCompletingOrder(null)}
              className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
