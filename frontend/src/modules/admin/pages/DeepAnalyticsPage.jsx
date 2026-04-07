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
import { adminDataStore } from '../store/adminDataStore';

const COLORS = ['#10b981', '#0ea5e9', '#f59e0b', '#ef4444'];

export default function DeepAnalyticsPage() {
  const { networkStats, revenueData } = adminDataStore;
  const [activeSegment, setActiveSegment] = useState('predictive');

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
               <h1 className="text-2xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Deep <span className="text-emerald-500">Analytics</span>
               </h1>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-tertiary)] ml-4">
               Big Data Engine • Neural Network Insights 0.4v
            </p>
         </div>
         
         <div className="flex bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-1 shadow-sm">
             <button 
                onClick={() => setActiveSegment('predictive')}
                className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                   activeSegment === 'predictive' ? 'bg-emerald-600 text-white shadow-lg' : 'text-[var(--text-tertiary)] hover:text-emerald-500'
                }`}
             >
                Predictive
             </button>
             <button 
                onClick={() => setActiveSegment('historical')}
                className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                   activeSegment === 'historical' ? 'bg-emerald-600 text-white shadow-lg' : 'text-[var(--text-tertiary)] hover:text-emerald-500'
                }`}
             >
                Historical
             </button>
          </div>
      </div>

      {/* Intelligence KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
         <AdminStatCard title="Network Yield" value="₹42.8L" icon={TrendingUp} color="emerald" subtitle="Predictive MTD Projection" />
         <AdminStatCard title="Churn Delta" value="-2.4%" icon={Zap} color="blue" subtitle="Subscriber Retention Index" />
         <AdminStatCard title="Node Efficiency" value="96.2%" icon={Signal} color="emerald" subtitle="Cluster Load Balancing" />
         <AdminStatCard title="Risk Scoring" value="84/100" icon={Activity} color="emerald" subtitle="Overall Grid Stability" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Neural Demand Matrix */}
         <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 p-10 opacity-5 group-hover:scale-110 transition-transform">
               <Globe size={150} strokeWidth={1} />
            </div>
            
            <div className="flex items-center justify-between mb-12">
               <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
                     <BarChart3 size={24} />
                  </div>
                  <div>
                     <h3 className="text-base font-black text-[var(--text-primary)] uppercase tracking-widest leading-none">Grid Demand Forecast</h3>
                     <p className="text-[10px] font-bold text-emerald-600 uppercase mt-2 tracking-widest italic animate-pulse">Processing Cluster Data... Latency 40ms</p>
                  </div>
               </div>
               <div className="flex items-center gap-2 relative z-10">
                  <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] font-black text-emerald-500">ALPHA_CORPUS_ACTIVE</div>
               </div>
            </div>

            <div className="h-80 w-full relative z-10">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                     <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} opacity={0.5} />
                     <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: 'var(--text-tertiary)', fontSize: 11, fontWeight: 900 }} 
                       dy={15}
                     />
                     <YAxis hide />
                     <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '20px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}
                        itemStyle={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: '#10b981' }}
                        labelStyle={{ fontSize: '12px', fontWeight: 900, marginBottom: '8px', textTransform: 'uppercase' }}
                     />
                     <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={5} dot={{ r: 6, fill: '#10b981', strokeWidth: 4, stroke: 'white' }} activeDot={{ r: 8, strokeWidth: 0 }} animationDuration={3000} />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Regional Yield Hubs */}
         <div className="p-10 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2.5rem] flex flex-col justify-between shadow-sm border-r-4 border-r-blue-600">
            <div>
               <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                     <Signal size={24} />
                  </div>
                  <h3 className="text-base font-black text-[var(--text-primary)] uppercase tracking-widest leading-none">Regional Yield</h3>
               </div>
               
               <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={revenueData}>
                        <Bar 
                           dataKey="value" 
                           radius={[10, 10, 10, 10]}
                           animationDuration={2000}
                        >
                           {revenueData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.8} />
                           ))}
                        </Bar>
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{display: 'none'}} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>

               <div className="mt-8 space-y-4">
                  {['Maharashtra_Alpha_4', 'Maharashtra_Alpha_1', 'Pune_Cluster_Delta'].map((loc, idx) => (
                     <div key={loc} className="flex justify-between items-center bg-[var(--bg-tertiary)]/50 p-4 rounded-2xl border border-[var(--border-subtle)]">
                        <span className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">{loc}</span>
                        <div className="flex items-center gap-2">
                           <span className="text-xs font-black text-[var(--text-primary)]">₹{(Math.random() * 20).toFixed(1)}L</span>
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <button className="w-full mt-10 py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-blue-900/30 hover:bg-blue-700 transition-all active:scale-95 group flex items-center justify-center gap-3">
               Fetch Extended Analytics <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-2 transition-transform" />
            </button>
         </div>
      </div>

      {/* Insight Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="p-8 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2.5rem] flex items-center justify-between group cursor-pointer hover:border-emerald-500/40 transition-all shadow-sm">
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:rotate-12 transition-transform shadow-inner">
                  <Monitor size={28} />
               </div>
               <div className="space-y-1">
                  <p className="text-xs font-black text-[var(--text-primary)] uppercase tracking-widest">Network Heatmap Log</p>
                  <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.3em] leading-none">Neural mapping of all grid hotspots</p>
               </div>
            </div>
            <ArrowUpRight size={24} className="text-[var(--text-tertiary)] group-hover:text-emerald-500 group-hover:translate-x-2 transition-all opacity-20 group-hover:opacity-100" />
         </div>

         <div className="p-8 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2.5rem] flex items-center justify-between group cursor-pointer hover:border-blue-500/40 transition-all shadow-sm border-l-4 border-l-blue-600">
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:rotate-12 transition-transform shadow-inner">
                  <LayoutGrid size={28} />
               </div>
               <div className="space-y-1">
                  <p className="text-xs font-black text-[var(--text-primary)] uppercase tracking-widest">Neural Cluster Audit</p>
                  <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.3em] leading-none">Deep analysis of node relationships</p>
               </div>
            </div>
            <ArrowUpRight size={24} className="text-[var(--text-tertiary)] group-hover:text-blue-500 group-hover:translate-x-2 transition-all opacity-20 group-hover:opacity-100" />
         </div>
      </div>
    </div>
  );
}
