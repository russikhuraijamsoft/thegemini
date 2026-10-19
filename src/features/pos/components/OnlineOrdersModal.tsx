import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, X, RefreshCw, Volume2, VolumeX, CheckCircle, Clock, 
  Printer, Utensils, Smartphone, Store, Bike, AlertCircle, 
  ChevronRight, ArrowRight, ShieldCheck, ExternalLink, Sparkles
} from 'lucide-react';
import { Order } from '../models/pos';

interface OnlineOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrderForPrint?: (order: Order, tab: 'receipt' | 'kot') => void;
}

export function OnlineOrdersModal({ isOpen, onClose, onSelectOrderForPrint }: OnlineOrdersModalProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeChannelFilter, setActiveChannelFilter] = useState<string>('ALL');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const prevOrderCountRef = useRef<number>(0);

  // Play audio chime for new orders using Web Audio API
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {}
  };

  const fetchLiveOrders = async () => {
    try {
      const res = await fetch('/api/orders/live');
      const data = await res.json();
      if (data.orders) {
        if (soundEnabled && prevOrderCountRef.current > 0 && data.orders.length > prevOrderCountRef.current) {
          playChime();
        }
        prevOrderCountRef.current = data.orders.length;
        setOrders(data.orders);
        if (!selectedOrder && data.orders.length > 0) {
          setSelectedOrder(data.orders[0]);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch live orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchLiveOrders();
      let timer: NodeJS.Timeout | null = null;
      if (autoRefresh) {
        timer = setInterval(fetchLiveOrders, 5000);
      }
      return () => {
        if (timer) clearInterval(timer);
      };
    }
  }, [isOpen, autoRefresh, soundEnabled]);

  if (!isOpen) return null;

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/accept`, { method: 'PATCH' });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'PREPARING' } : o));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev: any) => ({ ...prev, status: 'PREPARING' }));
        }
      }
    } catch {}
  };

  const handleMarkReady = async (orderId: string) => {
    try {
      const ticketId = `t_${orderId}`;
      await fetch(`/api/kds/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'READY' })
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'READY' } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev: any) => ({ ...prev, status: 'READY' }));
      }
    } catch {}
  };

  const filteredOrders = orders.filter(order => {
    if (activeChannelFilter === 'ALL') return true;
    if (activeChannelFilter === 'TABLE_QR') return order.channel === 'TABLE_QR' || !!order.tableNumber;
    if (activeChannelFilter === 'KIOSK') return order.channel === 'KIOSK' || !!order.kioskId;
    if (activeChannelFilter === 'DELIVERY') return ['UBEREATS', 'DOORDASH', 'SWIGGY', 'ZOMATO'].includes(order.channel);
    return true;
  });

  const getChannelBadge = (channel: string = '') => {
    switch (channel.toUpperCase()) {
      case 'UBEREATS':
        return { label: 'Uber Eats', bg: 'bg-[#06C167] text-white', icon: Bike };
      case 'DOORDASH':
        return { label: 'DoorDash', bg: 'bg-[#FF3008] text-white', icon: Bike };
      case 'SWIGGY':
        return { label: 'Swiggy', bg: 'bg-[#FC8019] text-white', icon: Bike };
      case 'ZOMATO':
        return { label: 'Zomato', bg: 'bg-[#E23744] text-white', icon: Bike };
      case 'KIOSK':
        return { label: 'Self Kiosk', bg: 'bg-[#800000] text-white', icon: Smartphone };
      case 'TABLE_QR':
        return { label: 'Table QR', bg: 'bg-blue-600 text-white', icon: Utensils };
      default:
        return { label: 'Web Order', bg: 'bg-stone-700 text-white', icon: Globe };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 md:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white border-2 border-[#ebd5da] rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden text-[#800000] flex flex-col h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#800000] text-white px-5 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg md:text-xl font-black tracking-wide">
                  Online & Omnichannel Orders
                </h3>
                <span className="bg-white text-[#800000] text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                  {orders.length} Live
                </span>
              </div>
              <p className="text-xs text-[#fbe6ea] font-medium">
                Unified live feed for Self-Kiosks, Table QR, and Delivery Apps
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                soundEnabled ? 'bg-white/20 text-white' : 'bg-white/10 text-white/50'
              }`}
              title={soundEnabled ? 'Chime sound active for new orders' : 'Sound chime muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                autoRefresh ? 'bg-emerald-500/30 text-white border border-emerald-400' : 'bg-white/10 text-white/70'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
              <span className="hidden sm:inline">{autoRefresh ? 'Auto-Sync' : 'Paused'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer ml-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Toolbar & Filters */}
        <div className="bg-[#fdf5f6] border-b border-[#ebd5da] p-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'ALL', label: 'All Orders' },
              { id: 'TABLE_QR', label: 'Table QR' },
              { id: 'KIOSK', label: 'Kiosks' },
              { id: 'DELIVERY', label: 'Aggregators (Uber/Swiggy)' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveChannelFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeChannelFilter === tab.id
                    ? 'bg-[#800000] text-white shadow-xs'
                    : 'bg-white border border-[#ebd5da] text-[#800000] hover:bg-[#fee8eb]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/integrations"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-black text-[#800000] hover:underline flex items-center gap-1"
            >
              Manage Integrations & Webhooks
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Master-Detail Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Order List Column */}
          <div className="w-full md:w-5/12 border-r border-[#ebd5da] overflow-y-auto bg-stone-50/50 p-3 space-y-2.5">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 text-[#800000]/60">
                <Store className="w-10 h-10 mx-auto mb-2 opacity-40 text-[#800000]" />
                <p className="font-bold text-sm">No incoming orders in this filter</p>
                <p className="text-xs text-stone-500 mt-1">
                  Orders submitted from Kiosks, Table QR, or delivery webhooks appear here automatically.
                </p>
              </div>
            ) : (
              filteredOrders.map(order => {
                const isSelected = selectedOrder?.id === order.id;
                const badge = getChannelBadge(order.channel);
                const BadgeIcon = badge.icon;
                const isNew = order.status === 'NEW' || order.status === 'PENDING';

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-white border-[#800000] shadow-md ring-2 ring-[#800000]/10'
                        : 'bg-white border-[#ebd5da] hover:border-[#800000]/60 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${badge.bg}`}>
                          <BadgeIcon className="w-3 h-3" />
                          {badge.label}
                        </span>
                        {order.tableNumber && (
                          <span className="bg-[#fee8eb] text-[#800000] text-[11px] font-black px-2 py-0.5 rounded-md border border-[#ebd5da]">
                            {order.tableNumber}
                          </span>
                        )}
                        {order.buzzerNumber && (
                          <span className="bg-amber-100 text-amber-900 text-[11px] font-black px-2 py-0.5 rounded-md border border-amber-200">
                            Token: {order.buzzerNumber}
                          </span>
                        )}
                      </div>
                      <span className="font-black text-sm text-[#800000]">
                        ₹{Number(order.total || 0).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-black text-xs text-[#800000]">
                          {order.orderNumber || order.id}
                        </h4>
                        <p className="text-[11px] text-stone-600 font-semibold truncate max-w-[200px]">
                          {order.customerName || 'Guest Diner'}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          order.status === 'READY' 
                            ? 'bg-emerald-100 text-emerald-800'
                            : isNew 
                              ? 'bg-amber-100 text-amber-800 animate-pulse'
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status || 'PAID'}
                        </span>
                        <p className="text-[10px] text-stone-400 font-medium mt-1">
                          {order.items?.length || 0} items
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Order Details Column */}
          <div className="w-full md:w-7/12 flex flex-col bg-white overflow-y-auto p-4 md:p-6">
            {selectedOrder ? (
              <div className="space-y-5">
                {/* Header Card */}
                <div className="p-4 rounded-2xl bg-[#fdf5f6] border border-[#ebd5da] flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-[#800000]">
                        {selectedOrder.orderNumber}
                      </span>
                      <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        selectedOrder.status === 'READY'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#800000] text-white'
                      }`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 font-semibold mt-1">
                      Channel: <span className="font-black text-[#800000]">{selectedOrder.channel || 'ONLINE'}</span> • 
                      {selectedOrder.createdAt ? ` ${new Date(selectedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                    </p>
                  </div>

                  {/* Actions for Kitchen & Cashier */}
                  <div className="flex items-center gap-2">
                    {['NEW', 'PENDING'].includes(selectedOrder.status) && (
                      <button
                        type="button"
                        onClick={() => handleAcceptOrder(selectedOrder.id)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Accept & Push KDS
                      </button>
                    )}

                    {selectedOrder.status === 'PREPARING' && (
                      <button
                        type="button"
                        onClick={() => handleMarkReady(selectedOrder.id)}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Ready
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectOrderForPrint) {
                          onSelectOrderForPrint(selectedOrder, 'kot');
                        } else {
                          window.print();
                        }
                      }}
                      className="px-3 py-2 rounded-xl border border-[#ebd5da] bg-white hover:bg-[#fee8eb] text-[#800000] font-black text-xs flex items-center gap-1 transition-all cursor-pointer"
                      title="Print Kitchen Order Ticket (KOT)"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      KOT
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectOrderForPrint) {
                          onSelectOrderForPrint(selectedOrder, 'receipt');
                        } else {
                          window.print();
                        }
                      }}
                      className="px-3 py-2 rounded-xl border border-[#ebd5da] bg-white hover:bg-[#fee8eb] text-[#800000] font-black text-xs flex items-center gap-1 transition-all cursor-pointer"
                      title="Print Customer Receipt"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Bill
                    </button>
                  </div>
                </div>

                {/* Customer & Dining Details */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl border border-[#ebd5da] bg-stone-50">
                    <span className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider">Customer</span>
                    <span className="font-black text-xs text-[#800000]">{selectedOrder.customerName || 'Walk-in'}</span>
                    {selectedOrder.customerPhone && (
                      <span className="block text-[10px] text-stone-600">{selectedOrder.customerPhone}</span>
                    )}
                  </div>

                  <div className="p-3 rounded-xl border border-[#ebd5da] bg-stone-50">
                    <span className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider">Dining / Location</span>
                    <span className="font-black text-xs text-[#800000]">
                      {selectedOrder.tableNumber ? `Table: ${selectedOrder.tableNumber}` : (selectedOrder.orderType || 'TAKEAWAY')}
                    </span>
                    {selectedOrder.buzzerNumber && (
                      <span className="block text-[10px] text-amber-800 font-bold">Buzzer: {selectedOrder.buzzerNumber}</span>
                    )}
                  </div>

                  <div className="p-3 rounded-xl border border-[#ebd5da] bg-stone-50 col-span-2 sm:col-span-1">
                    <span className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider">Payment</span>
                    <span className="font-black text-xs text-[#800000]">{selectedOrder.paymentMethod || 'UPI / Online'}</span>
                    <span className="block text-[10px] text-emerald-700 font-bold">Verified Authoritative</span>
                  </div>
                </div>

                {/* Items Breakdown */}
                <div>
                  <h4 className="text-xs font-black text-[#800000] uppercase tracking-wider mb-2">
                    Order Items ({selectedOrder.items?.length || 0})
                  </h4>
                  <div className="border border-[#ebd5da] rounded-2xl divide-y divide-[#ebd5da] overflow-hidden">
                    {(selectedOrder.items || []).map((item: any, idx: number) => (
                      <div key={idx} className="p-3 flex items-center justify-between bg-white hover:bg-stone-50">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-md bg-[#fee8eb] text-[#800000] text-xs font-black flex items-center justify-center">
                            {item.quantity}x
                          </span>
                          <div>
                            <span className="font-black text-xs text-[#800000]">
                              {item.name || item.productName}
                            </span>
                            {item.size && item.size !== 'Standard' && (
                              <span className="ml-1.5 text-[10px] font-black bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded">
                                {item.size}
                              </span>
                            )}
                            {item.notes && (
                              <p className="text-[11px] text-amber-800 font-medium italic mt-0.5">
                                Note: {item.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        <span className="font-black text-xs text-[#800000]">
                          ₹{(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-[#ebd5da] space-y-1.5 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span className="font-bold">₹{Number(selectedOrder.subtotal || selectedOrder.total || 0).toFixed(2)}</span>
                  </div>
                  {selectedOrder.tax ? (
                    <div className="flex justify-between text-stone-600">
                      <span>GST (5%)</span>
                      <span className="font-bold">₹{Number(selectedOrder.tax).toFixed(2)}</span>
                    </div>
                  ) : null}
                  <div className="pt-2 border-t border-[#ebd5da] flex justify-between text-sm font-black text-[#800000]">
                    <span>Grand Total</span>
                    <span>₹{Number(selectedOrder.total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-[#800000]/60">
                <Store className="w-12 h-12 opacity-30 text-[#800000] mb-2" />
                <p className="font-bold text-sm">Select an order on the left to inspect details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
