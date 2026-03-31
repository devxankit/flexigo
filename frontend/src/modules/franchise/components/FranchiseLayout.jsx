import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "../store/themeStore";
import FranchiseSidebar from "./FranchiseSidebar";
import FranchiseHeader from "./FranchiseHeader";

export default function FranchiseLayout() {
  const { theme } = useThemeStore();

  return (
    <div className={`flex h-screen w-full bg-[var(--bg-primary)] overflow-hidden transition-colors duration-300 ${theme}`}>
      {/* Sidebar with internal motion logic */}
      <FranchiseSidebar />

      {/* Main Hub Body */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <motion.div 
          initial={{ y: -56, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 40, delay: 0.1 }}
          className="z-10 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] h-14 shrink-0 flex items-center w-full"
        >
          <FranchiseHeader />
        </motion.div>
        
        <main className="flex-1 overflow-y-auto no-scrollbar p-6 bg-[var(--bg-primary)] w-full w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, scale: 0.995, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.995, y: -10 }}
              transition={{ 
                duration: 0.4, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="max-w-screen-2xl mx-auto h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        
        {/* Subtle Background Ambience Refinement */}
        <div className="absolute inset-x-0 bottom-0 h-[30vh] bg-gradient-to-t from-emerald-500/[0.02] to-transparent pointer-events-none -z-10" />
      </div>
    </div>
  );
}
