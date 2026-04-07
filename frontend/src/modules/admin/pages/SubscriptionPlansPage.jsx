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
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminStatCard from '../components/AdminStatCard';

const initialPlans = [
  { id: 'PLAN-001', name: 'Daily Quick', type: 'Daily', price: 250, deposit: 500, features: ['24h Access', 'Basic Support', 'Standard Hub Pickups'], status: 'active' },
  { id: 'PLAN-002', name: 'Weekly Professional', type: 'Weekly', price: 1450, deposit: 2000, features: ['Priority Support', 'Unlimited Swaps', 'Roadside Assist'], status: 'active' },
  { id: 'PLAN-003', name: 'Monthly Delivery Pro', type: 'Monthly', price: 4200, deposit: 3500, features: ['Premium Dashboard', 'Fleet Management Tool', 'Insurance Cover'], status: 'active' },
];

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState(initialPlans);
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
      setFormData({ name: '', type: 'Daily', price: '', deposit: '', features: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const newPlan = {
      id: editingPlan ? editingPlan.id : `PLAN-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name,
      type: formData.type,
      price: parseInt(formData.price),
      deposit: parseInt(formData.deposit),
      features: formData.features.split(',').map(f => f.trim()),
      status: editingPlan ? editingPlan.status : 'active'
    };

    if (editingPlan) {
      setPlans(prev => prev.map(p => p.id === editingPlan.id ? newPlan : p));
    } else {
      setPlans(prev => [newPlan, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setPlans(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
               <h1 className="text-2xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Subscription <span className="text-emerald-500">Engine</span>
               </h1>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-tertiary)] ml-4">
               Pricing Protocols • Revenue Tier Management
            </p>
         </div>
         
         <button 
           onClick={() => handleOpenModal()}
           className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-950/20 active:scale-95"
         >
            <Plus size={16} strokeWidth={3} /> Create Tier Node
         </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
         <AdminStatCard title="Active Plans" value={plans.length} icon={Layers} color="emerald" subtitle="Market Offerings" />
         <AdminStatCard title="Avg. Ticket" value="₹1,840" icon={IndianRupee} color="blue" subtitle="Revenue Per User" />
         <AdminStatCard title="Churn Rate" value="1.2%" icon={ZapOff} color="rose" subtitle="Plan Cancellations" />
         <AdminStatCard title="Growth Tier" value="24%" icon={TrendingUp} color="emerald" subtitle="Monthly Expansion" />
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <AnimatePresence mode='popLayout'>
            {plans.map((plan) => (
               <motion.div 
                 layout
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 key={plan.id} 
                 className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2.5rem] p-8 shadow-sm hover:border-emerald-500/30 transition-all group relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                     <Zap size={100} strokeWidth={1} />
                  </div>

                  <div className="flex justify-between items-start mb-10 relative z-10">
                     <div className="space-y-1">
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">{plan.type} CYCLE</span>
                        <h3 className="text-xl font-black text-[var(--text-primary)] uppercase italic tracking-tighter pt-2 leading-none">{plan.name}</h3>
                        <p className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase">{plan.id}</p>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => handleOpenModal(plan)} className="p-2 bg-[var(--bg-tertiary)] hover:bg-emerald-600/10 rounded-xl text-[var(--text-tertiary)] hover:text-emerald-500 transition-all">
                           <Edit3 size={16} />
                        </button>
                        <button onClick={() => handleDelete(plan.id)} className="p-2 bg-[var(--bg-tertiary)] hover:bg-rose-600/10 rounded-xl text-[var(--text-tertiary)] hover:text-rose-500 transition-all">
                           <Trash2 size={16} />
                        </button>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                     <div className="p-4 bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--border-subtle)]">
                        <p className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest mb-1">Price</p>
                        <p className="text-xl font-black text-emerald-500 tracking-tighter">₹{plan.price}</p>
                     </div>
                     <div className="p-4 bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--border-subtle)]">
                        <p className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest mb-1">Deposit</p>
                        <p className="text-xl font-black text-[var(--text-primary)] tracking-tighter italic">₹{plan.deposit}</p>
                     </div>
                  </div>

                  <div className="space-y-3 mb-10 relative z-10">
                     <p className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Protocol Features</p>
                     <div className="space-y-2">
                        {plan.features.map((f, i) => (
                           <div key={i} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 shadow-[0_0_8px_#10b981]" />
                              <span className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-tight italic">{f}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                   <button 
                      onClick={() => alert(`METRICS_STREAM: ${plan.id}`)}
                      className="w-full py-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-primary)] hover:border-emerald-500/40 hover:bg-emerald-600/5 transition-all flex items-center justify-center gap-3 group/btn active:scale-95"
                   >
                      View Performance Metrics <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                   </button>

               </motion.div>
            ))}
         </AnimatePresence>
      </div>

      {/* Plan Modal */}
      <AnimatePresence>
         {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[3rem] p-12 shadow-2xl space-y-10"
               >
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter italic">
                           {editingPlan ? 'Configure' : 'Deploy'} <span className="text-emerald-500">Plan Tier</span>
                        </h2>
                        <p className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.4em]">Node Registry: SUBS_ENG_6.0</p>
                     </div>
                     <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-rose-600/10 hover:text-rose-500 transition-all rounded-2xl">
                        <X size={24} />
                     </button>
                  </div>

                  <form onSubmit={handleSave} className="space-y-8">
                     <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 space-y-3">
                           <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] ml-2">Plan Name Identity</label>
                           <input 
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              placeholder="e.g. Gig Economy Heavy"
                              className="w-full px-8 py-5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-3xl text-sm font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-[var(--text-tertiary)]/50 italic"
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] ml-2">Cycle Type</label>
                           <select 
                              value={formData.type}
                              onChange={(e) => setFormData({...formData, type: e.target.value})}
                              className="w-full px-8 py-5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-3xl text-sm font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all appearance-none cursor-pointer"
                           >
                              <option value="Daily">Daily</option>
                              <option value="Weekly">Weekly</option>
                              <option value="Monthly">Monthly</option>
                           </select>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] ml-2">Rental Price (₹)</label>
                           <input 
                              type="number"
                              required
                              value={formData.price}
                              onChange={(e) => setFormData({...formData, price: e.target.value})}
                              placeholder="0"
                              className="w-full px-8 py-5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-3xl text-sm font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all italic"
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] ml-2">Security Deposit (₹)</label>
                           <input 
                              type="number"
                              required
                              value={formData.deposit}
                              onChange={(e) => setFormData({...formData, deposit: e.target.value})}
                              placeholder="0"
                              className="w-full px-8 py-5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-3xl text-sm font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all italic"
                           />
                        </div>
                        <div className="col-span-2 space-y-3">
                           <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] ml-2">Service Protocols (Features, comma separated)</label>
                           <textarea 
                              required
                              rows={3}
                              value={formData.features}
                              onChange={(e) => setFormData({...formData, features: e.target.value})}
                              placeholder="e.g. 24h Access, Premium Support, Roadside Assist"
                              className="w-full px-8 py-5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-3xl text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-[var(--text-tertiary)]/50 no-scrollbar"
                           />
                        </div>
                     </div>

                     <button 
                        type="submit"
                        className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-emerald-950/40 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-4"
                     >
                        <Zap size={20} fill="white" /> Execute Tier Deployment
                     </button>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}
