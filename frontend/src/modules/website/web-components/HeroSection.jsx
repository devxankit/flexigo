import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, ArrowRight, Zap } from 'lucide-react';

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-flexigo-bg pt-20">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-flexigo-accent/10 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-flexigo-teal/10 blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
        {/* Text Content */}
        <motion.div 
          style={{ y: y1, opacity }}
          className="flex-1 text-center lg:text-left pt-12 lg:pt-0"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-flexigo-accent animate-pulse"></span>
            <span className="text-sm font-medium text-slate-600">Smart EV Subscriptions Now Live</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-flexigo-primary leading-[1.1] mb-6 tracking-tight"
          >
            Powering the Future of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-flexigo-teal to-[#10B981]">
              Delivery Mobility
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 font-body leading-relaxed"
          >
            Subscribe, ride, and earn with Flexigo's high-performance electric vehicles. 
            Zero maintenance, unlimited possibilities. Join the eco-friendly delivery revolution today.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <button className="w-full sm:w-auto px-8 py-4 bg-flexigo-primary hover:bg-flexigo-teal text-white rounded-full font-medium text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-flexigo-teal/20 flex items-center justify-center gap-2 group">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-flexigo-primary border border-slate-200 rounded-full font-medium text-lg transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2 group">
              Explore Plans
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>

        {/* Visual Content - Placeholder for EV Scooter */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2, type: 'spring' }}
          className="flex-1 w-full relative"
        >
          <div className="relative w-full aspect-square max-w-[600px] mx-auto">
            {/* Soft backdrop glow for vehicle */}
            <div className="absolute inset-0 bg-gradient-to-tr from-flexigo-teal/20 to-flexigo-accent/20 rounded-full blur-[80px]" />
            
            {/* The actual vehicle placeholder (user can replace this image) */}
            <div className="relative w-full h-full p-8 flex items-center justify-center">
               {/* 
                 A modern glassmorphism stand-in for the scooter image, 
                 showcasing the "Premium EV startup vibe"
               */}
               <div className="w-[80%] h-[80%] rounded-[2rem] bg-white/40 backdrop-blur-2xl border border-white/60 shadow-2xl flex flex-col items-center justify-center p-8 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
                  
                  {/* Mock UI Overlay floating around */}
                  <motion.div 
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="absolute top-10 right-[-20px] bg-white rounded-xl shadow-xl p-4 flex items-center gap-3 border border-slate-100"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Zap className="text-green-600 w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Battery Level</div>
                      <div className="text-sm font-bold text-slate-800">98% Range</div>
                    </div>
                  </motion.div>

                  <div className="text-center z-10">
                    <div className="text-6xl mb-4">🛵</div>
                    <div className="text-2xl font-bold text-slate-800 font-heading">Flexigo V1</div>
                    <div className="text-sm text-slate-500 mt-2">Replace with 3D/PNG EV Scooter</div>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 opacity-50"
      >
        <span className="text-xs font-medium uppercase tracking-widest text-slate-500">Scroll</span>
        <div className="w-[1px] h-8 bg-slate-400" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
