import React, { useEffect } from 'react';
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
import OpsFilter from '../components/OpsFilter';
import { useAdminDataStore } from '../store/adminDataStore';

export default function FranchiseOpsPage() {
  const { franchiseOps, franchiseOpsStats, fetchFranchiseOpsData } = useAdminDataStore();
  const [activeFilters, setActiveFilters] = React.useState({ range: 'Last 7 Days' });

  useEffect(() => {
    fetchFranchiseOpsData();
  }, []);

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    console.log('Franchise Ops Sync:', newFilters);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="space-y-0.5">
            <div className="flex items-center gap-2">
               <div className="w-1 h-5 bg-emerald-600 rounded-full" />
               <h1 className="text-xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Franchise & <span className="text-emerald-500">3PL Ops</span>
               </h1>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] ml-3">
               Partner Control & Payout Tracking
            </p>
         </div>
         
         <div className="flex items-center gap-2">
            <OpsFilter onFilterChange={handleFilterChange} />
         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <AdminStatCard title="Total Partners" value={franchiseOpsStats.totalPartners} icon={Users} color="emerald" subtitle="Network Scope" />
         <AdminStatCard title="Gross Payout" value={franchiseOpsStats.grossPayout} icon={Wallet} color="blue" subtitle="MTD Settled" />
         <AdminStatCard title="Active Nodes" value={franchiseOpsStats.activeNodes} icon={Building2} color="emerald" subtitle="Operating Hubs" />
         <AdminStatCard title="Growth" value={franchiseOpsStats.growth} icon={TrendingUp} color="emerald" subtitle="Quarterly" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Franchise Ledger */}
         <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-tertiary)]/10">
               <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-wider">Performance Ledger</h3>
               <div className="text-emerald-500 text-[8px] font-black uppercase tracking-widest bg-emerald-600/5 px-2.5 py-1 rounded-lg border border-emerald-500/10 italic">
                  Payout Protocol Act.
               </div>
            </div>
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full">
                  <thead>
                     <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/5">
                        {['Partner Identity', 'Node', 'Hubs', 'Net Payout', 'Status', 'Sync'].map((header) => (
                           <th key={header} className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-secondary)] whitespace-nowrap">{header}</th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                     {franchiseOps.map((fr) => (
                        <tr key={fr.id} className="group/row hover:bg-[var(--bg-tertiary)]/10 transition-colors text-sm">
                           <td className="py-2 px-4">
                              <div className="flex flex-col">
                                 <span className="font-medium text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors">{fr.name}</span>
                                 <span className="font-medium text-[var(--text-tertiary)]   mt-1">{fr.id}</span>
                              </div>
                           </td>
                           <td className="py-2 px-4">
                              <div className="flex items-center gap-1.5">
                                 <MapPin size={10} className="text-emerald-500 opacity-60" />
                                 <span className="font-medium text-[var(--text-tertiary)]">{fr.city}</span>
                              </div>
                           </td>
                           <td className="py-2 px-4 font-medium text-[var(--text-primary)]">{fr.hubs} Hubs</td>
                           <td className="py-2 px-4 font-medium text-emerald-500">{fr.payout}</td>
                           <td className="py-2 px-4">
                              <div className={`inline-flex px-1.5 py-0.5 rounded  font-medium   border ${
                                 fr.status === 'settled' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' : 
                                 fr.status === 'processing' ? 'bg-amber-500/10 text-amber-500 border-amber-500/10 animate-pulse' : 
                                 'bg-slate-500/10 text-slate-500 border-slate-500/10'
                              }`}>
                                 {fr.status}
                              </div>
                           </td>
                           <td className="py-2 px-4 text-right">
                              <ArrowUpRight size={14} className="text-[var(--text-tertiary)]/30 group-hover:text-emerald-500 transition-all ml-auto" />
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* 3PL Integration Panel */}
         <div className="space-y-6">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-sm border-t-4 border-t-emerald-600">
               <div className="flex items-center justify-between mb-6 pb-2 border-b border-[var(--border-subtle)]">
                  <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-widest">3PL Matrix</h3>
                  <div className="flex items-center gap-1 text-[8px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">
                     <CheckCircle2 size={10} /> Active
                  </div>
               </div>

               <div className="space-y-3">
                  {[
                     { name: 'Mehta Logistics', efficiency: '98%', status: 'high' },
                     { name: 'Swift Delivery', efficiency: '84%', status: 'med' },
                     { name: 'Eco Movers', efficiency: '92%', status: 'high' }
                  ].map((integration) => (
                     <div key={integration.name} className="p-3 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-xl group hover:border-emerald-500/30 transition-all">
                        <div className="flex items-center justify-between mb-1.5">
                           <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-tight italic">{integration.name}</span>
                        </div>
                        <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest">
                           <span className="text-[var(--text-tertiary)] leading-none mt-0.5">S-Eff Score</span>
                           <span className={integration.status === 'high' ? 'text-emerald-500' : 'text-amber-500'}>{integration.efficiency}</span>
                        </div>
                        <div className="mt-2 w-full h-1 bg-[var(--bg-tertiary)] rounded-full overflow-hidden shadow-inner">
                           <div className={`h-full ${integration.status === 'high' ? 'bg-emerald-500' : 'bg-amber-500'} transition-all duration-1000`} style={{ width: integration.efficiency }} />
                        </div>
                     </div>
                  ))}
               </div>

               <div className="mt-6 p-3 bg-emerald-600/5 border border-emerald-500/10 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5">
                     <BarChart3 size={12} className="text-emerald-600" />
                     <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Revenue Audit</p>
                  </div>
                  <p className="text-[8px] text-[var(--text-tertiary)] font-bold uppercase leading-relaxed italic tracking-widest">
                     Net payout tracking includes RTO & Commission splits.
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
