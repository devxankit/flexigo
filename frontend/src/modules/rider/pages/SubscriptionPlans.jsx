import { motion } from 'framer-motion';
import { PageWrapper } from '../components/PageWrapper';
import { GlassCard } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useThemeStore } from '../store/themeStore';

export default function SubscriptionPlans() {
  const { plans, selectedPlan, selectPlan, activePlan, activatePlan } = useSubscriptionStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const handleUpdatePlan = () => {
    if (selectedPlan) {
      activatePlan(selectedPlan);
      alert(`Plan updated to ${selectedPlan.label}!`);
    }
  };

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
            isDark ? 'text-gray-500' : 'text-slate-500'
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
             isDark ? 'text-gray-500' : 'text-slate-400'
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
                    <span className={`text-2xl font-black transition-colors opacity-50 ${isDark ? 'text-white' : 'text-slate-700'}`}>₹{activePlan.price}</span>
                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">/ Monthly</p>
                 </div>
              </div>
           </GlassCard>
         </motion.div>
       )}

       <div className="space-y-4 flex-1">
          <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] px-2 mb-2 transition-colors duration-500 ${
            isDark ? 'text-gray-500' : 'text-slate-400'
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
                    : isDark ? 'border-white/05 hover:border-white/20' : 'border-slate-100'
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${
                      selectedPlan?.id === plan.id ? 'bg-flexigo-teal/20 border-flexigo-teal/30' : 'bg-slate-500/5 border-white/05'
                    }`}>
                       <svg viewBox="0 0 24 24" fill="none" stroke={selectedPlan?.id === plan.id ? plan.color : '#6B7280'} strokeWidth="2.5" className="w-6 h-6">
                         <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                       </svg>
                    </div>
                    <div>
                      <h3 className={`text-lg font-heading font-black transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>{plan.label}</h3>
                      <div className="text-[9px] font-black uppercase tracking-widest text-gray-500">{plan.duration} Access</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xl font-heading font-black transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>₹{plan.price}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 ml-15">
                  {plan.perks.slice(0, 3).map((perk, i) => (
                    <div key={i} className={`flex items-center gap-1.5 text-[10px] font-bold transition-colors duration-500 ${
                      isDark ? 'text-gray-500' : 'text-slate-500'
                    }`}>
                      <div className="w-1 h-1 rounded-full bg-flexigo-teal" />
                      {perk.replace('Unlimited rides', 'Unlimited Fleet Usage')}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${
                    selectedPlan?.id === plan.id ? 'text-flexigo-teal' : 'text-gray-400'
                  }`}>
                    {selectedPlan?.id === plan.id ? 'Ready to Upgrade' : 'Select Tier'}
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                    selectedPlan?.id === plan.id 
                      ? 'border-flexigo-teal bg-flexigo-teal/10' 
                      : 'border-white/10'
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
          <p className="text-center text-[9px] uppercase font-black tracking-[0.2em] text-gray-600">
             Next billing on {activePlan ? 'April 24, 2024' : 'Immediately'}
          </p>
       </div>
    </PageWrapper>
  );
}
