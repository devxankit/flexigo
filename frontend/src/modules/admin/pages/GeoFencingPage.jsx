import React, { useState } from 'react';
import { 
  Map, 
  Plus, 
  MapPin, 
  Bell, 
  History,
  MoreVertical,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  X,
  Target,
  Shield,
  Layers,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminStatCard from '../components/AdminStatCard';
import { adminDataStore } from '../store/adminDataStore';

export default function GeoFencingPage() {
  const [geofences, setGeofences] = useState([
    { id: 'GF-101', name: 'Koramangala Restricted', radius: '1.2km', status: 'active', alerts: 14, type: 'exclusion' },
    { id: 'GF-102', name: 'HSR Delivery Zone', radius: '2.5km', status: 'active', alerts: 0, type: 'inclusion' },
    { id: 'GF-103', name: 'Indiranagar Hub Outer', radius: '0.8km', status: 'inactive', alerts: 2, type: 'exclusion' },
    { id: 'GF-104', name: 'Airport Corridor', radius: '5.0km', status: 'active', alerts: 5, type: 'speed-cap' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneType, setNewZoneType] = useState('inclusion');

  const handleCreateZone = (e) => {
    e.preventDefault();
    if (!newZoneName) return;
    
    const newZone = {
      id: `GF-${Math.floor(100 + Math.random() * 900)}`,
      name: newZoneName,
      radius: '1.0km',
      status: 'active',
      alerts: 0,
      type: newZoneType
    };

    setGeofences([newZone, ...geofences]);
    setNewZoneName('');
    setIsModalOpen(false);
  };

  const deleteZone = (id) => {
    setGeofences(geofences.filter(gf => gf.id !== id));
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
               <h1 className="text-2xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Geo <span className="text-emerald-500">Fencing</span>
               </h1>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-tertiary)] ml-4">
               Perimeter Security • Zone Management
            </p>
         </div>
         
         <div className="flex items-center gap-3">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)] group-focus-within:text-emerald-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search Zones..." 
                 className="pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/30 outline-none transition-all w-64 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50"
               />
            </div>
            <button 
               onClick={() => setIsModalOpen(true)}
               className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-950/20 active:scale-95"
            >
               <Plus size={14} strokeWidth={3} /> Create Zone
            </button>
         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
         <AdminStatCard title="Active Zones" value={geofences.length} icon={Map} color="emerald" subtitle="Monitored Areas" />
         <AdminStatCard title="Zone Breaches" value="42" icon={AlertTriangle} color="rose" subtitle="Last 24 Hours" />
         <AdminStatCard title="Security Level" value="High" icon={Shield} color="blue" subtitle="Grid Integrity" />
         <AdminStatCard title="System Sync" value="100%" icon={CheckCircle2} color="emerald" subtitle="Telemetry Status" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Geofence Registry */}
         <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2rem] overflow-hidden shadow-sm">
            <div className="p-8 border-b border-[var(--border-subtle)] flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                     <Layers size={20} />
                  </div>
                  <div>
                     <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">Zone Registry</h3>
                     <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase mt-1 tracking-widest">Active Perimeter Protocols</p>
                  </div>
               </div>
            </div>
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/30">
                        {['Zone Identity', 'Type', 'Radius', 'Status', 'Alerts', ''].map((header) => (
                           <th key={header} className="py-5 px-8 text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-tertiary)] whitespace-nowrap">{header}</th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                     <AnimatePresence mode='popLayout'>
                       {geofences.map((gf) => (
                          <motion.tr 
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            key={gf.id} 
                            className="group/row hover:bg-[var(--bg-tertiary)]/50 transition-colors"
                          >
                             <td className="py-6 px-8 whitespace-nowrap">
                                <div className="flex flex-col gap-0.5">
                                   <span className="text-xs font-black text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{gf.name}</span>
                                   <span className="text-[9px] font-bold text-[var(--text-tertiary)] tracking-widest leading-none mt-1">{gf.id} Target</span>
                                </div>
                             </td>
                             <td className="py-6 px-8">
                                <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${
                                   gf.type === 'exclusion' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                                   gf.type === 'inclusion' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                   'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                }`}>
                                   {gf.type}
                                </span>
                             </td>
                             <td className="py-6 px-8 text-[11px] font-black text-[var(--text-primary)]">{gf.radius}</td>
                             <td className="py-6 px-8">
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                   gf.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'
                                }`}>
                                   <div className={`w-1 h-1 rounded-full ${gf.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                                   {gf.status}
                                </div>
                             </td>
                             <td className="py-6 px-8">
                                <span className={`text-xs font-black ${gf.alerts > 0 ? 'text-rose-500' : 'text-[var(--text-tertiary)]'}`}>{gf.alerts}</span>
                             </td>
                             <td className="py-6 px-8 text-right">
                                <button 
                                   onClick={() => deleteZone(gf.id)}
                                   className="p-2 text-[var(--text-tertiary)] hover:text-rose-500 hover:bg-rose-600/5 rounded-xl transition-all"
                                >
                                   <X size={16} />
                                </button>
                             </td>
                          </motion.tr>
                       ))}
                     </AnimatePresence>
                  </tbody>
               </table>
            </div>
         </div>

         {/* Breach Log & Preview Area */}
         <div className="space-y-6">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2rem] p-8 shadow-sm">
               <div className="flex items-center justify-between mb-8 pb-6 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                        <Bell size={20} />
                     </div>
                     <div>
                        <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">Breach Log</h3>
                        <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Active Violations</p>
                     </div>
                  </div>
                  <button 
                     onClick={() => alert("BREACH_HISTORY: SYNCING...")}
                     className="p-2 text-[var(--text-tertiary)] hover:text-emerald-500 transition-colors active:scale-95"
                  >
                     <History size={18} />
                  </button>

               </div>

               <div className="space-y-4">
                  {[
                    { id: 'AL-991', vehicle: 'EV-8821', zone: 'Koramangala Restricted', time: '2m ago' },
                    { id: 'AL-990', vehicle: 'EV-1029', zone: 'Airport Corridor', time: '15m ago' },
                  ].map((alert) => (
                     <div key={alert.id} className="p-5 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-2xl space-y-3 group cursor-pointer hover:border-rose-500/30 transition-all shadow-sm">
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1.5">
                              <Target size={12} /> Breach Incident
                           </span>
                           <span className="text-[9px] font-black text-[var(--text-tertiary)] uppercase">{alert.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <div>
                              <p className="text-sm font-black text-[var(--text-primary)] italic">{alert.vehicle}</p>
                              <p className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest mt-1">{alert.zone}</p>
                           </div>
                           <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <ArrowRight size={14} />
                           </div>
                        </div>
                     </div>
                  ))}
               </div>

               <button 
                  onClick={() => alert("FETCHING_ZONE_ANALYTICS: GF-LOG-V2")}
                  className="w-full mt-8 py-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-primary)] hover:text-emerald-500 transition-all flex items-center justify-center gap-2 active:scale-95"
               >
                  View Full History <History size={14} />
               </button>

            </div>

            {/* Tactical Map Preview */}
            <div 
               onClick={() => alert("TACTICAL_PROJECTION: FULL_SCREEN_MODE")}
               className="h-72 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-[2.5rem] relative overflow-hidden group shadow-sm bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] cursor-pointer active:scale-[0.98] transition-all"
            >
               <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-full animate-pulse flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]" />
               </div>
               <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 text-[9px] font-bold text-white uppercase tracking-[0.2em] rounded-full border border-white/10 backdrop-blur-md">
                  Grid Monitor: MAH_ZONE_04
               </div>
            </div>

         </div>
      </div>

      {/* Create Zone Modal */}
      <AnimatePresence>
         {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2.5rem] p-10 shadow-2xl space-y-8"
               >
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <h2 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tighter italic">Create <span className="text-emerald-500">Security Zone</span></h2>
                        <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Protocol Generation Module</p>
                     </div>
                     <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-rose-600/10 hover:text-rose-500 transition-all rounded-xl">
                        <X size={20} />
                     </button>
                  </div>

                  <form onSubmit={handleCreateZone} className="space-y-8">
                     <div className="space-y-6">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] ml-2">Zone Identity</label>
                           <input 
                              autoFocus
                              value={newZoneName}
                              onChange={(e) => setNewZoneName(e.target.value)}
                              placeholder="e.g. South Cluster Restricted"
                              className="w-full px-6 py-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-2xl text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/40 outline-none transition-all placeholder:text-[var(--text-tertiary)]/50"
                           />
                        </div>

                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] ml-2">Zone Protocol</label>
                           <div className="grid grid-cols-3 gap-3">
                              {['inclusion', 'exclusion', 'speed-cap'].map((type) => (
                                 <button
                                    key={type}
                                    type="button"
                                    onClick={() => setNewZoneType(type)}
                                    className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                                       newZoneType === type 
                                       ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg' 
                                       : 'bg-[var(--bg-tertiary)] border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:border-emerald-500/30'
                                    }`}
                                 >
                                    {type}
                                 </button>
                              ))}
                           </div>
                        </div>
                     </div>

                     <button 
                        type="submit"
                        className="w-full py-5 bg-emerald-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-emerald-950/40 hover:bg-emerald-700 transition-all active:scale-95"
                     >
                        Initialize Perimeter Protocol
                     </button>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}
