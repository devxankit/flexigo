import React from 'react';
import { 
  Truck, 
  MapPin, 
  Activity, 
  Search, 
  Filter, 
  Battery, 
  Signal, 
  Zap, 
  ShieldCheck, 
  Terminal,
  ArrowUpRight,
  Monitor,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminStatCard from '../components/AdminStatCard';
import { adminDataStore } from '../store/adminDataStore';

export default function FleetOversightPage() {
  const { vehicles, networkStats } = adminDataStore;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
               <h1 className="text-2xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Fleet <span className="text-emerald-500">Status</span>
               </h1>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-tertiary)] ml-4">
               Live Vehicle Tracking • Fleet Records
            </p>
         </div>
         
         <div className="flex items-center gap-3">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)] group-focus-within:text-emerald-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search Vehicle ID..." 
                 className="pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/30 outline-none transition-all w-64 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50"
               />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-950/20 active:scale-95">
               <Globe size={14} /> View Map
            </button>
         </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
         <AdminStatCard title="Total Vehicles" value={networkStats.activeFleet} icon={Truck} color="emerald" subtitle="All vehicles" />
         <AdminStatCard title="On Road" value="842" icon={Activity} color="blue" subtitle="In use now" />
         <AdminStatCard title="Low Battery" value="14" icon={Zap} color="rose" subtitle="Need a charge" />
         <AdminStatCard title="System Online" value={networkStats.avgUptime} icon={Signal} color="emerald" subtitle="Network status" />
      </div>

      {/* Detailed Asset Registry */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2rem] overflow-hidden shadow-sm">
         <div className="p-8 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Monitor size={20} />
               </div>
                <div>
                   <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">Active Fleet List</h3>
                   <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase mt-1 tracking-widest animate-pulse">Updating live data...</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
               <button className="p-2.5 text-[var(--text-tertiary)] hover:text-emerald-500 hover:bg-emerald-600/5 rounded-xl transition-all">
                  <Filter size={18} />
               </button>
               <button className="p-2.5 text-[var(--text-tertiary)] hover:text-emerald-500 hover:bg-emerald-600/5 rounded-xl transition-all">
                  <Terminal size={18} />
               </button>
            </div>
         </div>
         
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/30">
                     {['Asset identity', 'Operator Interface', 'Location Pulse', 'Energy Integrity', 'Signal Strength', 'Sync'].map((header) => (
                        <th key={header} className="py-5 px-8 text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-tertiary)] whitespace-nowrap">{header}</th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-[var(--border-subtle)]">
                  {vehicles.map((vehicle) => (
                     <tr key={vehicle.id} className="group/row hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                        <td className="py-6 px-8 whitespace-nowrap">
                           <div className="flex flex-col gap-0.5">
                              <span className="text-xs font-black text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{vehicle.id}</span>
                              <span className="text-[8px] font-bold text-[var(--text-tertiary)] tracking-widest leading-none mt-1">S/N: {Math.random().toString(36).substring(7).toUpperCase()}</span>
                           </div>
                        </td>
                        <td className="py-6 px-8">
                           <div className="flex flex-col gap-0.5">
                              <span className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-tight italic">{vehicle.rider}</span>
                              <span className="text-[8px] font-black text-emerald-500/60 uppercase tracking-widest leading-none">Subscribed Host</span>
                           </div>
                        </td>
                        <td className="py-6 px-8">
                           <div className="flex items-center gap-2">
                              <MapPin size={12} className="text-emerald-500 opacity-60" />
                              <span className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest italic">{vehicle.location}</span>
                           </div>
                        </td>
                        <td className="py-6 px-8">
                           <div className="flex items-center gap-3">
                              <div className="w-16 h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden flex-shrink-0">
                                 <div className={`h-full ${vehicle.battery < 20 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${vehicle.battery}%` }} />
                              </div>
                              <span className={`text-[10px] font-black ${vehicle.battery < 20 ? 'text-rose-500' : 'bg-emerald-500'}`}>{vehicle.battery}%</span>
                           </div>
                        </td>
                        <td className="py-6 px-8">
                           <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-fit">
                              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Grid Locked</span>
                           </div>
                        </td>
                        <td className="py-6 px-8 text-[9px] font-black text-[var(--text-tertiary)] uppercase italic tracking-widest">{vehicle.lastPing}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* Asset Integrity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="p-8 bg-emerald-600/5 border border-emerald-500/10 rounded-[2rem] space-y-4 relative overflow-hidden group">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <ShieldCheck size={20} />
               </div>
               <h4 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">Fleet Integrity Protocol</h4>
            </div>
             <p className="text-[11px] text-[var(--text-tertiary)] font-bold leading-relaxed uppercase tracking-[0.2em] italic">
                Our vehicles are automatically checked for safety every 300 rides to keep everything running smoothly.
             </p>
             <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 mt-6 group/link">
                View Health Reports <ArrowUpRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
             </button>
         </div>

         <div className="p-8 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2rem] space-y-6 flex flex-col justify-between shadow-sm border-l-4 border-l-emerald-600">
            <div>
               <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.3em]">Lifecycle Management</p>
                  <span className="text-[11px] font-black text-emerald-600">Alpha Core</span>
               </div>
                <h3 className="text-xl font-black text-[var(--text-primary)] uppercase italic tracking-tighter">Sync All Vehicles</h3>
             </div>
             <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/40 hover:bg-emerald-700 transition-all active:scale-95 group">
                Refresh Global Data
             </button>
         </div>
      </div>
    </div>
  );
}
