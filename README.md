# DesignEasy Pro

一个专业级 Web 海报设计工具，让每个人都 能轻松创作高级感的视觉作品。

![Preview](https://art13817979231-svg.github.io/designeasy-pro/img/arch.svg)
![License](https://img.shields.io/badge/license-MIT-blue)
![Tech](https://img.shields.io/badge/React-18.3-blue)
![Tech](https://img.shields.io/badge/Vite-6.0-yellow)

## ✨ 特性

### 🎨 模板库
- 8 款精心设计的预设模板（瑞士建筑、时尚封面、赛博霓虹、莫兰迪花艺、极简黑标、水墨意境、复古唱片、科技发布会）
- 一键应用，快速开始创作

### 🛠 设计工具
- **图文排版**：文字支持 43+ 英文字体 + 15+ 中文字体，可自定义上传字体
- **形状绘制**：矩形、圆形、线条
- **图片处理**：支持本地图片导入、缩放、旋转、滤镜（模糊、黑白）

### ⚡ 高效操作
- **撤销/重做**：50 步历史记录
- **快捷键**：⌘Z/⌘⇧Z 撤销、⌘D 复制、DEL 删除、方向键微调、P 预览
- **滚轮缩放**：画布支持鼠标滚轮缩放查看
- **空格平移**：按住空格拖动画布
- **智能吸附**：拖动时自动对齐其他图层

### 📐 高级功能
- 3 种画布比例（1:1、3:4、9:16、16:9）
- 30+ 颜色预设
- 透明度、旋转、滤镜控制
- 渐变背景
- 图层顺序调整
- 右键上下文菜单

### 💾 导出与存储
- 导出 PNG/JPG/SVG
- 本地存储自动保存
- 深色/浅色模式切换

## 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/art13817979231-svg/designeasy-pro.git
cd designeasy-pro

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

打开 http://127.0.0.1:5173 即可使用。

## 🌐 在线访问

直接访问：https://art13817979231-svg.github.io/designeasy-pro/

## ⌨️ 快捷键

| 操作 | 快捷键 |
|------|--------|
| 撤销 | ⌘Z |
| 重做 | ⌘⇧Z |
| 复制 | ⌘D |
| 删除 | DEL |
| 预览 | P |
| 微调位置 | ↑↓←→ |
| 取消选择 | ESC |
| 平移画布 | 空格+拖动 |

## 🏗 技术栈

- **React 18** — UI 框架
- **Vite 6** — 构建工具
- **Tailwind CSS 3** — 样式方案
- **html-to-image** — 导出引擎
- **lucide-react** — 图标
- **@fontsource** — 本地字体

## 📁 项目结构

```
designeasy-pro/
├── src/
│   ├── App.tsx          # 主应用组件
│   ├── main.tsx        # 入口文件
│   └── config/
│       └── fonts.ts   # 字体配置
├── public/
│   └── img/           # 模板图片资源
├── index.html         # 入口 HTML
├── package.json       # 依赖配置
├── tailwind.config.js # Tailwind 配置
├── vite.config.ts    # Vite 配置
└── postcss.config.js # PostCSS 配置
```

## 📝 License

MIT License

---

Made with 🖌 by 代可行