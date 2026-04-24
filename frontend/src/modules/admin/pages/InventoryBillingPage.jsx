import React, { useEffect } from 'react';
import { 
  Boxes, 
  Warehouse, 
  AlertTriangle, 
  ShoppingCart, 
  FileText, 
  UserCircle, 
  History, 
  Search, 
  Filter, 
  ArrowDownLeft,
  ChevronRight,
  ShieldCheck,
  PackageCheck,
  Building,
  Activity
} from 'lucide-react';
import AdminStatCard from '../components/AdminStatCard';
import OpsFilter from '../components/OpsFilter';
import { useAdminDataStore } from '../store/adminDataStore';

export default function InventoryBillingPage() {
  const { inventory, billing, inventoryStats, fetchInventoryData } = useAdminDataStore();
  const [activeFilters, setActiveFilters] = React.useState({ range: 'Last 7 Days' });

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    console.log('Inventory Sync:', newFilters);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="space-y-0.5">
            <div className="flex items-center gap-2">
               <div className="w-1 h-5 bg-emerald-600 rounded-full" />
               <h1 className="text-xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Inventory & <span className="text-emerald-500">Billing</span>
               </h1>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] ml-3">
               Spare Parts & Supplier Payments Hub
            </p>
         </div>
         
         <div className="flex items-center gap-2">
            <OpsFilter onFilterChange={handleFilterChange} />
         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <AdminStatCard title="Spare Items" value={inventoryStats.totalItems} icon={Boxes} color="emerald" subtitle="On Grid Alpha" />
         <AdminStatCard title="Restock Soon" value={inventoryStats.restockCount} icon={AlertTriangle} color="amber" subtitle="Threshold Risk" />
         <AdminStatCard title="Stock Value" value={inventoryStats.stockValue} icon={PackageCheck} color="blue" subtitle="Asset Corpus" />
         <AdminStatCard title="Unpaid Bills" value={inventoryStats.unpaidAmount} icon={FileText} color="emerald" subtitle="Supplier Delta" />
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
         <div className="px-6 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-tertiary)]/10">
            <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-wider leading-none italic">Parts Payload Tracker</h3>
            <div className="relative group">
               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-tertiary)] group-focus-within:text-emerald-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search SKU..." 
                 className="pl-8 pr-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[9px] font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all w-32 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50"
               />
            </div>
         </div>
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full">
               <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/20">
                     {['SKU Identity', 'Category', 'Stock Level', 'Min Threshold', 'Supplier Node', 'Status'].map((header) => (
                        <th key={header} className="text-left py-2.5 px-6 text-[8px] font-black uppercase tracking-widest text-[var(--text-tertiary)] whitespace-nowrap">{header}</th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-[var(--border-subtle)]">
                  {inventory.map((item) => (
                     <tr key={item.id} className="group/row hover:bg-[var(--bg-tertiary)]/20 transition-colors cursor-pointer text-[10px]">
                        <td className="py-2.5 px-6 whitespace-nowrap">
                           <div className="flex flex-col">
                              <span className="font-black text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors uppercase tracking-tight italic leading-none">{item.name}</span>
                              <span className="text-[7px] font-bold text-[var(--text-tertiary)]/50 tracking-widest uppercase mt-1 leading-none italic">{item.id}</span>
                           </div>
                        </td>
                        <td className="py-2.5 px-6 font-black text-[var(--text-tertiary)] uppercase tracking-widest leading-none italic">{item.category}</td>
                        <td className="py-2.5 px-6 font-black text-[var(--text-primary)] tracking-tight leading-none italic">{item.stock} Units</td>
                        <td className="py-2.5 px-6 font-black text-[var(--text-tertiary)] opacity-50 leading-none italic">{item.minLevel}</td>
                        <td className="py-2.5 px-6 text-[9px] font-black text-[var(--text-primary)] uppercase leading-none italic">{item.supplier}</td>
                        <td className="py-2.5 px-6">
                           <div className={`inline-flex px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest border leading-none ${
                              item.status === 'optimal' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' : 'bg-rose-500/10 text-rose-500 border border-rose-500/10'
                           }`}>
                              {item.status}
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
