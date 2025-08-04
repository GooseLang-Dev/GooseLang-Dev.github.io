---
sidebar_position: 1
id: plugin
title: Plugin Summary
---

# GooseLang Plugin Architecture

The GooseLang backend is built as a **plugin-based framework** using the Cordis dependency-injection framework, enabling modular and extensible design for language learning platform services.

## Plugin Structure

### Basic Plugin Template

```typescript
export default {
  name: 'plugin-name',
  schema: ConfigSchema,
  apply: (ctx: Context, config: Config) => {
    // Plugin initialization
    ctx.on('event-name', handler);
    ctx.command('command-name', handler);
  }
};
```

### Core Plugins Integration

The GooseLang ecosystem includes several essential plugins:

- **Framework Plugin**: HTTP server and routing (`@gooselang/framework`)
- **Database Plugin**: MongoDB connection and ORM-like interface
- **Storage Plugin**: File upload and static content serving
- **Worker Plugin**: Background task processing
- **Server Plugin**: Request handling and middleware stack

## Event System

The plugin system relies on a comprehensive event bus for inter-plugin communication:

### Application Lifecycle Events

```typescript
'app/started'     // Application startup complete
'app/ready'       // All plugins loaded
'app/exit'        // Graceful shutdown
```

### User Events

```typescript
'user/message'    // User messaging
'user/import/*'   // User data import
```

### Content Events

```typescript
'problem/add'     // Problem creation
'training/add'    // Training course creation
'record/change'   // Submission status change
```

## WebSocket Integration

Real-time communication plugins for language learning:

### Translation Service Integration

```typescript
// WebSocket communication with translation engines
'goosetranslator' plugin:
- LibreTranslate integration (primary)
- Google Translate (planned)
- Bing Translator (planned)
- Real-time translation progress
- Batch translation processing
```

### Speech Synthesis Integration

```typescript
// WebSocket communication with TTS engines
'goosesynthesizer' plugin:
- Text-to-speech processing
- Multiple voice options
- Real-time audio generation
- Progress tracking and delivery
```

### WebSocket Message Types

```typescript
// WebSocket message types
'synthesis/progress'    // Text-to-speech progress updates
'translation/result'    // Real-time translation results
'homework/notification' // Assignment notifications
'training/progress'     // Course progress updates
```

## Authentication Plugins

Multiple authentication strategies through plugins:

### Built-in Authentication

```typescript
'password'        // Username/password with hashing
'tfa'            // Two-factor authentication (TOTP)
'webauthn'       // WebAuthn/FIDO2 support
```

### OAuth Integration Plugins

```typescript
'login-with-github'  // GitHub OAuth
'login-with-google'  // Google OAuth
```

## Storage Backend Plugins

Support for multiple storage systems through plugin architecture:

```typescript
// Storage configuration
'local'    // Local filesystem storage
's3'       // AWS S3 compatible storage
'gridfs'   // MongoDB GridFS storage
```

## CLI Plugin Operations

The GooseLang CLI provides plugin management capabilities:

```bash
# Plugin management
gooselang addon list              # List installed plugins
gooselang db migrate              # Run database migrations

# Plugin development
gooselang script rating '{"uid": 1}' # Run rating calculation
gooselang execute 'system.get("version")' # Execute code
```

## Plugin Development Guidelines

### Handler Development

```typescript
// Example plugin handler implementation
class MyHandler extends Handler {
  @param('id', Types.ObjectId)
  async get(spaceId: string, id: ObjectId) {
    // Check permissions
    this.checkPerm(PERM.PERM_VIEW);
    
    // Get data from model
    const doc = await MyModel.get(spaceId, id);
    if (!doc) throw new DocumentNotFoundError(id);
    
    // Apply rate limiting
    await this.limitRate('view', 60, 100);
    
    // Return response
    this.response.body = { doc };
    this.response.template = 'my_page.html';
  }
}
```

### Model Development

```typescript
// Example plugin model implementation
export class MyModel {
  static async get(spaceId: string, id: ObjectId): Promise<MyDoc | null> {
    return await coll.findOne({ spaceId, _id: id });
  }
  
  static async add(spaceId: string, data: Partial<MyDoc>): Promise<ObjectId> {
    const doc = { ...data, spaceId, _id: new ObjectId() };
    await coll.insertOne(doc);
    return doc._id;
  }
}
```

## Plugin Architecture Benefits

The plugin-based architecture provides:

- **Modularity**: Independent feature development and deployment
- **Extensibility**: Easy addition of new functionality through plugins
- **Maintainability**: Isolated code bases for different features
- **Reusability**: Plugins can be shared across different GooseLang instances
- **Testability**: Individual plugin testing and validation

---

*This plugin summary covers the core plugin architecture of GooseLang, enabling developers to understand and extend the platform's capabilities through the modular plugin system.*