import React, { useEffect } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  UserCircle, 
  ShieldAlert, 
  Key, 
  Search, 
  History,
  Terminal,
  Globe,
  ChevronRight,
  Activity,
  Plus,
  Users
} from 'lucide-react';
import AdminStatCard from '../components/AdminStatCard';
import OpsFilter from '../components/OpsFilter';
import { useAdminDataStore } from '../store/adminDataStore';



export default function SecurityAuditsPage() {
  const { auditLogs, securityStats, fetchSecurityData, roles, fetchRoles, togglePermission, addRole, updateRole } = useAdminDataStore();
  const [activeFilters, setActiveFilters] = React.useState({ range: 'Last 7 Days' });
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newRole, setNewRole] = React.useState({ name: '', permissions: '' });

  useEffect(() => {
    fetchSecurityData(activeFilters);
    fetchRoles(activeFilters);
  }, []);

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    fetchSecurityData(newFilters);
    console.log('Security Audits Sync:', newFilters);
  };

  const handleAddRole = async (e) => {
    e.preventDefault();
    if (!newRole.name) return;
    
    await addRole({ name: newRole.name });
    setNewRole({ name: '', permissions: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="space-y-0.5">
            <div className="flex items-center gap-2">
               <div className="w-1 h-5 bg-emerald-600 rounded-full" />
               <h1 className="text-xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Security <span className="text-emerald-500">& Audits</span>
               </h1>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] ml-3">
               Safety Logs & Master Command Registry
            </p>
         </div>
         
         <div className="flex items-center gap-2">
            <OpsFilter onFilterChange={handleFilterChange} />
            <button 
               onClick={() => setIsModalOpen(true)}
               className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
               <Plus size={12} /> New Role
            </button>

         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <AdminStatCard title="Active Sessions" value={securityStats.activeSessions} icon={Users} color="emerald" subtitle="Auth Hosts" />
         <AdminStatCard title="Auth Failures" value={securityStats.authFailures} icon={ShieldAlert} color="rose" subtitle="Last 24 Delta" />
         <AdminStatCard title="Integrity" value={securityStats.integrity} icon={ShieldCheck} color="emerald" subtitle="System Consistency" />
         <AdminStatCard title="Global Nodes" value={securityStats.globalNodes} icon={Globe} color="blue" subtitle="Whitelisted IP" />
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
                     <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/5">
                        {['Identity', 'Action Profile', 'Object Target', 'Sync', 'Origin IP'].map((header) => (
                           <th key={header} className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-secondary)] whitespace-nowrap">{header}</th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                     {auditLogs.map((log) => (
                        <tr key={log.id} className="group/row hover:bg-[var(--bg-tertiary)]/10 transition-colors text-sm">
                           <td className="py-2 px-4 font-medium text-[var(--text-primary)]">{log.identity}</td>
                           <td className="py-2 px-4 font-medium text-[var(--text-tertiary)]">{log.action}</td>
                           <td className="py-2 px-4 font-medium text-emerald-500">{log.target}</td>
                           <td className="py-2 px-4  font-medium text-[var(--text-tertiary)]">{new Date(log.time).toLocaleDateString()}</td>
                           <td className="py-2 px-4  font-medium text-[var(--text-tertiary)]   opacity-50">{log.ip}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Role RBAC Matrix Panel */}
         <div className="lg:col-span-3 space-y-4">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-sm border-t-4 border-t-emerald-600">
               <div className="flex items-center justify-between mb-8 pb-3 border-b border-[var(--border-subtle)]">
                  <div>
                    <h3 className="text-[14px] font-black text-[var(--text-primary)] uppercase tracking-widest italic leading-none">Global Security Matrix</h3>
                    <p className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] mt-1.5">Master Protocol & Access Configuration</p>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-black text-emerald-500 uppercase italic animate-pulse leading-none bg-emerald-500/5 px-2 py-1 rounded-full border border-emerald-500/10">
                     <Lock size={12} /> Secure Protocol Active
                  </div>
               </div>

               <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="p-3 text-left bg-[var(--bg-tertiary)]/30 border border-[var(--border-subtle)] rounded-tl-xl text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] italic">Role Designator</th>
                        {['Dashboard', 'Hubs', 'Fleet', 'KYC', 'Plans', 'Subscribers', 'Geofencing', 'Finance', 'Inventory', 'Franchise', 'Compliance', 'Engagement', 'Security', 'Staff'].map(mod => (
                          <th key={mod} className="p-3 text-center bg-[var(--bg-tertiary)]/20 border border-[var(--border-subtle)] text-[9px] font-black uppercase tracking-widest text-[var(--text-primary)] italic min-w-[100px]">{mod}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {roles.map((role) => (
                        <tr key={role._id} className="hover:bg-[var(--bg-tertiary)]/10 transition-colors">
                          <td className="p-3 border border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/10">
                            <div className="flex items-center gap-2">
                              <UserCircle size={14} className="text-emerald-500" />
                              <span className="text-[11px] font-black text-[var(--text-primary)] uppercase italic">{role.name}</span>
                            </div>
                          </td>
                          {['Dashboard', 'Hubs', 'Fleet', 'KYC', 'Plans', 'Subscribers', 'Geofencing', 'Finance', 'Inventory', 'Franchise', 'Compliance', 'Engagement', 'Security', 'Staff'].map(mod => (
                            <td key={mod} className="p-3 border border-[var(--border-subtle)] relative z-10">
                              <div className="grid grid-cols-1 gap-2">
                                {['read', 'create', 'update', 'delete'].map(action => {
                                  const isActive = role.permissions && role.permissions[mod] && role.permissions[mod][action];
                                  return (
                                    <button 
                                      key={action} 
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const roleId = role._id || role.id;
                                        console.log(`Executing Atomic Toggle: ${mod} -> ${action}`);
                                        togglePermission(roleId, mod, action);
                                      }}
                                      className="flex items-center gap-2 cursor-pointer group select-none py-1 px-1 rounded hover:bg-emerald-500/5 transition-all text-left w-full"
                                    >
                                      <div className={`w-3 h-3 rounded border transition-all flex items-center justify-center pointer-events-none ${isActive ? 'bg-emerald-600 border-emerald-600' : 'bg-[var(--bg-tertiary)] border-[var(--border-subtle)] group-hover:border-emerald-500/50'}`}>
                                        {isActive && <ShieldCheck className="text-white w-2 h-2" />}
                                      </div>
                                      <span className={`text-[8px] font-black uppercase tracking-widest italic transition-colors pointer-events-none ${isActive ? 'text-emerald-500' : 'text-[var(--text-tertiary)] group-hover:text-emerald-500/70'}`}>
                                        {action}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>

               <div className="mt-8 flex items-center justify-between">
                 <div className="p-3 bg-emerald-600/5 border border-emerald-500/10 rounded-xl space-y-1.5 relative overflow-hidden group max-w-md">
                    <div className="absolute right-0 top-0 p-2 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform">
                       <ShieldAlert size={40} />
                    </div>
                    <div className="flex items-center gap-1.5">
                       <Activity size={10} className="text-emerald-600" />
                       <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest italic leading-none">Security Protocol Guard</p>
                    </div>
                    <p className="text-[8px] text-[var(--text-tertiary)] font-bold leading-relaxed uppercase tracking-wider italic">
                       RBAC Matrix is enforced via JWT claims. Any modification is logged to the Audit Registry with a cryptographic signature.
                    </p>
                 </div>
                 
                 <div className="flex items-center gap-3">
                   <div className="flex flex-col items-end">
                     <span className="text-[8px] font-black text-[var(--text-tertiary)] uppercase italic tracking-widest">Active System Nodes</span>
                     <span className="text-[12px] font-black text-emerald-500 italic uppercase">14 Dynamic Modules</span>
                   </div>
                   <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                     <ShieldCheck size={20} />
                   </div>
                 </div>
               </div>
            </div>
         </div>
      </div>
      
      <RoleModal 
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         onSave={handleAddRole}
         newRole={newRole}
         setNewRole={setNewRole}
      />
    </div>
  );
}

// Security Modal Implementation
import { X, Zap as ZapIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

function RoleModal({ isOpen, onClose, onSave, newRole, setNewRole }) {
   return (
      <AnimatePresence>
         {isOpen && (
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
                            New Role <span className="text-emerald-500">Initiator</span>
                         </h2>
                        <p className="text-[8px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">SECTION: ACCESS_GUARD_V3</p>
                     </div>
                     <button onClick={onClose} className="p-1.5 hover:bg-rose-600/10 hover:text-rose-500 transition-all rounded-lg">
                        <X size={18} />
                     </button>
                  </div>

                  <form onSubmit={onSave} className="space-y-6">
                     <div className="space-y-4">
                        <div className="space-y-1.5">
                           <label className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Role Designation</label>
                           <input 
                              autoFocus
                              value={newRole.name}
                              onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                              placeholder="e.g. Lead Auditor"
                              className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all italic"
                           />
                        </div>
                     </div>
                     <button 
                        type="submit"
                        className="w-full py-3 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-950/20 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                     >
                        <ZapIcon size={14} fill="white" /> Execute Role Sync
                     </button>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
   );
}
