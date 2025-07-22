---
title: Form Select Component
sidebar_position: 1
id: form-select
---

# Form Select Component

The `form_select` macro creates a dropdown selection form field with proper labeling and structure.

## Usage

### Basic Select
```html
{{ select(args) }}
```

### Complete Form Select
```html
{{ form_select(args) }}
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | string | required | The name attribute for the select element |
| `options` | array | required | Array of key-value pairs for select options |
| `value` | string | none | Currently selected value |
| `columns` | number | 5 | Number of grid columns to span |
| `label` | string | none | Label text for the form field |
| `required` | boolean | false | Whether the field is required |
| `disabled` | boolean | false | Whether the field is disabled |
| `extra_class` | string | none | Additional CSS classes |
| `extra_attr` | string | none | Additional HTML attributes |

## Structure

The component generates:
- Container div with `select-container` class
- Select element with proper attributes
- Form wrapper with label and grid positioning
- Support for required field indicators