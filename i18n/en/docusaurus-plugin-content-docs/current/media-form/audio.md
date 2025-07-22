---
title: Audio
sidebar_position: 3
id: audio
---

# Audio Media Component & Macro

## 📘 Overview

The `media` and `form_media` macros provide a robust, reusable UI component for handling audio uploads, previews, and metadata (such as captions) in GooseLang's default UI system. These macros enable consistent, accessible, and stylable audio input and playback fields across forms, supporting both direct URL input and file uploads, as well as optional captioning and audio generation workflows. They are used throughout the platform for problem authoring, question options, material editing, and settings where audio input or playback is required.

## 🔗 Dependencies

- **Jinja2 Macros**: Defined in `components/media.html`, typically imported as `media`.
- **form_begin / form_end**: Used to wrap form fields for layout, labels, and help text.
- **Iconify**: For delete/close icons and button icons.
- **JavaScript**: For file upload, preview, error handling, and dynamic audio field logic.
- **CSS Classes**: Uses `media-container`, `audio-tag`, `richmedia`, and grid classes for styling.
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

- **`media(args)`**: Renders the core audio upload/preview component.
- **`form_media(args)`**: Wraps `media` in a labeled form field with grid alignment.

### Arguments (`args`)

| Argument         | Type     | Default   | Description |
|------------------|----------|-----------|-------------|
| `media_type`     | string   | required  | Must be `'audio'` for audio fields |
| `extra_type`     | string   | required  | Extra type identifier for CSS classes and JS logic |
| `file_type`      | string   | none      | File type for upload validation |
| `docType`        | string   | none      | Document type for upload endpoint |
| `docId`          | string   | none      | Document ID for upload endpoint |
| `name`           | string   | required  | Input name for the audio field |
| `value`          | string   | none      | Current audio URL or base64 data |
| `input_name`     | string   | none      | Custom input name override |
| `show_caption`   | boolean  | false     | Show caption field (audio only) |
| `caption`        | string   | none      | Caption text (audio only) |
| `generate_audio` | boolean  | false     | Show generate button (audio only) |
| `hide_delete`    | boolean  | false     | Hide delete/close button |
| ...              | ...      | ...       | Any other attributes passed to the macro |

#### Value Handling
- For audio: `value` is the audio URL or base64 data; preview is rendered with an audio player.
- If `show_caption` is true, a caption input is shown above the audio field.
- If `generate_audio` is true, a generate button is shown (for TTS or similar workflows).
- If `hide_delete` is false, a delete/close button is rendered.
- Hidden input fields are used to store the audio value for form submission.

#### Rendering Structure
- Outer `.media-container` with data attributes for JS integration
- Audio preview with player, hidden input, caption input (if enabled), generate button (if enabled), and delete button
- Upload form with file input and/or URL input
- Error message area for upload/validation feedback

## ⚙️ Core Methods & Logic

### Macro Internals
- **media(args)**: Renders the upload form, preview, and controls for audio media.
- **form_media(args)**: Wraps `media` in a labeled form field with grid alignment.
- **File Upload**: Integrates with a global `uploadFiles` JS function for file uploads.
- **Preview Generation**: Dynamically replaces upload form with preview on successful upload or valid URL input.
- **Delete/Close**: Removes preview and restores upload form.
- **Audio Caption/Generate**: Handles caption input and (optionally) audio generation.
- **JS Integration**: Includes comprehensive JS for file handling, preview, error display, and dynamic form state.

#### Example Macro Expansion
```jinja2
{{ media.form_media({
  name: 'option',
  media_type: 'audio',
  extra_type: 'multi',
  show_caption: true,
  caption: option.caption|default(''),
  value: option.raw|default(''),
  file_type: 'QuestionFile'
}) }}
```
Renders as:
```html
<div class="media-container" data-media-type="audio" ...>
  <div class="audio-tag">
    <audio controls ...>
      <source src="..." type="audio/wav">
    </audio>
    <input type="hidden" ...>
    <button ...> ... </button>
  </div>
</div>
```

## 🧪 Usage Patterns

### Problem Material Audio Editing
```jinja2
{{ media.form_media({
  name: 'wav_url',
  media_type: 'audio',
  extra_type: 'material',
  show_caption: true,
  caption: audio.caption,
  generate_audio: false,
  value: audio.wav_url|default(''),
  file_type: 'MaterialFile'
}) }}
```
- Used for uploading and previewing audio files in problem material editing.

### Question Options (Multiple Choice, Match)
```jinja2
{{ media.form_media({
  name: 'option',
  media_type: 'audio',
  extra_type: 'multi',
  show_caption: true,
  caption: option.caption|default(''),
  value: option.raw|default(''),
  file_type: 'QuestionFile'
}) }}
```
- Used for audio options in multiple choice and match questions.

### Settings Panel
```jinja2
{{ media.form_media({
  help_text: setting.desc,
  name: setting.key,
  input_name: setting.key,
  label: setting.name,
  value: current[setting.key] or setting.value,
  media_type: 'audio',
  extra_type: 'spaceMedia',
  file_type: 'SpaceFile'
}) }}
```
- Used for uploading and previewing audio in organization/user settings.

### Audio Button (Playback Only)
```jinja2
{{ media.audio_button({
  value: audio.wav_url or audio.wav_buffer,
  extra_type: 'material',
  docId: pdoc.docId,
  show_caption: true,
  caption: audio.caption,
  index: loop.index
}) }}
```
- Used for audio playback in question submission and material review.

## 🧠 Code Review and Suggestions

- **Maintainability:** The macros are well-structured and composable. Consider stricter type checking for `args` and more robust error handling for uploads and audio playback.
- **Extensibility:** Supports most common audio use cases. For video or other media types, further extension may be needed.
- **Accessibility:** Uses proper label structure and button semantics, but ensure ARIA labels and keyboard accessibility are maintained for audio controls and captions.
- **i18n:** All user-facing text and captions should be wrapped in `_()` for translation.
- **UX:** The macros support error feedback, preview, and deletion, but do not natively support drag-and-drop or progress bars—consider adding if needed. Audio generation is simulated; real integration may require backend support.
- **Consistency:** Always use `form_media` for audio fields in forms to ensure consistent layout and behavior.

## 📝 File Structure

- `packages/ui-default/templates/components/media.html`: Macro definitions (`media`, `form_media`, `audio_button`, etc.)
- `packages/ui-default/templates/partials/`, `question_edit_multi.html`, `problem_material_audio_edit.html`, etc.: Macro usage
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
- **Audio Generation:** The `generate_audio` button is present for future TTS or AI audio generation workflows, but may require backend integration.

---

For further details, see the macro definitions in `components/media.html` and usage in templates throughout the UI system.
