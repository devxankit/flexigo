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
  ShieldAlert
} from 'lucide-react';
import { motion } from 'framer-motion';
import AdminStatCard from '../components/AdminStatCard';
import { adminDataStore } from '../store/adminDataStore';

export default function SubscriberRegistryPage() {
  const { networkStats } = adminDataStore;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
               <h1 className="text-2xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  User <span className="text-emerald-500">Directory</span>
               </h1>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-tertiary)] ml-4">
               Registered Users • Subscriber List
            </p>
         </div>
         
         <div className="flex items-center gap-3">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)] group-focus-within:text-emerald-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search Name/ID..." 
                 className="pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/30 outline-none transition-all w-64 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50"
               />
            </div>
            <button className="p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-tertiary)] hover:text-emerald-500 transition-all">
               <Filter size={18} />
            </button>
         </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
         <AdminStatCard title="Total Users" value={networkStats.totalSubscribers} icon={Users} color="emerald" subtitle="Active accounts" />
         <AdminStatCard title="Daily Riders" value="12,140" icon={Activity} color="blue" subtitle="Active today" />
         <AdminStatCard title="KYC Verified" value="98.2%" icon={UserCheck} color="emerald" subtitle="Identity checked" />
         <AdminStatCard title="Flagged Users" value="142" icon={ShieldAlert} color="rose" subtitle="Account warnings" />
      </div>

      {/* Main Registry Table */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2rem] overflow-hidden shadow-sm">
         <div className="p-8 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <ShieldCheck size={20} />
               </div>
               <div>
                  <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">Subscriber Database</h3>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase mt-1 tracking-widest italic animate-pulse">Master Sync Active</p>
               </div>
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-xl bg-emerald-500/5 hover:bg-emerald-600 hover:text-white transition-all shadow-xl shadow-emerald-950/20 active:scale-95">
               Full User Export
            </button>
         </div>
         
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/30">
                     {['User identity', 'Contact Path', 'Assigned Persona', 'Network Locale', 'Status', 'Actions'].map((header) => (
                        <th key={header} className="py-5 px-8 text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-tertiary)] whitespace-nowrap">{header}</th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-[var(--border-subtle)]">
                  {[
                    { id: 'USR-9021', name: 'Arjun Kapur', email: 'arjun.k@corp.com', phone: '+91 91234 56780', persona: 'High-Value Rider', location: 'Maharashtra_Alpha_4', status: 'verified' },
                    { id: 'USR-4412', name: 'Zeba Khan', email: 'zeba.khan@node.in', phone: '+91 88765 43210', persona: 'Merchant Partner', location: 'Maharashtra_Alpha_4', status: 'verified' },
                    { id: 'USR-7721', name: 'Vikram Singh', email: 'vikram.s@flexigo.com', phone: '+91 99887 66554', persona: 'Corporate Enterprise', location: 'Maharashtra_Alpha_1', status: 'warning' },
                    { id: 'USR-1029', name: 'Priya Mani', email: 'priya.m@tech.com', phone: '+91 91234 11223', persona: 'Daily Subscriber', location: 'Maharashtra_Alpha_2', status: 'verified' }
                  ].map((user) => (
                     <tr key={user.id} className="group/row hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                        <td className="py-6 px-8 whitespace-nowrap">
                           <div className="flex flex-col gap-0.5">
                              <span className="text-xs font-black text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{user.name}</span>
                              <span className="text-[8px] font-bold text-[var(--text-tertiary)] tracking-widest leading-none mt-1">{user.id} Registry</span>
                           </div>
                        </td>
                        <td className="py-6 px-8">
                           <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2 text-[9px] font-bold text-[var(--text-primary)] lowercase tracking-widest italic group-hover:text-emerald-500 transition-colors"><Mail size={10} strokeWidth={3} /> {user.email}</div>
                              <div className="flex items-center gap-2 text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest"><Phone size={10} strokeWidth={3} /> {user.phone}</div>
                           </div>
                        </td>
                        <td className="py-6 px-8 text-[11px] font-black text-[var(--text-primary)] uppercase tracking-tight">{user.persona}</td>
                        <td className="py-6 px-8 text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest italic leading-none">{user.location}</td>
                        <td className="py-6 px-8">
                           <div className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              user.status === 'verified' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                           }`}>
                              {user.status} Access
                           </div>
                        </td>
                        <td className="py-6 px-8">
                           <div className="flex items-center gap-2">
                              <button className="p-2 bg-[var(--bg-tertiary)] hover:bg-emerald-600/10 border border-[var(--border-subtle)] hover:border-emerald-500/20 rounded-xl text-[var(--text-tertiary)] hover:text-emerald-500 transition-all group/btn">
                                 <Activity size={14} className="group-hover/btn:scale-110 transition-transform" />
                              </button>
                              <button className="p-2 bg-[var(--bg-tertiary)] hover:bg-emerald-600/10 border border-[var(--border-subtle)] hover:border-emerald-500/20 rounded-xl text-[var(--text-tertiary)] hover:text-emerald-500 transition-all">
                                 <MoreVertical size={14} />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* Behavioral Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="p-8 bg-emerald-600/5 border border-emerald-500/10 rounded-[2rem] space-y-4 relative overflow-hidden group hover:border-emerald-500/40 transition-all shadow-sm">
            <div className="flex items-center gap-4 mb-4 relative z-10">
               <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Target size={20} />
               </div>
               <h4 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">Network Incentive Engine</h4>
            </div>
            <p className="text-[11px] text-[var(--text-tertiary)] font-bold leading-relaxed uppercase tracking-[0.2em] relative z-10 italic">
               Currently running dynamic reward protocols for high-SOH behavior. All subscribers are being ranked based on <span className="text-emerald-500">Loyalty Coefficient 0.4p</span>.
            </p>
         </div>

         <div className="p-8 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2rem] space-y-6 flex flex-col justify-between shadow-sm relative overflow-hidden border-t-4 border-t-emerald-600">
            <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
               <ShieldCheck size={100} />
            </div>
            <div className="flex items-center justify-between mb-4 relative z-10">
               <h3 className="text-xl font-black text-[var(--text-primary)] uppercase italic tracking-tighter">Handover Verification</h3>
               <button className="p-2 bg-emerald-600/10 border border-emerald-500/20 rounded-xl text-emerald-500"><ArrowUpRight size={16} /></button>
            </div>
            <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.3em] relative z-10">Security audit of all physical asset handovers. Verification required for 14 active sessions.</p>
            <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-950/30 hover:bg-emerald-700 transition-all active:scale-95 relative z-10">
               Access Audit Terminal
            </button>
         </div>
      </div>
    </div>
  );
}
