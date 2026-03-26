import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Info } from 'lucide-react';
import { cn } from '../../../lib/utils';

const SavingsCalculatorSection = () => {
  const [dailyEarnings, setDailyEarnings] = useState(1000);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [period, setPeriod] = useState({ label: 'Monthly', days: 26 });

  const periods = [
    { label: 'Monthly', days: 26 },
    { label: 'Weekly', days: 6 },
  ];

  // Constants (Mock values based on screenshot)
  const iceMaintenance = period.label === 'Weekly' ? 250 : 1000;
  const evMaintenance = period.label === 'Weekly' ? 60 : 250;
  const iceEMI = period.label === 'Weekly' ? 750 : 3000;
  const evEMI = period.label === 'Weekly' ? 1350 : 5400;
  
  const [iceMonthlyFuel, setIceMonthlyFuel] = useState(3714);
  const [savings, setSavings] = useState(3714);

  useEffect(() => {
    // Basic logic: Fuel cost per period
    // Monthly (26 days) approx 3714. Weekly (6 days) approx 3714 * (6/26) = 857
    const calculatedIceFuel = (dailyEarnings / 1000) * (period.label === 'Monthly' ? 3714 : 857);
    setIceMonthlyFuel(Math.round(calculatedIceFuel));
    
    // In the screenshot, savings focus on fuel or total gap. 
    // Let's use fuel savings to match the visual focus on ₹3,714
    setSavings(Math.round(calculatedIceFuel)); 
  }, [dailyEarnings, period]);

  const categories = [
    { name: 'Maintenance', ice: iceMaintenance, ev: evMaintenance },
    { name: 'EMI/Net Rental', ice: iceEMI, ev: evEMI },
    { name: 'Fuel', ice: iceMonthlyFuel, ev: 0 },
    { name: 'Initial Payment', ice: 20000, ev: 2100 },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left Side: Controls */}
          <div className="w-full lg:w-1/2">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold font-heading text-flexigo-primary leading-tight mb-4"
            >
              How Much Can You Save?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 mb-12 text-lg"
            >
              Slide and select to check your savings!
            </motion.p>

            {/* Dropdown Selector */}
            <div className="relative mb-10 z-50">
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full md:w-80 p-4 rounded-full border-2 border-[#10B981] flex items-center justify-between cursor-pointer bg-white group hover:shadow-lg hover:shadow-[#10B981]/10 transition-all duration-300"
              >
                <span className="font-bold text-[#334155]">{period.label} (Working Days - {period.days})</span>
                <ChevronDown className={cn("w-5 h-5 text-slate-400 group-hover:text-[#10B981] transition-transform duration-300", isDropdownOpen && "rotate-180")} />
              </div>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-full md:w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
                  >
                    {periods.map((p) => (
                      <div 
                        key={p.label}
                        onClick={() => {
                          setPeriod(p);
                          setIsDropdownOpen(false);
                        }}
                        className={cn(
                          "p-4 cursor-pointer transition-colors hover:bg-slate-50 font-bold",
                          period.label === p.label ? "text-[#10B981] bg-[#10B981]/5" : "text-[#334155]"
                        )}
                      >
                        {p.label} (Working Days - {p.days})
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Slider */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-medium text-slate-700">
                  Daily Earnings : <span className="text-flexigo-teal font-bold">₹{dailyEarnings}</span>
                </span>
              </div>
              <div className="relative h-2 w-full bg-slate-100 rounded-full">
                <div 
                  className="absolute top-0 left-0 h-full bg-flexigo-teal rounded-full"
                  style={{ width: `${(dailyEarnings / 2000) * 100}%` }}
                />
                <input 
                  type="range"
                  min="0"
                  max="2000"
                  step="10"
                  value={dailyEarnings}
                  onChange={(e) => setDailyEarnings(parseInt(e.target.value))}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer appearance-none"
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white border-4 border-flexigo-teal rounded-full shadow-md pointer-events-none"
                  style={{ left: `calc(${(dailyEarnings / 2000) * 100}% - 16px)` }}
                />
              </div>
              <div className="flex justify-between mt-4 text-sm font-medium text-slate-400">
                <span>₹0</span>
                <span>₹2,000</span>
              </div>
            </div>

            {/* Result Area */}
            <motion.div 
              key={savings}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-2"
            >
              <h4 className="text-lg font-bold text-slate-800">
                You Will Save Extra Savings With Flexigo Electric
              </h4>
              <div className="text-4xl md:text-5xl font-black text-flexigo-teal font-heading">
                ₹{savings.toLocaleString()} <span className="text-xl font-bold">Per {period.label === 'Monthly' ? 'Month' : 'Week'}</span>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Visual Graph */}
          <div className="lg:w-1/2 flex flex-col items-center">
            {/* Legend */}
            <div className="flex gap-4 mb-6 self-end">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Flexigo EV</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FACC15]" />
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">ICE Bikes</span>
              </div>
            </div>

            {/* Bars Grid */}
            <div className="w-full flex justify-around items-end gap-2 md:gap-4 min-h-[400px] pt-16 px-4">
              {categories.map((cat, i) => {
                const globalMax = Math.max(...categories.map(c => Math.max(c.ice, c.ev)));
                const getScale = (val) => (val / globalMax) * 100;
                
                // Determine which one is smaller and larger for stacking
                const smaller = cat.ice < cat.ev ? { val: cat.ice, type: 'ice' } : { val: cat.ev, type: 'ev' };
                const larger = cat.ice >= cat.ev ? { val: cat.ice, type: 'ice' } : { val: cat.ev, type: 'ev' };

                const renderBox = (item, isBottom) => {
                  const isIce = item.type === 'ice';
                  const height = getScale(item.val);
                  
                  return (
                    <motion.div 
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
                      style={{ height: `${Math.max(12, height)}%`, transformOrigin: isBottom ? 'bottom' : 'bottom' }}
                      className={cn(
                        "w-full max-w-[80px] flex flex-col items-center justify-center relative px-2 transition-all duration-500",
                        isIce 
                          ? "bg-gradient-to-b from-[#FDE047] to-[#FACC15] text-[#78350F]" 
                          : "bg-gradient-to-b from-[#34D399] to-[#10B981] text-white",
                        isBottom ? "rounded-b-[20px]" : "rounded-t-[20px]"
                      )}
                    >
                      <span className={cn(
                        "font-bold truncate",
                        !isBottom && height > 30 ? "absolute top-4 text-sm" : "text-[10px] md:text-sm"
                      )}>
                        ₹{item.val.toLocaleString()}
                      </span>
                      
                      {/* Huge Benefits Badge */}
                      {cat.name === 'Initial Payment' && isIce && !isBottom && (
                        <div className="absolute inset-x-0 bottom-4 flex items-center justify-center">
                           <div className="bg-[#10B981] h-32 w-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20">
                              <span className="text-[9px] font-black text-white uppercase [writing-mode:vertical-lr] whitespace-nowrap tracking-wider">Huge Benefits</span>
                           </div>
                        </div>
                      )}
                    </motion.div>
                  );
                };

                return (
                  <div key={i} className="flex flex-col items-center flex-1 h-full">
                    <div className="w-full flex flex-col items-center justify-end h-[320px] relative">
                      {/* Larger item on top */}
                      {renderBox(larger, false)}
                      {/* Smaller item on bottom (always rendered even if 0 for consistency?) */}
                      {renderBox(smaller, true)}
                    </div>
                    <div className="mt-8 text-sm md:text-lg font-bold text-[#334155] text-center leading-tight">
                      {cat.name}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Base Line */}
            <div className="w-full h-[1px] bg-slate-200 mt-4" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default SavingsCalculatorSection;
