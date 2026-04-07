import React, { useState } from 'react';
import { 
  Settings, 
  Zap, 
  Activity, 
  Battery, 
  AlertCircle, 
  ShieldCheck, 
  BarChart3,
  TrendingUp,
  Cpu,
  Thermometer,
  CloudLightning,
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
  CartesianGrid 
} from 'recharts';

const mockHealthData = [
  { id: 'EV-9021', health: 98, temp: '32°C', cycles: 420, voltage: '72.4V', status: 'optimal' },
  { id: 'EV-4412', health: 84, temp: '41°C', cycles: 890, voltage: '71.1V', status: 'warning' },
  { id: 'EV-7721', health: 99, temp: '29°C', cycles: 120, voltage: '72.8V', status: 'optimal' },
  { id: 'EV-1029', health: 72, temp: '48°C', cycles: 1450, voltage: '69.8V', status: 'critical' },
];

const perfSeries = [
  { time: '08:00', load: 45, discharge: 12 },
  { time: '10:00', load: 82, discharge: 28 },
  { time: '12:00', load: 94, discharge: 32 },
  { time: '14:00', load: 78, discharge: 24 },
  { time: '16:00', load: 65, discharge: 18 },
];

export default function VehicleAnalyticsPage() {
  const [activeView, setActiveView] = useState('real-time');

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <div className="flex items-center gap-3">
               <div className="w-1 h-6 bg-emerald-600 rounded-full" />
               <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                  Vehicle <span className="text-emerald-500">Analytics</span>
               </h1>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] ml-4">
               CAN BUS Telemetry • Predictive BMS Insights
            </p>
         </div>
         
         <div className="flex bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-1 shadow-sm">
             <button 
                onClick={() => setActiveView('real-time')}
                className={`px-5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                   activeView === 'real-time' ? 'bg-emerald-600 text-white shadow-lg' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                }`}
             >
                Real-Time
             </button>
             <button 
                onClick={() => setActiveView('predictive')}
                className={`px-5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                   activeView === 'predictive' ? 'bg-emerald-600 text-white shadow-lg' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                }`}
             >
                Predictive
             </button>
          </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <AdminStatCard title="Fleet Health" value="94%" icon={ShieldCheck} color="emerald" subtitle="Avg Battery SOH" />
         <AdminStatCard title="Total BMS Tags" value="24.2k" icon={Activity} color="blue" subtitle="Data Points / Sec" />
         <AdminStatCard title="Thermal Alerts" value="03" icon={Thermometer} color="rose" subtitle="Critical Overheat" />
         <AdminStatCard title="Grid Efficiency" value="92.1%" icon={Zap} color="emerald" subtitle="Energy Capture Ratio" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* performance Trend */}
         <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600/10 text-emerald-500 rounded-lg">
                     <TrendingUp size={18} />
                  </div>
                  <div>
                     <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Discharge Performance</h3>
                     <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest leading-none mt-1">Fleet Mean Load Analysis</p>
                  </div>
               </div>
            </div>
            <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={perfSeries}>
                     <defs>
                        <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} opacity={0.5} />
                     <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 10, fontWeight: 700 }} />
                     <YAxis hide />
                     <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}
                        itemStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
                     />
                     <Area type="monotone" dataKey="load" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorLoad)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Predictive health Card */}
         <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[var(--border-subtle)]">
               <div className="p-2 bg-emerald-600/10 text-emerald-500 rounded-lg">
                  <Cpu size={18} />
               </div>
               <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Predictive SOH</h3>
            </div>
            
            <div className="flex-1 space-y-6">
               <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">
                     <span>BMS Model Sync</span>
                     <span className="text-emerald-500">92% Accurate</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500" style={{ width: '92%' }} />
                  </div>
               </div>

               <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                     <CloudLightning size={14} className="text-emerald-500" />
                     <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Anomaly Detection</p>
                  </div>
                  <p className="text-[10px] text-[var(--text-tertiary)] font-medium leading-relaxed">
                     No critical cycle imbalances detected. Predictive maintenance window estimated for <span className="text-emerald-500 font-bold">140 units</span> in approx 12 days.
                  </p>
               </div>

               <button 
                  onClick={() => alert("FETCHING_DEEP_HEALTH_REPORT: CAN_BUS_BMS")}
                  className="w-full mt-auto py-3 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)] hover:bg-emerald-600/10 hover:text-emerald-500 hover:border-emerald-500/20 transition-all flex items-center justify-center gap-2 group active:scale-95"
               >
                  Deep Health Report <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
         </div>
      </div>

      {/* Asset BMS Registry */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl overflow-hidden shadow-sm">
         <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">CAN BUS Asset Stream</h3>
            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">LIVE POLLING</span>
         </div>
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/30">
                     {['Asset ID', 'SOH (Health)', 'Thermal', 'Cycles', 'Voltage', 'Status'].map((header) => (
                        <th key={header} className="py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] px-4 whitespace-nowrap">{header}</th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-[var(--border-subtle)]">
                  {mockHealthData.map((asset) => (
                     <tr key={asset.id} className="group/row hover:bg-[var(--bg-tertiary)]/30 transition-colors">
                        <td className="py-4 px-4 font-bold text-xs text-[var(--text-primary)] uppercase tracking-tight">{asset.id}</td>
                        <td className="py-4 px-4">
                           <div className="flex items-center gap-3">
                              <div className="flex-1 max-w-[60px] h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                                 <div className={`h-full ${asset.health < 80 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${asset.health}%` }} />
                              </div>
                              <span className={`text-[10px] font-bold ${asset.health < 80 ? 'text-rose-500' : 'text-emerald-500'}`}>{asset.health}%</span>
                           </div>
                        </td>
                        <td className="py-4 px-4">
                           <div className="flex items-center gap-1.5">
                              <Thermometer size={12} className={parseInt(asset.temp) > 45 ? 'text-rose-500' : 'text-blue-500'} />
                              <span className="text-[10px] font-bold text-[var(--text-primary)]">{asset.temp}</span>
                           </div>
                        </td>
                        <td className="py-4 px-4 font-bold text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest">{asset.cycles} Cycles</td>
                        <td className="py-4 px-4 font-bold text-[10px] text-[var(--text-primary)]">{asset.voltage}</td>
                        <td className="py-4 px-4">
                           <div className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                              asset.status === 'optimal' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                              asset.status === 'warning' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                              'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                           }`}>
                              {asset.status}
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
