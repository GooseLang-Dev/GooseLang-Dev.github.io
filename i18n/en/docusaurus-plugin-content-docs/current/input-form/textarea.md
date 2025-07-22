---
title: Textarea 
sidebar_position: 4
id: textarea
---

# Form Textarea Component & Macro

## 📘 Overview

The `form_textarea` macro is a reusable UI component in GooseLang's default UI system for rendering multi-line text input areas within forms. It supports markdown editing, spell checking, and advanced features like custom grid sizing and help text. The macro is used throughout the platform for settings, problem authoring, user import, and any scenario requiring rich or long-form text input.

## 🔗 Dependencies

- **Jinja2 Macros**: Defined in `components/form.html`, typically imported as `form`.
- **form_begin / form_end**: Used to wrap form fields for layout, labels, and help text.
- **Translation/i18n**: Uses the `_()` function for label and placeholder translation.
- **CSS Classes**: Relies on `textarea-container`, `textbox`, and grid classes for styling.
- **Context**: Expects arguments (args) dict, often passed from higher-level form logic.

## 📐 Data Structures

### Macro Signature

```jinja2
{% macro form_textarea(args) %}
  {{ form_begin({columns:10}|assign(args)) }}
  {{ textarea(args) }}
  {{ form_end(args) }}
{% endmacro %}
```

- **`form_textarea(args)`**: Renders a labeled, grid-aligned textarea field.
- **`textarea(args)`**: Renders the raw `<textarea>` element (used internally).

### Arguments (`args`)

| Argument      | Type     | Default   | Description |
|--------------|----------|-----------|-------------|
| `name`       | string   | required  | Name attribute for the textarea |
| `value`      | string   | none      | Current textarea content |
| `placeholder`| string   | none      | Placeholder text |
| `columns`    | number   | 10        | Grid columns to span |
| `label`      | string   | none      | Field label (shown above/left of textarea) |
| `required`   | bool     | false     | Whether the field is required |
| `disabled`   | bool     | false     | Whether the field is disabled |
| `markdown`   | bool     | false     | Enable markdown editing features |
| `nospellcheck`| bool    | false     | Disable browser spell checking |
| `extra_class`| string   | none      | Additional CSS classes |
| `extra_attr` | string   | none      | Additional HTML attributes |
| `help_text`  | string   | none      | Help text below the field |
| ...          | ...      | ...       | Any other attributes passed to the textarea |

#### Value Handling
- The `<textarea>`'s content is set to the provided value.
- If `markdown: true`, the `data-markdown` attribute is added for JS integration.
- If `nospellcheck: true`, the `spellcheck` attribute is set to `false`.

#### Rendering Structure
- Outer `.row` and `.columns` for grid layout (if `row` is true)
- `.form__item` for form styling
- `.textarea-container` for the group
- `<textarea ...>` with all relevant attributes
- Optional help text below

## ⚙️ Core Methods & Logic

### Macro Internals
- **form_textarea(args)**: Combines `form_begin`, `textarea`, and `form_end` for a complete, labeled field.
- **textarea(args)**: Renders the `<textarea>` element. Handles value, markdown, spellcheck, and passes through all relevant attributes.
- **form_begin/form_end**: Provide grid, label, and help text structure.
- **form_attr**: Macro for passing attributes (disabled, required, autofocus, etc.) to the textarea.
- **container_attr**: Macro for container div attributes.

#### Example Macro Expansion
```jinja2
{{ form.form_textarea({
  name: 'content',
  columns: 12,
  label: 'Content',
  markdown: true,
  value: tdoc['content']|default(''),
  extra_style: 'height: 300px',
  extra_textarea_class: 'auto-resize',
  row: true
}) }}
```
Renders as:
```html
<div class="columns form__item end">
  <label>
    Content
    <div class="textarea-container">
      <textarea name="content" data-markdown style="height: 300px" class="textbox auto-resize">...</textarea>
    </div>
  </label>
</div>
```

## 🧪 Usage Patterns

### Settings Panel
```jinja2
{{ form.form_textarea({
  label: setting.name,
  help_text: setting.desc,
  name: setting.key,
  value: '' if secret else (current[setting.key]|default(setting.value)),
  disabled: setting.flag|bitand(2),
  placeholder: _('(Not changed)') if secret else '',
  extra_attr: 'data-yaml' if setting.subType == 'yaml' else ''
}) }}

{{ form.form_textarea({
  label: setting.name,
  help_text: setting.desc,
  name: setting.key,
  value: '' if secret else (current[setting.key]|default(setting.value)),
  markdown: true,
  disabled: setting.flag|bitand(2),
  placeholder: _('(Not changed)') if secret else ''
}) }}
```
- Used for multi-line settings, YAML, and markdown fields.

### Problem Authoring
```jinja2
{{ form.form_textarea({
  columns: 12,
  label: 'Content',
  name: 'content',
  markdown: true,
  extra_style: 'height: 300px',
  extra_textarea_class: 'auto-resize',
  value: qdoc.content.raw if qdoc.content else '',
  row: true
}) }}
```
- Used for question content, answers, and descriptions.

### User Import
```jinja2
{{ form.form_textarea({
  columns: null,
  label: 'Users',
  name: 'users',
  nospellcheck: true
}) }}
```
- Used for bulk user import and similar flows.

### Discussion Editing
```jinja2
{{ form.form_textarea({
  columns: 12,
  label: 'Content',
  name: 'content',
  value: ddoc.content|default(''),
  hotkeys: 'ctrl+enter:submit',
  markdown: true,
  required: true,
  extra_style: 'height: 500px',
  extra_textarea_class: 'auto-resize'
}) }}
```
- Used for discussion content and markdown editing.

## 🧠 Code Review and Suggestions

- **Maintainability:** The macro is well-structured and composable. Consider stricter type checking for `args` and textarea-specific options in future refactors.
- **Extensibility:** Supports most common use cases. For code editors or JSON/YAML, use `extra_attr` for custom data attributes.
- **Accessibility:** Uses proper label structure, but ensure `id`/`for` attributes are set for screen readers if custom labels are used.
- **i18n:** All user-facing text should be wrapped in `_()` for translation.
- **UX:** The macro supports help text, markdown, and spellcheck, but does not natively support input length limits or validation hints—consider adding if needed.
- **Consistency:** Always use `form_textarea` for multi-line fields in forms to ensure consistent layout and behavior.

## 📝 File Structure

- `packages/ui-default/templates/components/form.html`: Macro definition (`form_textarea`, `textarea`, etc.)
- `packages/ui-default/templates/partials/`, `problem_material_text_edit.html`, etc.: Macro usage
- Typical import:
  ```jinja2
  {% import 'components/form.html' as form with context %}
  ```

## 📌 Notes / Observations

- **Design Choice:** The macro is designed for maximum composability and grid alignment with other form fields.
- **Multi-Tenancy:** Used in both global and per-space settings forms.
- **Custom Styling:** Supports `extra_class`, `extra_attr`, and `extra_style` for custom CSS and attributes.
- **Help Text:** `help_text` is rendered below the field for user guidance.
- **Integration:** Works seamlessly with other form macros (text, select, checkbox, etc.) for unified UI.
- **Testing:** Macro is widely used and stable, but always test in context for new layouts or accessibility requirements.

---

For further details, see the macro definition in `components/form.html` and usage in templates throughout the UI system.
