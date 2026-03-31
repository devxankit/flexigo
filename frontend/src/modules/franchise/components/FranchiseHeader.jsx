import { Bell, Search, MapPin, User, ChevronDown, Sun, Moon } from 'lucide-react';
import { useFranchiseAuthStore } from '../store/franchiseAuthStore';
import { useFranchiseNotificationStore } from '../store/notificationStore';
import { useThemeStore } from "../store/themeStore";

export default function FranchiseHeader() {
  const { user } = useFranchiseAuthStore();
  const { unreadCount } = useFranchiseNotificationStore();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="h-14 w-full bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] flex items-center justify-between px-6 sticky top-0 z-40 transition-all duration-300 shadow-sm">
      {/* Search Bar - Professional Pill */}
      <div className="flex-1 max-w-md">
        <div className="flex items-center gap-2.5 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 group focus-within:ring-1 focus-within:ring-emerald-500/20 focus-within:border-emerald-500/40 transition-all duration-200">
          <Search size={16} className="text-[var(--text-tertiary)] group-focus-within:text-emerald-500" />
          <input 
            type="text" 
            placeholder="Search hub inventory, subscribers..." 
            className="bg-transparent border-none outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] w-full font-medium"
          />
        </div>
      </div>

      {/* Actions Section */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-[var(--text-secondary)] hover:text-emerald-500 hover:bg-emerald-500/5 rounded-lg transition-all active:scale-95"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notification Bell */}
        <button className="relative p-2 text-[var(--text-secondary)] hover:text-emerald-500 hover:bg-emerald-500/5 rounded-lg transition-all group">
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[var(--bg-secondary)]" />
          )}
        </button>

        {/* Profile Section */}
        <div className="flex items-center gap-3 pl-3 border-l border-[var(--border-subtle)] ml-1">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-bold text-[var(--text-primary)]">{user?.name || 'Hub Manager'}</span>
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">Sync Active</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 font-bold text-xs shadow-sm uppercase">
             {user?.name?.charAt(0) || 'M'}
          </div>
        </div>
      </div>
    </header>
  );
}
