import React from 'react';
import { useHrStore } from '../store/hrStore';

export function PayrollList() {
  const { payroll } = useHrStore();

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Period</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Employee</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 text-right">Gross (₹)</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 text-right">Deductions (₹)</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 text-right">Net Pay (₹)</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {payroll.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/25 transition-colors cursor-pointer">
                  <td className="p-4 text-slate-500">
                    {p.month}/{p.year}
                  </td>
                  <td className="p-4 font-medium text-slate-900 dark:text-white">
                    {p.employeeName}
                  </td>
                  <td className="p-4 text-right text-slate-700 dark:text-slate-300">
                    {p.grossEarnings.toLocaleString('en-IN')}
                  </td>
                  <td className="p-4 text-right text-red-500">
                    {p.totalDeductions.toLocaleString('en-IN')}
                  </td>
                  <td className="p-4 text-right font-bold text-slate-900 dark:text-white">
                    {p.netPay.toLocaleString('en-IN')}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 text-xs font-medium rounded-full ${
                      p.status === 'PAID' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
              {payroll.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No payroll records found.
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
