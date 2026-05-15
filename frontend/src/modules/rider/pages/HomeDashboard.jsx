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
import { useWalletStore } from '../store/walletStore';
import { RefreshCw, MapPin, Zap, Info, ChevronRight, Share2, Shield } from 'lucide-react';
import logo from '../../../assets/logo.png';

// Mock data removed as we are going dynamic
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export default function HomeDashboard() {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const { activePlan } = useSubscriptionStore();
  const { balance } = useWalletStore();
  const { vehicle, isDiagnosticsOpen, setDiagnosticsOpen, hubs, hubLoading, fetchHubs, currentAddress, setCurrentAddress, fetchMyVehicle } = useRideStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [coords, setCoords] = useState(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    // Initial fetch
    fetchHubs();
    if (user?.phone) fetchMyVehicle(user.phone);
    
    // Get live location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
        
        // Fetch hubs again with coordinates for backend sorting
        fetchHubs(latitude, longitude);
        
        // Reverse geocoding - with safety check for Google Maps script
        if (window.google && window.google.maps && window.google.maps.Geocoder) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
            if (status === 'OK' && results[0]) {
              setCurrentAddress(results[0].formatted_address);
            }
          });
        }
      }, (err) => {
        console.error("Location Error:", err);
      }, { enableHighAccuracy: true });
    }
  }, []);

  // Use Dynamic Hubs OR Fallback to Mocks if DB is empty after loading
  const displayHubs = hubLoading ? [] : (Array.isArray(hubs) && hubs.length > 0 ? hubs : [
    { id: 1, name: 'FlexiHub Koramangala', latitude: 12.9345, longitude: 77.6266, batteries: 14, status: 'Open', color: '#39FF14' },
    { id: 2, name: 'HSR Layout Station', latitude: 12.9128, longitude: 77.6388, batteries: 8, status: 'Open', color: '#39FF14' },
    { id: 3, name: 'Indiranagar Hub', latitude: 12.9716, longitude: 77.6412, batteries: 2, status: 'Limited', color: '#EAB308' },
  ]);

  const processedHubs = (displayHubs || []).map(hub => {
    if (!hub) return null;
    const dist = coords ? calculateDistance(coords.latitude, coords.longitude, hub.latitude, hub.longitude) : null;
    return {
      ...hub,
      distValue: dist === null ? 9999 : dist,
      distance: dist !== null ? (dist < 1 ? Math.round(dist * 1000) + ' m' : dist.toFixed(1) + ' km') : (hub.distance || 'Dist. Pending')
    };
  }).filter(Boolean).sort((a, b) => a.distValue - b.distValue);

  const filteredHubs = processedHubs.filter(hub => 
    hub?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase() || '')
  );

  return (
    <>
    <PageWrapper className={`relative min-h-screen ${isDark ? 'bg-[#0A1120]' : 'bg-slate-50/50'}`}>
      {/* Search and Greeting: Header Section that scrolls away */}
      <div className={`relative z-10 px-6 pt-4 pb-6 space-y-6 transition-colors duration-500 ${
        isDark ? 'bg-transparent' : 'bg-transparent'
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
                 Hello, <span className="text-flexigo-teal">{user?.name?.split(' ')?.[0] || 'Rider'}</span>!
               </h1>
             </div>
             {activePlan && (
               <p className={`text-[10px] font-black uppercase tracking-[0.2em] ml-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Active Plan: <span className="text-flexigo-teal font-bold">{activePlan?.name}</span>
               </p>
             )}
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



        {/* Quick Stats: Wallet & Subscription */}
        <div className="grid grid-cols-2 gap-4">
           <motion.div
             initial={{ opacity: 0, x: -10 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.3 }}
             onClick={() => navigate('/rider/wallet')}
             className="cursor-pointer"
           >
             <GlassCard className={`p-4 transition-all duration-500 hover:shadow-2xl border flex flex-col gap-1.5 ${
               isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white border-slate-200 shadow-sm'
             }`}>
                <div className="flex items-center justify-between">
                   <div className="w-7 h-7 rounded-lg bg-flexigo-teal/10 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="2.5" className="w-4 h-4">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <path d="M16 12a2 2 0 100-4h-4v4h4z" />
                        <path d="M22 10a2 2 0 11-4 0M2 10h16M2 14h16" />
                      </svg>
                   </div>
                   <div className="text-[14px] font-black text-flexigo-teal tracking-tighter shadow-sm">₹{balance}</div>
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>My Wallet</span>
             </GlassCard>
           </motion.div>

           {activePlan && (
             <motion.div
               initial={{ opacity: 0, x: 10 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.35 }}
               onClick={() => navigate('/rider/plans')}
               className="cursor-pointer"
             >
               <GlassCard className={`p-4 transition-all duration-500 hover:shadow-2xl border flex flex-col gap-1.5 ${
                 isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white border-slate-200 shadow-sm'
               }`}>
                  <div className="flex items-center justify-between">
                     <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="2.5" className="w-4 h-4">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                     </div>
                     <div className="flex flex-col items-end">
                       <div className="text-[9px] font-black text-[#00D4FF] uppercase tracking-tighter shadow-sm">Active</div>
                       {activePlan?.expiresAt && (
                         <div className="text-[7px] font-bold text-slate-500 uppercase mt-0.5">
                           Due: {activePlan.expiresAt ? new Date(activePlan.expiresAt).toLocaleDateString([], { day: 'numeric', month: 'short' }) : 'N/A'}
                         </div>
                       )}
                     </div>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>Current Plan</span>
               </GlassCard>
             </motion.div>
           )}
        </div>
      </div>

      <div className="px-6 space-y-6 pt-2">
        {/* Pickup Location Card for new riders after payment */}
        {vehicle?.model === 'Assignment Pending' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className={`p-5 border-2 border-flexigo-teal/30 bg-flexigo-teal/5 relative overflow-hidden group`}>
               <div className="flex items-center gap-4 relative z-10">
                 <div className="w-12 h-12 rounded-2xl bg-flexigo-teal flex items-center justify-center text-white shadow-[0_0_15px_rgba(57,255,20,0.4)] group-hover:rotate-6 transition-transform">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                 </div>
                 <div className="flex-1">
                   <h3 className={`text-sm font-black transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>Pickup Your Vehicle</h3>
                   <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Visit office to complete delivery</p>
                 </div>
                 <button 
                   onClick={() => window.open('https://www.google.com/maps?q=18.566177368164062,73.7693099975586&z=17&hl=en', '_blank')}
                   className="px-4 py-2 bg-flexigo-teal text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-emerald-950/40 hover:bg-emerald-400 transition-all active:scale-95"
                 >
                   Open Maps
                 </button>
               </div>
               <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none -mr-4 -mt-4">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24 text-flexigo-teal"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
               </div>
            </GlassCard>
          </motion.div>
        )}

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
            {vehicle?.images?.length > 0 ? (
              <img src={vehicle.images[0]} alt={vehicle.model} className="w-full h-full object-cover" />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="1.5" className="w-10 h-10">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <h3 className={`font-heading font-black text-xl transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>{vehicle?.model || 'No Vehicle'}</h3>
            <p className="text-gray-500 text-[10px] mt-1 uppercase tracking-[0.25em] font-black">{vehicle?.plateNumber || 'N/A'}</p>
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
              <span className={`text-3xl font-heading font-black transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>{vehicle?.range || 0}</span>
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
              <span className="text-3xl font-heading font-black text-flexigo-teal">{vehicle?.battery || 0}%</span>
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

        {/* Operational Actions */}
        <div className="space-y-3">
          <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ml-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Operational Actions</h4>
          <GlassCard 
            className={`p-4 border border-flexigo-teal/10 hover:border-flexigo-teal/30 transition-all group cursor-pointer`}
            onClick={async () => {
              if (window.confirm('Are you sure you want to request a vehicle handover?')) {
                const { requestHandover } = useRideStore.getState();
                const res = await requestHandover();
                if (res.success) {
                  alert('Handover request sent successfully. Please visit the office.');
                } else {
                  alert(res.message);
                }
              }
            }}
          >
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-flexigo-teal/10 flex items-center justify-center text-flexigo-teal group-hover:rotate-180 transition-transform duration-700">
                      <RefreshCw size={20} strokeWidth={2.5} />
                   </div>
                   <div className="space-y-0.5">
                      <h4 className={`text-sm font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Vehicle Handover</h4>
                      <p className={`text-[8px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Initiate return protocol</p>
                   </div>
                </div>
                <div className={`p-2 rounded-lg bg-flexigo-teal/5 text-flexigo-teal transition-all group-hover:translate-x-1`}>
                   <ChevronRight size={14} strokeWidth={3} />
                </div>
             </div>
          </GlassCard>
        </div>
      </div>
    </BottomSheet>
    </>
  );
}

