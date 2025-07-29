---
sidebar_position: 2
id: frontend
title: Frontend Summary
---

# GooseLang Frontend Development Summary

## What is the GooseLang Frontend?

The GooseLang frontend is built as a **hybrid architecture** combining server-side rendering (SSR) with React components for interactive functionality. The frontend is implemented as the `ui-default` plugin within the GooseLang ecosystem, providing a comprehensive language learning interface.

### Core Philosophy

- **SSR-First**: Pages are primarily server-rendered using Nunjucks templates for optimal performance and SEO
- **React Enhancement**: Interactive components are built with React and mounted on server-rendered pages
- **Progressive Enhancement**: Traditional web functionality works without JavaScript, enhanced with React for better UX
- **Component Reusability**: Extensive library of reusable UI components with TypeScript support

---

## Technology Stack Overview

### 🛠️ Core Technologies

| Technology | Purpose | Implementation Details |
|------------|---------|------------------------|
| **Nunjucks** | Server-side templating | HTML generation with custom filters and inheritance |
| **React** | Interactive components | Client-side interactivity and dynamic content |
| **TypeScript** | Type safety | Full TypeScript support across components |
| **Stylus** | CSS preprocessing | Modular styling with shared mixins and variables |
| **Webpack** | Build system | Module bundling with TypeScript and asset optimization |
| **Foundation UI** | CSS framework | Partial implementation (CSS-only, no JavaScript) |

### 📦 Key Dependencies

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "monaco-editor": "0.50.0",
  "md-editor-rt": "^5.6.0",
  "stylus": "^0.64.0",
  "webpack": "^5.97.1",
  "nunjucks": "^3.2.4"
}
```

---

## Architecture Deep Dive

### 🏗️ File Structure

```text
ui-default/
├── components/          # React Components
│   ├── autocomplete/        # Input selection system
│   ├── dialog/              # Modal and dialog components
│   ├── editor/              # Monaco & markdown editors
│   ├── form/                # Form input components
│   ├── messagepad/          # Real-time messaging
│   ├── navigation/          # Navigation and menus
│   └── react/               # Core React utilities
├── pages/               # Page-specific Components & Styles
│   ├── *.page.tsx           # React page components
│   ├── *.page.ts            # Page-specific logic
│   └── *.page.styl          # Page-specific styles
├── templates/           # Nunjucks SSR Templates
│   ├── layout/              # Base layout templates
│   ├── partials/            # Reusable template parts
│   └── *.html               # Page templates
├── common/              # Shared Stylus Assets
│   ├── variables.inc.styl   # Global variables
│   ├── functions.inc.styl   # Stylus mixins
│   └── color.inc.styl       # Color definitions
├── static/              # Static Assets
└── build/               # Build Configuration
```

### 🔄 Data Flow Architecture

```text
Frontend Data Flow:
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Nunjucks       │    │  React           │    │  Backend API    │
│  Templates      │◄──►│  Components      │◄──►│  (Koa.js)       │
│  (SSR)          │    │  (Client-side)   │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  HTML Pages     │    │  Interactive     │    │  MongoDB        │
│  (Initial Load) │    │  Updates         │    │  Data Store     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

---

## Key Frontend Components

### 🎯 Essential Components for Development

#### 1. Form Components
**Location**: `/templates/components/form.html`

Use the standardized [Input Form templates](/input-form):
- **Text Input**: `form-text.md` - Standard text input fields
- **Textarea**: `form-textarea.md` - Multi-line text areas
- **Select**: `form-select.md` - Dropdown selections
- **Checkbox**: `form-checkbox.md` - Boolean selections
- **Radio**: `form-radio.md` - Single choice selections
- **Switch**: `form-switch.md` - Toggle switches

#### 2. Media Components
**Location**: `/templates/components/media.html`

Use the standardized [Media Form templates](/media-form):
- **Image Handling**: `image.md` - Image upload and display
- **Audio Components**: `audio.md` - Audio playback and recording
- **Audio Buttons**: `audio-button.md` - Interactive audio controls
- **Iconify Integration**: `iconify.md` - Icon system usage

#### 3. Editor Components
**Location**: `components/editor/`

- **Monaco Editor**: Advanced code/text editing with syntax highlighting
- **Markdown Editor**: Rich text editing with live preview
- **Emoji Support**: Integrated emoji picker and rendering

#### 4. Interactive Components
**Location**: `components/autocomplete/`

- **AutoComplete System**: Powerful search and selection interface
- **Drag & Drop**: Built-in sorting and reordering
- **Async Data Loading**: Efficient data fetching and caching

---

## Styling Architecture

### 🎨 Stylus-Based Styling

**Foundation**: Partial Foundation UI CSS framework (CSS-only, no JavaScript)

#### Global Style Structure

```stylus
// Import order in common/common.inc.styl
@import 'variables.inc.styl'    // Global variables
@import 'color.inc.styl'        // Color definitions
@import 'functions.inc.styl'    // Utility mixins
@import 'easing.inc.styl'       // Animation curves
@import 'rem.inc.styl'          // REM calculations
```

#### Page-Specific Styling

```text
Naming Convention: {pagename}.page.styl
Location: pages/

Examples:
- problem_detail.page.styl
- training_main.page.styl
- user_detail.page.styl
```

#### Responsive Design

```json
// breakpoints.json
{
  "mobile": 768,
  "desktop": 1024,
  "hd": 1440
}
```

```stylus
// Usage with Rupture
+below(mobile)
  // Mobile styles
+above(desktop)
  // Desktop styles
```

---

## Development Workflow

### 🚀 Getting Started

#### 1. Component Development

```typescript
// Example React component structure
import React from 'react';
import { IconComponent } from '../react/IconComponent';

interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  return (
    <div className="my-component">
      <h2>{title}</h2>
      <button onClick={onAction}>
        <IconComponent name="mdi:check" />
        Action
      </button>
    </div>
  );
};
```

#### 2. Template Integration

```html
<!-- Nunjucks template: templates/my_page.html -->
{% extends "layout/basic.html" %}

{% block content %}
<div id="my-react-component"></div>
<script>
  // React component will mount here
  UserContext.myPageData = {{ pageData | json | safe }};
</script>
{% endblock %}
```

#### 3. Page-Specific Logic

```typescript
// pages/my_page.page.tsx
import { MyComponent } from '../components/MyComponent';

export default function initMyPage() {
  const container = document.getElementById('my-react-component');
  if (container) {
    ReactDOM.render(<MyComponent {...UserContext.myPageData} />, container);
  }
}
```

### 📋 Development Best Practices

#### ✅ Do's

1. **Use Standardized Components**: Always check [Input Form](/input-form) and [Media Form](/media-form) templates first
2. **Follow TypeScript**: Maintain type safety across all components
3. **Responsive Design**: Use breakpoint system for mobile compatibility
4. **Component Reusability**: Create modular, reusable components
5. **Performance**: Lazy-load React components when possible

#### ❌ Don'ts

1. **Don't Override Foundation JS**: Only use CSS parts of Foundation UI
2. **Don't Bypass XSS Protection**: Use built-in Nunjucks filters
3. **Don't Skip SSR**: Ensure core functionality works without JavaScript
4. **Don't Inline Styles**: Use Stylus files for all styling
5. **Don't Ignore i18n**: Support internationalization from the start

---

## Advanced Features

### 🔧 WebSocket Integration

Real-time features for language learning:

```typescript
// components/socket/index.ts
export class SocketManager {
  connect() {
    // Speech synthesis updates
    // Translation progress
    // Real-time collaboration
  }
}
```

### 🎵 Audio/Speech Integration

Language learning specific features:

```typescript
// Audio playback and recording
import { AudioComponent } from '../media/AudioComponent';

// Text-to-speech integration
import { SpeechSynthesis } from '../speech/SpeechSynthesis';
```

### 📝 Monaco Editor Customization

```typescript
// components/monaco/index.ts
import * as monaco from 'monaco-editor';

// Custom language support
import './languages/markdown';
import './languages/yaml';

// Custom themes for language learning
import { setupLanguageLearningTheme } from './themes';
```

---

## Performance Considerations

### ⚡ Optimization Strategies

1. **Code Splitting**: Lazy-load React components per page
2. **Asset Optimization**: Webpack optimization for production builds
3. **Caching Strategy**: Efficient template caching in development/production
4. **Bundle Analysis**: Regular bundle size monitoring

### 📊 Performance Monitoring

- Template rendering monitored (>5000ms logged as errors)
- Webpack bundle analysis available
- Development hot-reloading optimized

---

## Integration with Backend

### 🔌 API Communication

```typescript
// Typical API call pattern
const response = await fetch('/api/training/progress', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': UserContext.csrfToken
  },
  body: JSON.stringify(data)
});
```

### 🛡️ Security Integration

- Built-in XSS protection via Nunjucks filters
- CSRF token integration
- Content Security Policy support
- Secure file upload handling

---

## Troubleshooting & Common Issues

### 🐛 Common Development Problems

1. **React Component Not Mounting**
   - Check if container element exists in template
   - Verify script loading order

2. **Stylus Compilation Errors**
   - Ensure proper import paths in common.inc.styl
   - Check variable definitions

3. **TypeScript Type Errors**
   - Review component prop interfaces
   - Check UserContext type definitions

4. **Template Rendering Issues**
   - Verify Nunjucks filter usage
   - Check template inheritance chain

### 🔍 Debug Tools

- Webpack Dev Server for hot reloading
- React Developer Tools integration
- Stylus source maps for debugging
- Template debugging in development mode

---

## Migration and Legacy Notes

### 🔄 jQuery to React Migration

The frontend is in transition from jQuery to React:

- **DomComponent**: Bridges jQuery DOM elements with React
- **Progressive Migration**: Gradually replacing jQuery components
- **Hybrid Support**: Both systems work simultaneously

### 📚 Component Library Evolution

Some components are kept from the original OJ (Online Judge) system:
- **ProblemConfigEditor**: Reference implementation
- **Scratchpad Components**: Legacy but functional

---

*This frontend summary provides comprehensive guidance for developing within the GooseLang language learning platform. The hybrid SSR + React architecture enables both performance and interactivity, making it ideal for educational applications requiring real-time features and accessibility.*