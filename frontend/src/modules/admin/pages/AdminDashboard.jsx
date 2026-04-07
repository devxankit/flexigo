import React from 'react';
import { 
  Zap, 
  Activity, 
  Users, 
  Warehouse, 
  TrendingUp, 
  ShieldCheck, 
  Signal,
  ArrowUpRight,
  Globe,
  ChevronRight
} from 'lucide-react';
import AdminStatCard from '../components/AdminStatCard';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { adminDataStore } from '../store/adminDataStore';

const COLORS = ['#10b981', '#0ea5e9', '#f59e0b', '#ef4444'];

export default function AdminDashboard() {
  const { networkStats, hubs, revenueData, fleetDistribution } = adminDataStore;
  const [activeView, setActiveView] = React.useState('live');


  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-3 rounded-xl shadow-xl backdrop-blur-md">
          <p className="text-[10px] font-bold uppercase text-[var(--text-tertiary)] mb-1 tracking-wider">{label}</p>
          <p className="text-sm font-bold text-emerald-500 tracking-tight">{payload[0].value}L</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
               <h1 className="text-2xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Admin <span className="text-emerald-500">Dashboard</span>
               </h1>
            </div>
            <div className="flex items-center gap-4 ml-4">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
                  Flexigo Operations Hub
               </p>
               <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[8px] font-black text-emerald-500">
                  <Signal size={10} /> SYSTEM ONLINE
               </div>
               <button 
                  onClick={() => alert("SYSTEM FLUSH: SUCCESS")}
                  className="flex items-center gap-2 px-3 py-1 bg-rose-600/10 border border-rose-500/20 text-rose-500 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-95 ml-2"
               >
                  <Zap size={10} fill="currentColor" /> Flush Log
               </button>
            </div>

         </div>
         
          <div className="flex bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-1 shadow-sm">
             <button 
                onClick={() => setActiveView('live')}
                className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                   activeView === 'live' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/20' : 'text-[var(--text-tertiary)] hover:text-emerald-500'
                }`}
             >
                Live View
             </button>
             <button 
                onClick={() => setActiveView('history')}
                className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                   activeView === 'history' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/20' : 'text-[var(--text-tertiary)] hover:text-emerald-500'
                }`}
             >
                History
             </button>
          </div>


      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
         <AdminStatCard title="Total Revenue" value={`₹${(networkStats.grossRevenue / 100000).toFixed(1)}L`} trend="up" trendValue="+12.4%" icon={Zap} color="emerald" subtitle="Earnings this month" />
         <AdminStatCard title="In Use" value={networkStats.activeFleet} trend="up" trendValue="+5.2%" icon={Activity} color="blue" subtitle="Current vehicles on road" />
         <AdminStatCard title="Our Hubs" value={networkStats.totalHubs} icon={Warehouse} color="emerald" subtitle="Total locations" />
         <AdminStatCard title="Vehicle Health" value={networkStats.avgUptime} icon={ShieldCheck} color="emerald" subtitle="Overall fleet health" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Revenue Chart */}
         <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2rem] p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <TrendingUp size={120} />
            </div>
            
            <div className="flex items-center justify-between mb-10">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                     <TrendingUp size={20} />
                  </div>
                  <div>
                     <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">Revenue Growth</h3>
                     <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase mt-1">Monthly trend</p>
                  </div>
               </div>
            </div>

            <div className="h-72 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                     <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                           <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} opacity={0.5} />
                     <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: 'var(--text-tertiary)', fontSize: 10, fontWeight: 900 }} 
                       dy={10}
                     />
                     <YAxis hide />
                     <Tooltip content={<CustomTooltip />} />
                     <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Distribution & Integrity */}
         <div className="space-y-6">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2rem] p-8 shadow-sm overflow-hidden relative h-full flex flex-col">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                     <Globe size={20} />
                  </div>
                  <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">Vehicle Locations</h3>
               </div>
               
               <div className="flex-1 min-h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                           data={fleetDistribution}
                           innerRadius={60}
                           outerRadius={80}
                           paddingAngle={8}
                           dataKey="value"
                           stroke="none"
                        >
                           {fleetDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                           ))}
                        </Pie>
                        <Tooltip 
                           contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}
                           itemStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
                        />
                     </PieChart>
                  </ResponsiveContainer>
               </div>

               <div className="mt-6 grid grid-cols-2 gap-4">
                  {fleetDistribution.map((item, idx) => (
                     <div key={item.name} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                           <span className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">{item.name}</span>
                        </div>
                        <span className="text-sm font-black text-[var(--text-primary)] ml-3.5 tracking-tight">{item.value}</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* Network Node Registry */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2rem] overflow-hidden shadow-sm">
         <div className="p-8 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Warehouse size={20} />
               </div>
               <div>
                  <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">Hub Location Monitoring</h3>
                  <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase mt-1">Status of all our branch locations</p>
               </div>
            </div>
             <button 
                onClick={() => alert("FETCHING_GRID_ANALYTICS: HUB_REGISTRY_V2")}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-tertiary)] hover:bg-emerald-600/10 border border-[var(--border-subtle)] hover:border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-primary)] hover:text-emerald-500 transition-all group active:scale-95"
             >
                Full Grid View <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
             </button>
         </div>
         
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full">
               <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/30">
                     {['Hub Name', 'City', 'Vehicles', 'Revenue', 'Health Status', 'Status'].map((header) => (
                        <th key={header} className="text-left py-5 px-8 text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-tertiary)]">
                           {header}
                        </th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-[var(--border-subtle)]">
                  {hubs.map((hub) => (
                     <tr key={hub.id} className="group/row hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                        <td className="py-6 px-8">
                           <div className="flex flex-col gap-0.5">
                              <span className="text-xs font-black text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{hub.name}</span>
                              <span className="text-[9px] font-bold text-[var(--text-tertiary)] tracking-widest">{hub.id}</span>
                           </div>
                        </td>
                        <td className="py-6 px-8 text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest italic">{hub.city}</td>
                        <td className="py-6 px-8">
                           <div className="flex flex-col gap-2">
                              <div className="flex justify-between items-baseline">
                                 <span className="text-[11px] font-black text-[var(--text-primary)]">{hub.fleet}</span>
                                 <span className="text-[8px] font-bold text-[var(--text-tertiary)] uppercase">Assets</span>
                              </div>
                              <div className="w-24 h-1 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                                 <div className="h-full bg-blue-500" style={{ width: `${(hub.fleet/450)*100}%` }} />
                              </div>
                           </div>
                        </td>
                        <td className="py-6 px-8 text-xs font-black text-emerald-500 tracking-tight">₹{(hub.revenue / 100000).toFixed(1)}L</td>
                        <td className="py-6 px-8">
                           <div className="flex items-center gap-3">
                              <div className="flex-1 w-16 h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                                 <div 
                                   className={`h-full ${parseInt(hub.health) > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                                   style={{ width: hub.health }} 
                                 />
                              </div>
                              <span className="text-[10px] font-black text-[var(--text-primary)] w-8">{hub.health}</span>
                           </div>
                        </td>
                        <td className="py-6 px-8">
                           <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 w-fit">
                              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-[9px] font-black uppercase tracking-widest">{hub.status}</span>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
