import React, { useState } from 'react';
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
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.png';

export default function FranchiseOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const steps = [
    { id: 1, label: 'Identity', icon: UserCheck },
    { id: 2, label: 'Entity Details', icon: Building2 },
    { id: 3, label: 'Infrastructure', icon: MapPin },
    { id: 4, label: 'Compliance', icon: ShieldCheck },
    { id: 5, label: 'Review', icon: Target },
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
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08),transparent_70%)] pointer-events-none" />
      
      {isSuccess ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-xl bg-slate-900 border border-emerald-500/20 rounded-[3rem] p-16 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Zap size={160} className="text-emerald-500" />
          </div>
          <div className="w-24 h-24 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
             <CheckCircle size={48} className="text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-4">Onboarding Initiated</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed mb-12 italic">
            Your franchise node application has been submitted to the <span className="text-emerald-500 font-extrabold text-sm tracking-normal">Flexigo Control Root</span>. Our verification engine will review your compliance payload within 24-48 hours.
          </p>
          <button 
            onClick={() => navigate('/franchise')}
            className="w-full py-6 bg-emerald-600 text-white rounded-3xl text-[10px] font-black uppercase tracking-[.5em] shadow-xl shadow-emerald-950/40 hover:bg-emerald-500 transition-all active:scale-95 flex items-center justify-center gap-4 group"
          >
            Return to Command Center <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      ) : (
        <div className="w-full max-w-2xl">
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-12 text-center relative z-10">
            <div className="w-14 h-14 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
              <img src={logo} alt="Flexigo" className="w-10 h-10 object-contain invert opacity-80" />
            </div>
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
              Partner <span className="text-emerald-500">Node Onboarding</span>
            </h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2 italic">
              Phase 01: Infrastructure Provisioning
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden">
            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-16 relative">
               <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 rounded-full" />
               <div 
                 className="absolute top-1/2 left-0 h-0.5 bg-emerald-500 -translate-y-1/2 rounded-full transition-all duration-500 shadow-[0_0_10px_#10b981]" 
                 style={{ width: `${((step-1)/(steps.length-1)) * 100}%` }}
               />
               {steps.map((s) => {
                 const Icon = s.icon;
                 const isActive = step === s.id;
                 const isCompleted = step > s.id;
                 return (
                   <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 ${
                        isActive ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-950/50 scale-110' : 
                        isCompleted ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 
                        'bg-slate-950 border-slate-800 text-slate-600'
                      }`}>
                         {isCompleted ? <CheckCircle size={20} strokeWidth={3} /> : <Icon size={20} strokeWidth={isActive ? 3 : 2} />}
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-emerald-500' : 'text-slate-600'}`}>
                        {s.label}
                      </span>
                   </div>
                 );
               })}
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
               {step === 1 && (
                 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div className="space-y-1">
                       <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Identity Terminal</h3>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Administrative Owner Credentials</p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="col-span-2 space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 italic">Full Legal Name</label>
                          <input required className="w-full px-8 py-5 bg-slate-950 border border-slate-800 rounded-3xl text-sm font-black text-white uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/40 outline-none transition-all placeholder:text-slate-700 italic" placeholder="Enter Full Name..." />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 italic">Mobile Node</label>
                          <input required className="w-full px-8 py-5 bg-slate-950 border border-slate-800 rounded-3xl text-sm font-black text-white uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/40 outline-none transition-all placeholder:text-slate-700 italic" placeholder="+91 XXXX" />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 italic">Official Email</label>
                          <input required type="email" className="w-full px-8 py-5 bg-slate-950 border border-slate-800 rounded-3xl text-sm font-black text-white lowercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/40 outline-none transition-all placeholder:text-slate-700 italic" placeholder="partner@domain.com" />
                       </div>
                    </div>
                 </motion.div>
               )}

               {step === 2 && (
                 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div className="space-y-1">
                       <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Entity Registry</h3>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Business Structure & Taxation</p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="col-span-2 space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 italic">Firm/Organization Name</label>
                          <input required className="w-full px-8 py-5 bg-slate-950 border border-slate-800 rounded-3xl text-sm font-black text-white uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/40 outline-none transition-all placeholder:text-slate-700 italic" placeholder="Organization Identity" />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 italic">Entity Type</label>
                          <select className="w-full px-8 py-5 bg-slate-950 border border-slate-800 rounded-3xl text-sm font-black text-white uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/40 outline-none transition-all appearance-none cursor-pointer italic">
                             <option>Pvt Ltd Company</option>
                             <option>Partnership Firm</option>
                             <option>LLP</option>
                             <option>Proprietorship</option>
                          </select>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 italic">GSTIN Registry</label>
                          <input required className="w-full px-8 py-5 bg-slate-950 border border-slate-800 rounded-3xl text-sm font-black text-white uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/40 outline-none transition-all placeholder:text-slate-700 italic" placeholder="29XXXXX" />
                       </div>
                    </div>
                 </motion.div>
               )}

               {step === 3 && (
                 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div className="space-y-1">
                       <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Infrastructure Hub</h3>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Regional Node Location</p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 italic">Deployment City</label>
                          <input required className="w-full px-8 py-5 bg-slate-950 border border-slate-800 rounded-3xl text-sm font-black text-white uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/40 outline-none transition-all placeholder:text-slate-700 italic" placeholder="Bangalore" />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 italic">Estimated Fleet Yield</label>
                          <input required type="number" className="w-full px-8 py-5 bg-slate-950 border border-slate-800 rounded-3xl text-sm font-black text-white uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/40 outline-none transition-all placeholder:text-slate-700 italic" placeholder="50 Units" />
                       </div>
                       <div className="col-span-2 space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 italic">Hub Physical Location (Full Address)</label>
                          <textarea rows={3} required className="w-full px-8 py-5 bg-slate-950 border border-slate-800 rounded-3xl text-sm font-black text-white uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/40 outline-none transition-all placeholder:text-slate-700 italic no-scrollbar" placeholder="Enter Physical Node Address..." />
                       </div>
                    </div>
                 </motion.div>
               )}

               {step === 4 && (
                 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div className="space-y-1">
                       <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Compliance Payload</h3>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Document Registry Synchronization</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {['GSTIN Certificate', 'Entity Registration', 'Owner PAN/Aadhaar', 'Bank Proof'].map((doc) => (
                         <div key={doc} className="p-8 border-2 border-dashed border-slate-800 rounded-[2rem] flex flex-col items-center gap-4 group hover:border-emerald-500/40 hover:bg-emerald-600/5 transition-all cursor-pointer">
                            <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600 group-hover:text-emerald-500 group-hover:scale-110 transition-all">
                               <Upload size={22} />
                            </div>
                            <div className="text-center">
                               <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1 italic">{doc}</p>
                               <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em]">PDF/JPEG Supported</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </motion.div>
               )}

               {step === 5 && (
                 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div className="space-y-1">
                       <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Protocol Review</h3>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Validation of Partner Registry</p>
                    </div>
                    <div className="bg-emerald-600/5 border border-emerald-500/10 rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12">
                          <Target size={80} />
                       </div>
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
                             <Globe size={32} />
                          </div>
                          <div className="space-y-1">
                             <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em]">Node Authorization</p>
                             <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Ready for Clearance</h4>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 p-5 bg-slate-950/80 border border-slate-800 rounded-3xl">
                             <ShieldCheck size={18} className="text-emerald-500" />
                             <span className="text-[10px] font-black text-white uppercase tracking-widest">Doc Integrity: 100%</span>
                          </div>
                          <div className="flex items-center gap-3 p-5 bg-slate-950/80 border border-slate-800 rounded-3xl">
                             <Briefcase size={18} className="text-emerald-500" />
                             <span className="text-[10px] font-black text-white uppercase tracking-widest">Entity Active</span>
                          </div>
                       </div>
                       <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed tracking-widest pt-2 italic">
                         By executing deployment, you authorize Flexigo Root to verify provided PII and business assets for regional node activation.
                       </p>
                    </div>
                 </motion.div>
               )}

               <div className="flex gap-4 pt-8 border-t border-slate-800/50">
                  {step > 1 && (
                    <button 
                      type="button" 
                      onClick={handlePrev} 
                      className="px-10 py-5 bg-slate-950 border border-slate-800 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-slate-800 transition-all italic"
                    >
                      Reverse Phase
                    </button>
                  )}
                  <button 
                    type={step === 5 ? 'submit' : 'button'} 
                    onClick={step === 5 ? undefined : handleNext} 
                    disabled={isSubmitting}
                    className="flex-1 py-5 bg-emerald-600 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.5em] shadow-xl shadow-emerald-950/40 hover:bg-emerald-500 transition-all active:scale-95 flex items-center justify-center gap-4"
                  >
                     {isSubmitting ? (
                        <div className="flex items-center gap-3">
                           <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                           <span className="animate-pulse">Authorizing Payload...</span>
                        </div>
                     ) : (
                        <>
                           {step === 5 ? 'Deploy Partner Node' : 'Initialize Next Phase'} <ChevronRight size={18} />
                        </>
                     )}
                  </button>
               </div>
            </form>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-8 opacity-40">
             <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span className="text-[9px] font-black text-white uppercase tracking-widest">TLS 1.3 Encryption</span>
             </div>
             <div className="flex items-center gap-2">
                <FileText size={14} className="text-emerald-500" />
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Audit Policy v2.0</span>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
