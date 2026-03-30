import { motion } from 'framer-motion';
import { PageWrapper } from '../components/PageWrapper';
import { GlassCard } from '../components/GlassCard';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useNavigate } from 'react-router-dom';

export default function ProfileScreen() {
  const { user, logout, kycStatus } = useAuthStore();
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const handleLogout = () => {
    logout();
    navigate('/rider/auth/phone');
  };

  const sections = [
    { 
      title: 'Subscription', 
      items: [
        { label: 'My Plan', value: 'Weekly Premium', color: '#39FF14' },
        { label: 'Ride History', value: '18 Rides' }
      ]
    },
    { 
      title: 'Documents', 
      items: [
        { label: 'KYC Status', value: kycStatus.toUpperCase(), color: '#39FF14' },
        { label: 'Driving License', value: 'Verified' }
      ]
    }
  ];

  return (
    <PageWrapper className="flex flex-col p-6 pb-24">
       <div className="mb-10 flex flex-col items-center">
          <div className="relative mb-6">
             <div className={`absolute inset-0 bg-flexigo-teal/20 rounded-full blur-2xl transition-opacity duration-500 ${isDark ? 'opacity-100' : 'opacity-40'}`} />
             <div className="w-28 h-28 rounded-full border-4 border-flexigo-teal/40 overflow-hidden relative z-10 p-1">
                <div className={`w-full h-full rounded-full flex items-center justify-center transition-colors duration-500 ${
                  isDark ? 'bg-white/10' : 'bg-slate-100'
                }`}>
                   <svg viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="1" className="w-16 h-16 opacity-40">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" />
                   </svg>
                </div>
             </div>
          </div>
          <h2 className={`text-2xl font-heading font-black transition-colors duration-500 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>{user?.name || 'Flexigo Rider'}</h2>
          <p className={`text-sm mt-1 transition-colors duration-500 ${
            isDark ? 'text-gray-500' : 'text-slate-500'
          }`}>+91 {user?.phone || '9876543210'}</p>
       </div>

       <div className="space-y-8 flex-1">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-3">
               <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] px-2 transition-colors duration-500 ${
                 isDark ? 'text-gray-500' : 'text-slate-400'
               }`}>{section.title}</h3>
               <GlassCard className={`divide-y transition-colors duration-500 overflow-hidden ${
                 isDark ? 'divide-white/05' : 'divide-slate-100'
               }`}>
                  {section.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-4">
                       <span className={`text-sm font-black transition-colors duration-500 ${
                         isDark ? 'text-gray-400' : 'text-slate-400'
                       }`}>{item.label}</span>
                       <span 
                         className={`font-black text-sm transition-colors duration-500 ${
                           isDark ? 'text-white' : 'text-slate-900'
                         }`} 
                         style={item.color ? { color: item.color } : {}}
                       >
                         {item.value}
                       </span>
                    </div>
                  ))}
               </GlassCard>
            </div>
          ))}

          <button 
            className={`w-full p-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 transform active:scale-[0.98] border ${
              isDark 
                ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20' 
                : 'bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 shadow-sm'
            }`}
            onClick={handleLogout}
          >
            Logout Securely
          </button>
       </div>
    </PageWrapper>
  );
}
