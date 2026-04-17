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
import { useAdminDataStore } from '../store/adminDataStore';

export default function InventoryBillingPage() {
  const { inventory, billing, inventoryStats, fetchInventoryData } = useAdminDataStore();

  useEffect(() => {
    fetchInventoryData();
  }, []);

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
            <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md active:scale-95 flex items-center gap-1.5">
               <ShoppingCart size={12} /> Procure Parts
            </button>
            <button className="px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] text-[9px] font-black uppercase tracking-widest hover:bg-[var(--bg-tertiary)] transition-all flex items-center gap-1.5 shadow-sm">
               <Building size={12} /> Supplier Registry
            </button>
         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <AdminStatCard title="Spare Items" value={inventoryStats.totalItems} icon={Boxes} color="emerald" subtitle="On Grid Alpha" />
         <AdminStatCard title="Restock Soon" value={inventoryStats.restockCount} icon={AlertTriangle} color="amber" subtitle="Threshold Risk" />
         <AdminStatCard title="Stock Value" value={inventoryStats.stockValue} icon={PackageCheck} color="blue" subtitle="Asset Corpus" />
         <AdminStatCard title="Unpaid Bills" value={inventoryStats.unpaidAmount} icon={FileText} color="emerald" subtitle="Supplier Delta" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Inventory Registry */}
         <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
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

         {/* Billing & Supplier Panel */}
         <div className="space-y-4">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-5 shadow-sm border-t-4 border-t-emerald-600">
               <div className="flex items-center justify-between mb-6 pb-2 border-b border-[var(--border-subtle)]">
                  <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-widest italic leading-none">Vendor Billing</h3>
                  <div className="text-[7.5px] font-black text-emerald-500 uppercase italic">Live Ledger</div>
               </div>

               <div className="space-y-3">
                  {billing.map((bill) => (
                     <div key={bill.id} className="p-3 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-xl group hover:border-emerald-500/30 transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-1.5">
                           <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-tight italic leading-none">{bill.id}</span>
                           <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded border leading-none ${
                              bill.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' : 'bg-amber-500/10 text-amber-500 border-amber-500/10'
                           }`}>{bill.status}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-black italic">
                           <span className="text-emerald-500">{bill.amount}</span>
                           <span className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase leading-none">{new Date(bill.date).toLocaleDateString()}</span>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="mt-6 p-3 bg-emerald-600/5 border border-emerald-500/10 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5">
                     <ShieldCheck size={12} className="text-emerald-600" />
                     <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest italic leading-none">Inventory Health</p>
                  </div>
                  <p className="text-[8.5px] text-[var(--text-tertiary)] font-bold leading-relaxed uppercase tracking-wider italic">
                     Critical parts for <span className="text-emerald-500 font-black">72V Units</span> are low. Procurement trigger active.
                  </p>
               </div>
            </div>

            {/* Procurement Strip */}
            <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl flex items-center justify-between group cursor-pointer hover:border-emerald-500/30 transition-all shadow-sm border-l-4 border-l-emerald-600">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600/10 text-emerald-500 rounded-lg group-hover:rotate-12 transition-transform shadow-inner">
                     <History size={18} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-[var(--text-primary)] uppercase leading-none italic">Usage History</p>
                     <p className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase mt-1 italic tracking-widest leading-none">Audit Consumption</p>
                  </div>
               </div>
               <ChevronRight size={14} className="text-[var(--text-tertiary)] group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
            </div>
         </div>
      </div>
    </div>
  );
}
