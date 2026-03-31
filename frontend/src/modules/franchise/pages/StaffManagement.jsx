import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  User, 
  Plus, 
  Trash2, 
  MoreVertical, 
  Activity, 
  Smartphone, 
  Settings,
  Lock,
  Unlock,
  ChevronRight,
  UserPlus,
  X,
  Mail
} from 'lucide-react';
import GlassTable from '../components/GlassTable';
import StatusBadge from '../components/StatusBadge';

const initialStaff = [
  { id: 'S-001', name: 'Vivek Sharma', role: 'Partner', phone: '+91 91234 56789', lastActive: '2026-03-31T14:45:00', status: 'active', permissions: 'Full Root Access' },
  { id: 'S-002', name: 'Mehul Manager', role: 'Manager', phone: '+91 99887 76655', lastActive: '2026-03-31T14:30:00', status: 'active', permissions: 'Ops, Fleet, Logistics' },
  { id: 'S-003', name: 'Rahul Attendant', role: 'Attendant', phone: '+91 77665 54433', lastActive: '2026-03-31T12:00:00', status: 'active', permissions: 'Intake, Diagnostics' },
  { id: 'S-004', name: 'Ankita Staff', role: 'Attendant', phone: '+91 88776 65544', lastActive: '2026-03-30T10:00:00', status: 'paused', permissions: 'Intake, Logistics' },
];

export default function StaffManagement() {
  const [staff, setStaff] = useState(initialStaff);
  const [isAddStaffOpen, setAddStaffOpen] = useState(false);

  const columns = [
    {
      header: 'Personnel Identity',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
           <div className={`w-10 h-10 rounded-lg flex items-center justify-center border shadow-sm ${
             row.role === 'Partner' ? 'bg-emerald-600/10 border-emerald-500/20 text-emerald-600' : 
             row.role === 'Manager' ? 'bg-blue-600/10 border-blue-500/20 text-blue-600' : 
             'bg-[var(--bg-tertiary)] border-[var(--border-subtle)] text-[var(--text-tertiary)]'
           }`}>
             {row.role === 'Partner' ? <ShieldAlert size={20} /> : row.role === 'Manager' ? <Settings size={20} /> : <User size={20} />}
           </div>
           <div className="flex flex-col">
              <span className="text-sm font-bold text-[var(--text-primary)]">{row.name}</span>
              <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">{row.phone}</span>
           </div>
        </div>
      )
    },
    {
      header: 'Operational Role',
      accessor: 'role',
      render: (row) => (
        <div className="flex flex-col">
           <span className={`text-xs font-bold uppercase tracking-tight ${
             row.role === 'Partner' ? 'text-emerald-600' : row.role === 'Manager' ? 'text-blue-600' : 'text-[var(--text-primary)]'
           }`}>{row.role}</span>
           <span className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-tighter opacity-60">Node Integrity: High</span>
        </div>
      )
    },
    {
      header: 'Access Scope',
      accessor: 'permissions',
      render: (row) => (
        <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest truncate max-w-[140px] italic">
           {row.permissions}
        </span>
      )
    },
    {
      header: 'Network Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Privileges',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2">
           <button className="p-2 border border-[var(--border-subtle)] rounded-lg hover:bg-emerald-600/10 hover:text-emerald-600 transition-all text-[var(--text-tertiary)] shadow-sm">
              <ShieldCheck size={16} />
           </button>
           <button className="p-2 border border-[var(--border-subtle)] rounded-lg hover:bg-rose-500/10 hover:text-rose-500 transition-all text-[var(--text-tertiary)] shadow-sm">
              <Trash2 size={16} />
           </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-violet-500 rounded-full shadow-sm" />
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Personnel <span className="text-violet-500 uppercase">Registry</span>
            </h1>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider ml-4 text-[var(--text-tertiary)]">
             Manage hub authorizations, intake staff and operational access
          </p>
        </div>

        <button 
          onClick={() => setAddStaffOpen(true)}
          className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 rounded-lg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-2 active:scale-95 shadow-lg"
        >
           <UserPlus size={16} strokeWidth={2.5} /> Authorize Personnel
        </button>
      </div>

      {/* Access Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col gap-3 shadow-sm hover:border-emerald-500/20 transition-all">
            <div className="text-emerald-600 bg-emerald-600/10 w-10 h-10 rounded-lg flex items-center justify-center border border-emerald-500/10">
               <ShieldAlert size={20} />
            </div>
            <div className="space-y-0.5">
               <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Lead Partners</p>
               <p className="text-xl font-bold text-[var(--text-primary)]">01</p>
            </div>
         </div>
         <div className="p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col gap-3 shadow-sm hover:border-blue-500/20 transition-all">
            <div className="text-blue-500 bg-blue-600/10 w-10 h-10 rounded-lg flex items-center justify-center border border-blue-500/10">
               <Settings size={20} />
            </div>
            <div className="space-y-0.5">
               <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Ops Managers</p>
               <p className="text-xl font-bold text-[var(--text-primary)]">01</p>
            </div>
         </div>
         <div className="p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col gap-3 shadow-sm hover:border-slate-500/20 transition-all">
            <div className="text-[var(--text-tertiary)] bg-[var(--bg-tertiary)]/50 w-10 h-10 rounded-lg flex items-center justify-center border border-[var(--border-subtle)]">
               <Users size={20} />
            </div>
            <div className="space-y-0.5">
               <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Total Personnel</p>
               <p className="text-xl font-bold text-[var(--text-primary)]">04</p>
            </div>
         </div>
         <div className="p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col gap-3 shadow-sm hover:border-violet-500/20 transition-all">
            <div className="text-violet-500 bg-violet-600/10 w-10 h-10 rounded-lg flex items-center justify-center border border-violet-500/10">
               <Lock size={20} />
            </div>
            <div className="space-y-0.5">
               <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Restricted Access</p>
               <p className="text-xl font-bold text-[var(--text-primary)]">0</p>
            </div>
         </div>
      </div>

      {/* Main Staff Table */}
      <GlassTable columns={columns} data={staff} emptyMessage="No personnel records found for this operational hub" />

      {/* Operational Audit Decor */}
      <div className="p-8 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-sm relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-[0.02] scale-[2.5] pointer-events-none transition-transform duration-1000">
            <Activity size={120} className="text-[var(--text-primary)]" />
         </div>
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-1 max-w-xl">
               <h3 className="text-lg font-bold text-[var(--text-primary)] uppercase tracking-tight">Personnel Audit Registry</h3>
               <p className="text-[10px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider leading-relaxed">
                  Every node interaction performed by authorized staff is cryptographically logged to ensure total hub operational integrity.
               </p>
            </div>
            <button className="px-5 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[10px] font-bold uppercase tracking-widest text-violet-600 hover:text-violet-700 transition-all shadow-sm">
               Archive Logs Console
            </button>
         </div>
      </div>

      {/* Onboarding Modal - Professional B2B */}
      <AnimatePresence>
        {isAddStaffOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setAddStaffOpen(false)}
               className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] z-[70]"
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 10 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 10 }}
               className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-8 z-[80] shadow-2xl flex flex-col gap-6"
            >
               <div className="flex flex-col items-center text-center gap-5">
                  <div className="w-16 h-16 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-600 shadow-sm relative overflow-hidden">
                     <UserPlus size={32} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1 px-4">
                     <h3 className="text-xl font-bold text-[var(--text-primary)] uppercase tracking-tight">Personnel Authorization</h3>
                     <p className="text-[10px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider leading-relaxed">
                        Establishing a new authorized node identifier for Hub operations personnel.
                     </p>
                  </div>
               </div>

               <div className="space-y-5">
                  <div className="space-y-1.5 px-1">
                     <p className="text-[9px] font-bold uppercase tracking-widest text-violet-600">Personnel Legal Name</p>
                     <div className="flex items-center gap-3 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] p-3 rounded-lg focus-within:border-violet-500/30 focus-within:ring-1 focus-within:ring-violet-500/10 transition-all">
                        <User size={16} className="text-[var(--text-tertiary)]" />
                        <input type="text" placeholder="e.g. Rahul Attendant" className="bg-transparent border-none outline-none text-[var(--text-primary)] text-sm font-medium w-full placeholder:text-[var(--text-tertiary)]" />
                     </div>
                  </div>

                  <div className="space-y-1.5 px-1">
                     <p className="text-[9px] font-bold uppercase tracking-widest text-violet-600">Secure Contact Node</p>
                     <div className="flex items-center gap-3 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] p-3 rounded-lg focus-within:border-violet-500/30 focus-within:ring-1 focus-within:ring-violet-500/10 transition-all">
                        <Smartphone size={16} className="text-[var(--text-tertiary)]" />
                        <input type="text" placeholder="+91 00000 00000" className="bg-transparent border-none outline-none text-[var(--text-primary)] text-sm font-medium w-full placeholder:text-[var(--text-tertiary)]" />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5 px-1">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-violet-600">Assigned Privilege</p>
                        <select className="bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] p-3 rounded-lg text-[var(--text-primary)] text-xs font-bold w-full outline-none focus:border-violet-500/30 transition-all appearance-none cursor-pointer">
                           <option>Attendant</option>
                           <option>Manager</option>
                        </select>
                     </div>
                     <div className="space-y-1.5 px-1">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] opacity-60">Provisioned Zone</p>
                        <div className="p-3 bg-[var(--bg-tertiary)]/20 border border-[var(--border-subtle)] rounded-lg flex items-center justify-between text-[var(--text-tertiary)] opacity-50">
                           <span className="text-[10px] font-bold uppercase">HUB-KOR-01</span>
                           <Lock size={12} />
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                     <button 
                        onClick={() => setAddStaffOpen(false)}
                        className="flex-1 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all shadow-sm"
                     >
                        Discard
                     </button>
                     <button 
                        onClick={() => setAddStaffOpen(false)}
                        className="flex-1 py-2.5 rounded-lg bg-violet-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-violet-700 transition-all shadow-lg active:scale-95 shadow-violet-950/20"
                     >
                        Confirm Node
                     </button>
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
