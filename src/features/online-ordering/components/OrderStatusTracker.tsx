import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, ChefHat, Bell, UtensilsCrossed, ArrowLeft, RefreshCw } from 'lucide-react';

interface OrderStatusTrackerProps {
  orderId: string;
  orderNumber: string;
  tableNumber?: string;
  initialEstimatedMinutes?: number;
  onOrderAgain?: () => void;
}

interface OrderStatusData {
  orderId: string;
  orderNumber: string;
  tableNumber?: string;
  customerName?: string;
  orderType?: string;
  status: string;
  kitchenStatus: string;
  step: number;
  total?: number;
  items?: Array<{ name: string; quantity: number; price: number; size?: string }>;
  estimatedMinutesLeft: number;
}

export function OrderStatusTracker({
  orderId,
  orderNumber,
  tableNumber,
  initialEstimatedMinutes = 18,
  onOrderAgain
}: OrderStatusTrackerProps) {
  const [statusData, setStatusData] = useState<OrderStatusData>({
    orderId,
    orderNumber,
    tableNumber,
    status: 'PAID',
    kitchenStatus: 'NEW',
    step: 1,
    estimatedMinutesLeft: initialEstimatedMinutes
  });
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders/${orderId}/status`);
      if (res.ok) {
        const data = await res.json();
        if (data.found) {
          setStatusData(prev => ({
            ...prev,
            ...data
          }));
          setLastUpdated(new Date());
        }
      }
    } catch (err) {
      console.warn('Could not fetch latest order status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Auto-poll every 6 seconds for live kitchen updates
    const interval = setInterval(fetchStatus, 6000);
    return () => clearInterval(interval);
  }, [orderId]);

  const steps = [
    { num: 1, label: 'Order Received', desc: 'Sent straight to chef', icon: Clock },
    { num: 2, label: 'Cooking & Prep', desc: 'Active at kitchen station', icon: ChefHat },
    { num: 3, label: 'Plated & Ready', desc: 'Hot & fresh', icon: Bell },
    { num: 4, label: 'Served', desc: 'Delivered to table', icon: UtensilsCrossed },
  ];

  const currentStep = statusData.step || 1;

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 space-y-6">
      
      {/* Top Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold text-xs rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5" /> Order Confirmed
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          {statusData.orderNumber || orderNumber}
        </h2>
        {tableNumber && (
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            Assigned to Table {tableNumber}
          </p>
        )}
      </div>

      {/* Estimated Time Card */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg text-center relative overflow-hidden">
        <div className="text-xs uppercase tracking-wider font-semibold text-indigo-100">
          Estimated Wait Time
        </div>
        <div className="text-4xl font-black my-1 tracking-tight">
          ~{statusData.estimatedMinutesLeft} <span className="text-lg font-medium text-indigo-100">mins</span>
        </div>
        <p className="text-xs text-indigo-100/90">
          {currentStep >= 3 ? 'Your order is ready! Look out for the server.' : 'Our kitchen brigade is preparing your meal.'}
        </p>
      </div>

      {/* Progress Timeline */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          <span>Live Kitchen Progress</span>
          <button 
            onClick={fetchStatus} 
            disabled={loading}
            className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Sync
          </button>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {steps.map((st) => {
            const isCompleted = currentStep > st.num;
            const isCurrent = currentStep === st.num;
            const Icon = st.icon;

            return (
              <div key={st.num} className="relative flex items-start gap-4">
                {/* Node */}
                <div className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCompleted 
                    ? 'bg-emerald-500 text-white shadow-xs' 
                    : isCurrent 
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950 animate-pulse' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}>
                  {isCompleted ? '✓' : st.num}
                </div>

                <div className="flex-1">
                  <div className={`text-sm font-bold flex items-center gap-2 ${
                    isCurrent ? 'text-indigo-600 dark:text-indigo-400' : isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                    {st.label}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {st.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Items Preview (if available) */}
      {statusData.items && statusData.items.length > 0 && (
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Items in this order
          </div>
          <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            {statusData.items.map((it, idx) => (
              <div key={idx} className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                <span className="font-medium">
                  {it.quantity}x {it.name} {it.size ? `(${it.size})` : ''}
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  ₹{Number(it.price * it.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            {statusData.total && (
              <div className="flex justify-between font-bold text-sm pt-2 text-slate-900 dark:text-white">
                <span>Total Paid</span>
                <span>₹{Number(statusData.total).toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="space-y-2 pt-2">
        {onOrderAgain && (
          <button
            type="button"
            onClick={onOrderAgain}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <UtensilsCrossed className="w-4 h-4" /> Order More Items
          </button>
        )}
        <p className="text-center text-[10px] text-slate-400">
          Last refreshed: {lastUpdated.toLocaleTimeString()}
        </p>
      </div>

    </div>
  );
}
