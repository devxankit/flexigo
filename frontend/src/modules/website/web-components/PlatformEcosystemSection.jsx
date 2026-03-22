import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, LayoutDashboard, Building2, ArrowRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

const roles = [
  {
    id: 'rider',
    title: 'Rider App',
    icon: <Smartphone className="w-6 h-6" />,
    description: 'For delivery partners. Manage subscriptions, track vehicle health, process payments, and find nearest hubs.',
    image: '📱', // Placeholder for actual app screenshot
    color: 'from-blue-500 to-cyan-400',
    bgColor: 'bg-blue-50',
    solidColor: 'bg-blue-500'
  },
  {
    id: 'franchise',
    title: 'Franchise Panel',
    icon: <Building2 className="w-6 h-6" />,
    description: 'For hub owners. Track inventory, manage KYC approvals, handle battery swaps, and monitor revenue in real-time.',
    image: '🏪', // Placeholder
    color: 'from-flexigo-teal to-emerald-400',
    bgColor: 'bg-teal-50',
    solidColor: 'bg-flexigo-teal'
  },
  {
    id: 'admin',
    title: 'Admin Dashboard',
    icon: <LayoutDashboard className="w-6 h-6" />,
    description: 'For Flexigo operations team. God-view of all vehicles, fleet analytics, user management, and platform control.',
    image: '💻', // Placeholder
    color: 'from-purple-600 to-indigo-500',
    bgColor: 'bg-purple-50',
    solidColor: 'bg-purple-600'
  }
];

const PlatformEcosystemSection = () => {
  const [activeRole, setActiveRole] = useState(roles[0]);

  return (
    <section id="ecosystem" className="py-24 lg:py-32 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center space-x-2 bg-slate-100 rounded-full px-4 py-2 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-flexigo-teal animate-pulse" />
            <span className="text-sm font-medium text-slate-700 tracking-wide">A Complete Ecosystem</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold font-heading text-flexigo-primary leading-tight mb-6"
          >
            One Platform.<br className="hidden md:block" /> Three Powerful Experiences.
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto"
          >
            Seamlessly connecting riders, local franchises, and central operations 
            through purpose-built applications that work perfectly together.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
          {/* Navigation/Selector */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            {roles.map((role) => {
              const isActive = activeRole.id === role.id;
              
              return (
                <button
                  key={role.id}
                  onClick={() => setActiveRole(role)}
                  className={cn(
                    "text-left p-6 rounded-2xl transition-all duration-300 border-2 relative overflow-hidden group",
                    isActive 
                      ? `border-transparent shadow-lg bg-white` 
                      : "border-slate-100 hover:border-slate-200 bg-transparent"
                  )}
                >
                  {/* Active background gradient border effect */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeRoleBg"
                      className="absolute inset-0 border-2 border-flexigo-teal rounded-2xl pointer-events-none"
                    />
                  )}
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300",
                      isActive ? role.solidColor + " text-white shadow-md" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                    )}>
                      {role.icon}
                    </div>
                    <div>
                      <h3 className={cn(
                        "text-xl font-bold font-heading mb-1 transition-colors duration-300",
                        isActive ? "text-slate-900" : "text-slate-600"
                      )}>
                        {role.title}
                      </h3>
                      <div className={cn(
                        "text-sm font-medium flex items-center gap-1 transition-colors duration-300",
                        isActive ? "text-flexigo-teal" : "text-slate-400 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                      )}>
                        Explore <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Display Area */}
          <div className="w-full lg:w-2/3 h-[500px] lg:h-[600px] relative rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 p-8 lg:p-12 shadow-inner">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRole.id}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full h-full flex flex-col justify-between"
              >
                <div className="max-w-md">
                  <div className={cn(
                    "text-sm font-bold uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r mb-4",
                    activeRole.color
                  )}>
                    {activeRole.title}
                  </div>
                  <p className="text-2xl lg:text-3xl font-heading text-slate-800 leading-snug mb-8">
                    {activeRole.description}
                  </p>
                </div>
                
                {/* Visual Representation Area - Placeholders */}
                <div className="relative flex-1 mt-8">
                  {/* Decorative background glow */}
                  <div className={cn(
                    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] opacity-40 mix-blend-multiply",
                    activeRole.solidColor
                  )} />
                  
                  {/* Simulated App/Dashboard Container */}
                  <div className="absolute inset-x-0 bottom-0 top-10 bg-white rounded-t-3xl shadow-2xl border border-slate-200 overflow-hidden flex items-center justify-center p-8">
                    
                    {/* Simplified skeleton UI based on role */}
                    <div className="w-full max-w-sm flex flex-col gap-4 opacity-50">
                       <div className="flex justify-between items-center mb-4">
                         <div className="w-10 h-10 rounded-full bg-slate-200" />
                         <div className="w-24 h-4 rounded bg-slate-200" />
                       </div>
                       <div className="w-full h-32 rounded-2xl bg-slate-100" />
                       <div className="grid grid-cols-2 gap-4">
                         <div className="h-24 rounded-2xl bg-slate-100" />
                         <div className="h-24 rounded-2xl bg-slate-100" />
                       </div>
                       <div className="w-full h-12 rounded-xl bg-slate-200 mt-auto" />
                    </div>

                    {/* Emoji just for visual variation in placeholder */}
                    <div className="absolute text-8xl drop-shadow-2xl hover:scale-110 transition-transform cursor-default">
                      {activeRole.image}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformEcosystemSection;
