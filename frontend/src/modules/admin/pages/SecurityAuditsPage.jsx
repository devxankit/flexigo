import React from 'react';
import { 
  Lock, 
  ShieldCheck, 
  UserCircle, 
  Eye, 
  Clock, 
  ShieldAlert, 
  Key, 
  Search, 
  Filter, 
  History,
  MoreVertical,
  Terminal,
  Zap,
  Globe
} from 'lucide-react';
import AdminStatCard from '../components/AdminStatCard';

const mockAuditLogs = [
  { id: 'LOG-8812', user: 'admin_rahul', action: 'Vehicle Cutoff', target: 'EV-9021', time: '2m ago', ip: '192.168.1.1' },
  { id: 'LOG-8811', user: 'ops_zeba', action: 'Role Update', target: 'Fleet Manager', time: '14m ago', ip: '10.0.0.42' },
  { id: 'LOG-8810', user: 'root_admin', action: 'Auth Token Reset', target: 'System Core', time: '1h ago', ip: '172.16.254.1' },
  { id: 'LOG-8809', user: 'admin_rahul', action: 'Export Report', target: 'Financials MTD', time: '3h ago', ip: '192.168.1.1' },
];

const mockRoles = [
  { id: 'R-01', name: 'Super Admin', permissions: 'Full Access', users: 2 },
  { id: 'R-02', name: 'Fleet Manager', permissions: 'GPS, Control, Geo', users: 8 },
  { id: 'R-03', name: 'Financial Auditor', permissions: 'Payments, Revenue', users: 3 },
  { id: 'R-04', name: 'Onboarding Agent', permissions: 'KYC, Subscribers', users: 14 },
];

export default function SecurityAuditsPage() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <div className="flex items-center gap-3">
               <div className="w-1 h-6 bg-emerald-600 rounded-full" />
               <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                  Security & <span className="text-emerald-500">Audits</span>
               </h1>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] ml-4">
               Safety Logs • Master Command Audit Log
            </p>
         </div>
         
         <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-sm active:scale-95 flex items-center gap-2">
               <Key size={14} /> New Security Role
            </button>
            <button className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] text-[10px] font-bold uppercase tracking-wider hover:bg-[var(--bg-tertiary)] transition-all flex items-center gap-2">
               <Terminal size={14} /> System Logs
            </button>
         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <AdminStatCard title="Active Sessions" value="21" icon={UserCircle} color="emerald" subtitle="Authenticated Hosts" />
         <AdminStatCard title="Auth Failures" value="0" icon={ShieldAlert} color="rose" subtitle="Last 24 Hours" />
         <AdminStatCard title="Integrity Check" value="Pass" icon={ShieldCheck} color="emerald" subtitle="System Consistency" />
         <AdminStatCard title="Global IP Nodes" value="08" icon={Globe} color="blue" subtitle="Whitelisted Ranges" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Audit Trail Registry */}
         <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
               <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Master Command Log</h3>
               <div className="flex items-center gap-2">
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                     <input 
                       type="text" 
                       placeholder="Search Logs..." 
                       className="pl-9 pr-4 py-1.5 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-lg text-[10px] focus:border-emerald-500 outline-none transition-all"
                     />
                  </div>
               </div>
            </div>
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full">
                  <thead>
                     <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/30">
                        {['Identity', 'Action Profile', 'Object Target', 'Timestamp', 'Origin IP'].map((header) => (
                           <th key={header} className="text-left py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] px-4 whitespace-nowrap">{header}</th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                     {mockAuditLogs.map((log) => (
                        <tr key={log.id} className="group/row hover:bg-[var(--bg-tertiary)]/30 transition-colors">
                           <td className="py-4 px-4 font-bold text-[10px] text-[var(--text-primary)] uppercase tracking-widest">{log.user}</td>
                           <td className="py-4 px-4">
                              <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">{log.action}</span>
                           </td>
                           <td className="py-4 px-4 text-xs font-bold text-emerald-500">{log.target}</td>
                           <td className="py-4 px-4 text-[10px] font-bold text-[var(--text-tertiary)] uppercase">{log.time}</td>
                           <td className="py-4 px-4 text-[10px] font-bold text-[var(--text-tertiary)] font-mono">{log.ip}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Role RBAC Panel */}
         <div className="space-y-6">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-sm">
               <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border-subtle)]">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">RBAC Management</h3>
                  <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
                     <Lock size={12} /> Encrypted
                  </div>
               </div>

               <div className="space-y-4">
                  {mockRoles.map((role) => (
                     <div key={role.id} className="p-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl group hover:border-emerald-500/30 transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                           <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-tight">{role.name}</span>
                           <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">{role.users} Active</span>
                        </div>
                        <p className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase">{role.permissions}</p>
                     </div>
                  ))}
               </div>

               <div className="mt-8 p-4 bg-emerald-600/5 border border-emerald-500/10 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                     <ShieldAlert size={14} className="text-emerald-600" />
                     <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Protocol Guard</p>
                  </div>
                  <p className="text-[10px] text-[var(--text-tertiary)] font-medium leading-relaxed italic">
                     Strict Role-Based Access Control is enforced. All high-privilege actions are cryptographically hashed in the audit store.
                  </p>
               </div>
            </div>

            {/* Quick Audit Strip */}
            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl flex items-center justify-between group cursor-pointer hover:border-emerald-500/30 transition-all">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600/10 text-emerald-500 rounded-lg group-hover:scale-110 transition-transform">
                     <History size={18} />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-wider leading-none">Archival Export</p>
                     <p className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest mt-1">Download Governance Report</p>
                  </div>
               </div>
               <MoreVertical size={16} className="text-[var(--text-tertiary)]" />
            </div>
         </div>
      </div>
    </div>
  );
}
