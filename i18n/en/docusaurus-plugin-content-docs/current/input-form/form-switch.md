---
title: Form Switch Component
sidebar_position: 6
id: form-switch
---

# Form Switch Component

The `form_switch` macro creates toggle switch components for boolean settings.

## Usage

### Basic Switch
```html
{{ switch(args) }}
```

### Complete Form Switch
```html
{{ form_switch(args) }}
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | string | required | The name attribute for the switch |
| `value` | boolean | false | Current switch state |
| `placeholder` | string | none | Label text for the switch |
| `columns` | number | 5 | Number of grid columns to span |
| `label` | string | none | Form field label |
| `required` | boolean | false | Whether the field is required |
| `disabled` | boolean | false | Whether the field is disabled |
| `extra_class` | string | none | Additional CSS classes |

## Structure

The switch component includes:
- Container div with `switch-container` class
- Label element with `switch` class
- Hidden checkbox input for state management
- Slider span with `switch__slider` class for visual styling
- Text label positioned next to the switch

## Styling

The switch uses CSS classes:
- `.switch` - Main container styling
- `.switch__slider` - Visual slider element
- Requires CSS implementation for toggle animation and appearance