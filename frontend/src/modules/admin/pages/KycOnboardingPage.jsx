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
  Activity,
  Save
} from 'lucide-react';
import AdminStatCard from '../components/AdminStatCard';
import OpsFilter from '../components/OpsFilter';
import { useAdminDataStore } from '../store/adminDataStore';

export default function KycOnboardingPage() {
  const { kycRecords, fetchKycRecords, updateKycStatus, assignVehicle, toggleBlockKycRecord } = useAdminDataStore();
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('kyc_active_tab') || 'all');
  const [selectedRecord, setSelectedRecord] = useState(() => {
    const saved = localStorage.getItem('kyc_selected_record');
    return saved ? JSON.parse(saved) : null;
  });
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(() => localStorage.getItem('kyc_modal_open') === 'true');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignmentData, setAssignmentData] = useState({ vehiclePlate: '', riderPhone: '', riderName: '' });
  const [searchQuery, setSearchQuery] = useState(() => localStorage.getItem('kyc_search_query') || '');
  const [activeFilters, setActiveFilters] = useState({ range: 'Last 7 Days' });

  React.useEffect(() => {
    localStorage.setItem('kyc_active_tab', activeTab);
  }, [activeTab]);

  React.useEffect(() => {
    localStorage.setItem('kyc_search_query', searchQuery);
  }, [searchQuery]);

  React.useEffect(() => {
    localStorage.setItem('kyc_modal_open', isDetailModalOpen);
    if (selectedRecord) localStorage.setItem('kyc_selected_record', JSON.stringify(selectedRecord));
    else localStorage.removeItem('kyc_selected_record');
  }, [isDetailModalOpen, selectedRecord]);

  React.useEffect(() => {
    fetchKycRecords();
  }, []);

  React.useEffect(() => {
    if (selectedRecord && kycRecords.length > 0) {
      const freshRecord = kycRecords.find(r => {
        const rId = r.id || r._id;
        const sId = selectedRecord.id || selectedRecord._id;
        return rId && sId && rId.toString() === sId.toString();
      });
      if (freshRecord) {
        setSelectedRecord(freshRecord);
      }
    }
  }, [kycRecords]);

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    fetchKycRecords(newFilters);
    console.log('KYC Onboarding Sync:', newFilters);
  };

  const filteredRecords = kycRecords.filter(r => {
    let matchesTab = activeTab === 'all';
    if (activeTab === 'drivers') {
      matchesTab = r.role.toLowerCase() === 'rider' || r.role.toLowerCase() === 'driver';
    } else if (activeTab === 'franchises') {
      matchesTab = r.role.toLowerCase() === 'franchise';
    }
    
    const matchesSearch = (r.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (r._id || r.id || '').toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (r.vehiclePlate || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleAction = async (id, newStatus) => {
    const payload = {
      status: newStatus,
      referenceName: selectedRecord?.details?.referenceName,
      referenceNumber: selectedRecord?.details?.referenceNumber,
      referenceName2: selectedRecord?.details?.referenceName2,
      referenceNumber2: selectedRecord?.details?.referenceNumber2
    };
    await updateKycStatus(id, payload);
    if (selectedRecord && (selectedRecord.id === id || selectedRecord._id === id)) {
      setSelectedRecord(prev => ({ 
        ...prev, 
        status: newStatus,
        details: {
          ...prev.details,
          referenceName: payload.referenceName,
          referenceNumber: payload.referenceNumber,
          referenceName2: payload.referenceName2,
          referenceNumber2: payload.referenceNumber2
        }
      }));
    }
  };

  const openDetails = (record) => {
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
  };

  const handleExport = () => {
    const headers = ['Record ID', 'Identity Identity', 'Phone', 'Persona', 'Liveness Check', 'Vehicle Plate', 'Registry Date', 'Status'];
    
    const rows = filteredRecords.map(r => [
      r.id || r._id || '',
      r.name || '',
      r.phone || '',
      r.role || '',
      r.details?.ekycVerified ? 'LIVE_MATCH_OK' : 'UNVERIFIED',
      r.vehiclePlate || 'N/A',
      r.date ? new Date(r.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '',
      r.status || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `kyc_onboarding_export_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                 placeholder="Search Name/Vehicle No/ID..." 
                 className="pl-8 pr-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[9px] font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all w-32 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50"
               />
            </div>
            <button className="p-1.5 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-lg text-[var(--text-tertiary)] hover:text-emerald-500 transition-all">
               <Filter size={14} />
            </button>
            <button 
               onClick={handleExport}
               className="px-3 py-1.5 bg-[#10b981] hover:bg-[#0f9f6e] text-white font-bold rounded-lg flex items-center gap-1.5 text-[9px] uppercase tracking-widest active:scale-95 transition-all"
            >
               <Download size={12} className="stroke-[3px]" /> EXPORT CSV
            </button>
         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <AdminStatCard title="Requests" value={filteredRecords.length} icon={UserCheck} color="emerald" subtitle={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Applications`} />
         <AdminStatCard title="Pending" value={filteredRecords.filter(r => r.status === 'pending').length} icon={Clock} color="blue" subtitle="Awaiting Decision" />
         <AdminStatCard title="Approved" value={filteredRecords.filter(r => r.status === 'approved').length} icon={CheckCircle} color="emerald" subtitle="Cleared Node" />
      </div>

      {/* Tabbed Navigation */}
      <div className="flex border-b border-[var(--border-subtle)] gap-6">
         {['all', 'drivers', 'franchises'].map((tab) => (
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
                                <span className={`font-medium transition-colors ${
                                   record.isBlocked 
                                      ? 'text-rose-500 line-through decoration-rose-500/50' 
                                      : 'text-[var(--text-primary)] group-hover:text-emerald-500'
                                }`}>
                                   {record.name}
                                   {record.isBlocked && (
                                      <span className="ml-2 px-1.5 py-0.5 text-[8px] bg-rose-500/15 border border-rose-500/20 text-rose-500 rounded font-black uppercase tracking-wider select-none leading-none">
                                         BLOCKED
                                      </span>
                                   )}
                                </span>
                             </div>
                          </td>
                          <td className="py-2 px-4 font-medium text-[var(--text-tertiary)]">{record.role}</td>
                          <td className="py-2 px-4">
                             {(record.status === 'approved' || record.details?.ekycVerified) && !record.vehicleId ? (
                               <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-fit">
                                  <Camera size={8} className="text-emerald-500" />
                                  <span className="font-medium text-emerald-500">LIVE_MATCH_OK</span>
                               </div>
                             ) : null}
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
                                <button 
                                    onClick={async () => {
                                       const res = await toggleBlockKycRecord(record._id || record.id);
                                       if (res?.success) {
                                          // Zustand store handles updating state automatically
                                       } else {
                                          alert(res?.message || "Failed to toggle block status");
                                       }
                                    }}
                                    className={`p-1.5 border rounded-lg transition-all ml-1.5 ${
                                       record.isBlocked 
                                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white' 
                                          : 'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white'
                                    }`}
                                    title={record.isBlocked ? "Unblock User" : "Block User"}
                                 >
                                    {record.isBlocked ? <UserCheck size={12} /> : <UserX size={12} />}
                                 </button>
                                {record.status === 'approved' && record.role?.toLowerCase() === 'rider' && !record.vehicleId && (
                                    <button 
                                      onClick={() => {
                                        setAssignmentData({
                                          vehiclePlate: '',
                                          riderPhone: record.phone || '',
                                          riderName: record.name || ''
                                        });
                                        setIsAssignModalOpen(true);
                                      }}
                                      className="p-1.5 bg-emerald-600/10 border border-emerald-500/20 rounded-lg text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all ml-1.5"
                                      title="Assign Vehicle"
                                    >
                                       <Zap size={12} fill="currentColor" />
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
                              { label: 'Driving License', key: 'drivingLicense' },
                              { label: 'Certificate', key: 'certificate', isUploadable: true }
                           ].map(doc => {
                              const hasDoc = selectedRecord.details?.[doc.key];
                              return (
                                 <div 
                                    key={doc.label} 
                                    className={`p-2.5 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-xl flex items-center justify-between group transition-all ${hasDoc ? 'cursor-pointer hover:border-emerald-500/30' : (doc.isUploadable ? 'cursor-pointer border-dashed border-emerald-500/30 hover:bg-emerald-500/5' : 'opacity-50 cursor-not-allowed')}`}
                                    onClick={() => {
                                       if (hasDoc) {
                                         window.open(hasDoc, '_blank');
                                       } else if (doc.isUploadable) {
                                         document.getElementById('certificate-upload').click();
                                       }
                                    }}
                                 >
                                    <div className="flex items-center gap-2">
                                       <span className="text-[9px] font-black text-[var(--text-primary)] uppercase tracking-widest italic leading-none">{doc.label}</span>
                                       {doc.verified && <Check size={10} className="text-emerald-500" />}
                                    </div>
                                    <div className="flex items-center gap-2">
                                       {hasDoc ? (
                                          <Download size={10} className="text-[var(--text-tertiary)]/50 group-hover:text-emerald-500 transition-all" />
                                       ) : doc.isUploadable ? (
                                          <Camera size={10} className="text-emerald-500 animate-pulse" />
                                       ) : (
                                          <AlertCircle size={10} className="text-rose-500/50" />
                                       )}
                                    </div>
                                 </div>
                              );
                           })}
                           <input 
                              type="file" 
                              id="certificate-upload" 
                              className="hidden" 
                              accept="image/*"
                              onChange={async (e) => {
                                 const file = e.target.files[0];
                                 if (!file) return;

                                 const id = selectedRecord.id || selectedRecord._id;
                                 if (!id) {
                                    alert("Error: Record ID not found");
                                    return;
                                 }

                                 const reader = new FileReader();
                                 reader.onloadend = async () => {
                                    try {
                                       const res = await useAdminDataStore.getState().uploadKycCertificate(id, reader.result);
                                       if (res?.success) {
                                          setSelectedRecord(prev => ({
                                             ...prev,
                                             details: { ...prev.details, certificate: res.certificateUrl }
                                          }));
                                          alert("Certificate Uploaded Successfully!");
                                       } else {
                                          alert(res?.message || "Upload failed. Please try again.");
                                       }
                                    } catch (err) {
                                       alert("Upload Error: " + err.message);
                                    } finally {
                                       e.target.value = ''; // Reset input
                                    }
                                 };
                                 reader.readAsDataURL(file);
                              }}
                           />
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

                  {/* Reference Details Section */}
                  <div className="pt-4 border-t border-[var(--border-subtle)] space-y-4">
                     <h4 className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest flex items-center gap-1.5 italic leading-none">
                        <User size={10} className="text-emerald-500" /> Reference Details
                     </h4>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                           <label className="text-[7px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Reference Name</label>
                           <input 
                              value={selectedRecord.details?.referenceName || ''}
                              onChange={(e) => {
                                 setSelectedRecord(prev => ({
                                    ...prev,
                                    details: { ...prev.details, referenceName: e.target.value }
                                 }));
                              }}
                              placeholder="ENTER NAME"
                              className="w-full px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg text-[9px] font-bold tracking-wider focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-[var(--text-tertiary)]/30"
                           />
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-[7px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Reference Number</label>
                           <div className="relative">
                              <input 
                                 value={selectedRecord.details?.referenceNumber || ''}
                                 onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    if (val.length <= 10) {
                                       setSelectedRecord(prev => ({
                                          ...prev,
                                          details: { ...prev.details, referenceNumber: val }
                                       }));
                                    }
                                 }}
                                 placeholder="10-DIGIT MOBILE"
                                 className="w-full px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg text-[9px] font-bold uppercase tracking-wider focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-[var(--text-tertiary)]/30"
                              />
                              {selectedRecord.details?.referenceNumber?.length === 10 && (
                                 <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                    <ShieldCheck size={12} className="text-emerald-500" />
                                  </div>
                              )}
                           </div>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                           <label className="text-[7px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Reference Name 2</label>
                           <input 
                              value={selectedRecord.details?.referenceName2 || ''}
                              onChange={(e) => {
                                 setSelectedRecord(prev => ({
                                    ...prev,
                                    details: { ...prev.details, referenceName2: e.target.value }
                                 }));
                              }}
                              placeholder="ENTER NAME"
                              className="w-full px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg text-[9px] font-bold tracking-wider focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-[var(--text-tertiary)]/30"
                           />
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-[7px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Reference Number 2</label>
                           <div className="relative">
                              <input 
                                 value={selectedRecord.details?.referenceNumber2 || ''}
                                 onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    if (val.length <= 10) {
                                       setSelectedRecord(prev => ({
                                          ...prev,
                                          details: { ...prev.details, referenceNumber2: val }
                                       }));
                                    }
                                 }}
                                 placeholder="10-DIGIT MOBILE"
                                 className="w-full px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg text-[9px] font-bold uppercase tracking-wider focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-[var(--text-tertiary)]/30"
                              />
                              {selectedRecord.details?.referenceNumber2?.length === 10 && (
                                 <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                    <ShieldCheck size={12} className="text-emerald-500" />
                                  </div>
                              )}
                           </div>
                        </div>
                     </div>
                     <button 
                        onClick={async () => {
                           const id = selectedRecord.id || selectedRecord._id;
                           const res = await useAdminDataStore.getState().updateKycReferences(id, {
                              referenceName: selectedRecord.details?.referenceName,
                              referenceNumber: selectedRecord.details?.referenceNumber,
                              referenceName2: selectedRecord.details?.referenceName2,
                              referenceNumber2: selectedRecord.details?.referenceNumber2
                           });
                           if (res?.success) {
                              if (res.kycDetails) {
                                 setSelectedRecord(prev => ({ ...prev, details: res.kycDetails }));
                              }
                              alert("References Saved!");
                           }
                           else alert(res?.message || "Failed to save references");
                        }}
                        className="w-full py-2 bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-emerald-600/20 transition-all active:scale-95 flex items-center justify-center gap-1.5"
                     >
                        <Save size={12} /> SAVE
                     </button>
                  </div>

                  <div className="flex gap-2.5 pt-6 border-t border-[var(--border-subtle)] relative z-10">
                     <button 
                        onClick={() => { handleAction(selectedRecord._id || selectedRecord.id, 'approved'); setIsDetailModalOpen(false); }}
                        className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-950/20 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                     >
                        <Zap size={14} fill="currentColor" /> {selectedRecord.status === 'approved' ? 'Already Authorized' : 'Authorize Subscriber'}
                     </button>
                     <button 
                        onClick={() => { handleAction(selectedRecord._id || selectedRecord.id, 'rejected'); setIsDetailModalOpen(false); }}
                        className="px-5 py-3 bg-rose-600/10 text-rose-500 border border-rose-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600/20 transition-all active:scale-95 italic"
                     >
                        {selectedRecord.status === 'rejected' ? 'Already Declined' : 'Decline'}
                     </button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      {/* Vehicle Assignment Modal */}
      <AnimatePresence>
         {isAssignModalOpen && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-md bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-8 shadow-2xl space-y-6"
               >
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <h2 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tighter italic leading-none">Vehicle <span className="text-emerald-500">Assignment</span></h2>
                        <p className="text-[8px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">PROVISION_DISPATCH_PROTOCOL</p>
                     </div>
                     <button onClick={() => setIsAssignModalOpen(false)} className="p-1.5 hover:bg-rose-600/10 hover:text-rose-500 transition-all rounded-lg">
                        <X size={16} />
                     </button>
                  </div>

                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const res = await assignVehicle({
                        vehiclePlate: assignmentData.vehiclePlate,
                        riderPhone: assignmentData.riderPhone,
                        type: 'Manual',
                        hubName: 'KYC Hub'
                      });
                      if (res.success) {
                        setIsAssignModalOpen(false);
                        alert("Vehicle Assigned Successfully!");
                      } else {
                        alert(res.message || "Assignment Failed");
                      }
                    }} 
                    className="space-y-6"
                  >
                     <div className="space-y-4">
                        <div className="space-y-1.5">
                           <label className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Rider Name</label>
                           <input 
                              value={assignmentData.riderName}
                              onChange={(e) => setAssignmentData({...assignmentData, riderName: e.target.value})}
                              placeholder="Rider Name"
                              className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold uppercase tracking-wider focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all"
                           />
                        </div>

                        <div className="space-y-1.5">
                           <label className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Mobile Number</label>
                           <input 
                              value={assignmentData.riderPhone}
                              onChange={(e) => {
                                 const val = e.target.value.replace(/\D/g, '');
                                 if (val.length <= 10) {
                                   setAssignmentData({...assignmentData, riderPhone: val});
                                 }
                              }}
                              placeholder="Mobile Number"
                              className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold uppercase tracking-wider focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all"
                           />
                        </div>

                        <div className="space-y-1.5">
                           <label className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Vehicle Plate Number</label>
                           <input 
                              autoFocus
                              required
                              value={assignmentData.vehiclePlate}
                              onChange={(e) => setAssignmentData({...assignmentData, vehiclePlate: e.target.value.toUpperCase()})}
                              placeholder="e.g. DL 01 AB 1234"
                              className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold uppercase tracking-wider focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all"
                           />
                        </div>
                     </div>

                     <button 
                        type="submit"
                        className="w-full py-3 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-950/20 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                     >
                        <Zap size={14} fill="white" /> Save & Assign Vehicle
                     </button>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </div>
  );
}
