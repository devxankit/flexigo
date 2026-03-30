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
          ? 'bg-flexigo-bg/80 backdrop-blur-md shadow-sm py-2'
          : 'bg-transparent py-3'
      )}
    >
      <div className="w-full px-2 md:px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center group relative">
          <img 
            src={logo} 
            alt="FlexiGo Logo" 
            className="w-24 h-24 md:w-32 md:h-32 absolute top-1/2 -translate-y-1/2 left-0 object-contain transition-transform duration-300 group-hover:scale-105 z-10" 
          />
          <div className="w-20 md:w-26 h-10 md:h-12" />
          <span className={cn(
            "text-2xl font-heading font-bold tracking-tight transition-colors mt-0.5 whitespace-nowrap",
            scrolled ? "text-flexigo-primary" : "text-black"
          )}>
            FlexiGo
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors",
                scrolled 
                  ? "text-flexigo-teal hover:text-flexigo-primary" 
                  : "text-black hover:text-flexigo-teal"
              )}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            className={cn(
              "text-sm font-medium transition-colors",
              scrolled 
                ? "text-flexigo-teal hover:text-flexigo-primary" 
                : "text-black hover:text-flexigo-teal"
            )}
          >
            Log In
          </button>
          <button className="bg-flexigo-primary hover:bg-flexigo-teal text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-flexigo-teal/20 active:scale-95">
            Get Started
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-flexigo-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 py-4 px-6 md:hidden flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-lg font-medium text-slate-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="h-px bg-slate-100 my-2" />
            <div className="flex flex-col gap-3">
              <button className="w-full text-center py-3 text-slate-700 font-medium border border-slate-200 rounded-xl">
                Log In
              </button>
              <button className="w-full text-center py-3 bg-flexigo-primary text-white font-medium rounded-xl">
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
