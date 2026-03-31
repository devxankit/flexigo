import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageWrapper } from '../components/PageWrapper';
import { GlassCard } from '../components/GlassCard';
import { BottomSheet } from '../components/BottomSheet';
import { useRideStore } from '../store/rideStore';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import logo from '../../../assets/logo.png';

const chargingHubs = [
  { id: 1, name: 'FlexiHub Koramangala', distance: '0.8 km', batteries: 14, status: 'Open', color: '#39FF14' },
  { id: 2, name: 'HSR Layout Power Station', distance: '1.2 km', batteries: 8, status: 'Open', color: '#39FF14' },
  { id: 3, name: 'Indiranagar Swap Point', distance: '2.5 km', batteries: 3, status: 'Limited', color: '#EAB308' },
  { id: 4, name: 'MG Road Battery Bank', distance: '3.1 km', batteries: 22, status: 'Open', color: '#39FF14' },
  { id: 5, name: 'Whitefield Energy Hub', distance: '4.8 km', batteries: 0, status: 'Empty', color: '#EF4444' },
  { id: 6, name: 'Jayanagar Hub', distance: '5.2 km', batteries: 11, status: 'Open', color: '#39FF14' },
];

export default function HomeDashboard() {
  const navigate = useNavigate();
  const { vehicle, isDiagnosticsOpen, setDiagnosticsOpen } = useRideStore();
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const { activePlan } = useSubscriptionStore();

  const isDark = theme === 'dark';

  const filteredHubs = chargingHubs.filter(hub => 
    hub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
    <PageWrapper className={`relative min-h-screen ${isDark ? 'bg-[#0A1120]' : 'bg-slate-50/50'}`}>
      {/* Search and Greeting: Sticky Header Section on top of list */}
      <div className={`sticky top-0 z-20 px-6 pt-4 pb-6 space-y-6 transition-colors duration-500 shadow-sm ${
        isDark ? 'bg-[#0A1120]/90 backdrop-blur-xl border-white/5 border-b' : 'bg-white/90 backdrop-blur-xl border-slate-200 border-b'
      }`}>
        {/* Welcome Dashboard Section */}
        <div className="flex items-center justify-between">
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="space-y-1"
           >
             <div className="flex items-center gap-2.5">
               <div className="w-1.5 h-6 bg-flexigo-teal rounded-full shadow-[0_0_12px_rgba(57,255,20,0.5)]" />
               <h1 className={`text-3xl font-heading font-black tracking-tighter transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                 Hello, <span className="text-flexigo-teal">{user?.name?.split(' ')[0] || 'Rider'}</span>!
               </h1>
             </div>
             <p className={`text-[10px] font-black uppercase tracking-[0.2em] ml-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Active Plan: <span className="text-flexigo-teal font-bold">{activePlan?.name || 'Weekly Pro'}</span>
             </p>
           </motion.div>

           <div className={`p-1 rounded-full border flex items-center gap-2 pl-3 pr-1 backdrop-blur-xl ${
             isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200 shadow-sm'
           }`}>
              <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-flexigo-teal' : 'text-slate-600'}`}>Live</span>
              <div className="w-6 h-6 rounded-full bg-flexigo-teal flex items-center justify-center animate-pulse shadow-[0_0_8px_#39FF14]">
                <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
              </div>
           </div>
        </div>

        {/* Search Bar Professional */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`backdrop-blur-3xl border transition-all duration-500 rounded-2xl p-4 flex items-center gap-4 shadow-xl relative group ${
            isDark ? 'bg-slate-900/60 border-white/10 shadow-black/20' : 'bg-white border-slate-200 shadow-slate-200/50'
          }`}
        >
          <div className="absolute inset-0 bg-flexigo-teal/[0.03] opacity-0 group-focus-within:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
          <svg viewBox="0 0 24 24" fill="none" stroke={isDark ? '#39FF14' : '#0F766E'} strokeWidth="3" className="w-5 h-5 opacity-70">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a battery hub..." 
            className={`bg-transparent border-none outline-none text-sm w-full font-bold placeholder:text-slate-500 transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          />
          <div className="w-px h-6 bg-slate-500/20" />
          <svg className="w-5 h-5 text-slate-400 ml-1 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
        </motion.div>
      </div>

      <div className="px-6 space-y-6 pt-2">
        {/* Hub List Section */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className={`text-xl font-heading font-black tracking-tight transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>Nearest Hubs</h2>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Based on your live location</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 pb-12">
          {filteredHubs.map((hub, i) => (
            <motion.div
              key={hub.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/rider/hub/' + hub.id)}
              className="cursor-pointer"
            >
              <GlassCard className="p-5 flex items-center gap-5 group hover:border-flexigo-teal/40 transition-all duration-500 hover:shadow-2xl">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-700 shadow-lg group-hover:-rotate-6 shrink-0 relative overflow-hidden"
                  style={{ 
                    backgroundColor: isDark ? `${hub.color}22` : `${hub.color}15`, 
                    borderColor: isDark ? `${hub.color}44` : `${hub.color}33`,
                    boxShadow: isDark ? `0 8px 24px -12px ${hub.color}` : `0 8px 24px -10px ${hub.color}` 
                  }}
                >
                  <img 
                    src={logo} 
                    alt="Flexigo" 
                    className={`absolute w-full h-full object-contain transition-all duration-700 ${
                      isDark ? 'brightness-0 invert opacity-40 group-hover:opacity-70' : 'brightness-0 opacity-80 group-hover:opacity-100'
                    } scale-[1.45]`} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/5" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className={`font-heading font-black tracking-tight truncate transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>{hub.name}</h3>
                  <div className="flex items-center gap-2.5 mt-1">
                    <div className={`flex items-center gap-1 transition-colors ${isDark ? 'text-slate-400' : 'text-slate-500 opacity-60'}`}>
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /></svg>
                      <span className="text-[10px] font-black uppercase tracking-widest">{hub.distance}</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className={`text-[10px] font-black uppercase tracking-widest`} style={{ color: hub.color }}>
                      {hub.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className={`text-xs font-black p-1 px-2.5 rounded-lg border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100 text-slate-800'}`}>
                    {hub.batteries}
                  </div>
                  <span className="text-[8px] font-black text-gray-400/80 uppercase tracking-tighter">Batteries</span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
          
          <div className="text-center py-10 opacity-30">
            <div className="inline-block w-8 h-1 bg-flexigo-teal/40 rounded-full mb-3" />
            <p className="text-[9px] font-black uppercase tracking-[0.4em]">End of results</p>
          </div>
        </div>
      </div>
    </PageWrapper>

    <BottomSheet 
      isOpen={isDiagnosticsOpen} 
      onClose={() => setDiagnosticsOpen(false)}
      title="Vehicle Diagnostics"
    >
      <div className="px-6 pb-24 pt-4 space-y-6">
        {/* Main Status Card */}
        <GlassCard className="p-5 flex items-center gap-4 group">
          <div className="w-16 h-16 rounded-2xl bg-flexigo-teal/10 flex items-center justify-center overflow-hidden border border-flexigo-teal/20 transition-all group-hover:scale-105 duration-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="1.5" className="w-10 h-10">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className={`font-heading font-black text-xl transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>{vehicle.model}</h3>
            <p className="text-gray-500 text-[10px] mt-1 uppercase tracking-[0.25em] font-black">{vehicle.plateNumber}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="bg-flexigo-teal/20 text-flexigo-teal px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-[0_0_15px_#39FF1444]">
              LIVE
            </div>
            <span className="text-[10px] font-bold text-gray-500 italic">Connected ✓</span>
          </div>
        </GlassCard>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="p-5 flex flex-col gap-3 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12">
               <svg viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
            </div>
            <span className="text-[10px] tracking-[0.25em] uppercase font-black text-gray-500">Live Range</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-heading font-black transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>{vehicle.range}</span>
              <span className="text-flexigo-teal text-xs font-black uppercase">KM</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }} 
                 animate={{ width: '85%' }} 
                 className="h-full bg-flexigo-teal shadow-[0_0_10px_#39FF14]" 
               />
            </div>
          </GlassCard>
          
          <GlassCard className="p-5 flex flex-col gap-3 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 -rotate-12">
               <svg viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20"><path d="M7 2v10h3l-4 8v-8h3z"/></svg>
            </div>
            <span className="text-[10px] tracking-[0.25em] uppercase font-black text-gray-500">Battery</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-heading font-black text-flexigo-teal">{vehicle.battery}%</span>
            </div>
            <div className="flex gap-1.5">
              {Array.from({length: 5}).map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${i < 4 ? 'bg-flexigo-teal shadow-[0_0_8px_#39FF14]' : 'bg-gray-500/20'}`} />
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Sustainability Insight */}
        <div className={`border border-flexigo-teal/20 rounded-2xl p-5 flex items-center gap-5 transition-all duration-500 ${isDark ? 'bg-flexigo-teal/5' : 'bg-flexigo-teal/[0.03]'}`}>
           <div className="w-12 h-12 rounded-2xl bg-flexigo-teal/10 flex items-center justify-center text-flexigo-teal shadow-inner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
           </div>
           <p className={`text-[11px] font-black uppercase tracking-wider leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
             Impact: You've saved <span className="text-flexigo-teal font-black text-sm">12.5KG</span> of carbon footprint this week.
           </p>
        </div>
      </div>
    </BottomSheet>
    </>
  );
}

