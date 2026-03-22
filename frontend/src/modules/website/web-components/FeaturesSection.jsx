import React from 'react';
import { motion } from 'framer-motion';
import { BatteryCharging, MapPin, Calendar, PenTool, Wallet, Network } from 'lucide-react';

const features = [
  {
    icon: <BatteryCharging className="w-6 h-6 text-flexigo-teal" />,
    title: 'Smart Battery Tracking',
    description: 'Monitor range, cell health, and charging status in real-time from your smartphone.',
  },
  {
    icon: <MapPin className="w-6 h-6 text-flexigo-teal" />,
    title: 'Real-time GPS',
    description: 'Never lose track of your vehicle. Built-in GPS with anti-theft immobilization.',
  },
  {
    icon: <Calendar className="w-6 h-6 text-flexigo-teal" />,
    title: 'Flexible Plans',
    description: 'Subscribe for a day, week, or month. Change plans anytime without penalties.',
  },
  {
    icon: <PenTool className="w-6 h-6 text-flexigo-teal" />,
    title: 'Zero Maintenance',
    description: 'We cover all servicing, wear and tear, and insurance. Just ride and earn.',
  },
  {
    icon: <Wallet className="w-6 h-6 text-flexigo-teal" />,
    title: 'Wallet & Payments',
    description: 'Integrated digital wallet for seamless subscription renewals and top-ups.',
  },
  {
    icon: <Network className="w-6 h-6 text-flexigo-teal" />,
    title: 'Franchise Network',
    description: 'Growing nationwide network of hubs for quick battery swaps and servicing.',
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
      {/* Decorative top border gradient */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-flexigo-teal/30 to-transparent" />
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-flexigo-teal font-medium uppercase tracking-wider mb-4"
            >
              Why Choose Flexigo
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold font-heading text-flexigo-primary leading-tight"
            >
              Technology built for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-flexigo-teal to-flexigo-primary">performance & scale</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-slate-600 max-w-sm">
              Our hardware and software ecosystem is designed to maximize your earning potential while minimizing downtime.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-3xl p-8 border border-slate-100 hover:border-flexigo-teal/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-flexigo-teal/10 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-flexigo-teal/10 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold font-heading text-slate-800 mb-3 group-hover:text-flexigo-teal transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
