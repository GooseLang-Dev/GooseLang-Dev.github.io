---
title: Problem Data Structure
sidebar_position: 2
id: problem-data
---

# Problem Data Structure & Model

## 📘 Overview

The GooseLang **Problem** data structure and model provide a flexible, extensible system for managing language learning problems (exercises) within the GooseLang platform. This system enables the creation, storage, and management of problems, including their metadata, content, files, and user progress tracking. Problems are tightly integrated with language settings, user management, and the document system, supporting a wide range of learning scenarios and analytics.

The model is designed to:
- Store and retrieve problem definitions, metadata, and multilingual content
- Manage problem files (materials, questions, additional resources)
- Track user submissions, scores, and progress
- Support localization, tagging, and reference relationships
- Enable fine-grained access control and extensibility

## 📁 File Structure

- `src/model/problem.ts`: Main implementation of the `ProblemModel` class, providing all core logic for problem management, including CRUD operations, file handling, and business rules.
- `src/interface.ts`: TypeScript interfaces and type definitions for all problem-related documents and data structures.
- `docs/data-structure/problem-data.md`: This documentation file, describing the data model and its usage.

## 📄 Problem Data Structure

### Doc Type Constants

```typescript
export const TYPE_PROBLEM = 10; // Problem document type
```

### Problem Document (`ProblemDoc`)

Represents a single problem (exercise) in the system, with all associated metadata, content, and files.

```typescript
export interface ProblemDoc extends Document {
    docType: typeof TYPE_PROBLEM; // 10
    pid: string; // Problem identifier (user-defined or auto-generated)
    spaceId: string;
    docId: number; // Auto-generated unique ID
    Owner: number;
    langData: {
        targetLangId: ObjectId;
        isTargetLangCustom: boolean;
        typeId: ObjectId; // Problem type (e.g., listening, speaking)
        levelId: ObjectId;
    };
    tag: string[];
    nSubmit: number;
    avgTime: number;
    avgScore: number;
    nRate: number;
    rate: number;
    sort?: string;
    reference?: { spaceId: string; pid: string };
    isHidden: boolean;
    description: LocalizedContent;
    title: LocalizedContent;
    MaterialFile?: FileInfo[];
    AdditionalFile?: FileInfo[];
    QuestionFile?: FileInfo[];
}
```

#### Key Fields
- **pid**: Problem identifier (e.g., 'EN-L#321'), can be user-defined or auto-generated
- **langData**: Language, type, and level references for this problem
- **tag**: Array of tags for filtering and categorization
- **MaterialFile / AdditionalFile / QuestionFile**: Arrays of file metadata for attached resources
- **description / title**: Localized content for UI display
- **reference**: Optional reference to another problem (for derived/related problems)
- **isHidden**: Controls visibility

#### Related Types
- `FileInfo`: Metadata for files (name, size, etag, lastModified, etc.)
- `LocalizedContent`: Multilingual content (e.g., `{ en: "...", zh: "..." }`)
- `ObjectId`: MongoDB object identifier
- `Document`: Base document fields (from `@interface.ts`)

### Problem Status Document (`ProblemStatusDoc`)

Tracks user-specific progress, scores, and status for a problem.

```typescript
export interface ProblemStatusDoc extends StatusDocBase {
    docId: number;
    docType: 10;
    highestRid?: ObjectId;
    currentRid?: ObjectId;
    qid?: ObjectId;
    star?: boolean;
    status?: number; // 0: not started/finished, 1: in progress
    score?: number; // highest score
    avgScore?: number; // average score
    tries?: number; // number of attempts
}
```

### Record Document (`RecordDoc`)

Stores individual user submission records for a problem.

```typescript
export interface RecordDoc {
    _id: ObjectId;
    spaceId: string;
    pid: number;
    uid: number;
    score: number;
    time?: number;
    startAt?: Array<Date>;
    endAt?: Array<Date>;
    isJudged?: number;
    questionRecod?: any[];
}
```

## 📦 Problem Model & Logic

The `ProblemModel` class (in `model/problem.ts`) provides all business logic for managing problems. Key responsibilities include:

- **CRUD Operations**: Add, edit, delete, and retrieve problems
- **File Management**: Attach, rename, and delete files (materials, questions, etc.)
- **Status Tracking**: Track user progress, submissions, and scores
- **Reference Handling**: Support for referencing other problems (e.g., for derived or related problems)
- **Localization & Tagging**: Support for multilingual content and flexible tagging
- **Access Control**: Permission checks for user access to problems

### Core Methods & Logic (ProblemModel)

- **add(spaceId, pid, title, description, owner, tag, isHidden, langData, reference)**: Create a new problem
- **addWithId(...)**: Create a new problem with a specific docId
- **get(spaceId, pid, projection?)**: Retrieve a problem by ID or PID
- **getMulti(spaceId, query, projection?)**: Retrieve multiple problems by query
- **edit(spaceId, _id, $set)**: Update problem fields
- **del(spaceId, docId)**: Delete a problem and associated files/status
- **addFile(spaceId, docId, type, file, name, ...)**: Attach a file to a problem
- **delFile(spaceId, docId, type, name, ...)**: Remove a file from a problem
- **renameFile(spaceId, docId, file, newName, ...)**: Rename a file
- **getStatus(spaceId, docId, uid)**: Get user-specific status for a problem
- **updateStatus(spaceId, pid, uid, args)**: Update user status
- **incStatus(spaceId, pid, uid, key, count)**: Increment a status field
- **canViewBy(pdoc, udoc)**: Check if a user can view a problem

All methods interact with the `document` MongoDB collection, using the `docType` field to distinguish document roles.

## 📝 Problem Submission & Progress Flow

1. **User Submits Solution**: A user submits an answer to a problem.
2. **Record Creation**: A `RecordDoc` is created, storing the submission, time, and score.
3. **Status Update**: The user's `ProblemStatusDoc` is updated with new scores, tries, and progress.
4. **Problem Aggregation**: Problem-level stats (`nSubmit`, `avgScore`, etc.) are updated.
5. **File Attachments**: If the problem includes files (audio, text, etc.), these are managed via the file methods.

## 📌 Notes / Observations

- **Extensibility**: The model supports custom language types, levels, and flexible tagging.
- **Localization**: All user-facing content (title, description) is localized via `LocalizedContent`.
- **Reference Problems**: Problems can reference others, supporting derived or related exercises.
- **File Management**: Problems can have multiple associated files, each tracked with metadata.
- **Status & Progress**: Fine-grained tracking of user progress and scores is built-in.
- **Integration**: The Problem model is tightly integrated with the document system, user management, and language settings.
- **Error Handling**: Most methods throw descriptive errors if data is missing or invalid, aiding debugging and robustness.

## 💡 Usage Examples

```typescript
// Create a new problem
await ProblemModel.add(
    'space123',
    'EN-L#321',
    { en: 'Listening Exercise 1' },
    { en: 'Listen and repeat' },
    1, // owner
    ['listening', 'beginner'],
    false, // isHidden
    {
        targetLangId: new ObjectId(),
        isTargetLangCustom: false,
        typeId: new ObjectId(),
        levelId: new ObjectId(),
    },
    {} // reference (optional)
);

// Attach a material file
await ProblemModel.addFile('space123', 123, 'MaterialFile', fileBuffer, 'audio.mp3');

// Get a problem by PID
const problem = await ProblemModel.get('space123', 'EN-L#321');

// Update a problem's tags
await ProblemModel.edit('space123', 123, { tag: ['listening', 'advanced'] });

// Track user progress
await ProblemModel.updateStatus('space123', 123, 42, { score: 95, status: 1 });
```

---

For further details, see the source code in `src/model/problem.ts` and `src/interface.ts`.
