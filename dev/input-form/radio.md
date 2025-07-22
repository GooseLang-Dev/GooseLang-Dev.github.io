---
title: Radio
sidebar_position: 2
id: radio
---

# Form Radio & Image Radio Components

## 📘 Overview

The `form_radio` and `form_image_radio` macros are reusable UI components in GooseLang's default UI system for rendering radio button groups within forms. They provide a consistent, accessible, and stylable way to capture single-choice user input, supporting both text-based and image-based options. These macros are used throughout the platform for settings, problem authoring, and any scenario requiring exclusive selection from a set of options.

## 🔗 Dependencies

- **Jinja2 Macros**: Defined in `components/form.html`, typically imported as `form`.
- **form_begin / form_end**: Used to wrap form fields for layout, labels, and help text.
- **Translation/i18n**: Uses the `_()` function for label and option translation.
- **CSS Classes**: Relies on `radiobox-container`, `radiobox`, and grid classes for styling.
- **Context**: Expects arguments (args) dict, often passed from higher-level form logic.

## 📐 Data Structures

### Macro Signatures

```jinja2
{% macro form_radio(args) %}
  {{ form_begin({columns:5, label_wrap:false}|assign(args)) }}
  {{ radio(args) }}
  {{ form_end({label_warp:false}|assign(args)) }}
{% endmacro %}

{% macro form_image_radio(args) %}
  {{ form_begin({columns:8, label_warp:false}|assign(args)) }}
  {{ image_radio(args) }}
  {{ form_end({label_warp:false}|assign(args)) }}
{% endmacro %}
```

- **`form_radio(args)`**: Renders a labeled, grid-aligned radio group.
- **`form_image_radio(args)`**: Renders a labeled, grid-aligned image radio group.
- **`radio(args)`**: Renders the raw radio inputs and labels (used internally).
- **`image_radio(args)`**: Renders the raw image radio inputs and labels (used internally).

### Arguments (`args`)

| Argument      | Type     | Default   | Description |
|--------------|----------|-----------|-------------|
| `name`       | string   | required  | Name attribute for the radio inputs (all options share this) |
| `options`    | array    | required  | Array of key-value pairs for radio options (e.g., `[('a', 'Option A'), ('b', 'Option B')]`) |
| `value`      | string   | none      | Currently selected value |
| `columns`    | number   | 5/8       | Grid columns to span (5 for standard, 8 for image) |
| `label`      | string   | none      | Field label (shown above/left of group) |
| `required`   | bool     | false     | Whether the field is required |
| `disabled`   | bool     | false     | Whether the field is disabled |
| `image_class`| string   | none      | CSS class pattern for image radio buttons (image variant only) |
| `extra_class`| string   | none      | Additional CSS classes |
| `help_text`  | string   | none      | Help text below the field |
| ...          | ...      | ...       | Any other attributes passed to the input |

#### Value Handling
- The radio input is **checked** if its value matches the `value` argument.
- Only one radio input in a group can be checked at a time (HTML standard).

#### Rendering Structure
- Outer `.row` and `.columns` for grid layout (if `row` is true)
- `.form__item` for form styling
- `.radiobox-container` or `.radiobox-container with-image` for the group
- `<label class="radiobox">` for each option
- `<input type="radio" ...>` with all relevant attributes
- For image radio: image preview and tooltip per option
- Optional help text below

## ⚙️ Core Methods & Logic

### Macro Internals
- **form_radio(args)**: Combines `form_begin`, `radio`, and `form_end` for a complete, labeled field.
- **form_image_radio(args)**: Combines `form_begin`, `image_radio`, and `form_end` for image-based selection.
- **radio(args)**: Renders each radio input and its label. Handles checked state and passes through all relevant attributes.
- **image_radio(args)**: Renders each radio input with an image preview and tooltip.
- **form_begin/form_end**: Provide grid, label, and help text structure.
- **form_attr**: Macro for passing attributes (disabled, required, autofocus, etc.) to the input.
- **container_attr**: Macro for container div attributes.

#### Example Macro Expansion
```jinja2
{{ form.form_radio({
  name: 'difficulty',
  label: 'Difficulty',
  options: [('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard')],
  value: 'medium',
  columns: 5
}) }}
```
Renders as:
```html
<div class="columns form__item end">
  <label>
    Difficulty
    <div class="radiobox-container">
      <label class="radiobox">
        <input type="radio" name="difficulty" value="easy"> Easy
      </label>
      <label class="radiobox">
        <input type="radio" name="difficulty" value="medium" checked> Medium
      </label>
      <label class="radiobox">
        <input type="radio" name="difficulty" value="hard"> Hard
      </label>
    </div>
  </label>
</div>
```

## 🧪 Usage Patterns

### Settings Panel
```jinja2
{{ form.form_radio({
  options: setting.range,
  label: setting.name,
  help_text: setting.desc,
  name: setting.key,
  value: current[setting.key] or setting.value,
  disabled: setting.flag|bitand(2)
}) }}
```
- Used for single-choice settings in organization/user settings forms.

### Image Radio in Settings
```jinja2
{{ form.form_image_radio({
  options: setting.range,
  image_class: setting.image_class,
  label: setting.name,
  help_text: setting.desc,
  name: setting.key,
  value: current[setting.key] or setting.value,
  disabled: setting.flag|bitand(2)
}) }}
```
- Used for settings where options are best represented visually (e.g., theme, avatar, etc.).

## 🧠 Code Review and Suggestions

- **Maintainability:** The macros are well-structured and composable. Consider stricter type checking for `args` and `options` in future refactors.
- **Extensibility:** Supports most common use cases. For custom option rendering (e.g., icons, color swatches), further extension may be needed.
- **Accessibility:** Uses proper label structure, but ensure `id`/`for` attributes are set for screen readers if custom labels are used. Tooltips in image radio improve usability.
- **i18n:** All user-facing text should be wrapped in `_()` for translation.
- **UX:** The macros support help text and disabled state, but do not natively support option grouping or descriptions—consider adding if needed.
- **Consistency:** Always use `form_radio` or `form_image_radio` for single-choice fields in forms to ensure consistent layout and behavior.

## 📝 File Structure

- `packages/ui-default/templates/components/form.html`: Macro definitions (`form_radio`, `form_image_radio`, `radio`, `image_radio`, etc.)
- `packages/ui-default/templates/partials/`, `setting.html`, etc.: Macro usage
- Typical import:
  ```jinja2
  {% import 'components/form.html' as form with context %}
  ```

## 📌 Notes / Observations

- **Design Choice:** The macros are designed for maximum composability and grid alignment with other form fields.
- **Multi-Tenancy:** Used in both global and per-space settings forms.
- **Custom Styling:** Supports `extra_class` and `image_class` for custom CSS.
- **Help Text:** `help_text` is rendered below the field for user guidance.
- **Integration:** Works seamlessly with other form macros (text, select, checkbox, etc.) for unified UI.
- **Testing:** Macros are widely used and stable, but always test in context for new layouts or accessibility requirements.

---

For further details, see the macro definitions in `components/form.html` and usage in templates throughout the UI system.
