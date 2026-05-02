import React, { memo } from 'react';
import type { Template } from '../types/canvas';

interface TemplateThumbProps {
  template: Template;
  onClick: () => void;
}

export const TemplateThumb = memo(({ template, onClick }: TemplateThumbProps) => {
  const thumbRatio = 1 / template.ratio.value;
  return (
    <div onClick={onClick} 
      className="group cursor-pointer rounded-2xl border border-zinc-200/70 dark:border-zinc-700/40 hover:border-zinc-900 dark:hover:border-zinc-500
        transition-all duration-300 bg-zinc-50/60 dark:bg-slate-700/30 overflow-hidden
        hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1 p-1">
      <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: `${thumbRatio}` }}>
        <div className="absolute inset-0" style={{ background: template.bg }}>
          {template.layers.slice(0, 4).map((l, i) => (
            <div key={i} className="absolute" style={{ 
              left: `${l.x}%`, top: `${l.y}%`, 
              transform: `translate(-50%, -50%) rotate(${l.rotate ?? 0}deg) scale(${Math.min(l.scale ?? 1, 0.38)})`,
              zIndex: i, opacity: l.opacity ?? 1
            }}>
              {l.type === 'text' ? (
                <span style={{ 
                  fontSize: `${Math.max((l.fontSize ?? 12) * 0.3, 4)}px`, 
                  color: l.color, 
                  fontWeight: l.fontWeight, 
                  fontFamily: l.fontFamily,
                  letterSpacing: `${(l.letterSpacing ?? 0) * 0.3}px`,
                  whiteSpace: 'nowrap'
                }}>{l.content}</span>
              ) : l.type === 'image' ? (
                <img src={l.content} alt="" className="max-w-[60px] max-h-[60px] object-cover rounded-sm" style={{ borderRadius: `${(l.borderRadius ?? 0) * 0.3}px`, filter: `grayscale(${(l as any).grayscale ?? 0}%)` }} />
              ) : null}
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2.5">
          <span className="text-[9px] font-bold text-white tracking-[0.15em] uppercase">{template.name}</span>
        </div>
      </div>
      <div className="flex items-center justify-between px-2 py-2">
        <span className="text-[9px] font-semibold text-zinc-500 dark:text-zinc-400 truncate tracking-tight">{template.name}</span>
        <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-600 tracking-widest px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-700/40 rounded-md">{template.ratio.name}</span>
      </div>
    </div>
  );
});
