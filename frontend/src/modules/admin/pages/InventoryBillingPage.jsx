import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  Activity,
  Plus,
  Edit,
  Trash2,
  X,
  Wrench
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminStatCard from '../components/AdminStatCard';
import OpsFilter from '../components/OpsFilter';
import { useAdminDataStore } from '../store/adminDataStore';

export default function InventoryBillingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    inventory, 
    billing, 
    inventoryStats, 
    fetchInventoryData,
    addBill,
    updateBill,
    removeBill 
  } = useAdminDataStore();
  const [activeFilters, setActiveFilters] = React.useState({ range: 'Last 7 Days' });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedBill, setSelectedBill] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [billForm, setBillForm] = useState({
    vehicleNo: '',
    chasisNo: '',
    partsRepair: '',
    amount: '',
    supplier: ''
  });

  useEffect(() => {
    fetchInventoryData(activeFilters);
    if (searchParams.get('modal') === 'add') {
      handleOpenAdd();
    }
  }, []);

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    fetchInventoryData(newFilters);
  };

  const handleOpenAdd = () => {
    setBillForm({
      vehicleNo: '',
      chasisNo: '',
      partsRepair: '',
      amount: '',
      supplier: 'Internal'
    });
    setModalType('add');
    setIsModalOpen(true);
    setSearchParams({ modal: 'add' });
  };

  const handleOpenEdit = (bill) => {
    setSelectedBill(bill);
    setBillForm({
      vehicleNo: bill.vehicleNo,
      chasisNo: bill.chasisNo,
      partsRepair: bill.partsRepair,
      amount: bill.amount,
      supplier: bill.supplier
    });
    setModalType('edit');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      if (modalType === 'add') {
        await addBill(billForm);
      } else {
        await updateBill(selectedBill._id, billForm);
      }
      setIsModalOpen(false);
      setSearchParams({});
    } catch (error) {
      console.error("Bill Save Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    await removeBill(id);
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
                     <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/5">
                     {['SKU Identity', 'Category', 'Stock Level', 'Min Threshold', 'Supplier Node', 'Status'].map((header) => (
                        <th key={header} className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-secondary)] whitespace-nowrap">{header}</th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-[var(--border-subtle)]">
                  {inventory.map((item) => (
                     <tr key={item.id} className="group/row hover:bg-[var(--bg-tertiary)]/10 transition-colors text-sm">
                        <td className="py-2 px-4 whitespace-nowrap">
                           <div className="flex flex-col">
                              <span className="font-medium text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors">{item.name}</span>
                              <span className="font-medium text-[var(--text-tertiary)]/50   mt-1">{item.id}</span>
                           </div>
                        </td>
                        <td className="py-2 px-4 font-medium text-[var(--text-tertiary)]">{item.category}</td>
                        <td className="py-2 px-4 font-medium text-[var(--text-primary)]">{item.stock} Units</td>
                        <td className="py-2 px-4 font-medium text-[var(--text-tertiary)] opacity-50">{item.minLevel}</td>
                        <td className="py-2 px-4  font-medium text-[var(--text-primary)]">{item.supplier}</td>
                        <td className="py-2 px-4">
                           <div className={`inline-flex px-1.5 py-0.5 rounded  font-medium   border  ${
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

      {/* Billing Section */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
         <div className="px-6 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-tertiary)]/10">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
                  <FileText size={16} />
               </div>
               <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-wider leading-none italic">Vehicle Repair Bills</h3>
            </div>
            <button 
               onClick={handleOpenAdd}
               className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md active:scale-95"
            >
               <Plus size={14} /> Add Bill
            </button>
         </div>
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full">
               <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/5">
                     {['Bill ID', 'Vehicle Info', 'Service Details', 'Amount', 'Actions'].map((header) => (
                        <th key={header} className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-secondary)] whitespace-nowrap">{header}</th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-[var(--border-subtle)]">
                  {billing.map((bill) => (
                     <tr key={bill._id} className="group/row hover:bg-[var(--bg-tertiary)]/10 transition-colors text-sm">
                        <td className="py-2 px-4 font-medium text-[var(--text-tertiary)]">
                           {bill.id}
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap">
                           <div className="flex flex-col">
                              <span className="font-medium text-[var(--text-primary)] uppercase tracking-tighter italic">{bill.vehicleNo}</span>
                              <span className="text-[10px] text-[var(--text-tertiary)] opacity-50">{bill.chasisNo}</span>
                           </div>
                        </td>
                        <td className="py-2 px-4 font-medium text-[var(--text-primary)]">
                           {bill.partsRepair}
                        </td>
                        <td className="py-2 px-4 font-black text-emerald-500">
                           {bill.formattedAmount}
                        </td>

                        <td className="py-2 px-4">
                           <div className="flex items-center gap-2">
                              <button 
                                 onClick={() => handleOpenEdit(bill)}
                                 className="p-1 text-[var(--text-tertiary)] hover:text-emerald-500 hover:bg-emerald-500/10 rounded transition-all"
                              >
                                 <Edit size={12} />
                              </button>
                              <button 
                                 onClick={() => handleDelete(bill._id)}
                                 className="p-1 text-[var(--text-tertiary)] hover:text-rose-500 hover:bg-rose-500/10 rounded transition-all"
                              >
                                 <Trash2 size={12} />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* Bill Modal */}
      <AnimatePresence>
         {isModalOpen && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="w-full max-w-md bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-8 shadow-2xl space-y-6"
               >
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <h2 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tighter italic leading-none">
                           {modalType === 'add' ? 'Register' : 'Modify'} <span className="text-emerald-500">Repair Bill</span>
                        </h2>
                        <p className="text-[8px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">SECTION: REPAIR_AUDIT_LOG_V1</p>
                     </div>
                     <button onClick={() => { setIsModalOpen(false); setSearchParams({}); }} className="p-1.5 hover:bg-rose-600/10 hover:text-rose-500 transition-all rounded-lg text-[var(--text-tertiary)]">
                        <X size={18} />
                     </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                           <label className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Vehicle Number</label>
                           <input 
                              required
                              value={billForm.vehicleNo}
                              onChange={(e) => setBillForm({...billForm, vehicleNo: e.target.value})}
                              placeholder="e.g. DL 1S AB 1234"
                              className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all italic text-[var(--text-primary)] uppercase"
                           />
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Chasis Number</label>
                           <input 
                              required
                              value={billForm.chasisNo}
                              onChange={(e) => setBillForm({...billForm, chasisNo: e.target.value})}
                              placeholder="CH-XXXXXXXX"
                              className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all italic text-[var(--text-primary)] uppercase"
                           />
                        </div>
                     </div>

                     <div className="space-y-1.5">
                        <label className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Parts & Repair Description</label>
                        <textarea 
                           required
                           value={billForm.partsRepair}
                           onChange={(e) => setBillForm({...billForm, partsRepair: e.target.value})}
                           placeholder="e.g. Battery Replacement, Brake Pad sync"
                           rows={3}
                           className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all italic text-[var(--text-primary)] resize-none"
                        />
                     </div>

                     <div className="space-y-1.5">
                        <label className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Amount (₹)</label>
                        <input 
                           required
                           type="number"
                           value={billForm.amount}
                           onChange={(e) => setBillForm({...billForm, amount: e.target.value})}
                           placeholder="0.00"
                           className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-black tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all italic text-emerald-500"
                        />
                     </div>

                     <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-950/20 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                     >
                        {isSubmitting ? (
                           <div className="flex items-center gap-2">
                              <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                              <span>PROCESSING...</span>
                           </div>
                        ) : (
                           <>
                              <Activity size={14} /> {modalType === 'add' ? 'Create Repair Bill' : 'Update Record'}
                           </>
                        )}
                     </button>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}
