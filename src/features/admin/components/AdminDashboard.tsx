import React from 'react';
import { useAdminStore } from '../store/adminStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/Card';
import { Users, Building, Activity, ShieldCheck } from 'lucide-react';

export function AdminDashboard() {
  const { users, branches, logs } = useAdminStore();

  const activeUsers = users.filter(u => u.status === 'ACTIVE').length;
  const activeBranches = branches.filter(b => b.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={users.length.toString()} icon={<Users className="w-5 h-5 text-indigo-500" />} />
        <StatCard title="Active Branches" value={activeBranches.toString()} icon={<Building className="w-5 h-5 text-emerald-500" />} />
        <StatCard title="System Health" value="100%" icon={<Activity className="w-5 h-5 text-blue-500" />} />
        <StatCard title="Audit Events (24h)" value={logs.length.toString()} icon={<ShieldCheck className="w-5 h-5 text-amber-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Audit Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {logs.slice(0, 5).map(log => (
                <div key={log.id} className="flex justify-between items-start p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{log.action}</p>
                    <p className="text-sm text-slate-500">{log.userName} • {log.module}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
            {icon}
          </div>
        </div>
        <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white truncate">{value}</h3>
      </CardContent>
    </Card>
  );
}
