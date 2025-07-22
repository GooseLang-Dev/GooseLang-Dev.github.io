---
title: 问题数据
sidebar_position: 2
id: problem-data
---

# 问题数据结构与模型

## 📘 概述

GooseLang 的 **问题** 数据结构与模型为平台内的语言学习问题（练习）管理提供了灵活、可扩展的系统。该系统支持问题的创建、存储与管理，包括其元数据、内容、文件及用户进度追踪。问题与语言设置、用户管理和文档系统紧密集成，支持多样化的学习场景与分析。

该模型设计目标：
- 存储与检索问题定义、元数据及多语言内容
- 管理问题文件（素材、题干、附加资源）
- 跟踪用户提交、得分与进度
- 支持本地化、标签与引用关系
- 实现细粒度的访问控制与可扩展性

## 📁 文件结构

- `src/model/problem.ts`：`ProblemModel` 类的主要实现，提供问题管理的核心逻辑，包括增删改查、文件处理和业务规则。
- `src/interface.ts`：所有问题相关文档和数据结构的 TypeScript 接口与类型定义。
- `docs/data-structure/problem-data.md`：本数据模型及用法说明文档。

## 📄 问题数据结构

### 文档类型常量

```typescript
export const TYPE_PROBLEM = 10; // 问题文档类型
```

### 问题文档（`ProblemDoc`）

表示系统中的单个问题（练习），包含所有相关元数据、内容和文件。

```typescript
export interface ProblemDoc extends Document {
    docType: typeof TYPE_PROBLEM; // 10
    pid: string; // 问题标识符（用户自定义或自动生成）
    spaceId: string;
    docId: number; // 自动生成的唯一ID
    Owner: number;
    langData: {
        targetLangId: ObjectId;
        isTargetLangCustom: boolean;
        typeId: ObjectId; // 问题类型（如听力、口语）
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

#### 关键字段
- **pid**：问题标识符（如 'EN-L#321'），可自定义或自动生成
- **langData**：问题的语言、类型与等级引用
- **tag**：用于筛选和分类的标签数组
- **MaterialFile / AdditionalFile / QuestionFile**：附加资源的文件元数据数组
- **description / title**：用于界面显示的本地化内容
- **reference**：可选，引用其他问题（用于派生/关联题）
- **isHidden**：控制问题可见性

#### 相关类型
- `FileInfo`：文件元数据（名称、大小、etag、lastModified 等）
- `LocalizedContent`：多语言内容（如 `{ en: "...", zh: "..." }`）
- `ObjectId`：MongoDB 对象标识符
- `Document`：基础文档字段（来自 `@interface.ts`）

### 问题状态文档（`ProblemStatusDoc`）

跟踪用户针对某问题的进度、得分与状态。

```typescript
export interface ProblemStatusDoc extends StatusDocBase {
    docId: number;
    docType: 10;
    highestRid?: ObjectId;
    currentRid?: ObjectId;
    qid?: ObjectId;
    star?: boolean;
    status?: number; // 0: 未开始/已完成, 1: 进行中
    score?: number; // 最高分
    avgScore?: number; // 平均分
    tries?: number; // 尝试次数
}
```

### 提交记录文档（`RecordDoc`）

存储用户针对某问题的单次提交记录。

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

## 📦 问题模型与逻辑

`ProblemModel` 类（位于 `model/problem.ts`）提供问题管理的全部业务逻辑。主要职责包括：

- **增删改查**：添加、编辑、删除与检索问题
- **文件管理**：附加、重命名与删除文件（素材、题干等）
- **状态追踪**：跟踪用户进度、提交与得分
- **引用处理**：支持问题间的引用（如派生或关联题）
- **本地化与标签**：支持多语言内容与灵活标签
- **访问控制**：校验用户对问题的访问权限

### 核心方法与逻辑（ProblemModel）

- **add(spaceId, pid, title, description, owner, tag, isHidden, langData, reference)**：创建新问题
- **addWithId(...)**：以指定 docId 创建新问题
- **get(spaceId, pid, projection?)**：按ID或PID检索问题
- **getMulti(spaceId, query, projection?)**：按查询条件检索多个问题
- **edit(spaceId, _id, $set)**：更新问题字段
- **del(spaceId, docId)**：删除问题及相关文件/状态
- **addFile(spaceId, docId, type, file, name, ...)**：为问题附加文件
- **delFile(spaceId, docId, type, name, ...)**：移除问题文件
- **renameFile(spaceId, docId, file, newName, ...)**：重命名问题文件
- **getStatus(spaceId, docId, uid)**：获取用户针对问题的状态
- **updateStatus(spaceId, pid, uid, args)**：更新用户状态
- **incStatus(spaceId, pid, uid, key, count)**：递增状态字段
- **canViewBy(pdoc, udoc)**：校验用户是否可查看问题

所有方法均与 `document` MongoDB 集合交互，通过 `docType` 字段区分文档角色。

## 📝 问题提交与进度流程

1. **用户提交答案**：用户提交问题答案。
2. **记录创建**：生成 `RecordDoc`，存储提交内容、时间与得分。
3. **状态更新**：用户的 `ProblemStatusDoc` 更新分数、尝试次数与进度。
4. **问题聚合**：问题层面的统计（`nSubmit`、`avgScore` 等）被更新。
5. **文件管理**：如问题包含文件（音频、文本等），通过文件方法进行管理。

## 📌 备注 / 观察

- **可扩展性**：模型支持自定义语言类型、等级与灵活标签
- **本地化**：所有面向用户的内容（标题、描述）均通过 `LocalizedContent` 实现本地化
- **引用问题**：问题可引用其他题，支持派生或关联练习
- **文件管理**：问题可关联多个文件，均有元数据追踪
- **状态与进度**：内建细粒度的用户进度与得分追踪
- **集成性**：问题模型与文档系统、用户管理、语言设置深度集成
- **错误处理**：大多数方法在数据缺失或无效时抛出描述性错误，便于调试与健壮性

## 💡 用法示例

```typescript
// 创建新问题
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
    {} // reference (可选)
);

// 附加素材文件
await ProblemModel.addFile('space123', 123, 'MaterialFile', fileBuffer, 'audio.mp3');

// 通过PID获取问题
const problem = await ProblemModel.get('space123', 'EN-L#321');

// 更新问题标签
await ProblemModel.edit('space123', 123, { tag: ['listening', 'advanced'] });

// 跟踪用户进度
await ProblemModel.updateStatus('space123', 123, 42, { score: 95, status: 1 });
```

---

如需更多细节，请参见 `src/model/problem.ts` 和 `src/interface.ts` 源码。
