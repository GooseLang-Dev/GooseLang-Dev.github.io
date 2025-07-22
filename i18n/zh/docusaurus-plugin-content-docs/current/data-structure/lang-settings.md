---
title: 语言设置
sidebar_position: 1
id: lang-settings
---

# 语言数据结构与模型

## 📘 概述

**语言设置**模块在GooseLang中管理所有与语言相关的配置、元数据和逻辑。它支持系统范围和每个空间（组织）级别的语言管理，包括语言类型（如听力、口语）、熟练度等级和自定义标签。该模块是支持多语言内容、自适应学习和跨不同学习场景的细粒度进度追踪的基础。

## 🔗 依赖关系

- **MongoDB**：所有语言设置存储于 `language_setting` 集合中。
- **Space Model**：将语言设置与特定空间（组织、群组）关联。
- **Problem Model**：题目通过语言、类型和等级设置进行分类和分析。
- **TypeScript 接口**：使用 `@interface.ts` 中的类型进行强类型和模式约束。
- **工具函数**：用于参数处理和投影构建的辅助函数。

## 📐 数据结构

### 文档类型常量
```typescript
export const TYPE_SYSTEM_LANGS: 7121 = 7121;
export const TYPE_LANG_SETTING: 7122 = 7122;
export const TYPE_SPACE_LANGS: 7123 = 7123;
export const TYPE_LEVEL_SETTING: 7124 = 7124;
```
- 用于区分 `language_setting` 集合中文档的角色。

### 系统语言文档（`SystemLangsDoc`）
存储平台范围内可用的默认语言集。
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
- **availableLangCodes**：系统中所有可用的语言代码。
- **defaultLangCodes**：新空间的默认语言代码。
- **langs**：语言定义数组，每个包含类型和标签。

### 空间语言文档（`SpaceLangsDoc`）
跟踪特定空间的语言配置。
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
- **currentLangs**：当前空间已启用的语言。
- **availableLangs**：可供启用的语言。
- **customLangs**：空间自定义（用户定义）的语言代码。

### 语言设置文档（`LangSettingDoc`）
存储空间中某一具体语言的详细配置。
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
- **langTypes**：每种类型（如听力、口语）可拥有自定义标签（如“对话”、“填空”）。

### 等级设置文档（`LevelSettingDoc`）
定义某语言的熟练度等级，包括每种类型的分值分配和评分规则。
```typescript
export interface LevelSettingDoc {
    _id: ObjectId;
    docType: typeof TYPE_LEVEL_SETTING; // 7124
    spaceId: string;
    targetLangId: ObjectId; // 引用 LangSettingDoc._id
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
- **typePoints**：为每种语言类型定义其权重（百分比）及正确/错误的得分。

## ⚙️ 核心方法与逻辑

所有方法均为 `LanguageModel` 类的静态方法。

### get
**用途：** 获取某空间的所有语言设置、代码和等级。
```typescript
get(spaceId: string): Promise<{ langSet: LangSettingDoc[]; langCodes: string[]; langLevel: LevelSettingDoc[] }>
```
- **参数：**
  - `spaceId`：空间/组织ID
- **返回：** 包含语言设置、代码和等级的对象
- **示例：**
```typescript
const { langSet, langCodes, langLevel } = await LanguageModel.get('space123');
```
- **用法：** 用于UI和后端初始化语言设置。

### getMultiLangInfo
**用途：** 列出所有语言供UI选择。
```typescript
getMultiLangInfo(spaceId: string): Promise<Array<{ _id: ObjectId, langName: string, langCode: string }>>
```
- **参数：**
  - `spaceId`：空间/组织ID
- **返回：** 语言ID、名称和代码的数组
- **示例：**
```typescript
const langs = await LanguageModel.getMultiLangInfo('space123');
```

### getLangInfo
**用途：** 获取某一具体语言的详细信息。
```typescript
getLangInfo(spaceId: string, targetLangId: ObjectId): Promise<LangSettingDoc>
```
- **参数：**
  - `spaceId`：空间/组织ID
  - `targetLangId`：语言ObjectId
- **返回：** 该语言的设置文档
- **示例：**
```typescript
const lang = await LanguageModel.getLangInfo('space123', langId);
```

### getAvailableLangs
**用途：** 列出空间可用的语言代码。
```typescript
getAvailableLangs(spaceId: string): Promise<string[]>
```
- **参数：**
  - `spaceId`：空间/组织ID
- **返回：** 语言代码数组

### getMultiLevelInfo
**用途：** 列出某语言的所有等级。
```typescript
getMultiLevelInfo(spaceId: string, targetLangId: ObjectId): Promise<Array<{ _id: ObjectId, levelName: string }>>
```
- **参数：**
  - `spaceId`：空间/组织ID
  - `targetLangId`：语言ObjectId
- **返回：** 等级ID和名称的数组

### getLangLevel
**用途：** 获取某语言的具体等级配置。
```typescript
getLangLevel(spaceId: string, targetLangId: ObjectId, levelId: ObjectId): Promise<LevelSettingDoc>
```
- **参数：**
  - `spaceId`：空间/组织ID
  - `targetLangId`：语言ObjectId
  - `levelId`：等级ObjectId
- **返回：** 等级设置文档

### initiate
**用途：** 为新空间初始化语言系统（如缺失则创建系统和空间文档）。
```typescript
initiate(spaceId: string): Promise<{ langSet: LangSettingDoc[]; langCodes: string[]; langLevel: LevelSettingDoc[] }>
```
- **参数：**
  - `spaceId`：空间/组织ID
- **返回：** 包含语言设置、代码和等级的对象
- **用法：** 新建空间时调用。

### addLang
**用途：** 向空间添加新语言（系统或自定义）。
```typescript
addLang(spaceId: string, langName: string, langTypes: TypeInfo[]): Promise<LangSettingDoc>
```
- **参数：**
  - `spaceId`：空间/组织ID
  - `langName`：语言名称
  - `langTypes`：类型定义数组（见数据结构）
- **返回：** 新语言设置文档

### updateLang
**用途：** 更新语言元数据（名称、代码、自定义标记）。
```typescript
updateLang(_id: ObjectId, spaceId: string, update: Partial<{ isCustom: boolean; langCode: string; langName: string; }>): Promise<LangSettingDoc>
```
- **参数：**
  - `_id`：语言ObjectId
  - `spaceId`：空间/组织ID
  - `update`：部分更新对象
- **返回：** 更新后的语言设置文档

### deleteLang
**用途：** 从空间移除某语言及其等级。
```typescript
deleteLang(spaceId: string, _id: ObjectId): Promise<void>
```
- **参数：**
  - `spaceId`：空间/组织ID
  - `_id`：语言ObjectId

### addType
**用途：** 向语言添加新类型（如“L”、“S”）。
```typescript
addType(_id: ObjectId, typeCode: string): Promise<LangSettingDoc>
```
- **参数：**
  - `_id`：语言ObjectId
  - `typeCode`：类型代码（如“L”代表听力）
- **返回：** 更新后的语言设置文档

### updateType
**用途：** 更新类型名称、代码或标签。
```typescript
updateType(_id: ObjectId, typeId: ObjectId, update: Partial<{ typeName: string; typeCode: string; tags: string[]; }>): Promise<LangSettingDoc>
```
- **参数：**
  - `_id`：语言ObjectId
  - `typeId`：类型ObjectId
  - `update`：部分更新对象
- **返回：** 更新后的语言设置文档

### deleteType
**用途：** 从语言中移除某类型。
```typescript
deleteType(_id: ObjectId, typeId: ObjectId): Promise<LangSettingDoc>
```
- **参数：**
  - `_id`：语言ObjectId
  - `typeId`：类型ObjectId
- **返回：** 更新后的语言设置文档

### getLevels
**用途：** 列出某语言的所有等级。
```typescript
getLevels(spaceId: string, targetLangId: ObjectId): Promise<LevelSettingDoc[]>
```
- **参数：**
  - `spaceId`：空间/组织ID
  - `targetLangId`：语言ObjectId
- **返回：** 等级设置文档数组

### addLevel
**用途：** 向语言添加新等级。
```typescript
addLevel(spaceId: string, targetLangId: ObjectId, levelCount: number): Promise<LevelSettingDoc>
```
- **参数：**
  - `spaceId`：空间/组织ID
  - `targetLangId`：语言ObjectId
  - `levelCount`：等级编号（用于命名和评分）
- **返回：** 新等级设置文档

### updateLevel
**用途：** 更新等级配置（名称、分值、类型权重）。
```typescript
updateLevel(spaceId: string, levelId: ObjectId, levelName: string, totalPoint: number, requiredPoint: number, percentage: { [key: string]: number }, typePoints: Array<{ typeCode: string; correct: number; wrong: number }>): Promise<any>
```
- **参数：**
  - `spaceId`：空间/组织ID
  - `levelId`：等级ObjectId
  - `levelName`：等级名称
  - `totalPoint`：该等级总分
  - `requiredPoint`：通过所需分数
  - `percentage`：类型代码到百分比的映射
  - `typePoints`：每种类型的评分规则数组
- **返回：** 更新结果

### deleteLevels
**用途：** 移除某语言的所有等级。
```typescript
deleteLevels(spaceId: string, targetLangId: ObjectId): Promise<void>
```
- **参数：**
  - `spaceId`：空间/组织ID
  - `targetLangId`：语言ObjectId

### getProblemTags
**用途：** 获取某语言所有类型的标签（用于题目创建UI）。
```typescript
getProblemTags(spaceId: string, targetlangId: ObjectId): Promise<Record<string, string[]>>
```
- **参数：**
  - `spaceId`：空间/组织ID
  - `targetlangId`：语言ObjectId
- **返回：** 类型名称到标签数组的映射对象

## 🧪 使用模式

- **空间初始化：** 新建空间时调用 `initiate`，以设置默认语言、类型和等级。
- **题目创作：** 创建题目时，从此处管理的设置中选择语言、类型和等级。
- **UI集成：** 获取语言和等级列表用于下拉菜单和筛选。
- **分析统计：** 等级和类型数据用于进度追踪和报告。

## 🧠 代码审查与建议

- **校验：**
  - 部分方法（如 `addLang`、`updateLang`）包含复杂的代码唯一性和自定义处理逻辑。建议将校验逻辑提取出来以便复用和提升清晰度。
- **错误处理：**
  - 大多数方法会抛出描述性错误，但部分可细化为更具体的错误类型或面向用户的提示。
- **类型安全：**
  - `langTypes` 和 `typePoints` 数组类型良好，但部分动态对象构建（如 `updateLevel`）可进一步类型检查。
- **日志记录：**
  - 存在部分 `console.log` 用于调试。建议生产环境使用结构化日志或移除。
- **索引优化：**
  - 确保MongoDB在 `spaceId`、`docType` 和 `langCode` 上维护索引以优化频繁查询。
- **文档完善：**
  - 已有内联注释，但对于复杂流程（如语言代码冲突处理）可进一步补充。
- **可扩展性：**
  - 模型设计具备良好扩展性，但新增语言特性时需关注模式变更的兼容性。

## 📝 文件结构

- `src/model/language.ts`：主要模型逻辑与静态方法
- `src/interface.ts`：所有语言相关文档的TypeScript接口
- `language_setting`（MongoDB集合）：存储所有语言、类型和等级文档

## 📌 备注 / 观察

- **设计选择：** 系统、空间、语言和等级文档的分离实现了灵活的多租户语言管理。
- **多租户支持：** 所有查询均以 `spaceId` 为范围，支持多个组织或群组的稳健管理。
- **自定义与系统语言：** 支持系统定义和自定义语言，并有防止代码冲突的逻辑。
- **标签机制：** 标签作为每种类型的一等公民，便于丰富的筛选和UI体验。
- **等级逻辑：** 等级评分和类型权重可按语言配置，支持自适应学习路径。
- **可维护性：** 代码库模块化、事件驱动，但随着功能增长建议加强类型约束和内联文档。

---

如需更多细节，请参见 `src/model/language.ts` 和 `src/interface.ts` 源码。