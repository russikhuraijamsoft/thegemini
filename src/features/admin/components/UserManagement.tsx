import React from 'react';
import { useAdminStore } from '../store/adminStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/Card';
import { UserPlus, MoreVertical, Shield } from 'lucide-react';

export function UserManagement() {
  const { users } = useAdminStore();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Users & Roles</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">User</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Role</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Branches</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Status</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Last Login</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/25 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900 dark:text-white">{user.name}</span>
                      <span className="text-sm text-slate-500">{user.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                      <Shield className="w-3 h-3" />
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">
                    {user.branchIds.length} Assigned
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 text-xs font-medium rounded-full ${
                      user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 text-sm">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString('en-IN') : 'Never'}
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
