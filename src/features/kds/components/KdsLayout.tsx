import React, { useEffect, useState } from 'react';
import { useKdsStore } from '../store/kdsStore';
import { TicketBoard } from './TicketBoard';
import { KdsAnalytics } from './KdsAnalytics';
import { ChefHat, Clock, CheckSquare, BarChart3, ListOrdered } from 'lucide-react';
import { differenceInMinutes } from 'date-fns';

export function KdsLayout() {
  const { stations, activeStationId, setActiveStation, loadStations, subscribeToTickets, tickets } = useKdsStore();
  const [activeTab, setActiveTab] = useState<'queue' | 'analytics'>('queue');

  useEffect(() => {
    loadStations();
  }, [loadStations]);

  useEffect(() => {
    const unsubscribe = subscribeToTickets();
    return () => unsubscribe();
  }, [subscribeToTickets, activeStationId]);

  // Derived metrics
  const activeTicketsCount = tickets.filter(t => t.status !== 'READY').length;
  
  let totalPrepTime = 0;
  let delayedCount = 0;
  
  tickets.forEach(t => {
    if (t.status !== 'READY') {
      const created = new Date(t.createdAt);
      const target = new Date(t.targetTime);
      const now = new Date();
      totalPrepTime += Math.max(0, differenceInMinutes(now, created));
      if (differenceInMinutes(now, target) > 0) delayedCount++;
    }
  });

  const avgPrepTime = activeTicketsCount > 0 ? Math.round(totalPrepTime / activeTicketsCount) : 0;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="h-16 bg-slate-900 text-white flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-indigo-400" />
            <h1 className="text-xl font-bold tracking-tight">KDS</h1>
          </div>
          
          <div className="flex bg-slate-800 rounded-lg p-1 mx-2">
            <button
              onClick={() => setActiveTab('queue')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'queue' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
              <span className="hidden sm:inline">Queue</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'analytics' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </button>
          </div>

          <div className="h-6 w-px bg-slate-700 mx-1"></div>
          
          {/* Station Selector */}
          <div className="flex space-x-1 overflow-x-auto no-scrollbar">
            {stations.map(station => (
              <button
                key={station.id}
                onClick={() => setActiveStation(station.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeStationId === station.id 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {station.name}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Active</p>
              <p className="text-lg font-bold leading-none">{activeTicketsCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Avg Time</p>
              <p className="text-lg font-bold leading-none">{avgPrepTime}m</p>
            </div>
          </div>
          {delayedCount > 0 && (
            <div className="flex items-center gap-2 bg-red-900/30 px-3 py-1.5 rounded-lg border border-red-500/30">
               <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
               <div>
                 <p className="text-xs text-red-400 uppercase tracking-wider font-bold">Delayed</p>
                 <p className="text-lg font-bold leading-none text-red-400">{delayedCount}</p>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Area */}
      {activeTab === 'queue' ? <TicketBoard /> : <KdsAnalytics />}
    </div>
  );
}
