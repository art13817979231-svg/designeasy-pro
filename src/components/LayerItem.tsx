import React, { memo } from 'react';
import type { Layer } from '../types/canvas';

interface LayerItemProps {
  layer: Layer;
  isSelected: boolean;
  isPreview: boolean;
  index: number;
  showGrid: boolean;
  onStartDrag: (e: React.MouseEvent, id: string) => void;
  onStartResize: (e: React.MouseEvent, id: string, corner: string) => void;
  onUpdateContent: (id: string, data: Partial<Layer>) => void;
  onDoubleClick?: (id: string) => void;
  onContextMenu?: (e: React.MouseEvent, id: string) => void;
}

// --- SVG Triangle ---
const TriangleShape = memo(({ layer, isPreview }: { layer: any; isPreview: boolean }) => {
  const w = (layer.width ?? 200);
  const h = (layer.height ?? 180);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="pointer-events-none" style={{ overflow: 'visible' }}>
      <polygon
        points={`${w / 2},0 ${w},${h} 0,${h}`}
        fill={layer.content || '#000000'}
        stroke={layer.borderColor || 'transparent'}
        strokeWidth={layer.borderWidth || 0}
      />
    </svg>
  );
});

// --- SVG Arrow ---
const ArrowShape = memo(({ layer, isPreview }: { layer: any; isPreview: boolean }) => {
  const w = (layer.width ?? 200);
  const h = (layer.height ?? 80);
  const sw = (layer.strokeWidth ?? 3);
  const hs = (layer.headSize ?? 18);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="pointer-events-none" style={{ overflow: 'visible' }}>
      <line x1={sw * 2} y1={h / 2} x2={w - hs} y2={h / 2}
        stroke={layer.content || '#000000'} strokeWidth={sw} strokeLinecap="round" />
      <polygon points={`${w - hs},${h / 2 - hs * 0.6} ${w},${h / 2} ${w - hs},${h / 2 + hs * 0.6}`}
        fill={layer.content || '#000000'} />
    </svg>
  );
});

// --- Line Shape ---
const LineShape = memo(({ layer }: { layer: any }) => {
  const w = (layer.width ?? 200);
  const sw = (layer.strokeWidth ?? 2);
  return (
    <div className="pointer-events-none" style={{
      width: `${w}px`, height: `${sw}px`,
      backgroundColor: layer.content || '#000000',
      borderRadius: `${sw / 2}px`,
      ...(layer.dashArray ? { borderTopStyle: 'dashed', border: 'none', background: 'transparent', borderTop: `${sw}px ${layer.dashArray} ${layer.content || '#000'}` } : {}),
    }} />
  );
});

// --- SVG Star ---
const StarShape = memo(({ layer }: { layer: any }) => {
  const w = (layer.width ?? 200);
  const h = (layer.height ?? 200);
  const pts = (layer.points ?? 5);
  const ir = (layer.innerRadius ?? 0.4);
  const cx = w / 2, cy = h / 2;
  const outerR = Math.min(w, h) / 2;

  // Generate star polygon points
  const points: string[] = [];
  for (let i = 0; i < pts * 2; i++) {
    const angle = (Math.PI / 2) + (i * Math.PI) / pts;
    const r = i % 2 === 0 ? outerR : outerR * ir;
    points.push(`${cx + r * Math.cos(angle)},${cy - r * Math.sin(angle)}`);
  }

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="pointer-events-none" style={{ overflow: 'visible' }}>
      <polygon
        points={points.join(' ')}
        fill={layer.content || '#000000'}
        stroke={layer.borderColor || 'transparent'}
        strokeWidth={layer.borderWidth || 0}
      />
    </svg>
  );
});

export const LayerItem = memo(({ layer, isSelected, isPreview, onStartDrag, onStartResize, onUpdateContent, onDoubleClick, onContextMenu }: LayerItemProps) => {
  if (!layer.isVisible) return null;

  // Build CSS filter for image layers
  const imgFilter = layer.type === 'image'
    ? `grayscale(${(layer as any).grayscale ?? 0}%) blur(${(layer as any).blur ?? 0}px) brightness(${((layer as any).brightness ?? 100)}%) contrast(${((layer as any).contrast ?? 100)}%) saturate(${((layer as any).saturate ?? 100)}%)`
    : undefined;

  return (
    <div
      onMouseDown={(e) => { if (layer.isLocked) { e.preventDefault(); return; } onStartDrag(e, layer.id); }}
      onDoubleClick={() => onDoubleClick?.(layer.id)}
      onContextMenu={(e) => { e.preventDefault(); onContextMenu?.(e, layer.id); }}
      className={`absolute select-none ${!isPreview && isSelected ? 'z-50 cursor-move' : 'hover:cursor-move'} ${layer.isLocked ? 'cursor-not-allowed' : ''}`}
      style={{
        left: `${layer.x}%`, top: `${layer.y}%`,
        transform: `translate(-50%, -50%) rotate(${layer.rotate ?? 0}deg) scale(${(layer as any).scaleX ?? (layer.scale ?? 1)}, ${(layer as any).scaleY ?? (layer.scale ?? 1)})`,
        zIndex: index, opacity: layer.opacity ?? 1,
        outline: !isPreview && isSelected ? '1px dashed var(--selection-ring)' : 'none',
        outlineOffset: '3px',
        boxShadow: !isPreview && isSelected ? `0 8px 32px var(--selection-glow)` : 'none',
        borderRadius: '2px',
      }}
    >
      {/* Resize handles */}
      {!isPreview && isSelected && !layer.isLocked && (
        <>
          <div onMouseDown={(e) => onStartResize(e, layer.id, 'nw')}
            className="absolute -top-3 -left-3 w-4 h-4 bg-white rounded-full border border-slate-300 dark:border-slate-400 shadow-md z-[60] cursor-nwse-resize hover:scale-125 transition-transform duration-100" />
          <div onMouseDown={(e) => onStartResize(e, layer.id, 'ne')}
            className="absolute -top-3 -right-3 w-4 h-4 bg-white rounded-full border border-slate-300 dark:border-slate-400 shadow-md z-[60] cursor-nesw-resize hover:scale-125 transition-transform duration-100" />
          <div onMouseDown={(e) => onStartResize(e, layer.id, 'sw')}
            className="absolute -bottom-3 -left-3 w-4 h-4 bg-white rounded-full border border-slate-300 dark:border-slate-400 shadow-md z-[60] cursor-nesw-resize hover:scale-125 transition-transform duration-100" />
          <div onMouseDown={(e) => onStartResize(e, layer.id, 'se')}
            className="absolute -bottom-3 -right-3 w-4 h-4 bg-white rounded-full border border-slate-300 dark:border-slate-400 shadow-md z-[60] cursor-nwse-resize hover:scale-125 transition-transform duration-100" />
        </>
      )}

      {/* === LAYER RENDERING === */}

      {/* Text */}
      {layer.type === 'text' && (
        <div style={{ fontSize: `${layer.fontSize}px`, color: layer.color, fontWeight: layer.fontWeight, fontFamily: layer.fontFamily, fontStyle: (layer as any).fontStyle ?? 'normal', letterSpacing: `${layer.letterSpacing ?? 0}px`, lineHeight: layer.lineHeight ?? 1.2, textAlign: (layer as any).textAlign ?? 'left' }}
          className="whitespace-nowrap px-6 py-2 outline-none"
          contentEditable={!isPreview && isSelected && !layer.isLocked}
          onBlur={(e) => onUpdateContent(layer.id, { content: e.target.innerText } as any)}
          suppressContentEditableWarning={true}>{layer.content}</div>
      )}

      {/* Rectangle */}
      {layer.type === 'rect' && (
        <div style={{ width: `${(layer as any).width ?? 200}px`, height: `${(layer as any).height ?? 200}px`, backgroundColor: (layer as any).color ?? '#000000', borderRadius: `${(layer as any).borderRadius ?? 0}px`, border: (layer as any).borderWidth ? `${(layer as any).borderWidth}px solid ${(layer as any).borderColor ?? '#000'}` : 'none' }} className="pointer-events-none" />
      )}

      {/* Circle */}
      {layer.type === 'circle' && (
        <div style={{ width: `${(layer as any).width ?? 200}px`, height: `${(layer as any).width ?? 200}px`, backgroundColor: (layer as any).color ?? '#000000', borderRadius: '50%' }} className="pointer-events-none" />
      )}

      {/* Triangle */}
      {layer.type === 'triangle' && (
        <TriangleShape layer={layer} isPreview={isPreview} />
      )}

      {/* Arrow */}
      {layer.type === 'arrow' && (
        <ArrowShape layer={layer} isPreview={isPreview} />
      )}

      {/* Line */}
      {layer.type === 'line' && (
        <LineShape layer={layer} />
      )}

      {/* Star */}
      {layer.type === 'star' && (
        <StarShape layer={layer} />
      )}

      {/* Image */}
      {layer.type === 'image' && (
        <img src={layer.content} alt="" className="pointer-events-none object-cover"
          style={{
            opacity: layer.opacity ?? 1,
            width: (layer as any).imgWidth ? `${(layer as any).imgWidth}px` : undefined,
            height: (layer as any).imgHeight ? `${(layer as any).imgHeight}px` : undefined,
            maxWidth: (layer as any).imgWidth ? undefined : '4000px',
            borderRadius: `${layer.borderRadius ?? 0}px`,
            filter: imgFilter,
          }} />
      )}
    </div>
  );
});
