import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  ArrowLeft, 
  Smartphone, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  Fingerprint, 
  MapPin, 
  ChevronRight,
  Upload,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFleetStore } from '../store/fleetStore';
import { useRiderAssignmentStore } from '../store/riderAssignmentStore';

export default function AddRiderPage() {
  const navigate = useNavigate();
  const { vehicles = [] } = useFleetStore();
  const { addSubscriber, generateAadhaarOTP, verifyAadhaarOTP } = useRiderAssignmentStore();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ekycLoading, setEkycLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [clientId, setClientId] = useState('');
  const [otp, setOtp] = useState('');
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    aadhaar: '',
    pan: '',
    licenseNo: '',
    address: '',
    subscriptionPlan: 'Standard Weekly',
    vehicleId: ''
  });

  const handleGenerateOTP = async () => {
    if (formData.aadhaar.length !== 12) return;
    setEkycLoading(true);
    const res = await generateAadhaarOTP(formData.aadhaar);
    setEkycLoading(false);
    if (res.success) {
      setOtpSent(true);
      setClientId(res.client_id);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return;
    setEkycLoading(true);
    const res = await verifyAadhaarOTP(clientId, otp, formData.phone);
    setEkycLoading(false);
    if (res.success) {
      setIsAadhaarVerified(true);
      setOtpSent(false);
      setFormData(prev => ({ ...prev, name: res.data.full_name }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAadhaarVerified) {
        alert('Please verify Aadhaar first');
        return;
    }
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (addSubscriber) {
        addSubscriber({
          ...formData,
          id: `RID-${Math.floor(Math.random() * 9000) + 1000}`,
          status: 'pending',
          subscriptionStart: new Date().toISOString()
        });
      }
      setLoading(false);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/franchise/tracking');
      }, 2000);
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-black/40 border border-white/5 p-8 rounded-[2rem] text-center shadow-inner max-w-sm w-full relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-[0.02] scale-[2] pointer-events-none">
             <CheckCircle2 size={100} />
          </div>
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner relative">
            <CheckCircle2 size={24} className="text-emerald-500" strokeWidth={2.5} />
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-sm bg-emerald-500 animate-pulse border-2 border-slate-950 shadow-[0_0_8px_#10b981]" />
          </div>
          <h2 className="text-lg font-black text-white uppercase tracking-tighter mb-1.5 italic leading-none">RIDER_REGISTERED</h2>
          <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-6 italic leading-relaxed opacity-60">SUBSCRIBER_PAYLOAD_SYNCHRONIZED_WITH_ROOT</p>
          <div className="px-4 py-2 bg-black/40 border border-white/5 rounded-xl shadow-inner inline-flex">
             <span className="animate-pulse text-emerald-500 text-[8px] font-black uppercase tracking-[0.3em] italic leading-none">
               REDIRECTING_TO_CONSOLE...
             </span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2.5">
         <button 
           onClick={() => navigate(-1)}
           className="flex items-center gap-1.5 text-slate-600 hover:text-emerald-500 transition-all w-fit group"
         >
           <ArrowLeft size={10} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
           <span className="text-[7.5px] font-black uppercase tracking-widest italic leading-none">TERMINATE_SEQUENCE</span>
         </button>
         
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
               <UserPlus size={14} strokeWidth={2.5} />
            </div>
            <div className="space-y-0.5">
               <h1 className="text-lg font-black tracking-tighter text-white uppercase italic leading-none">
                  ADD_NEW <span className="text-emerald-500">RIDER</span>
               </h1>
               <p className="text-[7px] font-black uppercase tracking-[0.3em] text-slate-500 italic leading-none opacity-40">
                  SUBSCRIBER_REGISTRY • ASSET_HANDSHAKE_PROTOCOL
               </p>
            </div>
         </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-3">
         {/* Left Column - Personal Info */}
         <div className="lg:col-span-2 space-y-3">
            <div className="bg-black/20 border border-white/5 rounded-2xl p-4 shadow-inner space-y-4">
               <div className="flex items-center gap-2">
                  <div className="w-1 h-3 bg-emerald-500 rounded-full" />
                  <h3 className="text-[8px] font-black text-white uppercase tracking-widest italic leading-none">IDENTITY_PERSISTENCE</h3>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                     <label className="text-[7px] font-black text-slate-500 uppercase tracking-widest italic ml-1 leading-none">LEGAL_IDENTIFIER</label>
                     <div className="p-2 bg-black/40 border border-white/5 rounded-xl flex items-center gap-2 focus-within:border-emerald-500/30 transition-all shadow-inner group">
                        <Fingerprint size={12} strokeWidth={3} className="text-slate-700 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                          required 
                          placeholder="PERSONNEL_NAME..." 
                          className="bg-transparent border-none outline-none text-[8.5px] font-black uppercase italic text-white w-full placeholder:text-slate-800 tracking-widest"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="space-y-1.5">
                     <label className="text-[7px] font-black text-slate-500 uppercase tracking-widest italic ml-1 leading-none">MOBILE_UPLINK</label>
                     <div className="p-2 bg-black/40 border border-white/5 rounded-xl flex items-center gap-2 focus-within:border-emerald-500/30 transition-all shadow-inner group">
                        <Smartphone size={12} strokeWidth={3} className="text-slate-700 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                          required 
                          placeholder="+91_XXXX" 
                          className="bg-transparent border-none outline-none text-[8.5px] font-black uppercase italic text-white w-full placeholder:text-slate-800 tracking-widest"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="col-span-full space-y-1.5">
                     <label className="text-[7px] font-black text-slate-500 uppercase tracking-widest italic ml-1 leading-none">PHYSICAL_NODE_LOCATOR</label>
                     <div className="p-2 bg-black/40 border border-white/5 rounded-xl flex items-center gap-2 focus-within:border-emerald-500/30 transition-all shadow-inner group">
                        <MapPin size={12} strokeWidth={3} className="text-slate-700 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                          required 
                          placeholder="REGISTRY_ADDRESS..." 
                          className="bg-transparent border-none outline-none text-[8.5px] font-black uppercase italic text-white w-full placeholder:text-slate-800 tracking-widest"
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="space-y-1.5">
                      <label className="text-[7px] font-black text-slate-500 uppercase tracking-widest italic ml-1 leading-none">UNIQUE_ENTITY_PIN (AADHAAR)</label>
                      <div className="flex gap-2">
                        <div className={`flex-1 p-2 bg-black/40 border ${isAadhaarVerified ? 'border-emerald-500/50' : 'border-white/5'} rounded-xl flex items-center gap-2 transition-all shadow-inner group`}>
                           <ShieldCheck size={12} strokeWidth={3} className={isAadhaarVerified ? 'text-emerald-500' : 'text-slate-700'} />
                           <input 
                             required 
                             disabled={isAadhaarVerified}
                             placeholder="12_DIGIT_AADHAAR" 
                             maxLength={12}
                             className="bg-transparent border-none outline-none text-[8.5px] font-black uppercase italic text-white w-full placeholder:text-slate-800 tracking-widest"
                             value={formData.aadhaar}
                             onChange={(e) => setFormData({...formData, aadhaar: e.target.value.replace(/\D/g, '')})}
                           />
                           {isAadhaarVerified && <CheckCircle2 size={12} className="text-emerald-500" />}
                        </div>
                        {!isAadhaarVerified && !otpSent && (
                          <button 
                            type="button"
                            onClick={handleGenerateOTP}
                            disabled={formData.aadhaar.length !== 12 || ekycLoading}
                            className="px-4 bg-emerald-600 rounded-xl text-[7px] font-black uppercase tracking-widest disabled:opacity-50"
                          >
                            {ekycLoading ? '...' : 'VERIFY'}
                          </button>
                        )}
                      </div>

                      {otpSent && !isAadhaarVerified && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 mt-2">
                           <div className="flex-1 p-2 bg-black/40 border border-emerald-500/30 rounded-xl flex items-center gap-2 transition-all shadow-inner">
                              <Fingerprint size={12} strokeWidth={3} className="text-emerald-500" />
                              <input 
                                placeholder="ENTER_6_DIGIT_OTP" 
                                maxLength={6}
                                className="bg-transparent border-none outline-none text-[8.5px] font-black uppercase italic text-white w-full placeholder:text-slate-800 tracking-widest"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                              />
                           </div>
                           <button 
                             type="button"
                             onClick={handleVerifyOTP}
                             disabled={otp.length !== 6 || ekycLoading}
                             className="px-4 bg-emerald-600 rounded-xl text-[7px] font-black uppercase tracking-widest disabled:opacity-50"
                           >
                             {ekycLoading ? '...' : 'CONFIRM'}
                           </button>
                        </motion.div>
                      )}
                   </div>

                  <div className="space-y-1.5">
                     <label className="text-[7px] font-black text-slate-500 uppercase tracking-widest italic ml-1 leading-none">OPERATIONAL_ID</label>
                     <div className="p-2 bg-black/40 border border-white/5 rounded-xl flex items-center gap-2 focus-within:border-emerald-500/30 transition-all shadow-inner group">
                        <Zap size={12} strokeWidth={3} className="text-slate-700 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                          required 
                          placeholder="DL_XXXX" 
                          className="bg-transparent border-none outline-none text-[8.5px] font-black uppercase italic text-white w-full placeholder:text-slate-800 tracking-widest"
                          value={formData.licenseNo}
                          onChange={(e) => setFormData({...formData, licenseNo: e.target.value})}
                        />
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-black/20 border border-white/5 rounded-2xl p-4 shadow-inner space-y-4">
               <div className="flex items-center gap-2">
                  <div className="w-1 h-3 bg-blue-500 rounded-full" />
                  <h3 className="text-[8px] font-black text-white uppercase tracking-widest italic leading-none">SUBSCRIPTION_ASSET_ALLOCATION</h3>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                     <label className="text-[7px] font-black text-slate-500 uppercase tracking-widest italic ml-1 leading-none">PLAN_TIER_SELECTION</label>
                     <div className="relative p-2 bg-black/40 border border-white/5 rounded-xl flex items-center gap-2 focus-within:border-blue-500/30 transition-all shadow-inner group">
                        <CreditCard size={12} strokeWidth={3} className="text-slate-700 group-focus-within:text-blue-500 transition-colors" />
                        <select 
                          className="bg-transparent border-none outline-none text-[8.5px] font-black uppercase italic text-white w-full appearance-none cursor-pointer tracking-widest"
                          value={formData.subscriptionPlan}
                          onChange={(e) => setFormData({...formData, subscriptionPlan: e.target.value})}
                        >
                          <option value="Standard Weekly" className="bg-slate-900">STANDARD_WEEKLY_(₹1,500)</option>
                          <option value="Premium Monthly" className="bg-slate-900">PREMIUM_MONTHLY_(₹5,000)</option>
                          <option value="Enterprise Daily" className="bg-slate-900">ENTERPRISE_DAILY_(₹300)</option>
                        </select>
                        <ChevronRight size={10} strokeWidth={3} className="absolute right-2 rotate-90 text-slate-800 pointer-events-none" />
                     </div>
                  </div>

                  <div className="space-y-1.5">
                     <label className="text-[7px] font-black text-slate-500 uppercase tracking-widest italic ml-1 leading-none">NODE_ASSET_(VEHICLE)</label>
                     <div className="relative p-2 bg-black/40 border border-white/5 rounded-xl flex items-center gap-2 focus-within:border-blue-500/30 transition-all shadow-inner group">
                        <Truck size={12} strokeWidth={3} className="text-slate-700 group-focus-within:text-blue-500 transition-colors" />
                        <select 
                          className="bg-transparent border-none outline-none text-[8.5px] font-black uppercase italic text-white w-full appearance-none cursor-pointer tracking-widest"
                          value={formData.vehicleId}
                          onChange={(e) => setFormData({...formData, vehicleId: e.target.value})}
                        >
                          <option value="" className="bg-slate-900">NULL_ALLOCATION</option>
                          {vehicles.filter(v => v.status === 'available').map(v => (
                            <option key={v.id} value={v.id} className="bg-slate-900">{v.plate} • {v.model.toUpperCase()}</option>
                          ))}
                        </select>
                        <ChevronRight size={10} strokeWidth={3} className="absolute right-2 rotate-90 text-slate-800 pointer-events-none" />
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Right Column - Compliance & Actions */}
         <div className="space-y-3">
            <div className="bg-black/20 border border-white/5 rounded-2xl p-4 shadow-inner space-y-4">
               <div className="flex items-center gap-2">
                  <div className="w-1 h-3 bg-amber-500 rounded-full" />
                  <h3 className="text-[8px] font-black text-white uppercase tracking-widest italic leading-none">COMPLIANCE_DECK</h3>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2">
                  {[
                    { label: 'LICENSE_DOCUMENT', key: 'license' },
                    { label: 'AADHAAR_SCAN', key: 'aadhaarDoc' },
                    { label: 'PAN_IDENTITY', key: 'panDoc' }
                  ].map((doc) => (
                    <div key={doc.key} className="relative group">
                      <input 
                        type="file"
                        id={`file-${doc.key}`}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setFormData(prev => ({
                              ...prev,
                              [`file_${doc.key}`]: file.name
                            }));
                          }
                        }}
                      />
                      <label 
                        htmlFor={`file-${doc.key}`}
                        className={`w-full p-2 border border-dashed rounded-xl flex items-center gap-2.5 transition-all cursor-pointer shadow-inner ${
                          formData[`file_${doc.key}`] 
                            ? 'border-emerald-500/30 bg-emerald-500/5' 
                            : 'border-white/10 hover:border-emerald-500/20 hover:bg-black/40 bg-black/20'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border border-transparent shadow-inner ${formData[`file_${doc.key}`] ? 'text-emerald-500 border-emerald-500/10 bg-emerald-500/5' : 'text-slate-700 group-hover:text-emerald-500 bg-black/40 border-white/5'}`}>
                          {formData[`file_${doc.key}`] ? <CheckCircle2 size={12} strokeWidth={2.5} /> : <Upload size={10} strokeWidth={3} />}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                           <span className={`text-[7.5px] font-black uppercase tracking-widest truncate leading-none ${formData[`file_${doc.key}`] ? 'text-emerald-500' : 'text-slate-400'}`}>
                             {formData[`file_${doc.key}`] || doc.label}
                           </span>
                           <span className="text-[6.5px] font-black text-slate-600 uppercase italic opacity-40 leading-none mt-1">
                             {formData[`file_${doc.key}`] ? 'ENCRYPTED_PAYLOAD' : 'PDF/JPG_FORMAT'}
                           </span>
                        </div>
                      </label>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 space-y-4 shadow-inner relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-[0.02] scale-[2] pointer-events-none">
                  <Zap size={40} />
               </div>
               <h4 className="text-[7.5px] font-black text-emerald-500 uppercase tracking-[0.3em] italic leading-none">PROTOCOL_SUMMARY</h4>
               <div className="space-y-2 relative z-10">
                  <div className="flex justify-between items-center bg-black/20 p-2 rounded-lg border border-white/5 shadow-inner">
                    <span className="text-[6.5px] font-black uppercase text-slate-500 italic opacity-60 leading-none">COLLATERAL_NODE</span>
                    <span className="text-[8.5px] font-black text-white italic leading-none tracking-tighter">₹5,000.00</span>
                  </div>
                  <div className="flex justify-between items-center bg-black/20 p-2 rounded-lg border border-white/5 shadow-inner">
                    <span className="text-[6.5px] font-black uppercase text-slate-500 italic opacity-60 leading-none">HANDSHAKE_STATUS</span>
                    <span className="text-[8.5px] font-black text-emerald-500 italic leading-none tracking-tighter">VERIFIED</span>
                  </div>
                  <div className="h-px bg-emerald-500/10 my-2" />
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-[7.5px] font-black uppercase tracking-[.3em] shadow-lg shadow-emerald-950/40 hover:bg-emerald-500 transition-all active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50 italic shadow-inner"
                  >
                    {loading ? (
                      <>
                        <div className="w-2.5 h-2.5 border border-white/20 border-t-white rounded-full animate-spin" />
                        SYNCING_TX...
                      </>
                    ) : (
                      <>
                        AUTHORIZE_SYNC <ChevronRight size={10} strokeWidth={3} className="group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
               </div>
            </div>
         </div>
      </form>
    </div>
  );
}
