import { useState, useEffect } from 'react';
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
import { requestForToken, onMessageListener } from '../../../lib/firebase';
import logo from '../../../assets/logo.png';

export default function FranchiseLogin() {
  const navigate = useNavigate();
  const { sendOTP, verifyOTP } = useFranchiseAuthStore();
  const [loading, setLoading] = useState(false);
  
  // OTP States
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState({ phone: '', otp: '' });
  const [isErrorShake, setIsErrorShake] = useState(false);
  
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.style.backgroundColor = '#020617';
  }, []);



  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    if (phone.length !== 10) {
      setErrors({ ...errors, phone: 'INVALID_NUMBER' });
      setIsErrorShake(true);
      setTimeout(() => setIsErrorShake(false), 500);
      return;
    }
    setLoading(true);
    const res = await sendOTP(phone);
    setLoading(false);
    if (res.success) setOtpSent(true);
    else {
      setErrors({ ...errors, phone: res.message });
      setIsErrorShake(true);
      setTimeout(() => setIsErrorShake(false), 500);
    }
  };

  useEffect(() => {
    if (phone.length === 10 && !otpSent) {
      handleSendOTP();
    }
  }, [phone, otpSent]);

  useEffect(() => {
    onMessageListener().then(payload => {
      console.log('🔔 Franchise App Notification:', payload);
    }).catch(err => console.log('failed: ', err));
  }, []);

  const handleVerifyOTP = async (e) => {
    if (e) e.preventDefault();
    if (otp.length < 6) return;
    setLoading(true);

    // Fetch FCM Token
    const fcmToken = await requestForToken();
    const res = await verifyOTP(otp, fcmToken);
    setLoading(false);
    if (res.success) {
      navigate('/franchise/dashboard');
    } else {
      setErrors({ ...errors, otp: res.message });
      setIsErrorShake(true);
      setTimeout(() => setIsErrorShake(false), 500);
    }
  };

  return (
    <div className="dark min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-6 relative overflow-hidden">
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
                Authorized Access Only
             </p>
          </div>
        </div>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if(!otpSent) handleSendOTP(e);
            else handleVerifyOTP(e);
          }} 
          className="space-y-4 relative z-10"
        >
          <div className="space-y-3">
             <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                   <label className="text-[7.5px] font-black uppercase tracking-widest text-emerald-500 italic opacity-60">Mobile Number</label>
                   {errors.phone && <span className="text-[7px] font-black text-rose-500 uppercase italic animate-pulse">{errors.phone}</span>}
                </div>
                <div className={`p-2.5 bg-black/20 border rounded-xl flex items-center gap-3 transition-all shadow-inner ${
                  errors.phone ? 'border-rose-500/40 ring-1 ring-rose-500/10' : 'border-[var(--border-subtle)] focus-within:border-emerald-500/40'
                }`}>
                  <Smartphone className={`${errors.phone ? 'text-rose-500' : 'text-slate-500'}`} size={14} />
                  <input 
                    required
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="bg-transparent border-none outline-none text-[10px] text-[var(--text-primary)] placeholder:text-slate-500 w-full font-black tracking-widest italic"
                    placeholder="ENTER REGISTERED MOBILE"
                  />
                </div>
             </div>

             <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                   <label className="text-[7.5px] font-black uppercase tracking-widest text-emerald-500 italic opacity-60">Security OTP</label>
                   {errors.otp && <span className="text-[7px] font-black text-rose-500 uppercase italic animate-pulse">{errors.otp}</span>}
                </div>
                <div className={`p-2.5 bg-black/20 border rounded-xl flex items-center gap-3 transition-all shadow-inner ${
                  errors.otp ? 'border-rose-500/40 ring-1 ring-rose-500/10' : 'border-[var(--border-subtle)] focus-within:border-emerald-500/40'
                }`}>
                  <Lock className={`${errors.otp ? 'text-rose-500' : 'text-slate-500'}`} size={14} />
                  <input 
                    required
                    type="text" 
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="bg-transparent border-none outline-none text-[10px] text-[var(--text-primary)] placeholder:text-slate-500 w-full font-black tracking-[0.6em] italic"
                    placeholder="••••••"
                  />
                </div>
             </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button 
              disabled={loading}
              className="w-full h-11 rounded-xl bg-emerald-600 text-white text-[9px] font-black uppercase tracking-[0.3em] shadow-lg shadow-emerald-950/40 hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2 italic relative overflow-hidden group"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  AUTHENTICATING...
                </div>
              ) : (
                <>
                  {otpSent ? 'VERIFY ACCESS' : 'INITIALIZE SESSION'} <Network size={12} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </button>

            {otpSent && (
               <button 
                  type="button"
                  onClick={() => { setOtpSent(false); setOtp(''); }}
                  className="text-[7px] font-black text-slate-500 hover:text-white uppercase italic tracking-widest text-center py-2 transition-colors"
               >
                  Use Different Number
               </button>
            )}

            <button 
              type="button"
              onClick={() => navigate('/franchise/onboarding')}
              className="w-full h-11 rounded-xl border border-[var(--border-subtle)] bg-white/5 text-[var(--text-secondary)] text-[8.5px] font-black uppercase tracking-widest hover:border-emerald-500/40 hover:text-white transition-all flex items-center justify-center gap-2 italic shadow-sm"
            >
              Create New Node <Plus size={14} />
            </button>
          </div>

          <div className="text-center pt-2">
             <button 
               type="button"
               className="text-[7.5px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-emerald-400 transition-all italic"
             >
                Forgot Credentials?
             </button>
          </div>
        </form>

        {/* Technical Footer */}
        <div className="mt-10 pt-6 border-t border-[var(--border-subtle)] text-center space-y-4 relative z-10">
           <div className="flex items-center justify-center gap-6 text-slate-500">
             <div className="flex items-center gap-1.5 grayscale opacity-40">
               <ShieldAlert size={10} strokeWidth={3} />
               <span className="text-[7.5px] font-black uppercase tracking-widest italic">Secure Access</span>
             </div>
             <div className="w-px h-2 bg-white/5" />
             <span className="text-[7.5px] font-black uppercase tracking-widest italic opacity-40">System v2.4</span>
           </div>
           <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest italic">Monitored Secure Login Session</p>
        </div>
      </motion.div>

      {/* Persistence Decor */}
      <div className="mt-8 flex items-center gap-5 px-4 py-2 bg-slate-900 border border-[var(--border-subtle)] rounded-full shadow-2xl opacity-40 hover:opacity-100 transition-opacity">
         <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[7.5px] font-black uppercase tracking-widest text-emerald-500 italic">Network Online</span>
         </div>
         <div className="w-px h-3 bg-white/5" />
         <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
            <Cpu size={8} />
            <span className="text-[7.5px] font-black uppercase tracking-widest italic">Encrypted Connection</span>
         </div>
      </div>
    </div>
  );
}
