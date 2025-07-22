---
title: Switch
sidebar_position: 6
id: switch
---

# Form Switch Component & Macro

## 📘 Overview

The `form_switch` macro is a reusable UI component in GooseLang's default UI system for rendering toggle switch fields within forms. It provides a modern, accessible, and stylable way to capture boolean (on/off, true/false) user input, visually distinct from checkboxes. The macro is used throughout the platform for settings toggles, material options, and any scenario where a switch-style boolean input is preferred.

## 🔗 Dependencies

- **Jinja2 Macros**: Defined in `components/form.html`, typically imported as `form`.
- **form_begin / form_end**: Used to wrap form fields for layout, labels, and help text.
- **Translation/i18n**: Uses the `_()` function for label and placeholder translation.
- **CSS Classes**: Relies on `switch-container`, `switch`, `switch__slider`, and grid classes for styling.
- **Context**: Expects arguments (args) dict, often passed from higher-level form logic.

## 📐 Data Structures

### Macro Signature

```jinja2
{% macro form_switch(args) %}
  {{ form_begin({columns:5}|assign(args)) }}
  {{ switch(args) }}
  {{ form_end(args) }}
{% endmacro %}
```

- **`form_switch(args)`**: Renders a labeled, grid-aligned switch field.
- **`switch(args)`**: Renders the raw switch input and label (used internally).

### Arguments (`args`)

| Argument      | Type     | Default   | Description |
|--------------|----------|-----------|-------------|
| `name`       | string   | required  | Name attribute for the switch input |
| `value`      | boolean  | false     | Current switch state (checked if true) |
| `placeholder`| string   | none      | Label text shown next to the switch |
| `columns`    | number   | 5         | Grid columns to span |
| `label`      | string   | none      | Field label (shown above/left of switch) |
| `required`   | bool     | false     | Whether the field is required |
| `disabled`   | bool     | false     | Whether the field is disabled |
| `extra_class`| string   | none      | Additional CSS classes |
| `help_text`  | string   | none      | Help text below the field |
| ...          | ...      | ...       | Any other attributes passed to the input |

#### Value Handling
- The switch is **checked** if `value` is `true` (boolean) or a truthy value.
- All other values are considered **unchecked**.

#### Rendering Structure
- Outer `.row` and `.columns` for grid layout (if `row` is true)
- `.form__item` for form styling
- `.switch-container` for the group
- `<label class="switch">` for the switch and its slider
- `<input type="checkbox" ...>` for state management
- `<span class="switch__slider"></span>` for the visual slider
- Optional placeholder text next to the switch
- Optional help text below

## ⚙️ Core Methods & Logic

### Macro Internals
- **form_switch(args)**: Combines `form_begin`, `switch`, and `form_end` for a complete, labeled field.
- **switch(args)**: Renders the switch input and its label. Handles checked state and passes through all relevant attributes.
- **form_begin/form_end**: Provide grid, label, and help text structure.
- **form_attr**: Macro for passing attributes (disabled, required, autofocus, etc.) to the input.
- **container_attr**: Macro for container div attributes.

#### Example Macro Expansion
```jinja2
{{ form.form_switch({
  name: 'tokenizeMaterial',
  value: udoc.tokenizeMaterial|default(false),
  placeholder:_('Tokenize Content'),
  columns:6,
  row: false
}) }}
```
Renders as:
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

## 🧪 Usage Patterns

### Problem Material Options
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
- Used for toggling material options in problem material editing.

### Question Submission Options
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
- Used for toggling translation of questions in submission forms.

## 🧠 Code Review and Suggestions

- **Maintainability:** The macro is well-structured and composable. Consider stricter type checking for `args` in future refactors.
- **Extensibility:** Supports most common use cases. For tri-state or indeterminate switches, further extension may be needed.
- **Accessibility:** Uses proper label structure, but ensure `id`/`for` attributes are set for screen readers if custom labels are used. The slider span is for visual effect only.
- **i18n:** All user-facing text should be wrapped in `_()` for translation.
- **UX:** The macro supports help text and disabled state, but does not natively support tooltips or info icons—consider adding if needed.
- **Consistency:** Always use `form_switch` for toggle fields in forms to ensure consistent layout and behavior.

## 📝 File Structure

- `packages/ui-default/templates/components/form.html`: Macro definition (`form_switch`, `switch`, etc.)
- `packages/ui-default/templates/partials/`, `problem_submit_material.html`, etc.: Macro usage
- Typical import:
  ```jinja2
  {% import 'components/form.html' as form with context %}
  ```

## 📌 Notes / Observations

- **Design Choice:** The macro is designed for maximum composability and grid alignment with other form fields.
- **Multi-Tenancy:** Used in both global and per-space settings forms.
- **Custom Styling:** Supports `extra_class` for custom CSS.
- **Help Text:** `help_text` is rendered below the field for user guidance.
- **Integration:** Works seamlessly with other form macros (text, select, checkbox, etc.) for unified UI.
- **Testing:** Macro is widely used and stable, but always test in context for new layouts or accessibility requirements.

---

For further details, see the macro definition in `components/form.html` and usage in templates throughout the UI system.
