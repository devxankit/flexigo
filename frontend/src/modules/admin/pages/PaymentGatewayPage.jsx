import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MoreVertical, 
  Search, 
  ArrowUpRight,
  Wallet,
  Building2,
  Lock,
  RefreshCcw,
  Zap,
  ShieldCheck,
  Activity,
  Check,
  X
} from 'lucide-react';
import AdminStatCard from '../components/AdminStatCard';
import OpsFilter from '../components/OpsFilter';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminDataStore } from '../store/adminDataStore';
import api from '../../../lib/axios';

const Gateways = [
  { name: 'RazorPay', status: 'active', speed: '99ms', type: 'Primary' },
  { name: 'PayU India', status: 'active', speed: '142ms', type: 'Secondary' },
  { name: 'Stripe', status: 'inactive', speed: '---', type: 'Global' },
];

export default function PaymentGatewayPage() {
  const { financeTransactions, financeStats, fetchFinanceData } = useAdminDataStore();
  const [activeFilters, setActiveFilters] = React.useState({ range: 'Last 7 Days' });
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loadingAction, setLoadingAction] = useState(null);
  const [dueAlerts, setDueAlerts] = useState([]);

  const fetchPendingPayments = async () => {
    try {
      const res = await api.get('/admin/payments/pending-qr');
      if (res.data.success) {
        setPendingPayments(res.data.payments);
      }
    } catch (err) {
      console.error("Failed to fetch pending payments:", err);
    }
  };

  const fetchDueAlerts = async () => {
    try {
      const res = await api.get('/admin/payments/due-alerts');
      if (res.data.success) {
        setDueAlerts(res.data.riders);
      }
    } catch (err) {
      console.error("Failed to fetch due alerts:", err);
    }
  };

  React.useEffect(() => {
    fetchFinanceData(activeFilters);
    fetchPendingPayments();
    fetchDueAlerts();
    const interval = setInterval(() => {
      fetchPendingPayments();
      fetchDueAlerts();
      fetchFinanceData(activeFilters);
    }, 10000);
    return () => clearInterval(interval);
  }, [activeFilters]);

  const handleApprove = async (transactionId) => {
    setLoadingAction(transactionId);
    try {
      const res = await api.post('/admin/payments/approve-qr', { transactionId });
      if (res.data.success) {
        setPendingPayments(prev => prev.filter(p => p._id !== transactionId));
        fetchFinanceData(activeFilters);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReject = async (transactionId) => {
    setLoadingAction(transactionId);
    try {
      const res = await api.post('/admin/payments/reject-qr', { transactionId });
      if (res.data.success) {
        setPendingPayments(prev => prev.filter(p => p._id !== transactionId));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject');
    } finally {
      setLoadingAction(null);
    }
  };

  React.useEffect(() => {
    fetchFinanceData(activeFilters);
  }, []);

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    fetchFinanceData(newFilters);
    console.log('Payment Gateway Sync:', newFilters);
  };

  const filteredTransactions = financeTransactions.filter(txn => 
    (txn.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (txn.user || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="space-y-0.5">
            <div className="flex items-center gap-2">
               <div className="w-1 h-5 bg-emerald-600 rounded-full" />
               <h1 className="text-xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Payment <span className="text-emerald-500">Gateway</span>
               </h1>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] ml-3">
               Transaction Orchestrator & Settlement Control
            </p>
         </div>
         
         <div className="flex items-center gap-2">
            <OpsFilter onFilterChange={handleFilterChange} />
         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <AdminStatCard title="Daily Volume" value={financeStats.dailyVolume} icon={Zap} color="emerald" subtitle="Gross Transacted" />
         <AdminStatCard title="Success Rate" value={financeStats.successRate} icon={CheckCircle2} color="blue" subtitle="Fleet Conversions" />
         <AdminStatCard title="Pending" value={financeStats.pending} icon={Clock} color="amber" subtitle="Awaiting Bank" />
      </div>

      {/* Pending QR Payments — Admin Approval Required */}
      {pendingPayments.length > 0 && (
        <div className="bg-[var(--bg-secondary)] border-2 border-amber-500/20 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-3 border-b border-amber-500/10 flex items-center justify-between bg-amber-500/5">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-amber-500" />
              <h3 className="text-[11px] font-black text-amber-500 uppercase tracking-wider leading-none italic">
                Pending QR Payments ({pendingPayments.length})
              </h3>
            </div>
            <span className="text-[8px] font-black text-amber-500/60 uppercase tracking-widest animate-pulse">Awaiting Verification</span>
          </div>
          <div className="divide-y divide-[var(--border-subtle)]">
            {pendingPayments.map((payment) => (
              <div key={payment._id} className="px-6 py-4 flex items-center justify-between hover:bg-[var(--bg-tertiary)]/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Wallet size={18} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tight">
                      {payment.riderId?.name || 'Rider'}
                    </p>
                    <p className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">
                      {payment.riderId?.phone || 'N/A'} • {payment.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-black text-[var(--text-primary)]">₹{payment.amount}</span>
                  <span className="text-[8px] font-bold text-[var(--text-tertiary)] uppercase">
                    {new Date(payment.createdAt).toLocaleDateString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(payment._id)}
                      disabled={loadingAction === payment._id}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1"
                    >
                      <Check size={12} /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(payment._id)}
                      disabled={loadingAction === payment._id}
                      className="px-3 py-1.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1"
                    >
                      <X size={12} /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Payment Due Alerts */}
      {dueAlerts.length > 0 && (
        <div className="bg-[var(--bg-secondary)] border-2 border-rose-500/20 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-3 border-b border-rose-500/10 flex items-center justify-between bg-rose-500/5">
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="text-rose-500" />
              <h3 className="text-[11px] font-black text-rose-500 uppercase tracking-wider leading-none italic">
                Weekly Payment Due ({dueAlerts.length})
              </h3>
            </div>
            <span className="text-[8px] font-black text-rose-500/60 uppercase tracking-widest">Subscription Expired</span>
          </div>
          <div className="divide-y divide-[var(--border-subtle)]">
            {dueAlerts.map((rider) => (
              <div key={rider._id} className="px-6 py-4 flex items-center justify-between hover:bg-[var(--bg-tertiary)]/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                    <AlertCircle size={18} className="text-rose-500" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tight">
                      {rider.name || 'Rider'}
                    </p>
                    <p className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">
                      {rider.phone} • {rider.planName} • Expired: {new Date(rider.expiredAt).toLocaleDateString([], { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-rose-500">₹{rider.amount}</span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-rose-500 bg-rose-500/10 px-2 py-1 rounded">DUE</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction Ledger */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
         <div className="px-6 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-tertiary)]/10">
            <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-wider leading-none italic">Transaction Payload Registry</h3>
            <div className="relative group">
               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-tertiary)] group-focus-within:text-emerald-500 transition-colors" />
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search Ref ID..." 
                 className="pl-8 pr-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[9px] font-black tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all w-32 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50 italic"
               />
            </div>
         </div>
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full">
               <thead>
                     <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/5">
                     {['Ref Identity', 'Initiator', 'Method', 'Amount', 'Status', 'Sync'].map((header) => (
                        <th key={header} className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-secondary)] whitespace-nowrap">{header}</th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-[var(--border-subtle)]">
                  {filteredTransactions.map((txn) => (
                     <tr key={txn.id} className="group/row hover:bg-[var(--bg-tertiary)]/10 transition-colors text-sm">
                        <td className="py-2 px-4 font-medium  text-[var(--text-tertiary)]">{txn.id}</td>
                        <td className="py-2 px-4">
                           <span className="font-medium text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors">{txn.user}</span>
                        </td>
                        <td className="py-2 px-4">
                           <div className="flex items-center gap-1.5">
                              <CreditCard size={10} className="text-[var(--text-tertiary)]/50" />
                              <span className="font-medium text-[var(--text-tertiary)]">{txn.method}</span>
                           </div>
                        </td>
                        <td className="py-2 px-4 font-medium text-[var(--text-primary)]">{txn.val}</td>
                        <td className="py-2 px-4">
                           <div className={`inline-flex px-1.5 py-0.5 rounded  font-medium   border  ${
                              txn.status === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' : 
                              txn.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/10' : 
                              'bg-rose-500/10 text-rose-500 border-rose-500/10'
                           }`}>
                              {txn.status}
                           </div>
                        </td>
                        <td className="py-2 px-4  font-medium text-[var(--text-tertiary)]     whitespace-nowrap">{new Date(txn.date).toLocaleTimeString()}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
