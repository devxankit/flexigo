import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  FileText, 
  CheckCircle, 
  Clock, 
  Search, 
  Filter, 
  Eye, 
  X, 
  Zap, 
  ShieldCheck, 
  AlertCircle, 
  MapPin, 
  ChevronRight,
  Download,
  MoreVertical,
  Check,
  UserX,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminStatCard from '../components/AdminStatCard';

const initialFranchiseKyc = [
  { id: 'FKYC-101', name: 'Nexus Hubs Bangalore', city: 'Bangalore', type: 'Pvt Ltd', hubs: 3, date: '04 Apr 2026', status: 'pending' },
  { id: 'FKYC-102', name: 'Urban Green Fleet', city: 'Mumbai', type: 'Proprietorship', hubs: 1, date: '02 Apr 2026', status: 'approved' },
  { id: 'FKYC-103', name: 'Elite 3PL Logistics', city: 'Pune', type: 'Partnership', hubs: 5, date: '01 Apr 2026', status: 'pending' },
];

export default function FranchiseKycQueue() {
  const [records, setRecords] = useState(initialFranchiseKyc);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAction = (id, newStatus) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(prev => ({ ...prev, status: newStatus }));
    }
  };

  const openDetails = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="space-y-0.5">
            <div className="flex items-center gap-2">
               <div className="w-1 h-5 bg-emerald-600 rounded-full" />
               <h1 className="text-xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Franchise <span className="text-emerald-500">Boarding</span>
               </h1>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] ml-3">
               Partner Verification & Ops Registry
            </p>
         </div>
         
         <div className="flex items-center gap-2">
            <div className="relative group">
               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-tertiary)] group-focus-within:text-emerald-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search Partner..." 
                 className="pl-8 pr-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[9px] font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all w-32 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50"
               />
            </div>
         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <AdminStatCard title="Queued" value={records.length} icon={Building2} color="emerald" subtitle="Waitlist Nodes" />
         <AdminStatCard title="GST Sync" value="100%" icon={ShieldCheck} color="blue" subtitle="Verified Alpha" />
         <AdminStatCard title="Markets" value="14" icon={MapPin} color="emerald" subtitle="Active Cities" />
         <AdminStatCard title="Integrity" value="99.2%" icon={Activity} color="emerald" subtitle="Doc Score" />
      </div>

      {/* Registry */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
         <div className="px-6 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-tertiary)]/10">
            <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-wider leading-none italic">Franchise Payload Registry</h3>
            <div className="flex items-center gap-1.5">
               <button className="p-1.5 text-[var(--text-tertiary)] hover:text-emerald-500 rounded-lg transition-all">
                  <Filter size={14} />
               </button>
            </div>
         </div>

         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full">
               <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/20">
                     {['Partner Identity', 'Entity', 'Zone Node', 'Submission', 'Status', 'Actions'].map((header) => (
                        <th key={header} className="text-left py-2.5 px-6 text-[8px] font-black uppercase tracking-widest text-[var(--text-tertiary)] whitespace-nowrap">{header}</th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-[var(--border-subtle)]">
                  <AnimatePresence mode='popLayout'>
                    {records.map((record) => (
                       <motion.tr 
                         layout
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         exit={{ opacity: 0 }}
                         key={record.id} 
                         className="group/row hover:bg-[var(--bg-tertiary)]/20 transition-colors cursor-pointer text-[10px]"
                         onClick={() => openDetails(record)}
                       >
                          <td className="py-2.5 px-6 whitespace-nowrap">
                             <div className="flex flex-col gap-0.5">
                                <span className="font-black text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors uppercase tracking-tight italic leading-none">{record.name}</span>
                                <span className="text-[7px] font-bold text-[var(--text-tertiary)] tracking-widest uppercase mt-1 leading-none italic">{record.id}</span>
                             </div>
                          </td>
                          <td className="py-2.5 px-6 font-black text-[var(--text-tertiary)] uppercase tracking-widest leading-none italic">{record.type}</td>
                          <td className="py-2.5 px-6">
                             <div className="flex items-center gap-1.5 leading-none">
                                <MapPin size={10} className="text-emerald-500 opacity-60" />
                                <span className="font-black text-[var(--text-primary)] uppercase italic tracking-widest leading-none">{record.city}</span>
                             </div>
                          </td>
                          <td className="py-2.5 px-6 font-black text-[var(--text-tertiary)] uppercase tracking-widest whitespace-nowrap leading-none italic">{record.date}</td>
                          <td className="py-2.5 px-6">
                             <div className={`inline-flex px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest border leading-none ${
                                record.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' : 
                                record.status === 'pending' ? 'bg-blue-500/10 text-blue-500 border-blue-500/10' : 
                                'bg-rose-500/10 text-rose-500 border-rose-500/10'
                             }`}>
                                {record.status}
                             </div>
                          </td>
                          <td className="py-2.5 px-6">
                             <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                <button 
                                   onClick={() => openDetails(record)}
                                   className="p-1.5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-tertiary)] hover:text-emerald-500 hover:border-emerald-500/30 transition-all font-black"
                                >
                                   <Eye size={12} />
                                </button>
                                {record.status === 'pending' && (
                                   <button 
                                      onClick={() => handleAction(record.id, 'approved')}
                                      className="p-1.5 bg-emerald-600 text-white rounded-lg shadow-md hover:bg-emerald-700 transition-all active:scale-95"
                                   >
                                      <CheckCircle size={12} />
                                   </button>
                                )}
                             </div>
                          </td>
                       </motion.tr>
                    ))}
                  </AnimatePresence>
               </tbody>
            </table>
         </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
         {isModalOpen && selectedRecord && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-2xl relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                     <Building2 size={100} />
                  </div>

                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-subtle)] relative z-10">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
                           <Building2 size={20} />
                        </div>
                        <div className="space-y-0.5">
                           <h2 className="text-base font-black text-[var(--text-primary)] uppercase tracking-tighter italic leading-none">{selectedRecord.name}</h2>
                           <p className="text-[7px] font-black text-emerald-500 uppercase tracking-widest leading-none">NODE_ID: {selectedRecord.id}</p>
                        </div>
                     </div>
                     <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-rose-600/10 hover:text-rose-500 transition-all rounded-lg">
                        <X size={18} />
                     </button>
                  </div>

                  <div className="grid grid-cols-2 gap-5 mb-6 relative z-10">
                     <div className="space-y-3">
                        <h4 className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest flex items-center gap-1.5 italic">
                           <FileText size={10} className="text-emerald-500" /> Documents
                        </h4>
                        <div className="space-y-1.5">
                           {['GST_Certificate', 'Registration', 'Bank_KYC', 'Partner_PAN'].map(doc => (
                              <div key={doc} className="p-2.5 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-xl flex items-center justify-between group hover:border-emerald-500/30 transition-all cursor-pointer">
                                 <span className="text-[9px] font-black text-[var(--text-primary)] uppercase tracking-tight italic leading-none">{doc}</span>
                                 <Download size={10} className="text-[var(--text-tertiary)]/50 group-hover:text-emerald-500 transition-all" />
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-3">
                        <h4 className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest flex items-center gap-1.5 italic">
                           <ShieldCheck size={10} className="text-emerald-500" /> Verification
                        </h4>
                        <div className="p-3 bg-emerald-600/5 border border-emerald-500/10 rounded-xl space-y-2">
                           {['GST Sync', 'ID Check', 'Zoning'].map((label, idx) => (
                              <div key={label} className="flex justify-between items-center text-[7.5px] font-black uppercase italic leading-none">
                                 <span className="text-[var(--text-tertiary)]">{label}</span>
                                 <span className="text-emerald-500">{idx === 1 ? '99.8% OK' : 'PASSED'}</span>
                              </div>
                           ))}
                        </div>
                        <div className="p-2.5 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-xl flex flex-col items-center">
                           <p className="text-[7px] font-black text-[var(--text-tertiary)] uppercase tracking-widest leading-none italic mb-1">Planned Capacity</p>
                           <p className="text-base font-black text-[var(--text-primary)] tracking-tighter italic leading-none">{selectedRecord.hubs} HUB NODES</p>
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-2.5 relative z-10 pt-5 border-t border-[var(--border-subtle)]">
                     {selectedRecord.status === 'pending' ? (
                        <>
                           <button 
                              onClick={() => { handleAction(selectedRecord.id, 'approved'); setIsModalOpen(false); }}
                              className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-950/20 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                           >
                              <Zap size={14} fill="currentColor" /> Authorize Franchise
                           </button>
                           <button 
                              onClick={() => { handleAction(selectedRecord.id, 'rejected'); setIsModalOpen(false); }}
                              className="px-5 py-3 bg-rose-600/10 text-rose-500 border border-rose-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600/20 transition-all active:scale-95 italic"
                           >
                              Decline
                           </button>
                        </>
                     ) : (
                        <button 
                           onClick={() => setIsModalOpen(false)}
                           className="w-full py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[8px] font-black uppercase tracking-widest text-[var(--text-primary)] hover:border-emerald-500/30 transition-all font-black"
                        >
                           Exit Payload Registry
                        </button>
                     )}
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}
