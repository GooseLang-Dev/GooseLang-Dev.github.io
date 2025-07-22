---
title: Select
sidebar_position: 1
id: select
---

# Form Select Component & Macro

## 📘 Overview

The `form_select` macro is a reusable UI component in GooseLang's default UI system for rendering dropdown (select) fields within forms. It provides a consistent, accessible, and stylable way to capture single-choice user input from a list of options. The macro is used throughout the platform for settings, problem authoring, user management, and any scenario requiring a dropdown selection.

## 🔗 Dependencies

- **Jinja2 Macros**: Defined in `components/form.html`, typically imported as `form`.
- **form_begin / form_end**: Used to wrap form fields for layout, labels, and help text.
- **Translation/i18n**: Uses the `_()` function for label and option translation.
- **CSS Classes**: Relies on `select-container`, `select`, and grid classes for styling.
- **Context**: Expects arguments (args) dict, often passed from higher-level form logic.

## 📐 Data Structures

### Macro Signature

```jinja2
{% macro form_select(args) %}
  {{ form_begin({columns:5}|assign(args)) }}
  {{ select(args) }}
  {{ form_end(args) }}
{% endmacro %}
```

- **`form_select(args)`**: Renders a labeled, grid-aligned select field.
- **`select(args)`**: Renders the raw select input and options (used internally).

### Arguments (`args`)

| Argument      | Type     | Default   | Description |
|--------------|----------|-----------|-------------|
| `name`       | string   | required  | Name attribute for the select element |
| `options`    | array/dict| required | Array or dict of key-value pairs for select options |
| `value`      | string   | none      | Currently selected value |
| `columns`    | number   | 5         | Grid columns to span |
| `label`      | string   | none      | Field label (shown above/left of select) |
| `required`   | bool     | false     | Whether the field is required |
| `disabled`   | bool     | false     | Whether the field is disabled |
| `extra_class`| string   | none      | Additional CSS classes |
| `extra_attr` | string   | none      | Additional HTML attributes |
| `help_text`  | string   | none      | Help text below the field |
| ...          | ...      | ...       | Any other attributes passed to the input |

#### Value Handling
- The `<option>` is **selected** if its value matches the `value` argument.
- If no value is provided, the first option is selected by default (HTML standard).

#### Rendering Structure
- Outer `.row` and `.columns` for grid layout (if `row` is true)
- `.form__item` for form styling
- `.select-container` for the group
- `<select ...>` with all relevant attributes
- `<option ...>` for each option, with translation
- Optional help text below

## ⚙️ Core Methods & Logic

### Macro Internals
- **form_select(args)**: Combines `form_begin`, `select`, and `form_end` for a complete, labeled field.
- **select(args)**: Renders the select input and its options. Handles selected state and passes through all relevant attributes.
- **form_begin/form_end**: Provide grid, label, and help text structure.
- **form_attr**: Macro for passing attributes (disabled, required, autofocus, etc.) to the input.
- **container_attr**: Macro for container div attributes.

#### Example Macro Expansion
```jinja2
{{ form.form_select({
  name: 'lang',
  label: 'Code language',
  options: langRange,
  value: handler.user.codeLang
}) }}
```
Renders as:
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

## 🧪 Usage Patterns

### Settings Panel
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
- Used for single-choice settings in organization/user settings forms.

### Problem Authoring
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
- Used for selecting question types, option types, etc.

### Contest Editing
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
- Used for contest rule selection.

### Space/User Management
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
- Used for assigning roles to users.

## 🧠 Code Review and Suggestions

- **Maintainability:** The macro is well-structured and composable. Consider stricter type checking for `args` and `options` in future refactors.
- **Extensibility:** Supports most common use cases. For grouped options or option descriptions, further extension may be needed.
- **Accessibility:** Uses proper label structure, but ensure `id`/`for` attributes are set for screen readers if custom labels are used.
- **i18n:** All user-facing text should be wrapped in `_()` for translation.
- **UX:** The macro supports help text and disabled state, but does not natively support grouped options or option descriptions—consider adding if needed.
- **Consistency:** Always use `form_select` for dropdown fields in forms to ensure consistent layout and behavior.

## 📝 File Structure

- `packages/ui-default/templates/components/form.html`: Macro definition (`form_select`, `select`, etc.)
- `packages/ui-default/templates/partials/`, `setting.html`, etc.: Macro usage
- Typical import:
  ```jinja2
  {% import 'components/form.html' as form with context %}
  ```

## 📌 Notes / Observations

- **Design Choice:** The macro is designed for maximum composability and grid alignment with other form fields.
- **Multi-Tenancy:** Used in both global and per-space settings forms.
- **Custom Styling:** Supports `extra_class` for custom CSS.
- **Help Text:** `help_text` is rendered below the field for user guidance.
- **Integration:** Works seamlessly with other form macros (text, radio, checkbox, etc.) for unified UI.
- **Testing:** Macro is widely used and stable, but always test in context for new layouts or accessibility requirements.

---

For further details, see the macro definition in `components/form.html` and usage in templates throughout the UI system.
