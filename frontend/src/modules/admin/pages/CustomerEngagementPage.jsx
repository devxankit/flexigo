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
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="space-y-0.5">
            <div className="flex items-center gap-2">
               <div className="w-1 h-5 bg-emerald-600 rounded-full" />
                <h1 className="text-xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                   Support & <span className="text-emerald-500">Service</span>
                </h1>
             </div>
             <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] ml-3">
                Ticket Desk & Campaign Hub
             </p>
         </div>
         
         <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md active:scale-95 flex items-center gap-1.5">
               <Plus size={12} /> New Campaign
            </button>
            <button className="px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] text-[9px] font-black uppercase tracking-widest hover:bg-[var(--bg-tertiary)] transition-all flex items-center gap-1.5 shadow-sm">
               <Mail size={12} /> Broadcast
            </button>
         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <AdminStatCard title="Open Tickets" value="12" icon={MessageSquare} color="amber" subtitle="Pending Alpha" />
         <AdminStatCard title="Live Promo" value="08" icon={Ticket} color="emerald" subtitle="Active Nodes" />
         <AdminStatCard title="CSAT Score" value="94.2%" icon={Star} color="blue" subtitle="Satisfaction Index" />
         <AdminStatCard title="SLA Ready" value="14m" icon={Clock} color="emerald" subtitle="Avg Respond" />
      </div>

      {/* Tabbed Navigation */}
      <div className="flex border-b border-[var(--border-subtle)] gap-6">
         {['tickets', 'coupons', 'crm', 'feedback'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-1 text-[9px] font-black uppercase tracking-widest transition-all relative italic ${
                activeTab === tab ? 'text-emerald-500' : 'text-[var(--text-tertiary)] hover:text-emerald-500'
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
         <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-tertiary)]/10">
               <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-wider leading-none italic">
                  {activeTab === 'tickets' ? 'Support Payload Registry' : 'Active Promo Code Registry'}
               </h3>
               <div className="relative group">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-tertiary)] group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Quick Search..." 
                    className="pl-8 pr-3 py-1.5 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-lg text-[9px] font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none w-32 transition-all text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50"
                  />
               </div>
            </div>
            
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full">
                  <thead>
                     <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/20">
                        {activeTab === 'tickets' ? (
                           ['ID', 'Entity', 'Category', 'Priority', 'SLA', 'Status'].map((header) => (
                              <th key={header} className="text-left py-2.5 px-6 text-[8px] font-black uppercase tracking-widest text-[var(--text-tertiary)] whitespace-nowrap">{header}</th>
                           ))
                        ) : (
                           ['Code', 'Value', 'Usage', 'Expiry', 'Status'].map((header) => (
                              <th key={header} className="text-left py-2.5 px-6 text-[8px] font-black uppercase tracking-widest text-[var(--text-tertiary)] whitespace-nowrap">{header}</th>
                           ))
                        )}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                     {activeTab === 'tickets' ? (
                        mockTickets.map((tck) => (
                           <tr key={tck.id} className="group/row hover:bg-[var(--bg-tertiary)]/20 transition-colors cursor-pointer text-[10px]">
                              <td className="py-2.5 px-6 font-black text-[7.5px] text-[var(--text-tertiary)] uppercase tracking-widest leading-none">{tck.id}</td>
                              <td className="py-2.5 px-6 whitespace-nowrap">
                                 <span className="font-black text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors uppercase tracking-tight italic leading-none">{tck.user}</span>
                              </td>
                              <td className="py-2.5 px-6 text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-wider leading-none">{tck.category}</td>
                              <td className="py-2.5 px-6">
                                 <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded border leading-none ${
                                    tck.priority === 'high' ? 'bg-rose-500/10 text-rose-500 border-rose-500/10' : 
                                    tck.priority === 'medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/10' :
                                    'bg-blue-500/10 text-blue-500 border-blue-500/10'
                                 }`}>
                                    {tck.priority}
                                 </span>
                              </td>
                              <td className="py-2.5 px-6 text-[7.5px] font-black text-[var(--text-tertiary)] uppercase italic leading-none">{tck.time}</td>
                              <td className="py-2.5 px-6">
                                 <div className={`inline-flex px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest border leading-none ${
                                    tck.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' : 
                                    tck.status === 'in-progress' ? 'bg-amber-500/10 text-amber-500 border-amber-500/10' : 
                                    'bg-rose-500/10 text-rose-500 border-rose-500/10'
                                 }`}>
                                    {tck.status}
                                 </div>
                              </td>
                           </tr>
                        ))
                     ) : (
                        mockCoupons.map((cp) => (
                           <tr key={cp.code} className="group/row hover:bg-[var(--bg-tertiary)]/20 transition-colors cursor-pointer text-[10px]">
                              <td className="py-2.5 px-6 font-black text-[9px] text-emerald-500 uppercase tracking-widest italic leading-none">{cp.code}</td>
                              <td className="py-2.5 px-6 text-[9px] font-black text-[var(--text-primary)] uppercase leading-none">{cp.discount}</td>
                              <td className="py-2.5 px-6 text-[7.5px] font-black text-[var(--text-tertiary)] uppercase leading-none">{cp.usage} Vol</td>
                              <td className="py-2.5 px-6 text-[7.5px] font-black text-[var(--text-tertiary)] uppercase italic leading-none">{cp.expiry}</td>
                              <td className="py-2.5 px-6">
                                 <div className={`inline-flex px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest border leading-none ${
                                    cp.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' : 'bg-slate-500/10 text-slate-500 border-slate-500/10'
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
         <div className="space-y-4">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-5 shadow-sm border-t-4 border-t-emerald-600">
               <div className="flex items-center justify-between mb-6 pb-2 border-b border-[var(--border-subtle)]">
                  <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-widest italic leading-none">Loyalty Health</h3>
                  <div className="text-[7.5px] font-black text-emerald-500 uppercase italic">MTD Delta</div>
               </div>

               <div className="space-y-3">
                  {[
                    { label: 'Retention Target', rate: '92%', val: 92 },
                    { label: 'Redemption Flow', rate: '14/hr', val: 68 },
                    { label: 'Reply SLA Gap', rate: '4s', val: 94 },
                  ].map((stat) => (
                    <div key={stat.label} className="p-3 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-xl cursor-pointer hover:border-emerald-500/30 transition-all">
                       <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[9px] font-black text-[var(--text-primary)] uppercase tracking-widest leading-none italic">{stat.label}</span>
                          <span className="text-[10px] font-black text-emerald-500 italic tracking-tight">{stat.rate}</span>
                       </div>
                       <div className="w-full h-1 bg-[var(--bg-secondary)] rounded-full overflow-hidden shadow-inner border border-[var(--border-subtle)]">
                          <div className="h-full bg-emerald-500 transition-all" style={{ width: `${stat.val}%` }} />
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-6 p-3 bg-emerald-600/5 border border-emerald-500/10 rounded-xl space-y-2 relative overflow-hidden group">
                  <div className="absolute right-0 top-0 p-2 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform">
                     <Zap size={30} />
                  </div>
                  <div className="flex items-center gap-1.5">
                     <CheckCircle2 size={12} className="text-emerald-600" />
                     <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest italic leading-none">Campaign Pulse</p>
                  </div>
                  <p className="text-[8px] text-[var(--text-tertiary)] font-bold leading-relaxed uppercase tracking-wider italic">
                     Active coupons boosted onboarding by <span className="text-emerald-500 font-black">18.2%</span>.
                  </p>
               </div>
            </div>

            {/* Support Strip */}
            <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl flex items-center justify-between group cursor-pointer hover:border-emerald-500/30 transition-all shadow-sm border-l-4 border-l-emerald-600">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600/10 text-emerald-500 rounded-lg shadow-inner group-hover:rotate-12 transition-transform">
                     <Users size={16} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-[var(--text-primary)] uppercase leading-none italic">Customer CRM</p>
                     <p className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase mt-1 italic tracking-widest">Identity Registry</p>
                  </div>
               </div>
               <ChevronRight size={14} className="text-[var(--text-tertiary)]/50 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
            </div>
         </div>
      </div>
    </div>
  );
}
