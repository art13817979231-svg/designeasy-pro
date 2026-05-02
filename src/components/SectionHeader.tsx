import React, { memo, useState } from 'react';
import { ChevronIcon } from './ChevronIcon';

interface SectionHeaderProps {
  title: string;
  defaultOpen?: boolean;
  onToggle?: () => void;
  children: React.ReactNode;
}

export const SectionHeader = memo(({ title, defaultOpen = true, onToggle, children }: SectionHeaderProps) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="space-y-3.5">
      <button onClick={() => { setOpen(!open); onToggle?.(); }} 
        className="flex items-center justify-between w-full group py-1 border-b border-zinc-100/60 dark:border-zinc-800/40">
        <span className="text-[9px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">{title}</span>
        <ChevronIcon open={open} />
      </button>
      {open && <div className="pt-2.5">{children}</div>}
    </div>
  );
});
