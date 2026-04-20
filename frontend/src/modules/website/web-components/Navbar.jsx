import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import logo from '../../../assets/logo.png';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Plans', href: '#plans' },
    { name: 'Ecosystem', href: '#ecosystem' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300 pointer-events-auto',
        scrolled
          ? 'bg-white/70 backdrop-blur-xl border-b border-slate-100 shadow-sm py-2'
          : 'bg-transparent py-4'
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo & Branding */}
        <Link to="/" className="flex items-center group relative">
          <div className="relative w-20 h-20 md:w-28 md:h-28 flex items-center justify-center">
            <img 
              src={logo} 
              alt="FlexiGo Logo" 
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 z-10" 
            />
          </div>
          <span className={cn(
            "text-xl md:text-2xl font-heading font-black tracking-tighter transition-colors ml-1 whitespace-nowrap uppercase",
            scrolled ? "text-flexigo-primary" : "text-slate-900"
          )}>
            Flex<span className="text-flexigo-teal">igo E-Mobility</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={cn(
                "text-[13px] font-bold uppercase tracking-widest transition-all hover:scale-105",
                scrolled 
                  ? "text-slate-600 hover:text-flexigo-primary" 
                  : "text-slate-900 hover:text-flexigo-teal"
              )}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          <button 
            className={cn(
              "text-xs font-black uppercase tracking-widest transition-colors",
              scrolled 
                ? "text-slate-600 hover:text-flexigo-primary" 
                : "text-slate-900 hover:text-flexigo-teal"
            )}
          >
            Log In
          </button>
          <button className="bg-flexigo-primary hover:bg-flexigo-teal text-white px-7 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-flexigo-primary/20 transition-all duration-300 hover:-translate-y-0.5 active:scale-95">
            Get Started
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 text-flexigo-primary relative z-[60]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-0 left-0 w-full bg-white/95 backdrop-blur-xl shadow-2xl border-b border-slate-100 overflow-hidden md:hidden z-50 pt-24 pb-10"
          >
            <div className="flex flex-col gap-5 px-6">
              {navLinks.map((link, i) => (
                <motion.a
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={link.name}
                  href={link.href}
                  className="text-xl font-heading font-bold text-slate-800 hover:text-flexigo-teal transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </motion.a>
              ))}
              <div className="h-px bg-slate-100 my-1" />
              <div className="flex flex-col gap-3">
                <motion.button 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="w-full py-3.5 text-slate-700 font-bold border-2 border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Log In
                </motion.button>
                <motion.button 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="w-full py-3.5 bg-flexigo-primary text-white font-bold rounded-xl shadow-xl shadow-flexigo-primary/20"
                >
                  Get Started
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
