import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageWrapper } from '../components/PageWrapper';
import { NeonButton } from '../components/NeonButton';
import { GlassCard } from '../components/GlassCard';

import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

const steps = [
  { id: 1, title: 'Selfie', description: 'Take a clear selfie' },
  { id: 2, title: 'Identity', description: 'Upload your Aadhaar' },
  { id: 3, title: 'License', description: 'Driving permit' },
];

export default function OnboardingKYC() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploads, setUploads] = useState({
    selfie: null,
    aadhaarFront: null,
    aadhaarBack: null,
    license: null
  });

  // Refs for file inputs
  const selfieRef = useRef(null);
  const adhaarFrontRef = useRef(null);
  const adhaarBackRef = useRef(null);
  const licenseRef = useRef(null);

  const { updateKYC, phone } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = (type, e) => {
    const file = e.target.files[0];
    if (file) {
      setUploads(prev => ({ ...prev, [type]: file }));
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      setLoading(true);
      try {
          const kycData = {
              phone,
              selfie: await fileToBase64(uploads.selfie),
              aadhaarFront: await fileToBase64(uploads.aadhaarFront),
              aadhaarBack: await fileToBase64(uploads.aadhaarBack),
              drivingLicense: await fileToBase64(uploads.license)
          };

          const result = await updateKYC(kycData);
          if (result.success) {
              navigate('/rider/plans');
          } else {
              alert(result.message);
          }
      } catch (error) {
          alert('Error processing files. Please try again.');
      } finally {
          setLoading(false);
      }
    }
  };

  const canContinue = () => {
    if (currentStep === 1) return !!uploads.selfie;
    if (currentStep === 2) return !!uploads.aadhaarFront && !!uploads.aadhaarBack;
    if (currentStep === 3) return !!uploads.license;
    return false;
  };

  return (
    <PageWrapper className="flex flex-col px-6 pt-8 pb-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className={`text-2xl font-heading font-black transition-colors duration-500 ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>KYC Verification</h1>
        <div className="text-flexigo-teal font-black text-[10px] uppercase tracking-widest">Step {currentStep}/{steps.length}</div>
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
              }`}>Take a Selfie</h2>
              <p className={`text-sm leading-relaxed transition-colors duration-500 ${
                isDark ? 'text-gray-400' : 'text-slate-500'
              }`}>
                We need a clear photo of your face for identity verification. Please ensure your face is well-lit.
              </p>
              
              <div className="flex justify-center py-4">
                <input 
                  type="file" 
                  ref={selfieRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => handleFileChange('selfie', e)} 
                />
                <div 
                  onClick={() => selfieRef.current.click()}
                  className={`w-48 h-48 rounded-full border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-500 ${
                    uploads.selfie ? 'border-flexigo-teal bg-flexigo-teal/5' :
                    isDark ? 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 shadow-sm'
                  }`}
                >
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                     uploads.selfie ? 'bg-flexigo-teal shadow-neon-sm' : 'bg-flexigo-teal/10'
                   }`}>
                     {uploads.selfie ? (
                       <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" className="w-6 h-6">
                         <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
                       </svg>
                     ) : (
                       <svg viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="2.5" className="w-6 h-6">
                         <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
                         <circle cx="12" cy="13" r="4" strokeLinecap="round" strokeLinejoin="round" />
                       </svg>
                     )}
                   </div>
                   <span className={`text-[10px] font-black uppercase tracking-widest ${
                     uploads.selfie ? 'text-flexigo-teal' : isDark ? 'text-gray-400' : 'text-slate-400'
                   }`}>
                     {uploads.selfie ? 'Selfie Uploaded ✓' : 'Open Camera'}
                   </span>
                </div>
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
              }`}>Upload Aadhaar Card</h2>
              <p className={`text-sm leading-relaxed transition-colors duration-500 ${
                isDark ? 'text-gray-400' : 'text-slate-500'
              }`}>
                We need to verify your identity to enable subscriptions. Your data is encrypted and secure.
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                <input 
                  type="file" 
                  ref={adhaarFrontRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => handleFileChange('aadhaarFront', e)} 
                />
                <input 
                  type="file" 
                  ref={adhaarBackRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => handleFileChange('aadhaarBack', e)} 
                />
                <GlassCard 
                  onClick={() => adhaarFrontRef.current.click()}
                  className={`p-8 border-dashed border-2 flex flex-col items-center justify-center gap-4 group cursor-pointer transition-all duration-500 ${
                    uploads.aadhaarFront ? 'border-flexigo-teal bg-flexigo-teal/5' :
                    isDark ? 'border-white/10' : 'border-slate-200'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    uploads.aadhaarFront ? 'bg-flexigo-teal shadow-neon-sm' : 'bg-flexigo-teal/10'
                  }`}>
                    {uploads.aadhaarFront ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" className="w-6 h-6">
                        <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="2.5" className="w-6 h-6">
                        <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${
                    uploads.aadhaarFront ? 'text-flexigo-teal' : isDark ? 'text-gray-400 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-900'
                  }`}>
                    {uploads.aadhaarFront ? 'Front Side Uploaded ✓' : 'Front Side Upload'}
                  </span>
                </GlassCard>

                <GlassCard 
                  onClick={() => adhaarBackRef.current.click()}
                  className={`p-8 border-dashed border-2 flex flex-col items-center justify-center gap-4 group cursor-pointer transition-all duration-500 ${
                    uploads.aadhaarBack ? 'border-flexigo-teal bg-flexigo-teal/5' :
                    isDark ? 'border-white/10' : 'border-slate-200'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    uploads.aadhaarBack ? 'bg-flexigo-teal shadow-neon-sm' : 'bg-flexigo-teal/10'
                  }`}>
                    {uploads.aadhaarBack ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" className="w-6 h-6">
                        <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="2.5" className="w-6 h-6">
                        <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${
                    uploads.aadhaarBack ? 'text-flexigo-teal' : isDark ? 'text-gray-400 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-900'
                  }`}>
                    {uploads.aadhaarBack ? 'Back Side Uploaded ✓' : 'Back Side Upload'}
                  </span>
                </GlassCard>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
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
                Finally, please upload a clear copy of your driving license.
              </p>
              
              <input 
                type="file" 
                ref={licenseRef} 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => handleFileChange('license', e)} 
              />
              <GlassCard 
                onClick={() => licenseRef.current.click()}
                className={`p-8 border-dashed border-2 flex flex-col items-center justify-center gap-4 group cursor-pointer transition-all duration-500 ${
                  uploads.license ? 'border-flexigo-teal bg-flexigo-teal/5' :
                  isDark ? 'border-white/10' : 'border-slate-200'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  uploads.license ? 'bg-flexigo-teal shadow-neon-sm' : 'bg-flexigo-teal/10'
                }`}>
                  {uploads.license ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" className="w-6 h-6">
                      <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="2.5" className="w-6 h-6">
                      <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${
                  uploads.license ? 'text-flexigo-teal' : isDark ? 'text-gray-400 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-900'
                }`}>
                  {uploads.license ? 'License Uploaded ✓' : 'Upload License Copy'}
                </span>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-auto">
        <NeonButton
          size="full"
          variant={canContinue() ? 'solid' : 'green'}
          onClick={handleNext}
          disabled={loading || !canContinue()}
        >
          {loading ? 'Processing...' : currentStep === 3 ? 'Finish & Verify' : 'Continue'}
        </NeonButton>
      </div>
    </PageWrapper>
  );
}
