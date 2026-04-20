import React, { useState } from 'react';
import { 
  Zap, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Clock, 
  IndianRupee, 
  Calendar,
  ShieldCheck,
  ZapOff,
  MoreVertical,
  X,
  Target,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Package,
  Layers,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminStatCard from '../components/AdminStatCard';
import { useAdminDataStore } from '../store/adminDataStore';

export default function SubscriptionPlansPage() {
  const { 
    plans: allPlans, 
    networkStats,
    fetchPlans, 
    fetchDashboardStats,
    addPlan, 
    updatePlan, 
    deletePlan 
  } = useAdminDataStore();
  
  const [activeTab, setActiveTab] = useState('Rider');
  
  React.useEffect(() => {
    fetchPlans();
    fetchDashboardStats();
  }, []);

  const filteredPlans = allPlans.filter(p => p.target === activeTab);
  
  const avgTicket = filteredPlans.length > 0 
    ? Math.round(filteredPlans.reduce((acc, p) => acc + p.price, 0) / filteredPlans.length) 
    : 0;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({ name: '', type: 'Daily', price: '', deposit: '', features: '' });

  const handleOpenModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({ 
        name: plan.name, 
        type: plan.type, 
        price: plan.price, 
        deposit: plan.deposit, 
        features: plan.features.join(', ') 
      });
    } else {
      setEditingPlan(null);
      setFormData({ name: '', type: activeTab === 'Rider' ? 'Daily' : 'Franchise', price: '', deposit: '', features: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const planPayload = {
      name: formData.name,
      type: formData.type,
      price: parseInt(formData.price),
      deposit: parseInt(formData.deposit),
      features: formData.features.split(',').map(f => f.trim()),
      target: activeTab
    };

    if (editingPlan) {
      await updatePlan(editingPlan._id, planPayload);
    } else {
      await addPlan(planPayload);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
        await deletePlan(id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
               <div className="w-1 h-5 bg-emerald-600 rounded-full" />
               <h1 className="text-xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Subscription <span className="text-emerald-500">Plans</span>
               </h1>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] ml-3">
               Manage rider and franchise subscriptions
            </p>
         </div>
         
         <button 
           onClick={() => handleOpenModal()}
           className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md active:scale-95 flex items-center gap-1.5"
         >
            <Plus size={12} strokeWidth={3} /> Add New Plan
         </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <AdminStatCard title="Active Plans" value={filteredPlans.length} icon={Layers} color="emerald" subtitle="Market Offerings" />
         <AdminStatCard title="Avg. Ticket" value={`₹${avgTicket.toLocaleString()}`} icon={IndianRupee} color="blue" subtitle="Revenue Per User" />
         <AdminStatCard title="Churn Rate" value={networkStats.churnRate} icon={ZapOff} color="rose" subtitle="Plan Delta" />
         <AdminStatCard title="Growth Tier" value={networkStats.growthTier} icon={TrendingUp} color="emerald" subtitle="Monthly Expansion" />
      </div>

      {/* Tab Selector */}
      <div className="flex bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-1 rounded-xl shadow-inner w-fit">
        {['Rider', 'Franchise'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.3em] transition-all italic leading-none ${
              activeTab === tab 
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40 border border-emerald-500/20' 
              : 'text-[var(--text-tertiary)] hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {tab} Plans
          </button>
        ))}
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <AnimatePresence mode="popLayout">
            {filteredPlans.map((plan) => (
               <motion.div 
                 layout
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 key={plan._id || plan.id} 
                 className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-sm hover:border-emerald-500/30 transition-all group relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none">
                     <Zap size={80} strokeWidth={1} />
                  </div>

                  <div className="flex justify-between items-start mb-6 relative z-10">
                     <div className="space-y-1">
                        <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10 italic leading-none">{plan.type} CYCLE</span>
                        <h3 className="text-base font-black text-[var(--text-primary)] uppercase italic tracking-tighter pt-1 leading-none">{plan.name}</h3>
                        <p className="text-[7.5px] font-black text-[var(--text-tertiary)]/50 tracking-widest leading-none mt-1 uppercase italic">{plan._id || plan.id}</p>
                     </div>
                     <div className="flex gap-1.5">
                        <button onClick={() => handleOpenModal(plan)} className="p-1.5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-tertiary)] hover:text-emerald-500 transition-all shadow-inner">
                           <Edit3 size={12} />
                        </button>
                        <button onClick={() => handleDelete(plan._id || plan.id)} className="p-1.5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-tertiary)] hover:text-rose-500 transition-all shadow-inner">
                           <Trash2 size={12} />
                        </button>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                     <div className="p-3 bg-[var(--bg-tertiary)]/50 rounded-xl border border-[var(--border-subtle)] shadow-inner">
                        <p className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest mb-1 italic leading-none">Price</p>
                        <p className="text-base font-black text-emerald-500 tracking-tighter leading-none italic">₹{plan.price}</p>
                     </div>
                     <div className="p-3 bg-[var(--bg-tertiary)]/50 rounded-xl border border-[var(--border-subtle)] shadow-inner">
                        <p className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest mb-1 italic leading-none">Deposit</p>
                        <p className="text-base font-black text-[var(--text-primary)] tracking-tighter italic leading-none opacity-80">₹{plan.deposit}</p>
                     </div>
                  </div>

                  <div className="space-y-2 mb-6 relative z-10">
                     <p className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest italic opacity-50">Included Service & Features</p>
                     <div className="space-y-1.5">
                        {plan.features.map((f, i) => (
                           <div key={i} className="flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-emerald-600 shadow-[0_0_5px_#10b981]" />
                              <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-tight italic opacity-80 leading-none">{f}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                   <button 
                      onClick={() => alert(`METRICS_STREAM: ${plan._id || plan.id}`)}
                      className="w-full py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-primary)] hover:border-emerald-500/30 transition-all flex items-center justify-center gap-2 group/btn active:scale-95 italic"
                   >
                      Performance Metrics <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                   </button>

               </motion.div>
            ))}
         </AnimatePresence>
      </div>

      {/* Plan Modal */}
      <AnimatePresence>
         {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-8 shadow-2xl relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                     <Layers size={100} />
                  </div>

                  <div className="flex items-center justify-between mb-8 relative z-10 border-b border-[var(--border-subtle)] pb-4">
                     <div className="space-y-1">
                        <h2 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tighter italic leading-none">
                            {editingPlan ? 'Edit' : 'Create'} <span className="text-emerald-500">Subscription Plan</span>
                         </h2>
                         <p className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest italic opacity-50">System Version v6.0</p>
                     </div>
                     <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-rose-600/10 hover:text-rose-500 transition-all rounded-lg">
                        <X size={18} />
                     </button>
                  </div>

                  <form onSubmit={handleSave} className="space-y-6 relative z-10">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-2">
                           <label className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1 italic leading-none">Plan Identity</label>
                           <input 
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              placeholder="e.g. Gig Economy Heavy"
                              className="w-full px-4 py-3 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-xl text-[11px] font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-[var(--text-tertiary)]/30 italic"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1 italic leading-none">Cycle Type</label>
                           <select 
                              value={formData.type}
                              onChange={(e) => setFormData({...formData, type: e.target.value})}
                              className="w-full px-4 py-3 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-xl text-[11px] font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all appearance-none cursor-pointer"
                           >
                              <option value="Daily">Daily</option>
                              <option value="Weekly">Weekly</option>
                              <option value="Monthly">Monthly</option>
                              <option value="Franchise">Franchise</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1 italic leading-none">Price (₹)</label>
                           <input 
                              type="number"
                              required
                              value={formData.price}
                              onChange={(e) => setFormData({...formData, price: e.target.value})}
                              placeholder="0"
                              className="w-full px-4 py-3 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-xl text-[11px] font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all italic"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1 italic leading-none">Deposit (₹)</label>
                           <input 
                              type="number"
                              required
                              value={formData.deposit}
                              onChange={(e) => setFormData({...formData, deposit: e.target.value})}
                              placeholder="0"
                              className="w-full px-4 py-3 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-xl text-[11px] font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all italic"
                           />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <label className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1 italic leading-none">Included Features (comma separated)</label>
                           <textarea 
                              required
                              rows={2}
                              value={formData.features}
                              onChange={(e) => setFormData({...formData, features: e.target.value})}
                              placeholder="e.g. 24h Access, Premium Support..."
                              className="w-full px-4 py-3 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-xl text-[10px] font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-[var(--text-tertiary)]/30 no-scrollbar"
                           />
                        </div>
                     </div>

                     <button 
                        type="submit"
                        className="w-full py-4 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-emerald-950/20 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-3"
                     >
                        <Zap size={16} fill="white" /> Save Plan
                     </button>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}
