import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';

export function BottomSheet({ isOpen, onClose, children, title, snapHeight = '70vh', draggable = true }) {
  const sheetRef = useRef(null);
  const { theme } = useThemeStore();

  const isDark = theme === 'dark';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 backdrop-blur-sm z-40 transition-colors duration-500 ${
              isDark ? 'bg-black/60' : 'bg-slate-900/40'
            }`}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden shadow-2xl transition-all duration-500 border-t ${
              isDark 
                ? 'bg-[#14141E] border-white/10' 
                : 'bg-white border-slate-200'
            }`}
            style={{
              maxHeight: snapHeight,
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className={`w-10 h-1 rounded-full transition-colors duration-500 ${
                isDark ? 'bg-white/20' : 'bg-slate-300'
              }`} />
            </div>

            {title && (
              <div className={`px-6 pb-4 pt-2 border-b transition-colors duration-500 ${
                isDark ? 'border-white/05' : 'border-slate-100'
              }`}>
                <h3 className={`font-heading font-black text-lg transition-colors duration-500 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {title}
                </h3>
              </div>
            )}

            <div 
              className="overflow-y-auto px-1" 
              style={{ maxHeight: `calc(${snapHeight} - 60px)` }}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
