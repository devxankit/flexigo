import React, { useState } from 'react';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Search, 
  Filter, 
  Plus, 
  UserPlus, 
  ClipboardCheck, 
  MoreVertical,
  Activity,
  History,
  X,
  Zap,
  CreditCard,
  UserCheck,
  ShieldCheck,
  Edit,
  Trash2,
  Fingerprint,
  Upload,
  Image as ImageIcon,
  FileText,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminStatCard from '../components/AdminStatCard';
import OpsFilter from '../components/OpsFilter';
import { useAdminDataStore } from '../store/adminDataStore';
import api from '../../../lib/axios';

export default function HrManagementPage() {
  const { 
    staff, 
    staffStats,
    fetchStaff, 
    addStaff,
    updateStaff,
    removeStaff
  } = useAdminDataStore();

  const [activeFilters, setActiveFilters] = React.useState({ range: 'Last 7 Days' });

  React.useEffect(() => {
    fetchStaff();
  }, []);

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
  };

  const [activeTab, setActiveTab] = useState('employees');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit'
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [previewData, setPreviewData] = useState(null); // { front, back }
  
  const [newEmployee, setNewEmployee] = useState({ 
    name: '', 
    role: '', 
    dept: 'Operations',
    phone: '',
    email: '',
    reportingManager: '',
    joiningDate: new Date().toISOString().split('T')[0],
    cityZone: '',
    aadhaarFront: '',
    aadhaarBack: ''
  });

  const [aadhaarState, setAadhaarState] = useState({
    isVerifying: false,
    otpSent: false,
    clientId: '',
    isVerified: false
  });

  const handleEditOpen = (emp) => {
    setSelectedStaff(emp);
    setNewEmployee({ 
      name: emp.name, 
      role: emp.role, 
      dept: emp.dept,
      phone: emp.phone || '',
      email: emp.email || '',
      reportingManager: emp.reportingManager || '',
      joiningDate: emp.joiningDate ? new Date(emp.joiningDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      cityZone: emp.cityZone || '',
      aadhaarFront: emp.kycDetails?.aadhaarFront || '',
      aadhaarBack: emp.kycDetails?.aadhaarBack || ''
    });
    setAadhaarState({
      isVerifying: false,
      otpSent: false,
      clientId: '',
      isVerified: emp.kycDetails?.isVerified || false
    });
    setModalType('edit');
    setIsModalOpen(true);
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEmployee(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.role) return;

    const payload = {
      name: newEmployee.name,
      role: newEmployee.role,
      dept: newEmployee.dept,
      shift: 'Regular',
      phone: newEmployee.phone,
      email: newEmployee.email,
      reportingManager: newEmployee.reportingManager,
      joiningDate: newEmployee.joiningDate,
      cityZone: newEmployee.cityZone,
      kycDetails: {
        aadhaarFront: newEmployee.aadhaarFront,
        aadhaarBack: newEmployee.aadhaarBack,
        isVerified: aadhaarState.isVerified
      }
    };

    if (modalType !== 'edit' && newEmployee.phone && newEmployee.phone.length !== 10) {
      alert('Phone number must be exactly 10 digits');
      return;
    }

    try {
      if (modalType === 'edit' && selectedStaff) {
        await updateStaff(selectedStaff._id, payload);
      } else {
        await addStaff(payload);
      }
      setIsModalOpen(false);
      setNewEmployee({ name: '', role: '', dept: 'Operations', phone: '', email: '', reportingManager: '', joiningDate: new Date().toISOString().split('T')[0], cityZone: '', aadhaarFront: '', aadhaarBack: '' });
      setAadhaarState({ isVerifying: false, otpSent: false, clientId: '', isVerified: false });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="space-y-0.5">
            <div className="flex items-center gap-2">
               <div className="w-1 h-5 bg-emerald-600 rounded-full" />
               <h1 className="text-xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Team <span className="text-emerald-500">Registry</span>
               </h1>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] ml-3">
               Staff Management & Access Control
            </p>
         </div>

         <div className="flex items-center gap-2">
            <OpsFilter onFilterChange={handleFilterChange} />
            <button 
               onClick={() => {
                 setModalType('add');
                 setNewEmployee({ name: '', role: '', dept: 'Operations', phone: '', email: '', reportingManager: '', joiningDate: new Date().toISOString().split('T')[0], cityZone: '', aadhaarFront: '', aadhaarBack: '' });
                 setAadhaarState({ isVerifying: false, otpSent: false, clientId: '', isVerified: false });
                 setIsModalOpen(true);
               }}
               className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-950/20 hover:bg-emerald-700 transition-all active:scale-95"
            >
               <UserPlus size={14} /> Add Staff
            </button>
         </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard 
          title="Total Staff" 
          value={staffStats.totalStaff} 
          subtitle="Active Team"
          icon={Users} 
          color="emerald"
        />
        <AdminStatCard 
          title="On Duty" 
          value={staffStats.onDuty} 
          subtitle="Present Now"
          icon={CheckCircle2} 
          color="emerald"
        />
        <AdminStatCard 
          title="Performance" 
          value={staffStats.performance} 
          subtitle="Efficiency Rating"
          icon={Activity} 
          color="emerald"
        />
        <AdminStatCard 
          title="Leaves" 
          value={staffStats.leaves} 
          subtitle="Pending Alpha"
          icon={Clock} 
          color="rose"
        />
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-8 border-b border-[var(--border-subtle)] pb-px px-2">
        {['employees', 'attendance', 'leaves', 'payroll'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-[9px] font-black uppercase tracking-widest transition-all relative ${
              activeTab === tab ? 'text-emerald-500' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                 <Users size={18} className="text-emerald-500" />
              </div>
              <h2 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-widest italic">Registry Payload</h2>
           </div>
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" size={12} />
              <input 
                 type="text" 
                 placeholder="SEARCH PERSON" 
                 className="bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl py-2 pl-9 pr-4 text-[9px] font-bold tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none w-48 transition-all"
              />
           </div>
        </div>

        {activeTab === 'employees' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border-subtle)]">
                  <th className="py-4 px-6 text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Name & Role</th>
                  <th className="py-4 px-6 text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Dept</th>
                  <th className="py-4 px-6 text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Contact</th>
                  <th className="py-4 px-6 text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Zone</th>
                  <th className="py-4 px-6 text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em]">KYC</th>
                  <th className="py-4 px-6 text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Status</th>
                  <th className="py-4 px-6 text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {staff.map((emp, idx) => (
                  <tr key={emp._id || idx} className="hover:bg-emerald-500/5 transition-all group">
                    <td className="py-4 px-6">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[10px] font-black text-emerald-500">
                             {emp.name.charAt(0)}
                          </div>
                          <div>
                             <div className="flex items-center gap-2">
                                <p className="text-[10px] font-black text-[var(--text-primary)] leading-none italic">{emp.name}</p>
                                {emp.employeeId && (
                                   <span className="text-[7px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-md font-black border border-emerald-500/10">
                                      {emp.employeeId}
                                   </span>
                                )}
                             </div>
                             <p className="text-[8px] font-bold text-[var(--text-tertiary)] italic tracking-widest mt-1">{emp.role}</p>
                          </div>
                       </div>
                    </td>
                    <td className="py-4 px-6">
                       <p className="text-[9px] font-black text-[var(--text-primary)] italic">{emp.dept}</p>
                    </td>
                    <td className="py-4 px-6">
                       <p className="text-[9px] font-black text-[var(--text-primary)]">{emp.phone || 'N/A'}</p>
                    </td>
                    <td className="py-4 px-6">
                       <p className="text-[9px] font-black text-[var(--text-primary)] italic">{emp.cityZone || 'N/A'}</p>
                    </td>
                    <td className="py-4 px-6">
                       <div className="flex items-center gap-2">
                          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border w-fit ${(emp.kycDetails?.isVerified || emp.kycDetails?.aadhaarFront || emp.kycDetails?.aadhaarBack) ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                             {(emp.kycDetails?.isVerified || emp.kycDetails?.aadhaarFront || emp.kycDetails?.aadhaarBack) ? <ShieldCheck size={10} /> : <Clock size={10} />}
                             <span className="text-[7px] font-black uppercase tracking-widest">
                                {(emp.kycDetails?.isVerified || emp.kycDetails?.aadhaarFront || emp.kycDetails?.aadhaarBack) ? 'Approved' : 'Pending'}
                             </span>
                          </div>
                          {(emp.kycDetails?.aadhaarFront || emp.kycDetails?.aadhaarBack) && (
                             <button 
                                onClick={() => setPreviewData({ front: emp.kycDetails.aadhaarFront, back: emp.kycDetails.aadhaarBack })}
                                className="p-1 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                             >
                                <Eye size={10} />
                             </button>
                          )}
                       </div>
                    </td>
                    <td className="py-4 px-6">
                       <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-widest border border-emerald-500/10">Active</span>
                    </td>
                    <td className="py-4 px-6">
                       <div className="flex items-center gap-2">
                          <button onClick={() => handleEditOpen(emp)} className="p-1.5 hover:bg-emerald-500/10 rounded-lg text-[var(--text-tertiary)] hover:text-emerald-500 transition-all">
                             <Edit size={14} />
                          </button>
                          <button onClick={() => removeStaff(emp._id)} className="p-1.5 hover:bg-rose-500/10 rounded-lg text-[var(--text-tertiary)] hover:text-rose-500 transition-all">
                             <Trash2 size={14} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-16 h-16 bg-emerald-500/5 rounded-3xl flex items-center justify-center border border-emerald-500/10 shadow-inner">
                <Clock size={24} className="text-emerald-500/50" />
             </div>
             <div className="space-y-1">
                <p className="text-[11px] font-black text-[var(--text-primary)] uppercase italic tracking-widest">Protocol Initializing</p>
                <p className="text-[8px] text-[var(--text-tertiary)] font-bold uppercase tracking-wider">This module is currently syncing with the main registry.</p>
             </div>
          </div>
        )}
      </div>

      {/* Staff Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
             />
             <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
             >
                <div className="flex items-center justify-between mb-8">
                   <div className="space-y-1">
                      <div className="flex items-center gap-2">
                         <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tighter uppercase italic">
                            {modalType === 'edit' ? 'Update' : 'Initialize'} <span className="text-emerald-500">Initiator</span>
                         </h2>
                      </div>
                      <p className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Section: Hub_Staff_V2</p>
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[var(--bg-tertiary)] rounded-full transition-all">
                      <X size={18} />
                   </button>
                </div>

                <form onSubmit={handleAddEmployee} className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                         <label className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Staff Identity Name</label>
                         <input 
                            value={newEmployee.name}
                            onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                            placeholder="Staff Name"
                            className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all italic text-[var(--text-primary)]"
                         />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">System Designation</label>
                         <input 
                            value={newEmployee.role}
                            onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                            placeholder="manager"
                            className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all italic text-[var(--text-primary)]"
                         />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                         <label className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Contact Number</label>
                         <input 
                            value={newEmployee.phone}
                            onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                            placeholder="10-digit number"
                            className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all italic text-[var(--text-primary)]"
                         />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Department</label>
                         <select 
                            value={newEmployee.dept}
                            onChange={(e) => setNewEmployee({...newEmployee, dept: e.target.value})}
                            className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all italic text-[var(--text-primary)]"
                         >
                            <option value="Operations">Operations</option>
                            <option value="Finance">Finance</option>
                            <option value="Technology">Technology</option>
                            <option value="Customer Support">Customer Support</option>
                            <option value="Field Services">Field Services</option>
                         </select>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                         <label className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Reporting Manager</label>
                         <input 
                            value={newEmployee.reportingManager}
                            onChange={(e) => setNewEmployee({...newEmployee, reportingManager: e.target.value})}
                            placeholder="Manager Name"
                            className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all italic text-[var(--text-primary)]"
                         />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Joining Date</label>
                         <input 
                            type="date"
                            value={newEmployee.joiningDate}
                            onChange={(e) => setNewEmployee({...newEmployee, joiningDate: e.target.value})}
                            className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all italic text-[var(--text-primary)]"
                         />
                      </div>
                   </div>

                   <div className="space-y-1.5">
                      <label className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Assigned City/Zone</label>
                      <input 
                         value={newEmployee.cityZone}
                         onChange={(e) => setNewEmployee({...newEmployee, cityZone: e.target.value})}
                         placeholder="e.g. Noida - Sector 62"
                         className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all italic text-[var(--text-primary)]"
                      />
                   </div>

                   {/* KYC Documents Section */}
                   <div className="pt-4 border-t border-[var(--border-subtle)] space-y-4">
                      <div className="flex items-center gap-2">
                         <ShieldCheck size={14} className="text-emerald-500" />
                         <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-tighter">Aadhaar KYC Protocol</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1.5">
                            <label className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Aadhaar Front Copy</label>
                            <div className="relative group">
                               <input 
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFileChange(e, 'aadhaarFront')}
                                  className="hidden"
                                  id="aadhaar-front-upload"
                                />
                               <label 
                                  htmlFor="aadhaar-front-upload"
                                  className={`w-full aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${newEmployee.aadhaarFront ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-[var(--border-subtle)] hover:border-emerald-500/30 bg-[var(--bg-tertiary)]'}`}
                               >
                                  {newEmployee.aadhaarFront ? (
                                     <img src={newEmployee.aadhaarFront} className="w-full h-full object-cover rounded-xl" alt="Aadhaar Front" />
                                  ) : (
                                     <>
                                        <Upload size={20} className="text-[var(--text-tertiary)] group-hover:text-emerald-500 transition-colors" />
                                        <span className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Upload Front</span>
                                     </>
                                  )}
                               </label>
                            </div>
                         </div>

                         <div className="space-y-1.5">
                            <label className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Aadhaar Back Copy</label>
                            <div className="relative group">
                               <input 
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFileChange(e, 'aadhaarBack')}
                                  className="hidden"
                                  id="aadhaar-back-upload"
                                />
                               <label 
                                  htmlFor="aadhaar-back-upload"
                                  className={`w-full aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${newEmployee.aadhaarBack ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-[var(--border-subtle)] hover:border-emerald-500/30 bg-[var(--bg-tertiary)]'}`}
                               >
                                  {newEmployee.aadhaarBack ? (
                                     <img src={newEmployee.aadhaarBack} className="w-full h-full object-cover rounded-xl" alt="Aadhaar Back" />
                                  ) : (
                                     <>
                                        <Upload size={20} className="text-[var(--text-tertiary)] group-hover:text-emerald-500 transition-colors" />
                                        <span className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Upload Back</span>
                                     </>
                                  )}
                               </label>
                            </div>
                         </div>
                      </div>
                   </div>

                   <button 
                      type="submit"
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mt-2"
                   >
                      <Zap size={14} />
                      {modalType === 'edit' ? 'Update Staff Member' : 'Execute Staff Sync'}
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Image Preview Modal */}
      <AnimatePresence>
         {previewData && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-8">
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setPreviewData(null)}
                  className="absolute inset-0 bg-black/90 backdrop-blur-sm"
               />
               <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative max-w-6xl w-full max-h-full bg-[var(--bg-secondary)] rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
               >
                  <div className="p-4 border-b border-white/10 flex items-center justify-between">
                     <p className="text-[10px] font-black text-white uppercase tracking-widest italic">Aadhaar KYC Documents Preview</p>
                     <button 
                        onClick={() => setPreviewData(null)}
                        className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
                     >
                        <X size={20} />
                     </button>
                  </div>
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto">
                     <div className="space-y-4">
                        <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest text-center">Front Side</p>
                        <div className="aspect-video bg-black/20 rounded-2xl overflow-hidden border border-white/5">
                           {previewData.front ? (
                              <img src={previewData.front} className="w-full h-full object-contain" alt="Aadhaar Front" />
                           ) : (
                              <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-white/20 uppercase tracking-widest">No Front Image</div>
                           )}
                        </div>
                     </div>
                     <div className="space-y-4">
                        <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest text-center">Back Side</p>
                        <div className="aspect-video bg-black/20 rounded-2xl overflow-hidden border border-white/5">
                           {previewData.back ? (
                              <img src={previewData.back} className="w-full h-full object-contain" alt="Aadhaar Back" />
                           ) : (
                              <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-white/20 uppercase tracking-widest">No Back Image</div>
                           )}
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}
