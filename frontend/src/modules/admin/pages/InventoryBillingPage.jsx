import React from 'react';
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
  Building
} from 'lucide-react';
import AdminStatCard from '../components/AdminStatCard';

const mockInventory = [
  { id: 'SKU-001', name: '72V Lithium Cell Pack', category: 'Battery', stock: 12, minLevel: 10, supplier: 'GreenCell Tech', status: 'optimal' },
  { id: 'SKU-042', name: 'Brembo Brake Pads', category: 'Brakes', stock: 4, minLevel: 15, supplier: 'Brembo India', status: 'low-stock' },
  { id: 'SKU-108', name: 'Apollo H1 Tyres', category: 'Wheels', stock: 24, minLevel: 20, supplier: 'Apollo Tyres', status: 'optimal' },
  { id: 'SKU-056', name: 'Hub Motor (3kW)', category: 'Motor', stock: 2, minLevel: 5, supplier: 'Bosch Mobility', status: 'low-stock' },
];

const mockBilling = [
  { id: 'INV-9901', supplier: 'GreenCell Tech', amount: '₹1,45,000', status: 'paid', date: '2d ago' },
  { id: 'INV-9902', supplier: 'Brembo India', amount: '₹12,400', status: 'pending', date: '5h ago' },
];

export default function InventoryBillingPage() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <div className="flex items-center gap-3">
               <div className="w-1 h-6 bg-emerald-600 rounded-full" />
               <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                  Inventory & <span className="text-emerald-500">Billing</span>
               </h1>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] ml-4">
               Spare Parts & Supplier Payments
            </p>
         </div>
         
         <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-sm active:scale-95 flex items-center gap-2">
               <ShoppingCart size={14} /> Procure Parts
            </button>
            <button className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] text-[10px] font-bold uppercase tracking-wider hover:bg-[var(--bg-tertiary)] transition-all flex items-center gap-2 shadow-sm">
               <Building size={14} /> Supplier Registry
            </button>
         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <AdminStatCard title="Spare Items" value="1,240" icon={Boxes} color="emerald" subtitle="Items in stock" />
         <AdminStatCard title="Restock Soon" value="06" icon={AlertTriangle} color="amber" subtitle="Items running low" />
         <AdminStatCard title="Stock Value" value="₹24.8L" icon={PackageCheck} color="blue" subtitle="Value of parts" />
         <AdminStatCard title="Unpaid Bills" value="₹4.2L" icon={FileText} color="emerald" subtitle="Owed to suppliers" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Inventory Registry */}
         <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
               <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Parts Tracker</h3>
               <div className="flex items-center gap-2">
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                     <input 
                       type="text" 
                       placeholder="Search SKU..." 
                       className="pl-9 pr-4 py-1.5 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-lg text-[10px] focus:border-emerald-500 outline-none transition-all"
                     />
                  </div>
               </div>
            </div>
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full">
                  <thead>
                     <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/30">
                        {['SKU Identity', 'Category', 'Stock Level', 'Min Threshold', 'Supplier Node', 'Status'].map((header) => (
                           <th key={header} className="text-left py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] px-4 whitespace-nowrap">{header}</th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                     {mockInventory.map((item) => (
                        <tr key={item.id} className="group/row hover:bg-[var(--bg-tertiary)]/30 transition-colors cursor-pointer">
                           <td className="py-4 px-4 whitespace-nowrap">
                              <div className="flex flex-col gap-0.5">
                                 <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{item.name}</span>
                                 <span className="text-[9px] font-bold text-[var(--text-tertiary)] tracking-widest leading-none">{item.id}</span>
                              </div>
                           </td>
                           <td className="py-4 px-4">
                              <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">{item.category}</span>
                           </td>
                           <td className="py-4 px-4 font-bold text-xs text-[var(--text-primary)]">{item.stock} Units</td>
                           <td className="py-4 px-4 font-bold text-xs text-[var(--text-tertiary)]">{item.minLevel}</td>
                           <td className="py-4 px-4 text-[11px] font-bold text-[var(--text-tertiary)] uppercase">{item.supplier}</td>
                           <td className="py-4 px-4">
                              <div className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                 item.status === 'optimal' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
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
         <div className="space-y-6">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-sm">
               <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border-subtle)]">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Vendor Billing</h3>
                  <div className="px-2 py-0.5 bg-emerald-600/5 text-emerald-500 text-[9px] font-bold uppercase tracking-widest rounded border border-emerald-500/10">
                     Live Ledger
                  </div>
               </div>

               <div className="space-y-4">
                  {mockBilling.map((bill) => (
                     <div key={bill.id} className="p-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl group hover:border-emerald-500/30 transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                           <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-tight">{bill.id}</span>
                           <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                              bill.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                           }`}>{bill.status}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-bold">
                           <span className="text-emerald-500">{bill.amount}</span>
                           <span className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase">{bill.date}</span>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="mt-8 p-4 bg-emerald-600/5 border border-emerald-500/10 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                     <ShieldCheck size={14} className="text-emerald-600" />
                     <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Inventory Health</p>
                  </div>
                  <p className="text-[10px] text-[var(--text-tertiary)] font-medium leading-relaxed">
                     Critical spare parts for <span className="text-emerald-500 font-bold">72V Units</span> are below safety threshold. Procurement trigger recommended.
                  </p>
               </div>
            </div>

            {/* Procurement Strip */}
            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl flex items-center justify-between group cursor-pointer hover:border-emerald-500/30 transition-all">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600/10 text-emerald-500 rounded-lg group-hover:scale-110 transition-transform">
                     <History size={18} />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-wider leading-none">Usage History</p>
                     <p className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest mt-1">Audit Spare Consumption</p>
                  </div>
               </div>
               <ChevronRight size={16} className="text-[var(--text-tertiary)]" />
            </div>
         </div>
      </div>
    </div>
  );
}
