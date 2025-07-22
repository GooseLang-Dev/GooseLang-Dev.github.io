---
title: Task Data
sidebar_position: 5
id: task-data
---

# Task Data Structure & Model

## 📘 Overview

The **Task** module in GooseLang provides a robust, extensible system for managing background and asynchronous operations across the platform. It acts as a general-purpose task queue and event system, supporting features such as background processing, distributed event broadcasting, and scheduled jobs. The module is essential for decoupling long-running or resource-intensive operations (e.g., judging, translation, synthesis, cleanup) from user-facing flows, enabling scalable and reliable backend workflows.

The task system is designed to:
- Store and manage queued tasks in MongoDB
- Support prioritized, concurrent, and distributed task consumption
- Enable event-driven workflows and cross-process communication
- Integrate with other models (e.g., judging, translation, synthesis)
- Provide a foundation for future workflow orchestration and scheduling

## 🔗 Dependencies

- **MongoDB**: All tasks and events are persisted in the `task` and `event` collections.
- **Event Bus** (`bus`): For process-wide and cross-process event handling.
- **Logger**: For structured logging and debugging.
- **Context**: For application lifecycle hooks and event registration.
- **nanoid/os**: For unique process and task identification.
- **@gooselang/utils**: For utility helpers (e.g., sleep).
- **Other Models**: Integrates with judging, translation, and other async workflows.

## 📐 Data Structures

### Task Document (`Task`)
Represents a single unit of work to be processed asynchronously.

```typescript
export interface Task {
    _id: ObjectId;         // Unique task ID
    type: string;          // Task type (e.g., 'judge', 'translate', 'synthesize')
    subType?: string;      // Optional subtype for further categorization
    priority: number;      // Task priority (higher = processed first)
    [key: string]: any;    // Additional task-specific fields
}
```

#### Field Explanations
- **_id**: MongoDB ObjectId, unique for each task.
- **type**: The main category of the task (e.g., 'judge', 'translate').
- **subType**: Optional subcategory for more granular task types.
- **priority**: Determines processing order; higher values are processed first.
- **[key: string]: any**: Arbitrary fields for task-specific payloads (e.g., record IDs, config, metadata).

### Event Document (`EventDoc`)
Represents a cross-process or cross-service event for distributed workflows.

```typescript
export interface EventDoc {
    ack: string[];         // List of process IDs that have acknowledged the event
    event: number | string;// Event name or code
    payload: string;       // Serialized event payload (JSON)
    expire: Date;          // Expiry timestamp for the event
    trace?: string;        // Optional trace/debug info
}
```

#### Field Explanations
- **ack**: Array of process IDs that have processed the event (for deduplication).
- **event**: Event type or name.
- **payload**: JSON-serialized event data.
- **expire**: When the event should be considered stale and eligible for cleanup.
- **trace**: Optional trace/debugging information.

### Schedule Document (`Schedule`)
Represents a scheduled job or delayed task.

```typescript
export interface Schedule {
    _id: ObjectId;         // Unique schedule ID
    type: string;          // Task type
    subType?: string;      // Optional subtype
    executeAfter: Date;    // When the task should be executed
    [key: string]: any;    // Additional fields
}
```

#### Field Explanations
- **_id**: MongoDB ObjectId, unique for each schedule.
- **type**: Main category of the scheduled task.
- **subType**: Optional subcategory.
- **executeAfter**: Timestamp after which the task should be executed.
- **[key: string]: any**: Arbitrary fields for schedule-specific payloads.

### Task Status Constants

```typescript
export const TASK_STATUS = {
    STATUS_WAITING: 0,
    STATUS_FETCHED: 1,
    STATUS_PROCESSING: 2, // use for both translating and synthesizing
    STATUS_COMPLETED: 3,
    STATUS_ERROR: 4,
    STATUS_SYSTEM_ERROR: 5
};
```

## ⚙️ Core Methods & Logic

All methods are static on the `TaskModel` class unless otherwise noted.

### add
**Purpose:** Add a new task to the queue.

**Signature:**
```typescript
add(task: Partial<Task> & { type: string }): Promise<ObjectId>
```
- **Parameters:**
  - `task`: Partial task object (must include `type`)
- **Returns:** The ObjectId of the newly created task
- **Example:**
```typescript
const taskId = await TaskModel.add({ type: 'judge', priority: 10, rid: '...' });
```
- **Usage:** Called when a new background job is needed (e.g., after a user submission).

### addMany
**Purpose:** Add multiple tasks to the queue in bulk.

**Signature:**
```typescript
addMany(tasks: Task[]): Promise<ObjectId[]>
```
- **Parameters:**
  - `tasks`: Array of task objects
- **Returns:** Array of inserted ObjectIds
- **Example:**
```typescript
const ids = await TaskModel.addMany([{ type: 'translate', ... }, { type: 'synthesize', ... }]);
```
- **Usage:** Used for batch job creation (e.g., bulk translation).

### get
**Purpose:** Retrieve a task by its ObjectId.

**Signature:**
```typescript
get(_id: ObjectId): Promise<Task | null>
```
- **Parameters:**
  - `_id`: Task ObjectId
- **Returns:** The matching `Task` or `null` if not found
- **Example:**
```typescript
const task = await TaskModel.get(taskId);
```
- **Usage:** Used in admin tools, debugging, or for status checks.

### count
**Purpose:** Count tasks matching a query.

**Signature:**
```typescript
count(query: Filter<Task>): Promise<number>
```
- **Parameters:**
  - `query`: MongoDB filter for tasks
- **Returns:** Number of matching tasks
- **Example:**
```typescript
const n = await TaskModel.count({ type: 'judge', priority: { $gt: 0 } });
```
- **Usage:** Used for monitoring, dashboards, and analytics.

### del
**Purpose:** Delete a task by its ObjectId.

**Signature:**
```typescript
del(_id: ObjectId): Promise<any>
```
- **Parameters:**
  - `_id`: Task ObjectId
- **Returns:** Result of the delete operation
- **Example:**
```typescript
await TaskModel.del(taskId);
```
- **Usage:** Used for cleanup, admin tools, or after task completion.

### deleteMany
**Purpose:** Delete multiple tasks matching a query.

**Signature:**
```typescript
deleteMany(query: Filter<Task>): Promise<any>
```
- **Parameters:**
  - `query`: MongoDB filter for tasks
- **Returns:** Result of the delete operation
- **Example:**
```typescript
await TaskModel.deleteMany({ type: 'translate', priority: { $lt: 0 } });
```
- **Usage:** Used for bulk cleanup or maintenance.

### getFirst
**Purpose:** Atomically fetch and remove the highest-priority task matching a query (for consumers).

**Signature:**
```typescript
getFirst(query: Filter<Task>): Promise<Task | null>
```
- **Parameters:**
  - `query`: MongoDB filter for tasks
- **Returns:** The next task to process, or `null` if none available
- **Example:**
```typescript
const nextTask = await TaskModel.getFirst({ type: 'judge' });
```
- **Usage:** Used internally by consumers to fetch work.

### consume
**Purpose:** Start a consumer that processes tasks matching a query, with concurrency and error handling.

**Signature:**
```typescript
consume(query: any, cb: (t: Task) => Promise<void>, destroyOnError = true, concurrency = 1): Consumer
```
- **Parameters:**
  - `query`: MongoDB filter for tasks
  - `cb`: Async function to process each task
  - `destroyOnError`: Whether to stop the consumer on error (default: true)
  - `concurrency`: Number of concurrent tasks to process (default: 1)
- **Returns:** A `Consumer` instance
- **Example:**
```typescript
TaskModel.consume({ type: 'judge' }, async (task) => { /* ... */ }, true, 2);
```
- **Usage:** Used to start background workers for different task types.

### apply
**Purpose:** Register event listeners and initialize event streaming for distributed task/event handling.

**Signature:**
```typescript
apply(ctx: Context): Promise<void>
```
- **Parameters:**
  - `ctx`: Application context
- **Returns:** Promise resolving when setup is complete
- **Example:**
```typescript
await apply(appContext);
```
- **Usage:** Called during application startup to set up event listeners and indexes.

### Consumer Class
Manages the lifecycle and concurrency of a task consumer.

**Key Methods:**
- `consume()`: Main loop for fetching and processing tasks
- `destroy()`: Stop the consumer
- `setConcurrency(n)`: Adjust concurrency
- `setQuery(q)`: Change the query filter

**Example:**
```typescript
const consumer = new Consumer({ type: 'translate' }, async (task) => { /* ... */ });
consumer.setConcurrency(4);
```

## 🧪 Usage Patterns

- **Background Processing:** After a user action (e.g., submission), a task is enqueued via `add`, and a background worker consumes and processes it.
- **Distributed Event Handling:** The event system enables cross-process or cross-server event propagation for scalable workflows.
- **Prioritized/Concurrent Work:** Multiple consumers can process tasks in parallel, with higher-priority tasks handled first.
- **Cleanup:** Event listeners ensure tasks are deleted when related resources (e.g., spaces) are removed.
- **Scheduling:** The `Schedule` structure supports delayed or scheduled jobs (future extension).

## 🧠 Code Review and Suggestions

- **Robustness:** The consumer pattern is resilient to database downtime and process restarts, but error handling could be further improved for edge cases (e.g., partial failures, retries).
- **Extensibility:** The model is flexible for new task types, but consider stricter typing for task payloads to improve safety and analytics.
- **Event Handling:** The event system is well-integrated, but distributed event delivery depends on MongoDB replica set support; fallback logic is present for single-node setups.
- **Indexing:** Indexes are created for efficient task/event queries, but should be reviewed as new workflows are added.
- **Observability:** Logging is present, but more granular metrics (e.g., task processing times, error rates) would aid monitoring.
- **Testing:** The system is suitable for production, but integration and load testing are recommended for high-throughput scenarios.

## 📝 File Structure

- `src/model/task.ts`: Main model logic, consumer class, and event handling
- `src/interface.ts`: TypeScript interfaces for `Task`, `EventDoc`, `Schedule`, and related types
- `task` (MongoDB collection): Stores all queued tasks
- `event` (MongoDB collection): Stores cross-process events

## 📌 Notes / Observations

- **Design Choice:** The separation of task, event, and schedule documents enables flexible, decoupled workflows.
- **Multi-Tenancy:** All queries can be scoped by resource (e.g., spaceId) for robust multi-tenant support.
- **Performance:** Prioritized and concurrent processing is supported, but tuning concurrency is important for optimal throughput.
- **Maintainability:** The codebase is modular and event-driven, but would benefit from stricter typing and more comprehensive inline documentation.
- **Critical TODO:** As the system grows, consider adding retry logic, dead-letter queues, and more granular task state tracking for production robustness.

---

For further details, see the source code in `src/model/task.ts` and `src/interface.ts`.
