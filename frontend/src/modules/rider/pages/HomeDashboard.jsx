import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageWrapper } from '../components/PageWrapper';
import { GlassCard } from '../components/GlassCard';
import { BottomSheet } from '../components/BottomSheet';
import { useRideStore } from '../store/rideStore';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useThemeStore } from '../store/themeStore';

export default function HomeDashboard() {
  const [activeSheet, setActiveSheet] = useState(false);
  const { vehicle } = useRideStore();
  const { theme } = useThemeStore();
  const { activePlan } = useSubscriptionStore();

  const isDark = theme === 'dark';

  useEffect(() => {
    // Auto-open sheet after a delay to show info
    const timer = setTimeout(() => setActiveSheet(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
    <PageWrapper className="relative overflow-hidden">
      {/* Mock Map Background */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 transition-colors duration-500 ${
          isDark ? 'bg-[#0A0B14]' : 'bg-slate-100'
        }`} />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: isDark 
              ? `radial-gradient(circle at 50% 50%, #39FF14 1px, transparent 1px)`
              : `radial-gradient(circle at 50% 50%, #047857 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        {/* Mock Map Markers */}
        {[
          { top: '30%', left: '40%', type: 'vehicle' },
          { top: '60%', left: '70%', type: 'swap' },
          { top: '45%', left: '20%', type: 'hub' },
        ].map((marker, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{ top: marker.top, left: marker.left }}
          >
            <div className="absolute inset-0 bg-flexigo-teal/20 rounded-full animate-ping" />
            <div 
              className={`relative w-4 h-4 rounded-full border-2 ${isDark ? 'border-white' : 'border-slate-800'}`}
              style={{ background: marker.type === 'swap' ? '#00D4FF' : '#39FF14' }}
            />
          </motion.div>
        ))}
      </div>

      {/* Search Bar Floating */}
      <div className="absolute top-28 left-6 right-6 z-10">
        <div className={`backdrop-blur-xl border transition-all duration-500 rounded-2xl p-4 flex items-center gap-3 ${
          isDark ? 'bg-slate-900/40 border-white/10' : 'bg-white/80 border-slate-200 shadow-lg'
        }`}>
          <svg viewBox="0 0 24 24" fill="none" stroke={isDark ? 'white' : '#1e293b'} strokeWidth="2" className="w-5 h-5 opacity-40">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input 
            placeholder="Search battery stations..." 
            className={`bg-transparent border-none outline-none text-sm w-full font-bold placeholder:text-slate-500 transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          />
        </div>
      </div>
    </PageWrapper>

    <BottomSheet 
      isOpen={activeSheet} 
      onClose={() => setActiveSheet(false)}
      title="Ride Intelligence"
    >
      <div className="px-6 pb-24 pt-4 space-y-6">
        <GlassCard className="p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-flexigo-teal/10 flex items-center justify-center overflow-hidden border border-flexigo-teal/20">
            <svg viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="1.5" className="w-10 h-10">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className={`font-heading font-black transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>{vehicle.model}</h3>
            <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest font-bold">{vehicle.plateNumber}</p>
          </div>
          <div className="bg-flexigo-teal/20 text-flexigo-teal px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-[0_0_12px_#39FF1444]">
            READY
          </div>
        </GlassCard>

        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="p-4 flex flex-col gap-2">
            <span className="text-[10px] tracking-wider uppercase font-black text-gray-500">Live Range</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-heading font-black transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>{vehicle.range}</span>
              <span className="text-gray-500 text-xs font-black uppercase">KM</span>
            </div>
          </GlassCard>
          <GlassCard className="p-4 flex flex-col gap-2">
            <span className="text-[10px] tracking-wider uppercase font-black text-gray-500">Battery</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-heading font-black text-flexigo-teal">{vehicle.battery}%</span>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-4">
           <div className="flex items-center justify-between">
              <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${isDark ? 'text-white' : 'text-slate-500'}`}>Active Plan</h4>
              <button className="text-flexigo-teal text-xs font-black uppercase tracking-tighter underline underline-offset-4">Upgrade</button>
           </div>
           <GlassCard className="p-4" glow glowColor="#22C55E">
              <div className="flex justify-between items-center">
                <div>
                  <div className={`font-heading font-black transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>Weekly Premium</div>
                  <div className="text-gray-500 text-[10px] mt-1 font-bold uppercase tracking-widest">Expiring in 4 days</div>
                </div>
                <div className="w-1.5 h-10 bg-flexigo-teal rounded-full shadow-[0_0_12px_#39FF14]" />
              </div>
           </GlassCard>
        </div>
      </div>
    </BottomSheet>
    </>
  );
}
