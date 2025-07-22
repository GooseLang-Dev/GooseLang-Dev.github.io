---
title: 音频 UI组件
sidebar_position: 3
id: audio
---

# 音频媒体组件 & macro

## 📘 概述

`media` 和 `form_media`  macro在 GooseLang 默认 UI 系统中提供了强大的、可重用的 UI 组件，用于处理音频上传、预览和元数据（如字幕）。这些 macro在表单中实现了一致、可访问且可样式化的音频输入和播放字段，支持直接 URL 输入和文件上传，以及可选的字幕和音频生成工作流。它们在平台中广泛用于题目创作、题目选项、材料编辑以及需要音频输入或播放的设置场景。

## 🔗 依赖关系

- **Jinja2  macro**: 定义在 `components/media.html` 中，通常作为 `media` 导入。
- **form_begin / form_end**: 用于包装表单字段以实现布局、标签和帮助文本。
- **Iconify**: 用于删除/关闭图标和按钮图标。
- **JavaScript**: 用于文件上传、预览、错误处理和动态音频字段逻辑。
- **CSS 类**: 使用 `media-container`、`audio-tag`、`richmedia` 和网格类进行样式设置。
- **上下文**: 期望 `args` 字典，通常从更高级别的表单逻辑或模板传递。

## 📐 数据结构

###  macro签名

```jinja2
{% macro media(args) %}
  ...
{% endmacro %}

{% macro form_media(args) %}
  {{ form_begin(...) }}
  {{ media(args) }}
  {{ form_end(...) }}
{% endmacro %}
```

- **`media(args)`**: 渲染核心音频上传/预览组件。
- **`form_media(args)`**: 将 `media` 包装在带有网格对齐的标签表单字段中。

### 参数 (`args`)

| 参数             | 类型     | 默认值    | 描述 |
|------------------|----------|-----------|-----|
| `media_type`     | string   | 必需      | 音频字段必须为 `'audio'` |
| `extra_type`     | string   | 必需      | 用于 CSS 类和 JS 逻辑的额外类型标识符 |
| `file_type`      | string   | none      | 用于上传验证的文件类型 |
| `docType`        | string   | none      | 上传端点的文档类型 |
| `docId`          | string   | none      | 上传端点的文档 ID |
| `name`           | string   | 必需      | 音频字段的输入名称 |
| `value`          | string   | none      | 当前音频 URL 或 base64 数据 |
| `input_name`     | string   | none      | 自定义输入名称覆盖 |
| `show_caption`   | boolean  | false     | 显示字幕字段（仅音频） |
| `caption`        | string   | none      | 字幕文本（仅音频） |
| `generate_audio` | boolean  | false     | 显示生成按钮（仅音频） |
| `hide_delete`    | boolean  | false     | 隐藏删除/关闭按钮 |
| ...              | ...      | ...       | 传递给 macro的任何其他属性 |

#### 值处理
- 对于音频：`value` 是音频 URL 或 base64 数据；预览使用音频播放器渲染。
- 如果 `show_caption` 为 true，则在音频字段上方显示字幕输入。
- 如果 `generate_audio` 为 true，则显示生成按钮（用于 TTS 或类似工作流）。
- 如果 `hide_delete` 为 false，则渲染删除/关闭按钮。
- 隐藏输入字段用于存储音频值以进行表单提交。

#### 渲染结构
- 外层 `.media-container` 包含用于 JS 集成的数据属性
- 音频预览包含播放器、隐藏输入、字幕输入（如果启用）、生成按钮（如果启用）和删除按钮
- 上传表单包含文件输入和/或 URL 输入
- 上传/验证反馈的错误消息区域

## ⚙️ 核心方法与逻辑

###  macro内部结构
- **media(args)**: 为音频媒体渲染上传表单、预览和控件。
- **form_media(args)**: 将 `media` 包装在带有网格对齐的标签表单字段中。
- **文件上传**: 与全局 `uploadFiles` JS 函数集成以进行文件上传。
- **预览生成**: 在成功上传或有效 URL 输入时动态替换上传表单为预览。
- **删除/关闭**: 移除预览并恢复上传表单。
- **音频字幕/生成**: 处理字幕输入和（可选的）音频生成。
- **JS 集成**: 包含用于文件处理、预览、错误显示和动态表单状态的全面 JS。

####  macro展开示例
```jinja2
{{ media.form_media({
  name: 'option',
  media_type: 'audio',
  extra_type: 'multi',
  show_caption: true,
  caption: option.caption|default(''),
  value: option.raw|default(''),
  file_type: 'QuestionFile'
}) }}
```
渲染为：
```html
<div class="media-container" data-media-type="audio" ...>
  <div class="audio-tag">
    <audio controls ...>
      <source src="..." type="audio/wav">
    </audio>
    <input type="hidden" ...>
    <button ...> ... </button>
  </div>
</div>
```

## 🧪 使用模式

### 题目材料音频编辑
```jinja2
{{ media.form_media({
  name: 'wav_url',
  media_type: 'audio',
  extra_type: 'material',
  show_caption: true,
  caption: audio.caption,
  generate_audio: false,
  value: audio.wav_url|default(''),
  file_type: 'MaterialFile'
}) }}
```
- 用于在题目材料编辑中上传和预览音频文件。

### 题目选项（多选、匹配）
```jinja2
{{ media.form_media({
  name: 'option',
  media_type: 'audio',
  extra_type: 'multi',
  show_caption: true,
  caption: option.caption|default(''),
  value: option.raw|default(''),
  file_type: 'QuestionFile'
}) }}
```
- 用于多选和匹配题目中的音频选项。

### 设置面板
```jinja2
{{ media.form_media({
  help_text: setting.desc,
  name: setting.key,
  input_name: setting.key,
  label: setting.name,
  value: current[setting.key] or setting.value,
  media_type: 'audio',
  extra_type: 'spaceMedia',
  file_type: 'SpaceFile'
}) }}
```
- 用于在组织/用户设置中上传和预览音频。

### 音频按钮（仅播放）
```jinja2
{{ media.audio_button({
  value: audio.wav_url or audio.wav_buffer,
  extra_type: 'material',
  docId: pdoc.docId,
  show_caption: true,
  caption: audio.caption,
  index: loop.index
}) }}
```
- 用于在题目提交和材料审查中进行音频播放。

## 🧠 代码审查与建议

- **可维护性：**  macro结构良好且可组合。考虑对 `args` 进行更严格的类型检查，并为上传和音频播放提供更健壮的错误处理。
- **可扩展性：** 支持大多数常见的音频用例。对于视频或其他媒体类型，可能需要进一步扩展。
- **可访问性：** 使用了正确的标签结构和按钮语义，但要确保为音频控件和字幕维护 ARIA 标签和键盘可访问性。
- **国际化：** 所有面向用户的文本和字幕都应包装在 `_()` 中进行翻译。
- **用户体验：**  macro支持错误反馈、预览和删除，但不原生支持拖放或进度条——如有需要可考虑添加。音频生成为模拟功能；真实集成可能需要后端支持。
- **一致性：** 始终在表单中使用 `form_media` 处理音频字段，以确保一致的布局和行为。

## 📝 文件结构

- `packages/ui-default/templates/components/media.html`:  macro定义（`media`、`form_media`、`audio_button` 等）
- `packages/ui-default/templates/partials/`、`question_edit_multi.html`、`problem_material_audio_edit.html` 等： macro的使用
- 典型导入方式：
  ```jinja2
  {% import 'components/media.html' as media with context %}
  ```

## 📌 注意事项 / 观察

- **设计选择：** 该 macro设计用于与其他表单字段的最大可组合性和网格对齐。
- **多租户：** 用于全局和按空间设置及内容。
- **自定义样式：** 支持 `extra_type` 用于上下文特定的 CSS。
- **帮助文本：** `help_text` 在字段下方渲染以提供用户指导。
- **集成性：** 与其他表单/媒体 macro和 JS 工具无缝协作。
- **测试：**  macro被广泛使用且稳定，但对于新布局或可访问性要求，务必在上下文中进行测试。
- **音频生成：** `generate_audio` 按钮为未来的 TTS 或 AI 音频生成工作流而存在，但可能需要后端集成。

---

如需更多详细信息，请参阅 `components/media.html` 中的 macro定义以及整个 UI 系统中模板的使用情况。
