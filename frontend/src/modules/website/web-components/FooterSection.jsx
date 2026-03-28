import React from 'react';
import { Twitter, Instagram, Linkedin, Zap, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const FooterSection = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2 group mb-6 inline-flex">
              <div className="w-10 h-10 rounded-xl bg-flexigo-primary flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-flexigo-accent opacity-0 group-hover:opacity-20 transition-opacity" />
                <Zap className="text-flexigo-accent w-6 h-6" />
              </div>
              <span className="text-3xl font-heading font-bold tracking-tight text-flexigo-primary">
                Flexigo
              </span>
            </a>
            <p className="text-slate-600 leading-relaxed mb-8 max-w-sm">
              Powering the future of micro-mobility and delivery logistics in India with 
              smart, zero-maintenance EVs.
            </p>
            <div className="flex gap-4">
               {[
                 { icon: <Twitter className="w-5 h-5" />, label: 'Twitter' },
                 { icon: <Instagram className="w-5 h-5" />, label: 'Instagram' },
                 { icon: <Linkedin className="w-5 h-5" />, label: 'LinkedIn' },
               ].map((social, i) => (
                 <a 
                   key={i} 
                   href="#" 
                   aria-label={social.label}
                   className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-flexigo-primary hover:border-flexigo-teal transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                 >
                   {social.icon}
                 </a>
               ))}
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="font-bold font-heading text-slate-900 mb-6">Product</h4>
            <ul className="space-y-4">
              {['Rider App', 'Franchise Panel', 'Admin Dashboard', 'Vehicle Catalog', 'Pricing Plans'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-slate-600 hover:text-flexigo-teal transition-colors text-sm font-medium">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 className="font-bold font-heading text-slate-900 mb-6">Company</h4>
            <ul className="space-y-4">
              {['About Us', 'Careers', 'Press & Media', 'Sustainability', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-slate-600 hover:text-flexigo-teal transition-colors text-sm font-medium">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="font-bold font-heading text-slate-900 mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                 <MapPin className="w-5 h-5 text-flexigo-teal shrink-0 mt-0.5" />
                 <span className="text-slate-600 text-sm leading-relaxed">
                   Flexigo HQ, Koramangala, Bengaluru, Karnataka 560034
                 </span>
              </li>
              <li className="flex items-center gap-3">
                 <Phone className="w-5 h-5 text-flexigo-teal shrink-0" />
                 <span className="text-slate-600 text-sm font-medium">
                   1800-123-FLEX
                 </span>
              </li>
              <li className="flex items-center gap-3">
                 <Mail className="w-5 h-5 text-flexigo-teal shrink-0" />
                 <span className="text-slate-600 text-sm font-medium">
                   support@flexigoemobility.com
                 </span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
           <p className="text-slate-500 text-sm">
             © {new Date().getFullYear()} Flexigo Mobility Pvt. Ltd. All rights reserved.
           </p>
           <div className="flex gap-6 text-sm">
             <a href="#" className="text-slate-500 hover:text-flexigo-primary transition-colors">Privacy Policy</a>
             <a href="#" className="text-slate-500 hover:text-flexigo-primary transition-colors">Terms of Service</a>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
