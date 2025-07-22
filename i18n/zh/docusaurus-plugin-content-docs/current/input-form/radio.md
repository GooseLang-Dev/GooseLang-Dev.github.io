---
title: 单选按钮 (Radio)
sidebar_position: 2
id: radio
---

# 表单单选按钮与图像单选按钮组件

## 📘 概述

`form_radio` 和 `form_image_radio`  macro是 GooseLang 默认 UI 系统中的可重用 UI 组件，用于在表单中渲染单选按钮组。它们提供了一种一致、可访问且可样式化的方式来捕获单选用户输入，支持基于文本和基于图像的选项。这些 macro在平台中广泛用于设置、题目创作以及任何需要从一组选项中进行排他性选择的场景。

## 🔗 依赖关系

- **Jinja2  macro**: 定义在 `components/form.html` 中，通常作为 `form` 导入。
- **form_begin / form_end**: 用于包装表单字段以实现布局、标签和帮助文本。
- **翻译/国际化**: 使用 `_()` 函数进行标签和选项翻译。
- **CSS 类**: 依赖 `radiobox-container`、`radiobox` 和网格类进行样式设置。
- **上下文**: 期望参数 (args) 字典，通常从更高级别的表单逻辑传递。

## 📐 数据结构

###  macro签名

```jinja2
{% macro form_radio(args) %}
  {{ form_begin({columns:5, label_wrap:false}|assign(args)) }}
  {{ radio(args) }}
  {{ form_end({label_warp:false}|assign(args)) }}
{% endmacro %}

{% macro form_image_radio(args) %}
  {{ form_begin({columns:8, label_warp:false}|assign(args)) }}
  {{ image_radio(args) }}
  {{ form_end({label_warp:false}|assign(args)) }}
{% endmacro %}
```

- **`form_radio(args)`**: 渲染带标签、网格对齐的单选按钮组。
- **`form_image_radio(args)`**: 渲染带标签、网格对齐的图像单选按钮组。
- **`radio(args)`**: 渲染原始单选按钮输入和标签（内部使用）。
- **`image_radio(args)`**: 渲染原始图像单选按钮输入和标签（内部使用）。

### 参数 (`args`)

| 参数           | 类型     | 默认值    | 描述 |
|---------------|----------|-----------|-----|
| `name`        | string   | 必需      | 单选按钮输入的名称属性（所有选项共享此名称） |
| `options`     | array    | 必需      | 单选按钮选项的键值对数组（例如，`[('a', 'Option A'), ('b', 'Option B')]`） |
| `value`       | string   | none      | 当前选中的值 |
| `columns`     | number   | 5/8       | 跨越的网格列数（标准为5，图像为8） |
| `label`       | string   | none      | 字段标签（显示在组的上方/左侧） |
| `required`    | bool     | false     | 字段是否为必需 |
| `disabled`    | bool     | false     | 字段是否被禁用 |
| `image_class` | string   | none      | 图像单选按钮的 CSS 类模式（仅图像变体） |
| `extra_class` | string   | none      | 额外的 CSS 类 |
| `help_text`   | string   | none      | 字段下方的帮助文本 |
| ...           | ...      | ...       | 传递给输入的任何其他属性 |

#### 值处理
- 如果单选按钮的值与 `value` 参数匹配，则该单选按钮为**选中**状态。
- 一个组中只能有一个单选按钮被选中（HTML 标准）。

#### 渲染结构
- 外层 `.row` 和 `.columns` 用于网格布局（如果 `row` 为 true）
- `.form__item` 用于表单样式
- `.radiobox-container` 或 `.radiobox-container with-image` 用于组
- `<label class="radiobox">` 用于每个选项
- `<input type="radio" ...>` 包含所有相关属性
- 对于图像单选按钮：每个选项的图像预览和工具提示
- 下方的可选帮助文本

## ⚙️ 核心方法与逻辑

###  macro内部结构
- **form_radio(args)**: 结合 `form_begin`、`radio` 和 `form_end` 以创建完整的带标签字段。
- **form_image_radio(args)**: 结合 `form_begin`、`image_radio` 和 `form_end` 以实现基于图像的选择。
- **radio(args)**: 渲染每个单选按钮输入及其标签。处理选中状态并传递所有相关属性。
- **image_radio(args)**: 渲染每个单选按钮输入及其图像预览和工具提示。
- **form_begin/form_end**: 提供网格、标签和帮助文本结构。
- **form_attr**: 用于向输入传递属性（disabled、required、autofocus 等）的 macro。
- **container_attr**: 用于容器 div 属性的 macro。

####  macro展开示例
```jinja2
{{ form.form_radio({
  name: 'difficulty',
  label: 'Difficulty',
  options: [('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard')],
  value: 'medium',
  columns: 5
}) }}
```
渲染为：
```html
<div class="columns form__item end">
  <label>
    Difficulty
    <div class="radiobox-container">
      <label class="radiobox">
        <input type="radio" name="difficulty" value="easy"> Easy
      </label>
      <label class="radiobox">
        <input type="radio" name="difficulty" value="medium" checked> Medium
      </label>
      <label class="radiobox">
        <input type="radio" name="difficulty" value="hard"> Hard
      </label>
    </div>
  </label>
</div>
```

## 🧪 使用模式

### 设置面板
```jinja2
{{ form.form_radio({
  options: setting.range,
  label: setting.name,
  help_text: setting.desc,
  name: setting.key,
  value: current[setting.key] or setting.value,
  disabled: setting.flag|bitand(2)
}) }}
```
- 用于组织/用户设置表单中的单选设置。

### 设置中的图像单选按钮
```jinja2
{{ form.form_image_radio({
  options: setting.range,
  image_class: setting.image_class,
  label: setting.name,
  help_text: setting.desc,
  name: setting.key,
  value: current[setting.key] or setting.value,
  disabled: setting.flag|bitand(2)
}) }}
```
- 用于最适合通过视觉方式表示选项的设置（例如，主题、头像等）。

## 🧠 代码审查与建议

- **可维护性：**  macro结构良好且可组合。考虑在未来重构中对 `args` 和 `options` 进行更严格的类型检查。
- **可扩展性：** 支持大多数常见用例。对于自定义选项渲染（例如，图标、色块），可能需要进一步扩展。
- **可访问性：** 使用了正确的标签结构，但如果使用自定义标签，请确保为屏幕阅读器设置 `id`/`for` 属性。图像单选按钮中的工具提示提高了可用性。
- **国际化：** 所有面向用户的文本都应包装在 `_()` 中进行翻译。
- **用户体验：**  macro支持帮助文本和禁用状态，但不原生支持选项分组或描述——如有需要可考虑添加。
- **一致性：** 始终在表单中使用 `form_radio` 或 `form_image_radio` 来处理单选字段，以确保一致的布局和行为。

## 📝 文件结构

- `packages/ui-default/templates/components/form.html`:  macro定义（`form_radio`、`form_image_radio`、`radio`、`image_radio` 等）
- `packages/ui-default/templates/partials/`、`setting.html` 等： macro的使用
- 典型导入方式：
  ```jinja2
  {% import 'components/form.html' as form with context %}
  ```

## 📌 注意事项 / 观察

- **设计选择：** 该 macro设计用于与其他表单字段的最大可组合性和网格对齐。
- **多租户：** 用于全局和按空间设置表单。
- **自定义样式：** 支持 `extra_class` 和 `image_class` 用于自定义 CSS。
- **帮助文本：** `help_text` 在字段下方渲染以提供用户指导。
- **集成性：** 与其他表单 macro（文本、选择、复选框等）无缝协作，提供统一的 UI。
- **测试：**  macro被广泛使用且稳定，但对于新布局或可访问性要求，务必在上下文中进行测试。

---

如需更多详细信息，请参阅 `components/form.html` 中的 macro定义以及整个 UI 系统中模板的使用情况。
