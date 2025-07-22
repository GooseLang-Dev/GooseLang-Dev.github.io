---
title: 开关 (Switch)
sidebar_position: 6
id: switch
---

# 表单开关组件 & macro

## 📘 概述

`form_switch`  macro是 GooseLang 默认 UI 系统中的可重用 UI 组件，用于在表单中渲染切换开关字段。它提供了一种现代、可访问且可样式化的方式来捕获布尔值（开/关、真/假）用户输入，在视觉上与复选框有所区别。该 macro在平台中广泛用于设置切换、材料选项以及任何首选开关样式布尔输入的场景。

## 🔗 依赖关系

- **Jinja2  macro**: 定义在 `components/form.html` 中，通常作为 `form` 导入。
- **form_begin / form_end**: 用于包装表单字段以实现布局、标签和帮助文本。
- **翻译/国际化**: 使用 `_()` 函数进行标签和占位符翻译。
- **CSS 类**: 依赖 `switch-container`、`switch`、`switch__slider` 和网格类进行样式设置。
- **上下文**: 期望参数 (args) 字典，通常从更高级别的表单逻辑传递。

## 📐 数据结构

###  macro签名

```jinja2
{% macro form_switch(args) %}
  {{ form_begin({columns:5}|assign(args)) }}
  {{ switch(args) }}
  {{ form_end(args) }}
{% endmacro %}
```

- **`form_switch(args)`**: 渲染带标签、网格对齐的开关字段。
- **`switch(args)`**: 渲染原始开关输入和标签（内部使用）。

### 参数 (`args`)

| 参数           | 类型     | 默认值    | 描述 |
|---------------|----------|-----------|-----|
| `name`        | string   | 必需      | 开关输入的名称属性 |
| `value`       | boolean  | false     | 当前开关状态（为 true 时选中） |
| `placeholder` | string   | none      | 开关旁显示的标签文本 |
| `columns`     | number   | 5         | 跨越的网格列数 |
| `label`       | string   | none      | 字段标签（显示在开关上方/左侧） |
| `required`    | bool     | false     | 字段是否为必需 |
| `disabled`    | bool     | false     | 字段是否被禁用 |
| `extra_class` | string   | none      | 额外的 CSS 类 |
| `help_text`   | string   | none      | 字段下方的帮助文本 |
| ...           | ...      | ...       | 传递给输入的任何其他属性 |

#### 值处理
- 如果 `value` 为 `true`（布尔值）或真值，则开关为**选中**状态。
- 所有其他值都被视为**未选中**。

#### 渲染结构
- 外层 `.row` 和 `.columns` 用于网格布局（如果 `row` 为 true）
- `.form__item` 用于表单样式
- `.switch-container` 用于组
- `<label class="switch">` 用于开关及其滑块
- `<input type="checkbox" ...>` 用于状态管理
- `<span class="switch__slider"></span>` 用于视觉滑块
- 开关旁的可选占位符文本
- 下方的可选帮助文本

## ⚙️ 核心方法与逻辑

###  macro内部结构
- **form_switch(args)**: 结合 `form_begin`、`switch` 和 `form_end` 以创建完整的带标签字段。
- **switch(args)**: 渲染开关输入及其标签。处理选中状态并传递所有相关属性。
- **form_begin/form_end**: 提供网格、标签和帮助文本结构。
- **form_attr**: 用于向输入传递属性（disabled、required、autofocus 等）的 macro。
- **container_attr**: 用于容器 div 属性的 macro。

####  macro展开示例
```jinja2
{{ form.form_switch({
  name: 'tokenizeMaterial',
  value: udoc.tokenizeMaterial|default(false),
  placeholder:_('Tokenize Content'),
  columns:6,
  row: false
}) }}
```
渲染为：
```html
<div class="columns form__item end">
  <label>
    <div class="switch-container">
      <label class="switch">
        <input type="checkbox" name="tokenizeMaterial" checked>
        <span class="switch__slider"></span>
      </label>
      <p1 style="padding-left: 5px;">Tokenize Content</p1>
    </div>
  </label>
</div>
```

## 🧪 使用模式

### 题目材料选项
```jinja2
{{ form.form_switch({
  name: 'tokenizeMaterial',
  value: udoc.tokenizeMaterial|default(false),
  placeholder:_('Tokenize Content'),
  columns:6,
  row: false
}) }}

{{ form.form_switch({
  name: 'showMaterialCaptions',
  value: udoc.showMaterialCaptions|default(false),
  placeholder:_('Show Captions'),
  columns:6,
  row: false
}) }}
```
- 用于在题目材料编辑中切换材料选项。

### 题目提交选项
```jinja2
{{ form.form_switch({
  name: 'translateQuestions',
  value: udoc.translateQuestions|default(false),
  checked: udoc.translateQuestions|default(false),
  placeholder:_('Translate'),
  columns:3,
  row: false
}) }}
```
- 用于在提交表单中切换题目翻译。

## 🧠 代码审查与建议

- **可维护性：**  macro结构良好且可组合。考虑在未来重构中对 `args` 进行更严格的类型检查。
- **可扩展性：** 支持大多数常见用例。对于三态或不确定状态开关，可能需要进一步扩展。
- **可访问性：** 使用了正确的标签结构，但如果使用自定义标签，请确保为屏幕阅读器设置 `id`/`for` 属性。滑块 span 仅用于视觉效果。
- **国际化：** 所有面向用户的文本都应包装在 `_()` 中进行翻译。
- **用户体验：**  macro支持帮助文本和禁用状态，但不原生支持工具提示或信息图标——如有需要可考虑添加。
- **一致性：** 始终在表单中使用 `form_switch` 来处理切换字段，以确保一致的布局和行为。

## 📝 文件结构

- `packages/ui-default/templates/components/form.html`:  macro定义（`form_switch`、`switch` 等）
- `packages/ui-default/templates/partials/`、`problem_submit_material.html` 等： macro的使用
- 典型导入方式：
  ```jinja2
  {% import 'components/form.html' as form with context %}
  ```

## 📌 注意事项 / 观察

- **设计选择：** 该 macro设计用于与其他表单字段的最大可组合性和网格对齐。
- **多租户：** 用于全局和按空间设置表单。
- **自定义样式：** 支持 `extra_class` 用于自定义 CSS。
- **帮助文本：** `help_text` 在字段下方渲染以提供用户指导。
- **集成性：** 与其他表单 macro（文本、选择、复选框等）无缝协作，提供统一的 UI。
- **测试：**  macro被广泛使用且稳定，但对于新布局或可访问性要求，务必在上下文中进行测试。

---

如需更多详细信息，请参阅 `components/form.html` 中的 macro定义以及整个 UI 系统中模板的使用情况。
