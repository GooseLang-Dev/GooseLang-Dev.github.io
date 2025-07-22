---
title: 任务数据
sidebar_position: 5
id: task-data
---

# 任务数据结构与模型

## 📘 概述

GooseLang 的 **任务**模块为平台提供了健壮、可扩展的后台与异步操作管理系统。它作为通用任务队列与事件系统，支持后台处理、分布式事件广播和定时任务等功能。该模块对于将耗时或资源密集型操作（如评测、翻译、合成、清理）与用户流程解耦，实现可扩展、可靠的后端工作流至关重要。

任务系统设计目标：
- 在 MongoDB 中存储和管理排队任务
- 支持优先级、并发与分布式任务消费
- 实现事件驱动工作流与跨进程通信
- 与其他模型集成（如评测、翻译、合成）
- 为未来的工作流编排与调度提供基础

## 🔗 依赖关系

- **MongoDB**：所有任务与事件持久化于 `task` 和 `event` 集合中。
- **Event Bus**（`bus`）：用于进程内及跨进程事件处理。
- **Logger**：结构化日志与调试。
- **Context**：应用生命周期钩子与事件注册。
- **nanoid/os**：唯一进程与任务标识。
- **@gooselang/utils**：工具函数（如 sleep）。
- **其他模型**：与评测、翻译等异步工作流集成。

## 📐 数据结构

### 任务文档（`Task`）
表示需异步处理的单元任务。

```typescript
export interface Task {
    _id: ObjectId;         // 唯一任务ID
    type: string;          // 任务类型（如 'judge', 'translate', 'synthesize'）
    subType?: string;      // 可选子类型，进一步细分
    priority: number;      // 任务优先级（越高越先处理）
    [key: string]: any;    // 任务特有的其他字段
}
```

#### 字段说明
- **_id**：MongoDB ObjectId，每个任务唯一
- **type**：任务主类别（如 'judge', 'translate'）
- **subType**：可选子类别，便于更细粒度区分
- **priority**：决定处理顺序，值越高优先级越高
- **[key: string]: any**：任务特有的载荷（如记录ID、配置、元数据等）

### 事件文档（`EventDoc`）
表示分布式工作流中的跨进程/服务事件。

```typescript
export interface EventDoc {
    ack: string[];         // 已确认该事件的进程ID列表
    event: number | string;// 事件名称或代码
    payload: string;       // 序列化事件载荷（JSON）
    expire: Date;          // 事件过期时间
    trace?: string;        // 可选追踪/调试信息
}
```

#### 字段说明
- **ack**：已处理该事件的进程ID数组（用于去重）
- **event**：事件类型或名称
- **payload**：JSON 序列化的事件数据
- **expire**：事件过期后可清理
- **trace**：可选追踪/调试信息

### 定时任务文档（`Schedule`）
表示定时或延迟执行的任务。

```typescript
export interface Schedule {
    _id: ObjectId;         // 唯一定时任务ID
    type: string;          // 任务类型
    subType?: string;      // 可选子类型
    executeAfter: Date;    // 任务应执行的时间
    [key: string]: any;    // 其他字段
}
```

#### 字段说明
- **_id**：MongoDB ObjectId，每个定时任务唯一
- **type**：定时任务主类别
- **subType**：可选子类别
- **executeAfter**：应执行时间点
- **[key: string]: any**：定时任务特有的载荷

### 任务状态常量

```typescript
export const TASK_STATUS = {
    STATUS_WAITING: 0,
    STATUS_FETCHED: 1,
    STATUS_PROCESSING: 2, // 用于翻译和合成处理中
    STATUS_COMPLETED: 3,
    STATUS_ERROR: 4,
    STATUS_SYSTEM_ERROR: 5
};
```

## ⚙️ 核心方法与逻辑

所有方法均为 `TaskModel` 类的静态方法，除非另有说明。

### add
**用途：** 向队列添加新任务。

**签名：**
```typescript
add(task: Partial<Task> & { type: string }): Promise<ObjectId>
```
- **参数：**
  - `task`：部分任务对象（必须包含 `type`）
- **返回：** 新建任务的 ObjectId
- **示例：**
```typescript
const taskId = await TaskModel.add({ type: 'judge', priority: 10, rid: '...' });
```
- **用法：** 需后台作业时调用（如用户提交后）。

### addMany
**用途：** 批量添加任务。

**签名：**
```typescript
addMany(tasks: Task[]): Promise<ObjectId[]>
```
- **参数：**
  - `tasks`：任务对象数组
- **返回：** 插入的 ObjectId 数组
- **示例：**
```typescript
const ids = await TaskModel.addMany([{ type: 'translate', ... }, { type: 'synthesize', ... }]);
```
- **用法：** 批量任务创建（如批量翻译）。

### get
**用途：** 通过 ObjectId 获取任务。

**签名：**
```typescript
get(_id: ObjectId): Promise<Task | null>
```
- **参数：**
  - `_id`：任务 ObjectId
- **返回：** 匹配的 `Task` 或 `null`
- **示例：**
```typescript
const task = await TaskModel.get(taskId);
```
- **用法：** 管理工具、调试或状态检查。

### count
**用途：** 统计匹配条件的任务数。

**签名：**
```typescript
count(query: Filter<Task>): Promise<number>
```
- **参数：**
  - `query`：MongoDB 任务过滤条件
- **返回：** 匹配任务数
- **示例：**
```typescript
const n = await TaskModel.count({ type: 'judge', priority: { $gt: 0 } });
```
- **用法：** 监控、仪表盘与分析。

### del
**用途：** 通过 ObjectId 删除任务。

**签名：**
```typescript
del(_id: ObjectId): Promise<any>
```
- **参数：**
  - `_id`：任务 ObjectId
- **返回：** 删除操作结果
- **示例：**
```typescript
await TaskModel.del(taskId);
```
- **用法：** 清理、管理工具或任务完成后。

### deleteMany
**用途：** 批量删除匹配条件的任务。

**签名：**
```typescript
deleteMany(query: Filter<Task>): Promise<any>
```
- **参数：**
  - `query`：MongoDB 任务过滤条件
- **返回：** 删除操作结果
- **示例：**
```typescript
await TaskModel.deleteMany({ type: 'translate', priority: { $lt: 0 } });
```
- **用法：** 批量清理或维护。

### getFirst
**用途：** 原子性地获取并移除最高优先级的匹配任务（供消费者使用）。

**签名：**
```typescript
getFirst(query: Filter<Task>): Promise<Task | null>
```
- **参数：**
  - `query`：MongoDB 任务过滤条件
- **返回：** 下一个待处理任务，或无可用任务时为 `null`
- **示例：**
```typescript
const nextTask = await TaskModel.getFirst({ type: 'judge' });
```
- **用法：** 消费者内部拉取任务。

### consume
**用途：** 启动消费者处理匹配任务，支持并发与错误处理。

**签名：**
```typescript
consume(query: any, cb: (t: Task) => Promise<void>, destroyOnError = true, concurrency = 1): Consumer
```
- **参数：**
  - `query`：MongoDB 任务过滤条件
  - `cb`：处理每个任务的异步函数
  - `destroyOnError`：出错时是否停止消费者（默认 true）
  - `concurrency`：并发处理任务数（默认 1）
- **返回：** `Consumer` 实例
- **示例：**
```typescript
TaskModel.consume({ type: 'judge' }, async (task) => { /* ... */ }, true, 2);
```
- **用法：** 启动不同类型任务的后台工作进程。

### apply
**用途：** 注册事件监听并初始化分布式任务/事件流。

**签名：**
```typescript
apply(ctx: Context): Promise<void>
```
- **参数：**
  - `ctx`：应用上下文
- **返回：** 完成初始化的 Promise
- **示例：**
```typescript
await apply(appContext);
```
- **用法：** 应用启动时调用，设置事件监听与索引。

### Consumer 类
管理任务消费者的生命周期与并发。

**主要方法：**
- `consume()`：主循环，拉取并处理任务
- `destroy()`：停止消费者
- `setConcurrency(n)`：调整并发数
- `setQuery(q)`：更改查询条件

**示例：**
```typescript
const consumer = new Consumer({ type: 'translate' }, async (task) => { /* ... */ });
consumer.setConcurrency(4);
```

## 🧪 使用模式

- **后台处理：** 用户操作后（如提交）通过 `add` 入队，后台工作进程消费并处理。
- **分布式事件处理：** 事件系统支持跨进程/服务器事件传播，实现可扩展工作流。
- **优先级/并发处理：** 多个消费者可并行处理任务，高优先级任务优先。
- **清理：** 事件监听确保相关资源（如空间）删除时任务被清理。
- **调度：** `Schedule` 结构支持延迟或定时任务（未来扩展）。

## 🧠 代码审查与建议

- **健壮性：** 消费者模式对数据库中断与进程重启有较好容错，但边界错误处理可进一步完善（如部分失败、重试）。
- **可扩展性：** 模型对新任务类型灵活，但建议加强任务载荷类型约束以提升安全性与分析能力。
- **事件处理：** 事件系统集成良好，但分布式事件依赖 MongoDB 副本集，单节点有降级逻辑。
- **索引优化：** 已为高频任务/事件查询建索引，新增工作流时建议定期审查。
- **可观测性：** 已有日志，建议补充更细粒度的指标（如处理时长、错误率）以便监控。
- **测试：** 系统适合生产环境，但高并发场景建议加强集成与压力测试。

## 📝 文件结构

- `src/model/task.ts`：主要模型逻辑、消费者类与事件处理
- `src/interface.ts`：`Task`、`EventDoc`、`Schedule` 及相关类型的 TypeScript 接口
- `task`（MongoDB 集合）：存储所有排队任务
- `event`（MongoDB 集合）：存储跨进程事件

## 📌 备注 / 观察

- **设计选择：** 任务、事件与定时文档分离实现了灵活、解耦的工作流
- **多租户支持：** 所有查询可按资源（如 spaceId）隔离，支持多租户
- **性能：** 支持优先级与并发处理，建议根据吞吐量调优并发数
- **可维护性：** 代码库模块化、事件驱动，建议加强类型约束与内联文档
- **关键 TODO：** 随系统扩展，建议增加重试、死信队列与更细粒度的任务状态追踪以提升生产健壮性

---

如需更多细节，请参见 `src/model/task.ts` 和 `src/interface.ts` 源码。
