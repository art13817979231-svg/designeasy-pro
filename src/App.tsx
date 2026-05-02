import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
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

// --- 1. 静态配置与字库 ---

const BUILTIN_FONTS = [
  // Sans-serif
  { name: 'Inter', value: '"Inter", system-ui, sans-serif' },
  { name: 'Roboto', value: '"Roboto", sans-serif' },
  { name: 'Open Sans', value: '"Open Sans", sans-serif' },
  { name: 'Lato', value: '"Lato", sans-serif' },
  { name: 'Montserrat', value: '"Montserrat", sans-serif' },
  { name: 'Oswald', value: '"Oswald", sans-serif' },
  { name: 'Raleway', value: '"Raleway", sans-serif' },
  { name: 'Poppins', value: '"Poppins", sans-serif' },
  { name: 'Nunito', value: '"Nunito", sans-serif' },
  { name: 'Source Sans', value: '"Source Sans Pro", sans-serif' },
  { name: 'PT Sans', value: '"PT Sans", sans-serif' },
  { name: 'Ubuntu', value: '"Ubuntu", sans-serif' },
  { name: 'Fira Sans', value: '"Fira Sans", sans-serif' },
  { name: 'Work Sans', value: '"Work Sans", sans-serif' },
  { name: 'Mulish', value: '"Mulish", sans-serif' },
  { name: 'Noto Sans', value: '"Noto Sans", sans-serif' },
  // Serif
  { name: 'Playfair Display', value: '"Playfair Display", serif' },
  { name: 'Merriweather', value: '"Merriweather", serif' },
  { name: 'Lora', value: '"Lora", serif' },
  { name: 'Crimson Text', value: '"Crimson Text", serif' },
  { name: 'Libre Baskerville', value: '"Libre Baskerville", serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Times New Roman', value: '"Times New Roman", serif' },
  { name: 'PT Serif', value: '"PT Serif", serif' },
  { name: 'Source Serif', value: '"Source Serif Pro", serif' },
  // Display/Decorative
  { name: 'Bebas Neue', value: '"Bebas Neue", cursive' },
  { name: 'Abril Fatface', value: '"Abril Fatface", cursive' },
  { name: 'Lobster', value: '"Lobster", cursive' },
  { name: 'Pacifico', value: '"Pacifico", cursive' },
  { name: 'Dancing Script', value: '"Dancing Script", cursive' },
  { name: 'Satisfy', value: '"Satisfy", cursive' },
  { name: 'Righteous', value: '"Righteous", cursive' },
  { name: 'Alfa Slab', value: '"Alfa Slab One", cursive' },
  { name: 'Anton', value: '"Anton", sans-serif' },
  { name: 'Bungee', value: '"Bungee", cursive' },
  // Monospace
  { name: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
  { name: 'Fira Code', value: '"Fira Code", monospace' },
  { name: 'Source Code', value: '"Source Code Pro", monospace' },
  { name: 'Inconsolata', value: '"Inconsolata", monospace' },
  { name: 'Roboto Mono', value: '"Roboto Mono", monospace' },
  { name: 'Courier New', value: '"Courier New", monospace' },
  // Chinese fonts
  { name: '微软雅黑', value: '"Microsoft YaHei", sans-serif' },
  { name: '微软雅黑 Bold', value: '"Microsoft YaHei", "Microsoft YaHei Bold", sans-serif' },
  { name: '黑体', value: 'SimHei, "STHeiti", sans-serif' },
  { name: '宋体', value: 'SimSun, "STSong", serif' },
  { name: '楷体', value: 'KaiTi, "STKaiti", serif' },
  { name: '仿宋', value: 'FangSong, "STFangsong", serif' },
  { name: '幼圆', value: 'YouYuan, sans-serif' },
  { name: '华文黑体', value: '"STHeiti", sans-serif' },
  { name: '华文宋体', value: '"STSong", serif' },
  { name: '华文楷体', value: '"STKaiti", serif' },
  { name: '华文仿宋', value: '"STFangsong", serif' },
  { name: '思源黑体', value: '"Source Han Sans SC", "Noto Sans SC", sans-serif' },
  { name: '思源宋体', value: '"Source Han Serif SC", "Noto Serif SC", serif' },
  { name: '苹方', value: '"PingFang SC", sans-serif' },
  { name: '苹方-简', value: '"PingFang SC Regular", sans-serif' },
  { name: '苹方-中', value: '"PingFang SC Medium", sans-serif' },
  { name: '苹方-粗', value: '"PingFang SC Semibold", sans-serif' },
];

const ASPEC_RATIOS = [
  { id: 'r1', name: '1:1', value: 1, label: "Square" }, 
  { id: 'r2', name: '3:4', value: 4/3, label: "Magazine" }, 
  { id: 'r3', name: '9:16', value: 16/9, label: "Poster" }, 
  { id: 'r4', name: '16:9', value: 9/16, label: "Hero" }
];

const COLOR_PRESETS = [
  '#000000', '#FFFFFF', '#FF3B00', '#D4AF37', '#00FFC8', '#FF00E5',
  '#1A1A2E', '#16213E', '#0F3460', '#E94560', '#533483', '#2C3E50',
  '#E74C3C', '#E67E22', '#F1C40F', '#2ECC71', '#1ABC9C', '#3498DB',
  '#8E7D6B', '#A89888', '#B0A090', '#EDE8E0', '#F5F0E8', '#F2E6D4',
  '#6B5B3E', '#8B4513', '#2C2C2C', '#444444', '#666666', '#999999',
];

const TEMPLATES = [
  // ========== T1: 瑞士建筑 (Swiss Grid) — 3:4 白底 ==========
  {
    id: 't1',
    name: '瑞士建筑',
    ratio: ASPEC_RATIOS[1],
    bg: '#FFFFFF',
    layers: [
      { id: 'l1', type: 'text', content: 'ARCH', x: 50, y: 15, fontSize: 180, color: '#000000', rotate: 0, scale: 1, fontWeight: '900', fontFamily: '"Inter", sans-serif', letterSpacing: -15, lineHeight: 0.8, isLocked: false, isVisible: true },
      { id: 'l2', type: 'text', content: 'MINIMALISM / 2024', x: 50, y: 32, fontSize: 12, color: '#FF3B00', rotate: 0, scale: 1, fontWeight: '800', fontFamily: '"Syncopate", sans-serif', letterSpacing: 8, lineHeight: 1, isLocked: false, isVisible: true },
      { id: 'img1', type: 'image', content: '/img/arch.svg', x: 50, y: 62, scale: 0.75, rotate: 0, opacity: 1, borderRadius: 0, isLocked: false, isVisible: true },
      { id: 'l3', type: 'text', content: 'A systematic approach to modern design.', x: 50, y: 92, fontSize: 10, color: '#666', rotate: 0, scale: 1, fontWeight: '400', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 1, lineHeight: 1.5, isLocked: false, isVisible: true }
    ]
  },

  // ========== T2: 时尚封面 (Luxe Cover) — 3:4 深色 ==========
  {
    id: 't2',
    name: '时尚封面',
    ratio: ASPEC_RATIOS[1],
    bg: '#0F0F0F',
    layers: [
      { id: 'img1', type: 'image', content: '/img/luxe.svg', x: 50, y: 50, scale: 1.2, rotate: 0, opacity: 0.7, borderRadius: 0, isLocked: false, isVisible: true },
      { id: 'l1', type: 'text', content: 'ETERNITY', x: 50, y: 45, fontSize: 100, color: '#FFFFFF', rotate: 0, scale: 1, fontWeight: '400', fontFamily: '"Playfair Display", serif', letterSpacing: 12, lineHeight: 1, isLocked: false, isVisible: true },
      { id: 'l2', type: 'text', content: 'THE WINTER ISSUE', x: 50, y: 88, fontSize: 12, color: '#D4AF37', rotate: 0, scale: 1, fontWeight: '700', fontFamily: '"Montserrat", sans-serif', letterSpacing: 10, lineHeight: 1, isLocked: false, isVisible: true }
    ]
  },

  // ========== T3: 赛博霓虹 (Neon Cyber) — 9:16 竖版海报 ==========
  {
    id: 't3',
    name: '赛博霓虹',
    ratio: ASPEC_RATIOS[2],
    bg: '#0A0A0A',
    layers: [
      { id: 'img1', type: 'image', content: '/img/cyber.svg', x: 50, y: 40, scale: 0.9, rotate: 0, opacity: 0.4, borderRadius: 0, grayscale: 80, isLocked: false, isVisible: true },
      { id: 'l1', type: 'text', content: 'CYBER', x: 50, y: 25, fontSize: 120, color: '#00FFC8', rotate: -3, scale: 1, fontWeight: '900', fontFamily: '"Bebas Neue", cursive', letterSpacing: 20, lineHeight: 0.9, isLocked: false, isVisible: true },
      { id: 'l2', type: 'text', content: 'NEON', x: 50, y: 40, fontSize: 120, color: '#FF00E5', rotate: 2, scale: 1, fontWeight: '900', fontFamily: '"Bebas Neue", cursive', letterSpacing: 20, lineHeight: 0.9, isLocked: false, isVisible: true },
      { id: 'l3', type: 'text', content: '2087 // TOKYO', x: 50, y: 55, fontSize: 10, color: '#00FFC8', rotate: 0, scale: 1, fontWeight: '700', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 6, lineHeight: 1, isLocked: false, isVisible: true },
      { id: 'l4', type: 'text', content: 'ENTER THE GRID', x: 50, y: 90, fontSize: 14, color: '#FFFFFF', rotate: 0, scale: 1, fontWeight: '800', fontFamily: '"Inter", sans-serif', letterSpacing: 12, lineHeight: 1, isLocked: false, isVisible: true }
    ]
  },

  // ========== T4: 莫兰迪花艺 (Morandi Bloom) — 1:1 方形 ==========
  {
    id: 't4',
    name: '莫兰迪花艺',
    ratio: ASPEC_RATIOS[0],
    bg: '#EDE8E0',
    layers: [
      { id: 'img1', type: 'image', content: '/img/bloom.svg', x: 50, y: 55, scale: 1.1, rotate: 0, opacity: 0.85, borderRadius: 24, grayscale: 20, isLocked: false, isVisible: true },
      { id: 'l1', type: 'text', content: 'Spring', x: 50, y: 15, fontSize: 72, color: '#8B7D6B', rotate: -2, scale: 1, fontWeight: '400', fontFamily: '"Playfair Display", serif', letterSpacing: 4, lineHeight: 1, isLocked: false, isVisible: true },
      { id: 'l2', type: 'text', content: '静物与花艺', x: 50, y: 26, fontSize: 14, color: '#A89888', rotate: 0, scale: 1, fontWeight: '400', fontFamily: '"思源黑体 Bold", sans-serif', letterSpacing: 8, lineHeight: 1, isLocked: false, isVisible: true },
      { id: 'l3', type: 'text', content: '— A study in muted tones —', x: 50, y: 92, fontSize: 10, color: '#B0A090', rotate: 0, scale: 1, fontWeight: '400', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 2, lineHeight: 1, isLocked: false, isVisible: true }
    ]
  },

  // ========== T5: 极简黑标 (Bold Black) — 16:9 横幅 ==========
  {
    id: 't5',
    name: '极简黑标',
    ratio: ASPEC_RATIOS[3],
    bg: '#FAFAFA',
    layers: [
      { id: 'l1', type: 'text', content: 'BRUTALIST', x: 15, y: 55, fontSize: 140, color: '#000000', rotate: 0, scale: 1, fontWeight: '900', fontFamily: '"Inter", sans-serif', letterSpacing: -8, lineHeight: 0.85, isLocked: false, isVisible: true },
      { id: 'l2', type: 'text', content: 'DESIGN', x: 78, y: 55, fontSize: 140, color: '#000000', rotate: 0, scale: 1, fontWeight: '900', fontFamily: '"Inter", sans-serif', letterSpacing: -8, lineHeight: 0.85, isLocked: false, isVisible: true },
      { id: 'l3', type: 'text', content: 'FORM FOLLOWS FUNCTION', x: 15, y: 85, fontSize: 10, color: '#999', rotate: 0, scale: 1, fontWeight: '600', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 5, lineHeight: 1, isLocked: false, isVisible: true },
      { id: 'l4', type: 'text', content: '2025', x: 90, y: 15, fontSize: 60, color: '#E5E5E5', rotate: 0, scale: 1, fontWeight: '900', fontFamily: '"Inter", sans-serif', letterSpacing: -4, lineHeight: 0.85, isLocked: false, isVisible: true }
    ]
  },

  // ========== T6: 水墨意境 (Ink Wash) — 3:4 中国风 ==========
  {
    id: 't6',
    name: '水墨意境',
    ratio: ASPEC_RATIOS[1],
    bg: '#F5F0E8',
    layers: [
      { id: 'img1', type: 'image', content: '/img/ink.svg', x: 50, y: 55, scale: 1.0, rotate: 0, opacity: 0.7, borderRadius: 0, grayscale: 40, isLocked: false, isVisible: true },
      { id: 'l1', type: 'text', content: '山水之间', x: 50, y: 20, fontSize: 80, color: '#2C2C2C', rotate: 0, scale: 1, fontWeight: '400', fontFamily: '"中式楷体", serif', letterSpacing: 20, lineHeight: 1.2, isLocked: false, isVisible: true },
      { id: 'l2', type: 'text', content: 'BETWEEN MOUNTAINS AND WATER', x: 50, y: 33, fontSize: 8, color: '#8C8C8C', rotate: 0, scale: 1, fontWeight: '600', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 4, lineHeight: 1, isLocked: false, isVisible: true },
      { id: 'l3', type: 'text', content: '留白是一种语言', x: 50, y: 90, fontSize: 12, color: '#6B6B6B', rotate: 0, scale: 1, fontWeight: '400', fontFamily: '"思源黑体 Bold", sans-serif', letterSpacing: 6, lineHeight: 1, isLocked: false, isVisible: true }
    ]
  },

  // ========== T7: 复古唱片 (Retro Vinyl) — 1:1 方形暖色 ==========
  {
    id: 't7',
    name: '复古唱片',
    ratio: ASPEC_RATIOS[0],
    bg: '#F2E6D4',
    layers: [
      { id: 'img1', type: 'image', content: '/img/vinyl.svg', x: 50, y: 48, scale: 0.85, rotate: 0, opacity: 1, borderRadius: 0, isLocked: false, isVisible: true },
      { id: 'l1', type: 'text', content: 'GOLDEN ERA', x: 50, y: 18, fontSize: 52, color: '#8B4513', rotate: 0, scale: 1, fontWeight: '900', fontFamily: '"Abril Fatface", cursive', letterSpacing: 3, lineHeight: 1, isLocked: false, isVisible: true },
      { id: 'l2', type: 'text', content: 'VINYL COLLECTION VOL. III', x: 50, y: 26, fontSize: 8, color: '#A0805A', rotate: 0, scale: 1, fontWeight: '600', fontFamily: '"Montserrat", sans-serif', letterSpacing: 5, lineHeight: 1, isLocked: false, isVisible: true },
      { id: 'l3', type: 'text', content: '1968 — 1974', x: 50, y: 88, fontSize: 10, color: '#6B5B3E', rotate: 0, scale: 1, fontWeight: '400', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 4, lineHeight: 1, isLocked: false, isVisible: true }
    ]
  },

  // ========== T8: 科技发布会 (Tech Launch) — 9:16 竖版深色 ==========
  {
    id: 't8',
    name: '科技发布会',
    ratio: ASPEC_RATIOS[2],
    bg: '#000000',
    layers: [
      { id: 'img1', type: 'image', content: '/img/tech.svg', x: 50, y: 60, scale: 0.7, rotate: 0, opacity: 0.6, borderRadius: 20, isLocked: false, isVisible: true },
      { id: 'l1', type: 'text', content: 'NEXT', x: 50, y: 20, fontSize: 100, color: '#FFFFFF', rotate: 0, scale: 1, fontWeight: '900', fontFamily: '"Inter", sans-serif', letterSpacing: -5, lineHeight: 0.9, isLocked: false, isVisible: true },
      { id: 'l2', type: 'text', content: 'GEN', x: 50, y: 33, fontSize: 100, color: '#FFFFFF', rotate: 0, scale: 1, fontWeight: '200', fontFamily: '"Inter", sans-serif', letterSpacing: -5, lineHeight: 0.9, isLocked: false, isVisible: true },
      { id: 'l3', type: 'text', content: 'AI-POWERED EXPERIENCE', x: 50, y: 48, fontSize: 8, color: '#00D4FF', rotate: 0, scale: 1, fontWeight: '700', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 6, lineHeight: 1, isLocked: false, isVisible: true },
      { id: 'l4', type: 'text', content: 'OCTOBER 2025', x: 50, y: 92, fontSize: 10, color: '#444', rotate: 0, scale: 1, fontWeight: '600', fontFamily: '"Inter", sans-serif', letterSpacing: 4, lineHeight: 1, isLocked: false, isVisible: true }
    ]
  }
];

const translations = {
  zh: { 
    title: "DE.", addText: "文字", addImg: "媒体", addRect: "矩形", addCircle: "圆形", export: "导出", settings: "设置", layers: "图层", templates: "审美中心", 
    preview: "预览", reset: "重置", delete: "删除", duplicate: "克隆", typography: "排版", appearance: "滤镜", 
    inspect: "元素属性", canvas: "画布设置", exporting: "正在渲染...", exitPreview: "退出预览",
    layerOrder: "层级顺序", bringFront: "置顶", sendBack: "置底", moveUp: "上移", moveDown: "下移",
    font: "字体", uploadFont: "上传", spacing: "字间距", lineHeight: "行高", opacity: "透明度", 
    lock: "锁定", unlock: "解锁", hide: "隐藏", show: "显示",
    align: "对齐", alignHCenter: "水平居中", alignVCenter: "垂直居中",
    alignLeft: "左对齐", alignRight: "右对齐", alignTop: "顶部", alignBottom: "底部",
    color: "颜色", recentColors: "最近使用", presetColors: "预设色板",
    emptyTitle: "选择一个模板", emptySubtitle: "开始你的设计",
    exportPng: "PNG 图片", exportJpg: "JPG 图片", exportSvg: "SVG 矢量",
    transform: "画面变换", replaceImg: "替换图片",
    grid: "网格", darkMode: "深色",
  },
  en: { 
    title: "DE.", addText: "Text", addImg: "Media", addRect: "Rect", addCircle: "Circle", export: "Export", settings: "Settings", layers: "Layers", templates: "Curation", 
    preview: "Preview", reset: "Reset", delete: "Delete", duplicate: "Clone", typography: "Typography", appearance: "Filters", 
    inspect: "Inspector", canvas: "Canvas", exporting: "Rendering...", exitPreview: "Exit",
    layerOrder: "Ordering", bringFront: "Front", sendBack: "Back", moveUp: "Up", moveDown: "Down",
    font: "Font Family", uploadFont: "Upload", spacing: "Spacing", lineHeight: "Line", opacity: "Opacity", 
    lock: "Lock", unlock: "Unlock", hide: "Hide", show: "Show",
    align: "Align", alignHCenter: "H Center", alignVCenter: "V Center",
    alignLeft: "Left", alignRight: "Right", alignTop: "Top", alignBottom: "Bottom",
    color: "Color", recentColors: "Recent", presetColors: "Presets",
    emptyTitle: "Pick a template", emptySubtitle: "to start designing",
    exportPng: "PNG Image", exportJpg: "JPG Image", exportSvg: "SVG Vector",
    transform: "Transform", replaceImg: "Replace",
    grid: "Grid", darkMode: "Dark",
  },
};

// --- 2. 辅助子组件 (Memoized) ---

const ToolIcon = memo(({ icon, active, onClick, label }) => (
  <button 
    onClick={onClick} 
    className={`w-10 h-10 group relative rounded-2xl transition-all duration-200 flex items-center justify-center
      ${active 
        ? 'bg-slate-600 dark:bg-white text-white dark:text-slate-700 shadow-lg shadow-black/10 scale-[1.05]' 
        : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10 hover:shadow-lg hover:shadow-black/5'
      }`}
  >
    {icon}
    {label && <div className="absolute left-[52px] px-3 py-1.5 bg-black/90 dark:bg-white/90 text-[10px] font-semibold text-white dark:text-slate-700 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-150 z-[500] whitespace-nowrap pointer-events-none border border-white/10">{label}</div>}
  </button>
));

const PropertySlider = memo(({ label, value, min, max, step = 1, onChange }) => {
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
        {/* Track background */}
        <div className="absolute inset-x-0 h-[3px] rounded-full bg-zinc-200/80 dark:bg-zinc-700/50" />
        {/* Filled portion */}
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

const ColorPicker = memo(({ label, value, onChange, recentColors, onPresetClick }) => (
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

const SectionHeader = memo(({ title, defaultOpen = true, onToggle, children }) => {
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

const ChevronIcon = memo(({ open }) => (
  <svg className={`w-3.5 h-3.5 text-slate-300 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/></svg>
));

const LayerItem = memo(({ layer, isSelected, isPreview, onStartDrag, onStartResize, onUpdateContent, index, showGrid, onDoubleClick, onContextMenu }) => {
  if (!layer.isVisible) return null;
  
  return (
    <div 
      onMouseDown={(e) => onStartDrag(e, layer.id)} 
      onDoubleClick={() => onDoubleClick?.(layer.id)}
      onContextMenu={(e) => { e.preventDefault(); onContextMenu?.(e, layer.id); }}
      className={`absolute select-none ${!isPreview && isSelected ? 'z-50 cursor-move' : 'hover:cursor-move'} ${layer.isLocked ? 'cursor-not-allowed' : ''}`} 
      style={{ 
        left: `${layer.x}%`, top: `${layer.y}%`, 
        transform: `translate(-50%, -50%) rotate(${layer.rotate ?? 0}deg) scale(${layer.scale ?? 1})`, 
        zIndex: index, opacity: layer.opacity ?? 1,
        outline: !isPreview && isSelected ? '1px dashed var(--selection-ring)' : 'none',
        outlineOffset: '3px',
        boxShadow: !isPreview && isSelected ? `0 8px 32px var(--selection-glow)` : 'none',
        borderRadius: '2px',
      }}
    >
      {!isPreview && isSelected && !layer.isLocked && (
        <>
          {/* Corner resize handles */}
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
        <div style={{ fontSize: `${layer.fontSize}px`, color: layer.color, fontWeight: layer.fontWeight, fontFamily: layer.fontFamily, fontStyle: layer.fontStyle ?? 'normal', letterSpacing: `${layer.letterSpacing ?? 0}px`, lineHeight: layer.lineHeight ?? 1.2 }} 
          className="whitespace-nowrap px-6 py-2 outline-none text-center" 
          contentEditable={!isPreview && isSelected && !layer.isLocked} 
          onBlur={(e) => onUpdateContent(layer.id, { content: e.target.innerText })} 
          suppressContentEditableWarning={true}>{layer.content}</div>
      ) : layer.type === 'rect' ? (
        <div style={{ width: `${layer.width ?? 200}px`, height: `${layer.height ?? 200}px`, backgroundColor: layer.color ?? '#000000', borderRadius: `${layer.borderRadius ?? 0}px`, border: layer.borderWidth ? `${layer.borderWidth}px solid ${layer.borderColor ?? '#000'}` : 'none' }} className="pointer-events-none" />
      ) : layer.type === 'circle' ? (
        <div style={{ width: `${layer.width ?? 200}px`, height: `${layer.width ?? 200}px`, backgroundColor: layer.color ?? '#000000', borderRadius: '50%' }} className="pointer-events-none" />
      ) : (
        <img src={layer.content} alt="asset" className="pointer-events-none object-cover" 
          style={{ width: layer.imgWidth ? `${layer.imgWidth}px` : undefined, height: layer.imgHeight ? `${layer.imgHeight}px` : undefined, maxWidth: layer.imgWidth ? undefined : '4000px', borderRadius: `${layer.borderRadius ?? 0}px`, filter: `grayscale(${layer.grayscale ?? 0}%) blur(${layer.blur ?? 0}px)` }} />
      )}
    </div>
  );
});

const Scale = memo(({ size, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m21 21-4.35-4.35M11 6v10M6 11h10"/></svg>
));

// Template thumbnail component
const TemplateThumb = memo(({ template, onClick }) => {
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
                <img src={l.content} alt="" className="max-w-[60px] max-h-[60px] object-cover rounded-sm" style={{ borderRadius: `${(l.borderRadius ?? 0) * 0.3}px`, filter: `grayscale(${l.grayscale ?? 0}%)` }} />
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

// --- 3. Undo/Redo History ---

const MAX_HISTORY = 50;

function useHistory(initialState) {
  const [state, setState] = useState(initialState);
  const historyRef = useRef([JSON.stringify(initialState)]);
  const indexRef = useRef(0);
  const skipRef = useRef(false);

  const push = useCallback((newState) => {
    if (skipRef.current) { skipRef.current = false; return; }
    const json = JSON.stringify(newState);
    const current = historyRef.current[indexRef.current];
    if (json === current) return;
    const newHistory = historyRef.current.slice(0, indexRef.current + 1);
    newHistory.push(json);
    if (newHistory.length > MAX_HISTORY) newHistory.shift();
    historyRef.current = newHistory;
    indexRef.current = newHistory.length - 1;
  }, []);

  const undo = useCallback(() => {
    if (indexRef.current > 0) {
      indexRef.current--;
      skipRef.current = true;
      setState(JSON.parse(historyRef.current[indexRef.current]));
      return true;
    }
    return false;
  }, []);

  const redo = useCallback(() => {
    if (indexRef.current < historyRef.current.length - 1) {
      indexRef.current++;
      skipRef.current = true;
      setState(JSON.parse(historyRef.current[indexRef.current]));
      return true;
    }
    return false;
  }, []);

  const canUndo = indexRef.current > 0;
  const canRedo = indexRef.current < historyRef.current.length - 1;

  return { state, setState, push, undo, redo, canUndo, canRedo };
}

// --- 4. 主应用组件 ---

const App = () => {
  const [lang] = useState('zh');
  const { state: layers, setState: setLayers, push: pushHistory, undo, redo, canUndo, canRedo } = useHistory([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [canvasRatio, setCanvasRatio] = useState(ASPEC_RATIOS[1]);
  const [canvasBg, setCanvasBg] = useState('#FFFFFF');
  const [zoom, setZoom] = useState(0.8);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activePanel, setActivePanel] = useState('templates'); 
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [guides, setGuides] = useState({ x: null, y: null });
  const [customFonts, setCustomFonts] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [recentColors, setRecentColors] = useState([]);
  const [addingType, setAddingType] = useState(null);
  const [canvasGradient, setCanvasGradient] = useState(null); // { from, to, angle }
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState(null); // { x, y, layerId }
  const spaceRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0, ox: 0, oy: 0 });

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const fontInputRef = useRef(null);
  const replaceInputRef = useRef(null);
  const initialLayersRef = useRef([]);
  const exportMenuRef = useRef(null);

  const t = translations[lang];
  
  const selectedLayer = useMemo(() => layers.find(l => l.id === selectedIds[0]), [layers, selectedIds]);
  const allFonts = useMemo(() => [...BUILTIN_FONTS, ...customFonts], [customFonts]);

  // Dark mode class toggle
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Fonts are loaded locally via @fontsource — no network needed

  // Close export menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) setExportMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const addRecentColor = useCallback((color) => {
    setRecentColors(prev => {
      const filtered = prev.filter(c => c !== color);
      return [color, ...filtered].slice(0, 18);
    });
  }, []);

  const applyTemplate = useCallback((template) => {
    const newLayers = template.layers.map(l => ({ 
      ...l, id: `l-${Math.random().toString(36).substr(2, 9)}`
    }));
    setCanvasRatio(template.ratio);
    setCanvasBg(template.bg);
    setCanvasGradient(template.gradient || null);
    setLayers(newLayers);
    setSelectedIds([]);
    setPanOffset({ x: 0, y: 0 });
    setTimeout(() => pushHistory(newLayers), 0);
  }, [setLayers, pushHistory]);

  const toggleLayerStatus = useCallback((id, key) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, [key]: !l[key] } : l));
  }, [setLayers]);

  const deleteSelected = useCallback(() => {
    if (selectedIds.length === 0) return;
    setLayers(prev => {
      const next = prev.filter(l => !selectedIds.includes(l.id));
      return next;
    });
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

  const updateBatchLayers = useCallback((data) => {
    setLayers(prev => prev.map(l => selectedIds.includes(l.id) ? { ...l, ...data } : l));
  }, [selectedIds, setLayers]);

  const updateLayerById = useCallback((id, data) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
  }, [setLayers]);

  const moveLayer = useCallback((id, direction) => {
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

  // Align selected layers
  const alignLayers = useCallback((direction) => {
    if (selectedIds.length === 0) return;
    setLayers(prev => {
      const sel = prev.filter(l => selectedIds.includes(l.id));
      if (sel.length === 0) return prev;
      let newVals = {};
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

  // Replace image
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

  // Save to localStorage — debounced to avoid excessive writes
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      localStorage.setItem('de_pro_v12', JSON.stringify({ layers, canvasRatio, canvasBg, canvasGradient, darkMode }));
    }, 500);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [layers, canvasRatio, canvasBg, canvasGradient, darkMode]);

  // Push history only when interaction ends (drag/resize finished)
  const interactionRef = useRef({
    dragging: false, resizing: false, isPreviewMode: false,
    startPos: { x: 0, y: 0 }, startScale: 1, startDist: 1, resizeCorner: null,
    editingTextId: null, // double-click text editing
  });
  const pendingRafRef = useRef<number | null>(null);
  const latestMouseRef = useRef<MouseEvent | null>(null);

  const tryFlushHistory = useCallback((layersSnapshot: typeof layers) => {
    if (pendingRafRef.current) {
      cancelAnimationFrame(pendingRafRef.current);
      pendingRafRef.current = null;
    }
    pushHistory(layersSnapshot);
  }, [pushHistory]);

  // Real export
  const handleExport = useCallback(async (format = 'png') => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    setExportMenuOpen(false);
    
    // Temporarily hide selection UI
    const prevSelected = [...selectedIds];
    setSelectedIds([]);
    
    try {
      await new Promise(r => setTimeout(r, 100));
      const options = { 
        pixelRatio: 3, 
        cacheBust: true,
        filter: (node) => !node.classList?.contains('no-export'),
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
      // Fallback: try canvas approach
      try {
        const rect = canvasRef.current.getBoundingClientRect();
        const canvas = document.createElement('canvas');
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;
        const ctx = canvas.getContext('2d');
        ctx.scale(2, 2);
        ctx.fillStyle = canvasBg;
        ctx.fillRect(0, 0, rect.width, rect.height);
      } catch(e2) { console.error(e2); }
    } finally {
      setSelectedIds(prevSelected);
      setIsExporting(false);
    }
  }, [canvasBg, selectedIds]);

  // Drag
  const handleStartDrag = useCallback((e, id) => {
    if (interactionRef.current.isPreviewMode) return;
    // Space+drag = pan
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

  // Resize from corner
  const handleStartResize = useCallback((e, id, corner) => {
    if (interactionRef.current.isPreviewMode) return;
    e.stopPropagation(); e.preventDefault();
    const layer = layers.find(l => l.id === id);
    if (!layer || layer.isLocked) return;
    interactionRef.current.resizing = true;
    interactionRef.current.resizeCorner = corner;
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = (layer.x / 100) * rect.width + rect.left;
    const cy = (layer.y / 100) * rect.height + rect.top;
    const dist = Math.sqrt(Math.pow(e.clientX - cx, 2) + Math.pow(e.clientY - cy, 2));
    interactionRef.current.startScale = layer.scale || 1;
    interactionRef.current.startDist = dist || 1;
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
            // Snap to center guides
            if (Math.abs(nx - 50) < 1.2) { nx = 50; setGuides(g => ({...g, x: 50})); } else setGuides(g => ({...g, x: null}));
            if (Math.abs(ny - 50) < 1.2) { ny = 50; setGuides(g => ({...g, y: 50})); } else setGuides(g => ({...g, y: null}));
            // Snap to other layers
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

      // Pan canvas with Space+drag
      if (isPanning) {
        const dx = ev.clientX - panStartRef.current.x;
        const dy = ev.clientY - panStartRef.current.y;
        setPanOffset({ x: panStartRef.current.ox + dx, y: panStartRef.current.oy + dy });
      }

      if (interactionRef.current.resizing) {
        setLayers(prev => {
          const sel = prev.find(l => l.id === selectedIds[0]);
          if (!sel) return prev;
          const cx = (sel.x / 100) * rect.width + rect.left;
          const cy = (sel.y / 100) * rect.height + rect.top;
          const curDist = Math.sqrt(Math.pow(ev.clientX - cx, 2) + Math.pow(ev.clientY - cy, 2));
          const newScale = interactionRef.current.startScale * (curDist / (interactionRef.current.startDist || 1));
          if (isNaN(newScale)) return prev;
          const s = Math.max(0.1, Math.min(5, newScale));
          return prev.map(l => selectedIds.includes(l.id) ? { ...l, scale: s } : l);
        });
      }
    });
  }, [zoom, selectedIds, setLayers]);

  useEffect(() => {
    interactionRef.current.isPreviewMode = isPreviewMode;
  }, [isPreviewMode]);

  useEffect(() => {
    const end = (e: MouseEvent) => {
      // Flush pending RAF then push history
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

  // Keep a mutable ref to current layers for history snapshot
  const layersRef = useRef(layers);
  useEffect(() => { layersRef.current = layers; }, [layers]);

  // Space key tracking for pan mode
  useEffect(() => {
    const down = (e) => { if (e.code === 'Space' && !e.target.closest('input, select, textarea, [contenteditable]')) { e.preventDefault(); spaceRef.current = true; } };
    const up = (e) => { if (e.code === 'Space') { spaceRef.current = false; setIsPanning(false); } };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  // Mouse wheel zoom on canvas
  useEffect(() => {
    const handler = (e) => {
      if (isPreviewMode) return;
      if (e.target.closest('aside, nav, input, select')) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      setZoom(prev => Math.max(0.1, Math.min(3, prev + delta * prev)));
    };
    window.addEventListener('wheel', handler, { passive: false });
    return () => window.removeEventListener('wheel', handler);
  }, [isPreviewMode]);

  // Close context menu on click
  useEffect(() => {
    const handler = () => setContextMenu(null);
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (isPreviewMode) return;
      // Don't capture when typing in contentEditable
      const target = e.target;
      if (target.contentEditable === 'true' || target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA') return;

      const isMod = e.metaKey || e.ctrlKey;

      // Undo/Redo
      if (isMod && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); return; }
      if ((isMod && e.key === 'z' && e.shiftKey) || (isMod && e.key === 'y')) { e.preventDefault(); redo(); return; }
      // Duplicate
      if (isMod && e.key === 'd') { e.preventDefault(); duplicateSelected(); return; }
      // Delete
      if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); deleteSelected(); return; }
      // Select all
      if (isMod && e.key === 'a') { e.preventDefault(); setSelectedIds(layers.map(l => l.id)); return; }
      // Arrow keys - nudge
      if (selectedIds.length > 0 && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const step = e.shiftKey ? 5 : 1;
        const delta = { ArrowUp: { x: 0, y: -step }, ArrowDown: { x: 0, y: step }, ArrowLeft: { x: -step, y: 0 }, ArrowRight: { x: step, y: 0 } };
        const d = delta[e.key];
        setLayers(prev => prev.map(l => selectedIds.includes(l.id) ? { ...l, x: l.x + d.x, y: l.y + d.y } : l));
      }
      // Escape - deselect or exit preview
      if (e.key === 'Escape') {
        if (selectedIds.length > 0) setSelectedIds([]);
        else setIsPreviewMode(false);
      }
      // Preview
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
            setLayers(prev => [...prev, { id: newId, type: 'image', content: ev.target.result, x: 50, y: 50, rotate: 0, scale: 0.5, opacity: 1, borderRadius: 0, isLocked: false, isVisible: true }]);
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
            updateLayerById(selectedLayer.id, { content: ev.target.result });
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
          const fontFace = new FontFace(fontName, ev.target.result);
          try {
            const loadedFace = await fontFace.load();
            document.fonts.add(loadedFace);
            setCustomFonts(prev => [...prev, { name: `[Local] ${fontName}`, value: fontName }]);
            if (selectedLayer?.type === 'text') updateBatchLayers({ fontFamily: fontName });
          } catch (err) { console.error(err); }
        };
        reader.readAsArrayBuffer(file);
      }} accept=".ttf,.otf,.woff" className="hidden" />

      {isPreviewMode && (
        <button 
          onClick={() => setIsPreviewMode(false)}
          className="fixed top-4 right-4 z-[500] bg-black hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-2 transition-all shadow-2xl"
        >
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
              setLayers(p => [...p, { id: newId, type: 'text', content: 'EDIT TEXT', x: 50, y: 50, fontSize: 48, color: '#000', rotate: 0, scale: 1, fontWeight: '900', fontFamily: BUILTIN_FONTS[0].value, opacity: 1, letterSpacing: 0, lineHeight: 1, isLocked: false, isVisible: true }]);
              setSelectedIds([newId]);
              setAddingType('text');
              setTimeout(() => setAddingType(null), 300);
            }} label={t.addText} />
            <ToolIcon icon={<ImageIcon size={22}/>} active={addingType === 'image'} onClick={() => { fileInputRef.current?.click(); setAddingType('image'); setTimeout(() => setAddingType(null), 300); }} label={t.addImg} />
            <ToolIcon icon={<RectangleHorizontal size={22}/>} active={addingType === 'rect'} onClick={() => {
              const newId = `l-${Date.now()}`;
              setLayers(p => [...p, { id: newId, type: 'rect', content: '', x: 50, y: 50, width: 200, height: 200, color: '#000000', borderRadius: 0, borderWidth: 0, borderColor: '#000', rotate: 0, scale: 1, opacity: 1, isLocked: false, isVisible: true }]);
              setSelectedIds([newId]);
              setAddingType('rect');
              setTimeout(() => setAddingType(null), 300);
            }} label={t.addRect} />
            <ToolIcon icon={<Circle size={22}/>} active={addingType === 'circle'} onClick={() => {
              const newId = `l-${Date.now()}`;
              setLayers(p => [...p, { id: newId, type: 'circle', content: '', x: 50, y: 50, width: 200, color: '#000000', rotate: 0, scale: 1, opacity: 1, isLocked: false, isVisible: true }]);
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
                       {/* Gradient presets */}
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
            {/* Dot grid overlay */}
            {showGrid && !isPreviewMode && (
              <div className="absolute inset-0 z-[90] pointer-events-none" style={{
                backgroundImage: `radial-gradient(circle, var(--canvas-dot) 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
              }}/>
            )}
            {/* Center guides */}
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
                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={duplicateSelected} className="py-2 bg-zinc-100 dark:bg-slate-700/60 rounded-xl text-[9px] font-semibold uppercase text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 transition-all"><CopyPlus size={12}/> {t.duplicate}</button>
                  <button onClick={deleteSelected} className={`py-2 rounded-xl text-[9px] font-semibold uppercase flex items-center justify-center gap-1.5 transition-all ${darkMode ? 'bg-slate-800/50 text-zinc-400 hover:bg-red-900/20 border border-transparent' : 'bg-white text-zinc-400 hover:bg-red-50 hover:text-red-500 border border-zinc-100'}`}><Trash2 size={12}/> {t.delete}</button>
                </div>

                {/* Lock status */}
                <div className={`flex items-center justify-between p-2.5 rounded-xl ${darkMode ? 'bg-slate-800/40' : 'bg-zinc-50/60'}`}>
                  <span className="text-[9px] font-medium text-zinc-400 dark:text-zinc-500">
                    {selectedLayer.isLocked ? t.lock : t.unlock}
                  </span>
                  <button onClick={() => toggleLayerStatus(selectedLayer.id, 'isLocked')} className={`p-1 rounded-md transition-colors ${selectedLayer.isLocked ? 'text-amber-500' : 'text-zinc-300 hover:text-zinc-500 dark:hover:text-zinc-400'}`}>
                    {selectedLayer.isLocked ? <Lock size={14}/> : <Unlock size={14}/>}
                  </button>
                </div>
                
                {/* Alignment */}
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

                {/* Layer ordering */}
                <div className={`p-2.5 rounded-xl ${darkMode ? 'bg-slate-800/40' : 'bg-zinc-50/60'} space-y-2.5`}>
                  <span className="text-[9px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{t.layerOrder}</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => moveLayer(selectedLayer.id, 'top')} className={`py-1.5 rounded-lg text-[9px] font-semibold flex items-center justify-center gap-1 uppercase active:scale-95 ${darkMode ? 'bg-slate-800/60 border border-slate-700/50 text-zinc-300' : 'bg-white border border-zinc-100 text-zinc-500'}`}><ArrowUpToLine size={12}/>{t.bringFront}</button>
                    <button onClick={() => moveLayer(selectedLayer.id, 'bottom')} className={`py-1.5 rounded-lg text-[9px] font-semibold flex items-center justify-center gap-1 uppercase active:scale-95 ${darkMode ? 'bg-slate-800/60 border border-slate-700/50 text-zinc-300' : 'bg-white border border-zinc-100 text-zinc-500'}`}><ArrowDownToLine size={12}/>{t.sendBack}</button>
                    <button onClick={() => moveLayer(selectedLayer.id, 'up')} className={`py-1.5 rounded-lg text-[9px] font-semibold flex items-center justify-center gap-1 uppercase active:scale-95 ${darkMode ? 'bg-slate-800/60 border border-slate-700/50 text-zinc-300' : 'bg-white border border-zinc-100 text-zinc-500'}`}>{t.moveUp}</button>
                    <button onClick={() => moveLayer(selectedLayer.id, 'down')} className={`py-1.5 rounded-lg text-[9px] font-semibold flex items-center justify-center gap-1 uppercase active:scale-95 ${darkMode ? 'bg-slate-800/60 border border-slate-700/50 text-zinc-300' : 'bg-white border border-zinc-100 text-zinc-500'}`}>{t.moveDown}</button>
                  </div>
                </div>

                {/* Transform */}
                <SectionHeader title={t.transform}>
                  <div className="space-y-4 pt-1">
                    <PropertySlider label="缩放" value={selectedLayer.scale} min={0.01} max={5} step={0.01} onChange={(v) => updateBatchLayers({ scale: v })} />
                    <PropertySlider label="旋转" value={selectedLayer.rotate} min={-180} max={180} onChange={(v) => updateBatchLayers({ rotate: v })} />
                    <PropertySlider label={t.opacity} value={selectedLayer.opacity} min={0} max={1} step={0.05} onChange={(v) => updateBatchLayers({ opacity: v })} />
                  </div>
                </SectionHeader>
                
                {/* Text properties */}
                {selectedLayer.type === 'text' && (
                  <SectionHeader title={t.typography}>
                    <div className="space-y-4 pt-1">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400">{t.font}</span>
                          <button onClick={() => fontInputRef.current?.click()} className="text-[9px] text-indigo-600 hover:underline flex items-center gap-1 font-black uppercase"><UploadCloud size={10}/> {t.uploadFont}</button>
                        </div>
                        <select value={selectedLayer.fontFamily} onChange={(e) => updateBatchLayers({ fontFamily: e.target.value })} 
                          className={`w-full border rounded-xl px-3 py-2 text-[11px] font-semibold outline-none transition-all cursor-pointer appearance-none
                            ${darkMode ? 'bg-slate-800/80 border-slate-600 text-slate-200 hover:border-slate-500 focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 focus:border-indigo-500'}`}
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
                        >
                          {allFonts.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                        </select>
                      </div>
                      {/* Bold / Italic toggle */}
                      <div className="flex gap-2">
                        <button onClick={() => {
                          const current = parseInt(selectedLayer.fontWeight);
                          const next = current >= 700 ? '400' : '900';
                          updateBatchLayers({ fontWeight: next });
                        }} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-1.5 transition-all ${parseInt(selectedLayer.fontWeight) >= 700 
                          ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' 
                          : `${darkMode ? 'bg-slate-800 border border-slate-700 text-slate-400' : 'bg-white border border-slate-100 text-slate-400'}`}`}>
                          <Bold size={13}/> Bold
                        </button>
                        <button onClick={() => {
                          const isItalic = selectedLayer.fontStyle === 'italic';
                          updateBatchLayers({ fontStyle: isItalic ? 'normal' : 'italic' });
                        }} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-1.5 transition-all ${selectedLayer.fontStyle === 'italic'
                          ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' 
                          : `${darkMode ? 'bg-slate-800 border border-slate-700 text-slate-400' : 'bg-white border border-slate-100 text-slate-400'}`}`}>
                          <Italic size={13}/> Italic
                        </button>
                      </div>
                      <PropertySlider label="字号" value={selectedLayer.fontSize} min={8} max={500} onChange={(v) => updateBatchLayers({ fontSize: v })} />
                      <PropertySlider label={t.spacing} value={selectedLayer.letterSpacing} min={-40} max={100} onChange={(v) => updateBatchLayers({ letterSpacing: v })} />
                      <PropertySlider label={t.lineHeight} value={selectedLayer.lineHeight} min={0.2} max={4} step={0.1} onChange={(v) => updateBatchLayers({ lineHeight: v })} />
                      <ColorPicker 
                        label={t.color} 
                        value={selectedLayer.color ?? '#000000'} 
                        onChange={(v) => { updateBatchLayers({ color: v }); addRecentColor(v); }}
                        recentColors={recentColors}
                        onPresetClick={(v) => { updateBatchLayers({ color: v }); addRecentColor(v); }}
                      />
                    </div>
                  </SectionHeader>
                )}

                {/* Image properties */}
                {selectedLayer.type === 'image' && (
                  <SectionHeader title={t.appearance}>
                    <div className="space-y-4 pt-1">
                      <button onClick={handleReplaceImage} className={`w-full py-1.5 rounded-lg text-[9px] font-semibold uppercase flex items-center justify-center gap-1.5 transition-all ${darkMode ? 'bg-slate-800/50 border border-slate-700/50 text-zinc-400 hover:bg-slate-700/60' : 'bg-zinc-50 border border-zinc-100 text-zinc-500 hover:bg-zinc-100'}`}>
                        <UploadCloud size={14}/> {t.replaceImg}
                      </button>
                      <PropertySlider label="宽度" value={selectedLayer.imgWidth ?? 400} min={20} max={4000} onChange={(v) => updateBatchLayers({ imgWidth: v })} />
                      <PropertySlider label="高度" value={selectedLayer.imgHeight ?? 300} min={20} max={4000} onChange={(v) => updateBatchLayers({ imgHeight: v })} />
                      <PropertySlider label="圆角" value={selectedLayer.borderRadius} min={0} max={1000} onChange={(v) => updateBatchLayers({ borderRadius: v })} />
                      <PropertySlider label="模糊" value={selectedLayer.blur ?? 0} min={0} max={30} onChange={(v) => updateBatchLayers({ blur: v })} />
                      <PropertySlider label="黑白" value={selectedLayer.grayscale ?? 0} min={0} max={100} onChange={(v) => updateBatchLayers({ grayscale: v })} />
                    </div>
                  </SectionHeader>
                )}

                {/* Shape properties */}
                {(selectedLayer.type === 'rect' || selectedLayer.type === 'circle') && (
                  <SectionHeader title={t.color}>
                    <div className="space-y-4 pt-1">
                      <ColorPicker 
                        label="填充色" 
                        value={selectedLayer.color ?? '#000000'} 
                        onChange={(v) => { updateBatchLayers({ color: v }); addRecentColor(v); }}
                        recentColors={recentColors}
                        onPresetClick={(v) => { updateBatchLayers({ color: v }); addRecentColor(v); }}
                      />
                      {selectedLayer.type === 'rect' && (
                        <>
                          <PropertySlider label="宽度" value={selectedLayer.width ?? 200} min={10} max={2000} onChange={(v) => updateBatchLayers({ width: v })} />
                          <PropertySlider label="高度" value={selectedLayer.height ?? 200} min={10} max={2000} onChange={(v) => updateBatchLayers({ height: v })} />
                          <PropertySlider label="圆角" value={selectedLayer.borderRadius ?? 0} min={0} max={500} onChange={(v) => updateBatchLayers({ borderRadius: v })} />
                        </>
                      )}
                      {selectedLayer.type === 'circle' && (
                        <PropertySlider label="大小" value={selectedLayer.width ?? 200} min={10} max={2000} onChange={(v) => updateBatchLayers({ width: v })} />
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

      {/* Right-click context menu */}
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
