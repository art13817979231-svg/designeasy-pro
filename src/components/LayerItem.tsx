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

export const LayerItem = memo(({ layer, isSelected, isPreview, onStartDrag, onStartResize, onUpdateContent, index, showGrid, onDoubleClick, onContextMenu }: LayerItemProps) => {
  if (!layer.isVisible) return null;
  
  return (
    <div 
      onMouseDown={(e) => onStartDrag(e, layer.id)} 
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
      {layer.type === 'text' ? (
        <div style={{ fontSize: `${layer.fontSize}px`, color: layer.color, fontWeight: layer.fontWeight, fontFamily: layer.fontFamily, fontStyle: (layer as any).fontStyle ?? 'normal', letterSpacing: `${layer.letterSpacing ?? 0}px`, lineHeight: layer.lineHeight ?? 1.2, textAlign: (layer as any).textAlign ?? 'left' }} 
          className="whitespace-nowrap px-6 py-2 outline-none" 
          contentEditable={!isPreview && isSelected && !layer.isLocked} 
          onBlur={(e) => onUpdateContent(layer.id, { content: e.target.innerText } as any)} 
          suppressContentEditableWarning={true}>{layer.content}</div>
      ) : layer.type === 'rect' ? (
        <div style={{ width: `${(layer as any).width ?? 200}px`, height: `${(layer as any).height ?? 200}px`, backgroundColor: (layer as any).color ?? '#000000', opacity: layer.opacity ?? 1, borderRadius: `${(layer as any).borderRadius ?? 0}px`, border: (layer as any).borderWidth ? `${(layer as any).borderWidth}px solid ${(layer as any).borderColor ?? '#000'}` : 'none' }} className="pointer-events-none" />
      ) : layer.type === 'circle' ? (
        <div style={{ width: `${(layer as any).width ?? 200}px`, height: `${(layer as any).width ?? 200}px`, backgroundColor: (layer as any).color ?? '#000000', opacity: layer.opacity ?? 1, borderRadius: '50%' }} className="pointer-events-none" />
      ) : (
        <img src={layer.content} alt="asset" className="pointer-events-none object-cover" 
          style={{ opacity: layer.opacity ?? 1, width: (layer as any).imgWidth ? `${(layer as any).imgWidth}px` : undefined, height: (layer as any).imgHeight ? `${(layer as any).imgHeight}px` : undefined, maxWidth: (layer as any).imgWidth ? undefined : '4000px', borderRadius: `${layer.borderRadius ?? 0}px`, filter: `grayscale(${(layer as any).grayscale ?? 0}%) blur(${(layer as any).blur ?? 0}px)` }} />
      )}
    </div>
  );
});
