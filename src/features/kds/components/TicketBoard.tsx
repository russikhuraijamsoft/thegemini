import React from 'react';
import { useKdsStore } from '../store/kdsStore';
import { TicketCard } from './TicketCard';

export function TicketBoard() {
  const { tickets, activeStationId } = useKdsStore();

  // Sort tickets by priority and then by creation time
  const sortedTickets = [...tickets].sort((a, b) => {
    const priorityWeight = { URGENT: 3, HIGH: 2, NORMAL: 1 };
    const pA = priorityWeight[a.priority];
    const pB = priorityWeight[b.priority];
    
    if (pA !== pB) return pB - pA;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  if (sortedTickets.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-slate-900 dark:text-white">All caught up!</h3>
        <p className="mt-1">No active tickets for this station.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 overflow-x-auto bg-slate-100 dark:bg-slate-900">
      {/* Grid layout for tickets. Can be horizontal scroll or wrapping grid depending on design */}
      <div className="flex gap-4 h-full items-start pb-4 min-w-max">
        {sortedTickets.map(ticket => (
          <div key={ticket.id} className="w-80 shrink-0">
            <TicketCard ticket={ticket} activeStationId={activeStationId} />
          </div>
        ))}
      </div>
    </div>
  );
}
