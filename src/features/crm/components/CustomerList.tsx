import React, { useState } from 'react';
import { useCrmStore } from '../store/crmStore';
import { Card, CardContent } from '../../../shared/components/ui/Card';
import { Search, Plus, Filter, MoreVertical, MapPin, Mail, Phone } from 'lucide-react';

export function CustomerList() {
  const { customers } = useCrmStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search customers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map(customer => (
          <Card key={customer.id} className="hover:border-indigo-500/50 transition-colors">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    {customer.firstName} {customer.lastName}
                  </h3>
                  <div className="flex items-center gap-1 mt-1 text-sm text-slate-500">
                    <span className={`px-2 py-0.5 rounded-full font-medium text-xs ${
                      customer.tier === 'PLATINUM' ? 'bg-slate-800 text-slate-200 dark:bg-slate-200 dark:text-slate-800' :
                      customer.tier === 'GOLD' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                      customer.tier === 'SILVER' ? 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300' :
                      'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                    }`}>
                      {customer.tier}
                    </span>
                    <span className="ml-2 font-medium text-indigo-600 dark:text-indigo-400">
                      {customer.loyaltyPoints} pts
                    </span>
                  </div>
                </div>
                <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-400">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{customer.phone}</span>
                </div>
                {customer.addresses.length > 0 && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{customer.addresses[0].city}, {customer.addresses[0].state}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="text-xs text-slate-500">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{customer.totalVisits}</span> visits
                </div>
                <div className="text-xs text-slate-500">
                  <span className="font-medium text-slate-700 dark:text-slate-300">${customer.totalSpent.toFixed(2)}</span> spent
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
