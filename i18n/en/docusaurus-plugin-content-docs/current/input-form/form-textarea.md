---
title: Form Textarea Component
sidebar_position: 4
id: form-textarea
---

# Form Textarea Component

The `form_textarea` macro creates multi-line text input areas with optional markdown support.

## Usage

### Basic Textarea
```html
{{ textarea(args) }}
```

### Complete Form Textarea
```html
{{ form_textarea(args) }}
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | string | required | The name attribute for the textarea |
| `value` | string | none | Current textarea content |
| `placeholder` | string | none | Placeholder text |
| `columns` | number | 10 | Number of grid columns to span |
| `label` | string | none | Label text for the form field |
| `required` | boolean | false | Whether the field is required |
| `disabled` | boolean | false | Whether the field is disabled |
| `markdown` | boolean | false | Enable markdown editing features |
| `nospellcheck` | boolean | false | Disable spell checking |
| `extra_class` | string | none | Additional CSS classes |
| `extra_attr` | string | none | Additional HTML attributes |

## Features

### Markdown Support
- Set `markdown: true` to enable markdown editing
- Adds `data-markdown` attribute for JavaScript integration
- Useful for rich text content editing

### Spell Checking
- Browser spell checking enabled by default
- Set `nospellcheck: true` to disable
- Useful for code or technical content

### Grid Layout
- Spans 10 columns by default (wider than other inputs)
- Suitable for longer form content