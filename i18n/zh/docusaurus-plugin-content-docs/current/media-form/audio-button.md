---
title: 音频 UI按钮
sidebar_position: 4
id: audio-button
---

# 音频按钮组件 & macro

## 📘 概述

`audio_button`  macro是 GooseLang 默认 UI 系统中的可重用 UI 组件，用于渲染具有播放/暂停功能和可选字幕的自定义音频播放器控件。它提供了一种现代、可访问且可样式化的音频文件播放方式，支持标准模式和字幕模式。该 macro在平台中广泛用于题目材料、题目选项以及任何需要内联音频播放的场景。

## 🔗 依赖关系

- **Jinja2  macro**: 定义在 `components/media.html` 中，通常作为 `media` 导入。
- **Iconify**: 用于动画播放/暂停图标。
- **用户上下文**: 用于主题感知的图标着色。
- **JavaScript**: 用于每个实例的音频控制、互斥和错误处理。
- **CSS 类**: 依赖 `audio-tag`、`play-btn` 和布局类进行样式设置。
- **上下文**: 期望参数 (args) 字典，通常从更高级别的表单或媒体逻辑传递。

## 📐 数据结构

###  macro签名

```jinja2
{% macro audio_button(args) %}
  <div id="audio-macro-{{ args.index }}" ...>
    ...
  </div>
  <script> ... </script>
{% endmacro %}
```

- **`audio_button(args)`**: 渲染带有播放/暂停按钮、字幕和音频元素的自定义音频播放器。

### 参数 (`args`)

| 参数           | 类型     | 默认值    | 描述 |
|---------------|----------|-----------|-----|
| `index`       | string/number | 必需   | 音频实例的唯一标识符（用于 DOM ID） |
| `value`       | string   | 必需      | 音频文件 URL、路径或数据 URI |
| `caption`     | string   | none      | 要显示的字幕文本（如果 `show_caption` 为 true） |
| `show_caption`| boolean  | false     | 是否显示字幕和自定义控件 |
| `docId`       | string   | none      | 用于文件路径解析的文档 ID |
| `extra_type`  | string   | none      | 用于上下文特定的样式设置 |

#### 值处理
- 如果 `value` 以 `file://` 开头且提供了 `docId`，则转换为 `./[docId]/file/`。
- 如果 `value` 以 `file://` 开头但没有 `docId`，则转换为 `./file/`。
- 否则，`value` 按原样使用。
- 如果 `show_caption` 为 true，则渲染自定义控件和字幕；否则使用 markdown 音频语法。

#### 渲染结构
- 外层 `<div id="audio-macro-{{ args.index }}">` 用于唯一实例
- 如果 `show_caption` 为 true：
  - `<button class="play-btn">` 用于播放/暂停
  - `<span>` 用于字幕文本
  - `<audio>` 元素包含解析的源
- 如果 `show_caption` 为 false：
  - Markdown 音频语法：`@[audio](...)`
- 每个实例的 `<script>` 用于 JS 逻辑

## ⚙️ 核心方法与逻辑

###  macro内部结构
- **audio_button(args)**: 为单个实例渲染音频播放器、播放/暂停按钮、字幕和 JS 逻辑。
- **文件路径处理**: 如果提供了 `docId`，将 `file://` URL 解析为相对路径。
- **Iconify 集成**: 为播放/暂停状态使用动画图标，支持主题感知着色。
- **JavaScript 逻辑**:
  - 为播放/暂停、错误和互斥（一次只播放一个音频）初始化每个实例的事件处理程序。
  - 处理 canplaythrough/error 事件以提供可用性和错误反馈（❌ 图标）。
  - 根据播放状态更新按钮图标。

####  macro展开示例
```jinja2
{{ media.audio_button({
  value: option.raw,
  docId: pdoc.docId,
  show_caption: qdoc.show_caption|default(false),
  caption: option.caption,
  index: loop.index
}) }}
```
渲染为：
```html
<div id="audio-macro-1" style="display: flex; align-items: center; ...">
  <button class="play-btn" ...>
    <iconify-icon ...></iconify-icon>
  </button>
  <span>Audio caption here</span>
  <audio id="audio-1">
    <source src="./123/file/audio.mp3" type="audio/wav" ...>
  </audio>
</div>
<script> ... </script>
```

## 🧪 使用模式

### 题目材料音频
```jinja2
{{ media.audio_button({
  value: audio.wav_url or audio.wav_buffer,
  extra_type: 'material',
  docId: pdoc.docId
}) }}
```
- 用于在题目材料部分播放音频文件。

### 题目选项音频
```jinja2
{{ media.audio_button({
  value: option.raw,
  docId: pdoc.docId,
  show_caption: qdoc.show_caption|default(false),
  caption: option.caption,
  index: loop.index
}) }}
```
- 用于多项选择或匹配题目中的音频选项。

### 目标选项音频（匹配题目）
```jinja2
{{ media.audio_button({
  value: targetOption.raw,
  docId: pdoc.docId,
  show_caption: qdoc.show_caption|default(false),
  caption: targetOption.caption,
  index: loop.index
}) }}
```
- 用于匹配题目中的目标音频选项。

## 🧠 代码审查与建议

- **可维护性：**  macro结构良好且可组合。考虑对 `args` 进行更严格的类型检查，并为丢失/无效的音频源提供更健壮的错误处理。
- **可扩展性：** 支持大多数常见用例。对于播放列表或高级控件，可能需要进一步扩展。
- **可访问性：** 使用了正确的按钮和音频语义，但要确保维护 ARIA 标签和键盘可访问性。
- **国际化：** 所有面向用户的文本和字幕都应包装在 `_()` 中进行翻译。
- **用户体验：**  macro支持错误反馈和互斥，但不原生支持跳转或播放速率控制——如有需要可考虑添加。
- **一致性：** 始终使用 `audio_button` 进行内联音频播放，以确保一致的 UI 和行为。

## 📝 文件结构

- `packages/ui-default/templates/components/media.html`:  macro定义（`audio_button` 等）
- `packages/ui-default/templates/partials/`、`problem_submit_material.html` 等： macro的使用
- 典型导入方式：
  ```jinja2
  {% import 'components/media.html' as media with context %}
  ```

## 📌 注意事项 / 观察

- **设计选择：** 该 macro设计用于与其他表单/媒体字段的最大可组合性和网格对齐。
- **多租户：** 用于全局和按空间内容。
- **自定义样式：** 支持 `extra_type` 用于上下文特定的 CSS。
- **帮助文本：** 如果提供字幕，则渲染以提供用户指导。
- **集成性：** 与其他媒体 macro和 markdown 音频语法无缝协作。
- **测试：**  macro被广泛使用且稳定，但对于新布局或可访问性要求，务必在上下文中进行测试。

---

如需更多详细信息，请参阅 `components/media.html` 中的 macro定义以及整个 UI 系统中模板的使用情况。
