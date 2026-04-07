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
  UserX
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
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
               <h1 className="text-2xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Franchise <span className="text-emerald-500">Boarding</span>
               </h1>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-tertiary)] ml-4">
               Partner Verification • Infrastructure Registry
            </p>
         </div>
         
         <div className="flex items-center gap-3">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)] group-focus-within:text-emerald-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search Partner/GSTIN..." 
                 className="pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/30 outline-none transition-all w-64 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50"
               />
            </div>
         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
         <AdminStatCard title="Partner Queued" value={records.length} icon={Building2} color="emerald" subtitle="Awaiting Decision" />
         <AdminStatCard title="GST Verified" value="100%" icon={ShieldCheck} color="blue" subtitle="Govt API Sync" />
         <AdminStatCard title="Zone Coverage" value="14 Cities" icon={MapPin} color="emerald" subtitle="Network Expansion" />
         <AdminStatCard title="Doc Integrity" value="99.2%" icon={CheckCircle} color="emerald" subtitle="Validated Uploads" />
      </div>

      {/* Registry */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2.5rem] overflow-hidden shadow-sm">
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full">
               <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/30">
                     {['Partner Identity', 'Entity Type', 'Zone Node', 'Submission', 'Status', 'Actions'].map((header) => (
                        <th key={header} className="text-left py-5 px-8 text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-tertiary)] whitespace-nowrap">{header}</th>
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
                         className="group/row hover:bg-[var(--bg-tertiary)]/50 transition-colors cursor-pointer"
                         onClick={() => openDetails(record)}
                       >
                          <td className="py-6 px-8 whitespace-nowrap">
                             <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-black text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors uppercase tracking-tight italic">{record.name}</span>
                                <span className="text-[9px] font-bold text-[var(--text-tertiary)] tracking-widest">{record.id}</span>
                             </div>
                          </td>
                          <td className="py-6 px-8 text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">{record.type}</td>
                          <td className="py-6 px-8 flex items-center gap-2">
                             <MapPin size={12} className="text-emerald-500" />
                             <span className="text-[10px] font-black text-[var(--text-primary)] uppercase italic tracking-widest">{record.city}</span>
                          </td>
                          <td className="py-6 px-8 text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">{record.date}</td>
                          <td className="py-6 px-8">
                             <div className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                                record.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                                record.status === 'pending' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 
                                'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                             }`}>
                                {record.status}
                             </div>
                          </td>
                          <td className="py-6 px-8">
                             <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                <button 
                                   onClick={() => openDetails(record)}
                                   className="p-2 bg-[var(--bg-tertiary)] hover:bg-emerald-600/10 border border-[var(--border-subtle)] hover:border-emerald-500/20 rounded-xl text-[var(--text-tertiary)] hover:text-emerald-500 transition-all font-black"
                                >
                                   <Eye size={14} />
                                </button>
                                {record.status === 'pending' && (
                                   <>
                                      <button 
                                         onClick={() => handleAction(record.id, 'approved')}
                                         className="p-2 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition-all group/btn"
                                      >
                                         <CheckCircle size={14} className="group-hover/btn:scale-110 transition-transform" />
                                      </button>
                                   </>
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
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="w-full max-w-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                     <Building2 size={120} />
                  </div>

                  <div className="flex items-center justify-between mb-10 pb-6 border-b border-[var(--border-subtle)] relative z-10">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
                           <Building2 size={32} />
                        </div>
                        <div className="space-y-1">
                           <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter italic leading-none">{selectedRecord.name}</h2>
                           <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">PARTNER_NODE: {selectedRecord.id}</p>
                        </div>
                     </div>
                     <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-rose-600/10 hover:text-rose-500 transition-all rounded-2xl">
                        <X size={24} />
                     </button>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-12 relative z-10">
                     <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.3em] flex items-center gap-2">
                           <FileText size={12} className="text-emerald-500" /> Business Docs
                        </h4>
                        <div className="space-y-3">
                           {['GSTIN Certificate', 'Entity Registration', 'Bank Passbook / Cheque', 'Partner PAN'].map(doc => (
                              <div key={doc} className="p-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-2xl flex items-center justify-between group hover:border-emerald-500/30 transition-all cursor-pointer">
                                 <span className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-tight">{doc}</span>
                                 <ChevronRight size={14} className="text-[var(--text-tertiary)] group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.3em] flex items-center gap-2">
                           <ShieldCheck size={12} className="text-emerald-500" /> Validation Engine
                        </h4>
                        <div className="p-6 bg-emerald-600/5 border border-emerald-500/10 rounded-3xl space-y-4">
                           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                              <span className="text-[var(--text-tertiary)]">GST Integration</span>
                              <span className="text-emerald-500">ACTIVE_SYNC</span>
                           </div>
                           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                              <span className="text-[var(--text-tertiary)]">Identity Match</span>
                              <span className="text-emerald-500">99.8% CERTAINTY</span>
                           </div>
                           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                              <span className="text-[var(--text-tertiary)]">Hub Geozoning</span>
                              <span className="text-emerald-500">ELIBILITY_OK</span>
                           </div>
                        </div>
                        <div className="p-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-2xl space-y-1">
                           <p className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Initial Capacity</p>
                           <p className="text-xl font-black text-[var(--text-primary)] tracking-tighter italic">{selectedRecord.hubs} Regional Hubs</p>
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-4 relative z-10 pt-8 border-t border-[var(--border-subtle)]">
                     {selectedRecord.status === 'pending' ? (
                        <>
                           <button 
                              onClick={() => { handleAction(selectedRecord.id, 'approved'); setIsDetailModalOpen(false); }}
                              className="flex-1 py-6 bg-emerald-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-emerald-950/40 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-4 group"
                           >
                              <Zap size={20} fill="white" className="group-hover:animate-bounce" /> Authorize Franchise Node
                           </button>
                           <button 
                              onClick={() => { handleAction(selectedRecord.id, 'rejected'); setIsDetailModalOpen(false); }}
                              className="px-10 py-6 bg-rose-600/10 text-rose-500 border border-rose-500/20 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] hover:bg-rose-600/20 transition-all active:scale-95"
                           >
                              Decline
                           </button>
                        </>
                     ) : (
                        <button 
                           onClick={() => setIsModalOpen(false)}
                           className="w-full py-5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-primary)] hover:border-emerald-500/30 transition-all"
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
