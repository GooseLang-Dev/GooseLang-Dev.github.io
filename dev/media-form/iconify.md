---
title: Iconify
sidebar_position: 1
id: iconify
---

# Iconify Component & Macro

## 📘 Overview

The `iconify` macro is a reusable UI component in GooseLang's default UI system for rendering SVG icons using the Iconify icon library. It supports both static and animated icons, hover states, and flexible sizing and styling. The macro is used throughout the platform for navigation, buttons, menus, and any scenario requiring consistent, scalable iconography.

## 🔗 Dependencies

- **Jinja2 Macros**: Defined in `components/media.html`, typically imported as `media`.
- **Iconify**: For icon rendering and animation (via `<iconify-icon>` elements).
- **CSS Classes**: Uses `icon-default` and `icon-hover` for state management.
- **Context**: Expects arguments (macro parameters) for icon selection and styling.

## 📐 Data Structures

### Macro Signature

```jinja2
{% macro iconify(default, hover, width=20, height=20, style='', extra='') %}
  <iconify-icon ... icon="{{ default }}" ...></iconify-icon>
  {% if hover %}
    <iconify-icon ... icon="{{ hover }}" ...></iconify-icon>
  {% endif %}
{% endmacro %}
```

- **`iconify(default, hover, width, height, style, extra)`**: Renders one or two `<iconify-icon>` elements for default and hover states.

### Arguments

| Argument   | Type   | Default | Description |
|------------|--------|---------|-------------|
| `default`  | string | required| Default icon name (e.g., 'mdi:trash-can-outline') |
| `hover`    | string | none    | Hover icon name (e.g., 'line-md:trash') |
| `width`    | number | 20      | Icon width in pixels |
| `height`   | number | 20      | Icon height in pixels |
| `style`    | string | ''      | Additional CSS styles |
| `extra`    | string | ''      | Additional HTML attributes |

#### Value Handling
- The `default` icon is always rendered.
- If `hover` is provided, a second icon is rendered with `icon-hover` class for hover state.
- `width`, `height`, and `style` are applied to both icons.
- `extra` is injected as raw HTML attributes for advanced use cases.

#### Rendering Structure
- Primary `<iconify-icon>` with `icon-default` class (if hover is set)
- Optional `<iconify-icon>` with `icon-hover` class (if hover is set)
- Both icons are styled for vertical alignment and margin

## ⚙️ Core Methods & Logic

### Macro Internals
- **iconify(default, hover, width, height, style, extra)**: Renders one or two `<iconify-icon>` elements with appropriate classes and attributes.
- **Hover State**: When `hover` is provided, both icons are rendered and CSS is used to toggle visibility on hover.
- **Styling**: Inline styles and classes ensure icons align with text and UI elements.

#### Example Macro Expansion
```jinja2
{{ media.iconify('mdi:trash-can-outline', 'line-md:trash', 24, 24, 'color: red;') }}
```
Renders as:
```html
<iconify-icon class="icon-default" icon="mdi:trash-can-outline" height="24" width="24" style="vertical-align: middle; margin:0 5px; color: red;"></iconify-icon>
<iconify-icon class="icon-hover" icon="line-md:trash" height="24" width="24" style="vertical-align: middle; margin:0 5px; color: red;"></iconify-icon>
```

## 🧪 Usage Patterns

### Navigation and Menus
```jinja2
{{ media.iconify('ic:twotone-translate') }}
{{ media.iconify('flag:us-4x3') }}
{{ media.iconify('line-md:light-dark-loop') }}
```
- Used for language, theme, and user menu icons.

### Buttons and Actions
```jinja2
{{ media.iconify('mdi:trash-can-outline', 'line-md:trash') }}
{{ media.iconify('line-md:upload', 'line-md:upload-loop') }}
{{ media.iconify('line-md:download', 'line-md:download-loop') }}
```
- Used for upload, download, delete, and other action buttons.

### Option/Selection Icons
```jinja2
{{ media.iconify('mdi:circle-outline', 'mdi:circle-slice-8', 35, 35) }}
```
- Used for selection states in multiple choice and match questions.

## 🧠 Code Review and Suggestions

- **Maintainability:** The macro is simple and composable. For more advanced icon state management, consider using a wrapper component or utility class.
- **Extensibility:** Supports most use cases. For animated or interactive icons, ensure Iconify library is up to date.
- **Accessibility:** `<iconify-icon>` elements should include `aria-label` or `title` attributes for screen readers if used as standalone buttons.
- **i18n:** Icon names are not localized, but ensure any adjacent text is wrapped in `_()` for translation.
- **UX:** The macro supports hover and sizing, but does not natively support focus or active states—consider extending if needed.
- **Consistency:** Always use `iconify` for icons to ensure consistent appearance and behavior across the UI.

## 📝 File Structure

- `packages/ui-default/templates/components/media.html`: Macro definition (`iconify`, etc.)
- `packages/ui-default/templates/partials/`, `nav.html`, `footer.html`, etc.: Macro usage
- Typical import:
  ```jinja2
  {% import 'components/media.html' as media with context %}
  ```

## 📌 Notes / Observations

- **Design Choice:** The macro is designed for maximum composability and consistent icon usage.
- **Multi-Tenancy:** Used in both global and per-space navigation and UI.
- **Custom Styling:** Supports `style` and `extra` for advanced customization.
- **Integration:** Works seamlessly with other macros and UI components.
- **Testing:** Macro is widely used and stable, but always test in context for new layouts or accessibility requirements.

---

For further details, see the macro definition in `components/media.html` and usage in templates throughout the UI system.