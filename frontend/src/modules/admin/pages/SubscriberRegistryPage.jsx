import React from 'react';
import { 
  Users, 
  UserCheck, 
  ShieldCheck, 
  Search, 
  Filter, 
  MapPin, 
  Activity, 
  Mail, 
  Phone, 
  CreditCard,
  Target,
  ArrowUpRight,
  MoreVertical,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import AdminStatCard from '../components/AdminStatCard';
import OpsFilter from '../components/OpsFilter';
import { useAdminDataStore } from '../store/adminDataStore';

export default function SubscriberRegistryPage() {
  const { subscribers, subscriberStats, fetchSubscriberData } = useAdminDataStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilters, setActiveFilters] = React.useState({ range: 'Last 7 Days' });

  React.useEffect(() => {
    fetchSubscriberData();
  }, []);

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    console.log('Subscriber Registry Sync:', newFilters);
  };

  const handleExport = () => {
    const headers = ['Phone', 'Email', 'Persona', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredSubscribers.map(s => [s.phone, s.email, s.persona, s.status].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredSubscribers = (subscribers || []).filter(s => {
    const q = searchQuery.toLowerCase();
    return (
      (s.name?.toLowerCase() || '').includes(q) || 
      (s.phone || '').includes(q) ||
      (s.email?.toLowerCase() || '').includes(q) ||
      (s.persona?.toLowerCase() || '').includes(q) ||
      (s.id?.toLowerCase() || '').includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="space-y-0.5">
            <div className="flex items-center gap-2">
               <div className="w-1 h-5 bg-emerald-600 rounded-full" />
               <h1 className="text-xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Subscriber <span className="text-emerald-500">Registry</span>
               </h1>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] ml-3">
               Registered Users & Network Nodes
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
                 placeholder="Search Persona/ID/Phone..." 
                 className="pl-8 pr-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[9px] font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all w-48 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50 italic"
               />
            </div>
            <button 
               onClick={handleExport}
               className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
               Full Export
            </button>
         </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <AdminStatCard title="Total Users" value={subscriberStats.totalUsers} icon={Users} color="emerald" subtitle="Active nodes" />
         <AdminStatCard title="Daily Riders" value={subscriberStats.dailyRiders} icon={Activity} color="blue" subtitle="Active today" />
         <AdminStatCard title="KYC Verified" value={subscriberStats.kycVerified} icon={ShieldCheck} color="emerald" subtitle="Identity sync" />
      </div>

      {/* Main Registry Table */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
         <div className="px-6 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-tertiary)]/10">
            <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-wider leading-none italic">Subscriber Database Registry</h3>
            <div className="text-[7.5px] font-black text-emerald-500 uppercase italic animate-pulse">Master Sync Active</div>
         </div>
         
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/20">
                     {['User identity', 'Contact Path', 'Assigned Persona', 'Network Locale', 'Status'].map((header) => (
                        <th key={header} className="py-2.5 px-6 text-[8px] font-black uppercase tracking-widest text-[var(--text-tertiary)] whitespace-nowrap">{header}</th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-[var(--border-subtle)]">
                  {filteredSubscribers.map((user) => (
                     <tr key={user.id} className="group/row hover:bg-[var(--bg-tertiary)]/20 transition-colors text-[10px] cursor-pointer">
                        <td className="py-2.5 px-6 whitespace-nowrap">
                           <div className="flex flex-col">
                              <span className="font-black text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors uppercase tracking-tight italic leading-none">{user.phone}</span>
                           </div>
                        </td>
                        <td className="py-2.5 px-6">
                           <div className="flex flex-col gap-0.5 leading-none">
                              <span className="text-[9px] font-black text-[var(--text-primary)] lowercase group-hover:text-emerald-500 transition-colors italic leading-none">{user.email}</span>
                              <span className="text-[7.5px] font-black text-[var(--text-tertiary)]/50 uppercase italic leading-none">{user.phone}</span>
                           </div>
                        </td>
                        <td className="py-2.5 px-6 font-black text-[var(--text-primary)] uppercase italic leading-none">{user.persona}</td>
                        <td className="py-2.5 px-6 text-[8px] font-black text-[var(--text-tertiary)] uppercase italic leading-none whitespace-nowrap">{user.locale}</td>
                        <td className="py-2.5 px-6">
                           <div className={`inline-flex px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest border leading-none ${
                              user.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' : 
                              user.status === 'active' ? 'bg-blue-500/10 text-blue-500 border-blue-500/10' :
                              'bg-amber-500/10 text-amber-500 border-amber-500/10'
                           }`}>
                              {user.status}
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* Behavioral Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="p-4 bg-emerald-600/5 border border-emerald-500/10 rounded-2xl space-y-2 relative overflow-hidden group border-l-4 border-l-emerald-600">
            <div className="flex items-center gap-3 relative z-10">
               <div className="w-8 h-8 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Target size={16} />
               </div>
               <h4 className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest italic leading-none">Incentive Engine</h4>
            </div>
            <p className="text-[8.5px] text-[var(--text-tertiary)] font-bold leading-relaxed uppercase tracking-widest relative z-10 italic">
               Dynamic reward protocols active. Ranking based on <span className="text-emerald-500 font-black">Loyalty Coefficient 0.4p</span>.
            </p>
         </div>

         <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl flex items-center justify-between shadow-sm border-l-4 border-l-blue-600 group cursor-pointer hover:border-blue-500/30 transition-all">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-inner">
                  <ShieldCheck size={16} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-[var(--text-primary)] uppercase leading-none italic font-black">Audit Terminal</p>
                  <p className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase mt-1 italic tracking-widest leading-none">Security Verification Sync</p>
               </div>
            </div>
            <ChevronRight size={14} className="text-[var(--text-tertiary)]/50 group-hover:translate-x-0.5 transition-transform" />
         </div>
      </div>
    </div>
  );
}
