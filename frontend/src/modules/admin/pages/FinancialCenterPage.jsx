import React from 'react';
import { 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Activity, 
  Search, 
  Filter, 
  Download, 
  CreditCard, 
  ShieldCheck, 
  Signal,
  MoreVertical,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import AdminStatCard from '../components/AdminStatCard';
import { adminDataStore } from '../store/adminDataStore';

export default function FinancialCenterPage() {
  const { networkStats, revenueData } = adminDataStore;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
               <h1 className="text-2xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Financial <span className="text-emerald-500">Center</span>
               </h1>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-tertiary)] ml-4">
               Money Tracking • Franchise Payments
            </p>
         </div>
         
         <div className="flex items-center gap-3">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)] group-focus-within:text-emerald-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search Txn ID / Payout..." 
                 className="pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/30 outline-none transition-all w-64 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50"
               />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg active:scale-95">
               <Download size={14} /> Global Ledger Export
            </button>
         </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
         <AdminStatCard title="Total Earnings" value={`₹${(networkStats.grossRevenue / 100000).toFixed(1)}L`} icon={TrendingUp} color="emerald" subtitle="All-time revenue" />
         <AdminStatCard title="Paid Out" value="₹12.4L" icon={ArrowDownLeft} color="blue" subtitle="Sent to hubs" />
         <AdminStatCard title="Owed to Hubs" value="₹4.8L" icon={Activity} color="amber" subtitle="Pending payments" />
         <AdminStatCard title="Earnings / EV" value="₹12.4k" icon={Layers} color="emerald" subtitle="Profit per vehicle" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Trend Matrix */}
         <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
                     <TrendingUp size={20} />
                  </div>
                  <div>
                     <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">Revenue Growth</h3>
                     <p className="text-[10px] font-bold text-emerald-600 uppercase mt-1 tracking-widest italic animate-pulse">Updating live earnings...</p>
                  </div>
               </div>
               <div className="flex bg-[var(--bg-tertiary)] p-1 rounded-xl border border-[var(--border-subtle)]">
                  <button className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest bg-emerald-600 text-white rounded-lg shadow-lg">Daily</button>
                  <button className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-[var(--text-tertiary)] hover:text-emerald-500 transition-colors">MTD</button>
               </div>
            </div>

            <div className="h-72 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                     <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                           <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} opacity={0.5} />
                     <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: 'var(--text-tertiary)', fontSize: 10, fontWeight: 900 }} 
                       dy={15}
                     />
                     <YAxis hide />
                     <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        itemStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#10b981' }}
                        labelStyle={{ fontSize: '11px', fontWeight: 900, marginBottom: '4px', textTransform: 'uppercase' }}
                     />
                     <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Distribution Summary */}
         <div className="p-8 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2rem] flex flex-col justify-between shadow-sm border-t-4 border-t-emerald-600">
            <div>
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                        <ArrowDownLeft size={20} />
                     </div>
                     <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">Allocation</h3>
                  </div>
               </div>
               
               <div className="space-y-8">
                  {[
                    { label: 'Operational Costs', yield: '₹4.2L', val: 30, color: 'emerald' },
                    { label: 'Merchant Payouts', yield: '₹12.8L', val: 55, color: 'blue' },
                    { label: 'Network Reserves', yield: '₹4.1L', val: 15, color: 'amber' }
                  ].map((item) => (
                     <div key={item.label} className="space-y-2">
                        <div className="flex justify-between items-end">
                           <span className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">{item.label}</span>
                           <span className="text-sm font-black text-[var(--text-primary)] tracking-tight">{item.yield}</span>
                        </div>
                        <div className="w-full h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                           <div className={`h-full ${item.color === 'emerald' ? 'bg-emerald-500' : item.color === 'blue' ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${item.val}%` }} />
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <button className="w-full mt-10 py-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-primary)] hover:text-emerald-500 hover:bg-emerald-600/5 transition-all text-center flex items-center justify-center gap-2">
               Configure Auto-Payout Alpha-4 <ArrowRight size={14} />
            </button>
         </div>
      </div>

      {/* Transaction Log */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2rem] overflow-hidden shadow-sm">
         <div className="p-8 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
                  <CreditCard size={20} />
               </div>
               <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">Transaction History</h3>
            </div>
            <button className="p-2.5 text-[var(--text-tertiary)] hover:text-emerald-500 hover:bg-emerald-600/5 rounded-xl transition-all">
               <Filter size={18} />
            </button>
         </div>
         
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/30">
                     {['Txn identity', 'Settlement Node', 'Quantum', 'Protocol Type', 'Status', 'Timestamp'].map((header) => (
                        <th key={header} className="py-4 text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-tertiary)] px-8 whitespace-nowrap">{header}</th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-[var(--border-subtle)]">
                  {[
                    { id: 'TXN-9021', hub: 'MAH_IND_01', val: '₹12,400', method: 'UPI_COLLECT', status: 'success', date: '2m ago' },
                    { id: 'TXN-4412', hub: 'MAH_KOR_02', val: '₹1,24,000', method: 'NET_BANK', status: 'pending', date: '15m ago' },
                    { id: 'TXN-7721', hub: 'MAH_HSR_03', val: '₹8,350', method: 'RAZOR_PAY', status: 'success', date: '1h ago' },
                    { id: 'TXN-1029', hub: 'MAH_WHI_04', val: '₹4,200', method: 'CORP_WALLET', status: 'failed', date: '2h ago' }
                  ].map((txn) => (
                     <tr key={txn.id} className="group/row hover:bg-[var(--bg-tertiary)]/50 transition-colors cursor-pointer">
                        <td className="py-5 px-8">
                           <div className="flex flex-col gap-0.5">
                              <span className="text-xs font-black text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{txn.id}</span>
                              <span className="text-[8px] font-bold text-[var(--text-tertiary)] tracking-widest leading-none mt-1 group-hover:text-emerald-950/20 transition-colors italic">Registry Locked</span>
                           </div>
                        </td>
                        <td className="py-5 px-8 text-[11px] font-black text-[var(--text-primary)] uppercase tracking-tight italic">{txn.hub}</td>
                        <td className="py-5 px-8 text-xs font-black text-emerald-500 tracking-tight">{txn.val}</td>
                        <td className="py-5 px-8 text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest leading-none">{txn.method}</td>
                        <td className="py-5 px-8">
                           <div className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              txn.status === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                              txn.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                              'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                           }`}>
                              {txn.status}
                           </div>
                        </td>
                        <td className="py-5 px-8 text-[9px] font-black text-[var(--text-tertiary)] uppercase italic tracking-widest">{txn.date}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
