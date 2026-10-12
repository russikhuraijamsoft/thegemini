import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

export function TaskCenterWidget() {
  const tasks = [
    { id: 1, title: 'Approve Payroll', due: 'Today, 2:00 PM', completed: false, priority: 'high' },
    { id: 2, title: 'Review Weekly Schedule', due: 'Tomorrow', completed: false, priority: 'medium' },
    { id: 3, title: 'Order Produce', due: 'Today, 11:00 AM', completed: true, priority: 'high' },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-slate-500" />
          Task Center
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-lg">
              <button className="mt-0.5 flex-shrink-0 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>
              <div className={`flex-1 ${task.completed ? 'opacity-50' : ''}`}>
                <p className={`text-sm font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    {task.due}
                  </span>
                  {!task.completed && task.priority === 'high' && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 uppercase">
                      Urgent
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
