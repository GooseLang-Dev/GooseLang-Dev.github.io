---
title: 题目数据
sidebar_position: 3
id: question-data
---

# 题目数据结构与模型

## 📘 概述

GooseLang 的 **题目** 数据结构与模型为平台内的语言学习题目中的单个小题管理提供了健壮、可扩展的系统。每个小题代表一个具体的练习或提示（如文本、音频、选择题等），属于某个更大的题目。该模型支持多种题型、丰富的元数据，并与题目和文档系统深度集成。

模型设计目标：
- 存储与检索小题定义及元数据
- 支持多种题型（文本、音频、书法、匹配、多选）
- 支持本地化与灵活内容结构
- 与题目、用户提交和进度追踪紧密集成

## 📁 文件结构

- `src/model/question.ts`：`QuestionModel` 类的主要实现，提供小题管理的核心逻辑，包括增删改查和业务规则。
- `src/interface.ts`：所有小题相关文档和数据结构的 TypeScript 接口与类型定义。
- `docs/data-structure/question-data.md`：本数据模型及用法说明文档。

## 📄 小题数据结构

### 文档类型常量

```typescript
export const TYPE_QUESTION = 20; // 小题文档类型
```

### 小题文档（`QuestionDoc` 及变体）

表示系统中的单个小题，包含所有相关元数据和内容。系统支持多种题型，每种类型有其独特结构。

#### 基础接口

```typescript
export interface QuestionBaseDoc {
    _id: ObjectId;
    onwer: number; // 小题所有者uid
    docId: number;
    spaceId: string;
    parentType: number;
    parentId: ObjectId | number | string;
    docType: typeof TYPE_QUESTION;
    content?: LocalizedContent; // 小题标题
    instruciton?: LocalizedContent; // 小题说明
    isManualJudge?: boolean;
    hasAbsoluteAnswer?: boolean;
}
```

#### 小题类型变体

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

// 所有题型的联合类型
export type QuestionDoc =
    | TextQuestionDoc
    | AudioQuestionDoc
    | CalligraphyQuestionDoc
    | MatchQuestionDoc
    | MultiQuestionDoc;
```

#### 关键字段
- **type**：题型（text, audio, calligraphy, match, multi）
- **content**：本地化小题提示/标题
- **instruciton**：本地化说明（可选）
- **answer/shortAnswer/longAnswer/options**：题型特有的答案字段
- **parentType/parentId**：关联父题目
- **isManualJudge/hasAbsoluteAnswer**：判题与答案逻辑标记

#### 相关类型
- `LocalizedContent`：多语言内容（如 `{ en: "...", zh: "..." }`）
- `ObjectId`：MongoDB 对象标识符

## 📦 小题模型与逻辑

`QuestionModel` 类（位于 `model/question.ts`）提供小题管理的全部业务逻辑。主要职责包括：

- **增删改查**：添加、编辑、删除与检索小题
- **类型处理**：支持多种题型与灵活内容
- **集成性**：与题目、用户提交和文档系统深度集成

### 核心方法与逻辑（QuestionModel）

- **get(spaceId, qid)**：通过 ObjectId 获取小题
- **getList(spaceId, parentId, projection?)**：获取某题目的所有小题
- **getMulti(spaceId, projection?)**：获取空间内所有小题
- **add(spaceId, problemDocId, owner)**：为题目创建新小题
- **edit(spaceId, docId, $set)**：更新小题字段
- **del(spaceId, qid)**：通过 ObjectId 删除小题

所有方法均与 `document` MongoDB 集合交互，通过 `docType` 字段区分文档角色。

## 📝 小题提交与进度流程

1. **题目作者添加小题**：创建小题并关联到题目。
2. **用户作答小题**：小题作为题目的一部分展示，用户提交答案。
3. **答案评判**：根据题型和标记，答案可自动判分或需人工审核。
4. **进度追踪**：用户提交与得分在题目和小题层面被追踪。

## 📌 备注 / 观察

- **可扩展性**：模型支持通过接口扩展新题型
- **本地化**：所有面向用户的内容（提示、说明）均通过 `LocalizedContent` 实现本地化
- **父级关联**：每个小题都关联父题目，便于上下文与聚合
- **判题逻辑**：支持自动与人工判题，以及绝对答案校验
- **集成性**：小题模型与题目、文档、用户进度系统深度集成
- **错误处理**：大多数方法在数据缺失或无效时抛出描述性错误，便于调试与健壮性

## 💡 用法示例

```typescript
// 为题目添加新文本小题
await QuestionModel.add('space123', 101, 1); // spaceId, problemDocId, owner

// 获取题目的所有小题
const questions = await QuestionModel.getList('space123', 101);

// 编辑小题内容
await QuestionModel.edit('space123', 5, { content: { en: 'What is your name?' } });

// 删除小题
await QuestionModel.del('space123', new ObjectId('...'));
```

---

如需更多细节，请参见 `src/model/question.ts` 和 `src/interface.ts` 源码。
