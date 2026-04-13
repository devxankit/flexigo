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
  ArrowRight,
  Activity
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
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="space-y-0.5">
            <div className="flex items-center gap-2">
               <div className="w-1 h-5 bg-emerald-600 rounded-full" />
               <h1 className="text-xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Geo <span className="text-emerald-500">Fencing</span>
               </h1>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] ml-3">
               Perimeter Security & Grid Protocols
            </p>
         </div>
         
         <div className="flex items-center gap-2">
            <div className="relative group">
               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-tertiary)] group-focus-within:text-emerald-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search Zones..." 
                 className="pl-8 pr-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[9px] font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all w-32 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50"
               />
            </div>
            <button 
               onClick={() => setIsModalOpen(true)}
               className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md active:scale-95"
            >
               <Plus size={12} strokeWidth={3} /> Create Zone
            </button>
         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <AdminStatCard title="Active Zones" value={geofences.length} icon={Map} color="emerald" subtitle="Monitored Nodes" />
         <AdminStatCard title="Breaches" value="42" icon={AlertTriangle} color="rose" subtitle="Last 24 Delta" />
         <AdminStatCard title="Security" value="High" icon={Shield} color="blue" subtitle="Grid Integrity" />
         <AdminStatCard title="Sync" value="100%" icon={Activity} color="emerald" subtitle="Telemetry Status" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Geofence Registry */}
         <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-tertiary)]/10">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
                     <Layers size={16} />
                  </div>
                  <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-wider leading-none italic">Zone Protocol Registry</h3>
               </div>
            </div>
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/20">
                        {['Zone Identity', 'Type', 'Radius', 'Status', 'Alerts', 'Actions'].map((header) => (
                           <th key={header} className="py-2.5 px-6 text-[8px] font-black uppercase tracking-widest text-[var(--text-tertiary)] whitespace-nowrap">{header}</th>
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
                            className="group/row hover:bg-[var(--bg-tertiary)]/20 transition-colors text-[10px]"
                          >
                             <td className="py-2.5 px-6 whitespace-nowrap">
                                <div className="flex flex-col">
                                   <span className="font-black text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors uppercase tracking-tight italic leading-none">{gf.name}</span>
                                   <span className="text-[7px] font-bold text-[var(--text-tertiary)] tracking-widest uppercase mt-1 leading-none italic">{gf.id} Target</span>
                                </div>
                             </td>
                             <td className="py-2.5 px-6">
                                <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded border leading-none ${
                                   gf.type === 'exclusion' ? 'bg-rose-500/10 text-rose-500 border-rose-500/10' : 
                                   gf.type === 'inclusion' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' :
                                   'bg-blue-500/10 text-blue-500 border-blue-500/10'
                                }`}>
                                   {gf.type}
                                </span>
                             </td>
                             <td className="py-2.5 px-6 text-[9px] font-black text-[var(--text-primary)] italic leading-none">{gf.radius}</td>
                             <td className="py-2.5 px-6">
                                <div className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest border leading-none ${
                                   gf.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' : 'bg-slate-500/10 text-slate-500 border-slate-500/10'
                                }`}>
                                   <div className={`w-1 h-1 rounded-full ${gf.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                                   {gf.status}
                                </div>
                             </td>
                             <td className="py-2.5 px-6">
                                <span className={`text-[9px] font-black italic leading-none ${gf.alerts > 0 ? 'text-rose-500' : 'text-[var(--text-tertiary)]'}`}>{gf.alerts} FLUX</span>
                             </td>
                             <td className="py-2.5 px-6">
                                <button 
                                   onClick={() => deleteZone(gf.id)}
                                   className="p-1.5 text-[var(--text-tertiary)] hover:text-rose-500 hover:bg-rose-600/5 rounded-lg transition-all"
                                >
                                   <X size={14} />
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
         <div className="space-y-4">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-5 shadow-sm border-t-4 border-t-rose-600">
               <div className="flex items-center justify-between mb-6 pb-2 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                        <Bell size={16} />
                     </div>
                     <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-widest italic leading-none">Breach Payload</h3>
                  </div>
                  <button className="p-1.5 text-[var(--text-tertiary)] hover:text-emerald-500 transition-colors">
                     <History size={16} />
                  </button>
               </div>

               <div className="space-y-3">
                  {[
                    { id: 'AL-991', vehicle: 'EV-8821', zone: 'Koramangala Restricted', time: '2m ago' },
                    { id: 'AL-990', vehicle: 'EV-1029', zone: 'Airport Corridor', time: '15m ago' },
                  ].map((alert) => (
                     <div key={alert.id} className="p-3 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-xl space-y-2 group cursor-pointer hover:border-rose-500/30 transition-all shadow-sm">
                        <div className="flex items-center justify-between">
                           <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1">
                              <Target size={10} /> Incident Sync
                           </span>
                           <span className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase italic leading-none">{alert.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <div>
                              <p className="text-[10px] font-black text-[var(--text-primary)] italic leading-none">{alert.vehicle}</p>
                              <p className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase tracking-widest mt-1 leading-none italic">{alert.zone}</p>
                           </div>
                           <ArrowRight size={12} className="text-[var(--text-tertiary)]/30 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all" />
                        </div>
                     </div>
                  ))}
               </div>

               <button className="w-full mt-6 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[8px] font-black uppercase tracking-widest text-[var(--text-primary)] hover:text-emerald-500 transition-all flex items-center justify-center gap-2 active:scale-95 italic font-black">
                  Fetch Logs <History size={12} />
               </button>
            </div>

            {/* Tactical Map Preview */}
            <div className="h-48 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-2xl relative overflow-hidden group shadow-sm bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] cursor-pointer active:scale-[0.98] transition-all border-l-4 border-l-emerald-600">
               <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-emerald-500/10 border border-emerald-500/30 rounded-full animate-pulse flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />
               </div>
               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 text-[7px] font-black text-white uppercase tracking-widest rounded-full border border-white/10 backdrop-blur-md italic">
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
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="w-full max-w-md bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-8 shadow-2xl space-y-6 overflow-hidden relative"
               >
                  <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                     <Map size={100} />
                  </div>

                  <div className="flex items-center justify-between relative z-10 border-b border-[var(--border-subtle)] pb-4">
                     <div className="space-y-0.5">
                        <h2 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tighter italic leading-none">Create <span className="text-emerald-500">Security Zone</span></h2>
                        <p className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest leading-none mt-1">Protocol Generation Module</p>
                     </div>
                     <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-rose-600/10 hover:text-rose-500 transition-all rounded-lg">
                        <X size={18} />
                     </button>
                  </div>

                  <form onSubmit={handleCreateZone} className="space-y-6 relative z-10">
                     <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1 italic leading-none">Zone Identity</label>
                           <input 
                              autoFocus
                              value={newZoneName}
                              onChange={(e) => setNewZoneName(e.target.value)}
                              placeholder="e.g. SOUTH CLUSTER RESTRICTED"
                              className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/40 outline-none transition-all placeholder:text-[var(--text-tertiary)]/50 italic"
                           />
                        </div>

                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1 italic leading-none">Zone Protocol</label>
                           <div className="grid grid-cols-3 gap-2">
                              {['inclusion', 'exclusion', 'speed-cap'].map((type) => (
                                 <button
                                    key={type}
                                    type="button"
                                    onClick={() => setNewZoneType(type)}
                                    className={`py-2 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all italic leading-none ${
                                       newZoneType === type 
                                       ? 'bg-emerald-600 border-emerald-500 text-white shadow-md' 
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
                        className="w-full py-4 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-950/20 hover:bg-emerald-700 transition-all active:scale-95 italic"
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
