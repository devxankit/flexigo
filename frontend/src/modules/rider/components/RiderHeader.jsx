import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

export function RiderHeader() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  // Don't show header on splash or auth screens (they have their own branding)
  const isAuth = pathname.includes('/rider/auth') || pathname === '/rider' || pathname === '/rider/';
  if (isAuth) return null;

  return (
    <header 
      className={`absolute top-0 left-0 right-0 z-[60] px-6 py-5 flex items-center justify-between transition-colors duration-500 border-b ${
        theme === 'dark' 
          ? 'bg-[#0A0A0F]/90 border-white/05 backdrop-blur-xl shadow-2xl' 
          : 'bg-white/90 border-slate-200 backdrop-blur-xl shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/rider/home')}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
          theme === 'dark' ? 'bg-flexigo-teal/10 border-flexigo-teal/20' : 'bg-flexigo-teal/5 border-flexigo-teal/10'
        }`}>
          <img src={logo} alt="Flexigo" className="w-6 h-6 object-contain p-1.5" />
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

        <button className={`w-10 h-10 rounded-xl border flex items-center justify-center relative transition-colors ${
          theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
        }`}>
          <svg viewBox="0 0 24 24" fill="none" stroke={theme === 'dark' ? 'white' : '#1e293b'} strokeWidth="2" className="w-5 h-5 opacity-60">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <div className="absolute top-2 right-2 w-2 h-2 bg-flexigo-teal rounded-full border-2 border-white/10" />
        </button>

        <div 
          onClick={() => navigate('/rider/profile')}
          className="w-10 h-10 rounded-full bg-flexigo-teal/20 border border-flexigo-teal/30 flex items-center justify-center overflow-hidden cursor-pointer"
        >
           <span className="text-flexigo-teal text-xs font-black">{user?.name?.charAt(0) || 'R'}</span>
        </div>
      </div>
    </header>
  );
}
