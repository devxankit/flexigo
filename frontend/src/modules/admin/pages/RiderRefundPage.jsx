import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, CreditCard, User, IndianRupee, FileText, CheckCircle2 } from 'lucide-react';
import api from '../../../lib/axios';
export default function RiderRefundPage() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [selectedRider, setSelectedRider] = useState(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchRiders();
  }, []);

  const fetchRiders = async () => {
    try {
      const res = await api.get('/admin/refund/riders-list');
      if (res.data?.success) {
        setRiders(res.data.riders);
      }
    } catch (error) {
      alert('Failed to load riders list');
    } finally {
      setLoading(false);
    }
  };

  const filteredRiders = riders.filter(r =>
    (r.name?.toLowerCase().includes(search.toLowerCase())) ||
    (r.phone?.includes(search))
  );

  const handlePayment = async () => {
    if (!selectedRider) return alert('Please select a rider first');
    if (!amount || isNaN(amount) || amount <= 0) return alert('Please enter a valid amount');

    try {
      setProcessing(true);
      // Create Razorpay order
      const orderRes = await api.post('/admin/refund/create-order', {
        amount: Number(amount),
        riderId: selectedRider.id
      });

      if (!orderRes.data?.success) {
        throw new Error('Failed to create order');
      }

      const options = {
        key: 'rzp_live_SxBAcIEtexyUUQ',
        amount: orderRes.data.order.amount,
        currency: "INR",
        name: "Flexigo Admin",
        description: `Refund to ${selectedRider.name || selectedRider.phone}`,
        order_id: orderRes.data.order.id,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyRes = await api.post('/admin/refund/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: Number(amount),
              riderId: selectedRider.id,
              description
            });

            if (verifyRes.data?.success) {
              alert('Refund processed successfully!');
              setSelectedRider(null);
              setAmount('');
              setDescription('');
              fetchRiders(); // Refresh list to get updated balance
            } else {
              alert('Payment verification failed');
            }
          } catch (error) {
            alert('Error verifying payment');
          }
        },
        prefill: {
          name: "Admin",
          email: "admin@flexigo.com",
          contact: "9999999999"
        },
        theme: {
          color: "#10b981"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      alert('Failed to initiate payment');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">Rider Refund Console</h1>
          <p className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest mt-1">Process manual refunds to rider wallets</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rider Selection Section */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none" />

          <h2 className="text-sm font-black text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-2 mb-6">
            <User size={16} className="text-emerald-500" /> Select Rider
          </h2>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" size={16} />
            <input
              type="text"
              placeholder="SEARCH BY NAME OR PHONE..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl pl-11 pr-4 py-3 text-[11px] font-bold text-[var(--text-primary)] placeholder-[var(--text-tertiary)] uppercase tracking-wider focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="space-y-3 h-[400px] overflow-y-auto pr-2 no-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
              </div>
            ) : filteredRiders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                <User size={32} className="mb-2" />
                <p className="text-xs font-bold uppercase tracking-wider">No riders found</p>
              </div>
            ) : (
              filteredRiders.map(rider => (
                <motion.button
                  key={rider.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedRider(rider)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between ${selectedRider?.id === rider.id
                    ? 'bg-emerald-500/10 border-emerald-500'
                    : 'bg-[var(--bg-tertiary)]/50 border-[var(--border-subtle)] hover:border-emerald-500/50'
                    }`}
                >
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">{rider.name || 'Unknown'}</h3>
                    <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mt-1">{rider.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Wallet</p>
                    <p className="text-xs font-black text-emerald-500 tracking-wider">₹{rider.walletBalance}</p>
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* Refund Form Section */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-3xl p-6 shadow-xl relative">
          <h2 className="text-sm font-black text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-2 mb-6">
            <CreditCard size={16} className="text-emerald-500" /> Payment Details
          </h2>

          {selectedRider ? (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Selected Target</p>
                  <p className="text-sm font-bold text-[var(--text-primary)] mt-1">{selectedRider.name || selectedRider.phone}</p>
                </div>
                <CheckCircle2 size={20} className="text-emerald-500" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Refund Amount (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="ENTER AMOUNT..."
                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl pl-11 pr-4 py-3 text-lg font-black text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Description (Optional)</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 text-[var(--text-tertiary)]" size={16} />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="REASON FOR REFUND..."
                    rows={4}
                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl pl-11 pr-4 py-3 text-[12px] font-bold text-[var(--text-primary)] placeholder-[var(--text-tertiary)] resize-none focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePayment}
                disabled={processing || !amount}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[12px] uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    PAY NOW <CreditCard size={16} />
                  </>
                )}
              </motion.button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-center border-2 border-dashed border-[var(--border-subtle)] rounded-2xl opacity-50">
              <User size={48} className="mb-4 text-[var(--text-tertiary)]" />
              <p className="text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">No Target Selected</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mt-2 max-w-[200px]">Select a rider from the list to proceed with refund</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
