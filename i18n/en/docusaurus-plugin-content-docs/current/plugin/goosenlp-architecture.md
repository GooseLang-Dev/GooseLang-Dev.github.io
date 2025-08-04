---
title: GooseNLP Architecture Design
sidebar_position: 2
id: goosenlp-architecture
---

# GooseNLP Architecture Design and Integration Process

## Table of Contents
1. [Project Background and Requirements](#project-background-and-requirements)
2. [Architecture Design](#architecture-design)
3. [Core Features](#core-features)
4. [Integration Process](#integration-process)
5. [Key Issues and Solutions](#key-issues-and-solutions)
6. [Design Advantages](#design-advantages)

## Project Background and Requirements

### Background
The GooseLang system requires powerful Natural Language Processing (NLP) capabilities to enhance the readability and comprehension of materials. Main requirements include:

1. **Part-of-Speech Tagging (POS)**: Help users understand the grammatical role of each word in text
2. **Named Entity Recognition (NER)**: Identify entities like person names, locations, organizations
3. **Dependency Parsing**: Understand grammatical relationships between words
4. **Multi-language Support**: Support English, Chinese, Spanish, and other languages
5. **Interactive Display**: Provide beautiful frontend interface with hover and click interactions
6. **High-Performance Caching**: Avoid reprocessing identical content to improve response speed

### Design Goals
- **Plugin Architecture**: Integrate as an independent plugin into the GooseLang system
- **High Availability**: Support reconnection and error recovery
- **Scalability**: Easy to add new NLP features and language support  
- **User-Friendly**: Provide clean and beautiful interactive interface

## Architecture Design

### Overall Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        GooseLang System                          │
│  ┌─────────────────┐     ┌──────────────────┐                 │
│  │   Frontend UI   │────▶│   NLP Handler    │                 │
│  │ (Material List) │     │  (/nlp/create)   │                 │
│  └─────────────────┘     └──────────────────┘                 │
│                                   │                             │
│                          WebSocket │                             │
│                                   ▼                             │
│  ┌─────────────────────────────────────────┐                  │
│  │          MongoDB (nlp_cache)             │                  │
│  └─────────────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────────┘
                                    │
                           WebSocket │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                        GooseNLP Plugin                           │
│  ┌─────────────────┐     ┌──────────────────┐                 │
│  │  GooseLangHost  │────▶│   NLPService     │                 │
│  │  (WebSocket)    │     │                  │                 │
│  └─────────────────┘     └──────────────────┘                 │
│                                   │                             │
│                              HTTP │                             │
│                                   ▼                             │
│  ┌─────────────────────────────────────────┐                  │
│  │         spaCy Python Server              │                  │
│  │        (127.0.0.1:1407)                 │                  │
│  └─────────────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────────┘
```

### Core Components

#### 1. GooseLang System Side

**NLP Handler** (`packages/gooselang/src/handler/nlp.ts`)
- Processes frontend NLP requests
- Manages MongoDB cache
- Communicates with plugin via WebSocket
- Uses content hash for cache key management

**Frontend UI** (`packages/ui-default/pages/problem_detail.page.tsx`)
- NLP functionality integration in material list pages
- Interactive POS tagging display
- Supports hover and click for detailed information
- Automatic language detection

#### 2. GooseNLP Plugin Side

**GooseLangHost** (`packages/goosenlp/src/hosts/gooselang.ts`)
- WebSocket client implementation
- Automatic reconnection mechanism
- Task queue management
- State synchronization

**NLPService** (`packages/goosenlp/src/nlp.ts`)
- Communication with spaCy service
- Memory cache management
- Language validation and auto-correction
- Result standardization

**Task Processor** (`packages/goosenlp/src/task.ts`)
- Task validation and processing
- Progress reporting
- Error handling

#### 3. spaCy Python Service

**spaCy Server** (`packages/goosenlp/python/spacy_server.py`)
- Multi-language model management
- Phrase extraction algorithms
- Punctuation merging
- RESTful API interface

### Communication Protocol

#### WebSocket Message Format

1. **Task Creation Message**
```json
{
  "key": "task",
  "task": {
    "_id": "task_id",
    "materialId": "material_id",
    "content": "text content",
    "language": "en",
    "features": ["pos", "ner", "dep", "phrases"]
  }
}
```

2. **Progress Report Message**
```json
{
  "key": "next",
  "_id": "task_id",
  "progress": 50,
  "message": "Processing..."
}
```

3. **Completion Message**
```json
{
  "key": "end",
  "_id": "task_id",
  "result": { /* NLP results */ },
  "content": "original content"
}
```

## Core Features

### 1. Intelligent Language Detection

The system implements a character-based language detection algorithm:

```typescript
private validateAndCorrectLanguage(text: string, requestedLanguage: string): string {
    const languagePatterns: { [key: string]: RegExp } = {
        zh: /[\u4e00-\u9fa5]/,                    // Chinese
        es: /[áéíóúñüÁÉÍÓÚÑÜ¿¡]/,               // Spanish
        ja: /[\u3040-\u309f\u30a0-\u30ff]/,       // Japanese
        ko: /[\uac00-\ud7af]/,                     // Korean
        // ... more languages
    };
    // Calculate match score and select most appropriate language
}
```

### 2. Phrase Extraction

Unlike simple word tagging, the system implements intelligent phrase extraction:

```python
def extract_phrases(doc):
    """Extract meaningful phrases rather than individual tokens"""
    phrases = []
    i = 0
    while i < len(doc):
        token = doc[i]
        phrase_tokens = [i]
        
        # Noun phrase extraction
        if token.pos_ in ['DET', 'ADJ']:
            j = i + 1
            while j < len(doc) and doc[j].pos_ in ['ADJ', 'NOUN', 'PROPN']:
                phrase_tokens.append(j)
                j += 1
        
        # Verb phrase extraction
        elif token.pos_ in ['VERB', 'AUX']:
            # Include auxiliary verbs, adverbs, etc.
            # ...
```

### 3. Interactive UI Components

The frontend implements beautiful annotation display:

- **POS Color Coding**: Different parts of speech use different colors
- **Hover Effects**: Mouse hover shows detailed information
- **Click to Pin**: Click tags to pin detailed information display
- **Responsive Positioning**: Dropdown automatically adjusts position to avoid viewport overflow

### 4. Efficient Caching Mechanism

Dual-layer cache design:
- **MongoDB Persistent Cache**: Save results across sessions
- **Memory Cache**: Improve hot data access speed

## Integration Process

### Phase 1: Basic Architecture Setup

1. **Create Plugin Structure**
   - Establish GooseNLP package directory
   - Configure TypeScript environment
   - Set up WebSocket communication framework

2. **Integrate spaCy**
   - Create Python virtual environment
   - Install multi-language models
   - Implement HTTP API service

### Phase 2: Core Feature Implementation

1. **Implement NLP Processing Pipeline**
   - Task reception and validation
   - spaCy calls and result processing
   - Cache management

2. **Frontend Integration**
   - Add toggle switch to material list pages
   - Implement annotation display components
   - Add interactive effects

### Phase 3: Optimization and Issue Resolution

1. **Cache Issue Resolution**
   - Resolve content hash mismatch issues
   - Optimize cache key generation strategy

2. **UI Optimization**
   - Migrate from inline styles to Stylus
   - Optimize dropdown positioning algorithm
   - Add phrase grouping display

3. **Virtual Environment Issue Resolution**
   - Migrate virtual environment to user directory
   - Resolve EBADF errors

## Key Issues and Solutions

### 1. Content Hash Mismatch Causing Cache Invalidation

**Problem Description**:
System saved NLP results using materialId+timestamp generated hash, but queried using content hash, resulting in never hitting cache.

**Solution**:
- Modified backend to ensure both save and query use content hash
- Pass original content in WebSocket messages for hash calculation

```typescript
// Fixed code
onComplete: (result) => {
    this.send({
        key: 'end',
        _id: taskId,
        result,
        materialId: task.materialId,
        content: task.content  // Add content field
    });
}
```

### 2. Irregular CSS Management

**Problem Description**:
Initial implementation used inline styles, not conforming to system's Stylus management standards.

**Solution**:
- Create independent `.styl` files
- Utilize webpack auto-import mechanism
- Remove all inline styles

### 3. Overly Simple Language Detection

**Problem Description**:
Initial support only for Chinese-English detection, not flexible enough.

**Solution**:
- Implement character-based multi-language detection
- Support Japanese, Korean, Arabic, etc.
- Auto-fallback to supported languages

### 4. Virtual Environment EBADF Error

**Problem Description**:
Virtual environment in project directory caused filesystem errors.

**Solution**:
- Migrate to `~/.gooselang/goosenlp/venv`
- Use standard GooseLang directory structure
- Auto-create necessary directories

### 5. Word Tagging Not Intelligent Enough

**Problem Description**:
Simple word tagging disrupted reading experience.

**Solution**:
- Implement intelligent phrase extraction
- Merge punctuation marks
- Group by sentence boundaries

## Design Advantages

### 1. Plugin Architecture
- **Independent Deployment**: NLP service can run and scale independently
- **Loose Coupling**: WebSocket communication reduces system coupling
- **Easy Maintenance**: Clear component responsibilities, easy to maintain and upgrade

### 2. High-Performance Design
- **Dual-Layer Cache**: Reduce repeated computation, improve response speed
- **Concurrent Processing**: Support multi-task concurrent processing
- **Streaming Transfer**: Support streaming processing of large texts

### 3. User Experience Optimization
- **Beautiful UI**: POS color coding, interactive dropdown
- **Intelligent Grouping**: Phrase-level annotation maintains reading fluency
- **Responsive Design**: Adapt to different screen sizes

### 4. Scalability
- **Multi-language Support**: Easy to add new languages
- **Feature Modularity**: Can flexibly add new NLP features
- **Configuration Management**: Manage various parameters through configuration files

### 5. Robustness
- **Auto-Reconnection**: WebSocket auto-reconnects on disconnection
- **Error Recovery**: Graceful error handling and fallback strategies
- **State Synchronization**: Real-time processing state synchronization

## Summary

GooseNLP's design fully considers system scalability, performance, and user experience. Through plugin architecture, it achieves decoupling of NLP functionality from the main system, facilitating independent development and maintenance. The dual-layer cache mechanism ensures high performance, while intelligent phrase extraction and beautiful UI design greatly enhance user experience.

Various issues encountered during integration were resolved through iterative optimization, ultimately forming a stable, efficient, and user-friendly NLP solution.