import type { AspectRatio, Template, Layer } from '../types/canvas';

export const ASPEC_RATIOS: AspectRatio[] = [
  { id: 'r1', name: '1:1', value: 1, label: "Square · 1080×1080 · Instagram/Facebook" }, 
  { id: 'r2', name: '3:4', value: 4/3, label: "Portrait · 1080×1350 · Instagram/Facebook" }, 
  { id: 'r3', name: '9:16', value: 16/9, label: "Story · 1080×1920 · IG/TikTok/FB Story" }, 
  { id: 'r4', name: '16:9', value: 9/16, label: "Landscape · 1920×1080 · YouTube/LinkedIn" }
];

export const TEMPLATES: Template[] = [
  // ========== T1: 瑞士建筑 (Swiss Grid) — 3:4 Portrait Instagram ==========
  // True Swiss Style: grid system, geometric shapes, overlapping typography
  {
    id: 't1',
    name: '瑞士建筑 · 3:4竖版',
    ratio: ASPEC_RATIOS[1],
    bg: '#F7F5F2',
    layers: [
      // Grid lines (Swiss Style hallmark)
      { id: 'g1', type: 'rect', x: 8, y: 50, w: 0.5, h: 100, borderRadius: 0, color: '#000000', rotate: 0, scale: 1, opacity: 0.15, isLocked: true, isVisible: true } as Layer,
      { id: 'g2', type: 'rect', x: 50, y: 8, w: 100, h: 0.5, borderRadius: 0, color: '#000000', rotate: 0, scale: 1, opacity: 0.15, isLocked: true, isVisible: true } as Layer,
      { id: 'g3', type: 'rect', x: 92, y: 50, w: 0.5, h: 100, borderRadius: 0, color: '#000000', rotate: 0, scale: 1, opacity: 0.15, isLocked: true, isVisible: true } as Layer,
      
      // Main image with precise positioning
      { id: 'img1', type: 'image', content: './img/arch.jpg', x: 50, y: 52, scale: 0.72, rotate: 0, opacity: 0.95, borderRadius: 0, isLocked: false, isVisible: true } as Layer,
      
      // Swiss-style typography: overlapping, geometric, systematic
      { id: 'l1', type: 'text', content: 'ARCHITECTURE', x: 50, y: 15, fontSize: 11, color: '#1A1A1A', rotate: 0, scale: 1, fontWeight: '700', fontFamily: '"Inter", sans-serif', letterSpacing: 18, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true, textAlign: 'center' } as Layer,
      { id: 'l2', type: 'text', content: 'MINIMAL', x: 11, y: 35, fontSize: 68, color: '#000000', rotate: 0, scale: 1, fontWeight: '900', fontFamily: '"Inter", sans-serif', letterSpacing: -8, lineHeight: 0.85, opacity: 0.08, isLocked: false, isVisible: true } as Layer,
      { id: 'l3', type: 'text', content: 'FORM', x: 11, y: 53, fontSize: 68, color: '#000000', rotate: 0, scale: 1, fontWeight: '900', fontFamily: '"Inter", sans-serif', letterSpacing: -8, lineHeight: 0.85, opacity: 0.08, isLocked: false, isVisible: true } as Layer,
      
      // Numbered annotation (Swiss Style)
      { id: 'n1', type: 'text', content: '01 / GRID SYSTEM', x: 11, y: 83, fontSize: 7, color: '#666666', rotate: 0, scale: 1, fontWeight: '600', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 3, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true } as Layer,
      { id: 'n2', type: 'text', content: '02 / MINIMALISM', x: 11, y: 88, fontSize: 7, color: '#666666', rotate: 0, scale: 1, fontWeight: '600', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 3, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true } as Layer,
      { id: 'n3', type: 'text', content: '03 / PRECISION', x: 11, y: 93, fontSize: 7, color: '#666666', rotate: 0, scale: 1, fontWeight: '600', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 3, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true } as Layer,
      
      // Year/issue
      { id: 'yr', type: 'text', content: '2024', x: 88, y: 95, fontSize: 56, color: '#000000', rotate: 0, scale: 1, fontWeight: '900', fontFamily: '"Inter", sans-serif', letterSpacing: -4, lineHeight: 0.85, opacity: 0.06, isLocked: true, isVisible: true } as Layer
    ]
  },

  // ========== T2: 时尚封面 (Luxe Cover) — 3:4 Portrait Instagram ==========
  // Vogue/Elle style: bold serif, overlapping elements, luxury feel
  {
    id: 't2',
    name: '时尚封面 · 3:4竖版',
    ratio: ASPEC_RATIOS[1],
    bg: '#0D0D0D',
    layers: [
      // Background image with reduced opacity
      { id: 'img1', type: 'image', content: './img/luxe.jpg', x: 50, y: 50, scale: 1.25, rotate: 0, opacity: 0.45, borderRadius: 0, isLocked: true, isVisible: true } as Layer,
      
      // Overlay rectangles for depth (Vogue style)
      { id: 'r1', type: 'rect', x: 50, y: 50, w: 100, h: 100, borderRadius: 0, color: '#0D0D0D', rotate: 0, scale: 1, opacity: 0.4, isLocked: true, isVisible: true } as Layer,
      { id: 'r2', type: 'rect', x: 50, y: 50, w: 80, h: 0.5, borderRadius: 0, color: '#D4AF37', rotate: 0, scale: 1, opacity: 0.8, isLocked: true, isVisible: true } as Layer,
      { id: 'r3', type: 'rect', x: 50, y: 50, w: 80, h: 0.5, borderRadius: 0, color: '#D4AF37', rotate: 90, scale: 1, opacity: 0.8, isLocked: true, isVisible: true } as Layer,
      
      // Main title - elegant serif
      { id: 'l1', type: 'text', content: 'ETERNITY', x: 50, y: 38, fontSize: 86, color: '#FFFFFF', rotate: 0, scale: 1, fontWeight: '400', fontFamily: '"Playfair Display", serif', letterSpacing: 14, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true, textAlign: 'center' } as Layer,
      
      // Subtitle with gold accent
      { id: 'l2', type: 'text', content: 'THE WINTER ISSUE', x: 50, y: 50, fontSize: 9, color: '#D4AF37', rotate: 0, scale: 1, fontWeight: '700', fontFamily: '"Montserrat", sans-serif', letterSpacing: 12, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true, textAlign: 'center' } as Layer,
      
      // Decorative line
      { id: 'l3', type: 'text', content: '—', x: 50, y: 56, fontSize: 18, color: '#D4AF37', rotate: 0, scale: 1, fontWeight: '400', fontFamily: '"Playfair Display", serif', letterSpacing: 0, lineHeight: 1, opacity: 0.6, isLocked: true, isVisible: true, textAlign: 'center' } as Layer,
      
      // Bottom text
      { id: 'l4', type: 'text', content: 'VOL. XLVII — N o .  2', x: 50, y: 85, fontSize: 8, color: '#999999', rotate: 0, scale: 1, fontWeight: '600', fontFamily: '"Montserrat", sans-serif', letterSpacing: 8, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true, textAlign: 'center' } as Layer,
      
      // Page numbers (Vogue style)
      { id: 'pg', type: 'text', content: '218', x: 88, y: 15, fontSize: 80, color: '#FFFFFF', rotate: 0, scale: 1, fontWeight: '900', fontFamily: '"Playfair Display", serif', letterSpacing: -4, lineHeight: 0.85, opacity: 0.04, isLocked: true, isVisible: true } as Layer
    ]
  },

  // ========== T3: 赛博霓虹 (Neon Cyber) — 9:16 Story Instagram/TikTok ==========
  // Enhanced cyberpunk: neon glow, scanlines, grid overlay
  {
    id: 't3',
    name: '赛博霓虹 · 9:16故事版',
    ratio: ASPEC_RATIOS[2],
    bg: '#050505',
    layers: [
      // Background image with low opacity
      { id: 'img1', type: 'image', content: './img/cyber.jpg', x: 50, y: 50, scale: 1.0, rotate: 0, opacity: 0.35, borderRadius: 0, grayscale: 100, isLocked: true, isVisible: true } as Layer,
      
      // Scanline overlay (cyberpunk effect)
      { id: 's1', type: 'rect', x: 50, y: 20, w: 100, h: 0.3, borderRadius: 0, color: '#00FFC8', rotate: 0, scale: 1, opacity: 0.15, isLocked: true, isVisible: true } as Layer,
      { id: 's2', type: 'rect', x: 50, y: 40, w: 100, h: 0.3, borderRadius: 0, color: '#00FFC8', rotate: 0, scale: 1, opacity: 0.15, isLocked: true, isVisible: true } as Layer,
      { id: 's3', type: 'rect', x: 50, y: 60, w: 100, h: 0.3, borderRadius: 0, color: '#00FFC8', rotate: 0, scale: 1, opacity: 0.15, isLocked: true, isVisible: true } as Layer,
      { id: 's4', type: 'rect', x: 50, y: 80, w: 100, h: 0.3, borderRadius: 0, color: '#00FFC8', rotate: 0, scale: 1, opacity: 0.15, isLocked: true, isVisible: true } as Layer,
      
      // Grid overlay
      { id: 'g1', type: 'rect', x: 30, y: 50, w: 0.3, h: 100, borderRadius: 0, color: '#00FFC8', rotate: 0, scale: 1, opacity: 0.08, isLocked: true, isVisible: true } as Layer,
      { id: 'g2', type: 'rect', x: 70, y: 50, w: 0.3, h: 100, borderRadius: 0, color: '#00FFC8', rotate: 0, scale: 1, opacity: 0.08, isLocked: true, isVisible: true } as Layer,
      
      // Neon text - layered for glow effect
      { id: 'l1', type: 'text', content: 'CYBER', x: 50, y: 22, fontSize: 118, color: '#00FFC8', rotate: -3, scale: 1, fontWeight: '900', fontFamily: '"Bebas Neue", cursive', letterSpacing: 22, lineHeight: 0.9, opacity: 0.25, isLocked: false, isVisible: true, textAlign: 'center' } as Layer,
      { id: 'l2', type: 'text', content: 'CYBER', x: 50, y: 22, fontSize: 118, color: '#00FFC8', rotate: -3, scale: 1, fontWeight: '900', fontFamily: '"Bebas Neue", cursive', letterSpacing: 22, lineHeight: 0.9, opacity: 1, isLocked: false, isVisible: true, textAlign: 'center' } as Layer,
      
      { id: 'l3', type: 'text', content: 'NEON', x: 50, y: 37, fontSize: 118, color: '#FF00E5', rotate: 2, scale: 1, fontWeight: '900', fontFamily: '"Bebas Neue", cursive', letterSpacing: 22, lineHeight: 0.9, opacity: 0.25, isLocked: false, isVisible: true, textAlign: 'center' } as Layer,
      { id: 'l4', type: 'text', content: 'NEON', x: 50, y: 37, fontSize: 118, color: '#FF00E5', rotate: 2, scale: 1, fontWeight: '900', fontFamily: '"Bebas Neue", cursive', letterSpacing: 22, lineHeight: 0.9, opacity: 1, isLocked: false, isVisible: true, textAlign: 'center' } as Layer,
      
      // Subtitle with monospace
      { id: 'l5', type: 'text', content: '2087 // TOKYO', x: 50, y: 52, fontSize: 9, color: '#00FFC8', rotate: 0, scale: 1, fontWeight: '700', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 8, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true, textAlign: 'center' } as Layer,
      
      // Bottom text
      { id: 'l6', type: 'text', content: 'ENTER THE GRID', x: 50, y: 88, fontSize: 13, color: '#FFFFFF', rotate: 0, scale: 1, fontWeight: '800', fontFamily: '"Inter", sans-serif', letterSpacing: 14, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true, textAlign: 'center' } as Layer,
      
      // Decorative corner elements
      { id: 'c1', type: 'rect', x: 12, y: 12, w: 8, h: 0.3, borderRadius: 0, color: '#00FFC8', rotate: 0, scale: 1, opacity: 0.6, isLocked: true, isVisible: true } as Layer,
      { id: 'c2', type: 'rect', x: 12, y: 12, w: 0.3, h: 8, borderRadius: 0, color: '#00FFC8', rotate: 0, scale: 1, opacity: 0.6, isLocked: true, isVisible: true } as Layer
    ]
  },

  // ========== T4: 莫兰迪花艺 (Morandi Bloom) — 1:1 Square Instagram/Facebook ==========
  // Elegant serif, gold accents, muted tones, sophisticated layout
  {
    id: 't4',
    name: '莫兰迪花艺 · 1:1方形',
    ratio: ASPEC_RATIOS[0],
    bg: '#F5F0E8',
    layers: [
      // Background image with soft overlay
      { id: 'img1', type: 'image', content: './img/bloom.jpg', x: 50, y: 55, scale: 1.15, rotate: 0, opacity: 0.75, borderRadius: 0, grayscale: 25, isLocked: true, isVisible: true } as Layer,
      
      // Soft overlay rectangle for text readability
      { id: 'ov1', type: 'rect', x: 50, y: 50, w: 100, h: 100, borderRadius: 0, color: '#F5F0E8', rotate: 0, scale: 1, opacity: 0.35, isLocked: true, isVisible: true } as Layer,
      
      // Elegant title - serif with gold accent
      { id: 'l1', type: 'text', content: 'Spring', x: 50, y: 18, fontSize: 68, color: '#8B7D6B', rotate: -1.5, scale: 1, fontWeight: '400', fontFamily: '"Playfair Display", serif', letterSpacing: 6, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true, textAlign: 'center' } as Layer,
      
      // Gold decorative line
      { id: 'dl1', type: 'rect', x: 50, y: 28, w: 30, h: 0.5, borderRadius: 0, color: '#C9A96E', rotate: 0, scale: 1, opacity: 0.7, isLocked: true, isVisible: true } as Layer,
      
      // Chinese subtitle
      { id: 'l2', type: 'text', content: '静物与花艺', x: 50, y: 33, fontSize: 13, color: '#A89888', rotate: 0, scale: 1, fontWeight: '400', fontFamily: '"思源黑体 Bold", sans-serif', letterSpacing: 10, lineHeight: 1, opacity: 0.85, isLocked: false, isVisible: true, textAlign: 'center' } as Layer,
      
      // English translation
      { id: 'l3', type: 'text', content: '— A study in muted tones —', x: 50, y: 40, fontSize: 8.5, color: '#B0A090', rotate: 0, scale: 1, fontWeight: '400', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 3, lineHeight: 1, opacity: 0.8, isLocked: false, isVisible: true, textAlign: 'center' } as Layer,
      
      // Gold accent number (Morandi reference)
      { id: 'an1', type: 'text', content: 'No. 04', x: 88, y: 88, fontSize: 11, color: '#C9A96E', rotate: 0, scale: 1, fontWeight: '600', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 4, lineHeight: 1, opacity: 0.6, isLocked: true, isVisible: true } as Layer,
      
      // Year
      { id: 'yr1', type: 'text', content: 'MMXXIV', x: 12, y: 88, fontSize: 8.5, color: '#A89888', rotate: 0, scale: 1, fontWeight: '600', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 3, lineHeight: 1, opacity: 0.5, isLocked: true, isVisible: true } as Layer
    ]
  },

  // ========== T5: 极简黑标 (Bold Black) — 16:9 Landscape YouTube/LinkedIn ==========
  // Brutalist:超大字号,不对称性,raw typography
  {
    id: 't5',
    name: '极简黑标 · 16:9横版',
    ratio: ASPEC_RATIOS[3],
    bg: '#F7F7F7',
    layers: [
      // Asymmetric bold typography (Brutalist style)
      { id: 'l1', type: 'text', content: 'BRUTAL', x: 8, y: 35, fontSize: 128, color: '#000000', rotate: 0, scale: 1, fontWeight: '900', fontFamily: '"Inter", sans-serif', letterSpacing: -6, lineHeight: 0.82, opacity: 1, isLocked: false, isVisible: true, textAlign: 'left' } as Layer,
      { id: 'l2', type: 'text', content: 'IST', x: 8, y: 58, fontSize: 128, color: '#000000', rotate: 0, scale: 1, fontWeight: '900', fontFamily: '"Inter", sans-serif', letterSpacing: -6, lineHeight: 0.82, opacity: 1, isLocked: false, isVisible: true, textAlign: 'left' } as Layer,
      
      // Small text annotation (Brutalist contrast)
      { id: 'l3', type: 'text', content: 'FORM', x: 8, y: 72, fontSize: 11, color: '#333333', rotate: 0, scale: 1, fontWeight: '800', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 12, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true, textAlign: 'left' } as Layer,
      { id: 'l4', type: 'text', content: 'FOLLOWS', x: 8, y: 76, fontSize: 11, color: '#333333', rotate: 0, scale: 1, fontWeight: '800', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 12, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true, textAlign: 'left' } as Layer,
      { id: 'l5', type: 'text', content: 'FUNCTION', x: 8, y: 80, fontSize: 11, color: '#333333', rotate: 0, scale: 1, fontWeight: '800', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 12, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true, textAlign: 'left' } as Layer,
      
      // Year overlay (large, faded)
      { id: 'yr1', type: 'text', content: 'MMXXV', x: 82, y: 42, fontSize: 52, color: '#000000', rotate: 90, scale: 1, fontWeight: '900', fontFamily: '"Inter", sans-serif', letterSpacing: -3, lineHeight: 0.85, opacity: 0.05, isLocked: true, isVisible: true } as Layer,
      
      // Horizontal rule
      { id: 'hr1', type: 'rect', x: 50, y: 88, w: 84, h: 0.5, borderRadius: 0, color: '#000000', rotate: 0, scale: 1, opacity: 0.15, isLocked: true, isVisible: true } as Layer,
      
      // Bottom right annotation
      { id: 'an1', type: 'text', content: 'VOL. XLVIII', x: 88, y: 92, fontSize: 7.5, color: '#666666', rotate: 0, scale: 1, fontWeight: '600', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 5, lineHeight: 1, opacity: 1, isLocked: true, isVisible: true, textAlign: 'right' } as Layer,
      
      // Tiny decorative square (Brutalist element)
      { id: 'ds1', type: 'rect', x: 92, y: 8, w: 3.2, h: 3.2, borderRadius: 0, color: '#000000', rotate: 0, scale: 1, opacity: 0.7, isLocked: true, isVisible: true } as Layer
    ]
  },

  // ========== T6: 水墨意境 (Ink Wash) — 3:4 Portrait Instagram ==========
  // Calligraphy, rice paper texture, white space
  {
    id: 't6',
    name: '水墨意境 · 3:4竖版',
    ratio: ASPEC_RATIOS[1],
    bg: '#F8F4EC',
    layers: [
      // Background image with low opacity (ink wash feel)
      { id: 'img1', type: 'image', content: './img/ink.jpg', x: 50, y: 52, scale: 1.05, rotate: 0, opacity: 0.55, borderRadius: 0, grayscale: 50, isLocked: true, isVisible: true } as Layer,
      
      // Rice paper texture overlay
      { id: 'tp1', type: 'rect', x: 50, y: 50, w: 100, h: 100, borderRadius: 0, color: '#F8F4EC', rotate: 0, scale: 1, opacity: 0.4, isLocked: true, isVisible: true } as Layer,
      
      // Main calligraphy title (vertical layout feel)
      { id: 'l1', type: 'text', content: '山水之间', x: 50, y: 18, fontSize: 76, color: '#2C2C2C', rotate: 0, scale: 1, fontWeight: '400', fontFamily: '"ZCOOL XiaoWei", serif', letterSpacing: 24, lineHeight: 1.4, opacity: 1, isLocked: false, isVisible: true, textAlign: 'center' } as Layer,
      
      // English translation (small, elegant)
      { id: 'l2', type: 'text', content: 'BETWEEN MOUNTAINS', x: 50, y: 35, fontSize: 7.5, color: '#8C8C8C', rotate: 0, scale: 1, fontWeight: '600', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 5, lineHeight: 1, opacity: 0.75, isLocked: false, isVisible: true, textAlign: 'center' } as Layer,
      { id: 'l3', type: 'text', content: 'AND WATER', x: 50, y: 39, fontSize: 7.5, color: '#8C8C8C', rotate: 0, scale: 1, fontWeight: '600', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 5, lineHeight: 1, opacity: 0.75, isLocked: false, isVisible: true, textAlign: 'center' } as Layer,
      
      // White space separator (ink wash style)
      { id: 'sp1', type: 'rect', x: 50, y: 50, w: 0.4, h: 28, borderRadius: 0, color: '#2C2C2C', rotate: 0, scale: 1, opacity: 0.15, isLocked: true, isVisible: true } as Layer,
      
      // Philosophical text (Chinese)
      { id: 'l4', type: 'text', content: '留白是一种语言', x: 50, y: 58, fontSize: 11, color: '#6B6B6B', rotate: 0, scale: 1, fontWeight: '400', fontFamily: '"ZCOOL XiaoWei", serif', letterSpacing: 8, lineHeight: 1.2, opacity: 0.85, isLocked: false, isVisible: true, textAlign: 'center' } as Layer,
      
      // Poem/seal style decoration
      { id: 'sl1', type: 'rect', x: 82, y: 82, w: 6, h: 6, borderRadius: 0, color: '#C41E1E', rotate: 0, scale: 1, opacity: 0.12, isLocked: true, isVisible: true } as Layer,
      { id: 'sl2', type: 'text', content: '墨', x: 82, y: 82, fontSize: 9, color: '#C41E1E', rotate: 0, scale: 1, fontWeight: '400', fontFamily: '"ZCOOL XiaoWei", serif', letterSpacing: 0, lineHeight: 1, opacity: 0.35, isLocked: true, isVisible: true, textAlign: 'center' } as Layer,
      
      // Year (Chinese calendar style)
      { id: 'yr1', type: 'text', content: '甲辰年', x: 18, y: 88, fontSize: 8, color: '#AAAAAA', rotate: 0, scale: 1, fontWeight: '400', fontFamily: '"ZCOOL XiaoWei", serif', letterSpacing: 4, lineHeight: 1, opacity: 0.5, isLocked: true, isVisible: true } as Layer
    ]
  },

  // ========== T7: 复古唱片 (Retro Vinyl) — 1:1 Square Instagram/Facebook ==========
  // Retro typography, vinyl texture, 70s design elements
  {
    id: 't7',
    name: '复古唱片 · 1:1方形',
    ratio: ASPEC_RATIOS[0],
    bg: '#F2E6D4',
    layers: [
      // Vinyl record image with warm overlay
      { id: 'img1', type: 'image', content: './img/vinyl.jpg', x: 50, y: 50, scale: 0.92, rotate: 0, opacity: 0.82, borderRadius: 0, isLocked: true, isVisible: true } as Layer,
      
      // Warm overlay for retro feel
      { id: 'ov1', type: 'rect', x: 50, y: 50, w: 100, h: 100, borderRadius: 0, color: '#F2E6D4', rotate: 0, scale: 1, opacity: 0.25, isLocked: true, isVisible: true } as Layer,
      
      // Retro title - bold serif
      { id: 'l1', type: 'text', content: 'GOLDEN', x: 50, y: 16, fontSize: 49, color: '#8B4513', rotate: 0, scale: 1, fontWeight: '900', fontFamily: '"Abril Fatface", cursive', letterSpacing: 4, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true, textAlign: 'center' } as Layer,
      { id: 'l2', type: 'text', content: 'ERA', x: 50, y: 26, fontSize: 49, color: '#8B4513', rotate: 0, scale: 1, fontWeight: '900', fontFamily: '"Abril Fatface", cursive', letterSpacing: 4, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true, textAlign: 'center' } as Layer,
      
      // Decorative line (retro style)
      { id: 'dl1', type: 'rect', x: 50, y: 33, w: 35, h: 0.4, borderRadius: 0, color: '#A0805A', rotate: 0, scale: 1, opacity: 0.6, isLocked: true, isVisible: true } as Layer,
      
      // Subtitle with retro spacing
      { id: 'l3', type: 'text', content: 'VINYL COLLECTION', x: 50, y: 38, fontSize: 7.5, color: '#A0805A', rotate: 0, scale: 1, fontWeight: '600', fontFamily: '"Montserrat", sans-serif', letterSpacing: 8, lineHeight: 1, opacity: 0.85, isLocked: false, isVisible: true, textAlign: 'center' } as Layer,
      { id: 'l4', type: 'text', content: 'VOL. III', x: 50, y: 42, fontSize: 7.5, color: '#A0805A', rotate: 0, scale: 1, fontWeight: '600', fontFamily: '"Montserrat", sans-serif', letterSpacing: 8, lineHeight: 1, opacity: 0.85, isLocked: false, isVisible: true, textAlign: 'center' } as Layer,
      
      // Year range (retro style)
      { id: 'yr1', type: 'text', content: '1968 — 1974', x: 50, y: 87, fontSize: 9, color: '#6B5B3E', rotate: 0, scale: 1, fontWeight: '400', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 5, lineHeight: 1, opacity: 0.8, isLocked: false, isVisible: true, textAlign: 'center' } as Layer,
      
      // Decorative corner (retro stamp style)
      { id: 'ds1', type: 'rect', x: 15, y: 87, w: 5, h: 5, borderRadius: 0, color: '#8B4513', rotate: 0, scale: 1, opacity: 0.08, isLocked: true, isVisible: true } as Layer,
      { id: 'ds2', type: 'text', content: '✻', x: 15, y: 87, fontSize: 9, color: '#8B4513', rotate: 0, scale: 1, fontWeight: '400', fontFamily: '"Playfair Display", serif', letterSpacing: 0, lineHeight: 1, opacity: 0.25, isLocked: true, isVisible: true, textAlign: 'center' } as Layer
    ]
  },

  // ========== T8: 科技发布会 (Tech Launch) — 9:16 Story IG/TikTok ==========
  // Apple style: clean, powerful, light effects
  {
    id: 't8',
    name: '科技发布会 · 9:16故事版',
    ratio: ASPEC_RATIOS[2],
    bg: '#000000',
    layers: [
      // Background image with low opacity (tech feel)
      { id: 'img1', type: 'image', content: './img/tech.jpg', x: 50, y: 58, scale: 0.72, rotate: 0, opacity: 0.5, borderRadius: 24, isLocked: true, isVisible: true } as Layer,
      
      // Dark overlay for text readability
      { id: 'ov1', type: 'rect', x: 50, y: 50, w: 100, h: 100, borderRadius: 0, color: '#000000', rotate: 0, scale: 1, opacity: 0.55, isLocked: true, isVisible: true } as Layer,
      
      // Thin top line (Apple style)
      { id: 'tl1', type: 'rect', x: 50, y: 12, w: 40, h: 0.3, borderRadius: 0, color: '#555555', rotate: 0, scale: 1, opacity: 0.6, isLocked: true, isVisible: true } as Layer,
      
      // Main title - bold, clean (Apple style)
      { id: 'l1', type: 'text', content: 'NEXT', x: 50, y: 22, fontSize: 96, color: '#FFFFFF', rotate: 0, scale: 1, fontWeight: '900', fontFamily: '"Inter", sans-serif', letterSpacing: -6, lineHeight: 0.9, opacity: 1, isLocked: false, isVisible: true, textAlign: 'center' } as Layer,
      { id: 'l2', type: 'text', content: 'GEN', x: 50, y: 36, fontSize: 96, color: '#FFFFFF', rotate: 0, scale: 1, fontWeight: '200', fontFamily: '"Inter", sans-serif', letterSpacing: -6, lineHeight: 0.9, opacity: 1, isLocked: false, isVisible: true, textAlign: 'center' } as Layer,
      
      // Accent line (Apple style)
      { id: 'al1', type: 'rect', x: 50, y: 44, w: 12, h: 0.4, borderRadius: 0, color: '#00D4FF', rotate: 0, scale: 1, opacity: 0.9, isLocked: true, isVisible: true } as Layer,
      
      // Subtitle with monospace (tech feel)
      { id: 'l3', type: 'text', content: 'AI-POWERED EXPERIENCE', x: 50, y: 50, fontSize: 7.5, color: '#00D4FF', rotate: 0, scale: 1, fontWeight: '700', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 8, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true, textAlign: 'center' } as Layer,
      
      // Thin middle line
      { id: 'ml1', type: 'rect', x: 50, y: 56, w: 40, h: 0.3, borderRadius: 0, color: '#333333', rotate: 0, scale: 1, opacity: 0.5, isLocked: true, isVisible: true } as Layer,
      
      // Bottom text (Apple event style)
      { id: 'l4', type: 'text', content: 'OCTOBER 2025', x: 50, y: 88, fontSize: 9, color: '#888888', rotate: 0, scale: 1, fontWeight: '600', fontFamily: '"Inter", sans-serif', letterSpacing: 10, lineHeight: 1, opacity: 1, isLocked: false, isVisible: true, textAlign: 'center' } as Layer,
      
      // Thin bottom line
      { id: 'bl1', type: 'rect', x: 50, y: 93, w: 40, h: 0.3, borderRadius: 0, color: '#333333', rotate: 0, scale: 1, opacity: 0.5, isLocked: true, isVisible: true } as Layer,
      
      // Large faded number (Apple keynote style)
      { id: 'bg1', type: 'text', content: '9', x: 85, y: 78, fontSize: 160, color: '#FFFFFF', rotate: 0, scale: 1, fontWeight: '900', fontFamily: '"Inter", sans-serif', letterSpacing: -8, lineHeight: 0.85, opacity: 0.03, isLocked: true, isVisible: true } as Layer
    ]
  }
];
