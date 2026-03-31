import { motion } from 'framer-motion';
import { PageWrapper } from '../components/PageWrapper';
import { GlassCard } from '../components/GlassCard';
import { BatteryIndicator } from '../components/BatteryIndicator';
import { StatCard } from '../components/StatCard';
import { NeonButton } from '../components/NeonButton';
import { useRideStore } from '../store/rideStore';
import { useThemeStore } from '../store/themeStore';
import { useNavigate } from 'react-router-dom';

import scooterRender from '../../../assets/scooter_render.png';

export default function LiveGarage() {
  const navigate = useNavigate();
  const { vehicle, rideStatus, setUnlocking } = useRideStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const handleUnlockVehicle = () => {
    setUnlocking();
    // In a real app, this would trigger an IoT command to the scooter
    alert("Vehicle Unlocked! You can now start your work session on other platforms.");
  };

  return (
    <PageWrapper className="flex flex-col px-6 pt-6 pb-20">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] tracking-[0.3em] uppercase font-black text-flexigo-teal">Vehicle Fleet Status</span>
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
        <div className="w-full max-w-[280px] py-4 relative">
          <BatteryIndicator percentage={vehicle.battery} size="lg" />
          
          {/* Decorative Glow */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-flexigo-teal/5 rounded-full blur-[100px] pointer-events-none transition-opacity duration-500 ${
            isDark ? 'opacity-100' : 'opacity-40'
          }`} />
        </div>

        {/* Vehicle Image Professional Render */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full h-56 mb-8 flex items-center justify-center p-4"
        >
          <img 
            src={scooterRender} 
            alt="Flexigo Electric Scooter" 
            className="w-full h-full object-contain drop-shadow-2xl transition-all duration-500"
          />
          {/* Subtle Dynamic Shadow */}
          <div className={`absolute bottom-6 w-32 h-2 rounded-full blur-xl transition-colors duration-500 ${
            isDark ? 'bg-white/5' : 'bg-slate-900/10 shadow-lg shadow-black/10'
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
            label="Active Duty" 
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

           <NeonButton variant="solid" size="full" onClick={handleUnlockVehicle}>
              Unlock Vehicle
           </NeonButton>
        </div>
      </div>
    </PageWrapper>
  );
}
