import React, { useState } from 'react';
import { 
  Warehouse, 
  MapPin, 
  Activity, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  ArrowUpRight,
  TrendingUp,
  Signal,
  MoreVertical,
  X,
  Zap,
  Globe,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminStatCard from '../components/AdminStatCard';
import { adminDataStore } from '../store/adminDataStore';

export default function HubManagementPage() {
  const [hubList, setHubList] = useState(adminDataStore.hubs);
  const { networkStats } = adminDataStore;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newHub, setNewHub] = useState({ name: '', city: '', fleet: '' });

  const handleAddHub = (e) => {
    e.preventDefault();
    if (!newHub.name || !newHub.city) return;

    const hub = {
      id: `HUB-${Math.floor(100 + Math.random() * 900)}`,
      name: newHub.name,
      city: newHub.city,
      fleet: parseInt(newHub.fleet) || 0,
      subs: 0,
      revenue: 0,
      health: '100%',
      status: 'active'
    };

    setHubList([hub, ...hubList]);
    setNewHub({ name: '', city: '', fleet: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
               <h1 className="text-2xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Hub <span className="text-emerald-500">Directory</span>
               </h1>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-tertiary)] ml-4">
               Our Locations • Hub Registry
            </p>
         </div>
         
         <div className="flex items-center gap-3">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)] group-focus-within:text-emerald-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search Hub Name..." 
                 className="pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/30 outline-none transition-all w-64 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50"
               />
            </div>
            <button 
               onClick={() => setIsModalOpen(true)}
               className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-950/20 active:scale-95"
            >
               <Plus size={14} strokeWidth={3} /> Add Hub
            </button>
         </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
         <AdminStatCard title="Total Hubs" value={hubList.length} icon={Warehouse} color="emerald" subtitle="Fleet centers" />
         <AdminStatCard title="Storage Used" value={networkStats.hubUtilization} icon={TrendingUp} color="blue" subtitle="Average space used" />
         <AdminStatCard title="Hub Connectivity" value="98.2%" icon={Signal} color="emerald" subtitle="Online status" />
         <AdminStatCard title="Hub Health" value="94%" icon={Activity} color="emerald" subtitle="System uptime" />
      </div>

      {/* Hub Node Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <AnimatePresence mode='popLayout'>
            {hubList.map((hub, idx) => (
               <motion.div 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  key={hub.id} 
                  className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2rem] p-8 shadow-sm hover:border-emerald-500/30 transition-all group"
               >
                  <div className="flex items-start justify-between mb-8">
                     <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                           <Warehouse size={24} />
                        </div>
                        <div className="space-y-1">
                           <h3 className="text-lg font-black text-[var(--text-primary)] uppercase italic tracking-tighter leading-none">{hub.name}</h3>
                           <div className="flex items-center gap-2 text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">
                              <MapPin size={10} className="text-emerald-500" /> {hub.city} • <span className="text-emerald-500">{hub.id}</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex flex-col items-end gap-1">
                        <div className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${hub.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                           {hub.status}
                        </div>
                        <span className="text-[10px] font-black text-emerald-600 italic mt-1 tracking-tighter">{hub.health} Sync</span>
                     </div>
                  </div>

                  <div className="mt-8 p-4 bg-emerald-600/5 border border-emerald-500/10 rounded-xl space-y-3">
                     <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Support Copilot</p>
                     </div>
                     <p className="text-[10px] text-[var(--text-tertiary)] font-medium leading-relaxed italic">
                        AI-generated automated replies are enabled for <span className="text-emerald-500 font-bold">Wallet & EV Status</span> queries to reduce staff load.
                     </p>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-8 py-6 border-y border-[var(--border-subtle)]">
                     <div className="space-y-1">
                        <p className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Total Fleet</p>
                        <p className="text-xl font-black text-[var(--text-primary)] tracking-tight">{hub.fleet}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Subscribers</p>
                        <p className="text-xl font-black text-[var(--text-primary)] tracking-tight">{hub.subs}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Revenue</p>
                        <p className="text-xl font-black text-emerald-600 tracking-tight">₹{(hub.revenue / 1000).toFixed(1)}k</p>
                     </div>
                  </div>

                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-600" style={{ width: hub.health }} />
                        </div>
                        <span className="text-[10px] font-black text-[var(--text-tertiary)] uppercase">Health</span>
                     </div>
                      <button 
                         onClick={() => alert(`ENTERING TERMINAL: ${hub.id}`)}
                         className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] hover:text-emerald-500 transition-colors group/btn active:scale-95"
                      >
                         Terminal Access <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                      </button>

                  </div>
               </motion.div>
            ))}
         </AnimatePresence>
      </div>

      {/* Add Hub Modal */}
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
                        <h2 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tighter italic">Register <span className="text-emerald-500">New Hub</span></h2>
                        <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Operational Expansion Wizard</p>
                     </div>
                     <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[8px] font-black text-emerald-500 uppercase tracking-widest leading-none">
                        <Globe size={10} /> Zone: Maharashtra
                     </div>
                     <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-rose-600/10 hover:text-rose-500 transition-all rounded-xl">
                        <X size={20} />
                     </button>
                  </div>
                  
                  <div className="flex gap-2 mb-4">
                     {[1, 2, 3].map(step => (
                        <div key={step} className={`flex-1 h-1 rounded-full ${step === 1 ? 'bg-emerald-500' : 'bg-[var(--bg-tertiary)]'}`} />
                     ))}
                  </div>

                  <form onSubmit={handleAddHub} className="space-y-8">
                     <div className="space-y-6">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] ml-2">Hub Name</label>
                           <input 
                              autoFocus
                              value={newHub.name}
                              onChange={(e) => setNewHub({...newHub, name: e.target.value})}
                              placeholder="e.g. Pune Central Hub"
                              className="w-full px-6 py-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-2xl text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/40 outline-none transition-all placeholder:text-[var(--text-tertiary)]/50"
                           />
                        </div>

                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] ml-2">City / Location</label>
                           <input 
                              value={newHub.city}
                              onChange={(e) => setNewHub({...newHub, city: e.target.value})}
                              placeholder="e.g. Pune, MH"
                              className="w-full px-6 py-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-2xl text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/40 outline-none transition-all placeholder:text-[var(--text-tertiary)]/50"
                           />
                        </div>

                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] ml-2">Initial Fleet Capacity</label>
                           <input 
                              type="number"
                              value={newHub.fleet}
                              onChange={(e) => setNewHub({...newHub, fleet: e.target.value})}
                              placeholder="e.g. 150"
                              className="w-full px-6 py-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-2xl text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/40 outline-none transition-all placeholder:text-[var(--text-tertiary)]/50"
                           />
                        </div>
                     </div>

                     <button 
                        type="submit"
                        className="w-full py-5 bg-emerald-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-emerald-950/40 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-3"
                     >
                        <Zap size={16} fill="white" /> Initialize Hub Protocol
                     </button>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}
