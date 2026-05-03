// ============================================================
// DesignEasy Pro — Layer & Canvas Type Definitions
// ============================================================

export type LayerType = 'text' | 'image' | 'rect' | 'circle';

// --- Base Layer ---
export interface BaseLayer {
  id: string;
  type: LayerType;
  x: number;       // X position (% of canvas width)
  y: number;       // Y position (% of canvas height)
  scale: number;   // Legacy uniform scale (kept for backward compat)
  scaleX?: number; // Independent X scale (defaults to 1)
  scaleY?: number; // Independent Y scale (defaults to 1)
  rotate: number;  // Rotation (degrees)
  opacity: number; // Opacity 0-1
  isLocked: boolean;
  isVisible: boolean;
}

// --- Text Layer ---
export interface TextLayer extends BaseLayer {
  type: 'text';
  content: string;      // Text content
  fontSize: number;     // Font size
  fontFamily: string;   // CSS font stack
  fontWeight: string;   // e.g. '400', '900'
  color: string;        // Text color (hex)
  letterSpacing: number;
  lineHeight: number;
  textAlign: 'left' | 'center' | 'right';
  italic?: boolean;
  underline?: boolean;
  grayscale?: number;   // 0-100
}

// --- Image Layer ---
export interface ImageLayer extends BaseLayer {
  type: 'image';
  content: string;      // URL or data URI
  borderRadius: number;
  grayscale: number;    // 0-100 filter
  flipH?: boolean;
  flipV?: boolean;
}

// --- Rect Layer ---
export interface RectLayer extends BaseLayer {
  type: 'rect';
  content: string;      // Fill color (hex)
  width: number;        // % of canvas width
  height: number;       // % of canvas height
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
}

// --- Circle Layer ---
export interface CircleLayer extends BaseLayer {
  type: 'circle';
  content: string;      // Fill color (hex)
  borderRadius: number; // for clipping if needed
  borderWidth: number;
  borderColor: string;
}

// --- Union Type ---
export type Layer = TextLayer | ImageLayer | RectLayer | CircleLayer;

// --- Template ---
export interface AspectRatio {
  id: string;
  name: string;
  value: number;        // height/width ratio
  label: string;
}

export interface Template {
  id: string;
  name: string;
  ratio: AspectRatio;
  bg: string;            // Background color
  layers: Layer[];
}

// --- Canvas State ---
export interface CanvasState {
  layers: Layer[];
  selectedIds: string[];
  canvasBg: string;
  templateId: string | null;
}

// --- History Entry ---
export interface HistoryEntry {
  layers: Layer[];
  selectedIds: string[];
  canvasBg: string;
}

// --- Export Options ---
export interface ExportOptions {
  format: 'png' | 'jpg' | 'svg';
  quality: number;      // 0-1 (for jpg)
  width?: number;
  height?: number;
}

// --- Font ---
export interface FontEntry {
  name: string;
  value: string;        // CSS font-family value
}

// --- Color Preset ---
export interface ColorPreset {
  hex: string;
  name?: string;
}

// --- i18n ---
export type Lang = 'zh' | 'en';

export interface Translations {
  [key: string]: string;
}

export type TranslationMap = Record<Lang, Translations>;