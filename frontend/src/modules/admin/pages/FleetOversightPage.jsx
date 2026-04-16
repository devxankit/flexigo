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
import { useAdminDataStore } from '../store/adminDataStore';

export default function FleetOversightPage() {
  const { 
    vehicles, 
    networkStats, 
    fetchAllVehicles, 
    fetchDashboardStats 
  } = useAdminDataStore();

  React.useEffect(() => {
    fetchAllVehicles();
    if (networkStats.activeFleet === 0) fetchDashboardStats();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="space-y-0.5">
            <div className="flex items-center gap-2">
               <div className="w-1 h-5 bg-emerald-600 rounded-full" />
               <h1 className="text-xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Fleet <span className="text-emerald-500">Oversight</span>
               </h1>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] ml-3">
               Asset Control & Operations
            </p>
         </div>
         
         <div className="flex items-center gap-2">
            <div className="relative group">
               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-tertiary)] group-focus-within:text-emerald-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search Vehicle ID..." 
                 className="pl-8 pr-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[9px] font-bold uppercase tracking-wider focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all w-48 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50"
               />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-md active:scale-95">
               <Globe size={12} /> View Map
            </button>
         </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <AdminStatCard title="Total Units" value={networkStats.activeFleet} icon={Truck} color="emerald" subtitle="Active assets" />
         <AdminStatCard title="In Motion" value="842" icon={Activity} color="blue" subtitle="Live tracking" />
         <AdminStatCard title="Low Battery" value="14" icon={Zap} color="rose" subtitle="Urgent action" />
         <AdminStatCard title="Grid Link" value={networkStats.avgUptime} icon={Signal} color="emerald" subtitle="Sync status" />
      </div>

      {/* Detailed Asset Registry */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
         <div className="px-6 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-tertiary)]/10">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Monitor size={16} />
               </div>
                <div>
                   <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-wider leading-none">Global Asset Registry</h3>
                   <p className="text-[7px] font-bold text-emerald-500 uppercase mt-0.5 tracking-widest animate-pulse italic">Real-time Feed</p>
                </div>
            </div>
            <div className="flex items-center gap-1.5">
               <button className="p-1.5 text-[var(--text-tertiary)] hover:text-emerald-500 rounded-lg transition-all">
                  <Filter size={14} />
               </button>
               <button className="p-1.5 text-[var(--text-tertiary)] hover:text-emerald-500 rounded-lg transition-all">
                  <Terminal size={14} />
               </button>
            </div>
         </div>
         
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/20">
                     {['Asset identity', 'Host Interface', 'Location', 'Energy Status', 'Grid Link', 'Sync'].map((header) => (
                        <th key={header} className="py-3 px-6 text-[8px] font-black uppercase tracking-widest text-[var(--text-tertiary)] whitespace-nowrap">{header}</th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-[var(--border-subtle)]">
                  {vehicles.map((vehicle, vIdx) => (
                     <tr key={vehicle.id} className="group/row hover:bg-[var(--bg-tertiary)]/30 transition-colors">
                        <td className="py-2.5 px-6 whitespace-nowrap">
                           <div className="flex flex-col gap-0">
                              <span className="text-[10px] font-black text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{vehicle.id}</span>
                              <span className="text-[7px] font-bold text-[var(--text-tertiary)] tracking-widest leading-none">NODE:{vIdx + 100}</span>
                           </div>
                        </td>
                        <td className="py-2.5 px-6">
                           <div className="flex flex-col gap-0">
                              <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-tight italic">{vehicle.rider}</span>
                              <span className="text-[7px] font-black text-emerald-500/60 uppercase tracking-widest leading-none">Active Subscriber</span>
                           </div>
                        </td>
                        <td className="py-2.5 px-6">
                           <div className="flex items-center gap-1.5">
                              <MapPin size={10} className="text-emerald-500 opacity-60" />
                              <span className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest italic">{vehicle.location}</span>
                           </div>
                        </td>
                        <td className="py-2.5 px-6">
                           <div className="flex items-center gap-2">
                              <div className="w-12 h-1 bg-[var(--bg-tertiary)] rounded-full overflow-hidden flex-shrink-0">
                                 <div className={`h-full ${vehicle.battery < 20 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${vehicle.battery}%` }} />
                              </div>
                              <span className={`text-[9px] font-black ${vehicle.battery < 20 ? 'text-rose-500' : 'text-[var(--text-primary)]'}`}>{vehicle.battery}%</span>
                           </div>
                        </td>
                        <td className="py-2.5 px-6">
                           <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-fit">
                              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">Linked</span>
                           </div>
                        </td>
                        <td className="py-2.5 px-6 text-[8px] font-black text-[var(--text-tertiary)] uppercase italic tracking-widest">{vehicle.lastPing}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* Asset Integrity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-2 p-6 bg-emerald-600/5 border border-emerald-500/10 rounded-2xl space-y-3 relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-8 h-8 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <ShieldCheck size={16} />
               </div>
               <h4 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-wider">Security Integrity Protocol</h4>
            </div>
             <p className="text-[9px] text-[var(--text-tertiary)] font-bold leading-relaxed uppercase tracking-wider italic">
                Automated diagnostics active. Standardized health checks executed for every 300 cycles ensuring fleet longevity.
             </p>
             <button className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 mt-2 transition-colors">
                Audit Reports <ArrowUpRight size={10} />
             </button>
         </div>

         <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl space-y-4 flex flex-col justify-between shadow-sm border-l-4 border-l-emerald-600">
            <div>
               <div className="flex items-center justify-between mb-2">
                  <p className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Cloud Core</p>
                  <span className="text-[9px] font-black text-emerald-600">Alpha Core</span>
               </div>
                <h3 className="text-sm font-black text-[var(--text-primary)] uppercase italic tracking-tighter">Global Asset Sync</h3>
             </div>
             <button className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition-all active:scale-95">
                Refresh Protocol
             </button>
         </div>
      </div>
    </div>
  );
}
