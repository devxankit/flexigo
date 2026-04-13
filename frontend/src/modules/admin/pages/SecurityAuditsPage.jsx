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
  Globe,
  ChevronRight,
  Activity
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
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="space-y-0.5">
            <div className="flex items-center gap-2">
               <div className="w-1 h-5 bg-emerald-600 rounded-full" />
               <h1 className="text-xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Security & <span className="text-emerald-500">Audits</span>
               </h1>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] ml-3">
               Safety Logs & Master Command Registry
            </p>
         </div>
         
         <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md active:scale-95 flex items-center gap-1.5">
               <Key size={12} /> New Role
            </button>
            <button className="px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] text-[9px] font-black uppercase tracking-widest hover:bg-[var(--bg-tertiary)] transition-all flex items-center gap-1.5 shadow-sm">
               <Terminal size={12} /> System Logs
            </button>
         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <AdminStatCard title="Active Sessions" value="21" icon={UserCircle} color="emerald" subtitle="Auth Hosts" />
         <AdminStatCard title="Auth Failures" value="0" icon={ShieldAlert} color="rose" subtitle="Last 24 Delta" />
         <AdminStatCard title="Integrity" value="Pass" icon={ShieldCheck} color="emerald" subtitle="System Consistency" />
         <AdminStatCard title="Global Nodes" value="08" icon={Globe} color="blue" subtitle="Whitelisted IP" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Audit Trail Registry */}
         <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-tertiary)]/10">
               <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-wider leading-none italic">Master Command Payload Registry</h3>
               <div className="relative group">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-tertiary)] group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search Logs..." 
                    className="pl-8 pr-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[9px] font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all w-32 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50 italic"
                  />
               </div>
            </div>
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full">
                  <thead>
                     <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/20">
                        {['Identity', 'Action Profile', 'Object Target', 'Sync', 'Origin IP'].map((header) => (
                           <th key={header} className="text-left py-2.5 px-6 text-[8px] font-black uppercase tracking-widest text-[var(--text-tertiary)] whitespace-nowrap">{header}</th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                     {mockAuditLogs.map((log) => (
                        <tr key={log.id} className="group/row hover:bg-[var(--bg-tertiary)]/20 transition-colors text-[10px]">
                           <td className="py-2.5 px-6 font-black text-[var(--text-primary)] uppercase tracking-widest italic leading-none">{log.user}</td>
                           <td className="py-2.5 px-6 font-black text-[var(--text-tertiary)] uppercase tracking-widest leading-none italic">{log.action}</td>
                           <td className="py-2.5 px-6 font-black text-emerald-500 tracking-tight leading-none italic">{log.target}</td>
                           <td className="py-2.5 px-6 text-[8px] font-black text-[var(--text-tertiary)] uppercase italic leading-none whitespace-nowrap">{log.time}</td>
                           <td className="py-2.5 px-6 text-[8px] font-black text-[var(--text-tertiary)]/50 font-mono leading-none">{log.ip}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Role RBAC Panel */}
         <div className="space-y-4">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-5 shadow-sm border-t-4 border-t-emerald-600">
               <div className="flex items-center justify-between mb-6 pb-2 border-b border-[var(--border-subtle)]">
                  <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-widest italic leading-none">RBAC Management</h3>
                  <div className="flex items-center gap-1 text-[8px] font-black text-emerald-500 uppercase italic animate-pulse leading-none">
                     <Lock size={10} /> Secure Node
                  </div>
               </div>

               <div className="space-y-3">
                  {mockRoles.map((role) => (
                     <div key={role.id} className="p-3 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-xl group hover:border-emerald-500/30 transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-1.5">
                           <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-tight italic leading-none">{role.name}</span>
                        </div>
                        <div className="flex items-center justify-between text-[7px] font-black uppercase tracking-widest italic leading-none opacity-50">
                           <span>{role.permissions}</span>
                           <span className="text-emerald-500">{role.users} Active</span>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="mt-6 p-3 bg-emerald-600/5 border border-emerald-500/10 rounded-xl space-y-1.5 relative overflow-hidden group">
                  <div className="absolute right-0 top-0 p-2 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform">
                     <ShieldAlert size={40} />
                  </div>
                  <div className="flex items-center gap-1.5">
                     <Activity size={10} className="text-emerald-600" />
                     <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest italic leading-none">Protocol Guard</p>
                  </div>
                  <p className="text-[8.5px] text-[var(--text-tertiary)] font-bold leading-relaxed uppercase tracking-wider italic">
                     Strict RBAC is enforced. Actions are cryptographically hashed.
                  </p>
               </div>
            </div>

            {/* Quick Audit Strip */}
            <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl flex items-center justify-between group cursor-pointer hover:border-emerald-500/30 transition-all shadow-sm border-l-4 border-l-emerald-600">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600/10 text-emerald-500 rounded-lg group-hover:rotate-12 transition-transform shadow-inner">
                     <History size={18} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-[var(--text-primary)] uppercase leading-none italic font-black">Archival Export</p>
                     <p className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase mt-1 italic tracking-widest leading-none">Governance Report</p>
                  </div>
               </div>
               <ChevronRight size={14} className="text-[var(--text-tertiary)]/50 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
            </div>
         </div>
      </div>
    </div>
  );
}
