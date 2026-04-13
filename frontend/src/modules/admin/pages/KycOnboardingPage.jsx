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
  ChevronRight,
  Activity
} from 'lucide-react';
import AdminStatCard from '../components/AdminStatCard';
import { adminDataStore } from '../store/adminDataStore';

export default function KycOnboardingPage() {
  const [kycRecords, setKycRecords] = useState(adminDataStore.kycRecords);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecords = kycRecords.filter(r => {
    const matchesTab = activeTab === 'all' || r.role.toLowerCase() === activeTab.slice(0, -1);
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         r.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

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
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="space-y-0.5">
            <div className="flex items-center gap-2">
               <div className="w-1 h-5 bg-emerald-600 rounded-full" />
               <h1 className="text-xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Identity <span className="text-emerald-500">Terminal</span>
               </h1>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] ml-3">
               KYC Verification & Network Integrity
            </p>
         </div>
         
         <div className="flex items-center gap-2">
            <div className="relative group">
               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-tertiary)] group-focus-within:text-emerald-500 transition-colors" />
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search PAN/ID..." 
                 className="pl-8 pr-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[9px] font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all w-32 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50"
               />
            </div>
            <button className="p-1.5 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-lg text-[var(--text-tertiary)] hover:text-emerald-500 transition-all">
               <Filter size={14} />
            </button>
         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <AdminStatCard title="Requests" value={kycRecords.length + 4000} icon={UserCheck} color="emerald" subtitle="Network Applications" />
         <AdminStatCard title="Pending" value={kycRecords.filter(r => r.status === 'pending').length} icon={Clock} color="blue" subtitle="Awaiting Decision" />
         <AdminStatCard title="Approved" value={kycRecords.filter(r => r.status === 'approved').length} icon={CheckCircle} color="emerald" subtitle="Cleared Node" />
         <AdminStatCard title="Risk Alert" value="3.1%" icon={AlertCircle} color="rose" subtitle="Identity Delta" />
      </div>

      {/* Tabbed Navigation */}
      <div className="flex border-b border-[var(--border-subtle)] gap-6">
         {['all', 'drivers', 'consumers', 'franchises'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-1 text-[9px] font-black uppercase tracking-widest transition-all relative italic ${
                activeTab === tab ? 'text-emerald-500' : 'text-[var(--text-tertiary)] hover:text-emerald-500'
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
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full">
               <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/20">
                     {['Identity Identity', 'Persona', 'Liveness Check', 'Registry Date', 'Status', 'Actions'].map((header) => (
                        <th key={header} className="text-left py-2.5 px-6 text-[8px] font-black uppercase tracking-widest text-[var(--text-tertiary)] whitespace-nowrap">{header}</th>
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
                         className="group/row hover:bg-[var(--bg-tertiary)]/20 transition-colors cursor-pointer text-[10px]"
                         onClick={() => openDetails(record)}
                       >
                          <td className="py-2.5 px-6 whitespace-nowrap">
                             <div className="flex flex-col">
                                <span className="font-black text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors uppercase tracking-tight italic leading-none">{record.name}</span>
                                <span className="text-[7px] font-bold text-[var(--text-tertiary)]/50 tracking-widest uppercase mt-1 leading-none italic">{record.id}</span>
                             </div>
                          </td>
                          <td className="py-2.5 px-6 font-black text-[var(--text-tertiary)] uppercase tracking-widest leading-none italic">{record.role}</td>
                          <td className="py-2.5 px-6">
                             <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-fit">
                                <Camera size={8} className="text-emerald-500" />
                                <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">LIVE_MATCH_OK</span>
                             </div>
                          </td>
                          <td className="py-2.5 px-6 text-[9px] font-black text-[var(--text-tertiary)] uppercase italic tracking-widest leading-none whitespace-nowrap">{record.date}</td>
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
                                   className="p-1.5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-tertiary)] hover:text-emerald-500 hover:border-emerald-500/30 transition-all"
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

      {/* KYC Detail Modal */}
      <AnimatePresence>
         {isDetailModalOpen && selectedRecord && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="w-full max-w-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-2xl relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                     <UserCheck size={100} />
                  </div>

                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-subtle)] relative z-10">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-tertiary)] overflow-hidden">
                           <User size={20} />
                        </div>
                        <div className="space-y-0.5">
                           <h2 className="text-base font-black text-[var(--text-primary)] uppercase tracking-tighter italic leading-none">{selectedRecord.name}</h2>
                           <div className="flex items-center gap-2 mt-1">
                              <span className="text-[7.5px] font-black text-emerald-500 uppercase tracking-widest leading-none">ID: {selectedRecord.id}</span>
                              <div className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest border border-[var(--border-subtle)] leading-none`}>
                                 {selectedRecord.role}
                              </div>
                           </div>
                        </div>
                     </div>
                     <button onClick={() => setIsDetailModalOpen(false)} className="p-1.5 hover:bg-rose-600/10 hover:text-rose-500 transition-all rounded-lg">
                        <X size={18} />
                     </button>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6 relative z-10">
                     <div className="space-y-4">
                        <h4 className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest flex items-center gap-1.5 italic leading-none">
                           <ShieldCheck size={10} className="text-emerald-500" /> Identity Documents
                        </h4>
                        <div className="space-y-1.5">
                           {['Aadhaar Card', 'PAN Card', 'Driving License'].map(doc => (
                              <div key={doc} className="p-2.5 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-xl flex items-center justify-between group hover:border-emerald-500/30 transition-all cursor-pointer">
                                 <span className="text-[9px] font-black text-[var(--text-primary)] uppercase tracking-widest italic leading-none">{doc}</span>
                                 <Download size={10} className="text-[var(--text-tertiary)]/50 group-hover:text-emerald-500 transition-all" />
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h4 className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest flex items-center gap-1.5 italic leading-none">
                           <Camera size={10} className="text-emerald-500" /> Liveness Evidence
                        </h4>
                        <div className="aspect-video bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl relative overflow-hidden flex items-center justify-center group cursor-pointer">
                           <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-emerald-600 rounded text-[6px] font-black text-white uppercase tracking-widest z-10 animate-pulse">LIVENESS_OK</div>
                           <Camera size={20} className="text-[var(--text-tertiary)] group-hover:scale-110 transition-transform opacity-30" />
                        </div>
                        <div className="p-2.5 bg-emerald-600/5 border border-emerald-500/10 rounded-xl space-y-1.5">
                           <div className="flex justify-between items-center text-[7px] font-black uppercase italic leading-none">
                              <span className="text-[var(--text-tertiary)]">Face Match Confidence</span>
                              <span className="text-emerald-500">98.4%</span>
                           </div>
                           <div className="w-full h-0.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 w-[98.4%]" />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-2.5 pt-6 border-t border-[var(--border-subtle)] relative z-10">
                     {selectedRecord.status === 'pending' ? (
                        <>
                           <button 
                              onClick={() => { handleAction(selectedRecord.id, 'approved'); setIsDetailModalOpen(false); }}
                              className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-950/20 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                           >
                              <Zap size={14} fill="currentColor" /> Authorize Subscriber
                           </button>
                           <button 
                              onClick={() => { handleAction(selectedRecord.id, 'rejected'); setIsDetailModalOpen(false); }}
                              className="px-5 py-3 bg-rose-600/10 text-rose-500 border border-rose-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600/20 transition-all active:scale-95 italic"
                           >
                              Decline Node
                           </button>
                        </>
                     ) : (
                        <button 
                           onClick={() => setIsDetailModalOpen(false)}
                           className="w-full py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[8px] font-black uppercase tracking-widest text-[var(--text-primary)] hover:border-emerald-500/30 transition-all font-black italic"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="p-4 bg-emerald-600/5 border border-emerald-500/10 rounded-2xl space-y-2 relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 p-4 opacity-[0.05] group-hover:scale-110 transition-transform pointer-events-none">
               <Camera size={60} />
            </div>
            <div className="flex items-center gap-2 relative z-10">
               <div className="w-8 h-8 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Activity size={16} />
               </div>
               <h4 className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest italic">Biometric Match Engine</h4>
            </div>
            <p className="text-[8.5px] text-[var(--text-tertiary)] font-bold leading-relaxed uppercase tracking-widest relative z-10 italic">
               Automated detection protocol at <span className="text-emerald-500 font-black">98.4% Confidence</span>. 
               Telemetry encrypted via AES-256.
            </p>
         </div>

         <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl space-y-4 flex flex-col justify-between shadow-sm border-l-4 border-l-blue-600">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-inner">
                     <Download size={16} />
                  </div>
                  <h4 className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest italic leading-none">Compliance Audit</h4>
               </div>
               <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10 italic leading-none">April 2026 Registry</span>
            </div>
            <button className="w-full py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[8px] font-black uppercase tracking-widest text-[var(--text-primary)] hover:text-emerald-500 transition-all flex items-center justify-center gap-2 group italic">
               Generate Audit PDF <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
         </div>
      </div>
    </div>
  );
}
