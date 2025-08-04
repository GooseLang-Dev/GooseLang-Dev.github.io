---
id: goosenlp-user-guide
title: GooseNLP User Guide
sidebar_position: 1
---

# GooseNLP User Guide

## Table of Contents
1. [Quick Start](#quick-start)
2. [Installation & Deployment](#installation--deployment)
3. [Configuration](#configuration)
4. [Usage Flow](#usage-flow)
5. [Features](#features)
6. [FAQ](#faq)
7. [Important Notes](#important-notes)

## Quick Start

GooseNLP is a natural language processing plugin for the GooseLang system, providing part-of-speech tagging, named entity recognition, and other features for text materials.

### Main Features
- 🏷️ **Part-of-Speech Tagging**: Identify nouns, verbs, adjectives, etc.
- 🔍 **Named Entity Recognition**: Identify person names, locations, organizations, etc.
- 🌐 **Multi-language Support**: Support English, Chinese, Spanish
- 📊 **Interactive Display**: Click to view detailed language analysis

## Installation & Deployment

### Prerequisites
- Node.js 18+
- Python 3.8+
- MongoDB
- GooseLang System

### Installation Steps

#### 1. Prerequisites

Ensure Python 3.8 or higher is installed:

```bash
# Check Python version
python3 --version

# If not installed, install according to your OS:
# macOS: brew install python3
# Ubuntu/Debian: sudo apt-get install python3 python3-pip
# Windows: Download from python.org
```

#### 2. Install GooseNLP Plugin

```bash
# Navigate to GooseLang project directory
cd /path/to/GooseLang

# Install dependencies
yarn install

# Navigate to GooseNLP directory
cd packages/goosenlp
```

#### 3. One-Click Startup (Recommended)

GooseNLP provides a one-click startup command that automatically:
- Creates Python virtual environment
- Installs required dependencies
- Downloads language models (English, Chinese, Spanish)
- Starts spaCy service and GooseNLP plugin

```bash
# Run in packages/goosenlp directory
npm run dev
```

On first run, the system will automatically:
1. Create configuration and virtual environment in user directory
2. Install Python dependency packages
3. Download spaCy language models (~500MB)
4. Start all necessary services

#### 4. Configuration File Locations

GooseNLP's configuration files and virtual environment are stored in the user directory:

**macOS/Linux:**
```
~/.gooselang/
├── goosenlp/
│   ├── venv/          # Python virtual environment
│   ├── logs/          # Log files
│   └── config/        # Configuration files
└── nlp.yaml           # NLP plugin configuration
```

**Windows:**
```
%USERPROFILE%\.gooselang\
├── goosenlp\
│   ├── venv\          # Python virtual environment
│   ├── logs\          # Log files
│   └── config\        # Configuration files
└── nlp.yaml           # NLP plugin configuration
```

**Note**: Different OS path representations:
- macOS/Linux: `~` represents user home directory, like `/Users/username` or `/home/username`
- Windows: `%USERPROFILE%` is usually `C:\Users\username`

## Configuration

### 1. GooseLang System Configuration

Add GooseNLP configuration to GooseLang's configuration file:

```yaml
# config/default.yaml or config/production.yaml

goosenlp:
  # Whether to disable plugin
  disable: false
  
  # spaCy service address
  spacy_url: http://127.0.0.1:1407
  
  # Whether to enable cache
  cache_enabled: true
  
  # Maximum text length
  max_text_length: 50000
  
  # Host configuration
  hosts:
    - server: http://localhost:1337  # GooseLang server address
      uname: goosenlp_user          # Authentication username
      password: your_password        # Authentication password
      priority: 1                    # Priority
      concurrency: 2                 # Concurrency count
```

### 2. Environment Variable Configuration

Support configuration override via environment variables:

```bash
# GooseLang server address
export GOOSELANG_SERVER_URL=http://your-server:1337

# MongoDB connection (if independent configuration needed)
export MONGODB_URL=mongodb://localhost:27017/gooselang
```

### 3. Plugin Configuration File

Plugin configuration file is located in user directory:

**macOS/Linux:** `~/.gooselang/nlp.yaml`  
**Windows:** `%USERPROFILE%\.gooselang\nlp.yaml`

Configuration example:

```yaml
# nlp.yaml
type: goosenlp
server: http://localhost:1337
uname: nlp_worker
password: secure_password
spacyUrl: http://127.0.0.1:1407
cacheEnabled: true
concurrency: 2
```

A default configuration file will be automatically created when running `npm run dev` for the first time.

## Usage Flow

### 1. Enable NLP in Material List

1. Open a problem page containing text materials
2. Find the "Part-of-Speech Tagging" toggle above the material list
3. Turn on the toggle, and the system will automatically analyze current materials

![NLP Toggle Switch](./images/nlp-toggle.png)

### 2. View Annotation Results

After enabling, text will be annotated as different colored phrase blocks:

- 🔵 **Blue**: Nouns/Noun phrases
- 🟢 **Green**: Verbs/Verb phrases
- 🟡 **Yellow**: Adjectives
- 🟠 **Orange**: Adverbs
- 🟣 **Purple**: Proper nouns
- Other colors correspond to different parts of speech

### 3. Interactive Detail Viewing

#### Basic Interactions

- **Mouse Hover**: Quickly view part-of-speech and lemma information
- **Click to Pin**: Click phrase tags to pin detailed information display
- **Click Again**: Close detail window

#### Detail Window Content

The detail window displays in an elegant dropdown format, containing:

1. **Phrase Information**
   - Phrase type (e.g., noun_phrase, verb_phrase)
   - Main part-of-speech (e.g., NOUN, VERB)

2. **Components** (multi-word phrases)
   - Original text of each word
   - POS tags
   - POS descriptions (e.g., "noun", "verb")

#### Interface Display Example

When you click a phrase, you'll see an information box like this:

```
┌─────────────────────────────┐
│ Type: noun_phrase           │
│ Main POS: NOUN              │
│ ─────────────────────────── │
│ Components:                 │
│ • The: DET (Determiner)     │
│ • quick: ADJ (Adjective)    │
│ • brown: ADJ (Adjective)    │
│ • fox: NOUN (Noun)          │
└─────────────────────────────┘
```

The information box intelligently positions itself to ensure complete display within the viewport.

### 4. Switch Materials

When switching to other materials:
- NLP toggle will automatically reset
- Need to re-enable to analyze new materials
- Analyzed results are cached for faster loading on revisit

## Features

### Supported Languages

Currently supports automatic detection and analysis of the following languages:

| Language | Code | Features |
|----------|------|----------|
| English | en | Complete POS, entity, dependency analysis |
| Chinese | zh | Word segmentation, POS, entity recognition |
| Spanish | es | POS, entity, dependency analysis |

The system automatically detects text language and can auto-select based on system language settings.

### NLP Feature Characteristics

1. **Part-of-Speech Tagging (POS)**
   - Identify grammatical role of each word
   - Provide detailed POS descriptions

2. **Phrase Extraction**
   - Intelligently combine related words
   - Maintain reading fluency

3. **Named Entity Recognition (NER)**
   - Identify person names, locations, organizations, etc.
   - Display in statistical information

4. **Lemmatization**
   - Show base form of words
   - Help understand word variations

### Performance Optimization

- **Smart Caching**: Identical content won't be reprocessed
- **Streaming Loading**: Large texts processed in batches
- **Concurrent Processing**: Support simultaneous analysis of multiple materials

## FAQ

### Q1: Why does NLP keep loading after enabling?

**Possible Causes**:
1. spaCy service not started
2. Network connection issues
3. Text too long exceeding limits

**Solutions**:
1. Check if spaCy service is running: `curl http://127.0.0.1:1407/health`
2. View GooseNLP plugin logs
3. Confirm text length doesn't exceed configured maximum

### Q2: How to handle inaccurate language recognition?

**Solutions**:
1. System automatically detects and corrects language
2. Ensure text contains sufficient language features
3. Mixed language text may affect recognition accuracy

### Q3: How to add new language support?

**Steps**:
1. Install corresponding spaCy language model
2. Add model configuration in `spacy_server.py`
3. Update language detection logic
4. Restart services

### Q4: How to clear cache?

**MongoDB Cache**:
```javascript
// Connect to MongoDB
use gooselang;
// Clear NLP cache
db.nlp_cache.remove({});
```

**Memory Cache**:
Restart GooseNLP plugin to clear memory cache.

### Q5: How to view processing logs?

Log file locations vary by operating system:

**macOS/Linux:**
- GooseNLP plugin logs: View console output
- spaCy service logs: `~/.gooselang/goosenlp/logs/`

**Windows:**
- GooseNLP plugin logs: View console output
- spaCy service logs: `%USERPROFILE%\.gooselang\goosenlp\logs\`

## Important Notes

### Security Considerations

1. **Authentication Configuration**
   - Always set strong passwords
   - Don't hardcode sensitive information in config files
   - Use environment variables to manage credentials

2. **Network Security**
   - spaCy service should only listen on local address
   - Use HTTPS in production
   - Configure firewall rules

### Performance Considerations

1. **Resource Usage**
   - NLP processing is CPU and memory intensive
   - Recommend sufficient system resources
   - Can adjust concurrency to control resource usage

2. **Text Length**
   - Very long texts may cause slow processing
   - Recommend reasonable maximum length limits
   - Consider segmented processing for large documents

### Usage Recommendations

1. **Best Practices**
   - Regularly clean expired cache
   - Monitor service running status
   - Keep language models updated

2. **Troubleshooting**
   - Keep logs
   - Set up monitoring alerts
   - Prepare fallback solutions

## Appendix

### Command Quick Reference

```bash
# One-click startup (recommended)
npm run dev          # Auto-setup environment and start all services

# Start separately
npm run start:python  # Start spaCy service only
npm run start:node    # Start GooseNLP plugin only

# Debug and test
npm run test         # Run tests
npm run health       # Health check
npm run info         # View service information

# Manual management (usually not needed)
# Activate virtual environment
# macOS/Linux:
source ~/.gooselang/goosenlp/venv/bin/activate
# Windows:
%USERPROFILE%\.gooselang\goosenlp\venv\Scripts\activate

# View installed language models
python -m spacy info
```

### Configuration Templates

Complete configuration example files can be found in `packages/goosenlp/nlp.example.yaml`.

### Test Server (Developer Tool)

GooseNLP provides an independent test page for developers to quickly test NLP functionality:

```bash
# Start test server
npm run test-server
```

Visit http://127.0.0.1:3456 to view the test page, featuring:
- Input any text for real-time analysis
- Test multi-language auto-detection
- View detailed NLP analysis results
- Verify service connection status

This is a convenient tool for debugging NLP services and testing new features.

### Getting Help

- View project documentation: `packages/goosenlp/README.md`
- Submit issues: GitHub Issues
- Community discussion: GooseLang Forum

---

*Guide Version: 1.0.0*  
*Last Updated: 2025-08-02*