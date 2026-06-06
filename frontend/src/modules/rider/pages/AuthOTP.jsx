import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageWrapper } from '../components/PageWrapper';
import { OTPInput } from '../components/AnimatedInput';
import { NeonButton } from '../components/NeonButton';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { requestForToken, onMessageListener } from '../../../lib/firebase';
import { useEffect } from 'react';

export default function AuthOTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const { phone, verifyOTP } = useAuthStore();
  const { theme } = useThemeStore();
  const [error, setError] = useState('');

  const isDark = theme === 'dark';
  const isValid = otp.length === 6;

  const handleVerify = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    setError('');

    // Fetch FCM Token
    const fcmToken = await requestForToken();
    const result = await verifyOTP(otp, fcmToken);
    setLoading(false);

    if (result.success) {
      if (result.rider?.isRegistered) {
        alert("Already Rider Signup");
        navigate('/rider/home');
      } else {
        alert("New Rider Signup");
        navigate('/rider/onboarding');
      }
    } else {
      setError(result.message);
    }
  };

  useEffect(() => {
    onMessageListener().then(payload => {
      console.log('🔔 Rider App Notification:', payload);
    }).catch(err => console.log('failed: ', err));
  }, []);

  const handleResend = async () => {
    setLoading(true);
    const result = await useAuthStore.getState().sendOTP(phone);
    setLoading(false);
    if (result.success) {
      setResent(true);
      setOtp('');
      setTimeout(() => setResent(false), 3000);
    } else {
      setError(result.message);
    }
  };

  return (
    <PageWrapper noHeader>
      <div className={`min-h-[100dvh] flex flex-col px-6 pt-16 pb-10 transition-colors duration-500 relative overflow-hidden ${isDark ? 'bg-[#0A0A0F]' : 'bg-slate-50'
        }`}>
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 transition-colors mb-12 w-fit ${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-sm font-black uppercase tracking-widest">Back</span>
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center flex flex-col items-center"
        >
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all mx-auto ${isDark
                ? 'bg-flexigo-teal/10 border border-flexigo-teal/30 shadow-neon-sm'
                : 'bg-flexigo-teal/5 border border-flexigo-teal/20 shadow-sm'
              }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="2" className="w-7 h-7">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className={`text-3xl font-heading font-black mb-2 transition-colors duration-500 ${isDark ? 'text-white' : 'text-slate-900'
            }`}>Verify OTP</h1>
          <p className={`text-sm transition-colors duration-500 max-w-[260px] ${isDark ? 'text-gray-500' : 'text-slate-500'
            }`}>
            We sent a 6-digit code to{' '}
            <span className={`font-black transition-colors duration-500 ${isDark ? 'text-white' : 'text-slate-900'}`}>+91 {phone}</span>
          </p>
        </motion.div>

        {/* OTP Input */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <OTPInput length={6} value={otp} onChange={setOtp} />
        </motion.div>

        {/* Resend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          {resent ? (
            <span className="text-flexigo-teal text-sm font-black uppercase tracking-widest">OTP Resent Successfully ✓</span>
          ) : (
            <button
              onClick={handleResend}
              className={`text-sm transition-colors duration-500 ${isDark ? 'text-gray-500 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              Didn't receive it?{' '}
              <span className="text-flexigo-teal font-black underline underline-offset-4 decoration-flexigo-teal/30">Resend OTP</span>
            </button>
          )}
        </motion.div>

        {/* Error message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-rose-500 text-xs font-black uppercase text-center mb-6"
          >
            {error}
          </motion.p>
        )}

        {/* Dev hint removed as dynamic OTP is active */}

        <NeonButton
          variant={isValid ? 'solid' : 'green'}
          size="full"
          onClick={handleVerify}
          disabled={!isValid || loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className={`${isDark ? 'text-black' : 'text-black'} animate-spin w-4 h-4`} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
              </svg>
              Verifying...
            </span>
          ) : 'Verify & Continue →'}
        </NeonButton>
      </div>
    </PageWrapper>
  );
}
