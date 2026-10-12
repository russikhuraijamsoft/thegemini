import React from 'react';
import { useAuth } from '../../../core/auth/AuthContext';
import { SalesSummaryWidget } from '../components/SalesSummaryWidget';
import { QuickActions } from '../components/QuickActions';
import { KitchenStatusWidget } from '../components/KitchenStatusWidget';
import { InventoryAlertsWidget } from '../components/InventoryAlertsWidget';
import { RecentActivity } from '../components/RecentActivity';
import { StaffAttendanceWidget } from '../components/StaffAttendanceWidget';
import { TaskCenterWidget } from '../components/TaskCenterWidget';

export function DashboardPage() {
  const { profile, hasRole } = useAuth();
  
  const role = profile?.roles?.[0] || 'User';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back, {profile?.displayName?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Here's what's happening at your restaurant today.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 shadow-sm text-sm font-medium text-slate-700 dark:text-slate-300">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      <QuickActions />

      {/* Role-based conditional widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Area - 2/3 width on large screens */}
        <div className="lg:col-span-2 space-y-6">
          {(hasRole('OWNER') || hasRole('ADMIN') || hasRole('MANAGER') || hasRole('ACCOUNTANT')) && (
            <SalesSummaryWidget />
          )}

          {(hasRole('OWNER') || hasRole('ADMIN') || hasRole('MANAGER') || hasRole('KITCHEN')) && (
            <KitchenStatusWidget />
          )}
          
          <RecentActivity />
        </div>

        {/* Sidebar Area - 1/3 width on large screens */}
        <div className="space-y-6">
          {(hasRole('OWNER') || hasRole('ADMIN') || hasRole('MANAGER') || hasRole('INVENTORY')) && (
            <InventoryAlertsWidget />
          )}
          
          {(hasRole('OWNER') || hasRole('ADMIN') || hasRole('MANAGER')) && (
            <TaskCenterWidget />
          )}

          {(hasRole('OWNER') || hasRole('ADMIN') || hasRole('MANAGER') || hasRole('HR')) && (
            <StaffAttendanceWidget />
          )}
          
          {/* Notifications Panel could go here */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">System Health</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">POS Terminals</span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> 4/4 Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">KDS Screens</span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> 2/2 Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Payment Gateway</span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Last Sync</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
