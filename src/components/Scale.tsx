import React, { memo } from 'react';

interface ScaleProps {
  size: number;
  className?: string;
}

export const Scale = memo(({ size, className }: ScaleProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m21 21-4.35-4.35M11 6v10M6 11h10"/></svg>
));
