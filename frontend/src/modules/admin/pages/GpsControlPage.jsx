import React, { useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  Power, 
  Unlock, 
  ShieldCheck, 
  Activity,
  Search,
  Filter,
  ArrowRight,
  Zap,
  Signal,
  Lock
} from 'lucide-react';
import AdminStatCard from '../components/AdminStatCard';
import { motion } from 'framer-motion';
import { adminDataStore } from '../store/adminDataStore';

export default function GpsControlPage() {
  const { vehicles, networkStats } = adminDataStore;
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="space-y-0.5">
            <div className="flex items-center gap-2">
               <div className="w-1 h-5 bg-emerald-600 rounded-full" />
               <h1 className="text-xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  GPS & <span className="text-emerald-500">Control</span>
               </h1>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] ml-3">
               Telematics & Fleet Command Registry
            </p>
         </div>
         
         <div className="flex items-center gap-2">
            <div className="relative group">
               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-tertiary)] group-focus-within:text-emerald-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search Node ID..." 
                 className="pl-8 pr-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[9px] font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all w-32 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50"
               />
            </div>
            <button className="p-1.5 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-lg text-[var(--text-tertiary)] hover:text-emerald-500 transition-all">
               <Filter size={14} />
            </button>
         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <AdminStatCard title="Tracked Units" value={networkStats.activeFleet} icon={Navigation} color="emerald" subtitle="On Grid Alpha" />
         <AdminStatCard title="In Motion" value="842" icon={Activity} color="blue" subtitle="Live Flux" />
         <AdminStatCard title="Low Power" value="14" icon={Zap} color="rose" subtitle="Critical Swap" />
         <AdminStatCard title="Latency" value="24ms" icon={Signal} color="emerald" subtitle="Sync Delta" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Live Vehicle List */}
         <div className="lg:col-span-2 space-y-4">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
               <div className="px-6 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/10 flex items-center justify-between">
                  <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-wider leading-none italic">Fleet Assets Stream</h3>
                  <p className="text-[7.5px] font-black text-emerald-500 uppercase tracking-widest italic animate-pulse">Polling Active</p>
               </div>
               <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full">
                     <thead>
                        <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/20">
                           {['Asset ID', 'Assigned Persona', 'Geo-Node', 'Power', 'Sync'].map((header) => (
                              <th key={header} className="text-left py-2.5 px-6 text-[8px] font-black uppercase tracking-widest text-[var(--text-tertiary)] whitespace-nowrap">{header}</th>
                           ))}
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-[var(--border-subtle)]">
                        {vehicles.map((vehicle) => (
                           <tr 
                             key={vehicle.id} 
                             onClick={() => setSelectedVehicle(vehicle)}
                             className={`group/row transition-all duration-200 cursor-pointer text-[10px] ${selectedVehicle.id === vehicle.id ? 'bg-emerald-600/5' : 'hover:bg-[var(--bg-tertiary)]/20'}`}
                           >
                              <td className="py-2.5 px-6">
                                 <span className={`font-black uppercase tracking-tight transition-colors leading-none italic ${selectedVehicle.id === vehicle.id ? 'text-emerald-500' : 'text-[var(--text-primary)]'}`}>{vehicle.id}</span>
                              </td>
                              <td className="py-2.5 px-6">
                                 <div className="flex flex-col">
                                    <span className="font-black text-[var(--text-primary)] uppercase tracking-widest leading-none italic">{vehicle.rider}</span>
                                    <span className="text-[7px] font-bold text-[var(--text-tertiary)]/50 uppercase mt-1 leading-none italic">Asset Subscriber</span>
                                 </div>
                              </td>
                              <td className="py-2.5 px-6 leading-none">
                                 <div className="flex items-center gap-1.5 leading-none">
                                    <MapPin size={10} className="text-emerald-500 opacity-60" />
                                    <span className="font-black text-[var(--text-tertiary)] uppercase tracking-widest leading-none italic">{vehicle.location}</span>
                                 </div>
                              </td>
                              <td className="py-2.5 px-6">
                                 <div className="flex items-center gap-2">
                                    <div className="w-12 h-1 bg-[var(--bg-tertiary)] rounded-full overflow-hidden flex-shrink-0 border border-[var(--border-subtle)]">
                                       <div className={`h-full ${vehicle.battery < 20 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${vehicle.battery}%` }} />
                                    </div>
                                    <span className={`text-[8px] font-black italic ${vehicle.battery < 20 ? 'text-rose-500' : 'text-emerald-500'}`}>{vehicle.battery}%</span>
                                 </div>
                              </td>
                              <td className="py-2.5 px-6 text-[7px] font-black text-[var(--text-tertiary)] uppercase italic tracking-widest leading-none">{vehicle.lastPing}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* Tactical Grid Map View */}
            <div className="h-64 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl relative overflow-hidden group shadow-sm bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] cursor-crosshair border-l-4 border-l-emerald-600">
               <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
               
               <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[var(--bg-secondary)] to-transparent">
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <p className="text-[8px] font-black text-[var(--text-primary)] uppercase tracking-widest italic">Projection: Mercator_Alpha_4</p>
                        <p className="text-[7px] font-black text-[var(--text-tertiary)] uppercase tracking-widest italic">Grid Integration Active</p>
                     </div>
                     <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest italic">Locked</span>
                     </div>
                  </div>
               </div>

               <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1/4 left-1/3 p-1.5 bg-emerald-600 rounded-lg shadow-lg border border-white/20">
                  <MapPin size={12} className="text-white" />
               </motion.div>

               <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} className="absolute top-1/2 right-1/4 p-1.5 bg-rose-600 rounded-lg shadow-lg border border-white/20">
                  <MapPin size={12} className="text-white" />
               </motion.div>
            </div>
         </div>

         {/* Command & Control Panel */}
         <div className="space-y-4">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-5 shadow-sm relative overflow-hidden group border-t-4 border-t-emerald-600">
               <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[var(--border-subtle)]">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
                     <ShieldCheck size={24} />
                  </div>
                  <div className="space-y-1">
                     <h3 className="text-base font-black text-[var(--text-primary)] uppercase italic tracking-tighter leading-none">{selectedVehicle.id} <span className="text-emerald-500">Core</span></h3>
                     <div className="flex items-center gap-1.5 leading-none">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest italic">Authenticated Host</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="space-y-3">
                     <p className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest italic leading-none">Engine Intercept Protocol</p>
                     <div className="grid grid-cols-2 gap-3">
                        <button className="flex flex-col items-center justify-center gap-1.5 py-3.5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-rose-500 text-[9px] font-black uppercase tracking-widest hover:bg-rose-500/10 transition-all active:scale-95 group/btn italic">
                           <Power size={14} />
                           <span>Cutoff</span>
                        </button>
                        <button className="flex flex-col items-center justify-center gap-1.5 py-3.5 bg-emerald-600/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600/20 transition-all active:scale-95 italic">
                           <Activity size={14} />
                           <span>Restore</span>
                        </button>
                     </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-[var(--border-subtle)]">
                     <p className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest italic leading-none">Lifecycle Locks</p>
                     <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] text-[8px] font-black uppercase tracking-widest hover:border-emerald-500/30 transition-all active:scale-95 italic">
                           <Lock size={12} /> Seat Lock
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] text-[8px] font-black uppercase tracking-widest hover:border-emerald-500/30 transition-all active:scale-95 italic">
                           <Unlock size={12} /> Release
                        </button>
                     </div>
                  </div>

                  <div className="pt-2">
                     <div className="p-3 bg-emerald-600/5 border border-emerald-500/10 rounded-xl space-y-1.5">
                        <div className="flex items-center gap-1.5">
                           <Signal size={10} className="text-emerald-600" />
                           <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest leading-none italic">Dispatcher Protocol</p>
                        </div>
                        <p className="text-[9px] font-bold text-[var(--text-tertiary)] leading-relaxed italic uppercase tracking-wider">
                           Remote override is active. Manual ignition disabled.
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Quick Actions Strip */}
            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl flex items-center justify-between group cursor-pointer hover:border-emerald-500/30 transition-all shadow-sm border-l-4 border-l-emerald-600">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600/10 text-emerald-500 rounded-lg group-hover:rotate-12 transition-transform shadow-inner">
                     <MapPin size={18} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-[var(--text-primary)] uppercase leading-none italic">Trip Telemetry Log</p>
                     <p className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase mt-1 italic tracking-widest leading-none">Audit History</p>
                  </div>
               </div>
               <ArrowRight size={16} className="text-[var(--text-tertiary)] group-hover:translate-x-0.5 group-hover:text-emerald-500 transition-all" />
            </div>
         </div>
      </div>
    </div>
  );
}
