---
title: Problem Records
sidebar_position: 4
id: problem-records
---

# Problem Records Data Structure & Model

## 📘 Overview

The **Problem Records** module in GooseLang is responsible for tracking, storing, and managing all user submissions (attempts) for language learning problems. Each record captures a user's attempt, including timing, scoring, and evaluation results. This module is essential for analytics, progress tracking, rejudging, and leaderboard/statistics features. It acts as the historical ledger of user activity on problems, supporting both individual and aggregate reporting.

> **Note:** The judging and task queue logic in this module is currently incomplete and requires further development for robust, production-grade evaluation workflows. See the Code Review & Suggestions section for details.

## 🔗 Dependencies

- **MongoDB**: All records are persisted in the `record` and `record.stat` collections.
- **Problem Model** (`problem.ts`): Links each record to a specific problem.
- **User Model**: Associates each record with a user.
- **Contest/Task System**: Integrates with contest logic and the task queue for judging (currently incomplete).
- **Space Model**: For multi-tenant (space) support.
- **Event Bus**: Listens for events (problem/space deletion, judging, etc.) to maintain data integrity.
- **Utilities**: Uses helpers for time, projection building, and argument handling.

## 📐 Data Structures

### Record Document (`RecordDoc`)
Represents a single user submission for a problem.

```typescript
export interface RecordDoc {
    _id: ObjectId;                // Unique record ID
    spaceId: string;              // Space/organization identifier
    pid: number;                  // Problem ID
    uid: number;                  // User ID
    score: number;                // Final score for this attempt
    pcid?: ObjectId;              // (Optional) Contest/problem collection ID
    time?: number;                // Time spent on this attempt (ms)
    startAt?: Array<Date>;        // Start timestamps for tracking progress
    endAt?: Array<Date>;          // End timestamps for tracking progress
    isJudged?: number;            // Judging status: -1 (not judged), 0 (partial), 1 (judged)
    questionRecod?: any[];        // Array of question-level submission details (structure is flexible)
}
```

#### Field Explanations
- **_id**: MongoDB ObjectId, unique for each submission.
- **spaceId**: Enables multi-tenant support; all queries are scoped by space.
- **pid**: Links to the problem being attempted.
- **uid**: The user making the submission.
- **score**: The computed score for this attempt (after judging).
- **pcid**: Used for contest or grouped problem attempts.
- **time/startAt/endAt**: Used for analytics, time tracking, and progress visualization.
- **isJudged**: Indicates judging status; important for UI and analytics.
- **questionRecod**: Stores per-question details (answers, scores, etc.); currently loosely typed and should be standardized for future analytics.

### Record Statistics Document (`RecordStatDoc`)
Aggregates summary statistics for a user's attempts on a problem.

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
- Used for leaderboards, analytics, and fast queries on user performance.

## ⚙️ Core Methods & Logic

All methods are static on the `RecordModel` class.

### add
**Purpose:** Create a new record for a user attempt.

**Signature:**
```typescript
add(spaceId: string, pid: number, uid: number, startAt: Date, pcid?: ObjectId): Promise<ObjectId>
```
- **Parameters:**
  - `spaceId`: Space/organization ID
  - `pid`: Problem ID
  - `uid`: User ID
  - `startAt`: Start time of the attempt
  - `pcid`: (Optional) Contest/problem collection ID
- **Returns:** The ObjectId of the newly created record
- **Example:**
```typescript
const recordId = await RecordModel.add('space123', 101, 42, new Date());
```
- **Usage:** Called when a user starts a new attempt on a problem.

### get
**Purpose:** Retrieve a record by its ObjectId (optionally scoped to a space).

**Signature:**
```typescript
get(_id: ObjectId): Promise<RecordDoc | null>
get(spaceId: string, _id: ObjectId): Promise<RecordDoc | null>
```
- **Parameters:**
  - `_id`: Record ObjectId
  - `spaceId`: (Optional) Space ID for scoping
- **Returns:** The matching `RecordDoc` or `null` if not found
- **Example:**
```typescript
const record = await RecordModel.get('space123', recordId);
```
- **Usage:** Used in analytics, UI, and judging flows.

### getMulti
**Purpose:** Retrieve multiple records by query.

**Signature:**
```typescript
getMulti(spaceId: string, query: any, options?: FindOptions): FindCursor<RecordDoc>
```
- **Parameters:**
  - `spaceId`: Space ID
  - `query`: MongoDB query object
  - `options`: (Optional) MongoDB find options
- **Returns:** MongoDB cursor for matching records
- **Example:**
```typescript
const cursor = RecordModel.getMulti('space123', { pid: 101 });
const records = await cursor.toArray();
```
- **Usage:** Used for batch analytics, reporting, and admin tools.

### update
**Purpose:** Update fields in a record (supports $set, $push, $unset, $inc).

**Signature:**
```typescript
update(spaceId: string, _id: MaybeArray<ObjectId>, $set?, $push?, $unset?, $inc?): Promise<RecordDoc | null>
```
- **Parameters:**
  - `spaceId`: Space ID
  - `_id`: Single or array of ObjectIds
  - `$set`, `$push`, `$unset`, `$inc`: MongoDB update operators
- **Returns:** Updated `RecordDoc` or `null`
- **Example:**
```typescript
await RecordModel.update('space123', recordId, { score: 100, isJudged: 1 });
```
- **Usage:** Used after judging, for progress updates, or admin corrections.

### updateMulti
**Purpose:** Update multiple records matching a filter.

**Signature:**
```typescript
updateMulti(spaceId: string, $match: Filter<RecordDoc>, $set?, $push?, $unset?): Promise<number>
```
- **Parameters:**
  - `spaceId`: Space ID
  - `$match`: MongoDB filter
  - `$set`, `$push`, `$unset`: MongoDB update operators
- **Returns:** Number of modified records
- **Example:**
```typescript
await RecordModel.updateMulti('space123', { pid: 101 }, { score: 0 });
```
- **Usage:** Bulk corrections, contest resets, or analytics.

### reset
**Purpose:** Reset a record for rejudging (clears score, status, etc.).

**Signature:**
```typescript
reset(spaceId: string, rid: MaybeArray<ObjectId>, isRejudge: boolean): Promise<RecordDoc | null>
```
- **Parameters:**
  - `spaceId`: Space ID
  - `rid`: Single or array of ObjectIds
  - `isRejudge`: Whether this is a rejudging operation
- **Returns:** Updated `RecordDoc` or `null`
- **Example:**
```typescript
await RecordModel.reset('space123', recordId, true);
```
- **Usage:** Used when a problem is rejudged or test data changes.

### judge
**Purpose:** Queue records for judging (integration with task system).

**Signature:**
```typescript
judge(spaceId: string, rids: MaybeArray<ObjectId> | RecordDoc, priority = 0, config = {}, meta = {}): Promise<any>
```
- **Parameters:**
  - `spaceId`: Space ID
  - `rids`: Record ObjectId(s) or RecordDoc(s)
  - `priority`: (Optional) Judging priority
  - `config`: (Optional) Problem config overrides
  - `meta`: (Optional) Judging metadata
- **Returns:** Result of task queue operation (currently incomplete)
- **Example:**
```typescript
await RecordModel.judge('space123', recordId);
```
- **Usage:** Called after a submission to trigger evaluation.
- **Warning:** The judging/task logic is incomplete and may not function as expected in production.

### stat
**Purpose:** Aggregate statistics for submissions over various time windows.

**Signature:**
```typescript
stat(spaceId?: string): Promise<{ d5min, d1h, day, week, month, year, total }>
```
- **Parameters:**
  - `spaceId`: (Optional) Space ID
- **Returns:** Object with counts for various time windows
- **Example:**
```typescript
const stats = await RecordModel.stat('space123');
```
- **Usage:** Used for dashboards, analytics, and reporting.

### getList
**Purpose:** Retrieve a batch of records by IDs.

**Signature:**
```typescript
getList(spaceId: string, rids: ObjectId[], fields?: (keyof RecordDoc)[]): Promise<Record<string, Partial<RecordDoc>>>
```
- **Parameters:**
  - `spaceId`: Space ID
  - `rids`: Array of ObjectIds
  - `fields`: (Optional) Fields to project
- **Returns:** Map of record IDs to partial RecordDocs
- **Example:**
```typescript
const records = await RecordModel.getList('space123', [recordId1, recordId2]);
```
- **Usage:** Used in batch reporting, admin tools, and analytics.

### count
**Purpose:** Count records matching a query.

**Signature:**
```typescript
count(spaceId: string, query: any): Promise<number>
```
- **Parameters:**
  - `spaceId`: Space ID
  - `query`: MongoDB query
- **Returns:** Number of matching records
- **Example:**
```typescript
const n = await RecordModel.count('space123', { pid: 101 });
```
- **Usage:** Used for analytics, dashboards, and progress tracking.

## 🧪 Usage Patterns

- **Submission Flow:** When a user submits a solution, `add` is called to create a record, then `judge` is called to queue it for evaluation. After judging, `update` is used to store results.
- **Analytics:** `stat`, `getMulti`, and `count` are used for dashboards and reporting.
- **Rejudging:** `reset` and `judge` are used when problems or test data change.
- **Cleanup:** Event listeners ensure records are deleted when problems or spaces are removed.

## 🧠 Code Review and Suggestions

- **Incomplete Judging/Task Logic:**
  - The judging and task queue logic is not fully implemented. The `judge` method and related task integration require significant development to support robust, asynchronous evaluation and result handling. This is a critical area for future work.
- **questionRecod Field:**
  - Currently typed as `any[]`, which limits type safety and analytics. **Recommendation:** Define a strict schema/interface for question-level details to enable robust analytics and UI features.
- **Error Handling:**
  - Some methods could benefit from more explicit error handling and validation, especially for partial updates and edge cases.
- **Dead Code/Legacy:**
  - No major dead code, but some TODOs and comments suggest future enhancements (e.g., deprecating certain config patterns).
- **Indexing:**
  - Indexes are well-defined for common queries, but as analytics grow, consider reviewing index coverage for new reporting needs.
- **Event Handling:**
  - Event-driven cleanup is robust, but ensure all new features trigger appropriate events for data integrity.
- **Documentation:**
  - Inline code comments are sparse in some areas. Consider adding more docstrings for complex logic.

## 📝 File Structure

- `src/model/record.ts`: Main model logic and event listeners
- `src/interface.ts`: TypeScript interfaces for `RecordDoc`, `RecordStatDoc`, and related types
- `record.stat` (MongoDB collection): Stores summary statistics
- `record` (MongoDB collection): Stores all submission records

## 📌 Notes / Observations

- **Design Choice:** The separation of `RecordDoc` and `RecordStatDoc` enables both detailed and summary analytics.
- **Extensibility:** The model is designed for future analytics and reporting, but standardizing flexible fields (like `questionRecod`) will be important.
- **Integration:** The module is tightly coupled with the problem, contest, and user systems, and is event-driven for data integrity.
- **Multi-Tenancy:** All queries are scoped by `spaceId` for robust multi-tenant support.
- **Performance:** Indexes and batch operations are used for efficiency, but should be reviewed as usage patterns evolve.
- **Maintainability:** The codebase is modular and event-driven, but would benefit from stricter typing and more comprehensive inline documentation.
- **Critical TODO:** The judging/task queue logic must be completed and thoroughly tested before this module can be considered production-ready for evaluation workflows.

---

For further details, see the source code in `src/model/record.ts` and `src/interface.ts`.
