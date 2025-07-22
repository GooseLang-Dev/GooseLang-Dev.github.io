---
title: Checkbox
sidebar_position: 5
id: form-checkbox
---

# Form Checkbox Component & Macro

## 📘 Overview

The `form_checkbox` macro is a reusable UI component in GooseLang's default UI system for rendering checkbox input fields within forms. It provides a consistent, accessible, and stylable way to capture boolean (on/off, true/false) user input, supporting both standalone and form-integrated usage. The macro is used throughout the platform for settings toggles, problem authoring, import options, and more.

## 🔗 Dependencies

- **Jinja2 Macros**: Defined in `components/form.html`, typically imported as `form`.
- **form_begin / form_end**: Used to wrap form fields for layout, labels, and help text.
- **Translation/i18n**: Uses the `_()` function for label and placeholder translation.
- **CSS Classes**: Relies on `checkbox-container`, `checkbox`, and form grid classes for styling.
- **Context**: Expects arguments (args) dict, often passed from higher-level form logic.

## 📐 Data Structures

### Macro Signature

```jinja2
{% macro form_checkbox(args) %}
  {{ form_begin({columns:5}|assign(args)) }}
  {{ checkbox(args) }}
  {{ form_end(args) }}
{% endmacro %}
```

- **`form_checkbox(args)`**: Renders a labeled, grid-aligned checkbox field.
- **`checkbox(args)`**: Renders the raw checkbox input and label (used internally).

### Arguments (`args`)

| Argument      | Type     | Default   | Description |
|--------------|----------|-----------|-------------|
| `name`       | string   | required  | Name attribute for the checkbox input |
| `value`      | mixed    | none      | Current value; checked if `true`, `'true'`, `1`, or `'1'` |
| `label`      | string   | none      | Field label (shown above/left of checkbox) |
| `placeholder`| string   | none      | Label text shown next to the checkbox input |
| `columns`    | number   | 5         | Grid columns to span |
| `row`        | bool     | true      | Whether to wrap in a `.row` div |
| `required`   | bool     | false     | Whether the field is required |
| `disabled`   | bool     | false     | Whether the field is disabled |
| `extra_class`| string   | none      | Additional CSS classes |
| `help_text`  | string   | none      | Help text below the field |
| `no_label`   | bool     | false     | Hide the outer label (for hidden/auxiliary checkboxes) |
| ...          | ...      | ...       | Any other attributes passed to the input |

#### Value Handling
- The checkbox is **checked** if `value` is any of: `true` (boolean), `'true'` (string), `1` (number), `'1'` (string).
- All other values are considered **unchecked**.

#### Rendering Structure
- Outer `.row` and `.columns` for grid layout (if `row` is true)
- `.form__item` for form styling
- `<label class="checkbox">` for the checkbox and its label
- `<input type="checkbox" ...>` with all relevant attributes
- Optional help text below

## ⚙️ Core Methods & Logic

### Macro Internals
- **form_checkbox(args)**: Combines `form_begin`, `checkbox`, and `form_end` for a complete, labeled field.
- **checkbox(args)**: Renders the checkbox input and its label. Handles checked state and passes through all relevant attributes.
- **form_begin/form_end**: Provide grid, label, and help text structure.
- **form_attr**: Macro for passing attributes (disabled, required, autofocus, etc.) to the input.
- **container_attr**: Macro for container div attributes.

#### Example Macro Expansion
```jinja2
{{ form.form_checkbox({
  name: 'keepUser',
  label: 'Keep original user',
  placeholder: _('Keep original problem owner.'),
  columns: 6,
  row: false
}) }}
```
Renders as:
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

## 🧪 Usage Patterns

### Settings Panel
```jinja2
{{ form.form_checkbox({
  label:setting.name,
  placeholder:setting.desc,
  name:setting.key,
  value:setting.value if (_val === undefined or _val === null) else _val,
  disabled:setting.flag|bitand(2)
}) }}
```
- Used for boolean settings in organization/user settings forms.

### Problem Authoring
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
- Used for toggling rich text, manual grading, absolute answer, etc.

### Import Forms
```jinja2
{{ form.form_checkbox ({
  label:'Keep original user',
  columns:6,
  name:'keepUser',
  placeholder:_('Keep original problem owner.'),
  row:false
}) }}
```
- Used for import options (e.g., keep user on problem import).

### Question Type Editors
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
- Used for toggling question options in problem editing.

### Hidden/Meta Checkboxes
```jinja2
{{ form.form_checkbox({
  label:setting.name,
  name:'booleanKeys.' + setting.key,
  value:true,
  extra_class:'display-hidden',
  no_label:true
}) }}
```
- Used for hidden state or auxiliary boolean fields.

## 🧠 Code Review and Suggestions

- **Maintainability:** The macro is well-structured and composable. Consider stricter type checking for `args` in future refactors.
- **Extensibility:** Supports most common use cases. For tri-state or indeterminate checkboxes, further extension may be needed.
- **Accessibility:** Uses proper label structure, but ensure `id`/`for` attributes are set for screen readers if custom labels are used.
- **i18n:** All user-facing text should be wrapped in `_()` for translation.
- **UX:** The macro supports help text and disabled state, but does not natively support tooltips or info icons—consider adding if needed.
- **Consistency:** Always use `form_checkbox` for boolean fields in forms to ensure consistent layout and behavior.

## 📝 File Structure

- `packages/ui-default/templates/components/form.html`: Macro definition (`form_checkbox`, `checkbox`, etc.)
- `packages/ui-default/templates/partials/`, `problem_question.html`, etc.: Macro usage
- Typical import:
  ```jinja2
  {% import 'components/form.html' as form with context %}
  ```

## 📌 Notes / Observations

- **Design Choice:** The macro is designed for maximum composability and grid alignment with other form fields.
- **Multi-Tenancy:** Used in both global and per-space settings forms.
- **Custom Styling:** Supports `extra_class` for custom CSS.
- **Hidden Fields:** `no_label` and `display-hidden` allow for invisible checkboxes when needed.
- **Help Text:** `help_text` is rendered below the field for user guidance.
- **Integration:** Works seamlessly with other form macros (text, select, radio, etc.) for unified UI.
- **Testing:** Macro is widely used and stable, but always test in context for new layouts or accessibility requirements.

---

For further details, see the macro definition in `components/form.html` and usage in templates throughout the UI system.
