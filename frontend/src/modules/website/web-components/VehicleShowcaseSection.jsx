import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Battery, ShieldCheck, Zap } from 'lucide-react';

const VehicleShowcaseSection = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0.3, 0.6], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);

  return (
    <section className="py-24 lg:py-32 bg-flexigo-dark text-white relative overflow-hidden">
      {/* Dynamic light rays */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-flexigo-teal/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-flexigo-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-flexigo-accent font-medium uppercase tracking-wider mb-4 flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" /> Flexigo V1
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-tight"
          >
            Engineering meets <br className="hidden md:block" /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-flexigo-teal to-white">pure performance.</span>
          </motion.h2>
        </div>

        <motion.div 
          style={{ scale, opacity }}
          className="relative max-w-5xl mx-auto rounded-[2.5rem] bg-white/5 border border-white/10 p-8 lg:p-12 backdrop-blur-3xl overflow-hidden shadow-2xl"
        >
          {/* Glass glare effect */}
          <div className="absolute top-0 left-[-100%] w-[50%] h-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-[30deg] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Visual Side */}
            <div className="relative flex justify-center items-center h-[400px]">
              {/* Central glowing platform */}
              <div className="absolute bottom-10 w-[80%] h-12 bg-flexigo-teal opacity-30 blur-2xl rounded-[100%]" />
              
              {/* Scooter Placeholder */}
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="relative z-10 w-full max-w-[300px] aspect-[3/4] bg-white/10 rounded-3xl border border-white/20 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(15,118,110,0.3)] backdrop-blur-md"
              >
                <div className="text-8xl mb-6">🛵</div>
                <div className="text-2xl font-bold tracking-widest text-white/90">FLEXIGO V1</div>
                
                {/* Floating tags */}
                <div className="absolute top-6 -right-8 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg rotate-12">
                  120km Range
                </div>
              </motion.div>
            </div>

            {/* Specs / Analytics Side */}
            <div className="flex flex-col gap-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <div className="flex items-center gap-4 mb-4 text-emerald-400">
                  <Battery className="w-6 h-6" />
                  <h3 className="font-heading font-bold text-lg text-white">Advanced Battery Tech</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                       <span className="text-slate-400">Current Capacity</span>
                       <span className="font-bold text-white">98%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         whileInView={{ width: '98%' }}
                         transition={{ duration: 1.5, delay: 0.5 }}
                         className="h-full bg-gradient-to-r from-emerald-500 to-flexigo-accent"
                       />
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Li-ion phosphate cells with active thermal management. Swappable in under 60 seconds at any Flexigo Hub.
                  </p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                 <div className="flex justify-between items-center text-white mb-2">
                    <span className="font-medium">Top Speed</span>
                    <span className="font-heading font-bold text-2xl">45 km/h</span>
                 </div>
                 <div className="w-full h-[1px] bg-white/10 my-4" />
                 <div className="flex justify-between items-center text-white">
                    <span className="font-medium">Charge Time</span>
                    <span className="font-heading font-bold text-lg">0-80% in 2.5 hrs</span>
                 </div>
              </div>

              <div className="flex items-center gap-4 bg-flexigo-teal/10 border border-flexigo-teal/30 rounded-2xl p-4">
                 <div className="w-10 h-10 rounded-full bg-flexigo-teal/20 flex items-center justify-center text-flexigo-teal">
                   <ShieldCheck className="w-5 h-5" />
                 </div>
                 <span className="text-sm font-medium text-slate-300">IP67 Water & Dust Resistance Rating</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VehicleShowcaseSection;
