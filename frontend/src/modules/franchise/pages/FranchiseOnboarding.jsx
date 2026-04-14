import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  UserCheck, 
  Smartphone, 
  CheckCircle, 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  Plus, 
  Clock, 
  MapPin, 
  ArrowLeft,
  Briefcase,
  Zap,
  Globe,
  Upload,
  FileText,
  Target,
  CreditCard,
  Landmark,
  Layers,
  Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.png';

export default function FranchiseOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.style.backgroundColor = '#020617';
  }, []);

  const steps = [
    { id: 1, label: 'Profile', icon: Fingerprint },
    { id: 2, label: 'Business', icon: Building2 },
    { id: 3, label: 'Hub Plan', icon: Layers },
    { id: 4, label: 'Payments', icon: Landmark },
    { id: 5, label: 'KYC', icon: ShieldCheck },
    { id: 6, label: 'Review', icon: Target },
  ];

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2500);
  };

  return (
    <div className="dark min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-6 relative overflow-hidden text-[var(--text-primary)]">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[1px] bg-emerald-500/10" />
      
      {isSuccess ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-slate-900 border border-emerald-500/20 rounded-[2.5rem] p-12 text-center shadow-2xl relative overflow-hidden shadow-emerald-950/20"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
             <Zap size={140} className="text-emerald-500" />
          </div>
          <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner shadow-emerald-500/20">
             <CheckCircle size={32} className="text-emerald-500" />
          </div>
          <h2 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tighter italic mb-3">ONBOARDING_LOCKED</h2>
          <p className="text-[7.5px] text-[var(--text-secondary)] font-black uppercase tracking-[0.3em] leading-relaxed mb-10 italic opacity-60 max-w-[280px] mx-auto">
            Your franchise node protocol has been committed to the <span className="text-emerald-500">ROOT_CONTROL</span>. Validation phase active.
          </p>
          <button 
            onClick={() => navigate('/franchise')}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[8px] font-black uppercase tracking-[0.4em] shadow-lg shadow-emerald-950/40 hover:bg-emerald-500 transition-all active:scale-95 flex items-center justify-center gap-3 italic group"
          >
            ACCESS_DASHBOARD <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      ) : (
        <div className="w-full max-w-xl">
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-8 text-center relative z-10">
            <div className="w-10 h-10 bg-slate-900 border border-[var(--border-subtle)] rounded-2xl flex items-center justify-center mb-5 shadow-xl shadow-black/40">
              <img src={logo} alt="Flexigo" className="w-6 h-6 object-contain invert opacity-80" />
            </div>
            <h1 className="text-2xl font-black text-[var(--text-primary)] uppercase italic tracking-tighter leading-none">
              Franchise <span className="text-emerald-500">Registration</span>
            </h1>
            <p className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.4em] mt-2 italic opacity-60">
              Step 1: Hub Partner Onboarding
            </p>
          </div>

          <div className="bg-slate-900 border border-[var(--border-subtle)] rounded-[3rem] p-8 shadow-2xl relative overflow-hidden shadow-black/40">
            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-12 relative px-2">
               <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-white/5 -translate-y-1/2 rounded-full" />
               <div 
                 className="absolute top-1/2 left-4 h-[1px] bg-emerald-500 -translate-y-1/2 rounded-full transition-all duration-500 shadow-[0_0_8px_#10b981]" 
                 style={{ width: `${((step-1)/(steps.length-1)) * 96}%` }}
               />
               {steps.map((s) => {
                 const Icon = s.icon;
                 const isActive = step === s.id;
                 const isCompleted = step > s.id;
                 return (
                   <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 border shadow-inner ${
                        isActive ? 'bg-emerald-600 text-white shadow-emerald-950/50 scale-110' : 
                        isCompleted ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 
                        'bg-[var(--bg-primary)] border-[var(--border-subtle)] text-slate-700'
                      }`}>
                         {isCompleted ? <CheckCircle size={14} strokeWidth={3} /> : <Icon size={14} strokeWidth={isActive ? 3 : 2} />}
                      </div>
                      <span className={`text-[6.5px] font-black uppercase tracking-[0.2em] italic ${isActive ? 'text-emerald-500' : 'text-slate-800'}`}>
                        {s.label}
                      </span>
                   </div>
                 );
               })}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
               {step === 1 && (
                 <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="space-y-0.5">
                       <h3 className="text-sm font-black text-[var(--text-primary)] uppercase italic tracking-tight">Personal Details</h3>
                       <p className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase tracking-widest italic opacity-60">Owner Information & Contact</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <div className="col-span-2 space-y-1.5">
                          <label className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1 italic opacity-40">Full Legal Name</label>
                          <input required className="w-full px-4 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[9px] font-black text-[var(--text-primary)] uppercase tracking-widest outline-none transition-all placeholder:text-slate-800 italic shadow-inner focus:border-emerald-500/20" placeholder="ENTER FULL NAME..." />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1 italic opacity-40">Aadhaar Number</label>
                          <input required className="w-full px-4 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[9px] font-black text-[var(--text-primary)] uppercase tracking-widest outline-none transition-all placeholder:text-slate-800 italic shadow-inner focus:border-emerald-500/20" placeholder="XXXX XXXX XXXX" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1 italic opacity-40">PAN Card Number</label>
                          <input required className="w-full px-4 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[9px] font-black text-[var(--text-primary)] uppercase tracking-widest outline-none transition-all placeholder:text-slate-800 italic shadow-inner focus:border-emerald-500/20" placeholder="ABCDE1234F" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1 italic opacity-40">Mobile Number</label>
                          <input required className="w-full px-4 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[9px] font-black text-[var(--text-primary)] uppercase tracking-widest outline-none transition-all placeholder:text-slate-800 italic shadow-inner focus:border-emerald-500/20" placeholder="+91 XXXX" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1 italic opacity-40">Email Address</label>
                          <input required type="email" className="w-full px-4 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[9px] font-black text-[var(--text-primary)] lowercase tracking-widest outline-none transition-all placeholder:text-slate-800 italic shadow-inner focus:border-emerald-500/20" placeholder="partner@domain.com" />
                       </div>
                    </div>
                 </motion.div>
               )}

               {step === 2 && (
                 <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="space-y-0.5">
                       <h3 className="text-sm font-black text-[var(--text-primary)] uppercase italic tracking-tight">Business Profile</h3>
                       <p className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase tracking-widest italic opacity-60">Company & Hub Details</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <div className="col-span-2 space-y-1.5">
                          <label className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1 italic opacity-40">Business Name</label>
                          <input required className="w-full px-4 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[9px] font-black text-[var(--text-primary)] uppercase tracking-widest outline-none transition-all placeholder:text-slate-800 italic shadow-inner focus:border-emerald-500/20" placeholder="FIRM IDENTITY" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1 italic opacity-40">GST Number</label>
                          <input required className="w-full px-4 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[9px] font-black text-[var(--text-primary)] uppercase tracking-widest outline-none transition-all placeholder:text-slate-800 italic shadow-inner focus:border-emerald-500/20" placeholder="29XXXXX" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1 italic opacity-40">Operational City</label>
                          <input required className="w-full px-4 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[9px] font-black text-[var(--text-primary)] uppercase tracking-widest outline-none transition-all placeholder:text-slate-800 italic shadow-inner focus:border-emerald-500/20" placeholder="BANGALORE" />
                       </div>
                       <div className="col-span-2 space-y-1.5">
                          <label className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1 italic opacity-40">Hub Address</label>
                          <textarea rows={2} required className="w-full px-4 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[9px] font-black text-[var(--text-primary)] uppercase tracking-widest outline-none transition-all placeholder:text-slate-800 italic shadow-inner focus:border-emerald-500/20 no-scrollbar" placeholder="Enter complete hub location address..." />
                       </div>
                    </div>
                 </motion.div>
               )}

               {step === 3 && (
                 <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="space-y-0.5">
                       <h3 className="text-sm font-black text-[var(--text-primary)] uppercase italic tracking-tight">Select Plan</h3>
                       <p className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase tracking-widest italic opacity-60">Choose your hub scale</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                       {[
                         { name: 'Tier 1', fee: '15K', vehicles: '25', color: 'slate-500' },
                         { name: 'Tier 2', fee: '28K', vehicles: '50', color: 'emerald-500' },
                         { name: 'Tier 3', fee: '52K', vehicles: '100', color: 'blue-500' },
                         { name: 'Tier 4', fee: '75K', vehicles: '150', color: 'purple-500' },
                         { name: 'Tier 5', fee: '95K', vehicles: '200', color: 'rose-500' }
                       ].map((tier) => (
                         <div key={tier.name} className="p-4 bg-black/20 border border-[var(--border-subtle)] rounded-2xl hover:border-emerald-500/20 transition-all cursor-pointer group relative overflow-hidden shadow-inner">
                            <div className={`text-[6px] font-black uppercase tracking-[0.3em] mb-3 text-${tier.color} italic`}>{tier.name}</div>
                            <div className="text-xl font-black text-[var(--text-primary)] uppercase italic mb-1 leading-none">₹{tier.fee}</div>
                            <div className="text-[7.5px] font-black text-slate-600 uppercase tracking-widest italic leading-none">Monthly Plan Fee</div>
                            <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                               <span className="text-[7px] font-black text-[var(--text-tertiary)] italic uppercase">Fleet: {tier.vehicles} Vehicles</span>
                               <div className="w-4 h-4 rounded-lg border border-[var(--border-subtle)] flex items-center justify-center group-hover:border-emerald-500 transition-all">
                                  <div className="w-1.5 h-1.5 rounded bg-emerald-500 opacity-0 group-hover:opacity-100 transition-all shadow-[0_0_8px_#10b981]" />
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </motion.div>
               )}

               {step === 4 && (
                 <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="space-y-0.5">
                       <h3 className="text-sm font-black text-[var(--text-primary)] uppercase italic tracking-tight">Bank Information</h3>
                       <p className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase tracking-widest italic opacity-60">Payment and Settlement Details</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <div className="col-span-2 space-y-1.5">
                          <label className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1 italic opacity-40">Beneficiary Name</label>
                          <input required className="w-full px-4 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[9px] font-black text-[var(--text-primary)] uppercase tracking-widest outline-none transition-all placeholder:text-slate-800 italic shadow-inner focus:border-emerald-500/20" placeholder="NAME AS PER BANK" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1 italic opacity-40">Account Number</label>
                          <input required type="password" className="w-full px-4 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[9px] font-black text-[var(--text-primary)] uppercase tracking-widest outline-none transition-all placeholder:text-slate-800 italic shadow-inner focus:border-emerald-500/20" placeholder="XXXX XXXX XXXX" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1 italic opacity-40">IFSC Code</label>
                          <input required className="w-full px-4 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[9px] font-black text-[var(--text-primary)] uppercase tracking-widest outline-none transition-all placeholder:text-slate-800 italic shadow-inner focus:border-emerald-500/20" placeholder="UTIBXXXX" />
                       </div>
                    </div>
                 </motion.div>
               )}

               {step === 5 && (
                 <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="space-y-0.5">
                       <h3 className="text-sm font-black text-[var(--text-primary)] uppercase italic tracking-tight">Upload Documents</h3>
                       <p className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase tracking-widest italic opacity-60">Verification and KYC Documents</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       {[
                         { name: 'GST Certificate', key: 'gst' },
                         { name: 'Registration Proof', key: 'entity' },
                         { name: 'Aadhaar Copy', key: 'aadhaar' },
                         { name: 'PAN Card Copy', key: 'pan' }
                       ].map((doc) => (
                         <div key={doc.key} className="relative group">
                            <input type="file" id={`upload-${doc.key}`} className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                            <label 
                              htmlFor={`upload-${doc.key}`}
                              className="w-full p-4 border border-[var(--border-subtle)] rounded-2xl flex flex-col items-center gap-3 transition-all cursor-pointer hover:border-emerald-500/20 hover:bg-emerald-500/5 bg-[var(--bg-tertiary)] shadow-inner group"
                            >
                               <div className="w-8 h-8 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-center text-slate-700 group-hover:text-emerald-500 group-hover:scale-105 transition-all shadow-inner">
                                  <Upload size={14} />
                               </div>
                               <div className="text-center">
                                  <p className="text-[7.5px] font-black text-[var(--text-primary)] uppercase tracking-widest italic mb-0.5">{doc.name}</p>
                                  <p className="text-[6.5px] font-black text-slate-700 uppercase tracking-widest opacity-60">PDF/JPEG_AUTH</p>
                               </div>
                            </label>
                         </div>
                       ))}
                    </div>
                 </motion.div>
               )}

               {step === 6 && (
                 <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="space-y-0.5">
                       <h3 className="text-sm font-black text-[var(--text-primary)] uppercase italic tracking-tight">Final Review</h3>
                       <p className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase tracking-widest italic opacity-60">Confirm your application</p>
                    </div>
                    <div className="bg-emerald-600/5 border border-emerald-500/10 rounded-[2rem] p-6 space-y-6 relative overflow-hidden shadow-inner">
                       <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
                          <Target size={100} />
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
                             <Globe size={20} />
                          </div>
                          <div className="space-y-0.5">
                             <p className="text-[7.5px] font-black text-emerald-500 uppercase tracking-[0.3em] italic">Ready for Verification</p>
                             <h4 className="text-xl font-black text-[var(--text-primary)] uppercase italic tracking-tighter leading-none">Hub Registration Complete</h4>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2.5 p-3.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl shadow-inner">
                             <ShieldCheck size={14} className="text-emerald-500" />
                             <span className="text-[8px] font-black text-[var(--text-primary)] uppercase tracking-widest italic">Data Verified</span>
                          </div>
                          <div className="flex items-center gap-2.5 p-3.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl shadow-inner">
                             <Briefcase size={14} className="text-emerald-500" />
                             <span className="text-[8px] font-black text-[var(--text-primary)] uppercase tracking-widest italic">BILLING_SYNCED</span>
                          </div>
                       </div>
                    </div>
                 </motion.div>
               )}

               <div className="flex gap-3 pt-6 border-t border-[var(--border-subtle)]">
                  {step > 1 && (
                    <button 
                      type="button" 
                      onClick={handlePrev} 
                      className="px-6 py-3.5 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-tertiary)] rounded-xl text-[8px] font-black uppercase tracking-[0.3em] hover:bg-white/5 hover:text-white transition-all italic shadow-inner"
                    >
                      BACK
                    </button>
                  )}
                   <button 
                    type={step === 6 ? 'submit' : 'button'} 
                    onClick={step === 6 ? undefined : handleNext} 
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.4em] shadow-lg shadow-emerald-950/40 hover:bg-emerald-500 transition-all active:scale-95 flex items-center justify-center gap-3 italic relative overflow-hidden group"
                  >
                     {isSubmitting ? (
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                           <span className="animate-pulse">AUTHORIZING_PAYLOAD...</span>
                        </div>
                     ) : (
                        <>
                           {step === 6 ? 'Submit Application' : 'Continue'} <ChevronRight size={14} />
                        </>
                     )}
                     <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </button>
               </div>
            </form>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-6 opacity-30 italic">
             <div className="flex items-center gap-2">
                <ShieldCheck size={10} className="text-emerald-500" />
                <span className="text-[7.5px] font-black text-[var(--text-primary)] uppercase tracking-widest">Secure Verification</span>
             </div>
             <div className="flex items-center gap-2">
                <FileText size={10} className="text-emerald-500" />
                <span className="text-[7.5px] font-black text-[var(--text-primary)] uppercase tracking-widest">Partner Policy Applied</span>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
