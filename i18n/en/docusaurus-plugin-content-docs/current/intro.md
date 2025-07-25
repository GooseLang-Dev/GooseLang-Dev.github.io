---
sidebar_position: 1
id: intro
title: Introduction
---

# GooseLang Language Learning Platform  

## What is GooseLang?

GooseLang is a comprehensive language learning platform that combines traditional language learning features with modern speech synthesis and translation services. The platform focuses on providing listening, speaking, reading, writing, vocabulary, and grammar exercises powered by advanced AI services.

### Key Features

- **Multi-modal Learning**: Listening, speaking, reading, writing, vocabulary, and grammar exercises
- **Speech Synthesis**: Real-time text-to-speech with WebSocket communication
- **Translation Services**: Multilingual translation support via LibreTranslate and other engines
- **Interactive UI**: React-powered components for dynamic user interactions
- **Plugin Architecture**: Extensible system built on Cordis dependency injection framework
- **Server-Side Rendering**: Hybrid SSR + React architecture for optimal performance

---

## 🏗️ Project Architecture Overview

### 🛠️ Tech Stack

- **Backend**: TypeScript + Node.js + Koa.js  
- **Frontend**: TypeScript/JavaScript + React + jQuery  
- **Database**: MongoDB  
- **Build Tools**: Yarn Workspaces + Webpack + TypeScript  
- **Editors**: Monaco Editor + Markdown Editor (md-editor-rt)  
- **Services**: Speech Synthesis & Translation via WebSocket
- **Deployment**: Docker + Kubernetes + Caddy reverse proxy  

### 📁 Monorepo Structure

```text
GooseLang/
├── packages/                # Plugin ecosystem (every subdirectory is a plugin)
│   ├── gooselang/           # [CORE] [Backend] Main service framework
│   ├── ui-default/          # [CORE] [Frontend] Default frontend interface
│   ├── elastic/             # [Search Plugin] Elasticsearch integration
│   ├── geoip/               # [GeoIP Plugin] IP geolocation service
│   ├── login-with-github/   # [Auth Plugin] GitHub OAuth
│   ├── login-with-google/   # [Auth Plugin] Google OAuth
│   ├── sonic/               # [Search Plugin] High-speed search engine
│   ├── goosetranslator/     # [Translation Plugin] Multilingual translation service
│   ├── goosesynthesizer/    # [Speech Plugin] Speech synthesis service
│   ├── gooselangjudge/      # [Judging Plugin] Programming exercise judge
│   └── language-tool/       # [Utility Plugin] Language tool integration
├── install/                 # Deployment configuration
├── locales/                 # Internationalization files
├── modules/                 # Module system directory
└── plugins/                 # External plugin development directory
```

### 🔌 Plugin Architecture

Built on the **Cordis** dependency-injection framework with:

- **Dynamic Loading**: Hot plugin load/unload support
- **Event-Driven**: Rich event hook system for extensibility
- **Type Safety**: Full TypeScript support throughout
- **Configuration Management**: Schema-driven config validation

#### Core Plugins

- **gooselang**: Core service framework (port 2333)
  - HTTP API + WebSocket + plugin loader
- **ui-default**: Frontend UI plugin
  - React components + route management
- **Auth plugins**: GitHub/Google OAuth login
- **Search plugins**: Elasticsearch/Sonic search engines
- **Feature plugins**: Extensions like speech synthesis, translation, etc.

---

## 📊 Code File Dependency Relationships

### Core Dependency Graph

```text
gooselang (Main Service)
├── model/       # Data Model Layer
│   ├── language.ts      # Language configuration management
│   ├── question.ts      # Question management
│   ├── material.ts      # Learning material management
│   ├── training.ts      # Training course management
│   └── user.ts          # User management
├── handler/     # Route Handling Layer
│   ├── training.ts      # Training course handler
│   ├── homework.ts      # Homework management
│   ├── translate.ts     # Translation service
│   └── synthesize.ts    # Speech synthesis
├── service/     # Business Logic Layer
├── lib/         # Utility libraries
└── interface/   # Type definitions

ui-default (Frontend)
├── components/          # React Components
│   ├── autocomplete/        # Input selection system
│   ├── dialog/              # Modal and dialog components
│   ├── editor/              # Monaco & markdown editors
│   ├── form/                # Form input components
│   ├── messagepad/          # Real-time messaging
│   ├── navigation/          # Navigation and menus
│   └── react/               # Core React utilities
├── pages/               # Page-specific Components & Styles
├── templates/           # Nunjucks SSR Templates
│   ├── layout/              # Base layout templates
│   └── partials/            # Reusable template parts
├── static/              # Static Assets
└── common/              # Shared Stylus variables and mixins
```

### Key Dependencies

- `@gooselang/utils`: Utility library depended on by all packages
- `gooselang` ↔ Speech Synthesis Service: WebSocket communication
- `gooselang` ↔ Translation Service: WebSocket communication
- `ui-default` → `gooselang`: HTTP API calls
- `loader` → All packages: Resource-loading support

---

## 🔄 Functional Module Call Flow

### User Authentication Flow

```text
User login → UserModel.getById() → Session validation → Permission check → Business logic
```

### Language Learning Exercise Flow

```text
Exercise submission → QuestionModel.get() → Answer validation → Progress update → Result storage → Real-time feedback
```

### Speech Synthesis Service Communication

```text
gooselang WebSocket ↔ Speech Synthesis Service
  - Text-to-speech task dispatch
  - Real-time synthesis status updates
  - Audio data transmission
```

### Translation Service Communication

```text
gooselang WebSocket ↔ Translation Service
  - Translation task dispatch
  - Real-time progress updates
  - Translation result return
```

### Frontend Data Flow

```text
React component → API call → Koa route → Service layer → Model layer → MongoDB
         ← JSON response ← Business logic ← Data query ←
```

---

## 🎯 Development Considerations

When getting started with GooseLang development, understand these two main areas:

### Quick Start Guidance

**For Frontend Development:**
- Use [Input Form](/dev/category/input-form) templates for all form components
- Use [Media Form](/dev/category/media-form) for image/audio handling
- Understand the hybrid SSR + React architecture

**For Backend Development:**
- Follow the Database → Handlers → Webpage flow for GET requests
- Follow the Webpage → Handlers → Database flow for POST requests
- Work with Nunjucks templates and markdown-it processing

---

## 🎨 Frontend Development Deep Dive

### Styling Architecture

- **Foundation UI CSS Framework**: Uses **partial Foundation UI** (https://get.foundation/sites/docs/) - specifically only the `.css` parts rewritten in `.styl` (Stylus) files
- **No JavaScript Dependencies**: Foundation's JavaScript components are NOT used - only CSS grid, typography, and basic component styles are adapted for layout
- **Stylus Preprocessing**: All styles use Stylus (`.styl` files) with shared imports from `common/` directory
- **Page-Specific Styles**: Define as `pagename.page.styl` under `pages/` directory
- **Responsive Breakpoints**: Defined in `breakpoints.json` and used with Rupture mixin system

### ⚛️ React Integration

- **Client-Side Interactions**: React is used specifically for **on-page UX user interactions** and dynamic components
- **Custom Reusable Components**: Extensive library of custom UI components with TypeScript support
- **SSR Templates**: Server-side rendered HTML templates work alongside React components
- **Hybrid Architecture**: Traditional server-rendered pages enhanced with React for interactive elements

### 🧩 Component Architecture

- **Input Forms**: Use pre-defined input templates in [Input Form](/dev/category/input-form) for all form components
- **Media Handling**: Use pre-defined media-form in [Media Form](/dev/category/media-form) for image/audio showcase and upload functionality
- **Monaco Editor Integration**: Custom Monaco editor setup with language support
- **Icon System**: Iconify integration for unified icon interface

---

## 🔧 Backend Development Deep Dive

### Server-Side Rendering (SSR)

- **Nunjucks Templating Engine**: Primary template engine for HTML generation
- **Markdown-it Integration**: Advanced markdown processing with custom plugins (KaTeX, Mermaid, media embeds)
- **Template Hierarchy**: Layout inheritance system (`layout/basic.html` → `layout/html5.html`)
- **Custom Filters**: Extensive Nunjucks filters for markdown, JSON, XSS protection, and content processing

### 📊 Data Flow Patterns

**GET Method (Loading Data):**
```text
Database → Handlers → Webpage
```

**POST Method (Updating Data):**  
```text
Webpage → Handlers → Database
```

### 🛠️ Key Backend Technologies

- **Template System**: Nunjucks with custom loader supporting development and production modes
- **Markdown Processing**: markdown-it with plugins for KaTeX, Mermaid, media embeds, XSS protection
- **Content Management**: Multilingual content support with language-specific rendering
- **File Handling**: Custom file URL processing and secure path resolution
- **XSS Protection**: Built-in XSS filtering integrated into markdown and template rendering

### ⚠️ Critical Development Notes

1. **Template Caching**: Development mode uses `noCache: true` for hot reloading
2. **Security**: XSS protection is deeply integrated - never bypass the built-in filters
3. **Content Processing**: Markdown content supports multilingual objects with automatic language selection
4. **Performance**: Template rendering is monitored - renders over 5000ms are logged as errors

---

## 🧩 UI Components & Templates

GooseLang provides a comprehensive component library for consistent UI development across the platform.

### 📝 Standard Form Components

For all form-related UI development, use the standardized component templates:

- **[Input Form Components](/dev/category/input-form)**: Complete documentation for text inputs, textareas, selects, checkboxes, radio buttons, and switches
- **[Media Form Components](/dev/category/media-form)**: Comprehensive guide for image handling, audio components, audio buttons, and Iconify integration

### 🔧 Core Component Library

The platform includes several highly reusable components:

- **AutoComplete System**: Advanced search and selection with async data loading, drag-and-drop sorting, and keyboard navigation
- **Editor Components**: Monaco code editor and markdown editor with syntax highlighting and multilingual support
- **Dialog System**: Modal dialogs for information, actions, and confirmations
- **Icon System**: Unified Iconify integration for consistent iconography

### 📚 Component Documentation

For detailed component specifications, implementation examples, and usage guidelines, refer to the dedicated component documentation sections linked above. These provide comprehensive coverage of:

- Component APIs and props
- Implementation examples
- Styling guidelines
- Best practices and common patterns

---

## 🔌 Plugin System Architecture

### Plugin System Features

Built on the **Cordis** dependency injection framework.

#### Core Features ✅

- **Dynamic Loading** – Support for hot plugin load/unload
- **Event-Driven** – Rich event hook system
- **Type Safety** – Full TypeScript support
- **Dependency Injection** – Cordis-based DI container
- **Configuration Management** – Schema-driven config validation
- **Lifecycle Management** – Complete plugin lifecycle support

#### Built-in Plugins

| Plugin Name         | Description                      | Status              |
| ------------------- | -------------------------------- | ------------------- |
| `gooselang`         | Core service framework           | ✅ Fully implemented |
| `ui-default`        | Default frontend UI              | ✅ Fully implemented |
| `elastic`           | Elasticsearch integration        | ✅ Fully implemented |
| `geoip`             | IP geolocation service           | ✅ Fully implemented |
| `login-with-github` | GitHub OAuth authentication      | ✅ Fully implemented |
| `login-with-google` | Google OAuth authentication      | ✅ Fully implemented |
| `sonic`             | High-performance search engine   | ✅ Fully implemented |
| `goosetranslator`   | Multilingual translation service | ✅ 80% implemented   |
| `goosesynthesizer`  | Speech synthesis service         | ✅ Fully implemented |
| `gooselangjudge`    | Programming exercise judge       | (Reference only)    |
| `language-tool`     | Language tool integration        | (Test module)       |

#### Plugin Development Scaffold

```typescript
export default {
  name: 'plugin-name',
  schema: ConfigSchema,
  apply: (ctx: Context, config: Config) => {
    // Plugin implementation
    ctx.on('event-name', handler);
    ctx.command('command-name', handler);
  }
};
```

#### Plugin Management CLI

```bash
# Plugin management commands
gooselang addon list              # List installed plugins
gooselang addon add <name>        # Install a plugin
gooselang addon remove <name>     # Remove a plugin
gooselang addon create <name>     # Generate a plugin scaffold
```

#### Event Hook System

Core events that plugins can listen for:

- **Application Lifecycle**: `app/started`, `app/ready`, `app/exit`
- **User Events**: `user/message`, `user/import/*`
- **Learning Content**: `problem/add`, `problem/edit`, `problem/del`
- **Course Management**: `contest/add`, `contest/edit`
- **Record Tracking**: `record/change`, `record/judge`
- **Translation Service**: `translation/change`

---

## 📋 Project Completion Status

### Overall Completion: **70%**

#### ✅ Core Features Implemented
<details>
<summary>Show Fully Integrated Features</summary>

1. **User Authentication System** – Fully implemented (registration, login, permission management)
2. **Target Language Configuration Management** – Fully implemented (supports English, Chinese, Spanish, etc.)
3. **Language Exercise & Editing System** – Fully implemented (listening, speaking, reading, writing, vocabulary, grammar)
4. **File Upload System** – Fully implemented (for learning materials and course files)
5. **Notifications** – Fully implemented (in-app messages, real-time push)
6. **Internationalization Support** – Fully implemented (multi-language UI switching)
7. **Speech Synthesis Service** – Fully implemented (text-to-speech, WebSocket communication)

</details>

#### 🔄 Partially Completed Features
<details>
<summary>Show Partially Completed Features</summary>

1. **Mobile Responsiveness** – 60% (basic responsive layout; needs optimization)
2. **API Documentation** – 70% (OpenAPI spec; some endpoints missing)
3. **Unit Testing** – 30% (some core modules tested; coverage needs improvement)
4. **Performance Monitoring** – 40% (basic logging; lacks full monitoring)
5. **Speech Recognition** – 50% (framework in place; recognition algorithms need refinement)
6. **Discussion Community** – 80% (course discussions, comments, likes; custom channels/nodes needed)
7. **Course Training System** – 50% (course creation, progress tracking, DAG support; UI/UX updates required)
8. **Homework Management System** – 50% (publishing, submission, grading; UI/UX updates required)
9. **Translation Service** – 80% (real-time translation via LibreTranslate; additional engines like Google, Bing to be added)
10. **Exercise Judging Logic** – 40% (only multi-choice supported; needs text, audio, matching question support)

</details>

#### ❌ Not Yet Implemented Features
<details>
<summary>Show Not Yet Implemented Features</summary>

- Intelligent Pronunciation Assessment
- AI-powered Learning Path Recommendations
- Learning Progress Analytics & Reporting
- Cluster Load Balancing (currently single-node; scalability improvements needed)

</details>

---

## 📁 Key File References

### Core System Files

| Module              | Key File                                       | Description                       |
| ------------------- | ---------------------------------------------- | --------------------------------- |
| Service Entry       | `packages/gooselang/src/index.ts`              | Main service startup              |
| Routing System      | `packages/gooselang/src/handler/`              | HTTP route handlers               |
| Data Models         | `packages/gooselang/src/model/`                | MongoDB model definitions         |
| Language Config     | `packages/gooselang/src/model/language.ts`     | Multi-language configuration      |
| Question Model      | `packages/gooselang/src/model/question.ts`     | Language exercise question model  |
| Material Model      | `packages/gooselang/src/model/material.ts`     | Learning materials management     |
| Training Handler    | `packages/gooselang/src/handler/training.ts`   | Training course handling          |
| Synthesis Handler   | `packages/gooselang/src/handler/synthesize.ts` | Text-to-speech processing         |
| Translation Handler | `packages/gooselang/src/handler/translate.ts`  | Multilingual translation handling |
| Frontend Entry      | `packages/ui-default/build/main.ts`            | Webpack build configuration       |

### Configuration Files

| Config Type          | File Path                                                | Description                          |
| -------------------- | -------------------------------------------------------- | ------------------------------------ |
| Database Connection  | `config.json`                                            | MongoDB connection settings          |
| Supported Languages  | `packages/gooselang/src/model/language.ts`               | Config for supported study languages |
| User Permissions     | `packages/gooselang/src/model/user.ts`                   | User permission management           |
| File Storage         | `packages/gooselang/src/settings.ts`                     | File storage path configuration      |
| Translation Settings | `goosetranslator.supported_languages` in system settings | Supported translation languages      |

---

*This introduction provides comprehensive guidance for developing within the GooseLang language learning platform. The plugin-based architecture enables extensibility and maintainability, while the hybrid SSR + React frontend provides both performance and interactivity for educational applications.*