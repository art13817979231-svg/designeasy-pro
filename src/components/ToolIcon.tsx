import React, { memo } from 'react';

interface ToolIconProps {
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  label?: string;
}

export const ToolIcon = memo(({ icon, active, onClick, label }: ToolIconProps) => (
  <button 
    onClick={onClick} 
    className={`w-10 h-10 group relative rounded-2xl transition-all duration-200 flex items-center justify-center
      ${active 
        ? 'bg-slate-600 dark:bg-white text-white dark:text-slate-700 shadow-lg shadow-black/10 scale-[1.05]' 
        : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10 hover:shadow-lg hover:shadow-black/5'
      }`}
  >
    {icon}
    {label && <div className="absolute left-[52px] px-3 py-1.5 bg-black/90 dark:bg-white/90 text-[10px] font-semibold text-white dark:text-slate-700 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-150 z-[500] whitespace-nowrap pointer-events-none border border-white/10">{label}</div>}
  </button>
));
