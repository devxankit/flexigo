import React, { useState } from 'react';
import { 
  Zap, 
  ArrowLeft, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  ShieldCheck, 
  Truck,
  Plus,
  ChevronRight,
  Target,
  Search,
  ZapOff,
  History,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function AddVehiclePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    plate: '',
    vin: '',
    model: 'FlexiGo Pro v2',
    manufactureDate: '',
    insurancePolicy: '',
    insuranceExpiry: '',
    pucNumber: '',
    pucExpiry: ''
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-tertiary)] hover:text-emerald-500 transition-all font-black uppercase"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="space-y-0.5">
           <h1 className="text-2xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
              Vehicle <span className="text-emerald-500">Provisioning</span>
           </h1>
           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-tertiary)] italic leading-none">
              Asset Submission • Admin Approval Protocol
           </p>
        </div>
      </div>

      {isSuccess ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[var(--bg-secondary)] border border-emerald-500/20 rounded-[3rem] p-16 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Zap size={120} />
          </div>
          <div className="w-24 h-24 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
             <CheckCircle size={48} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter italic mb-4">Payload Submitted</h2>
          <p className="text-xs text-[var(--text-tertiary)] font-bold uppercase tracking-widest leading-relaxed max-w-sm mx-auto mb-10 italic">
            Your vehicle <span className="text-emerald-500 font-extrabold">{formData.plate}</span> has been queued for Admin verification. You will be notified once the node is authorized.
          </p>
          <button 
            onClick={() => navigate('/franchise/fleet')}
            className="px-10 py-5 bg-emerald-600 text-white rounded-3xl text-[10px] font-black uppercase tracking-[.4em] shadow-xl shadow-emerald-950/40 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-3 mx-auto group"
          >
            Return to Fleet Registry <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      ) : (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[3rem] p-12 shadow-sm relative overflow-hidden">
          {/* Step Indicator */}
          <div className="flex items-center gap-4 mb-12">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[10px] font-black transition-all border-2 ${
                  step >= s ? 'bg-emerald-500 text-white border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] border-[var(--border-subtle)]'
                }`}>
                  {step > s ? <CheckCircle size={14} /> : `0${s}`}
                </div>
                {s < 3 && <div className={`flex-1 h-0.5 rounded-full transition-all ${step > s ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-[var(--border-subtle)]'}`} />}
              </React.Fragment>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="space-y-8"
              >
                <div className="space-y-1">
                   <h3 className="text-lg font-black text-[var(--text-primary)] uppercase italic tracking-tight">Technical Identity</h3>
                   <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Base Asset telemetry data</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] ml-2">Number Plate</label>
                    <input 
                      required
                      value={formData.plate}
                      onChange={(e) => setFormData({...formData, plate: e.target.value})}
                      placeholder="KA 03 AB 1234"
                      className="w-full px-6 py-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-2xl text-[11px] font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-[var(--text-tertiary)]/50 italic"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] ml-2">VIN / Chassis Number</label>
                    <input 
                      required
                      value={formData.vin}
                      onChange={(e) => setFormData({...formData, vin: e.target.value})}
                      placeholder="VIN77889900..."
                      className="w-full px-6 py-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-2xl text-[11px] font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-[var(--text-tertiary)]/50 italic"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] ml-2">Vehicle Model</label>
                    <select 
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                      className="w-full px-6 py-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-2xl text-[11px] font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all appearance-none cursor-pointer italic"
                    >
                      <option>FlexiGo Pro v2</option>
                      <option>FlexiGo Heavy 3.0</option>
                      <option>City Commuter Lite</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] ml-2">Date of Manufacture</label>
                    <input 
                      type="date"
                      required
                      value={formData.manufactureDate}
                      onChange={(e) => setFormData({...formData, manufactureDate: e.target.value})}
                      className="w-full px-6 py-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-2xl text-[11px] font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all italic text-[var(--text-secondary)]"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="space-y-8"
              >
                <div className="space-y-1">
                   <h3 className="text-lg font-black text-[var(--text-primary)] uppercase italic tracking-tight">Compliance Payload</h3>
                   <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">RTO Documentation & Legal Assets</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-3 p-8 border-2 border-dashed border-[var(--border-subtle)] rounded-3xl flex flex-col items-center gap-4 group hover:border-emerald-500/40 hover:bg-emerald-600/5 transition-all cursor-pointer">
                     <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                        <Upload size={24} />
                     </div>
                     <div className="text-center">
                        <p className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest mb-1 italic">RC Certificate Sync</p>
                        <p className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest opacity-60">Upload High-Res (Front & Back)</p>
                     </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] ml-2">Insurance Policy No.</label>
                    <input 
                      required
                      value={formData.insurancePolicy}
                      onChange={(e) => setFormData({...formData, insurancePolicy: e.target.value})}
                      placeholder="POL_7788-99"
                      className="w-full px-6 py-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-2xl text-[11px] font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-[var(--text-tertiary)]/50 italic text-[var(--text-secondary)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] ml-2">Insurance Expiry</label>
                    <input 
                      type="date"
                      required
                      value={formData.insuranceExpiry}
                      onChange={(e) => setFormData({...formData, insuranceExpiry: e.target.value})}
                      className="w-full px-6 py-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-2xl text-[11px] font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all italic text-[var(--text-secondary)]"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="space-y-8"
              >
                <div className="space-y-1">
                   <h3 className="text-lg font-black text-[var(--text-primary)] uppercase italic tracking-tight">Review Node Deployment</h3>
                   <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Authorize for Admin inspection</p>
                </div>
                <div className="p-8 bg-emerald-600/5 border border-emerald-500/10 rounded-3xl space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                            <Zap size={24} />
                         </div>
                         <div>
                            <p className="text-xs font-black text-[var(--text-primary)] uppercase tracking-tight italic">{formData.plate || 'PLATE_REDACTED'}</p>
                            <p className="text-[9px] font-black text-emerald-500 tracking-[.4em] uppercase">{formData.model}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest mb-1">Authorization Target</p>
                         <p className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter italic">ADMIN_VERIFY_QUEUE</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl">
                         <ShieldCheck size={16} className="text-emerald-500" />
                         <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest">TLS Encrypted</span>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl">
                         <Target size={16} className="text-emerald-500" />
                         <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest">P2P Validation</span>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            <div className="flex gap-4 pt-10 border-t border-[var(--border-subtle)]">
               {step > 1 && (
                  <button 
                    type="button"
                    onClick={prevStep}
                    className="px-10 py-5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-3xl text-[10px] font-black uppercase tracking-[.4em] hover:bg-[var(--bg-secondary)] transition-all active:scale-95 italic"
                  >
                    Reverse Node
                  </button>
               )}
               <button 
                 type={step === 3 ? 'submit' : 'button'}
                 onClick={step === 3 ? undefined : nextStep}
                 disabled={isSubmitting}
                 className="flex-1 py-5 bg-emerald-600 text-white rounded-3xl text-[10px] font-black uppercase tracking-[.4em] shadow-xl shadow-emerald-950/40 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
               >
                 {isSubmitting ? (
                   <span className="animate-pulse">Authorizing Payload...</span>
                 ) : (
                   <>
                     {step === 3 ? 'Confirm Provisioning' : 'Next Protocol'} <ChevronRight size={14} />
                   </>
                 )}
               </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
