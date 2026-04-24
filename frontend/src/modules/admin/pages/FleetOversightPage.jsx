import React from 'react';
import { 
  Truck, 
  MapPin, 
  Activity, 
  Search, 
  Filter, 
  Battery, 
  Signal, 
  Zap, 
  ShieldCheck, 
  Terminal,
  ArrowUpRight,
  Monitor,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminStatCard from '../components/AdminStatCard';
import OpsFilter from '../components/OpsFilter';
import { useAdminDataStore } from '../store/adminDataStore';

export default function FleetOversightPage() {
  const { 
    vehicles, 
    networkStats, 
    fetchAllVehicles, 
    fetchDashboardStats 
  } = useAdminDataStore();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilters, setActiveFilters] = React.useState({ range: 'Last 7 Days' });
  
  React.useEffect(() => {
    fetchAllVehicles();
    if (networkStats.activeFleet === 0) fetchDashboardStats();
  }, []);

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    console.log('Fleet Oversight Sync:', newFilters);
  };

  const filteredVehicles = (vehicles || []).filter(v => {
    const q = searchQuery.toLowerCase();
    return (
      (v.plate?.toLowerCase() || '').includes(q) || 
      (v._id?.toLowerCase() || '').includes(q) ||
      (v.model?.toLowerCase() || '').includes(q) ||
      (v.rider?.toLowerCase() || '').includes(q)
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
                  Fleet <span className="text-emerald-500">Oversight</span>
               </h1>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] ml-3">
               Asset Control & Operations
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
                 placeholder="Search Vehicle ID/Plate..." 
                 className="pl-8 pr-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[9px] font-bold uppercase tracking-wider focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all w-48 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50"
               />
            </div>
         </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <AdminStatCard title="Total Units" value={filteredVehicles.length} icon={Truck} color="emerald" subtitle="Active assets" />
         <AdminStatCard title="In Motion" value={filteredVehicles.filter(v => v.status === 'in-motion').length} icon={Activity} color="blue" subtitle="Live tracking" />
         <AdminStatCard title="Low Battery" value={filteredVehicles.filter(v => v.battery < 20).length} icon={Zap} color="rose" subtitle="Urgent action" />
      </div>

      {/* Detailed Asset Registry */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
         <div className="px-6 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-tertiary)]/10">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Monitor size={16} />
               </div>
                <div>
                   <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-wider leading-none">Global Asset Registry</h3>
                   <p className="text-[7px] font-bold text-emerald-500 uppercase mt-0.5 tracking-widest animate-pulse italic">Real-time Feed</p>
                </div>
            </div>
            <div className="flex items-center gap-1.5">
               <button className="p-1.5 text-[var(--text-tertiary)] hover:text-emerald-500 rounded-lg transition-all">
                  <Filter size={14} />
               </button>
               <button className="p-1.5 text-[var(--text-tertiary)] hover:text-emerald-500 rounded-lg transition-all">
                  <Terminal size={14} />
               </button>
            </div>
         </div>
         
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/20">
                     {['Asset identity', 'Host Interface', 'Location', 'Energy Status', 'Grid Link', 'Sync'].map((header) => (
                        <th key={header} className="py-3 px-6 text-[8px] font-black uppercase tracking-widest text-[var(--text-tertiary)] whitespace-nowrap">{header}</th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-[var(--border-subtle)]">
                  {filteredVehicles.map((vehicle, vIdx) => (
                     <tr key={vehicle._id} className="group/row hover:bg-[var(--bg-tertiary)]/30 transition-colors">
                        <td className="py-2.5 px-6 whitespace-nowrap">
                           <div className="flex flex-col gap-0">
                              <span className="text-[11px] font-black text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{vehicle.plate}</span>
                              <span className="text-[7px] font-bold text-[var(--text-tertiary)] tracking-widest leading-none uppercase">{vehicle.model || 'Flexigo Pro v2'}</span>
                           </div>
                        </td>
                        <td className="py-2.5 px-6">
                           <div className="flex flex-col gap-0">
                              <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-tight italic">{vehicle.rider}</span>
                              <span className="text-[7px] font-black text-emerald-500/60 uppercase tracking-widest leading-none">Active Subscriber</span>
                           </div>
                        </td>
                        <td className="py-2.5 px-6">
                           <div className="flex items-center gap-1.5">
                              <MapPin size={10} className="text-emerald-500 opacity-60" />
                              <span className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest italic">{vehicle.location}</span>
                           </div>
                        </td>
                        <td className="py-2.5 px-6">
                           <div className="flex items-center gap-2">
                              <div className="w-12 h-1 bg-[var(--bg-tertiary)] rounded-full overflow-hidden flex-shrink-0">
                                 <div className={`h-full ${vehicle.battery < 20 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${vehicle.battery}%` }} />
                              </div>
                              <span className={`text-[9px] font-black ${vehicle.battery < 20 ? 'text-rose-500' : 'text-[var(--text-primary)]'}`}>{vehicle.battery}%</span>
                           </div>
                        </td>
                        <td className="py-2.5 px-6">
                           <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-fit">
                              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">Linked</span>
                           </div>
                        </td>
                        <td className="py-2.5 px-6 text-[8px] font-black text-[var(--text-tertiary)] uppercase italic tracking-widest">{vehicle.lastPing}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

    </div>
  );
}
