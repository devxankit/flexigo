import { useState, useRef, useEffect } from 'react';
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

  // eKYC States
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarOtp, setAadhaarOtp] = useState('');
  const [clientId, setClientId] = useState(null);
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [ekycLoading, setEkycLoading] = useState(false);

  // Refs for file inputs
  const selfieRef = useRef(null);
  const adhaarFrontRef = useRef(null);
  const adhaarBackRef = useRef(null);
  const licenseRef = useRef(null);

  const { updateKYC, phone, generateAadhaarOTP, verifyAadhaarOTP, user } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    console.log('INIT: Checking existing KYC status');
    if (user?.kycDetails?.ekycVerified) {
      console.log('INIT: Aadhaar already verified in profile');
      setIsAadhaarVerified(true);
    }
  }, [user]);

  const fileToBase64 = (file) => {
    console.log(`UTIL: Converting file to base64: ${file?.name}`);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = (type, e) => {
    console.log(`FILE_CHANGE: Handling file upload for [${type}]`);
    const file = e.target.files[0];
    console.log(`FILE_CHANGE: Selected file name: ${file?.name}`);
    if (file) {
      setUploads(prev => ({ ...prev, [type]: file }));
      console.log(`FILE_CHANGE: State updated for [${type}]`);
    }
  };

  const handleSendAadhaarOTP = async () => {
    console.log('EKYC_UI: Initiating Aadhaar OTP Request');
    console.log('EKYC_UI: Aadhaar Number:', aadhaarNumber);
    if (aadhaarNumber.length !== 12) {
      console.log('EKYC_UI: Error - Aadhaar must be 12 digits');
      alert('Please enter valid 12-digit Aadhaar number');
      return;
    }
    setEkycLoading(true);
    console.log('EKYC_UI: Calling generateAadhaarOTP from store');
    try {
      const res = await generateAadhaarOTP(aadhaarNumber);
      console.log('EKYC_UI: Received response from store:', JSON.stringify(res));
      if (res.success) {
        console.log('EKYC_UI: OTP request success. ClientID:', res.client_id);
        setClientId(res.client_id);
        setOtpSent(true);
        alert('OTP sent successfully');
      } else {
        console.log('EKYC_UI: OTP request failed:', res.message);
        alert(res.message);
      }
    } catch (err) {
      console.log('EKYC_UI: Catch Block error:', err.message);
      alert('Error sending OTP');
    } finally {
      console.log('EKYC_UI: Setting EkycLoading to false');
      setEkycLoading(false);
    }
  };

  const handleVerifyAadhaarOTP = async () => {
    console.log('EKYC_UI: Initiating OTP Verification');
    console.log('EKYC_UI: OTP entered:', aadhaarOtp);
    if (aadhaarOtp.length < 6) {
      console.log('EKYC_UI: Error - OTP too short');
      alert('Please enter valid OTP');
      return;
    }
    setEkycLoading(true);
    console.log('EKYC_UI: Calling verifyAadhaarOTP with ClientID:', clientId);
    try {
      const res = await verifyAadhaarOTP(clientId, aadhaarOtp);
      console.log('EKYC_UI: Verification result:', JSON.stringify(res));
      if (res.success) {
        console.log('EKYC_UI: Verification TRUE');
        setIsAadhaarVerified(true);
        alert('Aadhaar Verified Successfully!');
      } else {
        console.log('EKYC_UI: Verification FALSE:', res.message);
        alert(res.message);
      }
    } catch (err) {
      console.log('EKYC_UI: Catch block error:', err.message);
      alert('Error verifying OTP');
    } finally {
      console.log('EKYC_UI: Setting EkycLoading to false');
      setEkycLoading(false);
    }
  };

  const handleNext = async () => {
    console.log('ONBOARDING: handleNext triggered');
    console.log('ONBOARDING: Current step:', currentStep);
    if (currentStep < steps.length) {
      console.log('ONBOARDING: Moving to next step');
      setCurrentStep(prev => prev + 1);
    } else {
      console.log('ONBOARDING: Final step reached. Starting KYC update.');
      setLoading(true);
      try {
          console.log('ONBOARDING: Preparing kycData object');
          const kycData = {
              phone,
              selfie: await fileToBase64(uploads.selfie),
              aadhaarFront: await fileToBase64(uploads.aadhaarFront),
              aadhaarBack: await fileToBase64(uploads.aadhaarBack),
              drivingLicense: await fileToBase64(uploads.license)
          };
          console.log('ONBOARDING: kycData prepared. Files converted to Base64');
          console.log('ONBOARDING: Calling updateKYC store method');
          const result = await updateKYC(kycData);
          console.log('ONBOARDING: updateKYC result:', JSON.stringify(result));
          if (result.success) {
              console.log('ONBOARDING: Success! Navigating to /rider/plans');
              navigate('/rider/plans');
          } else {
              console.log('ONBOARDING: Failed result. message:', result.message);
              alert(result.message);
          }
      } catch (error) {
          console.log('ONBOARDING: Error in final step try-catch:', error.message);
          alert('Error processing files. Please try again.');
      } finally {
          console.log('ONBOARDING: Setting loading to false');
          setLoading(false);
      }
    }
  };

  const canContinue = () => {
    console.log('VALIDATION: Checking if it can continue Step:', currentStep);
    if (currentStep === 1) {
      const res = !!uploads.selfie;
      console.log('VALIDATION: Step 1 Result:', res);
      return res;
    }
    if (currentStep === 2) {
      const res = !!uploads.aadhaarFront && !!uploads.aadhaarBack && isAadhaarVerified;
      console.log('VALIDATION: Step 2 Result:', res);
      return res;
    }
    if (currentStep === 3) {
      const res = !!uploads.license;
      console.log('VALIDATION: Step 3 Result:', res);
      return res;
    }
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
              }`}>Aadhaar e-KYC</h2>
              
              {!isAadhaarVerified ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#39FF14] italic ml-1">Aadhaar Number</label>
                    <input 
                      type="text"
                      maxLength="12"
                      placeholder="XXXX XXXX XXXX"
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                      disabled={otpSent}
                      className={`w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-4 text-white font-black tracking-[0.2em] focus:border-[#39FF14] outline-none transition-all ${
                        otpSent ? 'opacity-50' : ''
                      }`}
                    />
                  </div>

                  {otpSent && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#39FF14] italic ml-1">Enter OTP</label>
                      <input 
                        type="text"
                        maxLength="6"
                        placeholder="XXXXXX"
                        value={aadhaarOtp}
                        onChange={(e) => setAadhaarOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-4 text-white font-black tracking-[0.5em] focus:border-[#39FF14] outline-none transition-all"
                      />
                    </div>
                  )}

                  <NeonButton 
                    size="full" 
                    variant="green"
                    onClick={otpSent ? handleVerifyAadhaarOTP : handleSendAadhaarOTP}
                    disabled={ekycLoading || (otpSent ? !aadhaarOtp : !aadhaarNumber)}
                  >
                    {ekycLoading ? 'Wait...' : otpSent ? 'Verify OTP' : 'Send OTP'}
                  </NeonButton>
                </div>
              ) : (
                <div className="bg-[#39FF14]/10 border-2 border-[#39FF14] rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#39FF14] rounded-full flex items-center justify-center shadow-neon-sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" className="w-6 h-6">
                      <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#39FF14]">Verification Status</div>
                    <div className="text-white font-heading font-black italic">AADHAAR_VERIFIED</div>
                  </div>
                </div>
              )}

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                <div className="relative flex justify-center text-[8px] uppercase font-black tracking-[0.2em] text-white/20 px-2 bg-transparent">And Upload Documents</div>
              </div>

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
