import React from 'react';
import { 
  Layers, 
  Store, 
  MapPin, 
  Truck, 
  Wallet, 
  BarChart3, 
  TrendingUp, 
  ArrowUpRight, 
  Building2,
  Clock,
  CheckCircle2,
  Users
} from 'lucide-react';
import AdminStatCard from '../components/AdminStatCard';

const mockFranchises = [
  { id: 'FR-101', name: 'Nexus Hubs Bangalore', city: 'Bangalore', hubs: 3, payout: '₹4,20,000', status: 'settled' },
  { id: 'FR-102', name: 'Urban Green Fleet', city: 'Mumbai', hubs: 1, payout: '₹1,15,000', status: 'pending' },
  { id: 'FR-103', name: 'Elite 3PL Logistics', city: 'Pune', hubs: 5, payout: '₹12,40,000', status: 'processing' },
  { id: 'FR-104', name: 'Metro Mobility', city: 'Delhi', hubs: 2, payout: '₹3,80,000', status: 'settled' },
];

export default function FranchiseOpsPage() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <div className="flex items-center gap-3">
               <div className="w-1 h-6 bg-emerald-600 rounded-full" />
               <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                  Franchise & <span className="text-emerald-500">3PL Ops</span>
               </h1>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] ml-4">
               Centralized Partner Control • Net Payout Tracking
            </p>
         </div>
         
         <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-sm active:scale-95 flex items-center gap-2">
               <Store size={14} /> Onboard Franchise
            </button>
            <button className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] text-[10px] font-bold uppercase tracking-wider hover:bg-[var(--bg-tertiary)] transition-all flex items-center gap-2 shadow-sm">
               <Truck size={14} /> 3PL Integration
            </button>
         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <AdminStatCard title="Total Partners" value="124" icon={Users} color="emerald" subtitle="Franchise + 3PL" />
         <AdminStatCard title="Partner Payouts" value="₹84.2L" icon={Wallet} color="blue" subtitle="Gross Settlement (MTD)" />
         <AdminStatCard title="Operating Hubs" value="312" icon={Building2} color="emerald" subtitle="Active Regional Nodes" />
         <AdminStatCard title="Growth Rate" value="+12%" icon={TrendingUp} color="emerald" subtitle="Quarterly Expansion" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Franchise Ledger */}
         <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
               <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Partner Performance Ledger</h3>
               <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold uppercase tracking-widest bg-emerald-600/5 px-3 py-1 rounded-full border border-emerald-500/10">
                  Net Payout View
               </div>
            </div>
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full">
                  <thead>
                     <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/30">
                        {['Partner Identity', 'City Node', 'Hub Count', 'Net Payout', 'Status', 'Sync'].map((header) => (
                           <th key={header} className="text-left py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] px-4 whitespace-nowrap">{header}</th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                     {mockFranchises.map((fr) => (
                        <tr key={fr.id} className="group/row hover:bg-[var(--bg-tertiary)]/30 transition-colors cursor-pointer">
                           <td className="py-4 px-4 font-bold">
                              <div className="flex flex-col gap-0.5">
                                 <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{fr.name}</span>
                                 <span className="text-[9px] font-bold text-[var(--text-tertiary)] tracking-widest leading-none">{fr.id}</span>
                              </div>
                           </td>
                           <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                 <MapPin size={12} className="text-emerald-500" />
                                 <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase">{fr.city}</span>
                              </div>
                           </td>
                           <td className="py-4 px-4 font-bold text-xs text-[var(--text-primary)]">{fr.hubs}</td>
                           <td className="py-4 px-4 font-bold text-xs text-emerald-500 italic">{fr.payout}</td>
                           <td className="py-4 px-4">
                              <div className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                 fr.status === 'settled' ? 'bg-emerald-500/10 text-emerald-500' : 
                                 fr.status === 'processing' ? 'bg-amber-500/10 text-amber-500 animate-pulse' : 
                                 'bg-slate-500/10 text-slate-500'
                              }`}>
                                 {fr.status}
                              </div>
                           </td>
                           <td className="py-4 px-4 text-right">
                              <ArrowUpRight size={14} className="text-[var(--text-tertiary)] group-hover:text-emerald-500 transition-all" />
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* 3PL Integration Panel */}
         <div className="space-y-6">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-sm">
               <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border-subtle)]">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">3PL Integrations</h3>
                  <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
                     <CheckCircle2 size={12} /> Syncing
                  </div>
               </div>

               <div className="space-y-4">
                  {[
                     { name: 'Mehta Logistics', efficiency: '98%', status: 'high' },
                     { name: 'Swift Delivery', efficiency: '84%', status: 'med' },
                     { name: 'Eco Movers', efficiency: '92%', status: 'high' }
                  ].map((integration) => (
                     <div key={integration.name} className="p-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl group hover:border-emerald-500/30 transition-all">
                        <div className="flex items-center justify-between mb-2">
                           <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-tight">{integration.name}</span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] font-bold">
                           <span className="text-[var(--text-tertiary)] uppercase tracking-widest">Service Efficiency</span>
                           <span className={integration.status === 'high' ? 'text-emerald-500' : 'text-amber-500'}>{integration.efficiency}</span>
                        </div>
                        <div className="mt-2 w-full h-1 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                           <div className={`h-full ${integration.status === 'high' ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: integration.efficiency }} />
                        </div>
                     </div>
                  ))}
               </div>

               <div className="mt-8 p-4 bg-emerald-600/5 border border-emerald-500/10 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                     <BarChart3 size={14} className="text-emerald-600" />
                     <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Net Revenue Payout</p>
                  </div>
                  <p className="text-[10px] text-[var(--text-tertiary)] font-medium leading-relaxed italic">
                     Net payout tracking includes RTO deductions, maintenance fees, and platform commission splits.
                  </p>
               </div>
            </div>

            {/* Quick Audit Strip */}
            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl flex items-center justify-between group cursor-pointer hover:border-emerald-500/30 transition-all">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600/10 text-emerald-500 rounded-lg group-hover:rotate-12 transition-transform">
                     <Clock size={18} />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-wider leading-none">Payout History</p>
                     <p className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest mt-1">Audit March Settlements</p>
                  </div>
               </div>
               <ArrowUpRight size={16} className="text-[var(--text-tertiary)] group-hover:translate-x-1 transition-transform" />
            </div>
         </div>
      </div>
    </div>
  );
}
