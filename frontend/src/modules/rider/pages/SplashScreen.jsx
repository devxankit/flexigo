import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { PageWrapper } from '../components/PageWrapper';
import { useThemeStore } from '../store/themeStore';
import logo from '../../../assets/logo.png';

export default function SplashScreen() {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const logoRef = useRef(null);
  const ringRef = useRef(null);
  const ring2Ref = useRef(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => navigate('/rider/auth/phone'), 600);
      },
    });

    tl.fromTo(logoRef.current, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' })
      .fromTo(ringRef.current, { scale: 0.5, opacity: 0 }, { scale: 1.5, opacity: 0, duration: 1.2, ease: 'power2.out' }, '-=0.4')
      .fromTo(ring2Ref.current, { scale: 0.5, opacity: 0 }, { scale: 2, opacity: 0, duration: 1.5, ease: 'power2.out' }, '-=1.1')
      .to(logoRef.current, { scale: 1.05, duration: 0.3, ease: 'sine.inOut', yoyo: true, repeat: 1 }, '-=0.5')
      .to({}, { duration: 0.5 });
  }, [navigate]);

  return (
    <PageWrapper noHeader className="min-h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden">
      <div
        className={`absolute inset-0 z-0 transition-colors duration-1000 ${
          isDark 
            ? 'bg-[#0A0A0F]' 
            : 'bg-slate-50'
        }`}
        style={{ 
          background: isDark 
            ? 'radial-gradient(ellipse at center, #0D1F0D 0%, #0A0A0F 70%)' 
            : 'radial-gradient(ellipse at center, rgba(57,255,20,0.08) 0%, #f8fafc 70%)' 
        }}
      />
      {/* Animated grid background */}
      <div
        className="absolute inset-0 z-0 transition-opacity duration-1000"
        style={{
          opacity: isDark ? 0.08 : 0.05,
          backgroundImage: isDark 
            ? `linear-gradient(rgba(57,255,20,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,20,0.3) 1px, transparent 1px)`
            : `linear-gradient(rgba(34,197,94,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Ripple rings */}
      <div className="relative z-10 flex items-center justify-center">
        <div
          ref={ringRef}
          className="absolute w-48 h-48 rounded-full border-2"
          style={{ borderColor: '#39FF14', opacity: 0 }}
        />
        <div
          ref={ring2Ref}
          className="absolute w-48 h-48 rounded-full border"
          style={{ borderColor: '#39FF14', opacity: 0 }}
        />

        {/* Logo */}
        <div
          ref={logoRef}
          className="relative flex flex-col items-center gap-4"
          style={{ opacity: 0 }}
        >
          <div
            className={`w-24 h-24 rounded-3xl flex items-center justify-center overflow-hidden p-0 transition-all duration-1000 ${
              isDark ? 'shadow-neon' : 'shadow-[0_0_40px_rgba(57,255,20,0.3)]'
            }`}
            style={{
              background: 'linear-gradient(135deg, #39FF14, #22c55e)',
            }}
          >
            <img src={logo} alt="Flexigo" className="w-full h-full object-contain brightness-0 scale-[1.8]" />
          </div>

          <div className="text-center">
            <h1 className={`text-4xl font-heading font-black tracking-tight transition-colors duration-500 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
                style={{ textShadow: isDark ? '0 0 40px rgba(57,255,20,0.3)' : '0 0 20px rgba(57,255,20,0.2)' }}
            >
              Flexi<span className="text-flexigo-teal">Go</span>
            </h1>
            <p className={`text-[10px] tracking-[0.4em] uppercase mt-2 font-black transition-colors duration-500 ${
              isDark ? 'text-gray-500' : 'text-slate-400'
            }`}>
              Electric Freedom
            </p>
          </div>
        </div>
      </div>

      {/* Loading bar */}
      <motion.div
        className={`absolute bottom-20 w-32 h-0.5 rounded-full overflow-hidden transition-colors duration-1000 ${
          isDark ? 'bg-white/10' : 'bg-slate-200'
        }`}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ 
            background: 'linear-gradient(90deg, #39FF14, #00D4FF)',
            boxShadow: '0 0 8px #39FF14'
          }}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.2, ease: 'power2.inOut' }}
        />
      </motion.div>
    </PageWrapper>
  );
}
