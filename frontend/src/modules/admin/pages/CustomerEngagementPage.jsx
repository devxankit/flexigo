import React, { useState } from 'react';
import { 
  Ticket, 
  MessageSquare, 
  Users, 
  Percent, 
  ChevronRight, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Eye,
  Mail,
  Zap,
  Star
} from 'lucide-react';
import AdminStatCard from '../components/AdminStatCard';
import { motion } from 'framer-motion';

const mockTickets = [
  { id: 'TCK-201', user: 'Raj Malhotra', category: 'Wallet', priority: 'high', time: '12m ago', status: 'open' },
  { id: 'TCK-202', user: 'Sanya Gupta', category: 'Vehicle', priority: 'medium', time: '1h ago', status: 'in-progress' },
  { id: 'TCK-203', user: 'Amit Shah', category: 'Account', priority: 'low', time: '3h ago', status: 'resolved' },
];

const mockCoupons = [
  { code: 'FLEX50', discount: '50%', usage: '1,240', expiry: '12 Apr', status: 'active' },
  { code: 'FIRSTEV', discount: '₹100', usage: '842', expiry: '20 Apr', status: 'active' },
  { code: 'CORP25', discount: '25%', usage: '12', expiry: 'Expired', status: 'inactive' },
];

export default function CustomerEngagementPage() {
  const [activeTab, setActiveTab] = useState('tickets');

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <div className="flex items-center gap-3">
               <div className="w-1 h-6 bg-emerald-600 rounded-full" />
                <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                   Support & <span className="text-emerald-500">Service</span>
                </h1>
             </div>
             <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] ml-4">
                Chat Tickets • Customer Coupons & Feedback
             </p>
         </div>
         
         <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-sm active:scale-95 flex items-center gap-2">
               <Plus size={14} /> New Campaign
            </button>
            <button className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] text-[10px] font-bold uppercase tracking-wider hover:bg-[var(--bg-tertiary)] transition-all flex items-center gap-2 shadow-sm">
               <Mail size={14} /> Broadcast
            </button>
         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <AdminStatCard title="Total Tickets" value="12" icon={MessageSquare} color="amber" subtitle="Pending help" />
         <AdminStatCard title="Active Offers" value="08" icon={Ticket} color="emerald" subtitle="Live promo codes" />
         <AdminStatCard title="Happy Riders" value="94.2%" icon={Star} color="blue" subtitle="Satisfaction score" />
         <AdminStatCard title="Wait Time" value="14m" icon={Clock} color="emerald" subtitle="Average reply" />
      </div>

      {/* Tabbed Navigation */}
      <div className="flex border-b border-[var(--border-subtle)] gap-8">
         {['tickets', 'coupons', 'crm', 'feedback'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${
                activeTab === tab ? 'text-emerald-500' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
              }`}
            >
               {tab}
               {activeTab === tab && (
                  <motion.div layoutId="engagement-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
               )}
            </button>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Main Content Area based on Tab */}
         <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
               <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  {activeTab === 'tickets' ? 'Customer Messages' : 'Coupon Codes'}
               </h3>
               <div className="flex items-center gap-2">
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                     <input 
                       type="text" 
                       placeholder="Search..." 
                       className="pl-9 pr-4 py-1.5 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-lg text-[10px] focus:border-emerald-500 outline-none transition-all"
                     />
                  </div>
               </div>
            </div>
            
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full">
                  <thead>
                     <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/30">
                        {activeTab === 'tickets' ? (
                           ['Ref ID', 'Rider/User', 'Category', 'Priority', 'SLA', 'Status'].map((header) => (
                              <th key={header} className="text-left py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] px-4 whitespace-nowrap">{header}</th>
                           ))
                        ) : (
                           ['Coupon Code', 'Discount Value', 'Total Usage', 'Expiry Date', 'Status'].map((header) => (
                              <th key={header} className="text-left py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] px-4 whitespace-nowrap">{header}</th>
                           ))
                        )}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                     {activeTab === 'tickets' ? (
                        mockTickets.map((tck) => (
                           <tr key={tck.id} className="group/row hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                              <td className="py-4 px-4 font-bold text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest">{tck.id}</td>
                              <td className="py-4 px-4 whitespace-nowrap">
                                 <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{tck.user}</span>
                              </td>
                              <td className="py-4 px-4 text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">{tck.category}</td>
                              <td className="py-4 px-4">
                                 <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                                    tck.priority === 'high' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                                    tck.priority === 'medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                    'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                 }`}>
                                    {tck.priority}
                                 </span>
                              </td>
                              <td className="py-4 px-4 text-[9px] font-bold text-[var(--text-tertiary)] uppercase">{tck.time}</td>
                              <td className="py-4 px-4">
                                 <div className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                    tck.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-500' : 
                                    tck.status === 'in-progress' ? 'bg-amber-500/10 text-amber-500' : 
                                    'bg-rose-500/10 text-rose-500'
                                 }`}>
                                    {tck.status}
                                 </div>
                              </td>
                           </tr>
                        ))
                     ) : (
                        mockCoupons.map((cp) => (
                           <tr key={cp.code} className="group/row hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                              <td className="py-4 px-4 font-bold text-xs text-emerald-500 uppercase tracking-widest">{cp.code}</td>
                              <td className="py-4 px-4 text-[11px] font-bold text-[var(--text-primary)] uppercase">{cp.discount}</td>
                              <td className="py-4 px-4 text-[10px] font-bold text-[var(--text-tertiary)] uppercase">{cp.usage} Redemptions</td>
                              <td className="py-4 px-4 text-[10px] font-bold text-[var(--text-tertiary)] uppercase">{cp.expiry}</td>
                              <td className="py-4 px-4">
                                 <div className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                    cp.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'
                                 }`}>
                                    {cp.status}
                                 </div>
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         {/* CRM Insights Panel */}
         <div className="space-y-6">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-sm">
               <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border-subtle)]">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Loyalty Health</h3>
                  <div className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">MTD Metrics</div>
               </div>

               <div className="space-y-4">
                  {[
                    { label: 'Retention Target', rate: '92%', status: 'high' },
                    { label: 'Redemption Velocity', rate: '14/hr', status: 'med' },
                    { label: 'Support SLA Gap', rate: '4s', status: 'high' },
                  ].map((stat) => (
                    <div key={stat.label} className="p-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl">
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">{stat.label}</span>
                          <span className={`text-[10px] font-bold ${stat.status === 'high' ? 'text-emerald-500' : 'text-amber-500'}`}>{stat.rate}</span>
                       </div>
                       <div className="w-full h-1 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                          <div className={`h-full ${stat.status === 'high' ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: stat.status === 'high' ? '90%' : '60%' }} />
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-8 p-4 bg-emerald-600/5 border border-emerald-500/10 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                     <CheckCircle2 size={14} className="text-emerald-600" />
                     <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Engagement Boost</p>
                  </div>
                  <p className="text-[10px] text-[var(--text-tertiary)] font-medium leading-relaxed italic">
                     Active first-ride coupons have increased Hub onboarding by <span className="text-emerald-500 font-bold">18.2%</span> this week.
                  </p>
               </div>
            </div>

            {/* Support Strip */}
            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl flex items-center justify-between group cursor-pointer hover:border-emerald-500/30 transition-all">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600/10 text-emerald-500 rounded-lg group-hover:rotate-12 transition-transform">
                     <Users size={18} />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-wider leading-none">Customer CRM</p>
                     <p className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest mt-1">View Full Identity Registry</p>
                  </div>
               </div>
               <ChevronRight size={16} className="text-[var(--text-tertiary)]" />
            </div>
         </div>
      </div>
    </div>
  );
}
