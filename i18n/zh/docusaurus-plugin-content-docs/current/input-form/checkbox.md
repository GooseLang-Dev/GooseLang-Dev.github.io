---
title: 复选框 (Checkbox)
sidebar_position: 5
id: checkbox
---

# 表单复选框组件

## 📘 概述

`form_checkbox`  macro是 GooseLang 默认 UI 系统中的可重用 UI 组件，用于在表单中渲染复选框输入字段。它提供了一种一致、可访问且可样式化的方式来捕获布尔值（开/关、真/假）用户输入，支持独立使用和表单集成使用。该 macro在平台中广泛用于设置切换、题目创作、导入选项等场景。

## 🔗 依赖关系

- **Jinja2  macro**: 定义在 `components/form.html` 中，通常作为 `form` 导入。
- **form_begin / form_end**: 用于包装表单字段以实现布局、标签和帮助文本。
- **翻译/国际化**: 使用 `_()` 函数进行标签和占位符翻译。
- **CSS 类**: 依赖 `checkbox-container`、`checkbox` 和表单网格类进行样式设置。
- **上下文**: 期望参数 (args) 字典，通常从更高级别的表单逻辑传递。

## 📐 数据结构

###  macro签名

```jinja2
{% macro form_checkbox(args) %}
  {{ form_begin({columns:5}|assign(args)) }}
  {{ checkbox(args) }}
  {{ form_end(args) }}
{% endmacro %}
```

- **`form_checkbox(args)`**: 渲染带标签、网格对齐的复选框字段。
- **`checkbox(args)`**: 渲染原始复选框输入和标签（内部使用）。

### 参数 (`args`)

| 参数           | 类型     | 默认值    | 描述 |
|---------------|----------|-----------|-----|
| `name`        | string   | 必需      | 复选框输入的名称属性 |
| `value`       | mixed    | none      | 当前值；如果为 `true`、`'true'`、`1` 或 `'1'` 则选中 |
| `label`       | string   | none      | 字段标签（显示在复选框上方/左侧） |
| `placeholder` | string   | none      | 复选框输入旁显示的标签文本 |
| `columns`     | number   | 5         | 跨越的网格列数 |
| `row`         | bool     | true      | 是否包装在 `.row` div 中 |
| `required`    | bool     | false     | 字段是否为必需 |
| `disabled`    | bool     | false     | 字段是否被禁用 |
| `extra_class` | string   | none      | 额外的 CSS 类 |
| `help_text`   | string   | none      | 字段下方的帮助文本 |
| `no_label`    | bool     | false     | 隐藏外部标签（用于隐藏/辅助复选框） |
| ...           | ...      | ...       | 传递给输入的任何其他属性 |

#### 值处理
- 如果 `value` 为以下任一值则复选框为**选中**状态：`true`（布尔值）、`'true'`（字符串）、`1`（数字）、`'1'`（字符串）。
- 所有其他值都被视为**未选中**。

#### 渲染结构
- 外层 `.row` 和 `.columns` 用于网格布局（如果 `row` 为 true）
- `.form__item` 用于表单样式
- `<label class="checkbox">` 用于复选框及其标签
- `<input type="checkbox" ...>` 包含所有相关属性
- 下方的可选帮助文本

## ⚙️ 核心方法与逻辑

###  macro内部结构
- **form_checkbox(args)**: 结合 `form_begin`、`checkbox` 和 `form_end` 以创建完整的带标签字段。
- **checkbox(args)**: 渲染复选框输入及其标签。处理选中状态并传递所有相关属性。
- **form_begin/form_end**: 提供网格、标签和帮助文本结构。
- **form_attr**: 用于向输入传递属性（disabled、required、autofocus 等）的 macro。
- **container_attr**: 用于容器 div 属性的 macro。

####  macro展开示例
```jinja2
{{ form.form_checkbox({
  name: 'keepUser',
  label: 'Keep original user',
  placeholder: _('Keep original problem owner.'),
  columns: 6,
  row: false
}) }}
```
渲染为：
```html
<div class="columns form__item end">
  <label>
    Keep original user
    <label class="checkbox">
      <input type="checkbox" name="keepUser" class="checkbox">
      Keep original problem owner.
    </label>
  </label>
</div>
```

## 🧪 使用模式

### 设置面板
```jinja2
{{ form.form_checkbox({
  label:setting.name,
  placeholder:setting.desc,
  name:setting.key,
  value:setting.value if (_val === undefined or _val === null) else _val,
  disabled:setting.flag|bitand(2)
}) }}
```
- 用于组织/用户设置表单中的布尔设置。

### 题目创作
```jinja2
{{form.form_checkbox({
  name: 'richText',
  columns: 12,
  label: _('should render content as rich text?'),
  row: true,
  placeholder: _('If checked, the content will be rendered as rich text. If unchecked, the content will be rendered as plain text.'),
  value: qdoc.richText|default(false)
})}}
```
- 用于切换富文本、手动评分、绝对答案等选项。

### 导入表单
```jinja2
{{ form.form_checkbox ({
  label:'Keep original user',
  columns:6,
  name:'keepUser',
  placeholder:_('Keep original problem owner.'),
  row:false
}) }}
```
- 用于导入选项（例如，在题目导入时保留用户）。

### 题型编辑器
```jinja2
{{ form.form_checkbox({
  placeholder: 'Is answer long context?',
  columns: 12,
  name: 'textLongContext',
  help_text: _('if checked, place reference answer below for AI judge, can re-grade mannualy'),
  value:qdoc['textLongContext']|default(true),
  row: true
}) }}
```
- 用于在题目编辑中切换题目选项。

### 隐藏/元复选框
```jinja2
{{ form.form_checkbox({
  label:setting.name,
  name:'booleanKeys.' + setting.key,
  value:true,
  extra_class:'display-hidden',
  no_label:true
}) }}
```
- 用于隐藏状态或辅助布尔字段。

## 🧠 代码审查与建议

- **可维护性：**  macro结构良好且可组合。考虑在未来重构中对 `args` 进行更严格的类型检查。
- **可扩展性：** 支持大多数常见用例。对于三态或不确定状态复选框，可能需要进一步扩展。
- **可访问性：** 使用了正确的标签结构，但如果使用自定义标签，请确保为屏幕阅读器设置 `id`/`for` 属性。
- **国际化：** 所有面向用户的文本都应包装在 `_()` 中进行翻译。
- **用户体验：**  macro支持帮助文本和禁用状态，但不原生支持工具提示或信息图标——如有需要可考虑添加。
- **一致性：** 始终在表单中使用 `form_checkbox` 来处理布尔字段，以确保一致的布局和行为。

## 📝 文件结构

- `packages/ui-default/templates/components/form.html`:  macro定义（`form_checkbox`、`checkbox` 等）
- `packages/ui-default/templates/partials/`、`problem_question.html` 等： macro的使用
- 典型导入方式：
  ```jinja2
  {% import 'components/form.html' as form with context %}
  ```

## 📌 注意事项 / 观察

- **设计选择：** 该 macro设计用于与其他表单字段的最大可组合性和网格对齐。
- **多租户：** 用于全局和按空间设置表单。
- **自定义样式：** 支持 `extra_class` 用于自定义 CSS。
- **隐藏字段：** `no_label` 和 `display-hidden` 允许在需要时使用不可见复选框。
- **帮助文本：** `help_text` 在字段下方渲染以提供用户指导。
- **集成性：** 与其他表单 macro（文本、选择、单选等）无缝协作，提供统一的 UI。
- **测试：**  macro被广泛使用且稳定，但对于新布局或可访问性要求，务必在上下文中进行测试。

---

如需更多详细信息，请参阅 `components/form.html` 中的 macro定义以及整个 UI 系统中模板的使用情况。
