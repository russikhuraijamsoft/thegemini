import React, { useState } from 'react';
import { Order } from '../models/pos';
import { CheckCircle, Printer, X, ChefHat, ReceiptText, Share2, Check } from 'lucide-react';

interface ReceiptModalProps {
  order: Order;
  defaultTab?: 'receipt' | 'kot';
  onClose: () => void;
}

export function ReceiptModal({ order, defaultTab = 'receipt', onClose }: ReceiptModalProps) {
  const [activeTab, setActiveTab] = useState<'receipt' | 'kot'>(defaultTab);
  const [copiedShare, setCopiedShare] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShareSummary = () => {
    const summary = `Talk of the Town Bill #${order.orderNumber}
Total: ₹${order.total.toFixed(2)}
Items: ${order.items.map(i => `${i.quantity}x ${i.name} ${i.size ? `(${i.size})` : ''}`).join(', ')}
Thank you for dining with us!`;
    navigator.clipboard?.writeText(summary);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const orderDate = new Date(order.createdAt);
  const timeFormatted = orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateFormatted = orderDate.toLocaleDateString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200 print:p-0 print:bg-white print:fixed print:inset-0">
      <div 
        className="bg-white border-2 border-[#ebd5da] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-[#800000] flex flex-col max-h-[92vh] print:border-none print:shadow-none print:max-h-full print:w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Hidden on Print */}
        <div className="bg-[#800000] text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-white" />
            <div>
              <h3 className="text-xl font-black tracking-wide">
                Order Settled
              </h3>
              <p className="text-xs text-[#fbe6ea] font-medium">
                {order.orderNumber} • Paid Successfully
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

        {/* Tab Toggle - Hidden on Print */}
        <div className="flex border-b border-[#ebd5da] bg-[#fdf5f6] p-1 gap-1 print:hidden">
          <button
            type="button"
            onClick={() => setActiveTab('receipt')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'receipt'
                ? 'bg-white text-[#800000] shadow-xs'
                : 'text-[#800000]/70 hover:text-[#800000]'
            }`}
          >
            <ReceiptText className="w-4 h-4" />
            Customer Bill
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('kot')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'kot'
                ? 'bg-white text-[#800000] shadow-xs'
                : 'text-[#800000]/70 hover:text-[#800000]'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            Kitchen Order Ticket (KOT)
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-white print:p-2 print:overflow-visible">
          {activeTab === 'receipt' ? (
            /* ================= CUSTOMER RECEIPT ================= */
            <div className="border border-[#ebd5da] rounded-xl p-5 bg-[#fdf5f6]/40 shadow-xs font-mono text-xs text-[#800000] print:border-none print:bg-white print:p-0">
              
              {/* Header */}
              <div className="text-center pb-3 border-b border-dashed border-[#ebd5da]">
                <h2 className="text-xl font-black tracking-tight text-[#800000]">
                  TALK OF THE TOWN
                </h2>
                <p className="text-[11px] text-[#800000]/80 font-bold mt-0.5">
                  Authentic Asian Fast Food & Quick Service
                </p>
                <p className="text-[10px] text-[#800000]/70">
                  Tel: +91 98765 43210 • GSTIN: 18AABCT1332M1ZT
                </p>
                <p className="text-[10px] text-[#800000]/70">
                  Main Road Counter, City Center
                </p>
              </div>

              {/* Order Meta */}
              <div className="py-2.5 border-b border-dashed border-[#ebd5da] space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#800000]/70">Bill No:</span>
                  <span className="font-black text-[#800000]">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#800000]/70">Date & Time:</span>
                  <span className="font-bold text-[#800000]">
                    {dateFormatted} {timeFormatted}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#800000]/70">Channel / Table:</span>
                  <span className="font-black text-[#800000]">
                    {order.orderType === 'DINE_IN' 
                      ? `Dine In (${order.tableNumber || 'Table 1'})`
                      : (order.orderType || 'Takeaway')}
                  </span>
                </div>
                {order.customerName && (
                  <div className="flex justify-between">
                    <span className="text-[#800000]/70">Customer:</span>
                    <span className="font-bold text-[#800000]">
                      {order.customerName} {order.customerPhone ? `(${order.customerPhone})` : ''}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#800000]/70">Cashier:</span>
                  <span className="font-bold text-[#800000]">
                    {order.cashierName || 'Counter POS'}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="py-3 border-b border-dashed border-[#ebd5da] space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase text-[#800000]/60 pb-1 border-b border-[#ebd5da]/50">
                  <span className="flex-1">Item & Variant</span>
                  <span className="w-12 text-center">Qty</span>
                  <span className="w-16 text-right">Price</span>
                </div>

                {order.items.map((item, idx) => {
                  const displayName = item.selectedOption
                    ? `${item.name} (${item.selectedOption})`
                    : (item.size && item.size !== 'Standard' ? `${item.name} — ${item.size}` : item.name);
                  
                  return (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between items-start text-xs">
                        <div className="flex-1 pr-2">
                          <div className="font-bold text-[#800000]">
                            {displayName}
                          </div>
                          {item.notes && (
                            <div className="text-[10px] text-[#800000]/70 italic">
                              * {item.notes}
                            </div>
                          )}
                        </div>
                        <div className="w-12 text-center font-bold text-[#800000]">
                          {item.quantity}
                        </div>
                        <div className="w-16 text-right font-black text-[#800000]">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Financial Totals */}
              <div className="py-2.5 border-b border-dashed border-[#ebd5da] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#800000]/80">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal.toFixed(2)}</span>
                </div>

                {order.discountAmount && order.discountAmount > 0 ? (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount {order.discountReason ? `(${order.discountReason})` : ''}</span>
                    <span>-₹{order.discountAmount.toFixed(2)}</span>
                  </div>
                ) : null}

                <div className="flex justify-between text-[#800000]/70 text-[11px]">
                  <span>CGST (2.5%)</span>
                  <span>₹{(order.cgst !== undefined ? order.cgst : (order.tax / 2)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#800000]/70 text-[11px]">
                  <span>SGST (2.5%)</span>
                  <span>₹{(order.sgst !== undefined ? order.sgst : (order.tax / 2)).toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-base font-black text-[#800000] pt-2 border-t border-[#ebd5da]">
                  <span>TOTAL AMOUNT</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Settlement / Tender Details */}
              <div className="py-2 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#800000]/70">Payment Mode:</span>
                  <span className="font-black text-[#800000]">
                    {order.paymentMethod || 'CASH'}
                  </span>
                </div>
                {order.paymentDetails?.cashTendered !== undefined && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-[#800000]/70">Cash Tendered:</span>
                      <span className="font-bold text-[#800000]">₹{order.paymentDetails.cashTendered.toFixed(2)}</span>
                    </div>
                    {order.paymentDetails.changeDue !== undefined && (
                      <div className="flex justify-between font-black text-[#800000]">
                        <span>Change Returned:</span>
                        <span>₹{order.paymentDetails.changeDue.toFixed(2)}</span>
                      </div>
                    )}
                  </>
                )}
                {order.paymentDetails?.upiReference && (
                  <div className="flex justify-between">
                    <span className="text-[#800000]/70">UPI Ref / UTR:</span>
                    <span className="font-mono text-[#800000]">{order.paymentDetails.upiReference}</span>
                  </div>
                )}
                {order.paymentDetails?.cardLast4 && (
                  <div className="flex justify-between">
                    <span className="text-[#800000]/70">Card Ending:</span>
                    <span className="font-mono text-[#800000]">•••• {order.paymentDetails.cardLast4} ({order.paymentDetails.cardType || 'Card'})</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="text-center text-[11px] text-[#800000]/70 mt-4 pt-3 border-t border-dashed border-[#ebd5da]">
                <p className="font-bold">Thank you for dining at Talk of the Town!</p>
                <p className="text-[10px] mt-0.5">Please keep this bill for any queries.</p>
              </div>
            </div>
          ) : (
            /* ================= KITCHEN ORDER TICKET (KOT) ================= */
            <div className="border-2 border-[#800000] rounded-xl p-5 bg-white shadow-xs font-mono text-[#800000] print:border-none print:p-0">
              <div className="bg-[#800000] text-white p-3 rounded-lg text-center mb-4 print:bg-white print:text-black print:border-b-2 print:border-black">
                <span className="text-xs uppercase tracking-widest font-black block">
                  KITCHEN ORDER TICKET (KOT)
                </span>
                <h2 className="text-3xl font-black mt-0.5">
                  {order.tableNumber || (order.orderType === 'TAKEAWAY' ? 'TAKEAWAY' : order.orderNumber)}
                </h2>
                <div className="text-xs flex justify-center gap-3 mt-1 font-bold">
                  <span>Order: {order.orderNumber}</span>
                  <span>•</span>
                  <span>Time: {timeFormatted}</span>
                </div>
              </div>

              {order.orderNotes && (
                <div className="mb-3 p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold">
                  ⚠️ Special Order Instruction: {order.orderNotes}
                </div>
              )}

              <div className="space-y-2.5">
                {order.items.map((item, idx) => {
                  const displayName = item.selectedOption 
                    ? `${item.name} (${item.selectedOption})`
                    : (item.size && item.size !== 'Standard' ? `${item.name} — ${item.size}` : item.name);

                  return (
                    <div key={idx} className="flex items-start justify-between p-3 rounded-lg bg-[#fdf5f6] border border-[#ebd5da]">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-[#800000] bg-white border-2 border-[#800000] px-3 py-1 rounded-lg">
                          {item.quantity}x
                        </span>
                        <div>
                          <div className="font-black text-sm text-[#800000]">
                            {displayName}
                          </div>
                          {item.size && (
                            <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded bg-[#800000] text-white">
                              SIZE: {item.size}
                            </span>
                          )}
                          {item.notes && (
                            <span className="block text-xs font-bold text-red-700 mt-1">
                              👉 Note: {item.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-[#ebd5da] text-center text-xs text-[#800000]/70 font-sans font-bold">
                Route: Main Kitchen • Priority: Normal
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions - Hidden on Print */}
        <div className="p-4 bg-[#fdf5f6] border-t border-[#ebd5da] flex gap-2.5 print:hidden">
          <button
            type="button"
            onClick={handleShareSummary}
            className="py-3 px-4 rounded-xl border border-[#ebd5da] bg-white font-black text-xs text-[#800000] hover:bg-[#fee8eb] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            title="Copy digital bill summary"
          >
            {copiedShare ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            {copiedShare ? 'Copied' : 'Share'}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-3 px-4 rounded-xl border border-[#ebd5da] bg-white font-black text-sm text-[#800000] hover:bg-[#fee8eb] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print {activeTab === 'receipt' ? 'Customer Bill' : 'KOT'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-[#800000] hover:bg-[#680016] text-white font-black text-sm transition-colors shadow-xs cursor-pointer"
          >
            New Sale / Done
          </button>
        </div>
      </div>
    </div>
  );
}
