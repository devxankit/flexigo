import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageWrapper } from '../components/PageWrapper';
import { GlassCard } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';
import { useWalletStore } from '../store/walletStore';
import { useThemeStore } from '../store/themeStore';

export default function WalletScreen() {
  const { balance, transactions, addMoney } = useWalletStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <PageWrapper className="flex flex-col p-6 pb-24">
       {/* Balance Card */}
       <GlassCard 
         className="p-8 mb-10 overflow-hidden relative"
         glow 
         glowColor="#39FF14"
       >
         <div className={`absolute top-0 right-0 w-32 h-32 bg-flexigo-teal/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-opacity duration-500 ${isDark ? 'opacity-100' : 'opacity-40'}`} />
         
         <div className="relative z-10 flex flex-col gap-4">
            <span className={`text-[10px] uppercase font-black transition-colors duration-500 tracking-[0.4em] ${
              isDark ? 'text-gray-500' : 'text-slate-500'
            }`}>
              Current Balance
            </span>
            <div className="flex items-baseline gap-2">
               <span className={`text-5xl font-heading font-black transition-colors duration-500 ${
                 isDark ? 'text-white' : 'text-slate-900'
               }`}>
                 ₹{balance.toLocaleString()}
               </span>
               <span className="text-flexigo-teal font-black uppercase text-[10px] tracking-widest shadow-sm">Active</span>
            </div>
            <div className="flex gap-4 mt-4">
               <button 
                 onClick={() => addMoney(500)}
                 className={`flex-1 py-3 rounded-xl font-black text-xs transition-all duration-500 border ${
                   isDark 
                    ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                    : 'bg-slate-100 border-slate-200 text-slate-900 hover:bg-slate-200 shadow-sm'
                 }`}
               >
                 + ₹500
               </button>
               <button 
                 onClick={() => addMoney(1000)}
                 className={`flex-1 py-3 rounded-xl font-black text-xs transition-all duration-500 border ${
                   isDark 
                    ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                    : 'bg-slate-100 border-slate-200 text-slate-900 hover:bg-slate-200 shadow-sm'
                 }`}
               >
                 + ₹1000
               </button>
            </div>
         </div>
       </GlassCard>

       <div className="flex-1 flex flex-col space-y-6">
          <div className="flex justify-between items-center">
             <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${
               isDark ? 'text-white' : 'text-slate-500'
             }`}>
               Recent Activity
             </h3>
             <button className={`text-[10px] font-black uppercase transition-colors duration-500 ${
               isDark ? 'text-gray-500' : 'text-slate-400'
             }`}>
               View All
             </button>
          </div>

          <div className="space-y-4">
             {transactions.map((tx) => (
               <div key={tx.id} className={`flex items-center gap-4 py-2 border-b transition-colors duration-500 last:border-0 ${
                 isDark ? 'border-white/05' : 'border-slate-100'
               }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-500 ${
                    tx.type === 'credit' 
                      ? 'bg-flexigo-teal/10' 
                      : isDark ? 'bg-white/5' : 'bg-slate-100'
                  }`}>
                    {tx.type === 'credit' ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="2.5" className="w-5 h-5">
                        <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke={isDark ? '#00D4FF' : '#0EA5E9'} strokeWidth="2.5" className="w-5 h-5">
                        <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                     <h4 className={`text-sm font-black transition-colors duration-500 ${
                       isDark ? 'text-white' : 'text-slate-900'
                     }`}>
                       {tx.label}
                     </h4>
                     <p className={`text-[10px] font-bold mt-0.5 transition-colors duration-500 ${
                       isDark ? 'text-gray-500' : 'text-slate-400'
                     }`}>
                       {tx.date} • {tx.time}
                     </p>
                  </div>
                  <div className={`text-right font-black transition-colors duration-500 ${
                    tx.type === 'credit' 
                      ? 'text-flexigo-teal' 
                      : isDark ? 'text-white/80' : 'text-slate-900'
                  }`}>
                    {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount}
                  </div>
               </div>
             ))}
          </div>
       </div>

       <div className="mt-10">
          <NeonButton variant="blue" size="xl" className="w-full">
             Top-up Wallet
          </NeonButton>
       </div>
    </PageWrapper>
  );
}
