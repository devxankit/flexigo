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
import OpsFilter from '../components/OpsFilter';
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
import { useAdminDataStore } from '../store/adminDataStore';

const COLORS = ['#10b981', '#0ea5e9', '#f59e0b', '#ef4444'];

export default function AdminDashboard() {
  const { 
    networkStats, 
    hubs, 
    revenueData, 
    fleetDistribution,
    fetchDashboardStats,
    fetchHubs,
    fetchDistribution
  } = useAdminDataStore();

  const [activeView, setActiveView] = React.useState('live');
  const [activeFilters, setActiveFilters] = React.useState({
    range: 'Last 7 Days',
    metrics: {}
  });

  React.useEffect(() => {
    fetchDashboardStats();
    fetchHubs();
    fetchDistribution();
  }, []);

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    console.log('Syncing Filters:', newFilters);
  };


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
    <div className="space-y-6 pb-12">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="space-y-0.5">
            <div className="flex items-center gap-2">
               <div className="w-1 h-5 bg-emerald-600 rounded-full" />
               <h1 className="text-xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Admin <span className="text-emerald-500">Dashboard</span>
               </h1>
            </div>
            <div className="flex items-center gap-3 ml-3">
               <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
                  Flexigo Ops Hub
               </p>
               <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[7px] font-black text-emerald-500 uppercase">
                  <Signal size={8} /> System Online
               </div>
               <button 
                  onClick={() => alert("SYSTEM FLUSH: SUCCESS")}
                  className="flex items-center gap-1.5 px-2 py-0.5 bg-rose-600/10 border border-rose-500/20 text-rose-500 rounded text-[7px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all active:scale-95"
               >
                  <Zap size={8} fill="currentColor" /> Flush
               </button>
            </div>
         </div>
         
         <div className="flex items-center gap-2">
            <OpsFilter 
               onFilterChange={handleFilterChange}
               filters={[
                  { id: 'region', label: 'Region', options: ['North', 'West', 'South', 'Central'] },
                  { id: 'integrity', label: 'Health', options: ['Optimal', 'Warning', 'Critical'] }
               ]}
            />
            <div className="w-px h-5 bg-[var(--border-subtle)] mx-0.5" />
            <div className="flex bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg p-0.5 shadow-sm">
               <button 
                  onClick={() => setActiveView('live')}
                  className={`px-3 py-1 rounded text-[8px] font-black uppercase tracking-widest transition-all ${
                     activeView === 'live' ? 'bg-emerald-600 text-white' : 'text-[var(--text-tertiary)] hover:text-emerald-500'
                  }`}
               >
                  Live
               </button>
               <button 
                  onClick={() => setActiveView('history')}
                  className={`px-3 py-1 rounded text-[8px] font-black uppercase tracking-widest transition-all ${
                     activeView === 'history' ? 'bg-emerald-600 text-white' : 'text-[var(--text-tertiary)] hover:text-emerald-500'
                  }`}
               >
                  Hist
               </button>
            </div>
         </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
         <AdminStatCard title="Revenue" value={`₹${(networkStats.grossRevenue / 100000).toFixed(1)}L`} trend="up" trendValue="+12%" icon={Zap} color="emerald" subtitle="Monthly Earnings" />
         <AdminStatCard title="On Road" value={networkStats.activeFleet} trend="up" trendValue="+5%" icon={Activity} color="blue" subtitle="Active Vehicles" />
         <AdminStatCard title="Total Hubs" value={networkStats.totalHubs} icon={Warehouse} color="emerald" subtitle="Operational" />
         <AdminStatCard title="Uptime" value={networkStats.avgUptime} icon={ShieldCheck} color="emerald" subtitle="Live Performance" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Revenue Chart */}
         <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
               <TrendingUp size={100} />
            </div>
            
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                     <TrendingUp size={16} />
                  </div>
                  <div>
                     <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-wider">Revenue Breakdown</h3>
                     <p className="text-[7px] font-bold text-[var(--text-tertiary)] uppercase mt-0.5">Performance trends over time</p>
                  </div>
               </div>
            </div>

            <div className="h-56 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                     <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} opacity={0.3} />
                     <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: 'var(--text-tertiary)', fontSize: 8, fontWeight: 900 }} 
                       dy={8}
                     />
                     <YAxis hide />
                     <Tooltip content={<CustomTooltip />} />
                     <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Distribution */}
         <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                  <Globe size={16} />
               </div>
               <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-wider">Asset Distribution</h3>
            </div>
            
            <div className="flex-1 min-h-[160px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={fleetDistribution}
                        innerRadius={50}
                        outerRadius={65}
                        paddingAngle={6}
                        dataKey="value"
                        stroke="none"
                     >
                        {fleetDistribution.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                     </Pie>
                     <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}
                        itemStyle={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase' }}
                     />
                  </PieChart>
               </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
               {fleetDistribution.map((item, idx) => (
                  <div key={item.name} className="flex flex-col gap-0.5">
                     <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                        <span className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase tracking-wider leading-none">{item.name}</span>
                     </div>
                     <span className="text-sm font-black text-[var(--text-primary)] ml-3 tracking-tight">{item.value}</span>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* Network Node Registry */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
         <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-tertiary)]/5">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Warehouse size={16} />
               </div>
               <div>
                  <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-wider leading-none">Active Hub Locations</h3>
                  <p className="text-[7px] font-bold text-[var(--text-tertiary)] uppercase mt-0.5 italic">Live status of all centers</p>
               </div>
            </div>
             <button 
                onClick={() => alert("FETCHING_GRID_ANALYTICS")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-tertiary)] hover:bg-emerald-600/10 border border-[var(--border-subtle)] rounded-lg text-[8px] font-black uppercase tracking-wider text-[var(--text-primary)] hover:text-emerald-500 transition-all group"
             >
                Grid View <ChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
             </button>
         </div>
         
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full">
               <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/20">
                     {['Hub Name', 'Location', 'Assets', 'Earnings', 'Health', 'Status'].map((header) => (
                        <th key={header} className="text-left py-3 px-6 text-[8px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">
                           {header}
                        </th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-[var(--border-subtle)]">
                  {hubs.map((hub) => (
                     <tr key={hub.id} className="group/row hover:bg-[var(--bg-tertiary)]/30 transition-colors">
                        <td className="py-3 px-6">
                           <div className="flex flex-col gap-0">
                              <span className="text-[10px] font-black text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors uppercase tracking-tight italic">{hub.name}</span>
                              <span className="text-[7px] font-bold text-[var(--text-tertiary)] tracking-widest leading-none">{hub.id}</span>
                           </div>
                        </td>
                        <td className="py-3 px-6 text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest italic">{hub.city}</td>
                        <td className="py-3 px-6">
                           <div className="flex flex-col gap-1.5">
                              <div className="flex justify-between items-baseline">
                                 <span className="text-[10px] font-black text-[var(--text-primary)]">{hub.fleet}</span>
                                 <span className="text-[7px] font-bold text-[var(--text-tertiary)] uppercase">Units</span>
                              </div>
                              <div className="w-16 h-1 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                                 <div className="h-full bg-blue-500" style={{ width: `${(hub.fleet/450)*100}%` }} />
                              </div>
                           </div>
                        </td>
                        <td className="py-3 px-6 text-[10px] font-black text-emerald-500 tracking-tight">₹{(hub.revenue / 100000).toFixed(1)}L</td>
                        <td className="py-3 px-6">
                           <div className="flex items-center gap-2">
                              <div className="flex-1 w-12 h-1 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                                 <div 
                                   className={`h-full ${parseInt(hub.health) > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                                   style={{ width: hub.health }} 
                                 />
                              </div>
                              <span className="text-[8px] font-black text-[var(--text-primary)]">{hub.health}</span>
                           </div>
                        </td>
                        <td className="py-3 px-6">
                           <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 w-fit">
                              <div className="w-0.5 h-0.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-[7px] font-black uppercase tracking-widest">{hub.status}</span>
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
