import React, { useState } from 'react';
import { useTableStore } from '../store/tableStore';
import { Calendar, User, Users, Clock, Edit, Trash, Plus } from 'lucide-react';
import { ReservationStatus } from '../models/table';

export function ReservationList() {
  const { reservations, addReservation } = useTableStore();
  const [showAdd, setShowAdd] = useState(false);

  const getStatusColor = (status: ReservationStatus) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'SEATED': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'NO_SHOW': return 'bg-gray-100 text-gray-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-indigo-500" />
          Today's Reservations
        </h3>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-sm font-medium flex items-center transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" /> New Reservation
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {reservations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400 py-12">
            <Calendar className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" />
            <p>No reservations for today</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reservations.map(res => (
              <div key={res.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors bg-white dark:bg-slate-800">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-slate-400 mr-2" />
                    <span className="font-semibold text-slate-900 dark:text-white">{res.customerName}</span>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(res.status)}`}>
                    {res.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400 mt-3">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1.5 opacity-70" />
                    {res.time}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1.5 opacity-70" />
                    {res.guestCount} guests
                  </div>
                </div>
                
                {res.notes && (
                  <div className="mt-3 text-sm text-slate-500 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/50 p-2 rounded">
                    {res.notes}
                  </div>
                )}
                
                <div className="mt-4 flex justify-end space-x-2">
                  <button className="text-slate-500 hover:text-indigo-600 p-1">
                    <Edit className="w-4 h-4" />
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
