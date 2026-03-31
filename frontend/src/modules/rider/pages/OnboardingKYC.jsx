import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageWrapper } from '../components/PageWrapper';
import { NeonButton } from '../components/NeonButton';
import { GlassCard } from '../components/GlassCard';
import { AnimatedInput } from '../components/AnimatedInput';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

const steps = [
  { id: 1, title: 'Identity', description: 'Upload your Aadhaar' },
  { id: 2, title: 'License', description: 'Driving permit' },
];

export default function OnboardingKYC() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { setKycStatus } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const handleNext = async () => {
    if (currentStep < steps.length) {
      setLoading(true);
      await new Promise(r => setTimeout(r, 1000));
      setCurrentStep(prev => prev + 1);
      setLoading(false);
    } else {
      setLoading(true);
      await new Promise(r => setTimeout(r, 1500));
      setKycStatus('verified');
      setLoading(false);
      navigate('/rider/subscription');
    }
  };

  return (
    <PageWrapper className="flex flex-col px-6 pt-12 pb-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className={`text-2xl font-heading font-black transition-colors duration-500 ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>KYC Verification</h1>
        <div className="text-flexigo-teal font-black text-[10px] uppercase tracking-widest">Step {currentStep}/2</div>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2 mb-10">
        {steps.map((step) => (
          <div 
            key={step.id} 
            className="h-1.5 flex-1 rounded-full transition-all duration-500"
            style={{ 
              background: step.id <= currentStep ? '#39FF14' : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              boxShadow: (step.id <= currentStep && isDark) ? '0 0 10px #39FF14' : 'none'
            }}
          />
        ))}
      </div>

      <div className="flex-1">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className={`text-xl font-heading font-black transition-colors duration-500 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>Upload Aadhaar Card</h2>
              <p className={`text-sm leading-relaxed transition-colors duration-500 ${
                isDark ? 'text-gray-400' : 'text-slate-500'
              }`}>
                We need to verify your identity to enable subscriptions. Your data is encrypted and secure.
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                <GlassCard className={`p-8 border-dashed border-2 flex flex-col items-center justify-center gap-4 group cursor-pointer transition-colors duration-500 ${
                  isDark ? 'border-white/10' : 'border-slate-200'
                }`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-flexigo-teal/20 transition-all ${
                    isDark ? 'bg-white/5' : 'bg-slate-100 shadow-sm'
                  }`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="2.5" className="w-6 h-6">
                      <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${
                    isDark ? 'text-gray-400 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-900'
                  }`}>Front Side Upload</span>
                </GlassCard>
                <GlassCard className={`p-8 border-dashed border-2 flex flex-col items-center justify-center gap-4 group cursor-pointer transition-colors duration-500 ${
                  isDark ? 'border-white/10' : 'border-slate-200'
                }`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-flexigo-teal/20 transition-all ${
                    isDark ? 'bg-white/5' : 'bg-slate-100 shadow-sm'
                  }`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="2.5" className="w-6 h-6">
                      <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${
                    isDark ? 'text-gray-400 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-900'
                  }`}>Back Side Upload</span>
                </GlassCard>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className={`text-xl font-heading font-black transition-colors duration-500 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>Driving License</h2>
              <p className={`text-sm leading-relaxed transition-colors duration-500 ${
                isDark ? 'text-gray-400' : 'text-slate-500'
              }`}>
                Finally, enter your license number and upload a copy.
              </p>
              
              <AnimatedInput 
                label="License Number"
                placeholder="DL-XXXXXXXXXXXXXX"
              />
              
              <GlassCard className={`p-8 border-dashed border-2 flex flex-col items-center justify-center gap-4 group cursor-pointer transition-colors duration-500 ${
                isDark ? 'border-white/10' : 'border-slate-200'
              }`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-flexigo-teal/20 transition-all ${
                  isDark ? 'bg-white/5' : 'bg-slate-100 shadow-sm'
                }`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="2.5" className="w-6 h-6">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${
                  isDark ? 'text-gray-400 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-900'
                }`}>Upload License Copy</span>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-auto">
        <NeonButton
          size="full"
          variant="solid"
          onClick={handleNext}
          disabled={loading}
        >
          {loading ? 'Processing...' : currentStep === 3 ? 'Finish & Verify' : 'Continue'}
        </NeonButton>
      </div>
    </PageWrapper>
  );
}
