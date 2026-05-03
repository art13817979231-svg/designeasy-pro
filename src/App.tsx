import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { toPng, toJpeg, toSvg } from 'html-to-image';

// Local fonts — no external network requests
import '@fontsource/inter/400.css';
import '@fontsource/inter/900.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/900.css';
import '@fontsource/oswald/400.css';
import '@fontsource/oswald/700.css';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/900.css';
import '@fontsource/merriweather/400.css';
import '@fontsource/bebas-neue/400.css';
import '@fontsource/abril-fatface/400.css';
import '@fontsource/dancing-script/700.css';
import '@fontsource/syncopate/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';
import { 
  Type, Image as ImageIcon, Layers, Download, 
  Settings, Trash2,
  MousePointer2, X, Plus,
  Undo, Redo,
  Eye, EyeOff, 
  Upload, CopyPlus, Square,
  SlidersHorizontal, Library,
  Bold, Italic, Sun, Moon,
  ArrowUp, ArrowDown, ArrowUpToLine, ArrowDownToLine,
  Type as FontIcon, FileUp, UploadCloud,
  Lock, Unlock, Ghost, LayoutGrid,
  Sparkles, Palette as PaletteIcon,
  AlignCenter, AlignLeft, AlignRight, AlignStartVertical, AlignEndVertical, AlignCenterVertical,
  Circle, RectangleHorizontal, Grid3X3, RotateCw, Minus
} from 'lucide-react';

// --- Extracted modules ---
import { BUILTIN_FONTS } from './config/fonts';
import { ASPEC_RATIOS, TEMPLATES } from './config/templates';
import { COLOR_PRESETS } from './config/colors';
import { translations } from './config/i18n';
import { useHistory } from './hooks/useHistory';
import { ToolIcon } from './components/ToolIcon';
import { PropertySlider } from './components/PropertySlider';
import { ColorPicker } from './components/ColorPicker';
import { SectionHeader } from './components/SectionHeader';
import { LayerItem } from './components/LayerItem';
import { TemplateThumb } from './components/TemplateThumb';
import type { Layer } from './types/canvas';

// --- Main App Component ---

const App = () => {
  const [lang] = useState('zh');
  const { state: layers, setState: setLayers, push: pushHistory, undo, redo, canUndo, canRedo } = useHistory<Layer[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [canvasRatio, setCanvasRatio] = useState(ASPEC_RATIOS[1]);
  const [canvasBg, setCanvasBg] = useState('#FFFFFF');
  const [zoom, setZoom] = useState(0.8);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>('templates'); 
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [guides, setGuides] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });
  const [customFonts, setCustomFonts] = useState<{ name: string; value: string }[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [addingType, setAddingType] = useState<string | null>(null);
  const [canvasGradient, setCanvasGradient] = useState<{ from: string; to: string; angle: number } | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; layerId: string } | null>(null);
  const spaceRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0, ox: 0, oy: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fontInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const initialLayersRef = useRef<{ id: string; x: number; y: number }[]>([]);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  const t = translations[lang as 'zh' | 'en'];
  
  const selectedLayer = useMemo(() => layers.find(l => l.id === selectedIds[0]), [layers, selectedIds]);
  const allFonts = useMemo(() => [...BUILTIN_FONTS, ...customFonts], [customFonts]);

  // Dark mode class toggle
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Close export menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) setExportMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const addRecentColor = useCallback((color: string) => {
    setRecentColors(prev => {
      const filtered = prev.filter(c => c !== color);
      return [color, ...filtered].slice(0, 18);
    });
  }, []);

  const applyTemplate = useCallback((template: typeof TEMPLATES[number]) => {
    const newLayers = template.layers.map(l => ({ 
      ...l, id: `l-${Math.random().toString(36).substr(2, 9)}`
    }));
    setCanvasRatio(template.ratio);
    setCanvasBg(template.bg);
    setCanvasGradient((template as any).gradient || null);
    setLayers(newLayers);
    setSelectedIds([]);
    setPanOffset({ x: 0, y: 0 });
    setTimeout(() => pushHistory(newLayers), 0);
  }, [setLayers, pushHistory]);

  const toggleLayerStatus = useCallback((id: string, key: 'isLocked' | 'isVisible') => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, [key]: !l[key] } : l));
  }, [setLayers]);

  const deleteSelected = useCallback(() => {
    if (selectedIds.length === 0) return;
    setLayers(prev => prev.filter(l => !selectedIds.includes(l.id)));
    setSelectedIds([]);
  }, [selectedIds, setLayers]);

  const duplicateSelected = useCallback(() => {
    if (selectedIds.length === 0) return;
    setLayers(prev => {
      const newLayers = selectedIds.flatMap(id => {
        const l = prev.find(x => x.id === id);
        if (!l) return [];
        return [{ ...l, id: `l-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, x: l.x + 3, y: l.y + 3 }];
      });
      return [...prev, ...newLayers];
    });
  }, [selectedIds, setLayers]);

  const updateBatchLayers = useCallback((data: Partial<Layer>) => {
    setLayers(prev => prev.map(l => selectedIds.includes(l.id) ? { ...l, ...data } : l));
  }, [selectedIds, setLayers]);

  const updateLayerById = useCallback((id: string, data: Partial<Layer>) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
  }, [setLayers]);

  const moveLayer = useCallback((id: string, direction: 'up' | 'down' | 'top' | 'bottom') => {
    setLayers(prev => {
      const idx = prev.findIndex(l => l.id === id);
      if (idx === -1) return prev;
      const newLayers = [...prev];
      const target = newLayers.splice(idx, 1)[0];
      if (direction === 'up') newLayers.splice(Math.min(idx + 1, prev.length), 0, target);
      else if (direction === 'down') newLayers.splice(Math.max(idx - 1, 0), 0, target);
      else if (direction === 'top') newLayers.push(target);
      else if (direction === 'bottom') newLayers.unshift(target);
      return newLayers;
    });
  }, [setLayers]);

  const alignLayers = useCallback((direction: string) => {
    if (selectedIds.length === 0) return;
    setLayers(prev => {
      const sel = prev.filter(l => selectedIds.includes(l.id));
      if (sel.length === 0) return prev;
      let newVals: Partial<Layer> = {};
      switch (direction) {
        case 'hcenter': newVals = { x: 50 }; break;
        case 'vcenter': newVals = { y: 50 }; break;
        case 'left': newVals = { x: Math.min(...sel.map(l => l.x)) }; break;
        case 'right': newVals = { x: Math.max(...sel.map(l => l.x)) }; break;
        case 'top': newVals = { y: Math.min(...sel.map(l => l.y)) }; break;
        case 'bottom': newVals = { y: Math.max(...sel.map(l => l.y)) }; break;
        default: return prev;
      }
      return prev.map(l => selectedIds.includes(l.id) ? { ...l, ...newVals } : l);
    });
  }, [selectedIds, setLayers]);

  const handleReplaceImage = useCallback(() => {
    replaceInputRef.current?.click();
  }, []);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('de_pro_v12');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.layers && Array.isArray(data.layers) && data.layers.length > 0) {
          setLayers(data.layers);
          setCanvasRatio(data.canvasRatio || ASPEC_RATIOS[1]);
          setCanvasBg(data.canvasBg || '#FFFFFF');
          setCanvasGradient(data.canvasGradient || null);
          setDarkMode(data.darkMode || false);
        } else {
          localStorage.removeItem('de_pro_v12');
          applyTemplate(TEMPLATES[0]);
        }
      } catch(e) {
        console.error(e);
        localStorage.removeItem('de_pro_v12');
        applyTemplate(TEMPLATES[0]);
      }
    } else {
      applyTemplate(TEMPLATES[0]);
    }
  }, [applyTemplate, setLayers]);

  // Save to localStorage — debounced
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      localStorage.setItem('de_pro_v12', JSON.stringify({ layers, canvasRatio, canvasBg, canvasGradient, darkMode }));
    }, 500);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [layers, canvasRatio, canvasBg, canvasGradient, darkMode]);

  // Interaction tracking
  const interactionRef = useRef({
    dragging: false, resizing: false, isPreviewMode: false,
    startPos: { x: 0, y: 0 }, startScale: 1, startScaleX: 1, startScaleY: 1,
    startDist: 1, startMousePos: { x: 0, y: 0 },
    resizeCorner: null as string | null,
    editingTextId: null as string | null,
  });
  const pendingRafRef = useRef<number | null>(null);
  const latestMouseRef = useRef<MouseEvent | null>(null);

  const tryFlushHistory = useCallback((layersSnapshot: Layer[]) => {
    if (pendingRafRef.current) {
      cancelAnimationFrame(pendingRafRef.current);
      pendingRafRef.current = null;
    }
    pushHistory(layersSnapshot);
  }, [pushHistory]);

  // Export
  const handleExport = useCallback(async (format: string = 'png') => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    setExportMenuOpen(false);
    const prevSelected = [...selectedIds];
    setSelectedIds([]);
    try {
      await new Promise(r => setTimeout(r, 100));
      const options = { 
        pixelRatio: 3, 
        cacheBust: true,
        filter: (node: HTMLElement) => !node.classList?.contains('no-export'),
      };
      let dataUrl;
      if (format === 'jpg') {
        dataUrl = await toJpeg(canvasRef.current, options);
      } else if (format === 'svg') {
        dataUrl = await toSvg(canvasRef.current, options);
      } else {
        dataUrl = await toPng(canvasRef.current, options);
      }
      const link = document.createElement('a');
      link.download = `designeasy-${Date.now()}.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
      try {
        const rect = canvasRef.current!.getBoundingClientRect();
        const canvas = document.createElement('canvas');
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;
        const ctx = canvas.getContext('2d');
        ctx!.scale(2, 2);
        ctx!.fillStyle = canvasBg;
        ctx!.fillRect(0, 0, rect.width, rect.height);
      } catch(e2) { console.error(e2); }
    } finally {
      setSelectedIds(prevSelected);
      setIsExporting(false);
    }
  }, [canvasBg, selectedIds]);

  // Drag
  const handleStartDrag = useCallback((e: React.MouseEvent, id: string) => {
    if (interactionRef.current.isPreviewMode) return;
    if (spaceRef.current) {
      e.stopPropagation();
      setIsPanning(true);
      panStartRef.current = { x: e.clientX, y: e.clientY, ox: panOffset.x, oy: panOffset.y };
      return;
    }
    const layer = layers.find(l => l.id === id);
    if (layer?.isLocked) return;
    e.stopPropagation();
    if (!selectedIds.includes(id)) setSelectedIds(e.shiftKey ? [...selectedIds, id] : [id]);
    interactionRef.current.dragging = true;
    interactionRef.current.startPos = { x: e.clientX, y: e.clientY };
    const currentSel = selectedIds.includes(id) ? selectedIds : [id];
    initialLayersRef.current = layers.filter(l => currentSel.includes(l.id)).map(l => ({ id: l.id, x: l.x, y: l.y }));
    setIsRightPanelOpen(true);
  }, [layers, selectedIds, panOffset]);

  // Resize
  const handleStartResize = useCallback((e: React.MouseEvent, id: string, corner: string) => {
    if (interactionRef.current.isPreviewMode) return;
    e.stopPropagation(); e.preventDefault();
    const layer = layers.find(l => l.id === id);
    if (!layer || layer.isLocked) return;
    interactionRef.current.resizing = true;
    interactionRef.current.resizeCorner = corner;
    interactionRef.current.startScale = layer.scale || 1;
    interactionRef.current.startScaleX = (layer as any).scaleX || 1;
    interactionRef.current.startScaleY = (layer as any).scaleY || 1;
    interactionRef.current.startMousePos = { x: e.clientX, y: e.clientY };
  }, [layers]);

  const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
    latestMouseRef.current = e;
    if (pendingRafRef.current) return;
    pendingRafRef.current = requestAnimationFrame(() => {
      pendingRafRef.current = null;
      const ev = latestMouseRef.current;
      if (!ev || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();

      if (interactionRef.current.dragging) {
        const dx = ev.clientX - interactionRef.current.startPos.x;
        const dy = ev.clientY - interactionRef.current.startPos.y;
        const dw = (dx / (rect.width / zoom)) * 100;
        const dh = (dy / (rect.height / zoom)) * 100;
        setLayers(prev => prev.map(l => {
          const init = initialLayersRef.current.find(p => p.id === l.id);
          if (init) {
            let nx = init.x + dw, ny = init.y + dh;
            if (Math.abs(nx - 50) < 1.2) { nx = 50; setGuides(g => ({...g, x: 50})); } else setGuides(g => ({...g, x: null}));
            if (Math.abs(ny - 50) < 1.2) { ny = 50; setGuides(g => ({...g, y: 50})); } else setGuides(g => ({...g, y: null}));
            const others = prev.filter(o => o.id !== l.id);
            for (const o of others) {
              if (Math.abs(nx - o.x) < 0.8) nx = o.x;
              if (Math.abs(ny - o.y) < 0.8) ny = o.y;
            }
            return { ...l, x: nx, y: ny };
          }
          return l;
        }));
      }

      if (isPanning) {
        const dx = ev.clientX - panStartRef.current.x;
        const dy = ev.clientY - panStartRef.current.y;
        setPanOffset({ x: panStartRef.current.ox + dx, y: panStartRef.current.oy + dy });
      }

      if (interactionRef.current.resizing) {
        setLayers(prev => {
          const sel = prev.find(l => l.id === selectedIds[0]);
          if (!sel) return prev;
          const corner = interactionRef.current.resizeCorner;
          const start = interactionRef.current.startMousePos;
          const dx = ev.clientX - start.x;
          const dy = ev.clientY - start.y;
          // Use canvas size for sensitivity normalization
          const sensitivity = 0.005; // per pixel
          const baseSX = interactionRef.current.startScaleX;
          const baseSY = interactionRef.current.startScaleY;

          let newScaleX = baseSX;
          let newScaleY = baseSY;

          // Determine X/Y scale changes based on corner direction
          // Horizontal: 'e' corners (ne, se) increase X on right drag, 'w' corners (nw, sw) decrease
          // Vertical: 's' corners (sw, se) increase Y on down drag, 'n' corners (ne, nw) decrease
          if (corner?.includes('e')) newScaleX = baseSX * (1 + dx * sensitivity);
          if (corner?.includes('w')) newScaleX = baseSX * (1 - dx * sensitivity);
          if (corner?.includes('s')) newScaleY = baseSY * (1 + dy * sensitivity);
          if (corner?.includes('n')) newScaleY = baseSY * (1 - dy * sensitivity);

          // Shift key = lock aspect ratio (uniform scale)
          if (ev.shiftKey) {
            const avgScale = (newScaleX + newScaleY) / 2;
            newScaleX = avgScale;
            newScaleY = avgScale;
          }

          if (isNaN(newScaleX) || isNaN(newScaleY)) return prev;
          const clampedX = Math.max(0.05, Math.min(5, newScaleX));
          const clampedY = Math.max(0.05, Math.min(5, newScaleY));
          return prev.map(l => selectedIds.includes(l.id) ? {
            ...l,
            scaleX: clampedX,
            scaleY: clampedY,
            scale: Math.sqrt(clampedX * clampedY), // keep legacy field in sync
          } : l);
        });
      }
    });
  }, [zoom, selectedIds, setLayers, isPanning]);

  useEffect(() => {
    interactionRef.current.isPreviewMode = isPreviewMode;
  }, [isPreviewMode]);

  useEffect(() => {
    const end = (e: MouseEvent) => {
      if (pendingRafRef.current) { cancelAnimationFrame(pendingRafRef.current); pendingRafRef.current = null; }
      if (e) latestMouseRef.current = e;
      if (latestMouseRef.current && canvasRef.current) handleGlobalMouseMove(latestMouseRef.current);
      const snapshot = layersRef.current.slice();
      interactionRef.current.dragging = false; interactionRef.current.resizing = false; setGuides({ x: null, y: null });
      pushHistory(snapshot);
    };
    const move = (e: MouseEvent) => handleGlobalMouseMove(e);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', end); };
  }, [handleGlobalMouseMove, pushHistory, layers]);

  const layersRef = useRef(layers);
  useEffect(() => { layersRef.current = layers; }, [layers]);

  // Space key for pan
  useEffect(() => {
    const down = (e: KeyboardEvent) => { if (e.code === 'Space' && !(e.target as HTMLElement).closest('input, select, textarea, [contenteditable]')) { e.preventDefault(); spaceRef.current = true; } };
    const up = (e: KeyboardEvent) => { if (e.code === 'Space') { spaceRef.current = false; setIsPanning(false); } };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  // Mouse wheel zoom — DISABLED
  useEffect(() => { return () => {}; }, []);

  // Close context menu on click
  useEffect(() => {
    const handler = () => setContextMenu(null);
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isPreviewMode) return;
      const target = e.target as HTMLElement;
      if (target.contentEditable === 'true' || target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA') return;
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); return; }
      if ((isMod && e.key === 'z' && e.shiftKey) || (isMod && e.key === 'y')) { e.preventDefault(); redo(); return; }
      if (isMod && e.key === 'd') { e.preventDefault(); duplicateSelected(); return; }
      if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); deleteSelected(); return; }
      if (isMod && e.key === 'a') { e.preventDefault(); setSelectedIds(layers.map(l => l.id)); return; }
      if (selectedIds.length > 0 && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const step = e.shiftKey ? 5 : 1;
        const delta: Record<string, { x: number; y: number }> = { ArrowUp: { x: 0, y: -step }, ArrowDown: { x: 0, y: step }, ArrowLeft: { x: -step, y: 0 }, ArrowRight: { x: step, y: 0 } };
        const d = delta[e.key];
        setLayers(prev => prev.map(l => selectedIds.includes(l.id) ? { ...l, x: l.x + d.x, y: l.y + d.y } : l));
      }
      if (e.key === 'Escape') {
        if (selectedIds.length > 0) setSelectedIds([]);
        else setIsPreviewMode(false);
      }
      if (e.key === 'p' && !isMod) { setIsPreviewMode(true); setSelectedIds([]); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isPreviewMode, selectedIds, layers, undo, redo, duplicateSelected, deleteSelected, setLayers]);

  return (
    <div className={`flex h-screen text-slate-900 font-sans overflow-hidden select-none transition-colors duration-300 ${darkMode ? 'bg-[#0F1117] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
      <input type="file" ref={fileInputRef} onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const newId = `l-${Date.now()}`;
            setLayers(prev => [...prev, { id: newId, type: 'image', content: ev.target!.result as string, x: 50, y: 50, rotate: 0, scale: 0.5, opacity: 1, borderRadius: 0, isLocked: false, isVisible: true } as Layer]);
            setSelectedIds([newId]);
          };
          reader.readAsDataURL(file);
        }
        e.target.value = '';
      }} accept="image/*" className="hidden" />

      <input type="file" ref={replaceInputRef} onChange={(e) => {
        const file = e.target.files?.[0];
        if (file && selectedLayer?.type === 'image') {
          const reader = new FileReader();
          reader.onload = (ev) => {
            updateLayerById(selectedLayer.id, { content: ev.target!.result as string } as Partial<Layer>);
          };
          reader.readAsDataURL(file);
        }
        e.target.value = '';
      }} accept="image/*" className="hidden" />

      <input type="file" ref={fontInputRef} onChange={(e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const fontName = file.name.split('.')[0].replace(/\s+/g, '_');
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const fontFace = new FontFace(fontName, ev.target!.result as ArrayBuffer);
          try {
            const loadedFace = await fontFace.load();
            document.fonts.add(loadedFace);
            setCustomFonts(prev => [...prev, { name: `[Local] ${fontName}`, value: fontName }]);
            if (selectedLayer?.type === 'text') updateBatchLayers({ fontFamily: fontName } as Partial<Layer>);
          } catch (err) { console.error(err); }
        };
        reader.readAsArrayBuffer(file);
      }} accept=".ttf,.otf,.woff" className="hidden" />

      {isPreviewMode && (
        <button onClick={() => setIsPreviewMode(false)}
          className="fixed top-4 right-4 z-[500] bg-black hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-2 transition-all shadow-2xl">
          <EyeOff size={14}/> {t.exitPreview}
        </button>
      )}

      {!isPreviewMode && (
        <nav className={`fixed top-0 left-0 right-0 z-[200] h-12 flex items-center justify-between px-5 
          border-b backdrop-blur-2xl transition-colors duration-300
          ${darkMode ? 'bg-slate-600/80 border-zinc-800/60' : 'bg-white/80 border-zinc-200/60'}`}>
          <div className="flex items-center gap-5 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-600 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-slate-700 shadow-lg shadow-black/10 rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300"><PaletteIcon size={17}/></div>
              <span className="font-black text-[11px] tracking-[0.2em] uppercase text-zinc-800 dark:text-zinc-100">Design<span className="text-zinc-400 dark:text-zinc-600">Easy</span></span>
            </div>
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700/50" />
            <div className="flex items-center gap-0.5">
              <button onClick={undo} disabled={!canUndo} 
                className={`p-1.5 rounded-xl transition-all duration-150 ${canUndo ? 'text-zinc-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-slate-700 cursor-pointer' : 'text-zinc-200 dark:text-zinc-700 cursor-not-allowed'}`}>
                <Undo size={14}/>
              </button>
              <button onClick={redo} disabled={!canRedo} 
                className={`p-1.5 rounded-xl transition-all duration-150 ${canRedo ? 'text-zinc-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-slate-700 cursor-pointer' : 'text-zinc-200 dark:text-zinc-700 cursor-not-allowed'}`}>
                <Redo size={14}/>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setShowGrid(!showGrid)} 
              className={`p-2 rounded-xl transition-all duration-200 ${showGrid ? 'bg-slate-600 text-white dark:bg-white dark:text-slate-700 shadow-lg' : 'text-zinc-400 hover:text-slate-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-slate-700'}`}>
              <Grid3X3 size={15}/>
            </button>
            <button onClick={() => setDarkMode(!darkMode)} 
              className={`p-2 rounded-xl transition-all duration-200 ${darkMode ? 'bg-slate-600 text-white dark:bg-white dark:text-slate-700 shadow-lg' : 'text-zinc-400 hover:text-slate-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-slate-700'}`}>
              {darkMode ? <Sun size={15}/> : <Moon size={15}/>}
            </button>
            <button onClick={() => { setSelectedIds([]); setIsPreviewMode(true); }} 
              className="px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 
                hover:text-slate-700 dark:hover:text-white transition-all duration-200 hover:bg-zinc-100 dark:hover:bg-slate-700 rounded-xl flex items-center gap-2">
              <Eye size={13}/> {t.preview}
            </button>
            <div className="relative" ref={exportMenuRef}>
              <button onClick={() => setExportMenuOpen(!exportMenuOpen)} 
                className="bg-slate-600 dark:bg-white hover:bg-zinc-700 dark:hover:bg-zinc-200 text-white dark:text-slate-700 
                  px-5 py-2 rounded-2xl text-[10px] font-black tracking-[0.15em] flex items-center gap-2.5 
                  transition-all duration-200 hover:shadow-xl shadow-lg shadow-black/15">
                <Download size={13} /> {t.export}
              </button>
              {exportMenuOpen && (
                <div className={`absolute right-0 top-full mt-2.5 w-52 rounded-2xl shadow-xl shadow-black/8 border overflow-hidden z-[300] backdrop-blur-xl
                  ${darkMode ? 'bg-slate-600/95 border-zinc-800/70' : 'bg-white/95 border-zinc-200/80'}`}>
                  <button onClick={() => handleExport('png')} 
                    className={`w-full text-left px-4 py-3.5 text-[11px] font-semibold flex items-center gap-3 transition-colors ${darkMode ? 'hover:bg-slate-700 text-zinc-200' : 'hover:bg-zinc-50 text-zinc-700'}`}>
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-400 to-blue-600"/> PNG 图片
                  </button>
                  <button onClick={() => handleExport('jpg')} 
                    className={`w-full text-left px-4 py-3.5 text-[11px] font-semibold flex items-center gap-3 transition-colors ${darkMode ? 'hover:bg-slate-700 text-zinc-200' : 'hover:bg-zinc-50 text-zinc-700'}`}>
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-orange-400 to-orange-600"/> JPG 图片
                  </button>
                  <button onClick={() => handleExport('svg')} 
                    className={`w-full text-left px-4 py-3.5 text-[11px] font-semibold flex items-center gap-3 transition-colors ${darkMode ? 'hover:bg-slate-700 text-zinc-200' : 'hover:bg-zinc-50 text-zinc-700'}`}>
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-green-400 to-green-600"/> SVG 矢量
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      )}

      <div className="flex flex-1 pt-12">
        {!isPreviewMode && (
          <aside className="w-[68px] z-[150] flex flex-col items-center py-6 gap-2 shrink-0 
            border-r border-zinc-200/60 dark:border-zinc-800/60
            bg-white/70 dark:bg-slate-600/70
            backdrop-blur-2xl
            shadow-lg shadow-black/[0.03]">
            <ToolIcon icon={<Library size={22}/>} active={activePanel === 'templates'} onClick={() => setActivePanel('templates')} label={t.templates} />
            <ToolIcon icon={<FontIcon size={22}/>} active={addingType === 'text'} onClick={() => {
              const newId = `l-${Date.now()}`;
              setLayers(p => [...p, { id: newId, type: 'text', content: 'EDIT TEXT', x: 50, y: 50, fontSize: 48, color: '#000', rotate: 0, scale: 1, fontWeight: '900', fontFamily: BUILTIN_FONTS[0].value, opacity: 1, letterSpacing: 0, lineHeight: 1, isLocked: false, isVisible: true } as Layer]);
              setSelectedIds([newId]);
              setAddingType('text');
              setTimeout(() => setAddingType(null), 300);
            }} label={t.addText} />
            <ToolIcon icon={<ImageIcon size={22}/>} active={addingType === 'image'} onClick={() => { fileInputRef.current?.click(); setAddingType('image'); setTimeout(() => setAddingType(null), 300); }} label={t.addImg} />
            <ToolIcon icon={<RectangleHorizontal size={22}/>} active={addingType === 'rect'} onClick={() => {
              const newId = `l-${Date.now()}`;
              setLayers(p => [...p, { id: newId, type: 'rect', content: '', x: 50, y: 50, width: 200, height: 200, color: '#000000', borderRadius: 0, borderWidth: 0, borderColor: '#000', rotate: 0, scale: 1, opacity: 1, isLocked: false, isVisible: true } as Layer]);
              setSelectedIds([newId]);
              setAddingType('rect');
              setTimeout(() => setAddingType(null), 300);
            }} label={t.addRect} />
            <ToolIcon icon={<Circle size={22}/>} active={addingType === 'circle'} onClick={() => {
              const newId = `l-${Date.now()}`;
              setLayers(p => [...p, { id: newId, type: 'circle', content: '', x: 50, y: 50, width: 200, color: '#000000', rotate: 0, scale: 1, opacity: 1, isLocked: false, isVisible: true } as Layer]);
              setSelectedIds([newId]);
              setAddingType('circle');
              setTimeout(() => setAddingType(null), 300);
            }} label={t.addCircle} />
            <div className="w-8 h-px bg-slate-100 dark:bg-slate-700 my-1" />
            <ToolIcon icon={<Layers size={22}/>} active={activePanel === 'layers'} onClick={() => setActivePanel('layers')} label={t.layers} />
            <ToolIcon icon={<Settings size={22}/>} active={activePanel === 'settings'} onClick={() => setActivePanel('settings')} label={t.settings} />
          </aside>
        )}

        {!isPreviewMode && activePanel && (
          <aside className="w-64 border-r border-zinc-200/70 dark:border-zinc-800/60 shadow-2xl shadow-black/[0.04] z-[140] flex flex-col shrink-0
            bg-white/80 dark:bg-slate-600/80 backdrop-blur-2xl">
            <div className="h-12 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between px-5">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600 dark:bg-white" />
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">{t[activePanel]}</span>
              </div>
              <button onClick={() => setActivePanel(null)} className="p-1 rounded-lg text-zinc-300 dark:text-zinc-600 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-slate-700 transition-all"><X size={14}/></button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {activePanel === 'templates' && (
                <div className="grid grid-cols-2 gap-3">
                  {TEMPLATES.map(temp => (
                    <TemplateThumb key={temp.id} template={temp} onClick={() => applyTemplate(temp)} />
                  ))}
                </div>
              )}
              {activePanel === 'layers' && (
                <div className="space-y-1.5">
                  {[...layers].reverse().map(l => (
                    <div key={l.id} onClick={() => setSelectedIds([l.id])} className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer group ${selectedIds.includes(l.id) ? 'bg-black text-white shadow-xl' : `${darkMode ? 'hover:bg-slate-800 border border-transparent text-slate-300' : 'hover:bg-slate-50 border border-transparent text-slate-700'}`} ${!l.isVisible ? 'opacity-30' : ''}`}>
                      {l.type === 'text' ? <FontIcon size={14} /> : l.type === 'rect' ? <RectangleHorizontal size={14} /> : l.type === 'circle' ? <Circle size={14} /> : <ImageIcon size={14} />}
                      <span className="text-[10px] font-bold truncate flex-1 uppercase tracking-tighter">{l.type === 'text' ? l.content.slice(0, 12) : l.type === 'rect' ? '矩形' : l.type === 'circle' ? '圆形' : '图片'}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); toggleLayerStatus(l.id, 'isLocked'); }} className={`p-1 ${selectedIds.includes(l.id) ? 'hover:text-yellow-300' : 'hover:text-indigo-400'}`}>{l.isLocked ? <Lock size={12}/> : <Unlock size={12}/>}</button>
                        <button onClick={(e) => { e.stopPropagation(); toggleLayerStatus(l.id, 'isVisible'); }} className={`p-1 ${selectedIds.includes(l.id) ? 'hover:text-yellow-300' : 'hover:text-indigo-400'}`}>{l.isVisible ? <Eye size={12}/> : <EyeOff size={12}/>}</button>
                        <button onClick={(e) => { e.stopPropagation(); setLayers(prev => prev.filter(i => i.id !== l.id)); }} className={`p-1 ${selectedIds.includes(l.id) ? 'hover:text-red-300' : 'hover:text-red-400'}`}><Trash2 size={12}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activePanel === 'settings' && (
                <div className="space-y-6">
                   <div className="space-y-3 text-left">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">比例预设</label>
                     <div className="grid grid-cols-2 gap-2">
                       {ASPEC_RATIOS.map(r => (
                         <button key={r.id} onClick={() => setCanvasRatio(r)} className={`p-2.5 rounded-xl border-2 text-[10px] font-black transition-all ${canvasRatio.id === r.id ? 'border-black bg-black text-white' : `${darkMode ? 'border-slate-700 text-slate-400 hover:border-slate-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}`}>
                           {r.name}
                         </button>
                       ))}
                     </div>
                   </div>
                   <div className={`pt-5 border-t ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">背景底色</label>
                     <input type="color" value={canvasBg} onChange={(e) => { setCanvasBg(e.target.value); addRecentColor(e.target.value); setCanvasGradient(null); }} className={`w-full h-10 rounded-xl border cursor-pointer p-1 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`} />
                   </div>
                   <div className={`pt-5 border-t ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                     <div className="flex items-center justify-between mb-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">背景渐变</label>
                       <button onClick={() => setCanvasGradient(canvasGradient ? null : { from: canvasBg, to: '#000000', angle: 135 })} className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg transition-all ${canvasGradient ? 'bg-black text-white dark:bg-white dark:text-black' : `${darkMode ? 'bg-slate-800 text-slate-500 border border-slate-700' : 'bg-white text-slate-400 border border-slate-100'}`}`}>{canvasGradient ? 'ON' : 'OFF'}</button>
                     </div>
                     {canvasGradient && (<div className="space-y-3">
                       <div className="flex gap-2">
                         <div className="flex-1"><span className="text-[9px] font-bold text-slate-400 block mb-1">FROM</span><input type="color" value={canvasGradient.from} onChange={(e) => setCanvasGradient(g => ({...g, from: e.target.value}))} className="w-full h-8 rounded-lg border cursor-pointer p-0.5 border-slate-200" /></div>
                         <div className="flex-1"><span className="text-[9px] font-bold text-slate-400 block mb-1">TO</span><input type="color" value={canvasGradient.to} onChange={(e) => setCanvasGradient(g => ({...g, to: e.target.value}))} className="w-full h-8 rounded-lg border cursor-pointer p-0.5 border-slate-200" /></div>
                       </div>
                       <PropertySlider label="角度" value={canvasGradient.angle} min={0} max={360} onChange={(v) => setCanvasGradient(g => ({...g, angle: v}))} />
                       <div className="space-y-2">
                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">预设</span>
                         <div className="grid grid-cols-4 gap-1.5">
                           {[
                             { from: '#0F0C29', to: '#302B63', angle: 135 },
                             { from: '#200122', to: '#6F0000', angle: 135 },
                             { from: '#ECE9E6', to: '#FFFFFF', angle: 135 },
                             { from: '#2C3E50', to: '#3498DB', angle: 135 },
                             { from: '#1A1A2E', to: '#16213E', angle: 180 },
                             { from: '#F5AF19', to: '#F12711', angle: 45 },
                             { from: '#0F2027', to: '#2C5364', angle: 135 },
                             { from: '#DA4453', to: '#89216B', angle: 135 },
                           ].map((p, i) => (
                             <button key={i} onClick={() => setCanvasGradient(p)} className="h-8 rounded-lg hover:scale-105 transition-transform border border-black/5" style={{ background: `linear-gradient(${p.angle}deg, ${p.from}, ${p.to})` }} />
                           ))}
                         </div>
                       </div>
                     </div>)}
                   </div>
                   <div className={`pt-5 border-t ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">显示设置</label>
                     <div className="space-y-2">
                       <button onClick={() => setShowGrid(!showGrid)} className={`w-full flex items-center justify-between p-2.5 rounded-xl text-[10px] font-bold border transition-all ${showGrid ? 'border-black bg-black text-white' : `${darkMode ? 'border-slate-700 text-slate-400' : 'border-slate-100 text-slate-400'}`}`}>
                         <span>{t.grid}</span>
                         <Grid3X3 size={14}/>
                       </button>
                       <button onClick={() => setDarkMode(!darkMode)} className={`w-full flex items-center justify-between p-2.5 rounded-xl text-[10px] font-bold border transition-all ${darkMode ? 'border-black bg-black text-white' : `${darkMode ? 'border-slate-700 text-slate-400' : 'border-slate-100 text-slate-400'}`}`}>
                         <span>{t.darkMode}</span>
                         {darkMode ? <Sun size={14}/> : <Moon size={14}/>}
                       </button>
                     </div>
                   </div>
                </div>
              )}
            </div>
          </aside>
        )}

        <main className={`flex-1 relative flex items-center justify-center transition-all overflow-hidden ${darkMode ? 'bg-[#0F1117]' : 'bg-[#F8FAFC]'} ${isRightPanelOpen && !isPreviewMode ? 'pr-[280px]' : ''}`}>
          {guides.x && <div className="absolute top-0 bottom-0 w-px bg-zinc-400/40 z-[100] left-1/2 shadow-[0_0_12px_rgba(0,0,0,0.12)]" />}
          {guides.y && <div className="absolute left-0 right-0 h-px bg-zinc-400/40 z-[100] top-1/2 shadow-[0_0_12px_rgba(0,0,0,0.12)]" />}

          <div ref={canvasRef} className={`relative transition-all duration-500 ease-out overflow-hidden ${isPreviewMode ? 'shadow-none border-none scale-100' : `shadow-[0_60px_120px_-20px_rgba(0,0,0,0.12)] border ${darkMode ? 'border-zinc-800' : 'border-zinc-200'}`}`} style={{ aspectRatio: `${1/canvasRatio.value}`, height: isPreviewMode ? '100%' : `${zoom * 100}%`, background: canvasGradient 
            ? `linear-gradient(${canvasGradient.angle ?? 135}deg, ${canvasGradient.from}, ${canvasGradient.to})` 
            : canvasBg, transform: `translate(${panOffset.x}px, ${panOffset.y}px)` }} onMouseDown={(e) => {
            if (spaceRef.current) {
              setIsPanning(true);
              panStartRef.current = { x: e.clientX, y: e.clientY, ox: panOffset.x, oy: panOffset.y };
              return;
            }
            if (!isPreviewMode) setSelectedIds([]);
          }} onContextMenu={(e) => e.preventDefault()}>
            {showGrid && !isPreviewMode && (
              <div className="absolute inset-0 z-[90] pointer-events-none" style={{
                backgroundImage: `radial-gradient(circle, var(--canvas-dot) 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
              }}/>
            )}
            {showGrid && !isPreviewMode && (
              <>
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-zinc-400/25 z-[91] pointer-events-none shadow-[0_0_6px_rgba(0,0,0,0.08)]" />
                <div className="absolute left-0 right-0 top-1/2 h-px bg-zinc-400/25 z-[91] pointer-events-none shadow-[0_0_6px_rgba(0,0,0,0.08)]" />
              </>
            )}
            {layers.map((layer, idx) => (
              <LayerItem 
                key={layer.id}
                layer={layer}
                isSelected={selectedIds.includes(layer.id)}
                isPreview={isPreviewMode}
                index={idx}
                onStartDrag={handleStartDrag}
                onStartResize={handleStartResize}
                onUpdateContent={updateLayerById}
                onDoubleClick={(id) => {
                  const l = layers.find(x => x.id === id);
                  if (l?.type === 'text') {
                    interactionRef.current.editingTextId = id;
                    setSelectedIds([id]);
                  }
                }}
                onContextMenu={(e, id) => {
                  setSelectedIds([id]);
                  setContextMenu({ x: e.clientX, y: e.clientY, layerId: id });
                }}
                showGrid={showGrid}
              />
            ))}
          </div>

          {!isPreviewMode && (
            <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-2.5 rounded-full shadow-2xl text-[10px] font-black z-[100] backdrop-blur-md border ${darkMode ? 'bg-[#0F1117]/95 text-slate-400 border-slate-800' : 'bg-white/95 text-slate-500 border-slate-200'}`}>
              <button onClick={() => setZoom(Math.max(0.1, zoom - 0.1))} className="hover:text-black dark:hover:text-white transition-colors"><Minus size={16}/></button>
              <span className="w-12 text-center font-mono tracking-tighter">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(Math.min(3, zoom + 0.1))} className="hover:text-black dark:hover:text-white transition-colors"><Plus size={16}/></button>
              <div className={`w-px h-4 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
              <button onClick={() => setZoom(1)} className="hover:text-black dark:hover:text-white transition-colors text-[9px] font-bold">FIT</button>
              <button onClick={() => { setZoom(1); setPanOffset({ x: 0, y: 0 }); }} className="hover:text-black dark:hover:text-white transition-colors text-[9px] font-bold">1:1</button>
              <div className={`w-px h-4 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
              <span className="text-[8px] font-medium text-slate-300 dark:text-slate-600">滚轮缩放 · 空格拖动</span>
            </div>
          )}
        </main>

        {!isPreviewMode && (
          <aside className={`w-[280px] border-l p-6 z-[160] overflow-y-auto scrollbar-hide shrink-0 transition-transform duration-300 shadow-xl ${isRightPanelOpen ? 'translate-x-0' : 'translate-x-full absolute right-0 top-12 bottom-0'} ${darkMode ? 'bg-[#0F1117] border-slate-800' : 'bg-white border-slate-200/60'}`}>
            <div className="flex items-center justify-between mb-6 text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
               <span className="flex items-center gap-1.5"><Sparkles size={11} className="text-zinc-300 dark:text-zinc-600"/>{selectedLayer ? t.inspect : t.canvas}</span>
               <button onClick={() => setIsRightPanelOpen(false)} className={`p-0.5 rounded transition-colors ${darkMode ? 'hover:bg-slate-700/50 text-zinc-500' : 'hover:bg-slate-50 text-zinc-300'}`}><X size={14} /></button>
            </div>

            {selectedLayer ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={duplicateSelected} className="py-2 bg-zinc-100 dark:bg-slate-700/60 rounded-xl text-[9px] font-semibold uppercase text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 transition-all"><CopyPlus size={12}/> {t.duplicate}</button>
                  <button onClick={deleteSelected} className={`py-2 rounded-xl text-[9px] font-semibold uppercase flex items-center justify-center gap-1.5 transition-all ${darkMode ? 'bg-slate-800/50 text-zinc-400 hover:bg-red-900/20 border border-transparent' : 'bg-white text-zinc-400 hover:bg-red-50 hover:text-red-500 border border-zinc-100'}`}><Trash2 size={12}/> {t.delete}</button>
                </div>

                <div className={`flex items-center justify-between p-2.5 rounded-xl ${darkMode ? 'bg-slate-800/40' : 'bg-zinc-50/60'}`}>
                  <span className="text-[9px] font-medium text-zinc-400 dark:text-zinc-500">
                    {selectedLayer.isLocked ? t.lock : t.unlock}
                  </span>
                  <button onClick={() => toggleLayerStatus(selectedLayer.id, 'isLocked')} className={`p-1 rounded-md transition-colors ${selectedLayer.isLocked ? 'text-amber-500' : 'text-zinc-300 hover:text-zinc-500 dark:hover:text-zinc-400'}`}>
                    {selectedLayer.isLocked ? <Lock size={14}/> : <Unlock size={14}/>}
                  </button>
                </div>
                
                {selectedIds.length > 0 && (
                  <div className={`p-2.5 rounded-xl ${darkMode ? 'bg-slate-800/40' : 'bg-zinc-50/60'}`}>
                    <span className="text-[9px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-2.5">{t.align}</span>
                    <div className="grid grid-cols-3 gap-1">
                      <button onClick={() => alignLayers('left')} className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${darkMode ? 'hover:bg-slate-700 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-400'}`} title={t.alignLeft}><AlignStartVertical size={12}/></button>
                      <button onClick={() => alignLayers('hcenter')} className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${darkMode ? 'hover:bg-slate-700 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-400'}`} title={t.alignHCenter}><AlignLeft size={12} className="rotate-0"/></button>
                      <button onClick={() => alignLayers('right')} className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${darkMode ? 'hover:bg-slate-700 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-400'}`} title={t.alignRight}><AlignEndVertical size={12}/></button>
                      <button onClick={() => alignLayers('top')} className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${darkMode ? 'hover:bg-slate-700 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-400'}`} title={t.alignTop}><AlignStartVertical size={12} className="rotate-90"/></button>
                      <button onClick={() => alignLayers('vcenter')} className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${darkMode ? 'hover:bg-slate-700 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-400'}`} title={t.alignVCenter}><AlignCenterVertical size={12}/></button>
                      <button onClick={() => alignLayers('bottom')} className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${darkMode ? 'hover:bg-slate-700 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-400'}`} title={t.alignBottom}><AlignEndVertical size={12} className="rotate-90"/></button>
                    </div>
                  </div>
                )}

                <div className={`p-2.5 rounded-xl ${darkMode ? 'bg-slate-800/40' : 'bg-zinc-50/60'} space-y-2.5`}>
                  <span className="text-[9px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{t.layerOrder}</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => moveLayer(selectedLayer.id, 'top')} className={`py-1.5 rounded-lg text-[9px] font-semibold flex items-center justify-center gap-1 uppercase active:scale-95 ${darkMode ? 'bg-slate-800/60 border border-slate-700/50 text-zinc-300' : 'bg-white border border-zinc-100 text-zinc-500'}`}><ArrowUpToLine size={12}/>{t.bringFront}</button>
                    <button onClick={() => moveLayer(selectedLayer.id, 'bottom')} className={`py-1.5 rounded-lg text-[9px] font-semibold flex items-center justify-center gap-1 uppercase active:scale-95 ${darkMode ? 'bg-slate-800/60 border border-slate-700/50 text-zinc-300' : 'bg-white border border-zinc-100 text-zinc-500'}`}><ArrowDownToLine size={12}/>{t.sendBack}</button>
                    <button onClick={() => moveLayer(selectedLayer.id, 'up')} className={`py-1.5 rounded-lg text-[9px] font-semibold flex items-center justify-center gap-1 uppercase active:scale-95 ${darkMode ? 'bg-slate-800/60 border border-slate-700/50 text-zinc-300' : 'bg-white border border-zinc-100 text-zinc-500'}`}>{t.moveUp}</button>
                    <button onClick={() => moveLayer(selectedLayer.id, 'down')} className={`py-1.5 rounded-lg text-[9px] font-semibold flex items-center justify-center gap-1 uppercase active:scale-95 ${darkMode ? 'bg-slate-800/60 border border-slate-700/50 text-zinc-300' : 'bg-white border border-zinc-100 text-zinc-500'}`}>{t.moveDown}</button>
                  </div>
                </div>

                <SectionHeader title={t.transform}>
                  <div className="space-y-4 pt-1">
                    <PropertySlider label="缩放" value={selectedLayer.scale} min={0.01} max={5} step={0.01} onChange={(v) => updateBatchLayers({ scale: v } as Partial<Layer>)} />
                    <PropertySlider label="旋转" value={selectedLayer.rotate} min={-180} max={180} onChange={(v) => updateBatchLayers({ rotate: v } as Partial<Layer>)} />
                    <PropertySlider label={t.opacity} value={selectedLayer.opacity} min={0} max={1} step={0.05} onChange={(v) => updateBatchLayers({ opacity: v } as Partial<Layer>)} />
                  </div>
                </SectionHeader>
                
                {selectedLayer.type === 'text' && (
                  <SectionHeader title={t.typography}>
                    <div className="space-y-4 pt-1">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400">{t.font}</span>
                          <button onClick={() => fontInputRef.current?.click()} className="text-[9px] text-indigo-600 hover:underline flex items-center gap-1 font-black uppercase"><UploadCloud size={10}/> {t.uploadFont}</button>
                        </div>
                        <select value={selectedLayer.fontFamily} onChange={(e) => updateBatchLayers({ fontFamily: e.target.value } as Partial<Layer>)} 
                          className={`w-full border rounded-xl px-3 py-2 text-[11px] font-semibold outline-none transition-all cursor-pointer appearance-none
                            ${darkMode ? 'bg-slate-800/80 border-slate-600 text-slate-200 hover:border-slate-500 focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 focus:border-indigo-500'}`}
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
                        >
                          {allFonts.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => {
                          const current = parseInt(selectedLayer.fontWeight);
                          const next = current >= 700 ? '400' : '900';
                          updateBatchLayers({ fontWeight: next } as Partial<Layer>);
                        }} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-1.5 transition-all ${parseInt(selectedLayer.fontWeight) >= 700 
                          ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' 
                          : `${darkMode ? 'bg-slate-800 border border-slate-700 text-slate-400' : 'bg-white border border-slate-100 text-slate-400'}`}`}>
                          <Bold size={13}/> Bold
                        </button>
                        <button onClick={() => {
                          const isItalic = (selectedLayer as any).fontStyle === 'italic';
                          updateBatchLayers({ fontStyle: isItalic ? 'normal' : 'italic' } as Partial<Layer>);
                        }} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-1.5 transition-all ${(selectedLayer as any).fontStyle === 'italic'
                          ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' 
                          : `${darkMode ? 'bg-slate-800 border border-slate-700 text-slate-400' : 'bg-white border border-slate-100 text-slate-400'}`}`}>
                          <Italic size={13}/> Italic
                        </button>
                      </div>
                      <PropertySlider label="字号" value={selectedLayer.fontSize} min={8} max={500} onChange={(v) => updateBatchLayers({ fontSize: v } as Partial<Layer>)} />
                      <PropertySlider label={t.spacing} value={selectedLayer.letterSpacing} min={-40} max={100} onChange={(v) => updateBatchLayers({ letterSpacing: v } as Partial<Layer>)} />
                      <PropertySlider label={t.lineHeight} value={selectedLayer.lineHeight} min={0.2} max={4} step={0.1} onChange={(v) => updateBatchLayers({ lineHeight: v } as Partial<Layer>)} />
                      <ColorPicker 
                        label={t.color} 
                        value={selectedLayer.color ?? '#000000'} 
                        onChange={(v) => { updateBatchLayers({ color: v } as Partial<Layer>); addRecentColor(v); }}
                        recentColors={recentColors}
                        onPresetClick={(v) => { updateBatchLayers({ color: v } as Partial<Layer>); addRecentColor(v); }}
                      />
                    </div>
                  </SectionHeader>
                )}

                {selectedLayer.type === 'image' && (
                  <SectionHeader title={t.appearance}>
                    <div className="space-y-4 pt-1">
                      <button onClick={handleReplaceImage} className={`w-full py-1.5 rounded-lg text-[9px] font-semibold uppercase flex items-center justify-center gap-1.5 transition-all ${darkMode ? 'bg-slate-800/50 border border-slate-700/50 text-zinc-400 hover:bg-slate-700/60' : 'bg-zinc-50 border border-zinc-100 text-zinc-500 hover:bg-zinc-100'}`}>
                        <UploadCloud size={14}/> {t.replaceImg}
                      </button>
                      <PropertySlider label="宽度" value={(selectedLayer as any).imgWidth ?? 400} min={20} max={4000} onChange={(v) => updateBatchLayers({ imgWidth: v } as any)} />
                      <PropertySlider label="高度" value={(selectedLayer as any).imgHeight ?? 300} min={20} max={4000} onChange={(v) => updateBatchLayers({ imgHeight: v } as any)} />
                      <PropertySlider label="圆角" value={selectedLayer.borderRadius} min={0} max={1000} onChange={(v) => updateBatchLayers({ borderRadius: v } as Partial<Layer>)} />
                      <PropertySlider label="模糊" value={(selectedLayer as any).blur ?? 0} min={0} max={30} onChange={(v) => updateBatchLayers({ blur: v } as any)} />
                      <PropertySlider label="黑白" value={(selectedLayer as any).grayscale ?? 0} min={0} max={100} onChange={(v) => updateBatchLayers({ grayscale: v } as any)} />
                    </div>
                  </SectionHeader>
                )}

                {(selectedLayer.type === 'rect' || selectedLayer.type === 'circle') && (
                  <SectionHeader title={t.color}>
                    <div className="space-y-4 pt-1">
                      <ColorPicker 
                        label="填充色" 
                        value={(selectedLayer as any).color ?? '#000000'} 
                        onChange={(v) => { updateBatchLayers({ color: v } as any); addRecentColor(v); }}
                        recentColors={recentColors}
                        onPresetClick={(v) => { updateBatchLayers({ color: v } as any); addRecentColor(v); }}
                      />
                      {selectedLayer.type === 'rect' && (
                        <>
                          <PropertySlider label="宽度" value={(selectedLayer as any).width ?? 200} min={10} max={2000} onChange={(v) => updateBatchLayers({ width: v } as any)} />
                          <PropertySlider label="高度" value={(selectedLayer as any).height ?? 200} min={10} max={2000} onChange={(v) => updateBatchLayers({ height: v } as any)} />
                          <PropertySlider label="圆角" value={(selectedLayer as any).borderRadius ?? 0} min={0} max={500} onChange={(v) => updateBatchLayers({ borderRadius: v } as any)} />
                        </>
                      )}
                      {selectedLayer.type === 'circle' && (
                        <PropertySlider label="大小" value={(selectedLayer as any).width ?? 200} min={10} max={2000} onChange={(v) => updateBatchLayers({ width: v } as any)} />
                      )}
                    </div>
                  </SectionHeader>
                )}
              </div>
            ) : (
              <div className="space-y-8 text-center p-6 mt-6">
                 <div className={`border-4 border-double rounded-[2.5rem] py-14 flex flex-col items-center ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white mb-5 shadow-2xl rotate-3"><PaletteIcon size={28}/></div>
                    <p className="text-[10px] font-black text-slate-400 leading-relaxed uppercase tracking-[0.25em]">{t.emptyTitle}<br/>{t.emptySubtitle}</p>
                 </div>
                 <div className="space-y-4 pt-4 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">快捷键</label>
                    <div className={`space-y-1.5 text-[9px] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      <div className="flex justify-between"><span>撤销 / 重做</span><span className="font-mono font-bold">⌘Z / ⌘⇧Z</span></div>
                      <div className="flex justify-between"><span>复制图层</span><span className="font-mono font-bold">⌘D</span></div>
                      <div className="flex justify-between"><span>删除图层</span><span className="font-mono font-bold">DEL</span></div>
                      <div className="flex justify-between"><span>微调位置</span><span className="font-mono font-bold">↑↓←→</span></div>
                      <div className="flex justify-between"><span>大步移动</span><span className="font-mono font-bold">⇧ + ↑↓←→</span></div>
                      <div className="flex justify-between"><span>预览</span><span className="font-mono font-bold">P</span></div>
                      <div className="flex justify-between"><span>取消选择</span><span className="font-mono font-bold">ESC</span></div>
                      <div className="flex justify-between"><span>滚轮缩放</span><span className="font-mono font-bold">Scroll</span></div>
                      <div className="flex justify-between"><span>拖动画布</span><span className="font-mono font-bold">Space + 拖动</span></div>
                      <div className="flex justify-between"><span>右键菜单</span><span className="font-mono font-bold">Right Click</span></div>
                    </div>
                  </div>
              </div>
            )}
          </aside>
        )}
      </div>

      {isExporting && (
        <div className="fixed inset-0 z-[400] bg-white/95 dark:bg-[#0F1117]/95 backdrop-blur-xl flex items-center justify-center">
          <div className={`p-12 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)] border scale-110 text-center ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <p className="text-sm font-black text-black dark:text-white uppercase tracking-[0.3em] animate-pulse">{t.exporting}</p>
          </div>
        </div>
      )}

      {contextMenu && (() => {
        const layer = layers.find(l => l.id === contextMenu.layerId);
        if (!layer) return null;
        return (
          <div 
            className="fixed z-[500] py-2 min-w-[180px] rounded-2xl shadow-2xl border backdrop-blur-xl animate-in fade-in"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-slate-800/95 border-slate-700' : 'bg-white/95 border-slate-200'}`}>
              <button onClick={() => { duplicateSelected(); setContextMenu(null); }} className={`w-full text-left px-4 py-2.5 text-[11px] font-semibold flex items-center gap-3 transition-colors ${darkMode ? 'hover:bg-slate-700 text-zinc-200' : 'hover:bg-zinc-50 text-zinc-700'}`}><CopyPlus size={14}/> {t.duplicate}</button>
              <button onClick={() => { moveLayer(contextMenu.layerId, 'top'); setContextMenu(null); }} className={`w-full text-left px-4 py-2.5 text-[11px] font-semibold flex items-center gap-3 transition-colors ${darkMode ? 'hover:bg-slate-700 text-zinc-200' : 'hover:bg-zinc-50 text-zinc-700'}`}><ArrowUpToLine size={14}/> {t.bringFront}</button>
              <button onClick={() => { moveLayer(contextMenu.layerId, 'bottom'); setContextMenu(null); }} className={`w-full text-left px-4 py-2.5 text-[11px] font-semibold flex items-center gap-3 transition-colors ${darkMode ? 'hover:bg-slate-700 text-zinc-200' : 'hover:bg-zinc-50 text-zinc-700'}`}><ArrowDownToLine size={14}/> {t.sendBack}</button>
              <div className={`my-1 border-t ${darkMode ? 'border-slate-700' : 'border-slate-100'}`} />
              <button onClick={() => { toggleLayerStatus(contextMenu.layerId, 'isLocked'); setContextMenu(null); }} className={`w-full text-left px-4 py-2.5 text-[11px] font-semibold flex items-center gap-3 transition-colors ${darkMode ? 'hover:bg-slate-700 text-zinc-200' : 'hover:bg-zinc-50 text-zinc-700'}`}>{layer.isLocked ? <><Unlock size={14}/> {t.unlock}</> : <><Lock size={14}/> {t.lock}</>}</button>
              <button onClick={() => { toggleLayerStatus(contextMenu.layerId, 'isVisible'); setContextMenu(null); }} className={`w-full text-left px-4 py-2.5 text-[11px] font-semibold flex items-center gap-3 transition-colors ${darkMode ? 'hover:bg-slate-700 text-zinc-200' : 'hover:bg-zinc-50 text-zinc-700'}`}>{layer.isVisible ? <><EyeOff size={14}/> {t.hide}</> : <><Eye size={14}/> {t.show}</>}</button>
              <div className={`my-1 border-t ${darkMode ? 'border-slate-700' : 'border-slate-100'}`} />
              <button onClick={() => { deleteSelected(); setContextMenu(null); }} className="w-full text-left px-4 py-2.5 text-[11px] font-semibold flex items-center gap-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 size={14}/> {t.delete}</button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default App;
