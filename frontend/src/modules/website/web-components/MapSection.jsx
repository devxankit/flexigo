import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const activeCities = [
  { name: 'Bengaluru', top: '75%', left: '42%' },
  { name: 'New Delhi', top: '35%', left: '46%' },
  { name: 'Mumbai', top: '65%', left: '28%' },
  { name: 'Hyderabad', top: '70%', left: '45%' },
  { name: 'Pune', top: '66%', left: '32%' },
  { name: 'Chennai', top: '80%', left: '48%' },
  { name: 'Ahmedabad', top: '55%', left: '25%' },
];

const MapSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Content */}
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-flexigo-teal font-medium uppercase tracking-wider mb-4"
            >
              Our Coverage
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold font-heading text-flexigo-primary leading-tight mb-6"
            >
              Expanding rapidly <br className="hidden md:block" /> across India
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-slate-600 leading-relaxed mb-10"
            >
              From bustling metros to emerging tier-2 cities, Flexigo is building the 
              densest EV infrastructure network in the country. Wherever you ride, 
              we've got your back.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-2 gap-6"
            >
              <div>
                 <div className="text-3xl font-bold font-heading text-flexigo-primary mb-1">45+</div>
                 <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Live Cities</div>
              </div>
              <div>
                 <div className="text-3xl font-bold font-heading text-flexigo-primary mb-1">1,200+</div>
                 <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Swap Hubs</div>
              </div>
            </motion.div>
          </div>

          {/* Map Visualization */}
          <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square bg-slate-50 rounded-[3rem] border border-slate-100 flex items-center justify-center p-8 overflow-hidden">
             
             {/* Map Placeholder Outline (Stylized) */}
             <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] opacity-20 text-slate-800 drop-shadow-sm">
                <path fill="currentColor" d="M30,20 Q40,10 50,15 T70,30 T80,50 T75,70 T60,90 T40,95 T20,70 T15,50 T20,30 Z" />
             </svg>
             
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,white_100%)] opacity-60" />

             {/* City Markers */}
             {activeCities.map((city, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.4 + (index * 0.1),
                    type: "spring"
                  }}
                  className="absolute flex items-center justify-center group cursor-pointer"
                  style={{ top: city.top, left: city.left }}
                >
                  <div className="relative">
                     <div className="absolute inset-0 rounded-full bg-flexigo-accent animate-ping opacity-75" />
                     <div className="relative w-4 h-4 bg-flexigo-teal border-2 border-white rounded-full z-10 shadow-md group-hover:scale-125 transition-transform" />
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl pointer-events-none z-20">
                    {city.name}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                  </div>
                </motion.div>
             ))}

             <div className="absolute bottom-8 right-8 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-flexigo-teal animate-pulse" />
                <span className="text-xs font-semibold text-slate-700">Active Hubs</span>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MapSection;
