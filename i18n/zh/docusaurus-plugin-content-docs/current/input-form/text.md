---
title: 文本 (Text)
sidebar_position: 3
id: text
---

# 表单文本组件 & macro

## 📘 概述

`form_text`  macro是 GooseLang 默认 UI 系统中用于在表单中渲染文本输入字段的可复用 UI 组件。它支持多种输入类型（文本、数字、邮箱、密码、日期、时间等）、验证功能，以及如自动聚焦和自动补全控制等高级特性。该 macro广泛用于平台中的设置、题目编辑、用户管理，以及任何需要单行文本或数字输入的场景。

## 🔗 依赖项

- **Jinja2  macro**：定义于 `components/form.html` 中，通常以 `form` 引入。
- **form_begin / form_end**：用于包裹表单字段，处理布局、标签和帮助文本。
- **翻译/i18n**：使用 `_()` 函数进行标签与占位符文本的翻译。
- **CSS 类**：依赖 `textbox-container`、`textbox` 和网格类进行样式渲染。
- **上下文**：期望一个 `args` 参数字典，通常由更高层级的表单逻辑传入。

## 📐 数据结构

###  macro定义

```jinja2
{% macro form_text(args) %}
  {{ form_begin({columns:5}|assign(args)) }}
  {{ text(args) }}
  {{ form_end(args) }}
{% endmacro %}
````

* **`form_text(args)`**：渲染一个带标签、对齐到网格的文本输入字段。
* **`text(args)`**：渲染原始输入元素（内部调用使用）。

### 参数（`args`）

| 参数名              | 类型  | 默认值    | 描述                                              |
| ---------------- | --- | ------ | ----------------------------------------------- |
| `name`           | 字符串 | 必填     | 输入框的 `name` 属性                                  |
| `value`          | 字符串 | 无      | 当前输入值                                           |
| `type`           | 字符串 | 'text' | 输入类型（'text'、'float'、'email'、'password'、'url' 等） |
| `placeholder`    | 字符串 | 无      | 占位符文本                                           |
| `columns`        | 数值  | 5      | 所占网格列数                                          |
| `label`          | 字符串 | 无      | 字段标签（显示在输入框上方或左侧）                               |
| `required`       | 布尔值 | false  | 是否为必填字段                                         |
| `disabled`       | 布尔值 | false  | 是否禁用该字段                                         |
| `autofocus`      | 布尔值 | false  | 是否自动聚焦该字段                                       |
| `noAutocomplete` | 布尔值 | false  | 是否禁用浏览器自动填充                                     |
| `date`           | 布尔值 | false  | 启用日期选择器                                         |
| `time`           | 布尔值 | false  | 启用时间选择器                                         |
| `datetime`       | 布尔值 | false  | 启用日期时间选择器                                       |
| `extra_class`    | 字符串 | 无      | 额外的 CSS 类                                       |
| `extra_style`    | 字符串 | 无      | 额外的内联样式                                         |
| `help_text`      | 字符串 | 无      | 字段下方的帮助文本                                       |
| ...              | ... | ...    | 传递给输入框的其他属性                                     |

#### 值处理逻辑

* 输入框的 `value` 属性取自传入的值。
* 如果 `type` 为 `float`，则渲染为 `type="number"` 且 `step="any"` 以支持小数。
* 如果启用了 `date`、`time` 或 `datetime`，则相应启用选择器。

#### 渲染结构

* 外层为 `.row` 和 `.columns`（若 `row` 为 true）用于网格布局
* `.form__item` 提供表单样式
* `.textbox-container` 包裹输入组
* `<input ...>` 包含所有相关属性
* 可选的帮助文本显示在字段下方

## ⚙️ 核心方法与逻辑

###  macro内部逻辑

* **form\_text(args)**：组合 `form_begin`、`text` 和 `form_end` 渲染完整的带标签输入字段。
* **text(args)**：渲染实际的输入框，处理类型、值并传递所有相关属性。
* **form\_begin/form\_end**：提供网格、标签和帮助文本结构。
* **form\_attr**： macro，用于传递属性（如 disabled、required、autofocus 等）。
* **container\_attr**： macro，用于容器 div 的属性处理。

####  macro展开示例

```jinja2
{{ form.form_text({
  name: 'title',
  label: 'Title',
  value: tdoc['title']|default(''),
  placeholder:_('title'),
  columns:12,
  autofocus:true
}) }}
```

渲染为：

```html
<div class="columns form__item end">
  <label>
    Title
    <div class="textbox-container">
      <input type="text" name="title" value="..." placeholder="title" class="textbox" autofocus>
    </div>
  </label>
</div>
```

## 🧪 使用模式

### 设置面板

```jinja2
{{ form.form_text({
  type:setting.type,
  label:setting.name,
  help_text:setting.desc,
  name:setting.key,
  value:'' if (secret or isFileConfig) else (current[setting.key]|default(setting.value)),
  disabled:setting.flag|bitand(2),
  placeholder:_('(Not changed)') if secret else ''
}) }}
```

* 用于组织/用户设置表单中的文本、密码、数字与浮点设置。

### 题目编辑

```jinja2
{{ form.form_text({
  columns:12,
  label:'Title',
  name:'title',
  placeholder:_('title'),
  value:tdoc['title']|default(''),
  autofocus:true
}) }}
```

* 用于题目标题、选项文本等。

### 素材与媒体表单

```jinja2
{{ form.form_text({
  name:args.name,
  value:''|default(''),
  placeholder:_( 'Place '+args.media_type+' file link here'),
  row:false,
  columns:12
}) }}
```

* 用于文件链接、说明等单行输入。

### 空间加入表单

```jinja2
{{ form.form_text({
  columns:None,
  label:'Invitation Code',
  name:'code',
  required:true,
  help_text:'You need to enter the invitation code to join the space.',
  value:code,
  autofocus:true
}) }}
```

* 用于邀请码输入等场景。

## 🧠 代码审查与建议

* **可维护性**： macro结构清晰、可组合。建议未来增强对 `args` 与 `type` 的类型校验。
* **可扩展性**：覆盖大部分常见用例。若需多行输入，请使用 `form_textarea`。
* **无障碍性**：已使用标签结构。若使用自定义标签，需确保设置 `id`/`for` 属性以支持屏幕阅读器。
* **国际化**：所有面向用户的文本应使用 `_()` 包裹以实现翻译。
* **用户体验**： macro支持帮助文本、自动聚焦和禁用状态，但不支持输入掩码或验证提示——如有需要建议添加。
* **一致性**：建议在表单中始终使用 `form_text` 来保持布局和行为一致性。

## 📝 文件结构

* `packages/ui-default/templates/components/form.html`： macro定义位置（如 `form_text`、`text` 等）
* `packages/ui-default/templates/partials/`、`problem_material.html` 等： macro使用位置
* 典型引入方式：

  ```jinja2
  {% import 'components/form.html' as form with context %}
  ```

## 📌 说明 / 观察

* **设计选择**：该 macro旨在实现高度可组合性和与其他字段的网格对齐。
* **多租户支持**：同时用于全局和空间级设置表单。
* **自定义样式**：支持 `extra_class` 与 `extra_style` 以实现样式定制。
* **帮助文本**：`help_text` 会渲染在字段下方，用于引导用户。
* **集成性**：可与其他表单 macro（select、radio、checkbox 等）无缝配合，构建统一 UI。
* **测试性**： macro使用广泛且稳定，但在新布局或无障碍场景中仍需上下文测试。

---

如需更多详情，请参阅 `components/form.html` 中的 macro定义以及 UI 系统中各模板的具体用法。
