import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, ArrowRight, Zap } from 'lucide-react';

import heroImage from '../../../assets/images/hero image.png';

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-white pt-20">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle neutral background effects */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-slate-50 blur-[120px]" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-flexigo-teal to-flexigo-accent">
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

        {/* Visual Content - Real EV Scooter Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, type: 'spring' }}
          className="flex-1 w-full relative"
        >
          <div className="relative w-full aspect-square max-w-[600px] mx-auto flex items-center justify-center">
            {/* Clean white/neutral highlights instead of greenish glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-100/50 to-white/50 rounded-full blur-[80px]" />
            
            <img 
              src={heroImage} 
              alt="Flexigo EV Scooter" 
              className="relative z-10 w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-transform duration-700 hover:scale-105"
            />
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
