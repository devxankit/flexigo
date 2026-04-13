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
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="space-y-0.5">
            <div className="flex items-center gap-2">
               <div className="w-1 h-5 bg-rose-600 rounded-full" />
               <h1 className="text-xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Alert <span className="text-rose-600">Center</span>
               </h1>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] ml-3">
               Incident Monitoring & Response
            </p>
         </div>
         
         <div className="flex items-center gap-2">
            <div className="relative group">
               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-tertiary)] group-focus-within:text-rose-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search ID..." 
                 className="pl-8 pr-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[9px] font-black uppercase tracking-widest focus:ring-1 focus:ring-rose-500/20 outline-none transition-all w-32 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50"
               />
            </div>
            <button 
               onClick={() => alert("FLUSH: SUCCESS")}
               className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-md active:scale-95"
            >
               <Zap size={12} fill="currentColor" /> Flush
            </button>
         </div>
      </div>

      {/* Incident Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <AdminStatCard title="Active" value={networkStats.maintenanceAlerts} icon={ShieldAlert} color="rose" subtitle="Unresolved" />
         <AdminStatCard title="Latency" value="12ms" icon={Signal} color="emerald" subtitle="Network" />
         <AdminStatCard title="Breaches" value="0" icon={Activity} color="emerald" subtitle="Security" />
         <AdminStatCard title="Resolved" value="142" icon={CheckCircle} color="blue" subtitle="Auto-Fixed" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Live Incident Stream */}
         <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between bg-rose-500/5">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-rose-600 animate-pulse shadow-inner">
                     <Bell size={16} />
                  </div>
                  <div>
                     <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-wider leading-none">Incident Payload Feed</h3>
                     <p className="text-[7.5px] font-black text-rose-600 uppercase mt-1 tracking-widest italic leading-none opacity-80">Real-time Telemetry Registry</p>
                  </div>
               </div>
               <div className="flex items-center gap-1.5">
                  <button className="p-1.5 text-[var(--text-tertiary)] hover:text-rose-500 rounded-lg transition-all">
                     <Filter size={14} />
                  </button>
               </div>
            </div>

            <div className="divide-y divide-[var(--border-subtle)]">
               {[
                 { id: 'ALR-9021', title: 'Critical Power Drop', node: 'EV-1029', status: 'critical', hub: 'MAH_HSR_03', time: '2m ago' },
                 { id: 'ALR-4412', title: 'Identity Mismatch', node: 'USR-7721', status: 'warning', hub: 'MAH_IND_01', time: '15m ago' },
                 { id: 'ALR-7721', title: 'Boundary Breach', node: 'EV-9021', status: 'serious', hub: 'MAH_KOR_02', time: '22m ago' },
                 { id: 'ALR-1029', title: 'Signal Link Failure', node: 'NODE_4', status: 'critical', hub: 'CORE_GT', time: '1h ago' }
               ].map((alert) => (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    key={alert.id} 
                    className="px-6 py-2.5 flex items-center justify-between hover:bg-[var(--bg-tertiary)]/20 transition-all cursor-pointer group"
                  >
                     <div className="flex items-center gap-4">
                        <div className={`p-1.5 rounded-lg border ${
                           alert.status === 'critical' ? 'bg-rose-600/10 border-rose-500/20 text-rose-500' :
                           alert.status === 'serious' ? 'bg-amber-600/10 border-amber-500/20 text-amber-500' :
                           'bg-blue-600/10 border-blue-500/20 text-blue-500'
                        }`}>
                           <AlertCircle size={14} className={alert.status === 'critical' ? 'animate-pulse' : ''} />
                        </div>
                        <div className="space-y-0.5">
                           <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-tight group-hover:text-rose-500 transition-colors leading-none italic">{alert.title}</span>
                              <div className={`w-1 h-3 rounded-full opacity-40 ${
                                 alert.status === 'critical' ? 'bg-rose-500' : 'bg-amber-500'
                              }`} />
                           </div>
                           <p className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase tracking-widest italic leading-none">{alert.node} • {alert.hub}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-6">
                        <span className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase italic tracking-widest">{alert.time}</span>
                        <div className="flex items-center gap-1.5">
                           <button className="p-1.5 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-lg text-[var(--text-tertiary)] hover:text-emerald-500 hover:border-emerald-500/30 transition-all">
                              <CheckCircle size={12}/>
                           </button>
                           <button className="p-1.5 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-lg text-[var(--text-tertiary)] hover:text-rose-500 hover:border-rose-500/30 transition-all">
                              <Trash2 size={12}/>
                           </button>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>
            
            <button className="w-full py-2 bg-[var(--bg-tertiary)]/30 border-t border-[var(--border-subtle)] text-[7.5px] font-black uppercase tracking-widest text-[var(--text-tertiary)] hover:text-rose-500 hover:bg-rose-500/5 transition-all flex items-center justify-center gap-1.5 italic">
               Access Payload Archive <ArrowRight size={10} />
            </button>
         </div>

         {/* Alert Policy Summary */}
         <div className="space-y-4">
            <div className="p-5 bg-rose-600/5 border border-rose-500/10 rounded-2xl space-y-4 shadow-sm relative overflow-hidden group border-t-4 border-t-rose-600">
               <div className="absolute right-0 top-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none"><Layers size={80} /></div>
               <div>
                  <h4 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-widest mb-1 italic">Response Matrix</h4>
                  <p className="text-[8px] text-[var(--text-tertiary)] font-bold uppercase leading-relaxed tracking-wider italic">Threshold: HIGH-SENSITIVITY. Safety protocols engage at 90% drift.</p>
               </div>
               <div className="pt-3 border-t border-rose-500/10 space-y-3">
                  {[
                    { label: 'Energy Fail', val: 95, color: 'bg-rose-500' },
                    { label: 'Fence Breach', val: 78, color: 'bg-amber-500' },
                    { label: 'Unauth Root', val: 99, color: 'bg-rose-600' }
                  ].map((item) => (
                     <div key={item.label} className="space-y-1">
                        <div className="flex justify-between items-end italic"><span className="text-[7.5px] font-black text-[var(--text-primary)] uppercase tracking-wider">{item.label}</span><span className="text-[7.5px] font-black text-rose-500">{item.val}%</span></div>
                        <div className="w-full h-1 bg-[var(--bg-tertiary)] rounded-full overflow-hidden shadow-inner"><div className={`${item.color} h-full transition-all duration-1000`} style={{ width: `${item.val}%` }} /></div>
                     </div>
                  ))}
               </div>
            </div>

            <button className="w-full py-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-[9px] font-black uppercase tracking-widest text-[var(--text-primary)] hover:border-rose-500/30 hover:text-rose-500 transition-all shadow-sm flex items-center justify-center gap-2">
               Dispatch Config <Settings size={12} />
            </button>
         </div>
      </div>
    </div>
  );
}
