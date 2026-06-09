import React from 'react';
import { 
  Users, 
  CreditCard, 
  Search, 
  Download, 
  ArrowUpRight, 
  User,
  Activity,
  ShieldCheck,
  Bike
} from 'lucide-react';
import AdminStatCard from '../components/AdminStatCard';
import OpsFilter from '../components/OpsFilter';
import { useAdminDataStore } from '../store/adminDataStore';

export default function RiderReportPage() {
  const { riderReport, fetchRiderReport, kycRecords, fetchKycRecords, isLoading } = useAdminDataStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilters, setActiveFilters] = React.useState({ range: 'Last 30 Days' });

  React.useEffect(() => {
    fetchRiderReport({ range: 'Last 30 Days' });
    fetchKycRecords();
  }, []);

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    fetchRiderReport(newFilters);
    fetchKycRecords();
  };

  const handleExport = () => {
    const headers = ['Name', 'Phone', 'Source Franchise', 'Vehicle Number', 'Active Plan', 'Total Payments', 'Wallet Balance', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredReport.map(r => [
        r.name, 
        r.phone, 
        r.franchiseName || 'FLEXIGO',
        r.vehicleNumber, 
        r.activePlan, 
        r.totalPayments, 
        r.walletBalance, 
        r.status
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rider_detailed_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredReport = React.useMemo(() => {
    const approvedPhones = new Set(
      (kycRecords || [])
        .filter(record => record.status === 'approved' && (record.role?.toLowerCase() === 'rider' || record.role?.toLowerCase() === 'driver'))
        .map(record => record.phone?.trim())
        .filter(Boolean)
    );
    const approvedRiders = (riderReport || []).filter(r => approvedPhones.has(r.phone?.trim()));

    const q = searchQuery.toLowerCase();
    return approvedRiders.filter(r => {
      return (
        (r.name?.toLowerCase() || '').includes(q) || 
        (r.phone || '').includes(q) ||
        (r.vehicleNumber?.toLowerCase() || '').includes(q) ||
        (r.activePlan?.toLowerCase() || '').includes(q)
      );
    });
  }, [riderReport, kycRecords, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="space-y-0.5">
            <div className="flex items-center gap-2">
               <div className="w-1 h-5 bg-emerald-600 rounded-full" />
               <h1 className="text-xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Rider <span className="text-emerald-500">Detailed Report</span>
               </h1>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] ml-3">
               Comprehensive Rider, Vehicle & Payment Sync
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
                 placeholder="Search Rider/Vehicle..." 
                 className="pl-8 pr-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[10px] font-bold tracking-wider focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all w-48 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50 italic"
               />
            </div>
            <button 
               onClick={handleExport}
               className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
               <Download size={12} /> Export CSV
            </button>
         </div>
      </div>

      {/* Main Report Table */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
         <div className="px-6 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-tertiary)]/10">
            <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-wider leading-none italic">Rider Transactional Registry</h3>
            {isLoading && <div className="text-[7.5px] font-black text-emerald-500 uppercase italic animate-pulse">Fetching Report...</div>}
         </div>
         
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/5">
                     {['Rider Details', 'Source', 'Vehicle Info', 'Active Plan', 'Distance (KM)', 'Total Payments', 'Wallet', 'Status'].map((header) => (
                        <th key={header} className="py-3 px-4 text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest whitespace-nowrap">{header}</th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-[var(--border-subtle)]">
                  {filteredReport.map((r) => (
                     <tr key={r.id} className="group/row hover:bg-[var(--bg-tertiary)]/10 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
                                 <User size={14} />
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-tight group-hover:text-emerald-500 transition-colors">{r.name}</span>
                                 <span className="text-[9px] font-bold text-[var(--text-tertiary)]">{r.phone}</span>
                              </div>
                           </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                           <div className="flex items-center gap-2">
                              <ShieldCheck size={12} className={r.franchiseName && r.franchiseName !== 'FLEXIGO' ? 'text-blue-400' : 'text-emerald-500'} />
                              <span className={`text-[10px] font-black uppercase tracking-widest ${r.franchiseName && r.franchiseName !== 'FLEXIGO' ? 'text-blue-400' : 'text-emerald-500'}`}>
                                 {r.franchiseName || 'FLEXIGO'}
                               </span>
                            </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                           <div className="flex items-center gap-2">
                              <Bike size={12} className="text-emerald-500" />
                              <div className="flex flex-col">
                                 <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest">{r.vehicleNumber}</span>
                                 <span className="text-[8px] font-bold text-[var(--text-tertiary)] uppercase">{r.vehicleModel}</span>
                              </div>
                           </div>
                        </td>
                        <td className="py-3 px-4">
                           <div className="inline-flex px-2 py-0.5 bg-blue-500/5 border border-blue-500/10 rounded text-[9px] font-black text-blue-500 uppercase tracking-tighter">
                              {r.activePlan}
                           </div>
                        </td>
                        <td className="py-3 px-4">
                           <div className="flex flex-col">
                              <span className="text-[11px] font-black text-blue-500">{r.totalDistance?.toFixed(2) || '0.00'} KM</span>
                              <span className="text-[7px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Total Drive</span>
                           </div>
                        </td>
                        <td className="py-3 px-4">
                           <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-black text-emerald-500">₹{(r.totalPayments || 0).toLocaleString()}</span>
                                {r.latestPaymentMethod && (
                                  <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-tertiary)] bg-[var(--bg-tertiary)]/10 px-1.5 py-0.5 rounded">
                                    Via {r.latestPaymentMethod.replace('_', ' ')}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                 <span className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Total Successful</span>
                                 {r.depositPaid && (
                                   <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 uppercase tracking-widest border border-blue-500/20" title="Deposit Paid">
                                     + Dep: ₹{r.depositAmount || 'Paid'}
                                   </span>
                                 )}
                              </div>
                           </div>
                        </td>
                        <td className="py-3 px-4">
                           <span className={`text-[10px] font-black ${r.walletBalance < 500 ? 'text-rose-500' : 'text-[var(--text-primary)]'}`}>
                              ₹{r.walletBalance.toLocaleString()}
                           </span>
                        </td>
                        <td className="py-3 px-4">
                           <div className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                              ['active', 'approved'].includes(r.status) ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' : 
                              ['suspended', 'rejected'].includes(r.status) ? 'bg-rose-500/10 text-rose-500 border-rose-500/10' :
                              'bg-amber-500/10 text-amber-500 border-amber-500/10'
                           }`}>
                              {r.status}
                           </div>
                        </td>
                     </tr>
                  ))}
                  {filteredReport.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan="8" className="py-12 text-center">
                        <div className="flex flex-col items-center gap-2 opacity-50">
                           <Activity size={24} className="text-[var(--text-tertiary)]" />
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">No Records Found Registry</span>
                        </div>
                      </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
