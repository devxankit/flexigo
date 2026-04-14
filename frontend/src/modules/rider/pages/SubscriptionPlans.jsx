import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageWrapper } from '../components/PageWrapper';
import { GlassCard } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useThemeStore } from '../store/themeStore';

export default function SubscriptionPlans() {
  const { plans, selectedPlan, selectPlan, activePlan, activatePlan } = useSubscriptionStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [isPaying, setIsPaying] = useState(false);
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('UPI');

  const handleUpdatePlan = () => {
    if (selectedPlan) {
      setIsPaying(true);
    }
  };

  const handleOpenRazorpay = () => {
    setShowRazorpay(true);
  };

  const handleFinalPayment = async () => {
    setPaymentSuccess(true);
    await new Promise(r => setTimeout(r, 1500));
    activatePlan(selectedPlan);
    setIsPaying(false);
    setShowRazorpay(false);
    setPaymentSuccess(false);
    selectPlan(null);
  };

  const paymentMethods = [
    { id: 'UPI', label: 'UPI Transfer', sub: 'Instant Verification', icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg> },
    { id: 'CARD', label: 'Credit / Debit Card', sub: 'Secure Gateway', icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg> },
    { id: 'BANK', label: 'Net Banking', sub: 'All Indian Banks', icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-5z"/></svg> },
  ];

  return (
    <PageWrapper className="flex flex-col p-6 pt-6 pb-32">
       <div className="mb-6 text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-8 bg-flexigo-teal rounded-full" />
            <h1 className={`text-3xl font-heading font-black transition-colors duration-500 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>Subscription <span className="text-flexigo-teal">Management</span></h1>
          </div>
          <p className={`text-xs ml-4 font-black uppercase tracking-[0.2em] transition-colors duration-500 ${
            isDark ? 'text-gray-500' : 'text-slate-600'
          }`}>Manage your fleet access and billing tiers.</p>
       </div>

       {/* Current Active Plan Banner */}
       {activePlan && (
         <motion.div 
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="mb-10"
         >
           <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] px-2 mb-3 transition-colors duration-500 ${
             isDark ? 'text-gray-500' : 'text-slate-500'
           }`}>Current Active Plan</h3>
           <GlassCard className="p-6 border-flexigo-teal/30 bg-flexigo-teal/[0.03] relative overflow-hidden group shadow-2xl">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-flexigo-teal/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex justify-between items-center relative z-10">
                 <div>
                    <h4 className={`text-2xl font-heading font-black transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {activePlan.label} <span className="text-flexigo-teal">Tier</span>
                    </h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-flexigo-teal mt-1">Status: Active & Verified</p>
                 </div>
                 <div className="text-right">
                    <span className={`text-2xl font-black transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>₹{activePlan.price}</span>
                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">/ Monthly</p>
                 </div>
              </div>
           </GlassCard>
         </motion.div>
       )}

       <div className="space-y-4 flex-1">
          <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] px-2 mb-2 transition-colors duration-500 ${
            isDark ? 'text-gray-500' : 'text-slate-950 font-black'
          }`}>{activePlan ? 'Upgrade Options' : 'Available Plans'}</h3>
          
          {plans.filter(p => p.id !== activePlan?.id).map((plan) => (
            <motion.div
              key={plan.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => selectPlan(plan)}
            >
              <GlassCard 
                className={`relative p-5 overflow-hidden transition-all duration-300 border shadow-lg ${
                  selectedPlan?.id === plan.id 
                    ? 'border-flexigo-teal bg-flexigo-teal/5' 
                    : isDark ? 'border-white/05 hover:border-white/20' : 'border-slate-300 bg-white hover:border-flexigo-teal/50'
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${
                      selectedPlan?.id === plan.id ? 'bg-flexigo-teal/20 border-flexigo-teal/30' : (isDark ? 'bg-slate-500/5 border-white/05' : 'bg-slate-100 border-slate-200')
                    }`}>
                       <svg viewBox="0 0 24 24" fill="none" stroke={selectedPlan?.id === plan.id ? plan.color : '#6B7280'} strokeWidth="2.5" className="w-6 h-6">
                         <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                       </svg>
                    </div>
                    <div>
                      <h3 className={`text-lg font-heading font-black transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>{plan.label}</h3>
                      <div className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>{plan.duration} Access</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xl font-heading font-black transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>₹{plan.price}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
                  {plan.perks.slice(0, 3).map((perk, i) => (
                    <div key={i} className={`flex items-center gap-1.5 text-[10px] font-bold transition-colors duration-500 ${
                      isDark ? 'text-gray-500' : 'text-slate-500'
                    }`}>
                      <div className="w-1 h-1 rounded-full bg-flexigo-teal" />
                      {perk}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${
                    selectedPlan?.id === plan.id ? 'text-flexigo-teal' : (isDark ? 'text-gray-400' : 'text-slate-400')
                  }`}>
                    {selectedPlan?.id === plan.id ? 'Ready to Upgrade' : 'Select Tier'}
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                    selectedPlan?.id === plan.id 
                      ? 'border-flexigo-teal bg-flexigo-teal/10' 
                      : (isDark ? 'border-white/10' : 'border-slate-400')
                  }`}>
                    {selectedPlan?.id === plan.id && <div className="w-2 h-2 bg-flexigo-teal rounded-full shadow-sm" />}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
       </div>

       <div className="mt-12 space-y-4">
          <NeonButton 
            variant="solid" 
            size="full" 
            disabled={!selectedPlan}
            onClick={handleUpdatePlan}
          >
            Confirm Plan Upgrade
          </NeonButton>
           <p className={`text-center text-[9px] uppercase font-black tracking-[0.2em] transition-colors ${isDark ? 'text-gray-600' : 'text-slate-700'}`}>
             Next billing on {activePlan ? 'the next cycle' : 'Immediately'}
          </p>
       </div>

        <AnimatePresence>
          {isPaying && (
            <div className="fixed inset-0 z-[9999] flex items-end justify-center px-4">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                 onClick={() => !paymentSuccess && !showRazorpay && setIsPaying(false)}
               />
               <motion.div 
                 initial={{ y: '100%' }}
                 animate={{ y: 0 }}
                 exit={{ y: '100%' }}
                 transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                 className={`relative w-full max-w-lg rounded-t-[2.5rem] p-8 pb-12 shadow-2xl border-t border-white/10 ${
                   isDark ? 'bg-[#0A1120]' : 'bg-white'
                 }`}
               >
                  {paymentSuccess ? (
                    <div className="text-center py-10 space-y-6">
                       <div className="w-20 h-20 bg-flexigo-teal/20 border-2 border-flexigo-teal rounded-full flex items-center justify-center mx-auto shadow-neon-sm">
                          <svg viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="4" className="w-10 h-10">
                            <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                       </div>
                       <div className="space-y-1">
                          <h3 className={`text-2xl font-heading font-black italic ${isDark ? 'text-white' : 'text-slate-900'}`}>PAYMENT_LOCKED</h3>
                          <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-gray-500' : 'text-slate-950 font-black'}`}>Subscription activated successfully</p>
                       </div>
                    </div>
                  ) : showRazorpay ? (
                    <div className="space-y-8 py-4">
                       <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                             <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white font-black text-lg shadow-lg">R</div>
                             <span className="font-heading font-black text-slate-900 italic">Razorpay <span className="text-blue-500">Checkout</span></span>
                          </div>
                          <div className="text-right">
                             <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Order Ref</p>
                             <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">#ORD_{Math.floor(Math.random() * 999999)}</p>
                          </div>
                       </div>

                       <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                          <div className="flex justify-between items-center mb-6">
                             <div>
                                <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] mb-1">Paying To</p>
                                <p className="text-sm font-black text-slate-900 italic">Flexigo Hub Operations</p>
                             </div>
                             <div className="text-right">
                                <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] mb-1">Amount</p>
                                <p className="text-2xl font-black text-slate-900 leading-none italic">₹{selectedPlan?.price}</p>
                             </div>
                          </div>
                          
                          <div className="space-y-3">
                             <div className={`p-4 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-between shadow-sm`}>
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                                   </div>
                                   <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{selectedMethod}</span>
                                </div>
                                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Active Channel ✓</span>
                             </div>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <button 
                            onClick={handleFinalPayment}
                            className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] transition-all transform active:scale-[0.98] shadow-xl"
                          >
                            Finalize Secure Payment
                          </button>
                          <button 
                            onClick={() => setShowRazorpay(false)}
                            className="w-full text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-slate-900"
                          >
                            Go Back to Summary
                          </button>
                       </div>

                       <div className="flex items-center justify-center gap-3 pt-2 opacity-60">
                          <div className="flex items-center gap-1">
                             <div className="w-3 h-3 bg-slate-200 rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /></div>
                             <span className="text-[7px] font-black uppercase tracking-widest text-slate-900">Encrypted</span>
                          </div>
                          <div className="w-px h-3 bg-slate-200" />
                          <span className="text-[7px] font-black uppercase tracking-widest text-slate-900 tracking-[0.4em]">PCI_SECURE</span>
                       </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                       <div className="flex justify-between items-center">
                          <h3 className={`text-2xl font-heading font-black italic ${isDark ? 'text-white' : 'text-slate-900'}`}>Checkout <span className="text-flexigo-teal">Summary</span></h3>
                          <button onClick={() => setIsPaying(false)} className={`p-2 rounded-full ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                       </div>

                       <GlassCard className={`p-6 space-y-4 border ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-300 bg-white shadow-xl shadow-slate-200/50'}`}>
                          <div className="flex justify-between items-center">
                             <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-gray-400' : 'text-slate-950 font-black'}`}>Selected Tier</span>
                             <span className={`text-sm font-black uppercase italic ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedPlan?.label}</span>
                          </div>
                          <div className={`h-px ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />
                          <div className="flex justify-between items-center">
                             <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-gray-400' : 'text-slate-950 font-black'}`}>Amount Payable</span>
                             <span className={`text-2xl font-black italic text-flexigo-teal`}>₹{selectedPlan?.price}</span>
                          </div>
                       </GlassCard>

                       <div className="space-y-4">
                          <p className={`text-[8px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-white/40' : 'text-slate-950 font-black opacity-80'}`}>Secure Payment Channels</p>
                          <div className="space-y-3">
                             {paymentMethods.map((method) => (
                                <div 
                                  key={method.id}
                                  onClick={() => setSelectedMethod(method.id)}
                                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                                    selectedMethod === method.id 
                                      ? 'border-flexigo-teal bg-flexigo-teal/5 shadow-[0_0_20px_rgba(57,255,20,0.1)]' 
                                      : (isDark ? 'border-white/5 bg-white/[0.02] hover:border-white/10' : 'border-slate-300 bg-white hover:border-slate-300')
                                  }`}
                                >
                                   <div className="flex items-center gap-4">
                                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                        selectedMethod === method.id ? 'bg-flexigo-teal text-white shadow-neon-sm' : (isDark ? 'bg-white/10 text-gray-500' : 'bg-slate-100 text-slate-500')
                                      }`}>
                                         {method.icon}
                                      </div>
                                      <div>
                                         <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? (selectedMethod === method.id ? 'text-white' : 'text-gray-400') : (selectedMethod === method.id ? 'text-flexigo-teal' : 'text-slate-950')}`}>{method.label}</p>
                                         <p className={`text-[8px] font-black italic ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{method.sub}</p>
                                      </div>
                                   </div>
                                   <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                                     selectedMethod === method.id ? 'border-flexigo-teal bg-flexigo-teal shadow-[0_0_8px_#39FF1444]' : (isDark ? 'border-white/10' : 'border-slate-300')
                                   }`}>
                                      {selectedMethod === method.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>

                       <div className="pt-2">
                          <NeonButton variant="solid" size="full" onClick={handleOpenRazorpay}>
                             Complete Secure Purchase
                          </NeonButton>
                       </div>
                    </div>
                  )}
               </motion.div>
            </div>
          )}
       </AnimatePresence>
    </PageWrapper>
  );
}
