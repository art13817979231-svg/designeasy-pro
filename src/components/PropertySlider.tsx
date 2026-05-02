import React, { memo, useMemo } from 'react';

interface PropertySliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}

export const PropertySlider = memo(({ label, value, min, max, step = 1, onChange }: PropertySliderProps) => {
  const dynamicStep = useMemo(() => {
    if (step < 1) return step;
    const range = max - min;
    if (range > 200) return 5;
    if (range > 50) return 2;
    return 1;
  }, [step, min, max]);

  return (
    <div className="space-y-2.5">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{label}</span>
        <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 tracking-tight tabular-nums">
          {typeof value === 'number' ? (dynamicStep < 1 ? value.toFixed(2) : Math.round(value)) : (value ?? 0)}
        </span>
      </div>
      <div className="relative flex items-center">
        <div className="absolute inset-x-0 h-[3px] rounded-full bg-zinc-200/80 dark:bg-zinc-700/50" />
        <div className="absolute h-[3px] rounded-full bg-zinc-400 dark:bg-zinc-300 transition-all duration-75 pointer-events-none"
          style={{ width: `${((value ?? 0) - min) / (max - min) * 100}%`, maxWidth: '100%' }} />
        <input type="range" min={min} max={max} step={dynamicStep} value={value ?? 0}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="relative w-full h-5 appearance-none cursor-pointer bg-transparent z-10
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(0,0,0,0.15)] [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:active:cursor-grabbing
            [&::-webkit-slider-thumb]:border-[1.5px] [&::-webkit-slider-thumb]:border-zinc-300
            [&::-webkit-slider-thumb]:transition-shadow [&::-webkit-slider-thumb]:duration-150
            [&::-webkit-slider-thumb]:hover:shadow-[0_2px_6px_rgba(0,0,0,0.2)]" />
      </div>
    </div>
  );
});
