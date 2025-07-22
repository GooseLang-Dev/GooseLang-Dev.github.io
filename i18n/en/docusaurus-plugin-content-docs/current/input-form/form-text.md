---
title: Form Text Component
sidebar_position: 3
id: form-text
---

# Form Text Component

The `form_text` macro creates text input fields with various input types and validation.

## Usage

### Basic Text Input
```html
{{ text(args) }}
```

### Complete Form Text
```html
{{ form_text(args) }}
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | string | required | The name attribute for the input |
| `value` | string | none | Current input value |
| `type` | string | 'text' | Input type ('text', 'float', 'email', etc.) |
| `placeholder` | string | none | Placeholder text |
| `columns` | number | 5 | Number of grid columns to span |
| `label` | string | none | Label text for the form field |
| `required` | boolean | false | Whether the field is required |
| `disabled` | boolean | false | Whether the field is disabled |
| `autofocus` | boolean | false | Whether to autofocus this field |
| `noAutocomplete` | boolean | false | Disable browser autocomplete |
| `date` | boolean | false | Enable date picker |
| `time` | boolean | false | Enable time picker |
| `datetime` | boolean | false | Enable datetime picker |
| `extra_class` | string | none | Additional CSS classes |
| `extra_style` | string | none | Additional inline styles |

## Input Types

### Text Types
- `text` - Standard text input
- `email` - Email validation
- `password` - Password input
- `url` - URL validation

### Numeric Types
- `float` - Number input with decimal support
- Automatically adds `step="any"` attribute

### Date/Time Types
- `date` - Date picker integration
- `time` - Time picker integration  
- `datetime` - Combined date/time picker