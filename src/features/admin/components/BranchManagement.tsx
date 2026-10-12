import React from 'react';
import { useAdminStore } from '../store/adminStore';
import { Card, CardContent } from '../../../shared/components/ui/Card';
import { Building2, Plus, MoreVertical, MapPin } from 'lucide-react';

export function BranchManagement() {
  const { branches } = useAdminStore();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Branch Management</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Branch
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {branches.map(branch => (
          <Card key={branch.id} className="hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{branch.name}</h3>
                    <p className="text-xs font-medium text-slate-500">Code: {branch.code}</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400" />
                  {branch.address}
                </p>
                <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs">
                  <span className="text-slate-500">GSTIN: {branch.gstin || 'N/A'}</span>
                  <span className={`px-2 py-0.5 rounded-full font-medium ${
                    branch.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {branch.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
