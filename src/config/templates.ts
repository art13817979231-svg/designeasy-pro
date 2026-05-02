import type { AspectRatio, Template, Layer } from '../types/canvas';

export const ASPEC_RATIOS: AspectRatio[] = [
  { id: 'r1', name: '1:1', value: 1, label: "Square" }, 
  { id: 'r2', name: '3:4', value: 4/3, label: "Magazine" }, 
  { id: 'r3', name: '9:16', value: 16/9, label: "Poster" }, 
  { id: 'r4', name: '16:9', value: 9/16, label: "Hero" }
];

export const TEMPLATES: Template[] = [
  // ========== T1: 瑞士建筑 (Swiss Grid) — 3:4 白底 ==========
  {
    id: 't1',
    name: '瑞士建筑',
    ratio: ASPEC_RATIOS[1],
    bg: '#FFFFFF',
    layers: [
      { id: 'l1', type: 'text', content: 'ARCH', x: 50, y: 15, fontSize: 180, color: '#000000', rotate: 0, scale: 1, fontWeight: '900', fontFamily: '"Inter", sans-serif', letterSpacing: -15, lineHeight: 0.8, opacity: 1, isLocked: false, isVisible: true } as Layer,
      { id: 'l2', type: 'text', content: 'MINIMALISM / 2024', x: 50, y: 32, fontSize: 12, color: '#FF3B00', rotate: 0, scale: 1, fontWeight: '800', fontFamily: '"Syncopate", sans-serif', letterSpacing: 8, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true } as Layer,
      { id: 'img1', type: 'image', content: '/img/arch.svg', x: 50, y: 62, scale: 0.75, rotate: 0, opacity: 1, borderRadius: 0, isLocked: false, isVisible: true } as Layer,
      { id: 'l3', type: 'text', content: 'A systematic approach to modern design.', x: 50, y: 92, fontSize: 10, color: '#666', rotate: 0, scale: 1, fontWeight: '400', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 1, lineHeight: 1.5, opacity: 1, isLocked: false, isVisible: true } as Layer
    ]
  },

  // ========== T2: 时尚封面 (Luxe Cover) — 3:4 深色 ==========
  {
    id: 't2',
    name: '时尚封面',
    ratio: ASPEC_RATIOS[1],
    bg: '#0F0F0F',
    layers: [
      { id: 'img1', type: 'image', content: '/img/luxe.svg', x: 50, y: 50, scale: 1.2, rotate: 0, opacity: 0.7, borderRadius: 0, isLocked: false, isVisible: true } as Layer,
      { id: 'l1', type: 'text', content: 'ETERNITY', x: 50, y: 45, fontSize: 100, color: '#FFFFFF', rotate: 0, scale: 1, fontWeight: '400', fontFamily: '"Playfair Display", serif', letterSpacing: 12, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true } as Layer,
      { id: 'l2', type: 'text', content: 'THE WINTER ISSUE', x: 50, y: 88, fontSize: 12, color: '#D4AF37', rotate: 0, scale: 1, fontWeight: '700', fontFamily: '"Montserrat", sans-serif', letterSpacing: 10, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true } as Layer
    ]
  },

  // ========== T3: 赛博霓虹 (Neon Cyber) — 9:16 竖版海报 ==========
  {
    id: 't3',
    name: '赛博霓虹',
    ratio: ASPEC_RATIOS[2],
    bg: '#0A0A0A',
    layers: [
      { id: 'img1', type: 'image', content: '/img/cyber.svg', x: 50, y: 40, scale: 0.9, rotate: 0, opacity: 0.4, borderRadius: 0, grayscale: 80, isLocked: false, isVisible: true } as Layer,
      { id: 'l1', type: 'text', content: 'CYBER', x: 50, y: 25, fontSize: 120, color: '#00FFC8', rotate: -3, scale: 1, fontWeight: '900', fontFamily: '"Bebas Neue", cursive', letterSpacing: 20, lineHeight: 0.9, opacity: 1, isLocked: false, isVisible: true } as Layer,
      { id: 'l2', type: 'text', content: 'NEON', x: 50, y: 40, fontSize: 120, color: '#FF00E5', rotate: 2, scale: 1, fontWeight: '900', fontFamily: '"Bebas Neue", cursive', letterSpacing: 20, lineHeight: 0.9, opacity: 1, isLocked: false, isVisible: true } as Layer,
      { id: 'l3', type: 'text', content: '2087 // TOKYO', x: 50, y: 55, fontSize: 10, color: '#00FFC8', rotate: 0, scale: 1, fontWeight: '700', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 6, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true } as Layer,
      { id: 'l4', type: 'text', content: 'ENTER THE GRID', x: 50, y: 90, fontSize: 14, color: '#FFFFFF', rotate: 0, scale: 1, fontWeight: '800', fontFamily: '"Inter", sans-serif', letterSpacing: 12, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true } as Layer
    ]
  },

  // ========== T4: 莫兰迪花艺 (Morandi Bloom) — 1:1 方形 ==========
  {
    id: 't4',
    name: '莫兰迪花艺',
    ratio: ASPEC_RATIOS[0],
    bg: '#EDE8E0',
    layers: [
      { id: 'img1', type: 'image', content: '/img/bloom.svg', x: 50, y: 55, scale: 1.1, rotate: 0, opacity: 0.85, borderRadius: 24, grayscale: 20, isLocked: false, isVisible: true } as Layer,
      { id: 'l1', type: 'text', content: 'Spring', x: 50, y: 15, fontSize: 72, color: '#8B7D6B', rotate: -2, scale: 1, fontWeight: '400', fontFamily: '"Playfair Display", serif', letterSpacing: 4, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true } as Layer,
      { id: 'l2', type: 'text', content: '静物与花艺', x: 50, y: 26, fontSize: 14, color: '#A89888', rotate: 0, scale: 1, fontWeight: '400', fontFamily: '"思源黑体 Bold", sans-serif', letterSpacing: 8, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true } as Layer,
      { id: 'l3', type: 'text', content: '— A study in muted tones —', x: 50, y: 92, fontSize: 10, color: '#B0A090', rotate: 0, scale: 1, fontWeight: '400', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 2, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true } as Layer
    ]
  },

  // ========== T5: 极简黑标 (Bold Black) — 16:9 横幅 ==========
  {
    id: 't5',
    name: '极简黑标',
    ratio: ASPEC_RATIOS[3],
    bg: '#FAFAFA',
    layers: [
      { id: 'l1', type: 'text', content: 'BRUTALIST', x: 15, y: 55, fontSize: 140, color: '#000000', rotate: 0, scale: 1, fontWeight: '900', fontFamily: '"Inter", sans-serif', letterSpacing: -8, lineHeight: 0.85, opacity: 1, isLocked: false, isVisible: true } as Layer,
      { id: 'l2', type: 'text', content: 'DESIGN', x: 78, y: 55, fontSize: 140, color: '#000000', rotate: 0, scale: 1, fontWeight: '900', fontFamily: '"Inter", sans-serif', letterSpacing: -8, lineHeight: 0.85, opacity: 1, isLocked: false, isVisible: true } as Layer,
      { id: 'l3', type: 'text', content: 'FORM FOLLOWS FUNCTION', x: 15, y: 85, fontSize: 10, color: '#999', rotate: 0, scale: 1, fontWeight: '600', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 5, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true } as Layer,
      { id: 'l4', type: 'text', content: '2025', x: 90, y: 15, fontSize: 60, color: '#E5E5E5', rotate: 0, scale: 1, fontWeight: '900', fontFamily: '"Inter", sans-serif', letterSpacing: -4, lineHeight: 0.85, opacity: 1, isLocked: false, isVisible: true } as Layer
    ]
  },

  // ========== T6: 水墨意境 (Ink Wash) — 3:4 中国风 ==========
  {
    id: 't6',
    name: '水墨意境',
    ratio: ASPEC_RATIOS[1],
    bg: '#F5F0E8',
    layers: [
      { id: 'img1', type: 'image', content: '/img/ink.svg', x: 50, y: 55, scale: 1.0, rotate: 0, opacity: 0.7, borderRadius: 0, grayscale: 40, isLocked: false, isVisible: true } as Layer,
      { id: 'l1', type: 'text', content: '山水之间', x: 50, y: 20, fontSize: 80, color: '#2C2C2C', rotate: 0, scale: 1, fontWeight: '400', fontFamily: '"中式楷体", serif', letterSpacing: 20, lineHeight: 1.2, opacity: 1, isLocked: false, isVisible: true } as Layer,
      { id: 'l2', type: 'text', content: 'BETWEEN MOUNTAINS AND WATER', x: 50, y: 33, fontSize: 8, color: '#8C8C8C', rotate: 0, scale: 1, fontWeight: '600', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 4, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true } as Layer,
      { id: 'l3', type: 'text', content: '留白是一种语言', x: 50, y: 90, fontSize: 12, color: '#6B6B6B', rotate: 0, scale: 1, fontWeight: '400', fontFamily: '"思源黑体 Bold", sans-serif', letterSpacing: 6, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true } as Layer
    ]
  },

  // ========== T7: 复古唱片 (Retro Vinyl) — 1:1 方形暖色 ==========
  {
    id: 't7',
    name: '复古唱片',
    ratio: ASPEC_RATIOS[0],
    bg: '#F2E6D4',
    layers: [
      { id: 'img1', type: 'image', content: '/img/vinyl.svg', x: 50, y: 48, scale: 0.85, rotate: 0, opacity: 1, borderRadius: 0, isLocked: false, isVisible: true } as Layer,
      { id: 'l1', type: 'text', content: 'GOLDEN ERA', x: 50, y: 18, fontSize: 52, color: '#8B4513', rotate: 0, scale: 1, fontWeight: '900', fontFamily: '"Abril Fatface", cursive', letterSpacing: 3, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true } as Layer,
      { id: 'l2', type: 'text', content: 'VINYL COLLECTION VOL. III', x: 50, y: 26, fontSize: 8, color: '#A0805A', rotate: 0, scale: 1, fontWeight: '600', fontFamily: '"Montserrat", sans-serif', letterSpacing: 5, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true } as Layer,
      { id: 'l3', type: 'text', content: '1968 — 1974', x: 50, y: 88, fontSize: 10, color: '#6B5B3E', rotate: 0, scale: 1, fontWeight: '400', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 4, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true } as Layer
    ]
  },

  // ========== T8: 科技发布会 (Tech Launch) — 9:16 竖版深色 ==========
  {
    id: 't8',
    name: '科技发布会',
    ratio: ASPEC_RATIOS[2],
    bg: '#000000',
    layers: [
      { id: 'img1', type: 'image', content: '/img/tech.svg', x: 50, y: 60, scale: 0.7, rotate: 0, opacity: 0.6, borderRadius: 20, isLocked: false, isVisible: true } as Layer,
      { id: 'l1', type: 'text', content: 'NEXT', x: 50, y: 20, fontSize: 100, color: '#FFFFFF', rotate: 0, scale: 1, fontWeight: '900', fontFamily: '"Inter", sans-serif', letterSpacing: -5, lineHeight: 0.9, opacity: 1, isLocked: false, isVisible: true } as Layer,
      { id: 'l2', type: 'text', content: 'GEN', x: 50, y: 33, fontSize: 100, color: '#FFFFFF', rotate: 0, scale: 1, fontWeight: '200', fontFamily: '"Inter", sans-serif', letterSpacing: -5, lineHeight: 0.9, opacity: 1, isLocked: false, isVisible: true } as Layer,
      { id: 'l3', type: 'text', content: 'AI-POWERED EXPERIENCE', x: 50, y: 48, fontSize: 8, color: '#00D4FF', rotate: 0, scale: 1, fontWeight: '700', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 6, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true } as Layer,
      { id: 'l4', type: 'text', content: 'OCTOBER 2025', x: 50, y: 92, fontSize: 10, color: '#444', rotate: 0, scale: 1, fontWeight: '600', fontFamily: '"Inter", sans-serif', letterSpacing: 4, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true } as Layer
    ]
  }
];
