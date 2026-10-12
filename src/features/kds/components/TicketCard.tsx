import React, { useEffect, useState } from 'react';
import { Ticket, TicketItem } from '../models/kds';
import { Clock, AlertTriangle, CheckCircle, ChefHat } from 'lucide-react';
import { useKdsStore } from '../store/kdsStore';
import { formatDistanceToNow, differenceInMinutes } from 'date-fns';

interface TicketCardProps {
  ticket: Ticket;
  activeStationId: string | null;
}

export function TicketCard({ ticket, activeStationId }: TicketCardProps) {
  const { updateTicketStatus, updateItemStatus } = useKdsStore();
  const [elapsed, setElapsed] = useState('');
  const [isDelayed, setIsDelayed] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const created = new Date(ticket.createdAt);
      const target = new Date(ticket.targetTime);
      const now = new Date();
      
      setElapsed(formatDistanceToNow(created, { addSuffix: false }));
      
      if (differenceInMinutes(now, target) > 0 && ticket.status !== 'READY') {
        setIsDelayed(true);
      } else {
        setIsDelayed(false);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000); // update every minute
    return () => clearInterval(interval);
  }, [ticket.createdAt, ticket.targetTime, ticket.status]);

  // Filter items by active station unless it's Expeditor (which sees all) or no station selected
  // We'll assume activeStationId 'st_5' is expeditor for this demo
  const displayItems = ticket.items.filter(item => 
    !activeStationId || activeStationId === 'st_5' || item.stationId === activeStationId
  );

  if (displayItems.length === 0) return null;

  const headerColors = {
    NORMAL: 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white',
    HIGH: 'bg-amber-500 text-white',
    URGENT: 'bg-red-600 text-white animate-pulse',
  };

  const handleNextTicketState = () => {
    if (ticket.status === 'NEW') updateTicketStatus(ticket.id, 'ACCEPTED');
    else if (ticket.status === 'ACCEPTED') updateTicketStatus(ticket.id, 'PREPARING');
    else if (ticket.status === 'PREPARING') updateTicketStatus(ticket.id, 'READY');
  };

  return (
    <div className={`flex flex-col bg-white dark:bg-slate-800 rounded-lg shadow-sm border overflow-hidden ${
      isDelayed ? 'border-red-500 shadow-red-500/20' : 'border-slate-200 dark:border-slate-700'
    }`}>
      {/* Header */}
      <div className={`px-4 py-3 flex justify-between items-center ${headerColors[ticket.priority]}`}>
        <div>
          <h3 className="font-bold text-lg leading-none">{ticket.orderNumber}</h3>
          <p className="text-xs font-medium opacity-90 mt-1 uppercase tracking-wider">{ticket.type} {ticket.tableNumber && `- TBL ${ticket.tableNumber}`}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1 font-bold text-lg">
            {isDelayed && <AlertTriangle className="w-5 h-5" />}
            <span>{elapsed}</span>
          </div>
          <p className="text-xs opacity-90">{new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>

      {/* Action Bar (Optional based on state) */}
      <div className="bg-slate-50 dark:bg-slate-800/80 p-2 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
          {ticket.status}
        </span>
        {ticket.status !== 'READY' && (
           <button 
             onClick={handleNextTicketState}
             className="text-xs font-bold px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
           >
             {ticket.status === 'NEW' ? 'ACCEPT' : ticket.status === 'ACCEPTED' ? 'START' : 'MARK READY'}
           </button>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-96">
        {displayItems.map((item) => (
          <TicketItemRow 
            key={item.id} 
            item={item} 
            ticketId={ticket.id}
          />
        ))}
      </div>
    </div>
  );
}

function TicketItemRow({ item, ticketId }: { item: TicketItem, ticketId: string }) {
  const { updateItemStatus } = useKdsStore();
  const isDone = item.status === 'READY';

  const toggleStatus = () => {
    updateItemStatus(ticketId, item.id, isDone ? 'PENDING' : 'READY');
  };

  return (
    <div 
      onClick={toggleStatus}
      className={`p-3 rounded-md border cursor-pointer transition-colors ${
        isDone 
          ? 'bg-slate-100 dark:bg-slate-800/50 border-transparent opacity-60' 
          : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          {isDone ? (
            <CheckCircle className="w-6 h-6 text-emerald-500" />
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <span className={`font-bold text-lg leading-tight ${isDone ? 'line-through text-[#800000]/50' : 'text-[#800000]'}`}>
              <span className="mr-2 text-[#800000]">{item.quantity}x</span>
              {item.productName}{item.size && item.size !== 'Standard' && !item.productName.includes('—') && !item.productName.includes('-') ? ` — ${item.size}` : ''}
            </span>
          </div>
          
          {item.modifiers.length > 0 && (
            <ul className={`mt-1 space-y-0.5 ${isDone ? 'line-through text-slate-400' : 'text-red-600 dark:text-red-400'}`}>
              {item.modifiers.map((mod, idx) => (
                <li key={idx} className="text-sm font-medium flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-current"></span>
                  {mod}
                </li>
              ))}
            </ul>
          )}

          {item.notes && (
            <div className={`mt-1.5 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm font-medium ${isDone ? 'text-slate-400' : 'text-amber-800 dark:text-amber-400'}`}>
              Note: {item.notes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
