import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Battery, ShieldCheck, Zap } from 'lucide-react';
import heroImage from '../../../assets/images/flexigo_v1.png';

const VehicleShowcaseSection = () => {

  return (
    <section className="py-24 lg:py-32 bg-flexigo-dark text-white relative overflow-hidden">
      {/* Dynamic light rays */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-flexigo-teal/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-flexigo-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-flexigo-accent font-medium uppercase tracking-[0.2em] text-xs mb-4 flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" /> The Machines
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black font-heading leading-[1.1] tracking-tighter text-[#334155]"
          >
            Engineering Meets <br />
            Pure Performance.
          </motion.h2>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-6xl mx-auto rounded-[3rem] bg-white/[0.02] border border-white/5 p-8 lg:p-16 backdrop-blur-2xl overflow-hidden shadow-2xl [transform:translateZ(0)]"
        >
          {/* Glass glare effect */}
          <div className="absolute top-0 left-[-100%] w-[50%] h-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-[30deg] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Visual Side */}
            <div className="lg:col-span-7 relative flex justify-center items-center py-12 lg:py-0">
              {/* Central glowing platform */}
              <div className="absolute bottom-10 w-[90%] h-14 bg-flexigo-teal/20 blur-[60px] rounded-[100%] animate-pulse" />
              
              {/* Scooter Showcase */}
              <div className="relative z-10 w-full flex flex-col items-center justify-center">
                <div className="relative group/scooter px-4">
                  {/* Digital Aura */}
                  <div className="absolute inset-0 bg-flexigo-teal/5 rounded-full blur-[100px] scale-150 opacity-0 group-hover/scooter:opacity-100 transition-opacity duration-1000" />
                  
                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                    className="relative"
                  >
                    <img 
                      src={heroImage} 
                      alt="Flexigo V1 Scooter" 
                      className="w-full h-auto max-w-[500px] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)] transition-transform duration-1000 group-hover/scooter:scale-[1.05]" 
                    />
                    
                    {/* High-Tech Scanline */}
                    <motion.div 
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-flexigo-teal/50 to-transparent z-20 pointer-events-none opacity-0 group-hover/scooter:opacity-100 transition-opacity"
                    />
                  </motion.div>
                  
                  {/* Floating Specs Tag */}
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    className="absolute top-[20%] -right-4 lg:-right-12 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-[0_10px_30px_rgba(16,185,129,0.4)] rotate-12 flex items-center gap-2 z-30"
                  >
                    <Zap className="w-3 h-3 fill-white" />
                    120km Ultra Range
                  </motion.div>
                </div>

                <div className="mt-16 text-center">
                  <div className="text-[10px] font-black tracking-[0.6em] text-slate-600 uppercase mb-3">Serial No. F-V1-2024</div>
                  <div className="text-5xl font-black tracking-tighter text-white italic bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
                    FLEXIGO V1
                  </div>
                </div>
              </div>
            </div>

            {/* Specs / Analytics Side */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-black/40 border border-white/5 rounded-3xl p-8 backdrop-blur-3xl shadow-xl hover:border-flexigo-teal/20 transition-colors duration-500 group/card"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover/card:scale-110 transition-transform duration-500">
                    <Battery className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-xl text-white tracking-tight">Power Systems</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Thermal Mgmt</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-xs mb-3 font-bold uppercase tracking-wider">
                       <span className="text-slate-400">Current Battery State</span>
                       <span className="text-emerald-400">98% Nominal</span>
                    </div>
                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-[2px]">
                       <motion.div 
                         initial={{ width: 0 }}
                         whileInView={{ width: '98%' }}
                         transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
                         className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-flexigo-accent rounded-full relative"
                       >
                         <motion.div 
                           animate={{ left: ['-100%', '100%'] }}
                           transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                           className="absolute inset-0 bg-white/30 skew-x-12 blur-sm"
                         />
                       </motion.div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    Li-ion phosphate cells (LFP) engineered for 3000+ cycles. Integrated IoT for real-time health telemetry.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="bg-black/40 border border-white/5 rounded-3xl p-6 backdrop-blur-3xl hover:border-flexigo-teal/20 transition-colors duration-500">
                   <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-2">Max Velocity</p>
                   <div className="flex items-baseline gap-1">
                     <span className="text-3xl font-black font-heading text-white">45</span>
                     <span className="text-xs font-bold text-slate-400 uppercase">km/h</span>
                   </div>
                </div>
                <div className="bg-black/40 border border-white/5 rounded-3xl p-6 backdrop-blur-3xl hover:border-flexigo-accent/20 transition-colors duration-500">
                   <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-2">Refuel Time</p>
                   <div className="flex items-baseline gap-1">
                     <span className="text-3xl font-black font-heading text-white">60</span>
                     <span className="text-xs font-bold text-slate-400 uppercase">sec</span>
                   </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-6 bg-flexigo-teal/5 border border-flexigo-teal/10 rounded-3xl p-6 backdrop-blur-sm group/ip"
              >
                 <div className="w-14 h-14 rounded-2xl bg-flexigo-teal/10 flex items-center justify-center text-flexigo-teal group-hover/ip:bg-flexigo-teal group-hover/ip:text-white transition-all duration-500">
                   <ShieldCheck className="w-7 h-7" />
                 </div>
                 <div>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Protection Class</p>
                    <span className="text-sm font-bold text-white tracking-tight">IP67 Water & Dust Resistance Rating</span>
                 </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Technical Specs Summary Bar */}
        <div className="mt-16 flex flex-wrap justify-center gap-12 lg:gap-24 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
           {['250kg Payload', 'Dual Hub Motor', 'ABS Braking', 'Live GPS Tracking'].map((spec) => (
             <div key={spec} className="flex items-center gap-3">
               <div className="w-1.5 h-1.5 rounded-full bg-flexigo-teal" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">{spec}</span>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default VehicleShowcaseSection;
