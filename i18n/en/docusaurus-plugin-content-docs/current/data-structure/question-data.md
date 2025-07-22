---
title: Question Data
sidebar_position: 3
id: question-data
---

# Question Data Structure & Model

## 📘 Overview

The GooseLang **Question** data structure and model provide a robust, extensible system for managing individual questions within language learning problems. Each question represents a specific exercise or prompt (e.g., text, audio, multiple choice) that is part of a larger problem. The model supports various question types, rich metadata, and integration with the problem and document systems.

The model is designed to:
- Store and retrieve question definitions and metadata
- Support multiple question types (text, audio, calligraphy, match, multi-choice)
- Enable localization and flexible content structures
- Integrate tightly with problems, user submissions, and progress tracking

## 📁 File Structure

- `src/model/question.ts`: Main implementation of the `QuestionModel` class, providing core logic for question management, including CRUD operations and business rules.
- `src/interface.ts`: TypeScript interfaces and type definitions for all question-related documents and data structures.
- `docs/data-structure/question-data.md`: This documentation file, describing the data model and its usage.

## 📄 Question Data Structure

### Doc Type Constants

```typescript
export const TYPE_QUESTION = 20; // Question document type
```

### Question Document (`QuestionDoc` and Variants)

Represents a single question in the system, with all associated metadata and content. The system supports several question types, each with its own structure.

#### Base Interface

```typescript
export interface QuestionBaseDoc {
    _id: ObjectId;
    onwer: number; // uid of the question owner
    docId: number;
    spaceId: string;
    parentType: number;
    parentId: ObjectId | number | string;
    docType: typeof TYPE_QUESTION;
    content?: LocalizedContent; // question title
    instruciton?: LocalizedContent; // instruction for the question
    isManualJudge?: boolean;
    hasAbsoluteAnswer?: boolean;
}
```

#### Question Type Variants

```typescript
export interface TextQuestionDoc extends QuestionBaseDoc {
    type: 'text';
    textLongContext: boolean;
    textLongAnswer: string;
    textShortAnswer: string;
}

export interface AudioQuestionDoc extends QuestionBaseDoc {
    type: 'audio';
    audioLongContext: boolean;
    audioShortAnswer: string;
    audioLongAnswer: string;
}

export interface CalligraphyQuestionDoc extends QuestionBaseDoc {
    type: 'calligraphy';
    answer: string;
}

export interface MatchQuestionDoc extends QuestionBaseDoc {
    type: 'match';
    translateOptions: boolean;
    targetOptionType: "txt" | "audio";
    sourceOptiontType: "txt" | "image";
    targetOptions: string[];
    sourceOptions: LocalizedContent[];
}

export interface MultiQuestionDoc extends QuestionBaseDoc {
    type: 'multi';
    translateOptions: boolean;
    hasAbsoluteAnswer: boolean;
    inOrder: boolean;
    optionType: "text" | "audio" | "image";
    options: LocalizedContent;
}

// Union type for all question types
export type QuestionDoc =
    | TextQuestionDoc
    | AudioQuestionDoc
    | CalligraphyQuestionDoc
    | MatchQuestionDoc
    | MultiQuestionDoc;
```

#### Key Fields
- **type**: The question type (text, audio, calligraphy, match, multi)
- **content**: Localized question prompt/title
- **instruciton**: Localized instructions (optional)
- **answer/shortAnswer/longAnswer/options**: Type-specific answer fields
- **parentType/parentId**: Links the question to its parent problem
- **isManualJudge/hasAbsoluteAnswer**: Judging and answer logic flags

#### Related Types
- `LocalizedContent`: Multilingual content (e.g., `{ en: "...", zh: "..." }`)
- `ObjectId`: MongoDB object identifier

## 📦 Question Model & Logic

The `QuestionModel` class (in `model/question.ts`) provides all business logic for managing questions. Key responsibilities include:

- **CRUD Operations**: Add, edit, delete, and retrieve questions
- **Type Handling**: Support for multiple question types and flexible content
- **Integration**: Tight linkage with problems, user submissions, and the document system

### Core Methods & Logic (QuestionModel)

- **get(spaceId, qid)**: Retrieve a question by its ObjectId
- **getList(spaceId, parentId, projection?)**: Retrieve all questions for a given problem
- **getMulti(spaceId, projection?)**: Retrieve all questions in a space
- **add(spaceId, problemDocId, owner)**: Create a new question for a problem
- **edit(spaceId, docId, $set)**: Update question fields
- **del(spaceId, qid)**: Delete a question by its ObjectId

All methods interact with the `document` MongoDB collection, using the `docType` field to distinguish document roles.

## 📝 Question Submission & Progress Flow

1. **Problem Author Adds Question**: A question is created and linked to a problem.
2. **User Attempts Question**: The question is presented as part of a problem; user submits an answer.
3. **Answer Evaluation**: Depending on type and flags, answers may be auto-judged or require manual review.
4. **Progress Tracking**: User submissions and scores are tracked at the problem and question level.

## 📌 Notes / Observations

- **Extensibility**: The model supports new question types via interface extension.
- **Localization**: All user-facing content (prompt, instructions) is localized via `LocalizedContent`.
- **Parent Linking**: Each question is linked to a parent problem for context and aggregation.
- **Judging Logic**: Supports both auto and manual judging, as well as absolute answer checking.
- **Integration**: The Question model is tightly integrated with the problem, document, and user progress systems.
- **Error Handling**: Most methods throw descriptive errors if data is missing or invalid, aiding debugging and robustness.

## 💡 Usage Examples

```typescript
// Add a new text question to a problem
await QuestionModel.add('space123', 101, 1); // spaceId, problemDocId, owner

// Get all questions for a problem
const questions = await QuestionModel.getList('space123', 101);

// Edit a question's content
await QuestionModel.edit('space123', 5, { content: { en: 'What is your name?' } });

// Delete a question
await QuestionModel.del('space123', new ObjectId('...'));
```

---

For further details, see the source code in `src/model/question.ts` and `src/interface.ts`.
