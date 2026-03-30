import { motion } from 'framer-motion';
import { PageWrapper } from '../components/PageWrapper';
import { GlassCard } from '../components/GlassCard';
import { BatteryIndicator } from '../components/BatteryIndicator';
import { StatCard } from '../components/StatCard';
import { NeonButton } from '../components/NeonButton';
import { useRideStore } from '../store/rideStore';
import { useThemeStore } from '../store/themeStore';
import { useNavigate } from 'react-router-dom';

export default function LiveGarage() {
  const navigate = useNavigate();
  const { vehicle, rideStatus, setUnlocking } = useRideStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const handleStartRide = () => {
    setUnlocking();
    navigate('/rider/ride');
  };

  return (
    <PageWrapper className="flex flex-col px-6 pb-32">
      <div className="flex justify-between items-center mb-10">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] tracking-[0.3em] uppercase font-black text-flexigo-teal">Live Garage Status</span>
          <h1 className={`text-2xl font-heading font-black transition-colors duration-500 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>Your Vehicle</h1>
        </div>
        <div className={`px-3 py-1 border rounded-full text-[10px] uppercase font-black transition-all duration-500 ${
          isDark 
            ? 'bg-white/5 border-white/10 text-gray-500' 
            : 'bg-slate-100 border-slate-200 text-slate-400 shadow-sm'
        }`}>
          ID: {vehicle.id}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center">
        {/* Battery Visual Main */}
        <div className="w-full max-w-[280px] py-10 relative">
          <BatteryIndicator percentage={vehicle.battery} size="lg" />
          
          {/* Decorative Glow */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-flexigo-teal/5 rounded-full blur-[100px] pointer-events-none transition-opacity duration-500 ${
            isDark ? 'opacity-100' : 'opacity-40'
          }`} />
        </div>

        {/* Vehicle Image Placeholder */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-full h-40 mb-10 flex items-center justify-center"
        >
          <img 
            src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=400" 
            alt="scooter silhouette" 
            className={`w-full h-full object-contain grayscale transition-all duration-500 ${
              isDark ? 'brightness-200 opacity-20' : 'brightness-50 opacity-10'
            }`}
          />
          <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent transition-colors duration-500 ${
            isDark ? 'from-[#0A0A0F]' : 'from-slate-50'
          }`} />
        </motion.div>

        {/* Status Grid */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <StatCard 
            label="Est. Range" 
            value={vehicle.range} 
            unit="KM"
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M12 2v20M2 12h20" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          />
          <StatCard 
            label="Ride Time" 
            value="142" 
            unit="MINS"
            color="#00D4FF"
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          />
        </div>

        <div className="mt-10 w-full space-y-6">
           <GlassCard className="p-4">
              <div className="flex justify-between items-center">
                 <div className="flex flex-col">
                    <span className={`text-[10px] uppercase font-black tracking-widest mb-1 transition-colors duration-500 ${
                      isDark ? 'text-gray-500' : 'text-slate-500'
                    }`}>Current Hub</span>
                    <span className={`font-black text-sm transition-colors duration-500 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>{vehicle.location}</span>
                 </div>
                 <button className={`p-2.5 rounded-xl border transition-all duration-500 ${
                   isDark 
                    ? 'bg-white/5 border-white/08 hover:bg-white/10' 
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 shadow-sm'
                 }`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="2.5" className="w-5 h-5">
                      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                 </button>
              </div>
           </GlassCard>

           <NeonButton variant="solid" size="full" onClick={handleStartRide}>
              Start Ride
           </NeonButton>
        </div>
      </div>
    </PageWrapper>
  );
}
