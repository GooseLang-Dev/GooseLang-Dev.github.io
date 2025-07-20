---
sidebar_position: 2
id: problem-data
title: 问题数据
---

Doc types
Doc identifiers for better filtering specific data blocks inside same problem_settings data collection
```typescript
export const TYPE_PROBLEM_SETTING = 1451;
export const TYPE_QUESTION_SETTING = 1452;
```

```typescript

export interface LangProblemDoc {
  _id: ObjectId;
  problemId: string;
  domainId: "system";
  Owner: number;
  docType: string; // Replace with actual type if TYPE_PROBLEM_SETTING is known
  levelId: ObjectId;
  TypeId: ObjectId;
  nSubmit: number;
  avgScore: number;
  targetDomainLangId: ObjectId;
  tag: Array<string>;
; // Replace 'any' with specific tag type if known
  isReference: boolean;
  referenceId?: ObjectId; // Optional since it's conditional
  isHidden: boolean;
  data: {
    audio: {
      _id: string;
      name: string;
      size: number;
      lastModified: string; // Consider using Date type if possible
      etag: string;
    };
    text: {
      en: string;
      zh: string;
    };
  };
  content: {
    description: {
      en: string;
    };
    title: {
      en: string;
    };
    questions: ObjectId[];
  };
}
```