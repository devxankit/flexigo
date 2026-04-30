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
import OpsFilter from '../components/OpsFilter';
import { useAdminDataStore } from '../store/adminDataStore';

export default function KycOnboardingPage() {
  const { kycRecords, fetchKycRecords, updateKycStatus } = useAdminDataStore();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({ range: 'Last 7 Days' });

  React.useEffect(() => {
    fetchKycRecords();
  }, []);

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    console.log('KYC Onboarding Sync:', newFilters);
  };

  const filteredRecords = kycRecords.filter(r => {
    const matchesTab = activeTab === 'all' || r.role.toLowerCase() === activeTab.slice(0, -1);
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         r.id.toString().toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleAction = async (id, newStatus) => {
    await updateKycStatus(id, newStatus);
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
            <OpsFilter onFilterChange={handleFilterChange} />
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
         <AdminStatCard title="Requests" value={kycRecords.length} icon={UserCheck} color="emerald" subtitle="Network Applications" />
         <AdminStatCard title="Pending" value={kycRecords.filter(r => r.status === 'pending').length} icon={Clock} color="blue" subtitle="Awaiting Decision" />
         <AdminStatCard title="Approved" value={kycRecords.filter(r => r.status === 'approved').length} icon={CheckCircle} color="emerald" subtitle="Cleared Node" />
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
                     <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/5">
                     {['Identity Identity', 'Persona', 'Liveness Check', 'Registry Date', 'Status', 'Actions'].map((header) => (
                        <th key={header} className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-secondary)] whitespace-nowrap">{header}</th>
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
                          key={record._id || record.id} 
                          className="group/row hover:bg-[var(--bg-tertiary)]/20 transition-colors cursor-pointer"
                          onClick={() => openDetails(record)}
                       >
                          <td className="py-2 px-4 whitespace-nowrap">
                             <div className="flex flex-col">
                                <span className="font-medium text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors">{record.name}</span>
                             </div>
                          </td>
                          <td className="py-2 px-4 font-medium text-[var(--text-tertiary)]">{record.role}</td>
                          <td className="py-2 px-4">
                             <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-fit">
                                <Camera size={8} className="text-emerald-500" />
                                <span className="font-medium text-emerald-500">LIVE_MATCH_OK</span>
                             </div>
                          </td>
                          <td className="py-2 px-4  font-medium text-[var(--text-tertiary)] whitespace-nowrap">{new Date(record.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</td>
                          <td className="py-2 px-4">
                             <div className={`inline-flex px-1.5 py-0.5 rounded  font-medium   border  ${
                                record.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' : 
                                record.status === 'pending' ? 'bg-blue-500/10 text-blue-500 border-blue-500/10' : 
                                'bg-rose-500/10 text-rose-500 border-rose-500/10'
                             }`}>
                                {record.status}
                             </div>
                          </td>
                          <td className="py-2 px-4">
                             <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                <button 
                                   onClick={() => openDetails(record)}
                                   className="p-1.5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-tertiary)] hover:text-emerald-500 hover:border-emerald-500/30 transition-all"
                                >
                                   <Eye size={12} />
                                </button>
                                 {/* Removed Quick Approve button as per request */}
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
                              <div className={`px-1.5 py-0.5 rounded text-xs font-medium border border-[var(--border-subtle)]`}>
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
                           {[
                              { label: 'Aadhaar Card', key: 'aadhaarFront', verified: selectedRecord.details?.ekycVerified },
                              { label: 'PAN Card', key: 'panCard' },
                              { label: 'Driving License', key: 'drivingLicense' }
                           ].map(doc => {
                              const hasDoc = selectedRecord.details?.[doc.key];
                              return (
                                 <div 
                                    key={doc.label} 
                                    onClick={() => hasDoc && window.open(hasDoc, '_blank')}
                                    className={`p-2.5 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-xl flex items-center justify-between group transition-all ${hasDoc ? 'cursor-pointer hover:border-emerald-500/30' : 'opacity-50 cursor-not-allowed'}`}
                                 >
                                    <div className="flex items-center gap-2">
                                       <span className="text-[9px] font-black text-[var(--text-primary)] uppercase tracking-widest italic leading-none">{doc.label}</span>
                                       {doc.verified && <Check size={10} className="text-emerald-500" />}
                                    </div>
                                    {hasDoc ? (
                                       <Download size={10} className="text-[var(--text-tertiary)]/50 group-hover:text-emerald-500 transition-all" />
                                    ) : (
                                       <AlertCircle size={10} className="text-rose-500/50" />
                                    )}
                                 </div>
                              );
                           })}
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h4 className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest flex items-center gap-1.5 italic leading-none">
                           <Camera size={10} className="text-emerald-500" /> Liveness Evidence
                        </h4>
                        <div 
                           onClick={() => selectedRecord.details?.selfie && window.open(selectedRecord.details.selfie, '_blank')}
                           className="aspect-video bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl relative overflow-hidden flex items-center justify-center group cursor-pointer"
                        >
                           <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-emerald-600 rounded text-[6px] font-black text-white uppercase tracking-widest z-10 animate-pulse">LIVENESS_OK</div>
                           {selectedRecord.details?.selfie ? (
                              <img src={selectedRecord.details.selfie} alt="Liveness" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                           ) : (
                              <Camera size={20} className="text-[var(--text-tertiary)] group-hover:scale-110 transition-transform opacity-30" />
                           )}
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Download size={20} className="text-white" />
                           </div>
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
                              onClick={() => { handleAction(selectedRecord._id || selectedRecord.id, 'approved'); setIsDetailModalOpen(false); }}
                              className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-950/20 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                           >
                              <Zap size={14} fill="currentColor" /> Authorize Subscriber
                           </button>
                           <button 
                              onClick={() => { handleAction(selectedRecord._id || selectedRecord.id, 'rejected'); setIsDetailModalOpen(false); }}
                              className="px-5 py-3 bg-rose-600/10 text-rose-500 border border-rose-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600/20 transition-all active:scale-95 italic"
                           >
                              Decline
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


    </div>
  );
}
