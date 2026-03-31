import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageWrapper } from '../components/PageWrapper';
import { AnimatedInput } from '../components/AnimatedInput';
import { NeonButton } from '../components/NeonButton';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import logo from '../../../assets/logo.png';

export default function AuthPhone() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const { setPhone: storePhone, setOtpSent } = useAuthStore();
  const { theme } = useThemeStore();

  const isDark = theme === 'dark';
  const isValid = phone.length === 10 && /^\d+$/.test(phone);
  const [error, setError] = useState('');
  const [isShake, setIsShake] = useState(false);

  const handleSendOTP = () => {
    if (!isValid) {
      setError('Please enter a valid 10-digit mobile number');
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);
      return;
    }
    setError('');
    storePhone(phone);
    setOtpSent(true);
    navigate('/rider/auth/otp');
  };

  return (
    <PageWrapper noHeader>
      <div className={`min-h-[100dvh] flex flex-col px-6 pt-16 pb-10 transition-colors duration-500 relative overflow-hidden ${
        isDark ? 'bg-[#0A0A0F]' : 'bg-slate-50'
      }`}>
        {/* Top glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none"
          style={{ 
            background: isDark 
              ? 'radial-gradient(circle, rgba(57,255,20,0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(57,255,20,0.15) 0%, transparent 70%)' 
          }}
        />

        {/* Logo mark */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="mb-12 flex flex-col items-center text-center"
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 overflow-hidden p-0 transition-shadow mx-auto shadow-2xl"
            style={{ 
              background: 'linear-gradient(135deg, #39FF14, #22c55e)', 
              boxShadow: isDark ? '0 0 24px #39FF1444' : '0 4px 12px rgba(57,255,20,0.3)' 
            }}
          >
            <img src={logo} alt="Flexigo" className="w-full h-full object-contain brightness-0 scale-[1.8]" />
          </div>

          <h1 className={`text-3xl font-heading font-black mb-2 transition-colors duration-500 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Welcome to<br />
            <span className="text-flexigo-teal">FlexiGo Rider</span>
          </h1>
          <p className={`text-sm leading-relaxed transition-colors duration-500 ${
            isDark ? 'text-gray-500' : 'text-slate-500'
          }`}>
            India's electric subscription platform.<br />Subscribe. Unlock. Ride.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            x: isShake ? [-10, 10, -10, 10, 0] : 0
          }}
          transition={{ delay: 0.2 }}
          className="flex-1 flex flex-col gap-6 items-center text-center"
        >
          <div className="w-full text-left">
            <AnimatedInput
              label="Mobile Number"
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => {
                setError('');
                setPhone(e.target.value.replace(/\D/, '').slice(0, 10));
              }}
              placeholder="Enter 10-digit number"
              prefix="+91"
              maxLength={10}
              autoFocus
              status={error ? 'error' : (isValid ? 'success' : '')}
            />
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-rose-500 text-[10px] font-bold uppercase tracking-widest mt-2 ml-1"
              >
                {error}
              </motion.p>
            )}
          </div>

          <p className={`text-xs transition-colors duration-500 max-w-[280px] ${
            isDark ? 'text-gray-600' : 'text-slate-500'
          }`}>
            By continuing, you agree to our{' '}
            <span className="text-flexigo-teal font-bold underline underline-offset-2">Terms of Service</span> &amp;{' '}
            <span className="text-flexigo-teal font-bold underline underline-offset-2">Privacy Policy</span>
          </p>

          <NeonButton
            variant={isValid ? 'solid' : 'green'}
            size="full"
            onClick={handleSendOTP}
            disabled={!isValid}
          >
            {isValid ? 'Send OTP →' : 'Enter your number'}
          </NeonButton>
        </motion.div>

        {/* Bottom decorative text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`text-center text-[10px] uppercase font-black transition-colors duration-500 tracking-[0.2em] mt-8 ${
            isDark ? 'text-gray-800' : 'text-slate-400'
          }`}
        >
          Powered by FlexiGo Mobility • v2.0
        </motion.p>
      </div>
    </PageWrapper>
  );
}
