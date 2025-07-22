---
title: Audio Button
sidebar_position: 4
id: audio-button
---

# Audio Button Component & Macro

## 📘 Overview

The `audio_button` macro is a reusable UI component in GooseLang's default UI system for rendering custom audio player controls with play/pause functionality and optional captions. It provides a modern, accessible, and stylable way to play audio files, supporting both standard and captioned modes. The macro is used throughout the platform for problem materials, question options, and any scenario requiring inline audio playback.

## 🔗 Dependencies

- **Jinja2 Macros**: Defined in `components/media.html`, typically imported as `media`.
- **Iconify**: For animated play/pause icons.
- **UserContext**: For theme-aware icon coloring.
- **JavaScript**: For per-instance audio control, mutual exclusion, and error handling.
- **CSS Classes**: Relies on `audio-tag`, `play-btn`, and layout classes for styling.
- **Context**: Expects arguments (args) dict, often passed from higher-level form or media logic.

## 📐 Data Structures

### Macro Signature

```jinja2
{% macro audio_button(args) %}
  <div id="audio-macro-{{ args.index }}" ...>
    ...
  </div>
  <script> ... </script>
{% endmacro %}
```

- **`audio_button(args)`**: Renders a custom audio player with play/pause button, caption, and audio element.

### Arguments (`args`)

| Argument      | Type     | Default   | Description |
|--------------|----------|-----------|-------------|
| `index`      | string/number | required | Unique identifier for the audio instance (used for DOM IDs) |
| `value`      | string   | required  | Audio file URL, path, or data URI |
| `caption`    | string   | none      | Caption text to display (if `show_caption` is true) |
| `show_caption`| boolean | false     | Whether to show caption and custom controls |
| `docId`      | string   | none      | Document ID for file path resolution |
| `extra_type` | string   | none      | Used for context-specific styling |

#### Value Handling
- If `value` starts with `file://` and `docId` is provided, it is converted to `./[docId]/file/`.
- If `value` starts with `file://` and no `docId`, it is converted to `./file/`.
- Otherwise, `value` is used as-is.
- If `show_caption` is true, custom controls and caption are rendered; otherwise, markdown audio syntax is used.

#### Rendering Structure
- Outer `<div id="audio-macro-{{ args.index }}">` for unique instance
- If `show_caption` is true:
  - `<button class="play-btn">` for play/pause
  - `<span>` for caption text
  - `<audio>` element with resolved source
- If `show_caption` is false:
  - Markdown audio syntax: `@[audio](...)`
- Per-instance `<script>` for JS logic

## ⚙️ Core Methods & Logic

### Macro Internals
- **audio_button(args)**: Renders the audio player, play/pause button, caption, and JS logic for a single instance.
- **File Path Handling**: Resolves `file://` URLs to relative paths using `docId` if provided.
- **Iconify Integration**: Uses animated icons for play/pause state, theme-aware coloring.
- **JavaScript Logic**:
  - Initializes per-instance event handlers for play/pause, error, and mutual exclusion (only one audio plays at a time).
  - Handles canplaythrough/error events for availability and error feedback (❌ icon).
  - Updates button icon based on play state.

#### Example Macro Expansion
```jinja2
{{ media.audio_button({
  value: option.raw,
  docId: pdoc.docId,
  show_caption: qdoc.show_caption|default(false),
  caption: option.caption,
  index: loop.index
}) }}
```
Renders as:
```html
<div id="audio-macro-1" style="display: flex; align-items: center; ...">
  <button class="play-btn" ...>
    <iconify-icon ...></iconify-icon>
  </button>
  <span>Audio caption here</span>
  <audio id="audio-1">
    <source src="./123/file/audio.mp3" type="audio/wav" ...>
  </audio>
</div>
<script> ... </script>
```

## 🧪 Usage Patterns

### Problem Material Audio
```jinja2
{{ media.audio_button({
  value: audio.wav_url or audio.wav_buffer,
  extra_type: 'material',
  docId: pdoc.docId
}) }}
```
- Used for playing audio files in problem material sections.

### Question Option Audio
```jinja2
{{ media.audio_button({
  value: option.raw,
  docId: pdoc.docId,
  show_caption: qdoc.show_caption|default(false),
  caption: option.caption,
  index: loop.index
}) }}
```
- Used for audio options in multiple choice or match questions.

### Target Option Audio (Match Questions)
```jinja2
{{ media.audio_button({
  value: targetOption.raw,
  docId: pdoc.docId,
  show_caption: qdoc.show_caption|default(false),
  caption: targetOption.caption,
  index: loop.index
}) }}
```
- Used for target audio options in match questions.

## 🧠 Code Review and Suggestions

- **Maintainability:** The macro is well-structured and composable. Consider stricter type checking for `args` and more robust error handling for missing/invalid audio sources.
- **Extensibility:** Supports most common use cases. For playlists or advanced controls, further extension may be needed.
- **Accessibility:** Uses proper button and audio semantics, but ensure ARIA labels and keyboard accessibility are maintained.
- **i18n:** All user-facing text and captions should be wrapped in `_()` for translation.
- **UX:** The macro supports error feedback and mutual exclusion, but does not natively support seeking or playback rate controls—consider adding if needed.
- **Consistency:** Always use `audio_button` for inline audio playback to ensure consistent UI and behavior.

## 📝 File Structure

- `packages/ui-default/templates/components/media.html`: Macro definition (`audio_button`, etc.)
- `packages/ui-default/templates/partials/`, `problem_submit_material.html`, etc.: Macro usage
- Typical import:
  ```jinja2
  {% import 'components/media.html' as media with context %}
  ```

## 📌 Notes / Observations

- **Design Choice:** The macro is designed for maximum composability and grid alignment with other form/media fields.
- **Multi-Tenancy:** Used in both global and per-space content.
- **Custom Styling:** Supports `extra_type` for context-specific CSS.
- **Help Text:** Caption is rendered for user guidance if provided.
- **Integration:** Works seamlessly with other media macros and markdown audio syntax.
- **Testing:** Macro is widely used and stable, but always test in context for new layouts or accessibility requirements.

---

For further details, see the macro definition in `components/media.html` and usage in templates throughout the UI system.
