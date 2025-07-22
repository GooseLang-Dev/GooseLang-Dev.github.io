---
title: 多行文本框 (Textarea)
sidebar_position: 4
id: textarea
---

# 表单文本区域组件 & macro

## 📘 概述

`form_textarea` macro是GooseLang默认UI系统中的可复用UI组件，用于在表单内渲染多行文本输入区域。它支持Markdown编辑、拼写检查及高级功能（如自定义网格尺寸和帮助文本）。该 macro广泛应用于平台中的设置、题目编写、用户导入等需要富文本或长文本输入的场景。

## 🔗 依赖项

- **Jinja2 macro**：定义于`components/form.html`，通常以`form`形式导入
- **form_begin/form_end**：用于包裹表单字段以实现布局、标签和帮助文本
- **国际化(i18n)**：使用`_()`函数翻译标签和占位符
- **CSS类**：依赖`textarea-container`、`textbox`及网格类实现样式
- **上下文**：接收参数(args)字典，通常从高层表单逻辑传递

## 📐 数据结构

###  macro定义

```jinja2
{% macro form_textarea(args) %}
  {{ form_begin({columns:10}|assign(args)) }}
  {{ textarea(args) }}
  {{ form_end(args) }}
{% endmacro %}
```

- **`form_textarea(args)`**：渲染带标签、网格对齐的文本区域字段
- **`textarea(args)`**：渲染原始`<textarea>`元素（内部使用）

### 参数(`args`)

| 参数            | 类型     | 默认值    | 说明                          |
|----------------|----------|-----------|-------------------------------|
| `name`         | 字符串   | 必填      | 文本区域的name属性            |
| `value`        | 字符串   | 无        | 当前文本内容                  |
| `placeholder`  | 字符串   | 无        | 占位文本                      |
| `columns`      | 数字     | 10        | 网格列宽                      |
| `label`        | 字符串   | 无        | 字段标签（显示在文本区域上方/左侧）|
| `required`     | 布尔值   | false     | 是否必填字段                  |
| `disabled`     | 布尔值   | false     | 是否禁用字段                  |
| `markdown`     | 布尔值   | false     | 启用Markdown编辑功能          |
| `nospellcheck` | 布尔值   | false     | 禁用浏览器拼写检查            |
| `extra_class`  | 字符串   | 无        | 附加CSS类                     |
| `extra_attr`   | 字符串   | 无        | 附加HTML属性                  |
| `help_text`    | 字符串   | 无        | 字段下方帮助文本              |
| ...            | ...      | ...       | 其他传递给文本区域的属性      |

#### 值处理规则
- `<textarea>`内容设置为传入的`value`
- 若`markdown: true`，则添加`data-markdown`属性用于JS集成
- 若`nospellcheck: true`，则设置`spellcheck="false"`属性

#### 渲染结构
- 外层`.row`和`.columns`实现网格布局（当`row`为true时）
- `.form__item`实现表单样式
- `.textarea-container`包裹容器
- `<textarea ...>`包含所有相关属性
- 底部可选帮助文本

## ⚙️ 核心方法与逻辑

###  macro内部机制
- **form_textarea(args)**：组合`form_begin`、`textarea`和`form_end`形成完整带标签字段
- **textarea(args)**：渲染`<textarea>`元素，处理值、Markdown、拼写检查及透传属性
- **form_begin/form_end**：提供网格、标签和帮助文本结构
- **form_attr**： macro用于传递属性（禁用/必填/自动聚焦等）至文本区域
- **container_attr**： macro用于容器div属性

####  macro展开示例
```jinja2
{{ form.form_textarea({
  name: 'content',
  columns: 12,
  label: '内容',
  markdown: true,
  value: tdoc['content']|default(''),
  extra_style: 'height: 300px',
  extra_textarea_class: 'auto-resize',
  row: true
}) }}
```
渲染结果：
```html
<div class="columns form__item end">
  <label>
    内容
    <div class="textarea-container">
      <textarea name="content" data-markdown style="height: 300px" class="textbox auto-resize">...</textarea>
    </div>
  </label>
</div>
```

## 🧪 使用模式

### 设置面板
```jinja2
{{ form.form_textarea({
  label: setting.name,
  help_text: setting.desc,
  name: setting.key,
  value: '' if secret else (current[setting.key]|default(setting.value)),
  disabled: setting.flag|bitand(2),
  placeholder: _('(未修改)') if secret else '',
  extra_attr: 'data-yaml' if setting.subType == 'yaml' else ''
}) }}

{{ form.form_textarea({
  label: setting.name,
  help_text: setting.desc,
  name: setting.key,
  value: '' if secret else (current[setting.key]|default(setting.value)),
  markdown: true,
  disabled: setting.flag|bitand(2),
  placeholder: _('(未修改)') if secret else ''
}) }}
```
- 用于多行设置、YAML和Markdown字段

### 题目编写
```jinja2
{{ form.form_textarea({
  columns: 12,
  label: '内容',
  name: 'content',
  markdown: true,
  extra_style: 'height: 300px',
  extra_textarea_class: 'auto-resize',
  value: qdoc.content.raw if qdoc.content else '',
  row: true
}) }}
```
- 用于题目内容、答案和描述

### 用户导入
```jinja2
{{ form.form_textarea({
  columns: null,
  label: '用户',
  name: 'users',
  nospellcheck: true
}) }}
```
- 用于批量用户导入等流程

### 讨论区编辑
```jinja2
{{ form.form_textarea({
  columns: 12,
  label: '内容',
  name: 'content',
  value: ddoc.content|default(''),
  hotkeys: 'ctrl+enter:提交',
  markdown: true,
  required: true,
  extra_style: 'height: 500px',
  extra_textarea_class: 'auto-resize'
}) }}
```
- 用于讨论区内容及Markdown编辑

## 🧠 代码审查与建议

- **可维护性**： macro结构良好且可组合。未来重构时可考虑对`args`和文本区域特定选项加强类型检查
- **扩展性**：支持多数常见用例。对于代码编辑器或JSON/YAML，可通过`extra_attr`添加自定义数据属性
- **无障碍访问**：使用标准标签结构，但若使用自定义标签需设置`id`/`for`属性以支持屏幕阅读器
- **国际化**：所有用户可见文本应使用`_()`包裹以支持翻译
- **用户体验**：支持帮助文本、Markdown和拼写检查，但原生不支持输入长度限制或验证提示——如有需要可考虑添加
- **一致性**：表单中所有多行字段统一使用`form_textarea`以确保布局和行为一致

## 📝 文件结构

- `packages/ui-default/templates/components/form.html`： macro定义（`form_textarea`、`textarea`等）
- `packages/ui-default/templates/partials/`、`problem_material_text_edit.html`等： macro使用位置
- 典型导入方式：
  ```jinja2
  {% import 'components/form.html' as form with context %}
  ```

## 📌 注意事项

- **设计选择**：该 macro专为实现最大化可组合性及与其他表单字段的网格对齐而设计
- **多租户支持**：适用于全局和空间专属的设置表单
- **自定义样式**：支持通过`extra_class`、`extra_attr`和`extra_style`添加自定义CSS及属性
- **帮助文本**：`help_text`在字段下方渲染为用户指引
- **集成性**：与其他表单 macro（文本/选择框/复选框等）无缝协作实现统一UI
- **测试建议**： macro已广泛使用且稳定，但新增布局或无障碍需求时需进行上下文测试

---

更多细节请参阅`components/form.html`中的 macro定义及UI系统各模板中的使用实例。