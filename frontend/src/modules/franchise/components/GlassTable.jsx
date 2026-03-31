import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

export default function GlassTable({ columns, data, onRowClick, emptyMessage = "No records found" }) {
  const tableRef = useRef(null);
  const rowsRef = useRef([]);

  useEffect(() => {
    // Removed GSAP entirely from this component. 
    // The previous implementation was using from() which led to non-deterministic final opacity states, 
    // causing the entire table wrapper to get 'stuck' at low opacity levels in React StrictMode 
    // or fast route transitions. Framer Motion manages row entrances cleanly.
  }, [data]);

  return (
    <div ref={tableRef} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl overflow-hidden shadow-sm backdrop-blur-3xl relative z-10">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[var(--bg-tertiary)]/40 border-b border-[var(--border-subtle)]">
              {columns.map((col, i) => (
                <th key={i} className="text-left px-6 py-4 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] whitespace-nowrap">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            <AnimatePresence mode="popLayout">
              {data.length > 0 ? (
                data.map((row, rowIndex) => (
                  <motion.tr
                    key={row.id || rowIndex}
                    ref={el => rowsRef.current[rowIndex] = el}
                    initial={{ opacity: 0, scale: 0.995, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, x: -10 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: Math.min(rowIndex * 0.04, 0.4), 
                      ease: [0.16, 1, 0.3, 1] 
                    }}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`group transition-all duration-300 relative ${onRowClick ? 'cursor-pointer hover:bg-emerald-500/[0.04]' : ''}`}
                  >
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} className="px-6 py-4 whitespace-nowrap transition-transform duration-500 group-hover:translate-x-1 relative z-10">
                        {col.render ? col.render(row) : (
                          <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-tight">
                            {row[col.accessor]}
                          </span>
                        )}
                      </td>
                    ))}
                    
                    {/* GSAP Sticky Hover Underline Effect */}
                    <motion.div 
                      layoutId="table-row-hover"
                      className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10"
                    />
                  </motion.tr>
                ))
              ) : (
                <motion.tr>
                  <td colSpan={columns.length} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                       <span className="text-sm font-bold uppercase tracking-widest">{emptyMessage}</span>
                       <div className="w-8 h-px bg-emerald-500" />
                    </div>
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
