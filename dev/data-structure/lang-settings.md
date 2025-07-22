---
title: Language Settings
sidebar_position: 1
id: lang-settings
---

# Language Data Structure & Model

## 📘 Overview

The **Language Settings** module in GooseLang manages all language-related configuration, metadata, and logic for the platform. It enables system-wide and per-space (organization) language management, including language types (e.g., Listening, Speaking), proficiency levels, and custom tags. This module is foundational for supporting multilingual content, adaptive learning, and fine-grained progress tracking across different learning scenarios.

## 🔗 Dependencies

- **MongoDB**: All language settings are stored in the `language_setting` collection.
- **Space Model**: Associates language settings with specific spaces (organizations, groups).
- **Problem Model**: Problems reference language, type, and level settings for categorization and analytics.
- **TypeScript Interfaces**: Uses types from `@interface.ts` for strong typing and schema enforcement.
- **Utilities**: Uses helpers for argument handling and projection building.

## 📐 Data Structures

### Doc Type Constants
```typescript
export const TYPE_SYSTEM_LANGS: 7121 = 7121;
export const TYPE_LANG_SETTING: 7122 = 7122;
export const TYPE_SPACE_LANGS: 7123 = 7123;
export const TYPE_LEVEL_SETTING: 7124 = 7124;
```
- Used to distinguish document roles in the `language_setting` collection.

### System Languages Document (`SystemLangsDoc`)
Stores the default set of languages available platform-wide.
```typescript
export interface SystemLangsDoc {
    _id: ObjectId;
    docType: typeof TYPE_SYSTEM_LANGS; // 7121
    availableLangCodes: string[];
    defaultLangCodes: string[];
    langs: Array<{
        langCode: string;
        isCustom: boolean;
        langName: string;
        langTypes: LangSettingDoc['langTypes'];
    }>;
}
```
- **availableLangCodes**: All language codes available in the system.
- **defaultLangCodes**: Default language codes for new spaces.
- **langs**: Array of language definitions, each with types and tags.

### Space Languages Document (`SpaceLangsDoc`)
Tracks the language configuration for a specific space.
```typescript
export interface SpaceLangsDoc {
    _id: ObjectId;
    docType: typeof TYPE_SPACE_LANGS; // 7123
    spaceId: string;
    problemPrefix: string;
    currentLangs: string[];
    availableLangs: string[];
    customLangs: string[];
}
```
- **currentLangs**: Languages currently enabled in the space.
- **availableLangs**: Languages available to be enabled.
- **customLangs**: Custom (user-defined) language codes for the space.

### Language Setting Document (`LangSettingDoc`)
Stores detailed configuration for a specific language in a space.
```typescript
export interface LangSettingDoc {
    _id: ObjectId;
    docType: typeof TYPE_LANG_SETTING; // 7122
    spaceId: string;
    isCustom: boolean;
    langCode: string;
    langName: string;
    langTypes: Array<{
        typeId: ObjectId;
        typeCode: string; // L, S, R, W, V, G
        typeName: string;
        tags: string[];
    }>;
}
```
- **langTypes**: Each type (e.g., Listening, Speaking) can have custom tags (e.g., 'Dialogues', 'Fill in blanks').

### Level Setting Document (`LevelSettingDoc`)
Defines proficiency levels for a language, including point distributions and scoring rules per type.
```typescript
export interface LevelSettingDoc {
    _id: ObjectId;
    docType: typeof TYPE_LEVEL_SETTING; // 7124
    spaceId: string;
    targetLangId: ObjectId; // References LangSettingDoc._id
    levelName: string;
    totalPoint: number;
    requiredPoint: number;
    typePoints: Array<{
        typeId: ObjectId;
        typeName: string;
        typeCode: string;
        percentage: number;
        typePoint: {
            correct: number;
            wrong: number;
        };
    }>;
}
```
- **typePoints**: For each language type, defines its weight (percentage) and scoring for correct/wrong answers.

## ⚙️ Core Methods & Logic

All methods are static on the `LanguageModel` class.

### get
**Purpose:** Retrieve all language settings, codes, and levels for a space.
```typescript
get(spaceId: string): Promise<{ langSet: LangSettingDoc[]; langCodes: string[]; langLevel: LevelSettingDoc[] }>
```
- **Parameters:**
  - `spaceId`: Space/organization ID
- **Returns:** Object with arrays of language settings, codes, and levels
- **Example:**
```typescript
const { langSet, langCodes, langLevel } = await LanguageModel.get('space123');
```
- **Usage:** Used to initialize language settings in UI and backend.

### getMultiLangInfo
**Purpose:** List all languages for UI selection.
```typescript
getMultiLangInfo(spaceId: string): Promise<Array<{ _id: ObjectId, langName: string, langCode: string }>>
```
- **Parameters:**
  - `spaceId`: Space/organization ID
- **Returns:** Array of language IDs, names, and codes
- **Example:**
```typescript
const langs = await LanguageModel.getMultiLangInfo('space123');
```

### getLangInfo
**Purpose:** Get detailed info for a specific language.
```typescript
getLangInfo(spaceId: string, targetLangId: ObjectId): Promise<LangSettingDoc>
```
- **Parameters:**
  - `spaceId`: Space/organization ID
  - `targetLangId`: Language ObjectId
- **Returns:** The language setting document
- **Example:**
```typescript
const lang = await LanguageModel.getLangInfo('space123', langId);
```

### getAvailableLangs
**Purpose:** List available language codes for a space.
```typescript
getAvailableLangs(spaceId: string): Promise<string[]>
```
- **Parameters:**
  - `spaceId`: Space/organization ID
- **Returns:** Array of language codes

### getMultiLevelInfo
**Purpose:** List all levels for a language.
```typescript
getMultiLevelInfo(spaceId: string, targetLangId: ObjectId): Promise<Array<{ _id: ObjectId, levelName: string }>>
```
- **Parameters:**
  - `spaceId`: Space/organization ID
  - `targetLangId`: Language ObjectId
- **Returns:** Array of level IDs and names

### getLangLevel
**Purpose:** Get a specific level's configuration for a language.
```typescript
getLangLevel(spaceId: string, targetLangId: ObjectId, levelId: ObjectId): Promise<LevelSettingDoc>
```
- **Parameters:**
  - `spaceId`: Space/organization ID
  - `targetLangId`: Language ObjectId
  - `levelId`: Level ObjectId
- **Returns:** The level setting document

### initiate
**Purpose:** Initialize language system for a new space (creates system and space docs if missing).
```typescript
initiate(spaceId: string): Promise<{ langSet: LangSettingDoc[]; langCodes: string[]; langLevel: LevelSettingDoc[] }>
```
- **Parameters:**
  - `spaceId`: Space/organization ID
- **Returns:** Object with arrays of language settings, codes, and levels
- **Usage:** Called when a new space is created.

### addLang
**Purpose:** Add a new language (system or custom) to a space.
```typescript
addLang(spaceId: string, langName: string, langTypes: TypeInfo[]): Promise<LangSettingDoc>
```
- **Parameters:**
  - `spaceId`: Space/organization ID
  - `langName`: Name of the language
  - `langTypes`: Array of type definitions (see Data Structures)
- **Returns:** The new language setting document

### updateLang
**Purpose:** Update language metadata (name, code, custom flag).
```typescript
updateLang(_id: ObjectId, spaceId: string, update: Partial<{ isCustom: boolean; langCode: string; langName: string; }>): Promise<LangSettingDoc>
```
- **Parameters:**
  - `_id`: Language ObjectId
  - `spaceId`: Space/organization ID
  - `update`: Partial update object
- **Returns:** The updated language setting document

### deleteLang
**Purpose:** Remove a language and its levels from a space.
```typescript
deleteLang(spaceId: string, _id: ObjectId): Promise<void>
```
- **Parameters:**
  - `spaceId`: Space/organization ID
  - `_id`: Language ObjectId

### addType
**Purpose:** Add a new type (e.g., 'L', 'S') to a language.
```typescript
addType(_id: ObjectId, typeCode: string): Promise<LangSettingDoc>
```
- **Parameters:**
  - `_id`: Language ObjectId
  - `typeCode`: Type code (e.g., 'L' for Listening)
- **Returns:** The updated language setting document

### updateType
**Purpose:** Update a type's name, code, or tags.
```typescript
updateType(_id: ObjectId, typeId: ObjectId, update: Partial<{ typeName: string; typeCode: string; tags: string[]; }>): Promise<LangSettingDoc>
```
- **Parameters:**
  - `_id`: Language ObjectId
  - `typeId`: Type ObjectId
  - `update`: Partial update object
- **Returns:** The updated language setting document

### deleteType
**Purpose:** Remove a type from a language.
```typescript
deleteType(_id: ObjectId, typeId: ObjectId): Promise<LangSettingDoc>
```
- **Parameters:**
  - `_id`: Language ObjectId
  - `typeId`: Type ObjectId
- **Returns:** The updated language setting document

### getLevels
**Purpose:** List all levels for a language.
```typescript
getLevels(spaceId: string, targetLangId: ObjectId): Promise<LevelSettingDoc[]>
```
- **Parameters:**
  - `spaceId`: Space/organization ID
  - `targetLangId`: Language ObjectId
- **Returns:** Array of level setting documents

### addLevel
**Purpose:** Add a new level to a language.
```typescript
addLevel(spaceId: string, targetLangId: ObjectId, levelCount: number): Promise<LevelSettingDoc>
```
- **Parameters:**
  - `spaceId`: Space/organization ID
  - `targetLangId`: Language ObjectId
  - `levelCount`: Level number (for naming and scoring)
- **Returns:** The new level setting document

### updateLevel
**Purpose:** Update level configuration (name, points, type weights).
```typescript
updateLevel(spaceId: string, levelId: ObjectId, levelName: string, totalPoint: number, requiredPoint: number, percentage: { [key: string]: number }, typePoints: Array<{ typeCode: string; correct: number; wrong: number }>): Promise<any>
```
- **Parameters:**
  - `spaceId`: Space/organization ID
  - `levelId`: Level ObjectId
  - `levelName`: Name of the level
  - `totalPoint`: Total points for the level
  - `requiredPoint`: Points required to pass
  - `percentage`: Mapping of typeCode to percentage
  - `typePoints`: Array of scoring rules per type
- **Returns:** Update result

### deleteLevels
**Purpose:** Remove all levels for a language.
```typescript
deleteLevels(spaceId: string, targetLangId: ObjectId): Promise<void>
```
- **Parameters:**
  - `spaceId`: Space/organization ID
  - `targetLangId`: Language ObjectId

### getProblemTags
**Purpose:** Retrieve tags for all types in a language (for problem creation UI).
```typescript
getProblemTags(spaceId: string, targetlangId: ObjectId): Promise<Record<string, string[]>>
```
- **Parameters:**
  - `spaceId`: Space/organization ID
  - `targetlangId`: Language ObjectId
- **Returns:** Object mapping type names to tag arrays

## 🧪 Usage Patterns

- **Space Initialization:** When a new space is created, `initiate` is called to set up default languages, types, and levels.
- **Problem Authoring:** When creating a problem, language, type, and level are selected from the settings managed here.
- **UI Integration:** Language and level lists are fetched for dropdowns and filters.
- **Analytics:** Level and type data are used for progress tracking and reporting.

## 🧠 Code Review and Suggestions

- **Validation:**
  - Some methods (e.g., `addLang`, `updateLang`) have complex logic for code uniqueness and custom handling. Consider extracting validation logic for clarity and reuse.
- **Error Handling:**
  - Most methods throw descriptive errors, but some could benefit from more granular error types or user-facing messages.
- **Type Safety:**
  - The `langTypes` and `typePoints` arrays are well-typed, but some dynamic object construction (e.g., in `updateLevel`) could be further type-checked.
- **Logging:**
  - There are some `console.log` statements for debugging. Consider using a structured logger or removing these in production.
- **Indexing:**
  - Ensure MongoDB indexes are maintained for frequent queries on `spaceId`, `docType`, and `langCode`.
- **Documentation:**
  - Inline code comments are present but could be expanded for complex flows (e.g., language code collision handling).
- **Extensibility:**
  - The model is designed for extensibility, but as new language features are added, review schema changes for backward compatibility.

## 📝 File Structure

- `src/model/language.ts`: Main model logic and static methods
- `src/interface.ts`: TypeScript interfaces for all language-related documents
- `language_setting` (MongoDB collection): Stores all language, type, and level documents

## 📌 Notes / Observations

- **Design Choice:** The separation of system, space, language, and level documents enables flexible, multi-tenant language management.
- **Multi-Tenancy:** All queries are scoped by `spaceId` for robust support of multiple organizations or groups.
- **Custom vs. System Languages:** The model supports both system-defined and custom languages, with logic to prevent code collisions.
- **Tagging:** Tags are first-class citizens for each type, enabling rich filtering and UI experiences.
- **Level Logic:** Level scoring and type weighting are configurable per language, supporting adaptive learning paths.
- **Maintainability:** The codebase is modular and event-driven, but would benefit from stricter typing and more comprehensive inline documentation as features grow.

---

For further details, see the source code in `src/model/language.ts` and `src/interface.ts`.
