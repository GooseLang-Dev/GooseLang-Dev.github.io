---
sidebar_position: 1
id: intro
title: Introduction
---

# GooseLang Language Learning Platform  

## Project Architecture Overview

### Tech Stack

- **Backend**: TypeScript + Node.js + Koa.js  
- **Frontend**: TypeScript/JavaScript + React + jQuery  
- **Database**: MongoDB  
- **Build Tools**: Yarn Workspaces + Webpack + TypeScript  
- **Editor**: Monaco Editor + Markdown Editor (md-editor-rt)  
- **Speech Synthesis**: WebSocket connection to speech synthesis engine  
- **Translation Service**: WebSocket connection to translation engine  
- **Deployment**: Docker + Kubernetes + Caddy reverse proxy  

---

### Monorepo Structure

```text
GooseLang/
├── packages/                # Plugin ecosystem (every subdirectory is a plugin)
│   ├── gooselang/           # [Core Plugin] Main service framework
│   ├── ui-default/          # [UI Plugin] Default frontend interface
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

---

### Plugin Architecture

Built on the **Cordis** dependency-injection framework.

#### Core Plugins

- **gooselang**: Core service framework (port 2333)
  - HTTP API + WebSocket + plugin loader
- **ui-default**: Frontend UI plugin
  - React components + route management
- **Auth plugins**: GitHub/Google OAuth login
- **Search plugins**: Elasticsearch/Sonic search engines
- **Feature plugins**: Extensions like speech synthesis, translation, etc.

---

## Code File Dependency Relationships

### Core Dependency Graph

```text
gooselang (Main Service)
├── model/      (Data Model Layer)
│   ├── language.ts   (Language configuration management)
│   ├── question.ts   (Question management)
│   ├── material.ts   (Learning material management)
│   ├── training.ts   (Training course management)
│   └── user.ts       (User management)
├── handler/    (Route Handling Layer)
│   ├── training.ts      (Training course handler)
│   ├── homework.ts      (Homework management)
│   ├── translate.ts     (Translation service)
│   └── synthesize.ts    (Speech synthesis)
├── service/    (Business Logic Layer)
├── lib/        (Utility libraries)
└── interface/  (Type definitions)

ui-default (Frontend)
├── components/   (React components)
├── pages/        (Page components)
├── templates/    (HTML templates)
│   └── partials/question_submit_multi.html (Multi-choice submission UI)
├── static/       (Static assets)
└── build/        (Build configuration)
```

---

### Key Dependencies

- `@gooselang/utils`: Utility library depended on by all packages
- `gooselang` ↔ Speech Synthesis Service: WebSocket communication
- `gooselang` ↔ Translation Service: WebSocket communication
- `ui-default` → `gooselang`: HTTP API calls
- `loader` → All packages: Resource-loading support

---

## Functional Module Call Flow

### User Authentication Flow

```text
User login → UserModel.getById() → Session validation → Permission check → Business logic
```

### Language Learning Exercise Flow

> _(Needs improvement: flow should be expanded for clarity and completeness)_

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

## Key Code File Index

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

---

### Configuration Files

| Config Type          | File Path                                                | Description                          |
| -------------------- | -------------------------------------------------------- | ------------------------------------ |
| Database Connection  | `config.json`                                            | MongoDB connection settings          |
| Supported Languages  | `packages/gooselang/src/model/language.ts`               | Config for supported study languages |
| User Permissions     | `packages/gooselang/src/model/user.ts`                   | User permission management           |
| File Storage         | `packages/gooselang/src/settings.ts`                     | File storage path configuration      |
| Translation Settings | `goosetranslator.supported_languages` in system settings | Supported translation languages      |

---

## Project Completion Status

### Overall Completion: **70%**

#### Core Features Implemented ✅
<details>
<summary>Show Fully Integrated Features</summary>
1. **User Authentication System** – Fully implemented (registration, login, permission management)
2. **Target Language Configuration Management** – Fully implemented (supports English, Chinese, Spanish, etc.)
3. **Language Exercise & Editing System** – Fully implemented (listening, speaking, reading, writing, vocabulary, grammar)
4. **File Upload System** – Fully implemented (for learning materials and course files)
5. **Notifications** – Fully implemented (in-app messages, real-time push)
6. **Internationalization Support** – Fully implemented (multi-language UI switching)
7. **Speech Synthesis Service** – Fully implemented (text-to-speech, WebSocket communication) **via plugin**
</details>

#### Partially Completed Features 🔄

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
9. **Translation Service** – 80% (real-time translation via LibreTranslate; additional engines like Google, Bing to be added) **via plugin**
10. **Exercise Judging Logic** – 40% (only multi-choice supported; needs text, audio, matching question support) _(Need improvement: see Chinese doc note)_

</details>

#### Not Yet Implemented Features ❌

<details>
<summary>Show ot Yet Implemented Features</summary>

- Intelligent Pronunciation Assessment
- AI-powered Learning Path Recommendations
- Learning Progress Analytics & Reporting
- Cluster Load Balancing (currently single-node; scalability improvements needed)

</details>
---

## Plugin System Architecture

### Plugin System Features

Built on the **Cordis** dependency injection framework.

#### Core Features ✅

- Dynamic Loading – Support for hot plugin load/unload
- Event-Driven – Rich event hook system
- Type Safety – Full TypeScript support
- Dependency Injection – Cordis-based DI container
- Configuration Management – Schema-driven config validation
- Lifecycle Management – Complete plugin lifecycle support

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

## Reusable UI Component Inventory

### Highly Reusable Components

#### 1. AutoComplete Component

- **Location**: `packages/ui-default/components/autocomplete/components/AutoComplete.tsx`
- **Features**:
  - Single/multiple-selection modes
  - Asynchronous data loading and caching
  - Drag-and-drop sorting
  - Keyboard navigation
  - Free input mode (freeSolo)
- **Reuse Value**: ⭐⭐⭐⭐⭐ (Core interaction component)

#### 2. Editor Component

- **Location**: `packages/ui-default/components/editor/index.tsx`
- **Features**:
  - Monaco code editor integration
  - Markdown editor integration
  - Syntax highlighting, code completion
  - Theme switching, auto-layout
  - Multilingual support
- **Reuse Value**: ⭐⭐⭐⭐⭐ (Core functionality component)

#### 3. Dialog System

- **Location**: `packages/ui-default/components/dialog/index.tsx`
- **Features**:
  - InfoDialog (informational prompts)
  - ActionDialog (confirmation prompts)
  - ConfirmDialog (selection confirmation)
  - Customizable size and styling
- **Reuse Value**: ⭐⭐⭐⭐ (General UI component)

#### 4. Icon Component

- **Location**: `packages/ui-default/components/react/IconComponent.tsx`
- **Features**:
  - Iconify icon library integration
  - Unified icon interface
  - Size and color customization
- **Reuse Value**: ⭐⭐⭐⭐ (Basic UI component)

---

### Domain-Specific Components

#### 5. ProblemConfigEditor 
:::warning
_This component is kept from the OJ (Online Judge) system for reference purposes. It is not fully integrated into GooseLang, but serves as a useful example for programming exercise configuration._
:::

- **Location**: `packages/ui-default/components/problemconfig/ProblemConfigEditor.tsx`
- **Features**:
  - YAML-based programming exercise config editor
  - Test case input/output configuration
  - Time and memory limit settings
  - Checker and interactor configuration
  - Live preview and validation
  - Diff comparison display
- **Reuse Value**: ⭐⭐⭐ (Specialized for online judge systems) 

#### 6. MessagePad

- **Location**: `packages/ui-default/components/messagepad/`
- **Features**:
  - Conversation list and content display
  - Real-time message push
  - Historical message lazy loading
- **Reuse Value**: ⭐⭐⭐ (General social feature)

---

### Utility Components

#### 7. DomComponent

- **Location**: `packages/ui-default/components/react/DomComponent.tsx`
- **Features**:
  - Bridges jQuery DOM elements with React components
- **Reuse Value**: ⭐⭐ (Migration transitional component)

#### 8. PanelComponent
:::warning
_This component is kept from the OJ (Online Judge) system for reference purposes. It is not fully integrated into GooseLang, but serves as a useful example for programming exercise configuration._
:::

- **Location**: `packages/ui-default/components/scratchpad/PanelComponent.jsx`
- **Features**:
  - Standardized panel layout container
- **Reuse Value**: ⭐⭐⭐ (Layout component)

---

### Specialized Selector Components

#### 9. Various AutoComplete Variants

- **Location**: `packages/ui-default/components/autocomplete/`
  - `UserSelectAutoComplete` (User selection)
  - `ProblemSelectAutoComplete` (Exercise selection)
  - `FileSelectAutoComplete` (File selection)
  - `SpaceSelectAutoComplete` (Workspace selection)
- **Reuse Value**: ⭐⭐⭐ (Business-specific selector components)

---

### Component Reuse Recommendations

1. **Highly reusable components** can be extracted and published as independent NPM packages.
2. **Business-specific components** fit best in similar language-learning systems.
3. **Basic UI components** should standardize interfaces for greater generality.
4. **Utility components** serve as reference implementations during tech migrations.

---

*This documentation is generated based on analysis of the GooseLang language learning platform code. It covers project architecture, dependencies, module flows, file indexing, completion status, and UI component inventory. The platform focuses on comprehensive language-learning features—listening, speaking, reading, writing, vocabulary, and grammar—powered by advanced speech synthesis and translation services.*
