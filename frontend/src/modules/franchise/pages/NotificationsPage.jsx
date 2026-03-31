import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Clock,
  ArrowRight,
  Filter,
  X
} from 'lucide-react';
import { useFranchiseNotificationStore } from '../store/notificationStore';
import NotificationItem from '../components/NotificationItem';

const filterTabs = [
  { id: 'all', label: 'All Events' },
  { id: 'unread', label: 'Unread' },
  { id: 'danger', label: 'Critical' },
  { id: 'warning', label: 'Warnings' },
];

export default function NotificationsPage() {
  const { notifications, readNotification, markAllRead } = useFranchiseNotificationStore();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' ? !n.read : n.severity === filter);
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         n.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-emerald-500 rounded-full shadow-sm" />
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] uppercase">
              Alert <span className="text-emerald-500">Console</span>
            </h1>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider ml-4 text-[var(--text-tertiary)]">
             Operational Stream • Real-time Node Activity
          </p>
        </div>

        <button 
          onClick={markAllRead}
          className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 text-emerald-600 border border-emerald-500/10 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600/10 transition-all outline-none shadow-sm"
        >
          <CheckCircle2 size={14} /> Clear all as read
        </button>
      </div>

      {/* Metric Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="p-6 rounded-xl bg-rose-500/5 border border-rose-500/10 flex items-center justify-between shadow-sm hover:border-rose-500/20 transition-all">
            <div className="space-y-0.5">
               <p className="text-[10px] font-bold uppercase tracking-widest text-rose-600">Priority Alerts</p>
               <h4 className="text-3xl font-bold text-rose-600">02</h4>
            </div>
            <div className="w-10 h-10 rounded-lg bg-rose-600/10 flex items-center justify-center text-rose-600 shadow-sm">
               <AlertTriangle size={20} />
            </div>
         </div>
         <div className="p-6 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-between shadow-sm hover:border-blue-500/20 transition-all">
            <div className="space-y-0.5">
               <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Ops Events</p>
               <h4 className="text-3xl font-bold text-blue-600">14</h4>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-500 shadow-sm">
               <Zap size={20} />
            </div>
         </div>
         <div className="p-6 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between shadow-sm hover:border-emerald-500/20 transition-all">
            <div className="space-y-0.5">
               <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Active Unread</p>
               <h4 className="text-3xl font-bold text-emerald-600">{unreadCount}</h4>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-600/10 flex items-center justify-center text-emerald-600 shadow-sm">
               <Bell size={20} />
            </div>
         </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col md:flex-row items-center gap-4">
         {/* Filter Tabs - Professional Pill */}
         <div className="flex bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-1 rounded-lg shadow-sm">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                  filter === tab.id 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
         </div>

         {/* Search Filter */}
         <div className="relative flex-1 group w-full">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[var(--text-tertiary)] group-focus-within:text-emerald-500 transition-colors">
               <Search size={16} />
            </div>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search alert payload indexed..." 
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all font-medium placeholder:text-[var(--text-tertiary)] shadow-sm"
            />
         </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <NotificationItem 
                key={notif.id} 
                notification={notif} 
                onRead={readNotification}
              />
            ))
          ) : (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="py-20 text-center border-2 border-dashed border-[var(--border-subtle)] rounded-xl bg-[var(--bg-tertiary)]/10 flex flex-col items-center gap-4"
            >
               <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-tertiary)] opacity-30 shadow-sm">
                  <Bell size={24} strokeWidth={1.5} />
               </div>
               <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">Operational Stream Clear</p>
                  <p className="text-[10px] font-medium text-[var(--text-tertiary)] uppercase tracking-tighter opacity-60">No pending notifications in current node</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Audit Decor */}
      <div className="pt-10 flex flex-col items-center gap-4">
         <div className="w-px h-10 bg-gradient-to-b from-[var(--border-subtle)] to-transparent" />
         <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--text-tertiary)] opacity-40">Verified Secure Node Payload (HUB-CORE-01)</p>
      </div>
    </div>
  );
}
