import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { DollarSign, TrendingUp, Users, ShoppingBag } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '10am', sales: 40000 },
  { time: '11am', sales: 60000 },
  { time: '12pm', sales: 120000 },
  { time: '1pm', sales: 150000 },
  { time: '2pm', sales: 90000 },
  { time: '3pm', sales: 60000 },
  { time: '4pm', sales: 80000 },
];

export function SalesSummaryWidget() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg text-[#800000]">Revenue Overview</CardTitle>
        <span className="text-xs font-bold text-[#800000] bg-[#fdf5f6] border border-[#ebd5da] px-2.5 py-1 rounded-full">Today</span>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="space-y-1 bg-[#fdf5f6] p-3 rounded-lg border border-[#ebd5da]">
            <p className="text-xs font-bold text-[#800000]/70 flex items-center gap-1"><DollarSign className="w-4 h-4"/> Revenue</p>
            <p className="text-2xl font-black text-[#800000]">₹6,00,000</p>
            <p className="text-xs text-[#800000] font-semibold flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> +12.5% vs yesterday</p>
          </div>
          <div className="space-y-1 bg-[#fdf5f6] p-3 rounded-lg border border-[#ebd5da]">
            <p className="text-xs font-bold text-[#800000]/70 flex items-center gap-1"><ShoppingBag className="w-4 h-4"/> Orders</p>
            <p className="text-2xl font-black text-[#800000]">124</p>
            <p className="text-xs text-[#800000] font-semibold flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> +5.2% vs yesterday</p>
          </div>
          <div className="space-y-1 bg-[#fdf5f6] p-3 rounded-lg border border-[#ebd5da]">
            <p className="text-xs font-bold text-[#800000]/70 flex items-center gap-1"><Users className="w-4 h-4"/> Guests</p>
            <p className="text-2xl font-black text-[#800000]">312</p>
            <p className="text-xs text-[#800000] font-semibold flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> +8.1% vs yesterday</p>
          </div>
          <div className="space-y-1 bg-[#fdf5f6] p-3 rounded-lg border border-[#ebd5da]">
            <p className="text-xs font-bold text-[#800000]/70">Avg Ticket</p>
            <p className="text-2xl font-black text-[#800000]">₹4,838</p>
            <p className="text-xs text-[#800000]/60 font-semibold">Standard dine-in</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#800000" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#800000" stopOpacity={0.02}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ebd5da" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#800000', fontWeight: 600 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#800000', fontWeight: 600 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #ebd5da', backgroundColor: '#ffffff', color: '#800000' }}
                itemStyle={{ color: '#800000', fontWeight: 700 }}
              />
              <Area type="monotone" dataKey="sales" stroke="#800000" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
