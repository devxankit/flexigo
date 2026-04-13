import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  User, 
  Smartphone, 
  ArrowRight, 
  LayoutDashboard,
  ShieldAlert,
  ChevronRight,
  Plus,
  Cpu,
  Lock,
  Network
} from 'lucide-react';
import { useFranchiseAuthStore } from '../store/franchiseAuthStore';
import logo from '../../../assets/logo.png';

export default function FranchiseLogin() {
  const navigate = useNavigate();
  const { login } = useFranchiseAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ id: '', pin: '' });
  const [errors, setErrors] = useState({ id: '', pin: '' });
  const [isErrorShake, setIsErrorShake] = useState(false);

  const validate = () => {
    let newErrors = { id: '', pin: '' };
    let isValid = true;

    if (formData.id.trim().length < 4) {
      newErrors.id = 'INVALID_PERSONNEL_ID';
      isValid = false;
    }
    if (formData.pin.length < 6) {
      newErrors.pin = 'PIN_LENGTH_VIOLATION';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validate()) {
      setIsErrorShake(true);
      setTimeout(() => setIsErrorShake(false), 500);
      return;
    }
    setLoading(true);
    setErrors({ id: '', pin: '' });
    setTimeout(() => {
      login({ role: 'Partner' });
      setLoading(false);
      navigate('/franchise/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Architectural Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-500 animate-pulse" style={{ top: '10%' }} />
         <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-500 animate-pulse" style={{ top: '90%' }} />
         <div className="absolute top-0 left-0 h-full w-[1px] bg-emerald-500 animate-pulse" style={{ left: '10%' }} />
         <div className="absolute top-0 right-0 h-full w-[1px] bg-emerald-500 animate-pulse" style={{ right: '10%' }} />
      </div>

      {/* Main Login Hub */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          x: isErrorShake ? [-8, 8, -8, 8, 0] : 0
        }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-[340px] bg-slate-900 border border-[var(--border-subtle)] rounded-[2.5rem] p-8 shadow-2xl overflow-hidden shadow-emerald-950/20"
      >
        {/* Internal Decor */}
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
           <Cpu size={120} className="text-emerald-500" />
        </div>

        {/* Header Section */}
        <div className="flex flex-col items-center mb-10 text-center relative z-10">
          <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center mb-5 shadow-inner scale-110">
            <img src={logo} alt="Flexigo" className="w-6 h-6 object-contain invert" />
          </div>
          <div className="space-y-1">
             <h1 className="text-xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic leading-none">
                NODE <span className="text-emerald-500">ACCESS</span>
             </h1>
             <p className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.4em] italic opacity-60">
                PARTNER_PROTOCOL • SIGMA_V2
             </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 relative z-10">
          <div className="space-y-3">
             <div className="space-y-1.5">
               <div className="flex justify-between items-center px-1">
                  <label className="text-[7.5px] font-black uppercase tracking-widest text-emerald-500 italic opacity-60">PERSONNEL_ID</label>
                  {errors.id && <span className="text-[7px] font-black text-rose-500 uppercase italic animate-pulse">{errors.id}</span>}
               </div>
               <div className={`p-2.5 bg-[var(--bg-secondary)] border rounded-xl flex items-center gap-3 transition-all shadow-inner ${
                 errors.id ? 'border-rose-500/40 ring-1 ring-rose-500/10' : 'border-[var(--border-subtle)] focus-within:border-emerald-500/40'
               }`}>
                 <Smartphone className={`${errors.id ? 'text-rose-500' : 'text-slate-600'}`} size={14} />
                 <input 
                   required
                   type="text" 
                   value={formData.id}
                   onChange={(e) => setFormData({ ...formData, id: e.target.value.slice(0, 12) })}
                   className="bg-transparent border-none outline-none text-[10px] text-[var(--text-primary)] placeholder:text-slate-800 w-full font-black uppercase tracking-widest italic"
                   placeholder="NODE_IDENTIFIER"
                 />
               </div>
             </div>

             <div className="space-y-1.5">
               <div className="flex justify-between items-center px-1">
                  <label className="text-[7.5px] font-black uppercase tracking-widest text-emerald-500 italic opacity-60">HANDSHAKE_PIN</label>
                  {errors.pin && <span className="text-[7px] font-black text-rose-500 uppercase italic animate-pulse">{errors.pin}</span>}
               </div>
               <div className={`p-2.5 bg-[var(--bg-secondary)] border rounded-xl flex items-center gap-3 transition-all shadow-inner ${
                 errors.pin ? 'border-rose-500/40 ring-1 ring-rose-500/10' : 'border-[var(--border-subtle)] focus-within:border-emerald-500/40'
               }`}>
                 <Lock className={`${errors.pin ? 'text-rose-500' : 'text-slate-600'}`} size={14} />
                 <input 
                   required
                   type="password" 
                   inputMode="numeric"
                   value={formData.pin}
                   onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                   className="bg-transparent border-none outline-none text-[10px] text-[var(--text-primary)] placeholder:text-slate-800 w-full font-black tracking-[0.6em] italic"
                   placeholder="••••••"
                 />
               </div>
             </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button 
              disabled={loading}
              className="w-full h-11 rounded-xl bg-emerald-600-white text-[9px] font-black uppercase tracking-[0.3em] shadow-lg shadow-emerald-950/40 hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2 italic relative overflow-hidden group"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  SYNCING...
                </div>
              ) : (
                <>
                  CONNECT_NODE <Network size={12} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </button>

            <button 
              type="button"
              onClick={() => navigate('/franchise/onboarding')}
              className="w-full h-11 rounded-xl border border-[var(--border-subtle)] bg-white/5 text-[var(--text-secondary)] text-[8.5px] font-black uppercase tracking-widest hover:border-[var(--border-subtle)] hover:text-white transition-all flex items-center justify-center gap-2 italic shadow-sm"
            >
              INITIALIZE_ONBOARDING <Plus size={14} />
            </button>
          </div>

          <div className="text-center pt-2">
             <button 
               type="button"
               className="text-[7.5px] font-black uppercase tracking-[0.3em] text-slate-700 hover:text-emerald-500 transition-all italic"
             >
                LOST_ACCESS_CREDENTIALS?
             </button>
          </div>
        </form>

        {/* Technical Footer */}
        <div className="mt-10 pt-6 border-t border-[var(--border-subtle)] text-center space-y-4 relative z-10">
           <div className="flex items-center justify-center gap-6 text-slate-700">
             <div className="flex items-center gap-1.5 grayscale opacity-40">
               <ShieldAlert size={10} strokeWidth={3} />
               <span className="text-[7.5px] font-black uppercase tracking-widest italic">SECURE_SYNC</span>
             </div>
             <div className="w-px h-2 bg-white/5" />
             <span className="text-[7.5px] font-black uppercase tracking-widest italic opacity-40">BUILD_2.4.1_PRO</span>
           </div>
           <p className="text-[7px] font-black text-slate-800 uppercase tracking-widest italic">FLEXIGO_SYSTEMS_AUTH_MONITORED_PEER_LOG</p>
        </div>
      </motion.div>

      {/* Persistence Decor */}
      <div className="mt-8 flex items-center gap-5 px-4 py-2 bg-slate-900 border border-[var(--border-subtle)] rounded-full shadow-2xl opacity-40 hover:opacity-100 transition-opacity">
         <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[7.5px] font-black uppercase tracking-widest text-emerald-500 italic">CORE_NET_ON</span>
         </div>
         <div className="w-px h-3 bg-white/5" />
         <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
            <Cpu size={8} />
            <span className="text-[7.5px] font-black uppercase tracking-widest italic">RSA_4096_LOCKED</span>
         </div>
      </div>
    </div>
  );
}
