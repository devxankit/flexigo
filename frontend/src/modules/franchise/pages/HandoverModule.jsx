import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Truck, 
  MapPin, 
  Battery, 
  CheckCircle2, 
  AlertCircle, 
  History,
  QrCode,
  Smartphone,
  CreditCard,
  Camera,
  ChevronRight,
  ArrowLeftRight,
  ChevronLeft
} from 'lucide-react';
import StepForm from '../components/StepForm';
import UploadCard from '../components/UploadCard';
import StatusBadge from '../components/StatusBadge';
import { useHandoverStore } from '../store/handoverStore';
import { useRiderAssignmentStore } from '../store/riderAssignmentStore';
import { useFleetStore } from '../store/fleetStore';

export default function HandoverModule() {
  const { activeStep, setStep, handoverData, updateHandoverData, resetHandover } = useHandoverStore();
  const { subscribers } = useRiderAssignmentStore();
  const { vehicles } = useFleetStore();

  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const pendingReturns = (subscribers || []).filter(s => s.status === 'active' || s.status === 'paused');

  useEffect(() => {
    if (selectedSubscriber) {
      const vehicle = vehicles.find(v => v.id === selectedSubscriber.vehicleId);
      setSelectedVehicle(vehicle);
      updateHandoverData({ subscriberId: selectedSubscriber.id, vehicleId: vehicle?.id });
    }
  }, [selectedSubscriber, vehicles, updateHandoverData]);

  const handleNext = () => {
    if (activeStep < 3) setStep(activeStep + 1);
    else {
      console.log('Handover Completed:', handoverData);
      setSelectedSubscriber(null);
      resetHandover();
    }
  };

  const steps = [
    {
      title: 'Photo Documentation',
      component: (
        <div className="grid grid-cols-2 gap-4 h-full">
          <UploadCard 
            label="Front Cluster" 
            value={handoverData.photos.front} 
            onUpload={(url) => updateHandoverData({ photos: { ...handoverData.photos, front: url } })} 
          />
          <UploadCard 
            label="Rear Profile" 
            value={handoverData.photos.back} 
            onUpload={(url) => updateHandoverData({ photos: { ...handoverData.photos, back: url } })} 
          />
          <UploadCard 
            label="Port Chassis" 
            value={handoverData.photos.left} 
            onUpload={(url) => updateHandoverData({ photos: { ...handoverData.photos, left: url } })} 
          />
          <UploadCard 
            label="Starboard Chassis" 
            value={handoverData.photos.right} 
            onUpload={(url) => updateHandoverData({ photos: { ...handoverData.photos, right: url } })} 
          />
        </div>
      )
    },
    {
      title: 'Technical Inspection',
      component: (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-[var(--bg-tertiary)]/20 border border-[var(--border-subtle)]">
             <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-4 border-b border-[var(--border-subtle)] pb-2">Verification Checklist</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               {Object.keys(handoverData.inspection).map((item) => (
                 <button
                   key={item}
                   onClick={() => updateHandoverData({ inspection: { ...handoverData.inspection, [item]: !handoverData.inspection[item] } })}
                   className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                     handoverData.inspection[item] 
                     ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' 
                     : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                   }`}
                 >
                   <span className="text-[10px] font-bold uppercase tracking-wider">
                     {item.replace(/([A-Z])/g, ' $1').trim()} Integrity
                   </span>
                   <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                     handoverData.inspection[item] ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-[var(--border-subtle)]'
                   }`}>
                     {handoverData.inspection[item] && <CheckCircle2 size={12} strokeWidth={3} />}
                   </div>
                 </button>
               ))}
             </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
             <AlertCircle size={18} className="text-red-500 shrink-0" />
             <p className="text-[9px] font-bold text-red-500/70 uppercase leading-relaxed tracking-wider">
                Flagging mechanical defects will trigger an immediate maintenance quarantine for this asset.
             </p>
          </div>
        </div>
      )
    },
    {
      title: 'Operational Telemetry',
      component: (
        <div className="space-y-10">
          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Synchronized Battery SOC</span>
                <span className="text-4xl font-bold text-emerald-600 tracking-tighter">{handoverData.batteryLevel}%</span>
             </div>
             <div className="relative h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${handoverData.batteryLevel}%` }}
                  className="absolute h-full bg-emerald-500"
                />
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={handoverData.batteryLevel}
                  onChange={(e) => updateHandoverData({ batteryLevel: parseInt(e.target.value) })}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
             </div>
             <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">
               <span>Critical</span>
               <span>Nominal</span>
               <span>Full</span>
             </div>
          </div>

          <div className="p-6 rounded-xl bg-[var(--bg-tertiary)]/20 border border-[var(--border-subtle)] flex flex-col justify-between">
             <div className="flex items-center justify-between mb-6">
               <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Calculated Settlement</span>
                  <h3 className="text-3xl font-bold text-[var(--text-primary)]">₹{handoverData.batteryLevel < 20 ? '450' : '0'}</h3>
               </div>
               <div className="w-10 h-10 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shadow-sm">
                  <CreditCard size={20} />
               </div>
             </div>
             <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border-subtle)]">
                <div className="space-y-0.5">
                   <p className="text-[9px] font-bold uppercase text-[var(--text-tertiary)] tracking-wider">Service Fee</p>
                   <p className="text-sm font-bold text-[var(--text-primary)]">₹0</p>
                </div>
                <div className="space-y-0.5">
                   <p className="text-[9px] font-bold uppercase text-[var(--text-tertiary)] tracking-wider">Storage Rebuy</p>
                   <p className="text-sm font-bold text-red-500">₹{handoverData.batteryLevel < 20 ? '450' : '0'}</p>
                </div>
             </div>
          </div>
        </div>
      )
    },
    {
      title: 'Session Closure',
      component: (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
          <div className="relative p-6 bg-white rounded-xl shadow-inner group">
             <QrCode size={160} strokeWidth={1} className="text-slate-900" />
             <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900 rounded-full text-emerald-500 text-[8px] font-bold uppercase tracking-[0.2em] shadow-lg">
                HUB COLLECT
             </div>
          </div>

          <div className="space-y-1">
             <h4 className="text-xl font-bold text-[var(--text-primary)]">Verify ₹{handoverData.batteryLevel < 20 ? '450' : '0'} Receipt</h4>
             <p className="text-[10px] font-medium text-[var(--text-tertiary)] px-8 leading-relaxed uppercase tracking-wider">
                Confirm subscriber has authorized payment via app before completing return.
             </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
             <button className="flex items-center justify-center gap-2.5 p-3.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/20 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:border-emerald-500/30 transition-all font-bold text-[10px] uppercase tracking-widest shadow-sm">
                <Smartphone size={16} /> App Payment
             </button>
             <button className="flex items-center justify-center gap-2.5 p-3.5 rounded-lg border border-emerald-500/20 bg-emerald-600/5 text-emerald-600 hover:bg-emerald-600/10 transition-all font-bold text-[10px] uppercase tracking-widest shadow-sm">
                <CheckCircle2 size={16} /> Cash Confirmed
             </button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] gap-6">
      {/* Module Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-emerald-500 rounded-full" />
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Handover <span className="text-emerald-500">Terminal</span>
            </h1>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider ml-4 text-[var(--text-tertiary)]">
             Operational Asset Intake • Physical Inspection Workflow
          </p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0">
        
        {/* Left Column: Upcoming Returns */}
        <div className="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
           <div className="flex-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-sm flex flex-col overflow-hidden">
              <div className="px-6 py-5 border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/10">
                 <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">Expected Intake</h3>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mt-0.5 leading-none">Due for Return Today</p>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2">
                 {pendingReturns.map((subscriber) => {
                   const isSelected = selectedSubscriber?.id === subscriber.id;
                   const vehicle = vehicles.find(v => v.id === subscriber.vehicleId);
                   
                   return (
                     <motion.div
                       key={subscriber.id}
                       onClick={() => {
                         if (!isSelected) {
                            setSelectedSubscriber(subscriber);
                            resetHandover();
                         }
                       }}
                       animate={{ 
                         borderColor: isSelected ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-subtle)',
                         backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.05)' : 'transparent'
                       }}
                       className={`p-4 rounded-lg border cursor-pointer hover:bg-[var(--bg-tertiary)] transition-all duration-200 group relative`}
                     >
                        <div className="flex items-center gap-3">
                           <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all ${
                             isSelected ? 'bg-emerald-600/10 border-emerald-500/30 text-emerald-600' : 'bg-[var(--bg-tertiary)]/50 border-[var(--border-subtle)] text-slate-400'
                           }`}>
                              <User size={20} />
                           </div>
                           <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-0.5">
                                 <h4 className={`text-xs font-bold truncate transition-colors ${isSelected ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>{subscriber.name}</h4>
                                 <StatusBadge status={subscriber.status} className="scale-[0.7] origin-right" />
                              </div>
                              <div className="flex items-center gap-3">
                                 <div className="flex items-center gap-1.5 text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-tight">
                                    <Truck size={10} strokeWidth={3} />
                                    {vehicle?.plate}
                                 </div>
                                 <div className="w-1 h-1 rounded-full bg-[var(--border-subtle)]" />
                                 <div className="flex items-center gap-1.5 text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-tight">
                                    <Battery size={10} strokeWidth={3} className={vehicle?.battery < 20 ? 'text-red-500' : 'text-emerald-500'} />
                                    {vehicle?.battery}% SOC
                                 </div>
                              </div>
                           </div>
                           {isSelected && (
                             <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-sm transition-transform duration-300">
                                <ChevronRight size={14} strokeWidth={3} />
                             </div>
                           )}
                        </div>
                     </motion.div>
                   );
                 })}
              </div>
           </div>

           {selectedSubscriber && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-xl bg-emerald-600/5 border border-emerald-500/10 flex items-center gap-4 transition-all"
              >
                 <div className="w-12 h-12 rounded-lg bg-[var(--bg-secondary)] border border-emerald-500/20 flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                    <ArrowLeftRight size={24} />
                 </div>
                 <div className="space-y-0.5 min-w-0">
                    <h4 className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-wider leading-none">Intake Authorization</h4>
                    <p className="text-[9px] font-medium text-emerald-600/80 uppercase tracking-tight truncate">
                       Processing <span className="font-bold text-emerald-600">{selectedSubscriber.name}</span> • <span className="font-bold text-emerald-600">{selectedVehicle?.plate}</span>
                    </p>
                 </div>
              </motion.div>
           )}
        </div>

        {/* Right Column: Handover Workflow Form */}
        <div className="lg:col-span-3 flex flex-col h-full overflow-hidden">
           <AnimatePresence mode="wait">
             {selectedSubscriber ? (
               <motion.div 
                 key="form"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.2 }}
                 className="h-full"
               >
                 <StepForm 
                   steps={steps} 
                   activeStep={activeStep} 
                   onNext={handleNext}
                   onBack={() => setStep(activeStep - 1)}
                   isFinalStep={activeStep === 3}
                 />
               </motion.div>
             ) : (
               <motion.div 
                 key="empty"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="h-full rounded-xl border-2 border-dashed border-[var(--border-subtle)] flex flex-col items-center justify-center text-center gap-4 p-10 bg-[var(--bg-tertiary)]/10"
               >
                  <div className="w-16 h-16 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-slate-400 shadow-sm opacity-50">
                     <History size={32} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                     <h3 className="text-xl font-bold text-[var(--text-secondary)] uppercase">Terminal Idle</h3>
                     <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider max-w-[200px] mx-auto opacity-60">
                        Awaiting Return. Select a subscriber to initiate intake inspection.
                     </p>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
