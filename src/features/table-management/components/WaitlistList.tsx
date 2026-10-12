import React from 'react';
import { useTableStore } from '../store/tableStore';
import { ListTodo, User, Users, Clock, Edit, CheckCircle } from 'lucide-react';

export function WaitlistList() {
  const { waitlist } = useTableStore();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
          <ListTodo className="w-5 h-5 mr-2 text-amber-500" />
          Waitlist Queue
        </h3>
        <button className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors">
          Add Guest
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {waitlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400 py-12">
            <ListTodo className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" />
            <p>Waitlist is empty</p>
          </div>
        ) : (
          <div className="space-y-3">
            {waitlist.map(entry => (
              <div key={entry.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:border-amber-300 dark:hover:border-amber-700 transition-colors bg-white dark:bg-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center mb-1">
                    <span className="font-semibold text-slate-900 dark:text-white mr-2">{entry.customerName}</span>
                    <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded flex items-center">
                      <Users className="w-3 h-3 mr-1" /> {entry.guestCount}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
                    <Clock className="w-4 h-4 mr-1 opacity-70" />
                    Quoted: {entry.quotedTime} (~{entry.estimatedWaitMinutes}m)
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-2 text-slate-400 hover:text-green-500 transition-colors tooltip" title="Seat Guest">
                    <CheckCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
