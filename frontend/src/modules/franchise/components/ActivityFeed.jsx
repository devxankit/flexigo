import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { 
  History, 
  Clock, 
  ArrowRight, 
  Zap, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  Users 
} from 'lucide-react';

export default function ActivityFeed() {
  const activities = [
    { id: 1, type: 'return', title: 'EV Return Processed', description: 'KA-01-EF-1234 returned — subscription end', time: '2M AGO', icon: Zap, color: 'text-emerald-600 bg-emerald-600/10' },
    { id: 2, type: 'subscriber', title: 'Subscriber Onboarded', description: 'Rahul assigned Weekly Pro plan at Hub-01', time: '15M AGO', icon: Users, color: 'text-violet-600 bg-violet-600/10' },
    { id: 3, type: 'alert', title: 'Battery Critical', description: 'KA-EF-5678 at 15% SOC — charge required', time: '1H AGO', icon: Zap, color: 'text-rose-600 bg-rose-600/10' },
    { id: 4, type: 'fleet', title: 'Maintenance Queued', description: 'KA-EF-9012 flagged for scheduled service', time: '3H AGO', icon: Truck, color: 'text-amber-600 bg-amber-600/10' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 border-l-2 border-emerald-500 pl-3">Node Stream</h3>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter ml-3">Real-time hub operations</p>
        </div>
        <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors">View All</button>
      </div>

      <div className="space-y-3 relative">
        {activities.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.id}
              className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-500/30 transition-all duration-300 group shadow-sm"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-transparent shadow-sm ${item.color} group-hover:scale-105 transition-transform duration-500`}>
                <Icon size={18} strokeWidth={2.5} />
              </div>
              <div className="flex-1 space-y-1">
                 <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-black text-slate-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{item.title}</h4>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                      <Clock size={10} strokeWidth={3} /> {item.time}
                    </span>
                 </div>
                 <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tight leading-none">
                   {item.description}
                 </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
