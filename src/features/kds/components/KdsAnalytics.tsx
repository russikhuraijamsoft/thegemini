import React from 'react';
import { useKdsStore } from '../store/kdsStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { Clock, TrendingUp, AlertCircle, ChefHat } from 'lucide-react';

export function KdsAnalytics() {
  const { tickets, stations } = useKdsStore();

  const totalTickets = tickets.length;
  const completedTickets = tickets.filter(t => t.status === 'READY').length;
  const completionRate = totalTickets > 0 ? Math.round((completedTickets / totalTickets) * 100) : 0;

  // Station specific workloads
  const stationWorkloads = stations.map(station => {
    let pendingItems = 0;
    tickets.forEach(ticket => {
      ticket.items.forEach(item => {
        if (item.stationId === station.id && item.status !== 'READY') {
          pendingItems++;
        }
      });
    });
    return { ...station, pendingItems };
  }).filter(s => s.pendingItems > 0 || s.isActive);

  return (
    <div className="flex-1 p-4 lg:p-6 overflow-y-auto bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Kitchen Analytics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Orders Today"
            value={totalTickets.toString()}
            icon={<ListOrderedIcon className="w-5 h-5 text-indigo-500" />}
            trend="+12% from yesterday"
          />
          <StatCard 
            title="Completed"
            value={completedTickets.toString()}
            icon={<CheckSquareIcon className="w-5 h-5 text-emerald-500" />}
            trend={`${completionRate}% completion rate`}
          />
          <StatCard 
            title="Avg Prep Time"
            value="14m"
            icon={<Clock className="w-5 h-5 text-blue-500" />}
            trend="-2m from average"
          />
          <StatCard 
            title="Delayed Orders"
            value="1"
            icon={<AlertCircle className="w-5 h-5 text-red-500" />}
            trend="Needs attention"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-slate-500" />
                Station Workloads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stationWorkloads.map(station => (
                  <div key={station.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{station.name}</p>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">{station.type}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${station.pendingItems > 5 ? 'bg-red-500' : 'bg-indigo-500'}`}
                          style={{ width: `${Math.min(100, (station.pendingItems / 10) * 100)}%` }}
                        />
                      </div>
                      <span className="font-bold text-sm w-12 text-right">{station.pendingItems} items</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-slate-500" />
                Kitchen Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-64 text-slate-500">
              [ Efficiency Chart Placeholder ]
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
            {icon}
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{value}</h3>
          <p className="text-sm text-slate-500 mt-1">{trend}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Temporary icon fallbacks
function ListOrderedIcon(props: any) {
  return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>;
}
function CheckSquareIcon(props: any) {
  return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
