# 英小星 PWA 优化日志

## 2026-05-01 优化内容

### 词库优化 (wordbooks.json)

1. **跨书去重**: 删除 1575 个重复单词
   - 原来 `morning` 出现在 6 本书中
   - 现在每个单词只保留在最早出现的年级/书里
   - 总词数: 4169 → 2594

2. **补充音标**: 成功补充 125 个缺失音标
   - 使用 dictionaryapi.dev 免费 API
   - 12 个单词无法获取（生僻词）

3. **修复单引号**: 1 处
   - 句子练习中的 `The museum's collection...` 

4. **添加版本信息**
   ```json
   "_meta": {
     "version": "2026-05-01",
     "lastUpdated": "..."
   }
   ```

### HTML Bug 修复 (english_learning.html)

1. **P0 Bug - 词库竞态条件**
   - 问题: 首次打开页面书架空白
   - 原因: `init()` 在 `loadWordBooks()` 完成前执行
   - 修复: DOMContentLoaded 里添加 `renderBooks()`

2. **P0 Bug - XSS/单引号崩溃**
   - 问题: 含撇号单词（如 `it's`）导致选择题崩溃
   - 原因: `onclick="submitChoice('it's')"` 语法错误
   - 修复: 改用 `data-word` 属性 + `addEventListener`

3. **P0 Bug - SW 缓存绕过**
   - 问题: 离线时词库加载失败
   - 原因: `wordbooks.json?t=timestamp` 绕过 SW 缓存
   - 修复: 移除时间戳参数

4. **额外优化 - 无障碍**
   - 添加 `@media (prefers-reduced-motion)` 支持

### 文件大小变化

| 文件 | 原大小 | 新大小 | 变化 |
|------|--------|--------|------|
| wordbooks.json | 476 KB | 458 KB | -18 KB |
| english_learning.html | 125 KB | 125 KB | +0.5 KB |

### 待优化项 (P1/P2)

- [ ] 音效节流（避免快速输入卡顿）
- [ ] localStorage 容量管理（自定义词书存 IndexedDB）
- [ ] MutationObserver 防抖
- [ ] ARIA 无障碍属性
- [ ] 词库按书拆分（增量加载）

