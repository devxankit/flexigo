import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import { useRideStore } from '../store/rideStore';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

export function RiderHeader() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { setDiagnosticsOpen } = useRideStore();

  // Don't show header on splash or auth screens (they have their own branding)
  const isAuth = pathname.includes('/rider/auth') || pathname === '/rider' || pathname === '/rider/';
  if (isAuth) return null;

  return (
    <header 
      className={`absolute top-0 left-0 right-0 z-[60] px-6 py-3 flex items-center justify-between transition-colors duration-500 border-b ${
        theme === 'dark' 
          ? 'bg-[#0A0A0F]/90 border-white/05 backdrop-blur-xl shadow-2xl' 
          : 'bg-white/90 border-slate-200 backdrop-blur-xl shadow-sm'
      }`}
    >
      <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/rider/home')}>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${
          theme === 'dark' ? 'bg-flexigo-teal/10 border-flexigo-teal/20' : 'bg-flexigo-teal/5 border-flexigo-teal/10 shadow-sm'
        }`}>
          <img src={logo} alt="Flexigo" className="w-full h-full object-contain p-0.5 scale-[1.7] transition-transform" />
        </div>
        <div className="flex flex-col">
          <span className={`font-heading font-black text-sm tracking-tight leading-none uppercase transition-colors ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Flexi<span className="text-flexigo-teal">Go</span>
          </span>
          <span className="text-[8px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-0.5">Rider App</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Profile Navigator */}
        <button 
          onClick={() => navigate('/rider/profile')}
          className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all active:scale-90 ${
            theme === 'dark' 
              ? 'bg-white/5 border-white/10 text-flexigo-teal/80 hover:bg-white/10' 
              : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 shadow-sm'
          }`}
        >
           <span className="text-[11px] font-black">{user?.name?.charAt(0) || 'R'}</span>
        </button>

        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all active:scale-90 ${
            theme === 'dark' 
              ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10' 
              : 'bg-slate-100 border-slate-200 text-amber-600 hover:bg-slate-200'
          }`}
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
              <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          )}
        </button>

        {/* Tactical Vehicle Status Button */}
        <button 
          onClick={() => setDiagnosticsOpen(true)}
          className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all relative group shadow-sm bg-flexigo-teal/5 border-flexigo-teal/20`}
        >
           <svg viewBox="0 0 24 24" fill="none" stroke={theme === 'dark' ? '#39FF14' : '#0F766E'} strokeWidth="1.8" className="w-7 h-7 filter drop-shadow-sm group-hover:scale-110 transition-transform">
             <path d="M14.5 7h4v2" />
             <path d="M6 16c1.1 0 2-.9 2-2H4c0 1.1.9 2 2 2z" />
             <path d="M18 16c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z" />
             <path d="M12 7h-7v4h14V7z" />
             <path d="M8 7v-2" />
             <path d="M16 7v-2" />
           </svg>
           <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-flexigo-teal rounded-full border-2 border-slate-900 flex items-center justify-center shadow-lg">
             <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
           </div>
        </button>
      </div>
    </header>
  );
}
