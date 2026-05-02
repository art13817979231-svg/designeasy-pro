import React, { memo } from 'react';

interface ChevronIconProps {
  open: boolean;
}

export const ChevronIcon = memo(({ open }: ChevronIconProps) => (
  <svg className={`w-3.5 h-3.5 text-slate-300 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/></svg>
));
