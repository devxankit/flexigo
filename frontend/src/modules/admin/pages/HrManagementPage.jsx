import React, { useState } from 'react';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ChevronLeft,
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
  ChevronDown,
  Download
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
    removeStaff,
    fetchWeeklyAttendance,
    updateWeeklyAttendance,
    fetchMonthlyAttendanceReport
  } = useAdminDataStore();

  const handleDownloadReport = async () => {
    const month = prompt("Enter month (YYYY-MM)", new Date().toISOString().slice(0, 7));
    if (!month) return;

    const data = await fetchMonthlyAttendanceReport(month);
    if (!data) return alert("Failed to fetch report data");

    const { staffList, records } = data;
    
    // Create CSV Header
    let csvContent = "Staff ID,Name,Role,Department,Week,Day 1,Day 2,Day 3,Day 4,Day 5\n";

    staffList.forEach(emp => {
      const empRecords = records.filter(r => r.staffId._id === emp._id);
      if (empRecords.length > 0) {
        empRecords.forEach(rec => {
          csvContent += `${emp._id},${emp.name},${emp.role},${emp.dept},${rec.weekKey},${rec.days.join(',')}\n`;
        });
      } else {
        csvContent += `${emp._id},${emp.name},${emp.role},${emp.dept},N/A,N/A,N/A,N/A,N/A,N/A\n`;
      }
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Flexigo_Attendance_${month}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getWeekInfo = (offset = 0, count = 5, baseDate = new Date()) => {
    const startOfWeek = new Date(baseDate);
    const day = startOfWeek.getDay() || 7;
    startOfWeek.setDate(startOfWeek.getDate() - day + 1 + (offset * 7));
    
    const dates = [];
    for (let i = 0; i < count; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      dates.push({
        label: d.toLocaleDateString('en-IN', { weekday: 'short' }).toUpperCase(),
        date: d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit' }),
        fullDate: d
      });
    }
    
    const d = new Date(startOfWeek);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    const weekKey = `${d.getFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
    const monthName = startOfWeek.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    return { weekKey, dates, monthName, weekNo };
  };

  const [activeTab, setActiveTab] = useState('employees');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit', 'payouts', or 'details'
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [newEmployee, setNewEmployee] = useState({ 
    name: '', 
    role: '', 
    dept: 'Operations',
    phone: '',
    joiningDate: new Date().toISOString().split('T')[0]
  });

  const [weekOffset, setWeekOffset] = useState(0);
  const [jumpDate, setJumpDate] = useState(new Date());
  const [weeklyData, setWeeklyData] = useState([]);
  const [weekInfo, setWeekInfo] = useState(getWeekInfo(0, 5));

  React.useEffect(() => {
    if (selectedStaff && modalType === 'details') {
      const count = selectedStaff.workDaysCount || 5;
      const info = getWeekInfo(weekOffset, count, jumpDate);
      setWeekInfo(info);
      
      const loadAttendance = async () => {
        const data = await fetchWeeklyAttendance(selectedStaff._id, info.weekKey);
        if (data) {
          setWeeklyData(data.days);
        } else {
          setWeeklyData(Array(count).fill('present'));
        }
      };
      loadAttendance();
    }
  }, [selectedStaff, weekOffset, jumpDate, modalType]);

  const [activeFilters, setActiveFilters] = React.useState({ range: 'Last 7 Days' });

  React.useEffect(() => {
    fetchStaff();
  }, []);

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    console.log('HR Management Sync:', newFilters);
  };

  const handleEditOpen = (emp) => {
    setSelectedStaff(emp);
    setNewEmployee({ 
      name: emp.name, 
      role: emp.role, 
      dept: emp.dept,
      phone: emp.phone || '',
      joiningDate: emp.joiningDate ? new Date(emp.joiningDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setModalType('edit');
    setIsModalOpen(true);
  };

  const handleDetailsOpen = (emp) => {
    setSelectedStaff(emp);
    setWeekOffset(0);
    setModalType('details');
    setIsModalOpen(true);
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.role) return;

    const payload = {
      ...newEmployee,
      shift: 'Regular'
    };

    if (modalType === 'edit' && selectedStaff) {
      await updateStaff(selectedStaff._id, payload);
    } else {
      await addStaff(payload);
    }

    setNewEmployee({ 
      name: '', 
      role: '', 
      dept: 'Operations',
      phone: '',
      joiningDate: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(false);
    setSelectedStaff(null);
  };

  const handleUpdateDetails = async (field, value) => {
    if (!selectedStaff) return;
    const res = await updateStaff(selectedStaff._id, { [field]: value });
    if (res.success) {
      setSelectedStaff(res.staff);
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
               onClick={handleDownloadReport}
               className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500/10 hover:text-emerald-500 transition-all active:scale-95 shadow-sm"
            >
               <Download size={12} strokeWidth={3} /> Download Report
            </button>
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
                           onClick={() => handleDetailsOpen(emp)}
                           className="group/row hover:bg-emerald-500/5 transition-colors cursor-pointer text-[10px]"
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
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`w-full ${modalType === 'details' ? 'max-w-2xl' : 'max-w-md'} bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-8 shadow-2xl space-y-6 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar`}
               >
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                         <h2 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tighter italic leading-none">
                            {modalType === 'add' ? 'Staff' : modalType === 'edit' ? 'Update' : modalType === 'details' ? 'Staff' : 'Payroll'} <span className="text-emerald-500">{modalType === 'details' ? 'Profile' : 'Initiator'}</span>
                         </h2>
                        <p className="text-[8px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">SECTION: {modalType === 'details' ? 'STAFF_INTEL_V1' : 'HUB_STAFF_V2'}</p>
                     </div>
                     <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-rose-600/10 hover:text-rose-500 transition-all rounded-lg">
                        <X size={18} />
                     </button>
                  </div>

                  {modalType === 'details' && selectedStaff ? (
                    <div className="space-y-8">
                       <div className="flex items-start gap-6 p-6 bg-[var(--bg-tertiary)]/30 rounded-2xl border border-[var(--border-subtle)]">
                          <div className="w-20 h-20 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-inner">
                             <Users size={40} />
                          </div>
                          <div className="flex-1 space-y-2">
                             <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic leading-none">{selectedStaff.name}</h3>
                                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-[0.2em]">{selectedStaff.status}</span>
                             </div>
                             <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{selectedStaff.role}</p>
                             <div className="flex items-center gap-4 text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest pt-2">
                                <span className="flex items-center gap-1.5"><Briefcase size={10} /> {selectedStaff.dept}</span>
                                <span className="flex items-center gap-1.5"><Calendar size={10} /> Joined {new Date(selectedStaff.joiningDate || selectedStaff.createdAt).toLocaleDateString()}</span>
                             </div>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-5 bg-[var(--bg-tertiary)]/20 rounded-2xl border border-[var(--border-subtle)] space-y-5">
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                   <Clock size={14} className="text-blue-500" />
                                   <span className="text-[9px] font-black text-[var(--text-primary)] uppercase tracking-widest italic">Operations Config</span>
                                </div>
                                <div className="flex items-center gap-2">
                                   <input 
                                      type="month" 
                                      onChange={(e) => {
                                         if(e.target.value) {
                                            setJumpDate(new Date(e.target.value));
                                            setWeekOffset(0);
                                         }
                                      }}
                                      className="bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded px-1.5 py-0.5 text-[8px] font-black uppercase text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-emerald-500/20"
                                   />
                                </div>
                             </div>

                             <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                   <span className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Shift Duration</span>
                                   <span className="text-[10px] font-black text-blue-500 italic">{selectedStaff.workingHours || 8}h</span>
                                </div>
                                <input 
                                   type="range" min="0" max="16" step="0.5"
                                   value={selectedStaff.workingHours || 8}
                                   onInput={(e) => handleUpdateDetails('workingHours', parseFloat(e.target.value))}
                                   className="w-full h-1 bg-[var(--bg-tertiary)] rounded-full appearance-none cursor-pointer accent-blue-500"
                                />
                             </div>

                             <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                   <span className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Work Days / Week</span>
                                   <span className="text-[10px] font-black text-emerald-500 italic">{selectedStaff.workDaysCount || 5} Days</span>
                                </div>
                                <input 
                                   type="range" min="4" max="7" step="1"
                                   value={selectedStaff.workDaysCount || 5}
                                   onInput={(e) => handleUpdateDetails('workDaysCount', parseInt(e.target.value))}
                                   className="w-full h-1 bg-[var(--bg-tertiary)] rounded-full appearance-none cursor-pointer accent-emerald-500"
                                />
                             </div>
                          </div>

                          <div className="p-5 bg-[var(--bg-tertiary)]/20 rounded-2xl border border-[var(--border-subtle)] space-y-4">
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                   <ClipboardCheck size={14} className="text-emerald-500" />
                                   <div className="flex flex-col">
                                      <span className="text-[9px] font-black text-[var(--text-primary)] uppercase tracking-widest italic">Attendance Protocol</span>
                                      <span className="text-[7px] font-black text-[var(--text-tertiary)] uppercase tracking-tighter">{weekInfo.monthName}</span>
                                   </div>
                                </div>
                                <div className="flex items-center gap-1 bg-[var(--bg-tertiary)]/40 p-1 rounded-lg border border-[var(--border-subtle)]">
                                   <button type="button" onClick={() => setWeekOffset(prev => prev - 1)} className="p-1 hover:text-emerald-500 transition-all"><ChevronLeft size={12} /></button>
                                   <button type="button" onClick={() => { setWeekOffset(0); setJumpDate(new Date()); }} className="text-[7px] font-black uppercase px-1 transition-all hover:text-emerald-500">Today</button>
                                   <button type="button" onClick={() => setWeekOffset(prev => prev + 1)} className="p-1 hover:text-emerald-500 transition-all"><ChevronRight size={12} /></button>
                                </div>
                             </div>
                             
                             <div className="flex justify-between gap-1.5">
                                {weekInfo.dates.map((dayInfo, idx) => {
                                   const currentStatus = weeklyData[idx] || 'present';
                                   const nextStatus = currentStatus === 'present' ? 'absent' : currentStatus === 'absent' ? 'half-day' : 'present';
                                   
                                   return (
                                      <button 
                                         key={dayInfo.label + dayInfo.date}
                                         type="button"
                                         onClick={async () => {
                                            const newArr = [...weeklyData];
                                            newArr[idx] = nextStatus;
                                            setWeeklyData(newArr);
                                            await updateWeeklyAttendance(selectedStaff._id, weekInfo.weekKey, newArr);
                                         }}
                                         className="flex-1 flex flex-col items-center gap-1.5 p-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/30 hover:bg-emerald-500/5 transition-all group/day"
                                      >
                                         <div className="text-center">
                                            <p className="text-[6.5px] font-black text-[var(--text-tertiary)] uppercase">{dayInfo.label}</p>
                                            <p className="text-[6px] font-bold text-[var(--text-tertiary)]/50">{dayInfo.date}</p>
                                         </div>
                                         <div className={`w-2.5 h-2.5 rounded-full border ${
                                            currentStatus === 'present' ? 'bg-emerald-500 border-emerald-500/20' :
                                            currentStatus === 'absent' ? 'bg-rose-500 border-rose-500/20' :
                                            'bg-amber-500 border-amber-500/20'
                                         }`} />
                                      </button>
                                   );
                                })}
                             </div>
                             
                             <div className="flex justify-center gap-3 pt-1">
                                {['present', 'absent', 'half-day'].map(status => (
                                   <div key={status} className="flex items-center gap-1">
                                      <div className={`w-1.5 h-1.5 rounded-full ${status === 'present' ? 'bg-emerald-500' : status === 'absent' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                                      <span className="text-[6px] font-black text-[var(--text-tertiary)] uppercase">{status}</span>
                                   </div>
                                ))}
                             </div>
                          </div>
                       </div>

                    </div>
                  ) : modalType !== 'payouts' ? (
                     <form onSubmit={handleAddEmployee} className="space-y-5">
                        <div className="space-y-4">
                           <div className="grid grid-cols-2 gap-4">
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
                                 <label className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Phone Number</label>
                                 <input 
                                    value={newEmployee.phone}
                                    onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                                    placeholder="+91 XXXXX XXXXX"
                                    className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all italic"
                                 />
                              </div>
                           </div>

                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                 <label className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">System Designation</label>
                                 <input 
                                    value={newEmployee.role}
                                    onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                                    placeholder="e.g. Senior Technician"
                                    className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all italic"
                                 />
                              </div>
                              <div className="space-y-1.5">
                                 <label className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Date of Joining</label>
                                 <input 
                                    type="date"
                                    value={newEmployee.joiningDate}
                                    onChange={(e) => setNewEmployee({...newEmployee, joiningDate: e.target.value})}
                                    className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all italic text-[var(--text-primary)]"
                                 />
                              </div>
                           </div>

                           <div className="space-y-1.5">
                              <label className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Department Allocation</label>
                              <select 
                                 value={newEmployee.dept}
                                 onChange={(e) => setNewEmployee({...newEmployee, dept: e.target.value})}
                                 className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all italic text-[var(--text-primary)]"
                              >
                                 <option value="Operations">Operations</option>
                                 <option value="Logistics">Logistics</option>
                                 <option value="Technology">Technology</option>
                                 <option value="Maintenance">Maintenance</option>
                                 <option value="Admin">Admin</option>
                              </select>
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
