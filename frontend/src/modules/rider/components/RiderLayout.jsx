import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { RiderHeader } from '../components/RiderHeader';
import { BottomNav } from '../components/BottomNav';
import { useThemeStore } from '../store/themeStore';

export function RiderLayout() {
  const { pathname } = useLocation();
  const { theme } = useThemeStore();

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

  if (isAuth) {
    return <Outlet />;
  }

  return (
    <div className={`fixed inset-0 transition-colors duration-500 overflow-hidden overscroll-none touch-none ${
      theme === 'dark' ? 'bg-[#0A0A0F]' : 'bg-slate-50'
    }`}>
      {/* Header Layer */}
      <div className="absolute top-0 left-0 right-0 z-[60] pointer-events-auto">
        <RiderHeader />
      </div>
      
      {/* Scrollable Content Layer */}
      <main className="absolute inset-x-0 top-0 bottom-0 overflow-y-auto overflow-x-hidden pt-24 pb-32 px-0 z-0 select-none touch-pan-y">
        <Outlet />
      </main>

      {/* Navigation Layer */}
      <div className="absolute bottom-0 left-0 right-0 z-[60] pointer-events-auto">
        <BottomNav />
      </div>
    </div>
  );
}
