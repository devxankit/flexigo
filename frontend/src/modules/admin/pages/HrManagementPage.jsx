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
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminStatCard from '../components/AdminStatCard';
import { adminDataStore } from '../store/adminDataStore';

export default function HrManagementPage() {
  const [employees, setEmployees] = useState([
    { id: 'EMP-001', name: 'Kabir Vats', role: 'Fleet Lead', dept: 'Operations', status: 'active', shift: 'Morning' },
    { id: 'EMP-002', name: 'Sara Qureshi', role: 'Compliance Officer', dept: 'Legal', status: 'active', shift: 'Regular' },
    { id: 'EMP-003', name: 'Nikhil Verma', role: 'BMS Engineer', dept: 'Engineering', status: 'on-leave', shift: 'Night' },
    { id: 'EMP-004', name: 'Tanvi Jain', role: 'Support Agent', dept: 'CRM', status: 'active', shift: 'Evening' },
  ]);

  const [activeTab, setActiveTab] = useState('employees');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'payouts'
  const [newEmployee, setNewEmployee] = useState({ name: '', role: '', dept: 'Operations' });

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.role) return;

    const emp = {
      id: `EMP-${Math.floor(100 + Math.random() * 900)}`,
      name: newEmployee.name,
      role: newEmployee.role,
      dept: newEmployee.dept,
      status: 'active',
      shift: 'Regular'
    };

    setEmployees([emp, ...employees]);
    setNewEmployee({ name: '', role: '', dept: 'Operations' });
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
                  Staff <span className="text-emerald-500">Registry</span>
               </h1>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-tertiary)] ml-4">
               Manage Team • Access Control • Attendance
            </p>
         </div>
         
         <div className="flex items-center gap-3">
            <button 
               onClick={() => { setModalType('add'); setIsModalOpen(true); }}
               className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-950/20 active:scale-95"
            >
               <UserPlus size={14} strokeWidth={3} /> Add New Staff
            </button>
            <button 
               onClick={() => { setModalType('payouts'); setIsModalOpen(true); }}
               className="flex items-center gap-2 px-5 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] text-[10px] font-black uppercase tracking-widest hover:border-emerald-500/30 transition-all active:scale-95 shadow-sm"
            >
               <CreditCard size={14} /> Payouts
            </button>
         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
         <AdminStatCard title="Total Staff" value={employees.length} icon={Users} color="emerald" subtitle="Active employees" />
         <AdminStatCard title="On Duty" value="38" icon={CheckCircle2} color="blue" subtitle="Present today" />
         <AdminStatCard title="Performance" value="98.8%" icon={Activity} color="emerald" subtitle="Overall team rating" />
         <AdminStatCard title="Leave Requests" value="03" icon={Clock} color="rose" subtitle="Pending approval" />
      </div>

      {/* Tabbed Navigation */}
      <div className="flex border-b border-[var(--border-subtle)] gap-10">
         {['employees', 'attendance', 'leaves', 'payroll', 'access'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${
                activeTab === tab ? 'text-emerald-500' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
              }`}
            >
               {tab}
               {activeTab === tab && (
                  <motion.div layoutId="hr-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
               )}
            </button>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Staff Registry */}
         <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="p-8 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-tertiary)]/10">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
                     <Users size={20} />
                  </div>
                  <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest leading-none">
                     {activeTab === 'employees' ? 'Team Registry' : activeTab.toUpperCase() + ' STREAM'}
                  </h3>
               </div>
               <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)] group-focus-within:text-emerald-500" />
                  <input 
                    type="text" 
                    placeholder="Search personnel..." 
                    className="pl-10 pr-4 py-2 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none w-48 transition-all"
                  />
               </div>
            </div>
            
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/30">
                        {['Staff ID', 'Name & Role', 'Department', 'Shift', 'Access Scope', 'Status'].map((header) => (
                           <th key={header} className="py-5 px-8 text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-tertiary)] whitespace-nowrap">{header}</th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                     <AnimatePresence mode='popLayout'>
                        {employees.map((emp) => (
                           <motion.tr 
                              layout
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              key={emp.id} 
                              className="group/row hover:bg-[var(--bg-tertiary)]/50 transition-colors cursor-pointer"
                           >
                              <td className="py-6 px-8 font-black text-[9px] text-[var(--text-tertiary)] uppercase tracking-widest">{emp.id}</td>
                              <td className="py-6 px-8 whitespace-nowrap">
                                 <div className="flex flex-col gap-0.5">
                                    <span className="text-xs font-black text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{emp.name}</span>
                                    <span className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest leading-none mt-1">{emp.role}</span>
                                 </div>
                              </td>
                              <td className="py-6 px-8 text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-wider italic">{emp.dept}</td>
                              <td className="py-6 px-8 text-[10px] font-black text-[var(--text-primary)] uppercase">{emp.shift}</td>
                              <td className="py-6 px-8 text-[10px] font-black text-[var(--text-primary)] uppercase">
                                 {emp.role === 'Fleet Lead' ? 'Full Control' : 'Standard'}
                              </td>
                              <td className="py-6 px-8">
                                 <div className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                                    emp.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                                 }`}>
                                    {emp.status}
                                 </div>
                              </td>
                           </motion.tr>
                        ))}
                     </AnimatePresence>
                  </tbody>
               </table>
            </div>
         </div>

         {/* Right Sidebar Assets */}
         <div className="space-y-6">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2.5rem] p-8 shadow-sm">
               <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border-subtle)]">
                  <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest italic">Efficiency Index</h3>
                  <div className="p-1 px-3 bg-emerald-500/10 rounded-full text-[8px] font-black text-emerald-500 uppercase tracking-widest animate-pulse border border-emerald-500/20">Live Sync</div>
               </div>

               <div className="space-y-6">
                  {[
                    { label: 'Team Handover Rate', rate: '99.2%', status: 'high' },
                    { label: 'SLA Fulfillment', rate: '14min', status: 'high' },
                    { label: 'Attendance Ratio', rate: '94%', status: 'med' },
                  ].map((stat) => (
                    <div key={stat.label} className="p-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-2xl group hover:border-emerald-500/30 transition-all cursor-crosshair">
                       <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">{stat.label}</span>
                          <span className={`text-[11px] font-black tracking-tighter ${stat.status === 'high' ? 'text-emerald-500' : 'text-amber-500'}`}>{stat.rate}</span>
                       </div>
                       <div className="w-full h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden shadow-inner">
                          <div className={`h-full ${stat.status === 'high' ? 'bg-emerald-600' : 'bg-amber-600'} group-hover:animate-pulse transition-all`} style={{ width: stat.status === 'high' ? '92%' : '84%' }} />
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-10 p-6 bg-emerald-600/5 border border-emerald-500/20 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2">
                     <History size={16} className="text-emerald-600" />
                     <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Automated Rotations</p>
                  </div>
                  <p className="text-[10px] text-[var(--text-tertiary)] font-bold leading-relaxed italic uppercase tracking-tighter">
                     Personnel shifts are optimized via the <span className="text-emerald-500 font-black underline decoration-emerald-500/30">CORE INTELLIGENCE</span> engine every 24 hours.
                  </p>
               </div>
            </div>

            {/* Leave Approval Strip */}
            <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2rem] flex items-center justify-between group cursor-pointer hover:border-rose-500/30 transition-all shadow-sm">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl group-hover:rotate-6 transition-transform shadow-inner">
                     <Calendar size={22} />
                  </div>
                  <div className="space-y-0.5">
                     <p className="text-xs font-black text-[var(--text-primary)] uppercase tracking-widest leading-none">Leave Requests</p>
                     <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-1 italic animate-pulse">03 Pending Nodes</p>
                  </div>
               </div>
               <ChevronRight size={20} className="text-[var(--text-tertiary)] group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
            </div>
         </div>
      </div>

      {/* HR Action Modal */}
      <AnimatePresence>
         {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[3rem] p-12 shadow-2xl space-y-10"
               >
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter italic">
                           {modalType === 'add' ? 'New' : 'Salary'} <span className="text-emerald-500">Staff Member</span>
                        </h2>
                        <p className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.4em]">Section: HUB_STAFF_V2</p>
                     </div>
                     <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-rose-600/10 hover:text-rose-500 transition-all rounded-2xl border border-transparent hover:border-rose-500/20">
                        <X size={24} />
                     </button>
                  </div>

                  {modalType === 'add' ? (
                     <form onSubmit={handleAddEmployee} className="space-y-10">
                        <div className="space-y-8">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                 <UserCheck size={12} className="text-emerald-500" /> Full Name
                              </label>
                              <input 
                                 autoFocus
                                 value={newEmployee.name}
                                 onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                                 placeholder="e.g. Vikram Batra"
                                 className="w-full px-8 py-5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-3xl text-sm font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/40 outline-none transition-all placeholder:text-[var(--text-tertiary)]/50 italic shadow-inner"
                              />
                           </div>

                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                 <ShieldCheck size={12} className="text-emerald-500" /> Designation / Role
                              </label>
                              <input 
                                 value={newEmployee.role}
                                 onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                                 placeholder="e.g. Senior Fleet Manager"
                                 className="w-full px-8 py-5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-3xl text-sm font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/40 outline-none transition-all placeholder:text-[var(--text-tertiary)]/50 italic shadow-inner"
                              />
                           </div>
                        </div>

                        <button 
                           type="submit"
                           className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-emerald-950/40 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-4 group"
                        >
                           <Zap size={20} fill="white" className="group-hover:animate-bounce" /> Confirm Staff Registration
                        </button>
                     </form>
                  ) : (
                     <div className="space-y-10 text-center py-6">
                        <div className="w-24 h-24 bg-emerald-600/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-inner">
                           <CreditCard size={40} className="text-emerald-500" />
                        </div>
                        <div className="space-y-3">
                           <p className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest italic">Awaiting Settlement Sync</p>
                           <p className="text-[11px] text-[var(--text-tertiary)] font-bold uppercase tracking-wider leading-relaxed px-10">Payroll processing for the current cycle is scheduled for <span className="text-emerald-500">tomorrow at 04:00 AM</span>. All attendance nodes must be verified beforehand.</p>
                        </div>
                        <button 
                           onClick={() => setIsModalOpen(false)}
                           className="w-full mt-6 py-5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-primary)] hover:border-emerald-500/40 transition-all active:scale-95"
                        >
                           Exit Module Registry
                        </button>
                     </div>
                  )}
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}
