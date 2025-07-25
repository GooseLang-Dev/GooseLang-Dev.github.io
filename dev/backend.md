---
sidebar_position: 3
id: backend
title: Backend Summary
---

# GooseLang Backend Development Summary

## Overview

The GooseLang backend is a **plugin-based language learning platform** built with TypeScript, Node.js, and Koa.js. It provides comprehensive educational services through the `gooselang` core plugin, handling user management, multilingual content, training courses, homework systems, and real-time language services.

### Core Philosophy

- **Plugin Architecture**: Modular, extensible design using Cordis dependency injection
- **Database-Driven**: MongoDB-based persistence with comprehensive educational models
- **API-First**: RESTful design with WebSocket support for real-time features
- **Security-Focused**: Built-in authentication, authorization, and protection mechanisms
- **Language Learning Optimized**: Specialized for multilingual educational content

---

## Technology Stack

### 🛠️ Core Technologies

| Technology | Purpose | Implementation |
|------------|---------|----------------|
| **TypeScript** | Type safety & development | Full TypeScript with decorators |
| **Node.js** | Runtime environment | Node.js 18+ with ES2020 target |
| **Koa.js** | Web framework | HTTP server with middleware |
| **MongoDB** | Database | Document storage with querying |
| **Cordis** | Dependency injection | Plugin architecture framework |
| **GraphQL** | API queries | Schema-based API |

### 📦 Key Dependencies

```json
{
  "cordis": "3.18.1",
  "mongodb": "^5.9.2",
  "@gooselang/framework": "workspace:^",
  "graphql": "^16.9.0",
  "nodemailer": "^6.9.16",
  "moment-timezone": "^0.5.46"
}
```

---

## 🏗️ Architecture Overview

### System Architecture

```text
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  HTTP Request   │    │  Koa Middleware  │    │  Handler Layer  │
│  (API Call)     │───►│  (Authentication │───►│  (Route Logic)  │
└─────────────────┘    │   & Validation)  │    └─────────────────┘
                       └──────────────────┘             │
                                ▲                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  HTTP Response  │    │  Service Layer   │    │  Model Layer    │
│  (JSON/HTML)    │◄───│  (Business Logic)│◄───│  (Data Access)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
                                                         ▼
                                               ┌─────────────────┐
                                               │  MongoDB        │
                                               │  Database       │
                                               └─────────────────┘
```

### 📁 File Structure

```text
gooselang/src/
├── model/                   # Data Models (MongoDB Collections)
│   ├── blacklist.ts            # User blacklist management
│   ├── builtin.ts              # Built-in constants and permissions
│   ├── contest.ts              # Contest/competition system
│   ├── discussion.ts           # Discussion forums
│   ├── document.ts             # Base document operations
│   ├── language.ts             # Language configuration system
│   ├── material.ts             # Learning materials
│   ├── message.ts              # User messaging system
│   ├── oauth.ts                # OAuth authentication
│   ├── opcount.ts              # Operation counting/rate limiting
│   ├── oplog.ts                # Operation logging
│   ├── problem.ts              # Exercise problems
│   ├── question.ts             # Question bank
│   ├── record.ts               # User submission records
│   ├── schedule.ts             # Task scheduling
│   ├── setting.ts              # System settings
│   ├── solution.ts             # Problem solutions
│   ├── space.ts                # Multi-tenant workspaces
│   ├── storage.ts              # File storage system
│   ├── system.ts               # System configuration
│   ├── task.ts                 # Background task management
│   ├── token.ts                # Token management
│   ├── training.ts             # Training courses
│   └── user.ts                 # User management
├── handler/                 # Request Handlers (API Endpoints)
│   ├── compat.ts               # Compatibility layer
│   ├── contest.ts              # Contest management endpoints
│   ├── discussion.ts           # Discussion forum endpoints
│   ├── home.ts                 # Homepage handlers
│   ├── homework.ts             # Homework assignment system
│   ├── import.ts               # Data import handlers
│   ├── judge.ts                # Exercise judging system
│   ├── manage.ts               # Management interface
│   ├── misc.ts                 # Miscellaneous endpoints
│   ├── problem.ts              # Problem management
│   ├── record.ts               # Submission records
│   ├── space.ts                # Workspace management
│   ├── status.ts               # System status
│   ├── synthesize.ts           # Speech synthesis WebSocket
│   ├── training.ts             # Training course endpoints
│   ├── translate.ts            # Translation service WebSocket
│   └── user.ts                 # User profile operations
```


---

## 🗃️ Data Models

The backend uses MongoDB-based models for all educational content. For detailed information, see [Data Structure Documentation](/dev/category/data-structure).

### 🏛️ Core System Models

- **User Management**: Authentication, permissions, profile data with LRU caching
- **Multi-tenant Workspaces**: Space-based content organization and isolation
- **System Configuration**: Global and space-specific settings management

### 🌐 Language Learning Models

- **Language Configuration**: Supports English, Chinese, Spanish with 6 exercise types (Listening, Speaking, Reading, Writing, Vocabulary, Grammar)
- **Exercise Problems**: Multilingual content with file upload support
- **Training Courses**: DAG-based progression structure for learning paths
- **Question Bank**: Comprehensive exercise question management
- **Learning Materials**: Educational resources and content library

### 📊 Assessment & Progress Models

- **Submission Records**: User progress tracking and scoring system
- **Solution Management**: Problem solutions and explanations
- **Contest System**: Competitions and timed assessments
- **Homework Management**: Assignment distribution via contest system

### 💬 Communication Models

- **Messaging System**: In-app notifications and user communication
- **Discussion Forums**: Community interaction and Q&A
- **OAuth Integration**: Third-party authentication (GitHub, Google)

### ⚙️ System Operations

- **Background Tasks**: Speech synthesis and translation job management
- **Operation Logging**: Comprehensive audit trails and monitoring
- **Rate Limiting**: Abuse prevention and resource management
- **File Storage**: Upload handling and storage management

### 🔧 Model Architecture Patterns

All models follow standardized patterns:
- **CRUD Operations**: `get()`, `getMulti()`, `add()`, `edit()`, `del()`
- **Multi-tenant Isolation**: Space-based data separation
- **Caching Strategy**: LRU cache for performance optimization
- **Event Broadcasting**: Model changes via service bus
- **Type Safety**: Full TypeScript interfaces and validation

---

## 🔗 Request Handlers

The handler layer implements all API endpoints and WebSocket connections. For comprehensive details, see [Handler Documentation](/dev/category/handlers).

### 📋 Handler Categories

#### 🏠 Core Platform
- **Dashboard & Navigation**: Main interface and user flow management
- **User Management**: Authentication, profiles, account operations
- **Workspace Management**: Multi-tenant space creation and administration
- **System Administration**: Management interface and system controls

#### 🎓 Language Learning
- **Exercise Management**: Problem creation, editing, file handling
- **Course Management**: Training course creation with DAG structure
- **Assignment System**: Homework distribution and grading
- **Progress Tracking**: Submission handling and score management

#### ⚡ Real-time Services
- **Translation Service**: WebSocket-based translation integration
- **Speech Synthesis**: WebSocket-based text-to-speech processing
- **Exercise Grading**: Automated evaluation and feedback system

#### 👥 Community Features
- **Discussion Forums**: Community interaction and knowledge sharing
- **Competition System**: Contests and timed assessments

### 🛡️ Security Features

#### 🔐 Authentication & Authorization
- **Permission System**: Decorator-based validation with type checking
- **Multi-tenant Security**: Space-based authorization and isolation
- **Rate Limiting**: Configurable per-operation throttling
- **Privilege Validation**: Hierarchical permission management

#### 🔒 Input Validation & Protection
- **Type Validation**: `Types.ObjectId`, `Types.PositiveInt`, `Types.String`
- **File Security**: Extension validation and size limits
- **XSS Protection**: Built-in sanitization and output encoding
- **CSRF Protection**: Anti-CSRF token validation

---

## 🌐 API Architecture

### 🔗 RESTful Endpoints

```text
Core API Routes:
/d/{spaceId}/training/*     - Training course management
/d/{spaceId}/homework/*     - Assignment system
/d/{spaceId}/problem/*      - Exercise problems
/d/{spaceId}/user/*         - User operations
/d/{spaceId}/discuss/*      - Discussion forums

WebSocket Connections:
/translate/conn             - Translation service
/synthesize/conn            - Speech synthesis
```

### 📤 Response Patterns

- **Data Retrieval**: GET requests with optional pagination
- **Resource Creation**: POST requests with comprehensive validation
- **Template Rendering**: Nunjucks-based HTML generation for web interface
- **JSON API**: Structured data responses for programmatic access
- **WebSocket Communication**: Real-time progress updates and status reporting

---

## 🗃️ Database Integration

### 📊 MongoDB Collections

| Collection | Model | Purpose |
|------------|-------|---------|
| **user** | user.ts | User accounts and authentication |
| **space** | space.ts | Multi-tenant workspaces |
| **language_setting** | language.ts | Language configurations |
| **training** | training.ts | Course structure and progression |
| **problem** | problem.ts | Exercise problems and content |
| **record** | record.ts | User submissions and progress |
| **material** | material.ts | Learning resources |
| **task** | task.ts | Background job queue |

### 🔧 Data Access Layer

- **Connection Management**: MongoDB 5.9.2 with connection pooling
- **Transaction Support**: Multi-document consistency for complex operations
- **Query Optimization**: Compound indexes and aggregation pipelines
- **Pagination**: Cursor-based pagination for efficient large dataset handling

---

## 🔌 Plugin Architecture

The GooseLang backend is built on a comprehensive plugin-based architecture using the Cordis dependency-injection framework. This enables modular development, extensibility, and maintainability across the platform.

For detailed information about the plugin system, including development guidelines, event systems, and integration patterns, see the [Plugin Summary](/dev/plugin) documentation.

---

## 🚀 Development Workflow

### 🗃️ Model Development
1. Create model class extending base patterns
2. Define TypeScript interfaces and validation
3. Implement CRUD operations with proper error handling
4. Add caching strategy and event emission

For detailed patterns, see [Data Structure Documentation](/dev/category/data-structure).

### 🔗 Handler Development
1. Extend `Handler` or `ConnectionHandler` base class
2. Add parameter validation decorators
3. Implement security checks and authorization
4. Define response templates and error handling

For comprehensive examples, see [Handler Documentation](/dev/category/handlers).

### 💻 CLI Operations

```bash
# Model operations
gooselang user get 12345           # Get user by ID
gooselang problem add "title"      # Add new problem
gooselang training list            # List training courses

# Database operations
gooselang db migrate               # Run database migrations
gooselang addon list              # List installed plugins
```

---

## 🔌 External Integrations

### ⚡ Real-time Services
- **Translation Services**: LibreTranslate integration with future Google/Bing support
- **Speech Synthesis**: Text-to-speech with multiple voice options and real-time processing
- **Progress Tracking**: WebSocket-based status updates and health monitoring

### 💾 Storage Solutions
- **Local Storage**: Filesystem-based file storage for development
- **S3 Compatible**: AWS S3 and compatible object storage for production
- **GridFS**: MongoDB-based file storage for integrated solutions

### 🔐 Authentication Systems
- **Built-in Authentication**: Username/password with secure hashing and 2FA
- **OAuth Providers**: GitHub and Google OAuth via plugin system
- **WebAuthn/FIDO2**: Modern biometric and hardware key authentication

### 📧 Communication Systems
- **Email Integration**: SMTP support with HTML templates and i18n
- **Notification System**: Real-time user notifications and system announcements
- **Progress Updates**: Training and homework progress notifications

---

## ⚡ Performance & Security

### 🚀 Performance Optimization
- **Caching Strategy**: LRU cache for users and frequently accessed data
- **Database Optimization**: Compound indexes and efficient query patterns
- **Request Monitoring**: Slow request detection and performance metrics
- **Connection Pooling**: Efficient MongoDB connection management

### 🛡️ Security Implementation
- **Input Validation**: Comprehensive parameter validation with TypeScript types
- **Authorization Flow**: Multi-layered security with authentication, privileges, permissions, and rate limiting
- **Data Protection**: Password hashing, session security, XSS prevention, and CSRF protection
- **Monitoring**: Operation logging, error tracking, and audit trails

### 🌐 Production Deployment
- **Environment Configuration**: Development and production environment support
- **Performance Settings**: Configurable connection limits, memory management, and rate limiting
- **Monitoring Setup**: Health checks, metrics collection, and alert systems

---

## 🔬 Advanced Features

### 🌍 Internationalization
Built-in i18n system with automatic language detection based on user preferences, session settings, HTTP headers, and system defaults.

### 🐛 Error Handling
Comprehensive error management with custom error hierarchy, standardized response formats, and development tools including CLI interface and hot reloading.

---

*This backend summary provides comprehensive guidance for developing within the GooseLang language learning platform. The plugin-based architecture enables extensibility and maintainability, while comprehensive security and performance features make it suitable for production educational applications.*