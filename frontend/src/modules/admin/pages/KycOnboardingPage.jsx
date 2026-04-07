import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCheck, 
  FileText, 
  Camera, 
  CheckCircle, 
  Clock, 
  Search, 
  Filter, 
  Eye,
  Download,
  AlertCircle,
  X,
  Zap,
  ShieldCheck,
  UserX,
  MoreVertical,
  Check,
  User,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import AdminStatCard from '../components/AdminStatCard';
import { adminDataStore } from '../store/adminDataStore';

export default function KycOnboardingPage() {
  const [kycRecords, setKycRecords] = useState(adminDataStore.kycRecords);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredRecords = activeTab === 'all' 
    ? kycRecords 
    : kycRecords.filter(r => r.role.toLowerCase() === activeTab.slice(0, -1));

  const handleAction = (id, newStatus) => {
    setKycRecords(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(prev => ({ ...prev, status: newStatus }));
    }
  };

  const openDetails = (record) => {
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
               <h1 className="text-2xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Identity <span className="text-emerald-500">Terminal</span>
               </h1>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-tertiary)] ml-4">
               KYC Verification • Network Integrity Hub
            </p>
         </div>
         
         <div className="flex items-center gap-3">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)] group-focus-within:text-emerald-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search Name/ID/PAN..." 
                 className="pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/30 outline-none transition-all w-64 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50"
               />
            </div>
            <button className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-tertiary)] hover:text-emerald-500 hover:bg-emerald-600/5 transition-all">
               <Filter size={18} />
            </button>
         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
         <AdminStatCard title="Total Requests" value={kycRecords.length + 4000} icon={UserCheck} color="emerald" subtitle="Network Applications" />
         <AdminStatCard title="Pending Review" value={kycRecords.filter(r => r.status === 'pending').length} icon={Clock} color="blue" subtitle="Awaiting Decision" />
         <AdminStatCard title="Approved Today" value={kycRecords.filter(r => r.status === 'approved').length} icon={CheckCircle} color="emerald" subtitle="Cleared Onboarding" />
         <AdminStatCard title="Risk Alert" value="3.1%" icon={AlertCircle} color="rose" subtitle="Identity Mismatches" />
      </div>

      {/* Tabbed Navigation */}
      <div className="flex border-b border-[var(--border-subtle)] gap-10">
         {['all', 'drivers', 'consumers', 'franchises'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-1 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${
                activeTab === tab ? 'text-emerald-500' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
              }`}
            >
               {tab}
               {activeTab === tab && (
                  <motion.div layoutId="kyc-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_8px_#10b981]" />
               )}
            </button>
         ))}
      </div>

      {/* KYC Registry */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2.5rem] overflow-hidden shadow-sm">
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full">
               <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/30">
                     {['Identity Identity', 'Persona', 'Liveness Check', 'Registry Date', 'Status', 'Terminal Actions'].map((header) => (
                        <th key={header} className="text-left py-5 px-8 text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-tertiary)] whitespace-nowrap">{header}</th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-[var(--border-subtle)]">
                  <AnimatePresence mode='popLayout'>
                    {filteredRecords.map((record) => (
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
                                <span className="text-xs font-black text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{record.name}</span>
                                <span className="text-[9px] font-bold text-[var(--text-tertiary)] tracking-widest">{record.id}</span>
                             </div>
                          </td>
                          <td className="py-6 px-8">
                             <span className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em]">{record.role}</span>
                          </td>
                          <td className="py-6 px-8">
                             <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-fit">
                                <Camera size={10} className="text-emerald-500" />
                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">LIVE_MATCH_OK</span>
                             </div>
                          </td>
                          <td className="py-6 px-8 text-[10px] font-black text-[var(--text-tertiary)] uppercase italic tracking-widest">{record.date}</td>
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
                                   className="p-2 bg-[var(--bg-tertiary)] hover:bg-emerald-600/10 border border-[var(--border-subtle)] hover:border-emerald-500/20 rounded-xl text-[var(--text-tertiary)] hover:text-emerald-500 transition-all"
                                   title="View Payload"
                                >
                                   <Eye size={14} />
                                </button>
                                {record.status === 'pending' && (
                                   <>
                                      <button 
                                         onClick={() => handleAction(record.id, 'approved')}
                                         className="p-2 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition-all group/btn"
                                         title="Approve Node"
                                      >
                                         <CheckCircle size={14} className="group-hover/btn:scale-110 transition-transform" />
                                      </button>
                                      <button 
                                         onClick={() => handleAction(record.id, 'rejected')}
                                         className="p-2 bg-rose-600 text-white rounded-xl shadow-lg shadow-rose-900/20 hover:bg-rose-700 transition-all group/btn"
                                         title="Reject Node"
                                      >
                                         <UserX size={14} className="group-hover/btn:scale-110 transition-transform" />
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

      {/* KYC Detail Modal */}
      <AnimatePresence>
         {isDetailModalOpen && selectedRecord && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="w-full max-w-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[3rem] p-12 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar"
               >
                  <div className="flex items-center justify-between mb-10 pb-6 border-b border-[var(--border-subtle)]">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-tertiary)] overflow-hidden">
                           <User size={32} />
                        </div>
                        <div className="space-y-1">
                           <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter italic leading-none">{selectedRecord.name}</h2>
                           <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{selectedRecord.role} ID: {selectedRecord.id}</span>
                              <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                 selectedRecord.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                 selectedRecord.status === 'pending' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                                 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                              }`}>
                                 {selectedRecord.status}
                              </div>
                           </div>
                        </div>
                     </div>
                     <button onClick={() => setIsDetailModalOpen(false)} className="p-3 hover:bg-rose-600/10 hover:text-rose-500 transition-all rounded-2xl border border-transparent hover:border-rose-500/20">
                        <X size={24} />
                     </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                     <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.3em] flex items-center gap-2">
                           <ShieldCheck size={12} className="text-emerald-500" /> Identity Documents
                        </h4>
                        <div className="space-y-3">
                           {['Aadhaar Card (Primary)', 'PAN Card (Secondary)', 'Driving License (Front/Back)'].map(doc => (
                              <div key={doc} className="p-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-2xl flex items-center justify-between group hover:border-emerald-500/30 transition-all cursor-pointer">
                                 <div className="flex items-center gap-3">
                                    <FileText size={16} className="text-[var(--text-tertiary)] group-hover:text-emerald-500" />
                                    <span className="text-[11px] font-bold text-[var(--text-primary)] tracking-wide">{doc}</span>
                                 </div>
                                 <ChevronRight size={14} className="text-[var(--text-tertiary)]" />
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.3em] flex items-center gap-2">
                           <Camera size={12} className="text-emerald-500" /> Liveness Evidence
                        </h4>
                        <div className="aspect-video bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-3xl relative overflow-hidden flex items-center justify-center group cursor-pointer">
                           <div className="absolute top-3 left-3 px-2 py-1 bg-emerald-600 rounded text-[8px] font-black text-white uppercase tracking-widest z-10 animate-pulse">LIVENESS_LIVE_STREAM</div>
                           <Camera size={32} className="text-[var(--text-tertiary)] group-hover:scale-110 transition-transform" />
                           <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-all" />
                        </div>
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                           <div className="flex justify-between items-center mb-1">
                              <span className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest text-[var(--text-tertiary)]">Face Match Confidence</span>
                              <span className="text-[10px] font-black text-emerald-500 tracking-tighter">98.4%</span>
                           </div>
                           <div className="w-full h-1 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 w-[98.4%]" />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-4 pt-10 border-t border-[var(--border-subtle)]">
                     {selectedRecord.status === 'pending' ? (
                        <>
                           <button 
                              onClick={() => { handleAction(selectedRecord.id, 'approved'); setIsDetailModalOpen(false); }}
                              className="flex-1 py-5 bg-emerald-600 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-emerald-950/40 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-3"
                           >
                              <Zap size={16} fill="white" /> Authorize Subscriber Node
                           </button>
                           <button 
                              onClick={() => { handleAction(selectedRecord.id, 'rejected'); setIsDetailModalOpen(false); }}
                              className="px-8 py-5 bg-rose-600/10 text-rose-500 border border-rose-500/20 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-rose-600/20 transition-all active:scale-95"
                           >
                              Decline Node
                           </button>
                        </>
                     ) : (
                        <button 
                           onClick={() => setIsDetailModalOpen(false)}
                           className="w-full py-5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-primary)] hover:border-emerald-500/30 transition-all"
                        >
                           Close Registry Payload
                        </button>
                     )}
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      {/* Bottom Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="p-8 bg-emerald-600/5 border border-emerald-500/10 rounded-[2rem] space-y-4 relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
               <Camera size={100} strokeWidth={1} />
            </div>
            <div className="flex items-center gap-4 relative z-10">
               <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Camera size={20} />
               </div>
               <h4 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest italic">Biometric Match Engine</h4>
            </div>
            <p className="text-[11px] text-[var(--text-tertiary)] font-bold leading-relaxed uppercase tracking-widest relative z-10 italic">
               Automated Liveness Detection & Face Matching protocol at <span className="text-emerald-500">98.4% Confidence</span>. 
               All biometric telemetry is encrypted via AES-256-GCM.
            </p>
         </div>

         <div className="p-8 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2rem] space-y-6 flex flex-col justify-between shadow-sm border-l-4 border-l-blue-600">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-inner">
                     <Download size={20} />
                  </div>
                  <h4 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest italic">Compliance Audit</h4>
               </div>
               <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-[0.2em] bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">April 2026 Registry</span>
            </div>
            <button className="w-full py-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-primary)] hover:text-emerald-500 hover:bg-emerald-600/5 transition-all flex items-center justify-center gap-3 group">
               Generate Protocol Audit PDF <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
         </div>
      </div>
    </div>
  );
}
