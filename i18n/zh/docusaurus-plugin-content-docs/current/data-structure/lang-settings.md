---
sidebar_position: 1
id: lang-settings
title: 语言设置
---

### **Doc types**
Doc identifiers for better filtering specific data blocks inside same data collection
```typescript
export const TYPE_SYSTEM_LANGS = 7121;
export const TYPE_LANG_SETTING = 7122
export const TYPE_DOMAIN_LANGS = 7123;
```



### **System Lang Info Setting**
this data structure is for storing default langaugages available from system. 
Used when for initiating domain

**data structure or interface:**
```typescript
export interface SystemLangsDoc {
    _id: ObjectId;
    docType: typeof TYPE_SYSTEM_LANGS;
    availableLangCodes: Array<string>;
    defaultLangCodes: Array<string>;
    langs: Array<{
        langCode: string;
        isCustom: boolean;
        langName: string;
        langTypes: LangSettingDoc['langTypes'];
    }>;
}

```


### **Domain Lang Info Setting**
this data structure is for storing used, custom, and available langcode in the domain

**data structure or interface:**
```typescript
export interface DomainLangsDoc {
    _id: ObjectId;
    docType: typeof TYPE_DOMAIN_LANGS
    domainId: string;
    currentLangs: Array<string>;
    availableLangs: Array<string>;
    customLangs: Array<string>
}
```


### **Language Info Setting**
this data structure is for storing language settings in different domain with specified language code, either custom or not.

**data structure or interface:**
```typescript 
export interface LangSettingDoc {
    _id: ObjectId;
    docType: typeof TYPE_LANG_SETTING;
    domainId: string;
    isCustom: boolean;
    langCode: string;
    langName: string;
    langTypes: Array<{
        typeId: ObjectId;// Unique identifier for the type
        typeCode: string;
        typeName: string;
        tags: string;
    }>;
}
```

### **Language Level Setting** 
this data structure is for storing multiple language levels for the same language under one domainId with specified language setting id.

**data structure or interface:**
```typescript
export interface LevelSettingDoc {
    _id: ObjectId;
    docType: typeof TYPE_LEVEL_SETTING;
    domainId: string;
    domainLangId:ObjectId;
    levelName: String;
    totalPoint: Number;
    requiredPoint:Number;
    typePoints:Array<{
        typeId:ObjectId;
        typeName: String;
        typeCode: String;
        percentage: Number;
        typePoint: {
            correct: Number;
            wrong: Number;
        };
    }>;
}
```