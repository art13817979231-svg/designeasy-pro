import React, { memo } from 'react';
import { COLOR_PRESETS } from '../config/colors';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  recentColors: string[];
  onPresetClick: (v: string) => void;
}

export const ColorPicker = memo(({ label, value, onChange, recentColors, onPresetClick }: ColorPickerProps) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <span className="text-[9px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{label}</span>
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="w-8 h-8 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 shadow-inner overflow-hidden">
            <input type="color" value={value ?? '#000000'} onChange={(e) => onChange(e.target.value)} 
              className="w-[200%] h-[200%] -m-[25%] cursor-pointer border-0 p-0" />
          </div>
        </div>
      </div>
    </div>
    {recentColors && recentColors.length > 0 && (
      <div className="space-y-2">
        <span className="text-[8px] font-medium text-zinc-400 uppercase tracking-wider">最近</span>
        <div className="flex flex-wrap gap-1.5">
          {recentColors.slice(0, 12).map((c, i) => (
            <button key={i} onClick={() => onPresetClick(c)} 
              className="w-6 h-6 rounded-lg hover:scale-110 transition-transform duration-150 shadow-sm border border-black/5 hover:shadow-md" 
              style={{ background: c }} />
          ))}
        </div>
      </div>
    )}
    <div className="space-y-2">
      <span className="text-[8px] font-medium text-zinc-400 uppercase tracking-wider">预设</span>
      <div className="flex flex-wrap gap-1.5">
        {COLOR_PRESETS.map((c, i) => (
          <button key={i} onClick={() => onPresetClick(c)} 
            className={`w-6 h-6 rounded-lg hover:scale-110 transition-transform duration-150 shadow-sm ${value === c ? 'ring-2 ring-offset-1 ring-zinc-900 dark:ring-white scale-110' : 'border border-black/5 hover:shadow-md'}`} 
            style={{ background: c }} />
        ))}
      </div>
    </div>
  </div>
));
