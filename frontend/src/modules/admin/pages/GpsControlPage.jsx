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
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
               <h1 className="text-2xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  GPS & <span className="text-emerald-500">Control</span>
               </h1>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-tertiary)] ml-4">
               Real-time Telematics • Fleet Command Registry
            </p>
         </div>
         
         <div className="flex items-center gap-2">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)] group-focus-within:text-emerald-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search Host ID / MAC Address..." 
                 className="pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/30 outline-none transition-all w-72 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50"
               />
            </div>
            <button className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-tertiary)] hover:text-emerald-500 hover:bg-emerald-600/5 transition-all">
               <Filter size={18} />
            </button>
         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
         <AdminStatCard title="Tracked Units" value={networkStats.activeFleet} icon={Navigation} color="emerald" subtitle="Live on Grid" />
         <AdminStatCard title="In Motion" value="842" icon={Activity} color="blue" subtitle="Active Deliveries" />
         <AdminStatCard title="Low Power" value="14" icon={Zap} color="rose" subtitle="Critical Charge Swap" />
         <AdminStatCard title="Ping Latency" value="24ms" icon={Signal} color="emerald" subtitle="Avg Telemetry Sync" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Live Vehicle List */}
         <div className="lg:col-span-2 space-y-5">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2rem] overflow-hidden shadow-sm">
               <div className="p-6 border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/10 flex items-center justify-between">
                  <div>
                     <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">Fleet Assets Stream</h3>
                     <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-[0.25em] mt-1 italic animate-pulse">Live Polling Protocol Active</p>
                  </div>
                  <span className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest bg-[var(--bg-tertiary)] px-3 py-1 rounded-full border border-[var(--border-subtle)]">{vehicles.length} Nodes</span>
               </div>
               <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full">
                     <thead>
                        <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/30">
                           {['Asset ID', 'Assigned Persona', 'Current Geo-Node', 'Power', 'Sync'].map((header) => (
                              <th key={header} className="text-left py-5 px-6 text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-tertiary)] whitespace-nowrap">{header}</th>
                           ))}
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-[var(--border-subtle)]">
                        {vehicles.map((vehicle) => (
                           <tr 
                             key={vehicle.id} 
                             onClick={() => setSelectedVehicle(vehicle)}
                             className={`group/row transition-all duration-200 cursor-pointer ${selectedVehicle.id === vehicle.id ? 'bg-emerald-600/5' : 'hover:bg-[var(--bg-tertiary)]/50'}`}
                           >
                              <td className="py-5 px-6">
                                 <span className={`text-xs font-black uppercase tracking-tight transition-colors ${selectedVehicle.id === vehicle.id ? 'text-emerald-500' : 'text-[var(--text-primary)]'}`}>{vehicle.id}</span>
                              </td>
                              <td className="py-5 px-6">
                                 <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest">{vehicle.rider}</span>
                                    <span className="text-[8px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em] mt-0.5">Subscriber Identity</span>
                                 </div>
                              </td>
                              <td className="py-5 px-6">
                                 <div className="flex items-center gap-2">
                                    <MapPin size={12} className="text-emerald-500 opacity-60" />
                                    <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">{vehicle.location}</span>
                                 </div>
                              </td>
                              <td className="py-5 px-6">
                                 <div className="flex items-center gap-3">
                                    <div className="w-16 h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden flex-shrink-0">
                                       <div className={`h-full ${vehicle.battery < 20 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${vehicle.battery}%` }} />
                                    </div>
                                    <span className={`text-[10px] font-black ${vehicle.battery < 20 ? 'text-rose-500' : 'text-emerald-500'}`}>{vehicle.battery}%</span>
                                 </div>
                              </td>
                              <td className="py-5 px-6 text-[9px] font-black text-[var(--text-tertiary)] uppercase italic tracking-widest">{vehicle.lastPing}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* Tactical Grid Map View */}
            <div className="h-96 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2rem] relative overflow-hidden group shadow-sm bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
               {/* Grid Overlay */}
               <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />
               <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/5 to-transparent pointer-events-none" />
               
               <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-[var(--bg-secondary)] via-[var(--bg-secondary)]/80 to-transparent">
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest">Projection: Mercator_Alpha_4</p>
                        <p className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.25em]">Maharashtra Regional Cluster Integration</p>
                     </div>
                     <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Grid Locked</span>
                     </div>
                  </div>
               </div>

               {/* Tactical Pins */}
               <motion.div 
                 initial={{ scale: 0 }} 
                 animate={{ scale: 1 }}
                 className="absolute top-1/4 left-1/3 p-2.5 bg-emerald-600 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-white/20 transform -translate-x-1/2 -translate-y-1/2 cursor-crosshair group/pin"
               >
                  <MapPin size={18} className="text-white" />
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-[8px] font-bold text-white px-2 py-1 rounded border border-white/10 opacity-0 group-hover/pin:opacity-100 transition-opacity whitespace-nowrap">EV-9021 (MOVING)</div>
               </motion.div>

               <motion.div 
                 initial={{ scale: 0 }} 
                 animate={{ scale: 1 }}
                 transition={{ delay: 0.1 }}
                 className="absolute top-1/2 right-1/4 p-2.5 bg-rose-600 rounded-2xl shadow-[0_0_20px_rgba(244,63,94,0.3)] border border-white/20 transform -translate-x-1/2 -translate-y-1/2 cursor-crosshair group/pin"
               >
                  <MapPin size={18} className="text-white" />
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-[8px] font-bold text-white px-2 py-1 rounded border border-white/10 opacity-0 group-hover/pin:opacity-100 transition-opacity whitespace-nowrap">EV-1029 (LOW BATT)</div>
               </motion.div>
            </div>
         </div>

         {/* Command & Control Panel */}
         <div className="space-y-6">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2rem] p-8 shadow-sm relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-600/5 blur-[80px] group-hover:bg-emerald-600/10 transition-all rounded-full" />
               
               <div className="flex items-center gap-5 mb-10 pb-8 border-b border-[var(--border-subtle)]">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
                     <ShieldCheck size={32} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                     <h3 className="text-lg font-black text-[var(--text-primary)] uppercase italic tracking-tighter">{selectedVehicle.id} <span className="text-emerald-500 italic">Core</span></h3>
                     <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Authenticated Host</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <p className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.3em]">Engine Intercept</p>
                        <span className="text-[8px] font-black text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded uppercase tracking-widest">Ready</span>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <button className="flex flex-col items-center justify-center gap-2 py-5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-2xl text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/10 transition-all active:scale-95 group/btn shadow-sm">
                           <Power size={20} className="transition-transform group-hover/btn:rotate-90" />
                           <span>Cutoff</span>
                        </button>
                        <button className="flex flex-col items-center justify-center gap-2 py-5 bg-emerald-600/10 border border-emerald-500/20 rounded-2xl text-emerald-500 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600/20 transition-all active:scale-95 shadow-sm">
                           <Activity size={20} />
                           <span>Restore</span>
                        </button>
                     </div>
                  </div>

                  <div className="space-y-4 pt-8 border-t border-[var(--border-subtle)]">
                     <p className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.3em]">Lifecycle Locks</p>
                     <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-3 py-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-2xl text-[var(--text-primary)] text-[10px] font-black uppercase tracking-widest hover:border-emerald-500/30 transition-all active:scale-95">
                           <Lock size={16} /> Seat Lock
                        </button>
                        <button className="flex items-center justify-center gap-3 py-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-2xl text-[var(--text-primary)] text-[10px] font-black uppercase tracking-widest hover:border-emerald-500/30 transition-all active:scale-95">
                           <Unlock size={16} /> Release
                        </button>
                     </div>
                  </div>

                  <div className="pt-4">
                     <div className="p-5 bg-emerald-600/5 border border-emerald-500/10 rounded-[1.5rem] space-y-2">
                        <div className="flex items-center gap-2">
                           <Signal size={12} className="text-emerald-600" />
                           <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none">Dispatcher Protocol Active</p>
                        </div>
                        <p className="text-[11px] font-bold text-[var(--text-tertiary)] leading-relaxed italic uppercase tracking-tighter">
                           Remote override is active. Manual ignition is disabled pending central restore command.
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Quick Actions Strip */}
            <div className="p-5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[1.5rem] flex items-center justify-between group cursor-pointer hover:border-emerald-500/30 transition-all shadow-sm">
               <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-emerald-600/10 text-emerald-500 rounded-xl group-hover:rotate-12 transition-transform shadow-inner">
                     <MapPin size={22} strokeWidth={2.5} />
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-[0.2em] leading-none">Trip Telemetry Log</p>
                     <p className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Audit Full Route History</p>
                  </div>
               </div>
               <ArrowRight size={20} className="text-[var(--text-tertiary)] group-hover:translate-x-1 group-hover:text-emerald-500 transition-all" />
            </div>
         </div>
      </div>
    </div>
  );
}
