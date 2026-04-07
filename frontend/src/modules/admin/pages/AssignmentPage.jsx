import React, { useState } from 'react';
import { 
  QrCode, 
  UserPlus, 
  Truck, 
  History, 
  ExternalLink, 
  CheckCircle, 
  Search, 
  Filter, 
  Scan,
  Maximize2,
  Clock,
  ArrowRight,
  X,
  Target,
  Zap,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminStatCard from '../components/AdminStatCard';
import { adminDataStore } from '../store/adminDataStore';

export default function AssignmentPage() {
  const [assignments, setAssignments] = useState([
    { id: 'ASGN-7721', vehicle: 'EV-9021', rider: 'Rajesh Koothrappali', hub: 'HSR Hub', type: 'QR Scan', startTime: '10:15 AM', status: 'active' },
    { id: 'ASGN-7720', vehicle: 'EV-4412', rider: 'Penny Wolowitz', hub: 'Indiranagar Hub', type: 'Manual', startTime: '09:30 AM', status: 'completed' },
    { id: 'ASGN-7719', vehicle: 'EV-1029', rider: 'Leonard Hofstadter', hub: 'Koramangala Hub', type: 'QR Scan', startTime: '08:45 AM', status: 'active' },
    { id: 'ASGN-7718', vehicle: 'EV-5541', rider: 'Bernadette R.', hub: 'Whitefield Hub', type: 'Manual', startTime: 'Yesterday', status: 'completed' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('qr'); // qr or manual
  const [assignmentData, setAssignmentData] = useState({
    vehicleId: '',
    riderName: '',
    hub: 'Main Gateway'
  });

  const handleAssign = (e) => {
    e.preventDefault();
    if (!assignmentData.vehicleId || !assignmentData.riderName) return;

    const newAsgn = {
      id: `ASGN-${Math.floor(7000 + Math.random() * 900)}`,
      vehicle: assignmentData.vehicleId,
      rider: assignmentData.riderName,
      hub: assignmentData.hub,
      type: activeTab === 'qr' ? 'QR Scan' : 'Manual',
      startTime: 'Just Now',
      status: 'active'
    };

    setAssignments([newAsgn, ...assignments]);
    setAssignmentData({ vehicleId: '', riderName: '', hub: 'Main Gateway' });
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
                  Vehicle <span className="text-emerald-500">Assignment</span>
               </h1>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-tertiary)] ml-4">
               Fleet Allocation • Automatic Handover
            </p>
         </div>
         
         <div className="flex items-center gap-3">
            <button 
               onClick={() => { setActiveTab('qr'); setIsModalOpen(true); }}
               className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-950/20 active:scale-95"
            >
               <QrCode size={14} strokeWidth={3} /> Generate QR
            </button>
            <button 
               onClick={() => { setActiveTab('manual'); setIsModalOpen(true); }}
               className="flex items-center gap-2 px-5 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] text-[10px] font-black uppercase tracking-widest hover:border-emerald-500/30 transition-all active:scale-95 flex items-center gap-2"
            >
               <UserPlus size={14} /> Manual Assignment
            </button>
            <button 
                onClick={() => alert("NETWORK_GRID: RELOADING HUB_NODES...")}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-tertiary)] hover:bg-emerald-600/10 border border-[var(--border-subtle)] hover:border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-primary)] hover:text-emerald-500 transition-all group active:scale-95"
             >
                Full Grid View <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
             </button>
         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
         <AdminStatCard title="Total Rentals" value={assignments.filter(a => a.status === 'active').length} icon={Truck} color="emerald" subtitle="Active Handovers" />
         <AdminStatCard title="QR Efficiency" value="68%" icon={QrCode} color="blue" subtitle="Automatic Flow %" />
         <AdminStatCard title="Avg. Setup" value="4.2m" icon={Clock} color="amber" subtitle="Dispatch Velocity" />
         <AdminStatCard title="Success Rate" value="99.8%" icon={CheckCircle} color="emerald" subtitle="Handover Integrity" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Assignment Registry */}
         <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2rem] overflow-hidden shadow-sm">
            <div className="p-8 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-tertiary)]/10">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
                     <Target size={20} />
                  </div>
                  <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">Allocation Registry</h3>
               </div>
               <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)] group-focus-within:text-emerald-500" />
                  <input 
                    type="text" 
                    placeholder="Search ID / Host..." 
                    className="pl-9 pr-4 py-2 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all w-48 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50"
                  />
               </div>
            </div>
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/30">
                        {['Allocation ID', 'Asset Identity', 'Subscriber Host', 'Protocol', 'Dispatch', 'Status'].map((header) => (
                           <th key={header} className="py-5 px-8 text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-tertiary)] whitespace-nowrap">{header}</th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                     <AnimatePresence mode='popLayout'>
                        {assignments.map((asgn) => (
                           <motion.tr 
                              layout
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              key={asgn.id} 
                              className="group/row hover:bg-[var(--bg-tertiary)]/50 transition-colors"
                           >
                              <td className="py-6 px-8 font-black text-[9px] text-[var(--text-tertiary)] uppercase tracking-widest">{asgn.id}</td>
                              <td className="py-6 px-8 text-xs font-black text-[var(--text-primary)] uppercase tracking-tight italic">{asgn.vehicle}</td>
                              <td className="py-6 px-8 flex flex-col">
                                 <span className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-widest">{asgn.rider}</span>
                                 <span className="text-[8px] font-bold text-[var(--text-tertiary)] uppercase">{asgn.hub} Registry</span>
                              </td>
                              <td className="py-6 px-8">
                                 <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                    asgn.type === 'QR Scan' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-sm' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                 }`}>
                                    {asgn.type === 'QR Scan' ? <Scan size={10} strokeWidth={3} /> : <UserPlus size={10} strokeWidth={3} />}
                                    {asgn.type}
                                 </div>
                              </td>
                              <td className="py-6 px-8 text-[10px] font-black text-[var(--text-tertiary)] uppercase italic italic">{asgn.startTime}</td>
                              <td className="py-6 px-8">
                                 <div className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                                    asgn.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                                 }`}>
                                    {asgn.status === 'active' && <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse mr-2" />}
                                    {asgn.status}
                                 </div>
                              </td>
                           </motion.tr>
                        ))}
                     </AnimatePresence>
                  </tbody>
               </table>
            </div>
         </div>

         {/* Dispatch Control & QR Panel */}
         <div className="space-y-6">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2rem] p-8 shadow-sm flex flex-col items-center relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-600/5 blur-[80px] group-hover:bg-emerald-600/10 transition-all rounded-full" />
               <div className="w-full flex items-center justify-between mb-10 pb-4 border-b border-[var(--border-subtle)] relative z-10">
                  <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest italic">Fleet Dispatcher</h3>
                  <div className="p-2 bg-emerald-600/10 rounded-xl text-emerald-500">
                     <QrCode size={20} />
                  </div>
               </div>

               <div className="w-56 h-56 bg-[var(--bg-tertiary)] border-2 border-emerald-500/20 rounded-[2.5rem] p-6 flex items-center justify-center relative group/qr shadow-inner scale-100 hover:scale-105 transition-transform duration-500">
                  <div className="absolute inset-0 bg-emerald-500/5 blur-2xl group-hover/qr:bg-emerald-500/15 transition-all" />
                  <QrCode size={160} className="text-emerald-500 opacity-90 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                  <div className="absolute -bottom-3 px-4 py-1.5 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-full shadow-2xl shadow-emerald-950/40 border border-white/20">
                     SCAN_TO_INIT
                  </div>
               </div>

               <div className="mt-12 w-full space-y-6 relative z-10">
                  <div className="p-6 bg-[var(--bg-tertiary)] rounded-2xl space-y-4 border border-[var(--border-subtle)]">
                     <p className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.3em] text-center">Active Master QR Cipher</p>
                     <div className="h-px bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent w-full" />
                     <div className="flex justify-between items-center px-2">
                        <span className="text-[11px] font-black text-[var(--text-primary)] tracking-widest italic">FLX-2026-TOKEN-4X</span>
                        <div className="flex gap-2">
                           <button 
                               onClick={() => alert("EXPANDING_CIPHER: FX_PROTO_6")}
                               className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-tertiary)] hover:text-emerald-500 hover:bg-emerald-600/5 transition-all outline-none"
                            >
                               <Maximize2 size={16} />
                            </button>
                            <button 
                               onClick={() => alert("CIPHER_HISTORY: FETCHING...")}
                               className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-tertiary)] hover:text-emerald-500 hover:bg-emerald-600/5 transition-all outline-none"
                            >
                               <History size={16} />
                            </button>
                        </div>
                     </div>
                  </div>
                  <p className="text-[10px] font-bold text-[var(--text-tertiary)] text-center italic uppercase tracking-tighter leading-relaxed">Assign vehicles manually if QR fail-safe protocol is triggered by hardware timeout.</p>
               </div>
            </div>

            {/* Ready Assets Strip */}
             <button 
                onClick={() => alert("SYNCING_TRIP_TELEMETRY: ALPHA_CENTRAL")}
                className="w-full p-5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[1.5rem] flex items-center justify-between group cursor-pointer hover:border-emerald-500/30 transition-all shadow-sm active:scale-[0.98]"
             >
                <div className="flex items-center gap-4">
                   <div className="p-2.5 bg-emerald-600/10 text-emerald-500 rounded-xl group-hover:rotate-12 transition-transform shadow-inner">
                      <MapPin size={22} strokeWidth={2.5} />
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-[0.2em] leading-none">Trip Telemetry Log</p>
                      <p className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest text-left">Audit Full Route History</p>
                   </div>
                </div>
                <ArrowRight size={20} className="text-[var(--text-tertiary)] group-hover:translate-x-1 group-hover:text-emerald-500 transition-all" />
             </button>
            <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[1.5rem] space-y-4 shadow-sm border-l-4 border-l-emerald-600 group hover:border-emerald-500/30 transition-all">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-emerald-600/10 text-emerald-500 rounded-lg group-hover:rotate-12 transition-transform shadow-inner">
                        <Truck size={20} strokeWidth={2.5} />
                     </div>
                     <span className="text-xs font-black text-[var(--text-primary)] uppercase tracking-widest">Ready for Handover</span>
                  </div>
                  <span className="text-2xl font-black text-emerald-500 italic tracking-tighter shadow-sm">14</span>
               </div>
               <div className="flex -space-x-3 mt-2">
                  {[1,2,3,4,5].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] border-2 border-[var(--bg-secondary)] flex items-center justify-center text-[9px] font-black text-emerald-500 shadow-sm">
                        {i}
                     </div>
                  ))}
                  <div className="w-10 h-10 rounded-full bg-emerald-600 border-2 border-[var(--bg-secondary)] flex items-center justify-center text-[10px] font-black text-white shadow-xl shadow-emerald-950/20 group-hover:translate-x-1 transition-transform">
                     +9
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Assignment Modal */}
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
                        <h2 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tighter italic">Handover <span className="text-emerald-500">Initiator</span></h2>
                        <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Master Protocol: {activeTab.toUpperCase()}_DISPATCH</p>
                     </div>
                     <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-rose-600/10 hover:text-rose-500 transition-all rounded-xl">
                        <X size={20} />
                     </button>
                  </div>

                  <form onSubmit={handleAssign} className="space-y-8">
                     <div className="space-y-6">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] ml-2">Hardware Cipher (Vehicle ID)</label>
                           <input 
                              autoFocus
                              value={assignmentData.vehicleId}
                              onChange={(e) => setAssignmentData({...assignmentData, vehicleId: e.target.value})}
                              placeholder="e.g. EV-9021"
                              className="w-full px-6 py-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-2xl text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/40 outline-none transition-all placeholder:text-[var(--text-tertiary)]/50"
                           />
                        </div>

                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] ml-2">Subscriber Host (Rider Name)</label>
                           <input 
                              value={assignmentData.riderName}
                              onChange={(e) => setAssignmentData({...assignmentData, riderName: e.target.value})}
                              placeholder="e.g. Rahul Sharma"
                              className="w-full px-6 py-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-2xl text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/40 outline-none transition-all placeholder:text-[var(--text-tertiary)]/50"
                           />
                        </div>
                     </div>

                     <button 
                        type="submit"
                        className="w-full py-5 bg-emerald-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-emerald-950/40 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-3"
                     >
                        <Zap size={16} fill="white" /> Execute Dispatch Hub Sync
                     </button>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}
