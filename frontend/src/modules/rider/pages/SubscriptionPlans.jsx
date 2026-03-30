import { motion } from 'framer-motion';
import { PageWrapper } from '../components/PageWrapper';
import { GlassCard } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useThemeStore } from '../store/themeStore';

export default function SubscriptionPlans() {
  const { plans, selectedPlan, selectPlan } = useSubscriptionStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <PageWrapper className="flex flex-col p-6 pb-24 text-center">
       <div className="mb-10">
          <h1 className={`text-3xl font-heading font-black transition-colors duration-500 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>Choose Your<br /><span className="text-flexigo-teal">Freedom.</span></h1>
          <p className={`text-sm mt-2 transition-colors duration-500 ${
            isDark ? 'text-gray-500' : 'text-slate-500'
          }`}>Pick a plan that fits your mobility needs.</p>
       </div>

       <div className="space-y-6 flex-1">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => selectPlan(plan)}
            >
              <GlassCard 
                className={`relative p-6 overflow-hidden transition-all duration-300 border-2 ${
                  selectedPlan?.id === plan.id 
                    ? 'border-flexigo-teal' 
                    : isDark ? 'border-white/10' : 'border-slate-200'
                }`}
                glow={selectedPlan?.id === plan.id}
                glowColor={plan.color}
              >
                {plan.popular && (
                  <div 
                    className="absolute top-0 right-0 px-4 py-1.5 text-[10px] font-black uppercase rounded-bl-xl tracking-widest text-black shadow-sm"
                    style={{ background: plan.color }}
                  >
                    Best Choice
                  </div>
                )}

                <div className="flex justify-between items-start mb-4">
                  <div className="text-left">
                    <h3 className={`text-xl font-heading font-black transition-colors duration-500 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>{plan.label}</h3>
                    <div className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${
                      isDark ? 'text-gray-500' : 'text-slate-400'
                    }`}>{plan.duration}</div>
                  </div>
                  <div className="text-right">
                    <span className={`text-2xl font-heading font-black transition-colors duration-500 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>₹{plan.price}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.perks.map((perk, i) => (
                    <div key={i} className={`flex items-center gap-2 text-xs font-bold transition-colors duration-500 ${
                      isDark ? 'text-gray-400' : 'text-slate-500'
                    }`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="3" className="w-3 h-3">
                        <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {perk}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  {selectedPlan?.id === plan.id ? (
                    <div className="text-[10px] font-black uppercase text-flexigo-teal tracking-[0.2em] shadow-sm">Selected Plan</div>
                  ) : (
                    <div className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${
                      isDark ? 'text-gray-600' : 'text-slate-400'
                    }`}>Tap to choose</div>
                  )}
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    selectedPlan?.id === plan.id 
                      ? 'border-flexigo-teal bg-flexigo-teal/10 shadow-[0_0_8px_#39FF1444]' 
                      : isDark ? 'border-white/10' : 'border-slate-200'
                  }`}>
                    {selectedPlan?.id === plan.id && <div className="w-2.5 h-2.5 bg-flexigo-teal rounded-full shadow-sm" />}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
       </div>

       <div className="mt-10">
          <NeonButton 
            variant="solid" 
            size="xl" 
            className="w-full"
            disabled={!selectedPlan}
            onClick={() => {}}
          >
            Activate Subscription
          </NeonButton>
          <p className={`text-center text-[10px] mt-4 uppercase font-bold tracking-[0.2em] transition-colors duration-500 ${
            isDark ? 'text-gray-600' : 'text-slate-400'
          }`}>Billed monthly via FlexiGo</p>
       </div>
    </PageWrapper>
  );
}
