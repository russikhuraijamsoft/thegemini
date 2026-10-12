import React from 'react';
import { useAiStore } from '../store/aiStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { Lightbulb, AlertTriangle, TrendingUp, Sparkles, BrainCircuit } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export function AiDashboard() {
  const { insights, alerts, forecast } = useAiStore();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Alerts Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            AI Alerts & Risks
          </h2>
          {alerts.map(alert => (
            <Card key={alert.id} className="border-l-4 border-l-red-500">
              <CardContent className="p-4 flex gap-3">
                <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
                  alert.priority === 'HIGH' ? 'text-red-500' : 'text-amber-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{alert.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{new Date(alert.timestamp).toLocaleTimeString('en-IN')}</p>
                </div>
              </CardContent>
            </Card>
          ))}
          {alerts.length === 0 && (
            <p className="text-sm text-slate-500">No active alerts. Everything looks good!</p>
          )}
        </div>

        {/* Insights & Recommendations Section */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-emerald-500" />
            Insights & Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map(insight => (
              <Card key={insight.id} className="bg-gradient-to-br from-indigo-50/50 to-white dark:from-slate-800/50 dark:to-slate-900 border-indigo-100 dark:border-slate-800">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-semibold px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full">
                      {insight.type}
                    </span>
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1">{insight.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{insight.description}</p>
                  
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-indigo-50 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                      <BrainCircuit className="w-4 h-4 text-indigo-500" />
                      Recommendation
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{insight.recommendation}</p>
                    {insight.impact && (
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2 text-right">
                        Impact: {insight.impact}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>

      {/* Forecast Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            7-Day AI Sales Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecast} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#64748b" />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#64748b" tickFormatter={(value) => `₹${value/1000}k`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#64748b" />
                <RechartsTooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'projectedSales') return [`₹${value.toLocaleString('en-IN')}`, 'Projected Sales'];
                    if (name === 'projectedOrders') return [value, 'Projected Orders'];
                    return [value, name];
                  }}
                  labelStyle={{ color: '#0f172a' }}
                />
                <Line yAxisId="left" type="monotone" dataKey="projectedSales" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="projectedOrders" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
