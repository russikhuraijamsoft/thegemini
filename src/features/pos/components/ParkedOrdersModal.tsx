import React from 'react';
import { X, PauseCircle, Play, Trash2, Clock, Utensils, ShoppingBag } from 'lucide-react';
import { ParkedOrder } from '../models/pos';

interface ParkedOrdersModalProps {
  parkedOrders: ParkedOrder[];
  onResumeOrder: (orderId: string) => void;
  onDeleteOrder: (orderId: string) => void;
  onClose: () => void;
}

export function ParkedOrdersModal({
  parkedOrders,
  onResumeOrder,
  onDeleteOrder,
  onClose
}: ParkedOrdersModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white border-2 border-[#ebd5da] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-[#800000] flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#800000] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <PauseCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wide">Parked / Held Orders</h2>
              <p className="text-xs text-[#fbe6ea] font-medium">
                {parkedOrders.length} tickets waiting to be resumed
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#fdf5f6]/40">
          {parkedOrders.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center text-[#800000]/60">
              <PauseCircle className="w-10 h-10 mb-2 text-[#800000]/30" />
              <p className="font-black text-sm text-[#800000]">No parked orders</p>
              <p className="text-xs text-[#800000]/70 mt-1">
                You can hold an active order in the cart to serve another customer
              </p>
            </div>
          ) : (
            parkedOrders.map((parked) => {
              const timeStr = new Date(parked.parkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <div
                  key={parked.id}
                  className="bg-white border border-[#ebd5da] rounded-xl p-4 shadow-xs hover:border-[#800000] transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-base text-[#800000]">
                          {parked.label}
                        </h4>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#fee8eb] text-[#800000] border border-[#ebd5da]">
                          {parked.orderType}
                        </span>
                      </div>
                      <div className="text-xs text-[#800000]/70 flex items-center gap-2 mt-0.5 font-medium">
                        <Clock className="w-3 h-3" />
                        <span>Held at {timeStr}</span>
                        {parked.customerName && (
                          <span>• {parked.customerName}</span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-[#800000]">
                        ₹{parked.subtotal.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-[#800000]/70 block font-bold">
                        {parked.items.reduce((s, i) => s + i.quantity, 0)} items
                      </span>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="bg-[#fdf5f6] p-2.5 rounded-lg text-xs space-y-1 text-[#800000]/90 font-medium">
                    {parked.items.map((i, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>
                          {i.quantity}x {i.name} {i.size && i.size !== 'Standard' ? `(${i.size})` : ''}
                        </span>
                        <span className="font-bold">₹{(i.price * i.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onDeleteOrder(parked.id)}
                      className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Discard Held Order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onResumeOrder(parked.id);
                        onClose();
                      }}
                      className="flex-1 py-2 px-4 rounded-xl bg-[#800000] hover:bg-[#680016] text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Resume Order
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
