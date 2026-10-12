import React from 'react';
import { useHrStore } from '../store/hrStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { Users, Clock, CalendarDays, Wallet } from 'lucide-react';

export function HrDashboard() {
  const { employees, attendance, leaveRequests, payroll } = useHrStore();

  const activeEmployees = employees.filter(e => e.status === 'ACTIVE').length;
  
  const today = new Date().toISOString().split('T')[0];
  const presentToday = attendance.filter(a => a.date === today && a.status === 'PRESENT').length;
  const attendanceRate = activeEmployees > 0 ? (presentToday / activeEmployees) * 100 : 0;
  
  const pendingLeaves = leaveRequests.filter(l => l.status === 'PENDING').length;
  
  const totalPayroll = payroll.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.grossEarnings, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Active Employees" 
          value={activeEmployees.toString()}
          icon={<Users className="w-5 h-5 text-indigo-500" />}
        />
        <StatCard 
          title="Today's Attendance" 
          value={`${attendanceRate.toFixed(0)}%`}
          icon={<Clock className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard 
          title="Pending Leaves" 
          value={pendingLeaves.toString()}
          icon={<CalendarDays className="w-5 h-5 text-amber-500" />}
        />
        <StatCard 
          title="Total Payroll (YTD)" 
          value={`₹${totalPayroll.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          icon={<Wallet className="w-5 h-5 text-blue-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaveRequests.slice(0, 5).map(leave => (
                <div key={leave.id} className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{leave.employeeName}</p>
                    <p className="text-sm text-slate-500">{leave.type.replace('_', ' ')} Leave • {new Date(leave.startDate).toLocaleDateString('en-IN')} to {new Date(leave.endDate).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      leave.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      leave.status === 'PENDING' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {leave.status}
                    </span>
                  </div>
                </div>
              ))}
              {leaveRequests.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No leave requests pending.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Department Strength</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from(new Set(employees.map(e => e.department))).map(dept => {
                const count = employees.filter(e => e.department === dept && e.status === 'ACTIVE').length;
                return (
                  <div key={dept} className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{dept.replace(/_/g, ' ')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 dark:text-white">{count} Employees</p>
                    </div>
                  </div>
                );
              })}
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
