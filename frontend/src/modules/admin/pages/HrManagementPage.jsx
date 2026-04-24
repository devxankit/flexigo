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
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminStatCard from '../components/AdminStatCard';
import OpsFilter from '../components/OpsFilter';
import { useAdminDataStore } from '../store/adminDataStore';

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
    console.log('HR Management Sync:', newFilters);
  };

  const [activeTab, setActiveTab] = useState('employees');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit', or 'payouts'
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [newEmployee, setNewEmployee] = useState({ name: '', role: '', dept: 'Operations' });

  const handleEditOpen = (emp) => {
    setSelectedStaff(emp);
    setNewEmployee({ name: emp.name, role: emp.role, dept: emp.dept });
    setModalType('edit');
    setIsModalOpen(true);
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.role) return;

    const payload = {
      name: newEmployee.name,
      role: newEmployee.role,
      dept: newEmployee.dept,
      shift: 'Regular'
    };

    if (modalType === 'edit' && selectedStaff) {
      await updateStaff(selectedStaff._id, payload);
    } else {
      await addStaff(payload);
    }

    setNewEmployee({ name: '', role: '', dept: 'Operations' });
    setIsModalOpen(false);
    setSelectedStaff(null);
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
               onClick={() => { setModalType('add'); setIsModalOpen(true); }}
               className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md active:scale-95"
            >
               <UserPlus size={12} strokeWidth={3} /> Add Staff
            </button>
         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <AdminStatCard title="Total Staff" value={staffStats.totalStaff} icon={Users} color="emerald" subtitle="Active Team" />
         <AdminStatCard title="On Duty" value={staffStats.onDuty} icon={CheckCircle2} color="blue" subtitle="Present Now" />
         <AdminStatCard title="Performance" value={staffStats.performance} icon={Activity} color="emerald" subtitle="Efficiency Rating" />
         <AdminStatCard title="Leaves" value={staffStats.leaves} icon={Clock} color="rose" subtitle="Pending Alpha" />
      </div>

      {/* Tabbed Navigation */}
      <div className="flex border-b border-[var(--border-subtle)] gap-6">
         {['employees', 'attendance', 'leaves', 'payroll'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-1 text-[9px] font-black uppercase tracking-widest transition-all relative italic ${
                activeTab === tab ? 'text-emerald-500' : 'text-[var(--text-tertiary)] hover:text-emerald-500'
              }`}
            >
               {tab}
               {activeTab === tab && (
                  <motion.div layoutId="hr-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
               )}
            </button>
         ))}
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
         <div className="px-6 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-tertiary)]/10">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
                  <Users size={16} />
               </div>
               <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-wider leading-none italic">
                  {activeTab === 'employees' ? 'Registry Payload' : activeTab.toUpperCase() + ' STREAM'}
               </h3>
            </div>
            <div className="relative group">
               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-tertiary)] group-focus-within:text-emerald-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search personnel..." 
                 className="pl-8 pr-3 py-1.5 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-lg text-[9px] font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none w-32 transition-all text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50"
               />
            </div>
         </div>
         
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/20">
                     {['Staff ID', 'Name & Role', 'Dept', 'Shift', 'Access', 'Status', 'Actions'].map((header) => (
                        <th key={header} className="py-2.5 px-6 text-[8px] font-black uppercase tracking-widest text-[var(--text-tertiary)] whitespace-nowrap">{header}</th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-[var(--border-subtle)]">
                  <AnimatePresence mode='popLayout'>
                     {staff.map((emp, idx) => (
                        <motion.tr 
                           layout
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           exit={{ opacity: 0 }}
                           key={emp._id || emp.id || idx} 
                           className="group/row hover:bg-[var(--bg-tertiary)]/20 transition-colors cursor-pointer text-[10px]"
                        >
                           <td className="py-3 px-6 font-black text-[7.5px] text-[var(--text-tertiary)] uppercase tracking-widest leading-none">{(emp._id || emp.id).slice(-8).toUpperCase()}</td>
                           <td className="py-3 px-6 whitespace-nowrap">
                              <div className="flex flex-col">
                                 <span className="font-black text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors uppercase tracking-tight italic">{emp.name}</span>
                                 <span className="text-[7.5px] font-bold text-[var(--text-tertiary)] uppercase mt-1 italic tracking-widest leading-none">{emp.role}</span>
                              </div>
                           </td>
                           <td className="py-3 px-6 text-[9px] font-black text-[var(--text-tertiary)] uppercase italic leading-none">{emp.dept}</td>
                           <td className="py-3 px-6 text-[9px] font-black text-[var(--text-primary)] uppercase leading-none">{emp.shift}</td>
                           <td className="py-3 px-6 text-[9px] font-black text-[var(--text-primary)] uppercase leading-none italic">
                              {emp.role.includes('Lead') ? 'Level_4' : 'Level_2'}
                           </td>
                           <td className="py-3 px-6">
                              <div className={`inline-flex px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest border ${
                                 emp.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' : 'bg-slate-500/10 text-slate-500 border-slate-500/10'
                              }`}>
                                 {emp.status}
                              </div>
                           </td>
                           <td className="py-3 px-6">
                              <div className="flex items-center gap-2">
                                 <button 
                                    onClick={(e) => { e.stopPropagation(); handleEditOpen(emp); }}
                                    className="p-1 text-[var(--text-tertiary)] hover:text-emerald-500 hover:bg-emerald-500/10 rounded transition-all"
                                 >
                                    <Edit size={12} />
                                 </button>
                                 <button 
                                    onClick={(e) => { e.stopPropagation(); if(window.confirm('Delete staff?')) removeStaff(emp._id); }}
                                    className="p-1 text-[var(--text-tertiary)] hover:text-rose-500 hover:bg-rose-500/10 rounded transition-all"
                                 >
                                    <Trash2 size={12} />
                                 </button>
                              </div>
                           </td>
                        </motion.tr>
                     ))}
                  </AnimatePresence>
               </tbody>
            </table>
         </div>
      </div>

      {/* HR Action Modal */}
      <AnimatePresence>
         {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-md bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-8 shadow-2xl space-y-6"
               >
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                         <h2 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tighter italic leading-none">
                            {modalType === 'add' ? 'Staff' : modalType === 'edit' ? 'Update' : 'Payroll'} <span className="text-emerald-500">Initiator</span>
                         </h2>
                        <p className="text-[8px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">SECTION: HUB_STAFF_V2</p>
                     </div>
                     <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-rose-600/10 hover:text-rose-500 transition-all rounded-lg">
                        <X size={18} />
                     </button>
                  </div>

                  {modalType !== 'payouts' ? (
                     <form onSubmit={handleAddEmployee} className="space-y-6">
                        <div className="space-y-4">
                           <div className="space-y-1.5">
                              <label className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Staff Identity Name</label>
                              <input 
                                 autoFocus
                                 value={newEmployee.name}
                                 onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                                 placeholder="Full Name"
                                 className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all italic"
                              />
                           </div>
                           <div className="space-y-1.5">
                              <label className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">System Designation</label>
                              <input 
                                 value={newEmployee.role}
                                 onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                                 placeholder="Role"
                                 className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all italic"
                              />
                           </div>
                        </div>
                        <button 
                           type="submit"
                           className="w-full py-3 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-950/20 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                           <Zap size={14} fill="white" /> {modalType === 'edit' ? 'Update Staff Member' : 'Execute Staff Sync'}
                        </button>
                     </form>
                  ) : (
                     <div className="text-center py-4 space-y-4">
                        <div className="w-16 h-16 bg-emerald-600/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/10 shadow-inner">
                           <CreditCard size={32} className="text-emerald-500" />
                        </div>
                        {staff.length > 0 ? (
                           <>
                              <p className="text-[10px] font-black text-[var(--text-primary)] uppercase italic leading-relaxed tracking-widest">Active Payroll Protocol</p>
                              <p className="text-[8px] text-[var(--text-tertiary)] font-bold uppercase tracking-wider leading-relaxed">Processing batch for {staff.length} staff members.</p>
                           </>
                        ) : (
                           <>
                              <p className="text-[10px] font-black text-[var(--text-primary)] uppercase italic leading-relaxed tracking-widest">Verification Node Pending</p>
                              <p className="text-[8px] text-[var(--text-tertiary)] font-bold uppercase tracking-wider leading-relaxed">Payroll module requires active staff records.</p>
                           </>
                        )}
                        <button onClick={() => setIsModalOpen(false)} className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Initialize Settlement</button>
                     </div>
                  )}
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}
