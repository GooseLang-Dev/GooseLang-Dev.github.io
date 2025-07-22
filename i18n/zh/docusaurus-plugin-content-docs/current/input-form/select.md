---
title: 选择框（Select）
sidebar_position: 1
id: select
---

# 表单选择组件 & macro

## 📘 概览

`form_select` macro 是 GooseLang 默认 UI 系统中用于在表单中渲染下拉（select）字段的可复用 UI 组件。它提供了一种一致、可访问、可自定义样式的方式，用于从选项列表中捕获单项用户输入。该 macro广泛用于平台的设置、题目创建、用户管理等所有需要下拉选择的场景。

## 🔗 依赖项

- **Jinja2 macro**：定义在 `components/form.html` 中，通常以 `form` 导入。
- **form_begin / form_end**：用于包裹表单字段，实现布局、标签与帮助文本结构。
- **翻译 / 国际化（i18n）**：使用 `_()` 函数对标签与选项进行翻译。
- **CSS 类**：依赖 `select-container`、`select` 以及 grid 类实现样式。
- **上下文参数**：接受 `args` 字典作为输入，通常由更高级的表单逻辑传入。

## 📐 数据结构

###  macro签名

```jinja2
{% macro form_select(args) %}
  {{ form_begin({columns:5}|assign(args)) }}
  {{ select(args) }}
  {{ form_end(args) }}
{% endmacro %}
````

* **`form_select(args)`**：渲染一个带标签、网格对齐的选择字段。
* **`select(args)`**：渲染原始的 select 输入及其选项（内部调用）。

### 参数（`args`）

| 参数名           | 类型    | 默认值   | 描述                     |
| ------------- | ----- | ----- | ---------------------- |
| `name`        | 字符串   | 必填    | select 元素的 name 属性     |
| `options`     | 数组/字典 | 必填    | 用于生成选项的键值对数组或字典        |
| `value`       | 字符串   | 无     | 当前选中的值                 |
| `columns`     | 数字    | 5     | 所占用的网格列数               |
| `label`       | 字符串   | 无     | 字段标签（显示在 select 上方或左侧） |
| `required`    | 布尔值   | false | 是否为必填字段                |
| `disabled`    | 布尔值   | false | 是否禁用字段                 |
| `extra_class` | 字符串   | 无     | 附加 CSS 类名              |
| `extra_attr`  | 字符串   | 无     | 附加 HTML 属性             |
| `help_text`   | 字符串   | 无     | 显示在字段下方的帮助文本           |
| ...           | ...   | ...   | 可传入任何其他属性到输入元素         |

#### 值处理规则

* 当 `<option>` 的值与 `value` 参数相同时，该选项将被选中。
* 若未提供 `value`，默认选中第一个选项（符合 HTML 标准行为）。

#### 渲染结构

* 使用外部 `.row` 和 `.columns` 实现网格布局（如果设置了 `row: true`）
* `.form__item` 为表单统一样式容器
* `.select-container` 为选择框的包裹容器
* `<select ...>` 元素及其所有相关属性
* `<option ...>` 为各个选项，支持翻译
* 可选的帮助文本位于下方

## ⚙️ 核心方法与逻辑

###  macro内部逻辑

* **form\_select(args)**：组合 `form_begin`、`select` 与 `form_end`，生成完整带标签字段。
* **select(args)**：渲染选择输入及其选项，处理选中状态，并透传所有相关属性。
* **form\_begin/form\_end**：提供网格布局、标签与帮助文本的结构支持。
* **form\_attr**：用于将属性（如 disabled、required、autofocus 等）传递给输入元素。
* **container\_attr**：用于设置包裹 div 的属性。

####  macro调用示例

```jinja2
{{ form.form_select({
  name: 'lang',
  label: 'Code language',
  options: langRange,
  value: handler.user.codeLang
}) }}
```

渲染为：

```html
<div class="columns form__item end">
  <label>
    Code language
    <div class="select-container">
      <select name="lang" class="select">
        <option value="py">Python</option>
        <option value="cpp">C++</option>
        <option value="js">JavaScript</option>
        <!-- ... -->
      </select>
    </div>
  </label>
</div>
```

## 🧪 使用模式

### 设置面板

```jinja2
{{ form.form_select({
  options: setting.range,
  label: setting.name,
  help_text: setting.desc,
  name: setting.key,
  value: current[setting.key] or setting.value,
  disabled: setting.flag|bitand(2)
}) }}
```

* 用于组织/用户设置表单中的单项选择设置。

### 题目创建

```jinja2
{{ form.form_select({
  columns: 6,
  options: [
    ["", _( "Choose Question Type")],
    ["text", _( "Text")],
    ["multi", _( "Multiple Choice")],
    ["match", _( "Match")],
    ["audio", _( "Audio")]
  ],
  label: _('Question type'),
  help_text: _('Choose question type before next step'),
  name: 'type',
  value: qdoc.type|default(''),
  row: true
}) }}
```

* 用于选择题型、选项类型等。

### 比赛编辑

```jinja2
{{ form.form_select({
  columns:3,
  label:'Rule',
  name:'rule',
  options:rules,
  value:tdoc['rule']|default(''),
  row:false
}) }}
```

* 用于设置比赛规则。

### 空间/用户管理

```jinja2
{{ form.select({
  label:_('Select a role'),
  options:_rolesSelect,
  name:'role',
  value:rudoc.role,
  extra_class:'compact',
  disabled:is_disabled
}) }}
```

* 用于分配用户角色。

## 🧠 代码审查与建议

* **可维护性**： macro结构清晰、可组合性强。未来重构时可考虑对 `args` 和 `options` 加强类型检查。
* **可扩展性**：已支持大多数通用用例。若需分组选项或选项描述，可进一步扩展。
* **无障碍支持**：已使用标准标签结构。若使用自定义标签，请确保设置 `id` / `for` 属性以便屏幕阅读器识别。
* **国际化（i18n）**：所有用户可见文本应使用 `_()` 包裹以支持翻译。
* **用户体验**：支持帮助文本与禁用状态。尚未原生支持分组选项或选项描述——可考虑添加。
* **一致性**：表单中的下拉字段应始终使用 `form_select`  macro，以确保布局和行为一致。

## 📝 文件结构

* `packages/ui-default/templates/components/form.html`： macro定义（`form_select`、`select` 等）
* `packages/ui-default/templates/partials/`、`setting.html` 等： macro的使用位置
* 典型导入方式：

  ```jinja2
  {% import 'components/form.html' as form with context %}
  ```

## 📌 说明 / 观察

* **设计选择**：该 macro为最大化组合性与表单字段网格对齐而设计。
* **多租户适配**：支持全局与空间级别设置表单。
* **自定义样式**：通过 `extra_class` 支持定制 CSS。
* **帮助文本**：`help_text` 显示在字段下方以提供引导。
* **集成性**：可与其他表单 macro（如 text、radio、checkbox 等）无缝组合，构建统一 UI。
* **测试建议**： macro已广泛使用且较稳定，但在新布局或无障碍需求下应结合上下文测试。

---

如需进一步了解，请参阅 `components/form.html` 中的 macro定义以及 UI 系统中模板的实际使用方式。