---
title: Image
sidebar_position: 2
id: image
---

# Image Media Component & Macro

## 📘 Overview

The `media` and `form_media` macros provide a reusable, consistent UI component for handling image uploads and previews in GooseLang's default UI system. These macros enable accessible, stylable image input and preview fields across forms, supporting both direct URL input and file uploads. They are used throughout the platform for settings, problem authoring, and question options where image input or display is required.

## 🔗 Dependencies

- **Jinja2 Macros**: Defined in `components/media.html`, typically imported as `media`.
- **form_begin / form_end**: Used to wrap form fields for layout, labels, and help text.
- **Iconify**: For delete/close icons and button icons.
- **JavaScript**: For file upload, preview, and error handling.
- **CSS Classes**: Uses `media-container`, `richmedia`, and grid classes for styling.
- **Context**: Expects an `args` dict, often passed from higher-level form logic or templates.

## 📐 Data Structures

### Macro Signatures

```jinja2
{% macro media(args) %}
  ...
{% endmacro %}

{% macro form_media(args) %}
  {{ form_begin(...) }}
  {{ media(args) }}
  {{ form_end(...) }}
{% endmacro %}
```

- **`media(args)`**: Renders the core image upload/preview component.
- **`form_media(args)`**: Wraps `media` in a labeled form field with grid alignment.

### Arguments (`args`)

| Argument      | Type     | Default   | Description |
|--------------|----------|-----------|-------------|
| `media_type` | string   | required  | Must be `'image'` for image fields |
| `extra_type` | string   | required  | Extra type identifier for CSS classes and JS logic |
| `file_type`  | string   | none      | File type for upload validation |
| `docType`    | string   | none      | Document type for upload endpoint |
| `docId`      | string   | none      | Document ID for upload endpoint |
| `name`       | string   | required  | Input name for the image field |
| `value`      | string   | none      | Current image URL or base64 data |
| `input_name` | string   | none      | Custom input name override |
| `hide_delete`| boolean  | false     | Hide delete/close button |
| ...          | ...      | ...       | Any other attributes passed to the macro |

#### Value Handling
- For images: `value` is the image URL or base64 data; preview is rendered as an image with markdown.
- If `hide_delete` is false, a delete/close button is rendered.
- Hidden input fields are used to store the image value for form submission.

#### Rendering Structure
- Outer `.media-container` with data attributes for JS integration
- Image preview with markdown, hidden input, and delete button
- Upload form with file input and/or URL input
- Error message area for upload/validation feedback

## ⚙️ Core Methods & Logic

### Macro Internals
- **media(args)**: Renders the upload form, preview, and controls for image media.
- **form_media(args)**: Wraps `media` in a labeled form field with grid alignment.
- **File Upload**: Integrates with a global `uploadFiles` JS function for file uploads.
- **Preview Generation**: Dynamically replaces upload form with preview on successful upload or valid URL input.
- **Delete/Close**: Removes preview and restores upload form.
- **JS Integration**: Includes comprehensive JS for file handling, preview, error display, and dynamic form state.

#### Example Macro Expansion
```jinja2
{{ media.form_media({
  name: 'option',
  media_type: 'image',
  extra_type: 'multi',
  value: option.raw|default(''),
  file_type: 'QuestionFile'
}) }}
```
Renders as:
```html
<div class="media-container" data-media-type="image" ...>
  <div class="richmedia typo multi-img-preview">
    <div class="section">
      <img src="..." width="150" height="150" ...>
      <input type="hidden" ...>
      <button ...> ... </button>
    </div>
  </div>
</div>
```

## 🧪 Usage Patterns

### Settings Panel
```jinja2
{{ media.form_media({
  help_text: setting.desc,
  name: setting.key,
  input_name: setting.key,
  label: setting.name,
  value: current[setting.key] or setting.value,
  media_type: 'image',
  extra_type: 'spaceMedia',
  file_type: 'SpaceFile'
}) }}
```
- Used for uploading and previewing images in organization/user settings.

### Question Options (Multiple Choice, Match)
```jinja2
{{ media.form_media({
  name: 'option',
  media_type: 'image',
  extra_type: 'multi',
  value: option.raw|default(''),
  file_type: 'QuestionFile'
}) }}
```
- Used for image options in multiple choice and match questions.

### Match Questions (Source/Target)
```jinja2
{{ media.form_media({
  name: 'source_option',
  media_type: 'image',
  extra_type: 'multi',
  value: source.raw|default(''),
  file_type: 'QuestionFile'
}) }}
```
- Used for image-based source/target options in match questions.

## 🧠 Code Review and Suggestions

- **Maintainability:** The macros are well-structured and composable. Consider stricter type checking for `args` and more robust error handling for uploads and image preview.
- **Extensibility:** Supports most common image use cases. For video or other media types, further extension may be needed.
- **Accessibility:** Uses proper label structure and button semantics, but ensure ARIA labels and keyboard accessibility are maintained for image controls.
- **i18n:** All user-facing text and captions should be wrapped in `_()` for translation.
- **UX:** The macros support error feedback, preview, and deletion, but do not natively support drag-and-drop or progress bars—consider adding if needed.
- **Consistency:** Always use `form_media` for image fields in forms to ensure consistent layout and behavior.

## 📝 File Structure

- `packages/ui-default/templates/components/media.html`: Macro definitions (`media`, `form_media`, etc.)
- `packages/ui-default/templates/partials/`, `question_edit_multi.html`, `question_edit_match.html`, etc.: Macro usage
- Typical import:
  ```jinja2
  {% import 'components/media.html' as media with context %}
  ```

## 📌 Notes / Observations

- **Design Choice:** The macros are designed for maximum composability and grid alignment with other form fields.
- **Multi-Tenancy:** Used in both global and per-space settings and content.
- **Custom Styling:** Supports `extra_type` for context-specific CSS.
- **Help Text:** `help_text` is rendered below the field for user guidance.
- **Integration:** Works seamlessly with other form/media macros and JS utilities.
- **Testing:** Macros are widely used and stable, but always test in context for new layouts or accessibility requirements.

---

For further details, see the macro definitions in `components/media.html` and usage in templates throughout the UI system.
