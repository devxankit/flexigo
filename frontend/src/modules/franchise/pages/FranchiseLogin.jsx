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
  ChevronRight
} from 'lucide-react';
import { useFranchiseAuthStore } from '../store/franchiseAuthStore';
import logo from '../../../assets/logo.png';

// Roles removed to streamline directly into credentials

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
      newErrors.id = 'Personnel ID must be at least 4 characters';
      isValid = false;
    }
    if (formData.pin.length < 6) {
      newErrors.pin = 'Access PIN must be at least 6 characters';
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
    <div className="min-h-screen bg-slate-950 font-body flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.05),transparent_50%)]" />

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          x: isErrorShake ? [-10, 10, -10, 10, 0] : 0
        }}
        transition={{ duration: isErrorShake ? 0.4 : 0.4 }}
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 md:p-10 shadow-2xl overflow-hidden"
      >
        {/* Header Section */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-6 shadow-sm">
            <img src={logo} alt="Flexigo" className="w-8 h-8 object-contain invert" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase">
            Franchise <span className="text-emerald-500">Portal</span>
          </h1>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mt-2 leading-relaxed">
            Authorized Personnel Hub Access
          </p>
        </div>

        <AnimatePresence mode="wait">
            <motion.form 
              key="login-form"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onSubmit={handleLogin}
              className="space-y-5"
            >
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 ml-1">Personnel ID</label>
                  <div className={`p-3 bg-slate-800/50 border rounded-xl flex items-center gap-3 transition-all ${
                    errors.id ? 'border-rose-500/50 ring-1 ring-rose-500/20' : 'border-slate-700 focus-within:border-emerald-500/40 focus-within:ring-1 focus-within:ring-emerald-500/20'
                  }`}>
                    <Smartphone className={`${errors.id ? 'text-rose-400' : 'text-slate-500'}`} size={18} />
                    <input 
                      required
                      type="text" 
                      placeholder="Enter mobile or hub ID" 
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value.slice(0, 12) })}
                      className="bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-600 w-full font-medium"
                    />
                  </div>
                  {errors.id && <p className="text-[10px] font-bold text-rose-500 ml-1 mt-1 animate-in fade-in slide-in-from-top-1">{errors.id}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 ml-1">Access PIN</label>
                  <div className={`p-3 bg-slate-800/50 border rounded-xl flex items-center gap-3 transition-all ${
                    errors.pin ? 'border-rose-500/50 ring-1 ring-rose-500/20' : 'border-slate-700 focus-within:border-emerald-500/40 focus-within:ring-1 focus-within:ring-emerald-500/20'
                  }`}>
                    <ShieldCheck className={`${errors.pin ? 'text-rose-400' : 'text-slate-500'}`} size={18} />
                    <input 
                      required
                      type="password" 
                      inputMode="numeric"
                      placeholder="••••••" 
                      value={formData.pin}
                      onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                      className="bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-600 w-full font-medium tracking-[0.3em]"
                    />
                  </div>
                  {errors.pin && <p className="text-[10px] font-bold text-rose-500 ml-1 mt-1 animate-in fade-in slide-in-from-top-1">{errors.pin}</p>}
                </div>
              </div>

              <button 
                disabled={loading}
                className="w-full h-12 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-900/20 hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Initialize Session <ArrowRight size={16} />
                  </>
                )}
              </button>
            </motion.form>
        </AnimatePresence>

        {/* Technical Footer */}
        <div className="mt-10 pt-6 border-t border-slate-800/50 text-center flex flex-col items-center gap-4">
           <div className="flex items-center gap-4 text-slate-600">
             <div className="flex items-center gap-1.5 pr-4">
               <ShieldAlert size={12} strokeWidth={2.5} />
               <span className="text-[9px] font-bold uppercase tracking-widest leading-none">Secured Node</span>
             </div>
             <span className="text-[9px] font-bold uppercase tracking-widest leading-none">v2.4.1 Ops</span>
           </div>
           <p className="text-[9px] font-medium text-slate-700 uppercase tracking-tighter">Proprietary System. Access Monitored.</p>
        </div>
      </motion.div>

      {/* Floating Status Bar - Global Decor */}
      <div className="mt-8 flex items-center gap-6 px-5 py-2.5 bg-slate-900/50 rounded-full border border-slate-800 shadow-xl opacity-60">
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">Service Online</span>
         </div>
         <div className="w-px h-3 bg-slate-800" />
         <div className="flex items-center gap-2 text-slate-500">
            <Smartphone size={10} />
            <span className="text-[9px] font-bold uppercase tracking-widest whitespace-nowrap">End-to-End Encryption</span>
         </div>
      </div>
    </div>
  );
}
