---
title: 答题记录
sidebar_position: 4
id: problem-records
---

# 答题记录数据结构与模型

## 📘 概述

GooseLang 的 **答题记录**模块负责跟踪、存储和管理所有用户对语言学习问题的提交（尝试）。每条记录都捕捉用户的一次作答，包括时间、得分和评测结果。该模块对于分析、进度追踪、重判（rejudging）以及排行榜/统计等功能至关重要，是用户答题活动的历史账本，支持个体与汇总报告。

> **注意：** 本模块中的评测与任务队列逻辑尚未完善，需进一步开发以实现健壮、可用于生产环境的评测流程。详见“代码审查与建议”部分。

## 🔗 依赖关系

- **MongoDB**：所有记录持久化于 `record` 和 `record.stat` 集合中。
- **Problem Model**（`problem.ts`）：每条记录关联到具体问题。
- **User Model**：每条记录关联到具体用户。
- **Contest/Task System**：与竞赛逻辑及评测任务队列集成（当前未完善）。
- **Space Model**：支持多租户（空间）。
- **Event Bus**：监听事件（问题/空间删除、评测等）以维护数据完整性。
- **工具函数**：用于时间、投影构建和参数处理的辅助函数。

## 📐 数据结构

### 记录文档（`RecordDoc`）
表示用户对某问题的单次提交。

```typescript
export interface RecordDoc {
    _id: ObjectId;                // 唯一记录ID
    spaceId: string;              // 空间/组织标识符
    pid: number;                  // 问题ID
    uid: number;                  // 用户ID
    score: number;                // 本次尝试的最终得分
    pcid?: ObjectId;              // （可选）竞赛/问题集ID
    time?: number;                // 本次尝试用时（毫秒）
    startAt?: Array<Date>;        // 进度追踪的开始时间戳
    endAt?: Array<Date>;          // 进度追踪的结束时间戳
    isJudged?: number;            // 评测状态：-1（未评测）、0（部分）、1（已评测）
    questionRecod?: any[];        // 小题级别的提交详情（结构灵活，未来建议标准化）
}
```

#### 字段说明
- **_id**：MongoDB ObjectId，每次提交唯一
- **spaceId**：支持多租户，所有查询均按空间隔离
- **pid**：关联被尝试的问题
- **uid**：提交的用户
- **score**：本次尝试的得分（评测后）
- **pcid**：用于竞赛或问题集场景
- **time/startAt/endAt**：用于分析、时间追踪与进度可视化
- **isJudged**：评测状态，UI与分析重要字段
- **questionRecod**：存储小题详情（答案、得分等），当前类型宽松，建议未来标准化以便分析

### 记录统计文档（`RecordStatDoc`）
汇总用户对某问题的尝试统计。

```typescript
export interface RecordStatDoc {
    _id: ObjectId;
    spaceId: string;
    pid: number;
    uid: number;
    time: number;
    score: number;
}
```
- 用于排行榜、分析和用户表现的高效查询。

## ⚙️ 核心方法与逻辑

所有方法均为 `RecordModel` 类的静态方法。

### add
**用途：** 创建用户一次新尝试的记录。

**签名：**
```typescript
add(spaceId: string, pid: number, uid: number, startAt: Date, pcid?: ObjectId): Promise<ObjectId>
```
- **参数：**
  - `spaceId`：空间/组织ID
  - `pid`：问题ID
  - `uid`：用户ID
  - `startAt`：尝试开始时间
  - `pcid`：（可选）竞赛/问题集ID
- **返回：** 新建记录的 ObjectId
- **示例：**
```typescript
const recordId = await RecordModel.add('space123', 101, 42, new Date());
```
- **用法：** 用户开始新尝试时调用。

### get
**用途：** 通过 ObjectId（可选空间范围）获取记录。

**签名：**
```typescript
get(_id: ObjectId): Promise<RecordDoc | null>
get(spaceId: string, _id: ObjectId): Promise<RecordDoc | null>
```
- **参数：**
  - `_id`：记录 ObjectId
  - `spaceId`：（可选）空间ID
- **返回：** 匹配的 `RecordDoc` 或 `null`
- **示例：**
```typescript
const record = await RecordModel.get('space123', recordId);
```
- **用法：** 用于分析、UI与评测流程。

### getMulti
**用途：** 按查询条件获取多条记录。

**签名：**
```typescript
getMulti(spaceId: string, query: any, options?: FindOptions): FindCursor<RecordDoc>
```
- **参数：**
  - `spaceId`：空间ID
  - `query`：MongoDB 查询对象
  - `options`：（可选）MongoDB 查询选项
- **返回：** 匹配记录的 MongoDB 游标
- **示例：**
```typescript
const cursor = RecordModel.getMulti('space123', { pid: 101 });
const records = await cursor.toArray();
```
- **用法：** 批量分析、报表与管理工具。

### update
**用途：** 更新记录字段（支持 $set, $push, $unset, $inc）。

**签名：**
```typescript
update(spaceId: string, _id: MaybeArray<ObjectId>, $set?, $push?, $unset?, $inc?): Promise<RecordDoc | null>
```
- **参数：**
  - `spaceId`：空间ID
  - `_id`：单个或数组 ObjectId
  - `$set`, `$push`, `$unset`, `$inc`：MongoDB 更新操作符
- **返回：** 更新后的 `RecordDoc` 或 `null`
- **示例：**
```typescript
await RecordModel.update('space123', recordId, { score: 100, isJudged: 1 });
```
- **用法：** 评测后、进度更新或管理修正时调用。

### updateMulti
**用途：** 批量更新匹配条件的多条记录。

**签名：**
```typescript
updateMulti(spaceId: string, $match: Filter<RecordDoc>, $set?, $push?, $unset?): Promise<number>
```
- **参数：**
  - `spaceId`：空间ID
  - `$match`：MongoDB 过滤条件
  - `$set`, `$push`, `$unset`：MongoDB 更新操作符
- **返回：** 修改的记录数
- **示例：**
```typescript
await RecordModel.updateMulti('space123', { pid: 101 }, { score: 0 });
```
- **用法：** 批量修正、竞赛重置或分析。

### reset
**用途：** 重置记录以便重判（清空分数、状态等）。

**签名：**
```typescript
reset(spaceId: string, rid: MaybeArray<ObjectId>, isRejudge: boolean): Promise<RecordDoc | null>
```
- **参数：**
  - `spaceId`：空间ID
  - `rid`：单个或数组 ObjectId
  - `isRejudge`：是否为重判操作
- **返回：** 更新后的 `RecordDoc` 或 `null`
- **示例：**
```typescript
await RecordModel.reset('space123', recordId, true);
```
- **用法：** 答题重判或测试数据变更时调用。

### judge
**用途：** 将记录加入评测队列（与任务系统集成）。

**签名：**
```typescript
judge(spaceId: string, rids: MaybeArray<ObjectId> | RecordDoc, priority = 0, config = {}, meta = {}): Promise<any>
```
- **参数：**
  - `spaceId`：空间ID
  - `rids`：记录 ObjectId 或 RecordDoc
  - `priority`：（可选）评测优先级
  - `config`：（可选）问题配置覆盖
  - `meta`：（可选）评测元数据
- **返回：** 任务队列操作结果（当前未完善）
- **示例：**
```typescript
await RecordModel.judge('space123', recordId);
```
- **用法：** 提交后触发评测。
- **警告：** 评测/任务逻辑未完善，生产环境下可能无法正常工作。

### stat
**用途：** 按不同时间窗口聚合提交统计。

**签名：**
```typescript
stat(spaceId?: string): Promise<{ d5min, d1h, day, week, month, year, total }>
```
- **参数：**
  - `spaceId`：（可选）空间ID
- **返回：** 各时间窗口的统计对象
- **示例：**
```typescript
const stats = await RecordModel.stat('space123');
```
- **用法：** 用于仪表盘、分析与报表。

### getList
**用途：** 按ID批量获取记录。

**签名：**
```typescript
getList(spaceId: string, rids: ObjectId[], fields?: (keyof RecordDoc)[]): Promise<Record<string, Partial<RecordDoc>>>
```
- **参数：**
  - `spaceId`：空间ID
  - `rids`：ObjectId 数组
  - `fields`：（可选）需投影的字段
- **返回：** 记录ID到部分 RecordDoc 的映射
- **示例：**
```typescript
const records = await RecordModel.getList('space123', [recordId1, recordId2]);
```
- **用法：** 批量报表、管理工具与分析。

### count
**用途：** 统计匹配条件的记录数。

**签名：**
```typescript
count(spaceId: string, query: any): Promise<number>
```
- **参数：**
  - `spaceId`：空间ID
  - `query`：MongoDB 查询
- **返回：** 匹配记录数
- **示例：**
```typescript
const n = await RecordModel.count('space123', { pid: 101 });
```
- **用法：** 用于分析、仪表盘与进度追踪。

## 🧪 使用模式

- **提交流程：** 用户提交答案时，先调用 `add` 创建记录，再调用 `judge` 加入评测队列，评测后用 `update` 存储结果。
- **分析统计：** `stat`、`getMulti` 和 `count` 用于仪表盘和报表。
- **重判：** 问题或测试数据变更时用 `reset` 和 `judge`。
- **清理：** 事件监听确保问题或空间删除时相关记录被清理。

## 🧠 代码审查与建议

- **评测/任务逻辑未完善：**
  - 评测与任务队列逻辑尚未实现完备。`judge` 方法及相关任务集成需大幅开发，以支持健壮、异步的评测与结果处理。这是后续开发的关键。
- **questionRecod 字段：**
  - 目前类型为 `any[]`，不利于类型安全与分析。**建议：** 明确小题详情的结构/接口，便于后续分析与UI功能。
- **错误处理：**
  - 部分方法可加强显式错误处理与校验，尤其是部分更新和边界情况。
- **死代码/遗留：**
  - 无明显死代码，但部分 TODO 和注释提示未来可增强（如弃用某些配置模式）。
- **索引优化：**
  - 常用查询已建索引，后续如分析需求增长，建议定期审查索引覆盖。
- **事件处理：**
  - 事件驱动清理较为健壮，新增功能时需确保触发相应事件以维护数据完整性。
- **文档完善：**
  - 局部代码注释较少，复杂逻辑建议补充 docstring。

## 📝 文件结构

- `src/model/record.ts`：主要模型逻辑与事件监听
- `src/interface.ts`：`RecordDoc`、`RecordStatDoc` 及相关类型的 TypeScript 接口
- `record.stat`（MongoDB 集合）：存储汇总统计
- `record`（MongoDB 集合）：存储所有提交记录

## 📌 备注 / 观察

- **设计选择：** `RecordDoc` 与 `RecordStatDoc` 的分离实现了明细与汇总分析的兼容。
- **可扩展性：** 模型为未来分析与报表设计，但建议标准化灵活字段（如 `questionRecod`）。
- **集成性：** 模块与问题、竞赛、用户系统深度耦合，事件驱动保障数据完整性。
- **多租户支持：** 所有查询均以 `spaceId` 为范围，支持稳健的多租户。
- **性能：** 已采用索引与批量操作提升效率，建议随使用模式演化定期优化。
- **可维护性：** 代码库模块化、事件驱动，建议加强类型约束与内联文档。
- **关键 TODO：** 评测/任务队列逻辑需完善并充分测试，方可用于生产环境评测流程。

---

如需更多细节，请参见 `src/model/record.ts` 和 `src/interface.ts` 源码。
