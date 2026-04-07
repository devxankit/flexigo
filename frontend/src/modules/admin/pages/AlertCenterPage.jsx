import React from 'react';
import { 
  Bell, 
  ShieldAlert, 
  Zap, 
  Signal, 
  Activity, 
  Search, 
  Filter, 
  Settings, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  MoreVertical,
  Layers,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminStatCard from '../components/AdminStatCard';
import { adminDataStore } from '../store/adminDataStore';

export default function AlertCenterPage() {
  const { networkStats } = adminDataStore;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-rose-600 rounded-full" />
               <h1 className="text-2xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Alert <span className="text-rose-600">Center</span>
               </h1>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-tertiary)] ml-4">
               Vehicle Issues • Live Safety Notifications
            </p>
         </div>
         
         <div className="flex items-center gap-3">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)] group-focus-within:text-rose-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search Incident ID / Node..." 
                 className="pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-rose-500/20 focus:border-rose-500/30 outline-none transition-all w-64 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50"
               />
            </div>
            <button 
               onClick={() => alert("SYSTEM FLUSH: SUCCESS")}
               className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg active:scale-95"
            >
               <Zap size={14} fill="white" /> Flush Alert Log
            </button>
         </div>
      </div>

      {/* Incident Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
         <AdminStatCard title="New Issues" value={networkStats.maintenanceAlerts} icon={ShieldAlert} color="rose" subtitle="Unchecked problems" />
         <AdminStatCard title="System Lag" value="12ms" icon={Signal} color="emerald" subtitle="Network speed" />
         <AdminStatCard title="Security Alerts" value="0" icon={Activity} color="emerald" subtitle="Unauthorized access" />
         <AdminStatCard title="Fixed Reports" value="142" icon={CheckCircle} color="blue" subtitle="Solved automatically" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Live Incident Stream */}
         <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2rem] overflow-hidden shadow-sm">
            <div className="p-8 border-b border-[var(--border-subtle)] flex items-center justify-between bg-rose-500/5">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-rose-600 animate-pulse shadow-inner">
                     <Bell size={20} />
                  </div>
                  <div>
                     <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">Recent Issues</h3>
                     <p className="text-[9px] font-bold text-rose-600 uppercase mt-1 tracking-widest italic">Live update feed</p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <button 
                     onClick={() => alert("FILTERING: ACTIVE")}
                     className="p-2.5 text-[var(--text-tertiary)] hover:text-rose-500 hover:bg-rose-600/5 rounded-xl transition-all"
                  >
                     <Filter size={18} />
                  </button>
                  <button 
                     onClick={() => alert("POLICY_CONFIG: OPEN")}
                     className="p-2.5 text-[var(--text-tertiary)] hover:text-rose-500 hover:bg-rose-600/5 rounded-xl transition-all"
                  >
                     <Settings size={18} />
                  </button>
               </div>
            </div>

            <div className="divide-y divide-[var(--border-subtle)]">
               {[
                 { id: 'ALR-9021', title: 'Critical Power Drop', node: 'EV-1029', status: 'critical', hub: 'MAH_HSR_03', time: '2m ago' },
                 { id: 'ALR-4412', title: 'Auth Identity Mismatch', node: 'USR-7721', status: 'warning', hub: 'MAH_IND_01', time: '15m ago' },
                 { id: 'ALR-7721', title: 'Geo-Boundary Breach', node: 'EV-9021', status: 'serious', hub: 'MAH_KOR_02', time: '22m ago' },
                 { id: 'ALR-1029', title: 'Signal Link Failure', node: 'MAH_NODE_4', status: 'critical', hub: 'CORE_GATEWAY', time: '1h ago' }
               ].map((alert) => (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    key={alert.id} 
                    className="p-6 flex items-center justify-between hover:bg-[var(--bg-tertiary)]/50 transition-all cursor-pointer group"
                  >
                     <div className="flex items-center gap-5">
                        <div className={`p-3 rounded-2xl border ${
                           alert.status === 'critical' ? 'bg-rose-600/10 border-rose-500/20 text-rose-500' :
                           alert.status === 'serious' ? 'bg-amber-600/10 border-amber-500/20 text-amber-500' :
                           'bg-blue-600/10 border-blue-500/20 text-blue-500'
                        }`}>
                           <AlertCircle size={20} className={alert.status === 'critical' ? 'animate-pulse' : ''} />
                        </div>
                        <div className="space-y-0.5">
                           <div className="flex items-center gap-2">
                              <span className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-tight group-hover:text-rose-500 transition-colors leading-none">{alert.title}</span>
                              <div className={`w-1 h-3 rounded-full opacity-40 ${
                                 alert.status === 'critical' ? 'bg-rose-500' : 'bg-amber-500'
                              }`} />
                           </div>
                           <p className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest leading-relaxed italic mt-1">{alert.node} • {alert.hub} Registry</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-8">
                        <span className="text-[9px] font-black text-[var(--text-tertiary)] uppercase italic tracking-widest">{alert.time}</span>
                        <div className="flex items-center gap-2">
                           <button 
                              onClick={() => alert(`RESOLVING: ${alert.id}`)}
                              className="p-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-tertiary)] hover:text-emerald-500 hover:bg-emerald-600/5 transition-all outline-none"
                           >
                              <CheckCircle size={14}/>
                           </button>
                           <button 
                              onClick={() => alert(`ARCHIVING: ${alert.id}`)}
                              className="p-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-tertiary)] hover:text-rose-500 hover:bg-rose-600/5 transition-all outline-none"
                           >
                              <Trash2 size={14}/>
                           </button>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>
            
            <button className="w-full py-4 bg-[var(--bg-tertiary)]/50 border-t border-[var(--border-subtle)] text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-tertiary)] hover:text-rose-500 hover:bg-rose-500/5 transition-all flex items-center justify-center gap-2">
               Access Historic Disaster Log <ArrowRight size={14} />
            </button>
         </div>

         {/* Alert Policy Summary */}
         <div className="space-y-6">
            <div className="p-8 bg-rose-600/5 border border-rose-500/10 rounded-[2.5rem] space-y-6 shadow-sm relative overflow-hidden group">
               <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:scale-125 transition-transform"><Layers size={100} /></div>
               <div>
                  <h4 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest mb-2">Protocol Sensitivity</h4>
                  <p className="text-[11px] text-[var(--text-tertiary)] font-bold uppercase leading-relaxed tracking-[0.2em] italic">Alert system current threshold: High-SENSITIVITY. Neural filtering active to prioritize life-safety events over telemetry jitter.</p>
               </div>
               <div className="pt-4 border-t border-rose-500/10">
                  <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest mb-4">Node Health Thresholds</p>
                  <div className="space-y-4">
                     {[
                       { label: 'Battery Disconnect', val: 95, color: 'bg-rose-500' },
                       { label: 'Geo-Fence Alpha-4', val: 78, color: 'bg-amber-500' },
                       { label: 'Unauth Login (Root)', val: 99, color: 'bg-rose-600' }
                     ].map((item) => (
                        <div key={item.label} className="space-y-1">
                           <div className="flex justify-between items-end"><span className="text-[9px] font-black text-[var(--text-primary)] uppercase tracking-wider">{item.label}</span><span className="text-[9px] font-bold text-rose-500 tracking-tighter">{item.val}%</span></div>
                           <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden"><div className={`${item.color} h-full`} style={{ width: `${item.val}%` }} /></div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <button className="w-full py-5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-primary)] hover:border-rose-500/30 hover:text-rose-500 transition-all shadow-sm flex items-center justify-center gap-3">
               Configure Dispatch Rules <Settings size={18} />
            </button>
         </div>
      </div>
    </div>
  );
}
