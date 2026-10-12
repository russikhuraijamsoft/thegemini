import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, UserPlus, FileText, ClipboardList } from 'lucide-react';

export function QuickActions() {
  const actions = [
    { name: 'New Order', icon: ShoppingCart, to: '/pos' },
    { name: 'Add Customer', icon: UserPlus, to: '/crm' },
    { name: 'Inventory Count', icon: ClipboardList, to: '/inventory' },
    { name: 'View Reports', icon: FileText, to: '/finance' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action) => (
        <Link 
          key={action.name}
          to={action.to}
          className="bg-white rounded-xl p-4 border border-[#ebd5da] shadow-xs hover:border-[#800000] hover:shadow-sm transition-all flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 bg-[#800000] text-white group-hover:scale-105 transition-transform shadow-xs">
            <action.icon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-[#800000] leading-tight group-hover:underline">{action.name}</h4>
          </div>
        </Link>
      ))}
    </div>
  );
}
