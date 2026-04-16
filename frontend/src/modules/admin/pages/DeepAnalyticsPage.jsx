import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Zap, 
  Signal, 
  Search, 
  Filter, 
  MapPin, 
  ArrowUpRight, 
  ArrowRight,
  Globe,
  Monitor,
  LayoutGrid
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import AdminStatCard from '../components/AdminStatCard';
import { useAdminDataStore } from '../store/adminDataStore';

const COLORS = ['#10b981', '#0ea5e9', '#f59e0b', '#ef4444'];

export default function DeepAnalyticsPage() {
  const { networkStats, revenueData } = useAdminDataStore();
  const [activeSegment, setActiveSegment] = useState('predictive');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="space-y-0.5">
            <div className="flex items-center gap-2">
               <div className="w-1 h-5 bg-emerald-600 rounded-full" />
               <h1 className="text-xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Deep <span className="text-emerald-500">Analytics</span>
               </h1>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] ml-3">
               Neural Engine & Predictive Delta
            </p>
         </div>
         
         <div className="flex bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg p-0.5 shadow-sm">
             <button 
                onClick={() => setActiveSegment('predictive')}
                className={`px-3 py-1 rounded text-[8px] font-black uppercase tracking-widest transition-all ${
                   activeSegment === 'predictive' ? 'bg-emerald-600 text-white shadow-md' : 'text-[var(--text-tertiary)] hover:text-emerald-500'
                }`}
             >
                Predictive
             </button>
             <button 
                onClick={() => setActiveSegment('historical')}
                className={`px-3 py-1 rounded text-[8px] font-black uppercase tracking-widest transition-all ${
                   activeSegment === 'historical' ? 'bg-emerald-600 text-white shadow-md' : 'text-[var(--text-tertiary)] hover:text-emerald-500'
                }`}
             >
                Hist.
             </button>
          </div>
      </div>

      {/* Intelligence KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <AdminStatCard title="Yield Projection" value="₹42.8L" icon={TrendingUp} color="emerald" subtitle="Predictive MTD" />
         <AdminStatCard title="Churn Delta" value="-2.4%" icon={Zap} color="blue" subtitle="Retention Index" />
         <AdminStatCard title="Node Load" value="96.2%" icon={Signal} color="emerald" subtitle="Cluster Sync" />
         <AdminStatCard title="Risk Scoring" value="84/100" icon={Activity} color="emerald" subtitle="Grid Stability" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Neural Demand Matrix */}
         <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col border-t-4 border-t-emerald-600">
            <div className="absolute right-0 top-0 p-6 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform">
               <Globe size={100} strokeWidth={1} />
            </div>
            
            <div className="flex items-center justify-between mb-8 relative z-10 border-b border-[var(--border-subtle)] pb-2">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
                     <BarChart3 size={16} />
                  </div>
                  <div>
                     <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-wider leading-none italic">Grid Demand Matrix</h3>
                     <p className="text-[7.5px] font-black text-emerald-600 uppercase mt-1 tracking-widest italic animate-pulse leading-none">Neural Cluster Registry v2.0</p>
                  </div>
               </div>
               <div className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[7px] font-black text-emerald-500 uppercase italic">ALPHA_SYNC</div>
            </div>

            <div className="h-52 w-full relative z-10 mt-auto">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                     <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} opacity={0.3} />
                     <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: 'var(--text-tertiary)', fontSize: 7, fontWeight: 900, textTransform: 'uppercase' }} 
                       dy={8}
                     />
                     <YAxis hide />
                     <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}
                        itemStyle={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', color: '#10b981' }}
                        labelStyle={{ fontSize: '8px', fontWeight: 900, marginBottom: '4px', textTransform: 'uppercase' }}
                     />
                     <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 3, fill: '#10b981', strokeWidth: 2, stroke: 'white' }} activeDot={{ r: 4, strokeWidth: 0 }} />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Regional Yield Hubs */}
         <div className="p-5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl flex flex-col shadow-sm border-t-4 border-t-blue-600">
            <div className="flex items-center gap-3 mb-6 border-b border-[var(--border-subtle)] pb-2">
               <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-inner">
                  <Signal size={16} />
               </div>
               <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-widest leading-none italic">Regional Yield Hubs</h3>
            </div>
            
            <div className="h-40 w-full mb-6 relative">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                     <Bar 
                        dataKey="value" 
                        radius={[4, 4, 4, 4]}
                     >
                        {revenueData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.8} />
                        ))}
                     </Bar>
                     <Tooltip cursor={{fill: 'transparent'}} contentStyle={{display: 'none'}} />
                  </BarChart>
               </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 flex-1">
               {['Maharashtra_Alpha', 'Pune_Cluster', 'Karn_Delta'].map((loc) => (
                  <div key={loc} className="flex justify-between items-center bg-[var(--bg-tertiary)]/30 p-2 px-3 rounded-lg border border-[var(--border-subtle)] group hover:border-emerald-500/20 transition-all cursor-pointer">
                     <span className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase tracking-widest italic">{loc}</span>
                     <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-black text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors italic">₹{(Math.random() * 20).toFixed(1)}L</span>
                        <div className="w-1 h-1 rounded-full bg-emerald-500" />
                     </div>
                  </div>
               ))}
            </div>

            <button className="w-full mt-6 py-2 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition-all active:scale-95 group flex items-center justify-center gap-2">
               Launch Deep Probe <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
         </div>
      </div>

      {/* Insight Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl flex items-center justify-between group cursor-pointer hover:border-emerald-500/30 transition-all shadow-sm border-l-4 border-l-emerald-600">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:rotate-12 transition-transform shadow-inner">
                  <Monitor size={18} />
               </div>
               <div className="space-y-0.5">
                  <p className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-wider leading-none italic">Network Heatmap Log</p>
                  <p className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase italic tracking-widest leading-none">Neural mapping of grid hotspots</p>
               </div>
            </div>
            <ArrowUpRight size={16} className="text-[var(--text-tertiary)] group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all opacity-40" />
         </div>

         <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl flex items-center justify-between group cursor-pointer hover:border-blue-500/30 transition-all shadow-sm border-l-4 border-l-blue-600">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:rotate-12 transition-transform shadow-inner">
                  <LayoutGrid size={18} />
               </div>
               <div className="space-y-0.5">
                  <p className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-wider leading-none italic">Neural Cluster Audit</p>
                  <p className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase italic tracking-widest leading-none">Deep analysis of node relationships</p>
               </div>
            </div>
            <ArrowUpRight size={16} className="text-[var(--text-tertiary)] group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all opacity-40" />
         </div>
      </div>
    </div>
  );
}
