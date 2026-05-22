import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { RiderHeader } from '../components/RiderHeader';
import { BottomNav } from '../components/BottomNav';
import { useThemeStore } from '../store/themeStore';
import { useRideStore } from '../store/rideStore';
import { useAuthStore } from '../store/authStore';
import { reverseGeocode } from '../../../lib/googleMaps';
import { getMessaging, onMessage } from 'firebase/messaging';
import app, { requestForToken } from '../../../lib/firebase';
import { useRiderNotificationStore } from '../store/notificationStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, RefreshCw } from 'lucide-react';

export function RiderLayout() {
  const { pathname } = useLocation();
  const { theme } = useThemeStore();
  const { applyLiveLocation, updateLocation } = useRideStore();
  const { fetchProfile, user } = useAuthStore();
  const { addNotification } = useRiderNotificationStore();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user?.phone) {
      fetchProfile();
    }
  }, [user?.phone, fetchProfile]);

  useEffect(() => {
    // Live Location Fetcher with continuous polling
    if ("geolocation" in navigator) {
      const handleLocationSuccess = async (position) => {
        try {
          if (sessionStorage.getItem('simulated_gps') === 'true') {
            console.log("⏳ Skipping browser physical GPS update because mock simulator is active.");
            return;
          }
          let { latitude, longitude } = position.coords;
          
          // Use actual GPS coordinates without any location override
          console.log("✅ GPS Acquired:", latitude, longitude);
          
          // 1. Try reverse geocode but have fallback ready
          let finalAddress = `GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          try {
            const address = await reverseGeocode(latitude, longitude);
            if (address) {
              finalAddress = address;
            }
          } catch (geoErr) {
            console.warn("Geocoding failed, using GPS fallback:", geoErr);
          }
          
          applyLiveLocation({ latitude, longitude, address: finalAddress });
          console.log("📍 Address updated:", finalAddress);
          
          // 2. Database update: sync coordinates so admin panels map immediately
          try {
            await updateLocation(latitude, longitude, finalAddress);
            console.log("✅ Location synced to backend");
          } catch (apiErr) {
            console.error("❌ Backend location sync failed:", apiErr);
          }
        } catch (err) {
          console.error("❌ Location processing error:", err);
        }
      };

      const handleLocationError = (error) => {
        console.error("❌ Location Acquisition Error:", error);
        
        // Handle User Denying Geolocation Access
        if (error.code === error.PERMISSION_DENIED) {
          console.warn("⚠️ Geolocation permission denied by user.");
          setToast({
            title: "Location Permission Blocked",
            body: "Please enable location services in your browser settings to track your live ride."
          });

          // Sync location disabled status to backend
          (async () => {
            try {
              const apiModule = await import('../../../lib/axios');
              const api = apiModule.default;
              await api.patch('/rider/location', { locationStatus: 'disabled' });
              console.log("✅ Location status synced to backend (disabled)");
            } catch (syncErr) {
              console.error("❌ Failed to sync disabled location status to backend:", syncErr);
            }
          })();

          return;
        }

        // Robust fallback: try acquiring location once using low-accuracy cellular/wifi without cache
        navigator.geolocation.getCurrentPosition(
          handleLocationSuccess,
          (err) => {
            console.error("❌ Fallback Geolocation Error:", err);
            setToast({
              title: "GPS Sync Pending",
              body: "Locked inside or weak GPS signal. Please step outdoors or turn on high accuracy."
            });

            // Sync fallback disabled status to backend
            (async () => {
              try {
                const apiModule = await import('../../../lib/axios');
                const api = apiModule.default;
                await api.patch('/rider/location', { locationStatus: 'disabled' });
                console.log("✅ Fallback location status synced to backend (disabled)");
              } catch (syncErr) {
                console.error("❌ Failed to sync fallback disabled location status:", syncErr);
              }
            })();
          },
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 0 }
        );
      };

      // Watch position continuously with HIGH ACCURACY and zero cache to capture real-time movement
      const watchId = navigator.geolocation.watchPosition(
        handleLocationSuccess,
        handleLocationError,
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );

      // ALSO poll every 5 seconds to ensure continuous updates without browser cache latency
      const pollInterval = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          handleLocationSuccess,
          handleLocationError,
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
      }, 5000);

      // Immediately sync location when app is returned to foreground
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          console.log("📱 App became visible, syncing location immediately...");
          navigator.geolocation.getCurrentPosition(
            handleLocationSuccess,
            handleLocationError,
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
          );
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        navigator.geolocation.clearWatch(watchId);
        clearInterval(pollInterval);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    } else {
      console.warn("⚠️ Geolocation is NOT available in this browser context (possibly insecure HTTP connection).");
      setToast({
        title: "Insecure Connection (HTTP)",
        body: "Live GPS tracking requires an HTTPS connection or localhost. Please check your URL."
      });
    }
  }, [applyLiveLocation, updateLocation]);

  useEffect(() => {
    // Save FCM Token for real-time notifications
    const saveToken = async () => {
      const token = await requestForToken();
      if (token) {
        try {
          const { user } = useAuthStore.getState();
          const api = (await import('../../../lib/axios')).default;
          await api.post('/rider/auth/save-fcm-token', { fcmToken: token });
        } catch (err) {
          console.error("Failed to save FCM token:", err);
        }
      }
    };
    saveToken();
  }, []);

  useEffect(() => {
    const messaging = getMessaging(app);
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('🔔 Rider Notification:', payload);
      const { title, body } = payload.notification;
      
      // Add to store
      addNotification({ title, message: body });

      // Show Toast
      setToast({ title, body });
      setTimeout(() => setToast(null), 5000);
    });

    return () => unsubscribe();
  }, [addNotification]);

  useEffect(() => {
    // Reset scroll position immediately
    window.scrollTo(0, 0);

    // Hard kill Lenis and other smooth scroll conflicts
    document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped', 'lenis-scrolling');
    document.body.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped', 'lenis-scrolling');

    // Hard lock the root to prevent rubber-band scrolling on mobile
    const root = document.getElementById('root');
    
    document.documentElement.style.setProperty('overflow', 'hidden', 'important');
    document.documentElement.style.setProperty('position', 'fixed', 'important');
    document.documentElement.style.setProperty('height', '100%', 'important');
    document.documentElement.style.setProperty('width', '100%', 'important');

    document.body.style.setProperty('overflow', 'hidden', 'important');
    document.body.style.setProperty('position', 'fixed', 'important');
    document.body.style.setProperty('height', '100%', 'important');
    document.body.style.setProperty('width', '100%', 'important');
    document.body.style.setProperty('margin', '0', 'important');
    document.body.style.setProperty('padding', '0', 'important');

    if (root) {
      root.style.setProperty('overflow', 'hidden', 'important');
      root.style.setProperty('height', '100%', 'important');
      root.style.setProperty('width', '100%', 'important');
    }
    
    return () => {
      document.documentElement.style.cssText = '';
      document.body.style.cssText = '';
      if (root) root.style.cssText = '';
    };
  }, []);

  // Screens that shouldn't have the global layout (Splash, Auth)
  const isAuth = pathname === '/rider' || pathname === '/rider/' || pathname.includes('/rider/auth');
  const showHeader = !pathname.includes('/rider/onboarding') && !isAuth;
  const showBottomNav = !pathname.includes('/rider/onboarding') && !isAuth;

  if (isAuth) {
    return <Outlet />;
  }

  return (
    <div className={`fixed inset-0 transition-colors duration-500 overflow-hidden overscroll-none touch-none ${
      theme === 'dark' ? 'bg-[#0A0A0F]' : 'bg-white'
    }`}>
      {/* Header Layer */}
      {showHeader && (
        <div className={`absolute top-0 left-0 right-0 z-[60] transition-colors duration-500 ${
          theme === 'dark' 
            ? 'bg-[#0A0A0F]' 
            : 'bg-white/80 backdrop-blur-xl'
        }`}>
          <RiderHeader />
        </div>
      )}
      
      {/* Scrollable Content Layer */}
      <main className={`absolute inset-x-0 top-0 bottom-0 overflow-y-auto overflow-x-hidden ${showHeader ? 'pt-[100px]' : 'pt-0'} ${showBottomNav ? 'pb-32' : 'pb-10'} px-0 select-none touch-pan-y`}>
        <Outlet />
      </main>

      {/* Navigation Layer */}
      <div className="absolute bottom-0 left-0 right-0 z-[60] pointer-events-auto">
        <BottomNav />
      </div>

      {/* Real-time Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 20, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="fixed top-24 left-6 right-6 z-[100] mx-auto max-w-sm"
          >
            <div className={`p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex gap-4 ${
              theme === 'dark' ? 'bg-[#1A1F2C]/90 border-white/10' : 'bg-white/90 border-slate-200 shadow-slate-200/50'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-flexigo-teal/10 flex items-center justify-center text-flexigo-teal shrink-0">
                <RefreshCw size={20} strokeWidth={2.5} className="animate-spin-slow" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`text-xs font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{toast.title}</h4>
                <p className={`text-[10px] font-bold uppercase tracking-wide mt-0.5 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{toast.body}</p>
              </div>
              <button onClick={() => setToast(null)} className="text-slate-500 hover:text-rose-500 transition-colors">
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
