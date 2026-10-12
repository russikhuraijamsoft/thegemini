import React, { useState } from 'react';
import { useHrStore } from '../store/hrStore';
import { Search, Filter, Clock } from 'lucide-react';

export function AttendanceList() {
  const { attendance } = useHrStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAttendance = attendance.filter(a => 
    a.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.date.includes(searchTerm)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search attendance..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter Date</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Date</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Employee</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Clock In</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Clock Out</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 text-right">Overtime (hrs)</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredAttendance.map((att) => (
                <tr key={att.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/25 transition-colors cursor-pointer">
                  <td className="p-4 text-slate-500">
                    {new Date(att.date).toLocaleDateString('en-IN')}
                  </td>
                  <td className="p-4 font-medium text-slate-900 dark:text-white">
                    {att.employeeName}
                  </td>
                  <td className="p-4 text-slate-500">
                    {att.clockIn ? new Date(att.clockIn).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--'}
                  </td>
                  <td className="p-4 text-slate-500">
                    {att.clockOut ? new Date(att.clockOut).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--'}
                  </td>
                  <td className="p-4 text-right font-medium text-slate-700 dark:text-slate-300">
                    {att.overtimeHours > 0 ? att.overtimeHours.toFixed(1) : '-'}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 text-xs font-medium rounded-full ${
                      att.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      att.status === 'LATE' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                      att.status === 'HALF_DAY' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {att.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredAttendance.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
