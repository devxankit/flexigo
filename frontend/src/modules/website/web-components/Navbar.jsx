import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ChevronUp, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import logo from '../../../assets/logo.png';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null); // 'product' | 'company' | 'contact' | null

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset accordion state when hamburger menu is closed
  useEffect(() => {
    if (!mobileMenuOpen) {
      setActiveAccordion(null);
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Plans', href: '#plans' },
    { name: 'Ecosystem', href: '#ecosystem' },
  ];

  const productLinks = [
    { name: 'Rider App', path: '/rider-app' },
    { name: 'Franchise Panel', path: '/franchise-panel' },
    { name: 'Admin Dashboard', path: '/admin-dashboard' },
    { name: 'Vehicle Catalog', path: '/vehicle-catalog' },
    { name: 'Pricing Plans', path: '/pricing-plans' },
  ];

  const companyLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Careers', path: '/careers' },
    { name: 'Press & Media', path: '/press' },
    { name: 'Sustainability', path: '/sustainability' },
    { name: 'Contact', path: '/contact' },
  ];

  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300 pointer-events-auto',
        scrolled
          ? 'bg-flexigo-bg/80 backdrop-blur-md shadow-sm pt-2 pb-5'
          : 'bg-transparent pt-3 pb-8'
      )}
    >
      <div className="w-full max-w-[1440px] mx-auto px-2 md:px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center group relative">
          <img 
            src={logo} 
            alt="FlexiGo Logo" 
            width="192"
            height="192"
            className="w-40 h-40 md:w-48 md:h-48 absolute top-1/2 -translate-y-[48%] md:-translate-y-[44%] -left-10 md:-left-6 object-contain transition-transform duration-300 group-hover:scale-105 z-10" 
          />
          <div className="w-20 md:w-32 h-10 md:h-12" />
          <span className={cn(
            "text-2xl font-heading font-black tracking-tighter transition-colors mt-0.5 whitespace-nowrap uppercase",
            scrolled ? "text-flexigo-primary" : "text-black"
          )}>
            Flex<span className="text-flexigo-teal">igo E-Mobility</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
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
            className="absolute top-0 left-0 w-full bg-white/95 backdrop-blur-xl shadow-2xl border-b border-slate-100 overflow-y-auto max-h-[85vh] md:hidden z-50 pt-24 pb-10"
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

              {/* Collapsible Footer Sections */}
              <div className="h-px bg-slate-100 my-1" />

              {/* Product Accordion */}
              <div className="flex flex-col">
                <button
                  onClick={() => toggleAccordion('product')}
                  className="flex items-center justify-between py-2 text-xl font-heading font-bold text-slate-800 hover:text-flexigo-teal transition-colors text-left"
                >
                  <span>Product</span>
                  {activeAccordion === 'product' ? (
                    <ChevronUp size={20} className="text-slate-500" />
                  ) : (
                    <ChevronDown size={20} className="text-slate-500" />
                  )}
                </button>
                <AnimatePresence>
                  {activeAccordion === 'product' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-4 flex flex-col gap-3 py-2 border-l border-slate-100 mt-1"
                    >
                      {productLinks.map((link) => (
                        <Link
                          key={link.name}
                          to={link.path}
                          className="text-base text-slate-600 hover:text-flexigo-teal transition-colors font-semibold py-1"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Company Accordion */}
              <div className="flex flex-col">
                <button
                  onClick={() => toggleAccordion('company')}
                  className="flex items-center justify-between py-2 text-xl font-heading font-bold text-slate-800 hover:text-flexigo-teal transition-colors text-left"
                >
                  <span>Company</span>
                  {activeAccordion === 'company' ? (
                    <ChevronUp size={20} className="text-slate-500" />
                  ) : (
                    <ChevronDown size={20} className="text-slate-500" />
                  )}
                </button>
                <AnimatePresence>
                  {activeAccordion === 'company' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-4 flex flex-col gap-3 py-2 border-l border-slate-100 mt-1"
                    >
                      {companyLinks.map((link) => (
                        <Link
                          key={link.name}
                          to={link.path}
                          className="text-base text-slate-600 hover:text-flexigo-teal transition-colors font-semibold py-1"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Contact Us Accordion */}
              <div className="flex flex-col">
                <button
                  onClick={() => toggleAccordion('contact')}
                  className="flex items-center justify-between py-2 text-xl font-heading font-bold text-slate-800 hover:text-flexigo-teal transition-colors text-left"
                >
                  <span>Contact Us</span>
                  {activeAccordion === 'contact' ? (
                    <ChevronUp size={20} className="text-slate-500" />
                  ) : (
                    <ChevronDown size={20} className="text-slate-500" />
                  )}
                </button>
                <AnimatePresence>
                  {activeAccordion === 'contact' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-4 flex flex-col gap-4 py-3 border-l border-slate-100 mt-1"
                    >
                      {/* Address */}
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-flexigo-teal shrink-0 mt-0.5" />
                        <span className="text-slate-600 text-sm leading-relaxed font-semibold">
                          ‘Krushna Avenue’, SR NO: 111/10/Baner Pune City Pune(CB) 411045.
                        </span>
                      </div>
                      
                      {/* Phone */}
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-flexigo-teal shrink-0" />
                        <a
                          href="tel:+919922968093"
                          className="text-slate-600 text-sm font-semibold hover:text-flexigo-teal transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          +91 99229 68093
                        </a>
                      </div>

                      {/* WhatsApp */}
                      <div className="flex items-center gap-3">
                        <MessageCircle className="w-5 h-5 text-flexigo-teal shrink-0" />
                        <a
                          href="https://wa.me/919922968093"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-600 text-sm font-semibold hover:text-flexigo-teal transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          +91 99229 68093 (WhatsApp)
                        </a>
                      </div>

                      {/* Email */}
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-flexigo-teal shrink-0" />
                        <a
                          href="mailto:support@flexigoemobility.com"
                          className="text-slate-600 text-sm font-semibold hover:text-flexigo-teal transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          support@flexigoemobility.com
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

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
