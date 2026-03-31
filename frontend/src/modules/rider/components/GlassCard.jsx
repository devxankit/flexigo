import { useThemeStore } from '../store/themeStore';

export function GlassCard({ children, className = '', onClick, glow = false, glowColor = '#39FF14' }) {
  const { theme } = useThemeStore();

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border transition-all duration-500 ${
        theme === 'dark' 
          ? 'border-white/10 bg-white/5 backdrop-blur-xl' 
          : 'border-slate-200 bg-white shadow-xl shadow-slate-200/40'
      } ${className}`}
      style={{
        boxShadow: glow 
          ? `0 0 24px ${glowColor}22, 0 0 1px ${glowColor}44, inset 0 1px 0 rgba(255,255,255,0.08)` 
          : theme === 'dark' 
            ? 'inset 0 1px 0 rgba(255,255,255,0.06)' 
            : 'none'
      }}
    >
      {children}
    </div>
  );
}
