---
title: Text
sidebar_position: 3
id: text
---

# Form Text Component & Macro

## 📘 Overview

The `form_text` macro is a reusable UI component in GooseLang's default UI system for rendering text input fields within forms. It supports a wide range of input types (text, number, email, password, date, time, etc.), validation, and advanced features like autofocus and autocomplete control. The macro is used throughout the platform for settings, problem authoring, user management, and any scenario requiring a single-line text or numeric input.

## 🔗 Dependencies

- **Jinja2 Macros**: Defined in `components/form.html`, typically imported as `form`.
- **form_begin / form_end**: Used to wrap form fields for layout, labels, and help text.
- **Translation/i18n**: Uses the `_()` function for label and placeholder translation.
- **CSS Classes**: Relies on `textbox-container`, `textbox`, and grid classes for styling.
- **Context**: Expects arguments (args) dict, often passed from higher-level form logic.

## 📐 Data Structures

### Macro Signature

```jinja2
{% macro form_text(args) %}
  {{ form_begin({columns:5}|assign(args)) }}
  {{ text(args) }}
  {{ form_end(args) }}
{% endmacro %}
```

- **`form_text(args)`**: Renders a labeled, grid-aligned text input field.
- **`text(args)`**: Renders the raw input element (used internally).

### Arguments (`args`)

| Argument      | Type     | Default   | Description |
|--------------|----------|-----------|-------------|
| `name`       | string   | required  | Name attribute for the input |
| `value`      | string   | none      | Current input value |
| `type`       | string   | 'text'    | Input type ('text', 'float', 'email', 'password', 'url', etc.) |
| `placeholder`| string   | none      | Placeholder text |
| `columns`    | number   | 5         | Grid columns to span |
| `label`      | string   | none      | Field label (shown above/left of input) |
| `required`   | bool     | false     | Whether the field is required |
| `disabled`   | bool     | false     | Whether the field is disabled |
| `autofocus`  | bool     | false     | Whether to autofocus this field |
| `noAutocomplete`| bool  | false     | Disable browser autocomplete |
| `date`       | bool     | false     | Enable date picker |
| `time`       | bool     | false     | Enable time picker |
| `datetime`   | bool     | false     | Enable datetime picker |
| `extra_class`| string   | none      | Additional CSS classes |
| `extra_style`| string   | none      | Additional inline styles |
| `help_text`  | string   | none      | Help text below the field |
| ...          | ...      | ...       | Any other attributes passed to the input |

#### Value Handling
- The input's `value` attribute is set to the provided value.
- For `type: float`, the input is rendered as `type="number"` with `step="any"` for decimal support.
- For `date`, `time`, or `datetime`, the appropriate picker is enabled via attributes.

#### Rendering Structure
- Outer `.row` and `.columns` for grid layout (if `row` is true)
- `.form__item` for form styling
- `.textbox-container` for the group
- `<input ...>` with all relevant attributes
- Optional help text below

## ⚙️ Core Methods & Logic

### Macro Internals
- **form_text(args)**: Combines `form_begin`, `text`, and `form_end` for a complete, labeled field.
- **text(args)**: Renders the input element. Handles type, value, and passes through all relevant attributes.
- **form_begin/form_end**: Provide grid, label, and help text structure.
- **form_attr**: Macro for passing attributes (disabled, required, autofocus, etc.) to the input.
- **container_attr**: Macro for container div attributes.

#### Example Macro Expansion
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
Renders as:
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

## 🧪 Usage Patterns

### Settings Panel
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
- Used for text, password, number, and float settings in organization/user settings forms.

### Problem Authoring
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
- Used for problem titles, option text, and more.

### Material and Media Forms
```jinja2
{{ form.form_text({
  name:args.name,
  value:''|default(''),
  placeholder:_( 'Place '+args.media_type+' file link here'),
  row:false,
  columns:12
}) }}
```
- Used for file links, captions, and other single-line inputs.

### Space Join Forms
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
- Used for invitation code entry and similar flows.

## 🧠 Code Review and Suggestions

- **Maintainability:** The macro is well-structured and composable. Consider stricter type checking for `args` and `type` in future refactors.
- **Extensibility:** Supports most common use cases. For multi-line input, use `form_textarea` instead.
- **Accessibility:** Uses proper label structure, but ensure `id`/`for` attributes are set for screen readers if custom labels are used.
- **i18n:** All user-facing text should be wrapped in `_()` for translation.
- **UX:** The macro supports help text, autofocus, and disabled state, but does not natively support input masks or validation hints—consider adding if needed.
- **Consistency:** Always use `form_text` for single-line fields in forms to ensure consistent layout and behavior.

## 📝 File Structure

- `packages/ui-default/templates/components/form.html`: Macro definition (`form_text`, `text`, etc.)
- `packages/ui-default/templates/partials/`, `problem_material.html`, etc.: Macro usage
- Typical import:
  ```jinja2
  {% import 'components/form.html' as form with context %}
  ```

## 📌 Notes / Observations

- **Design Choice:** The macro is designed for maximum composability and grid alignment with other form fields.
- **Multi-Tenancy:** Used in both global and per-space settings forms.
- **Custom Styling:** Supports `extra_class` and `extra_style` for custom CSS.
- **Help Text:** `help_text` is rendered below the field for user guidance.
- **Integration:** Works seamlessly with other form macros (select, radio, checkbox, etc.) for unified UI.
- **Testing:** Macro is widely used and stable, but always test in context for new layouts or accessibility requirements.

---

For further details, see the macro definition in `components/form.html` and usage in templates throughout the UI system.