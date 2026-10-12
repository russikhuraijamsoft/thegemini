import React from 'react';
import { 
  X, 
  Banknote, 
  Printer, 
  TrendingUp, 
  CreditCard, 
  QrCode, 
  Split, 
  Receipt, 
  ShoppingBag, 
  UtensilsCrossed 
} from 'lucide-react';
import { Order } from '../models/pos';

interface DayRegisterModalProps {
  orders: Order[];
  onClose: () => void;
}

export function DayRegisterModal({ orders, onClose }: DayRegisterModalProps) {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(o => o.createdAt.startsWith(todayStr));
  const paidOrders = todayOrders.filter(o => o.status === 'PAID');
  const cancelledOrders = todayOrders.filter(o => o.status === 'CANCELLED');

  const totalGross = paidOrders.reduce((sum, o) => sum + (o.subtotal || 0), 0);
  const totalDiscount = paidOrders.reduce((sum, o) => sum + (o.discountAmount || 0), 0);
  const totalTax = paidOrders.reduce((sum, o) => sum + (o.tax || 0), 0);
  const totalNet = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  // Payment Breakdown
  let cashTotal = 0;
  let upiTotal = 0;
  let cardTotal = 0;

  paidOrders.forEach(o => {
    if (o.paymentMethod === 'CASH') {
      cashTotal += o.total;
    } else if (o.paymentMethod === 'UPI') {
      upiTotal += o.total;
    } else if (o.paymentMethod === 'CARD') {
      cardTotal += o.total;
    } else if (o.paymentMethod === 'SPLIT' && o.paymentDetails?.splitBreakdown) {
      cashTotal += o.paymentDetails.splitBreakdown.cash || 0;
      upiTotal += o.paymentDetails.splitBreakdown.upi || 0;
      cardTotal += o.paymentDetails.splitBreakdown.card || 0;
    } else {
      cashTotal += o.total;
    }
  });

  const avgOrderValue = paidOrders.length > 0 ? totalNet / paidOrders.length : 0;
  const dineInCount = paidOrders.filter(o => o.orderType === 'DINE_IN').length;
  const takeawayCount = paidOrders.filter(o => o.orderType === 'TAKEAWAY' || o.orderType === 'DELIVERY').length;

  const handlePrintZReport = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white border-2 border-[#ebd5da] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-[#800000] flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#800000] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Banknote className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-wide">Daily Register & Day Close Summary</h2>
              <p className="text-xs text-[#fbe6ea] font-medium">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white font-sans">
          
          {/* Main Key Figures Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#fdf5f6] border border-[#ebd5da]">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#800000]/70 block">
                Total Net Sales
              </span>
              <p className="text-xl font-black text-[#800000] mt-1">
                ₹{totalNet.toFixed(2)}
              </p>
              <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                {paidOrders.length} Paid Bills
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#fdf5f6] border border-[#ebd5da]">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#800000]/70 block">
                Cash in Drawer
              </span>
              <p className="text-xl font-black text-[#800000] mt-1">
                ₹{cashTotal.toFixed(2)}
              </p>
              <span className="text-[10px] text-[#800000]/70 font-semibold block mt-0.5">
                Physical Cash
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#fdf5f6] border border-[#ebd5da]">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#800000]/70 block">
                UPI / Digital
              </span>
              <p className="text-xl font-black text-[#800000] mt-1">
                ₹{upiTotal.toFixed(2)}
              </p>
              <span className="text-[10px] text-[#800000]/70 font-semibold block mt-0.5">
                Direct to Bank
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#fdf5f6] border border-[#ebd5da]">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#800000]/70 block">
                Card Swipes
              </span>
              <p className="text-xl font-black text-[#800000] mt-1">
                ₹{cardTotal.toFixed(2)}
              </p>
              <span className="text-[10px] text-[#800000]/70 font-semibold block mt-0.5">
                POS Terminal
              </span>
            </div>
          </div>

          {/* Settlement Details Table */}
          <div className="border border-[#ebd5da] rounded-xl p-4 bg-[#fdf5f6]/50 space-y-3">
            <h4 className="font-black text-sm text-[#800000] uppercase tracking-wider">
              Financial Summary Breakdown
            </h4>

            <div className="space-y-2 text-xs font-semibold">
              <div className="flex justify-between text-[#800000]/80">
                <span>Gross Revenue (Before Tax & Discount)</span>
                <span className="font-bold">₹{totalGross.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Total Discounts Given</span>
                <span className="font-bold">-₹{totalDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#800000]/80">
                <span>Tax Collected (5% GST - CGST 2.5% + SGST 2.5%)</span>
                <span className="font-bold">₹{totalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-[#800000] pt-2 border-t border-[#ebd5da]">
                <span>Total Net Collected</span>
                <span>₹{totalNet.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Operational Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-[#ebd5da] bg-white space-y-2">
              <h4 className="font-black text-xs uppercase tracking-wider text-[#800000]">
                Order Channels
              </h4>
              <div className="space-y-1.5 text-xs font-semibold">
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5 text-[#800000]/80">
                    <UtensilsCrossed className="w-3.5 h-3.5" /> Dine-in Orders:
                  </span>
                  <span className="font-bold text-[#800000]">{dineInCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5 text-[#800000]/80">
                    <ShoppingBag className="w-3.5 h-3.5" /> Takeaway / Delivery:
                  </span>
                  <span className="font-bold text-[#800000]">{takeawayCount}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Cancelled / Voided Bills:</span>
                  <span className="font-bold">{cancelledOrders.length}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#ebd5da] bg-white space-y-2">
              <h4 className="font-black text-xs uppercase tracking-wider text-[#800000]">
                Sales Performance
              </h4>
              <div className="space-y-1.5 text-xs font-semibold">
                <div className="flex justify-between">
                  <span className="text-[#800000]/80">Average Bill Size (AOV):</span>
                  <span className="font-bold text-[#800000]">₹{avgOrderValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#800000]/80">Total Items Sold Today:</span>
                  <span className="font-bold text-[#800000]">
                    {paidOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#800000]/80">Register Shift:</span>
                  <span className="font-bold text-[#800000]">Active</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#fdf5f6] border-t border-[#ebd5da] flex justify-end gap-3">
          <button
            type="button"
            onClick={handlePrintZReport}
            className="py-2.5 px-4 rounded-xl border border-[#ebd5da] bg-white text-[#800000] font-black text-xs hover:bg-[#fee8eb] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print Z-Report (Day Close)
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-[#800000] hover:bg-[#680016] text-white font-black text-xs transition-colors cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
