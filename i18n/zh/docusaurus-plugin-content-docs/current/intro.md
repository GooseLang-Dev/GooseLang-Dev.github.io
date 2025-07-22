---
sidebar_position: 1
id: intro
title: 简介
---

# GooseLang语言学习平台

## 项目整体架构概览

### 技术栈

- **后端**: TypeScript + Node.js + Koa.js  
- **前端**: TypeScript/JavaScript + React + jQuery  
- **数据库**: MongoDB  
- **构建工具**: Yarn Workspaces + Webpack + TypeScript  
- **编辑器**: Monaco Editor + Markdown编辑器(md-editor-rt)  
- **语音合成**: WebSocket连接语音合成引擎  
- **翻译服务**: WebSocket连接翻译引擎  
- **部署**: Docker + Kubernetes + Caddy反向代理  

---

### Monorepo结构

```text
GooseLang/
├── packages/                # 插件生态系统 (所有子目录都是插件)
│   ├── gooselang/           # [核心插件] 主服务框架
│   ├── ui-default/          # [界面插件] 默认前端界面
│   ├── utils/               # [工具插件] 公共工具库
│   ├── openapi/             # [文档插件] API文档生成
│   ├── loader/              # [加载插件] 动态资源加载器
│   ├── elastic/             # [搜索插件] Elasticsearch集成
│   ├── geoip/               # [地理插件] IP地理位置服务
│   ├── login-with-github/   # [认证插件] GitHub OAuth
│   ├── login-with-google/   # [认证插件] Google OAuth
│   ├── sonic/               # [搜索插件] 高速搜索引擎
│   ├── goosetranslator/     # [翻译插件] 多语言翻译服务
│   ├── goosesynthesizer/    # [语音插件] 语音合成服务
│   ├── gooselangjudge/      # [判题插件] 编程题判题引擎
│   └── language-tool/       # [工具插件] 语言工具集成
├── install/                 # 部署配置
├── locales/                 # 国际化文件
├── modules/                 # 模块系统目录
└── plugins/                 # 外部插件开发目录
```

---

### 插件化架构

基于**Cordis**依赖注入框架构建。

#### 核心插件

- **gooselang**: 核心服务框架 (端口2333)
  - HTTP API + WebSocket + 插件加载器
- **ui-default**: 前端界面插件
  - React组件 + 路由管理
- **认证插件**: GitHub/Google OAuth登录
- **搜索插件**: Elasticsearch/Sonic搜索引擎
- **功能插件**: 语音合成、翻译服务等扩展功能

---

## 代码文件依赖关系

### 核心依赖图

```text
gooselang (主服务)
├── model/      (数据模型层)
│   ├── language.ts   (语言配置管理)
│   ├── question.ts   (题目管理)
│   ├── material.ts   (学习材料管理)
│   ├── training.ts   (训练课程管理)
│   └── user.ts       (用户管理)
├── handler/    (路由处理层)
│   ├── training.ts      (训练课程处理)
│   ├── homework.ts      (作业管理)
│   ├── translate.ts     (翻译服务)
│   └── synthesize.ts    (语音合成)
├── service/    (业务逻辑层)
├── lib/        (工具库)
└── interface/  (类型定义)

ui-default (前端界面)
├── components/   (React组件)
├── pages/        (页面组件)
├── templates/    (HTML模板)
│   └── partials/question_submit_multi.html (多选题提交界面)
├── static/       (静态资源)
└── build/        (构建配置)
```

---

### 重要依赖关系

- `@gooselang/utils`: 被所有包依赖的工具库
- `gooselang` ↔ 语音合成服务: WebSocket通信
- `gooselang` ↔ 翻译服务: WebSocket通信
- `ui-default` → `gooselang`: HTTP API调用
- `loader` → 所有包: 资源加载支持

---

## 功能模块调用逻辑

### 用户认证流程

```text
用户登录 → UserModel.getById() → session验证 → 权限检查 → 业务逻辑
```

### 语言学习练习流程

> _(需完善：流程应进一步细化和补充)_

```text
题目提交 → QuestionModel.get() → 答案验证 → 进度更新 → 结果存储 → 实时反馈
```

### 语音合成服务通信

```text
gooselang WebSocket ↔ 语音合成服务
  - 文本转语音任务分发
  - 实时合成状态更新
  - 音频数据传输
```

### 翻译服务通信

```text
gooselang WebSocket ↔ 翻译服务
  - 翻译任务分发
  - 实时翻译进度
  - 翻译结果返回
```

### 前端数据流

```text
React组件 → API调用 → Koa路由 → Service层 → Model层 → MongoDB
         ← JSON响应 ← 业务处理 ← 数据查询 ←
```

---

## 关键代码文件定位索引

### 核心系统文件

| 功能模块         | 关键文件                                       | 说明                       |
| ---------------- | ---------------------------------------------- | -------------------------- |
| 服务入口         | `packages/gooselang/src/index.ts`              | 主服务启动文件             |
| 路由系统         | `packages/gooselang/src/handler/`              | HTTP路由处理器集合         |
| 数据模型         | `packages/gooselang/src/model/`                | MongoDB数据模型定义        |
| 语言配置         | `packages/gooselang/src/model/language.ts`     | 多语言学习配置管理         |
| 题目管理         | `packages/gooselang/src/model/question.ts`     | 语言学习题目模型           |
| 学习材料         | `packages/gooselang/src/model/material.ts`     | 学习资料管理               |
| 训练课程         | `packages/gooselang/src/handler/training.ts`   | 语言训练课程处理           |
| 语音合成         | `packages/gooselang/src/handler/synthesize.ts` | 文本转语音处理             |
| 翻译服务         | `packages/gooselang/src/handler/translate.ts`  | 多语言翻译处理             |
| 前端入口         | `packages/ui-default/build/main.ts`            | Webpack构建配置            |

---

### 配置文件

| 配置类型         | 文件位置                                                | 说明                       |
| ---------------- | ------------------------------------------------------ | -------------------------- |
| 数据库连接       | `config.json`                                           | MongoDB连接配置            |
| 支持语言         | `packages/gooselang/src/model/language.ts`             | 学习语言种类配置           |
| 用户权限         | `packages/gooselang/src/model/user.ts`                 | 用户权限管理               |
| 文件存储         | `packages/gooselang/src/settings.ts`                   | 文件存储路径配置           |
| 翻译配置         | 系统设置中的`goosetranslator.supported_languages`      | 支持的翻译语言             |

---

## 项目完成度评估

### 完成度: **70%**

#### 已实现核心功能 ✅
<details>
<summary>展开已实现功能</summary>
1. **用户认证系统** - 完整实现 (注册、登录、权限管理)
2. **目标语言配置管理** - 完整实现 (英语、中文、西班牙语等语言支持)
3. **语言学习题目与编辑系统** - 完整实现 (听力、口语、阅读、写作、词汇、语法)
4. **文件上传系统** - 完整实现 (学习材料、课程文件)
5. **消息通知** - 完整实现 (站内消息、实时推送)
6. **国际化支持** - 完整实现 (多语言界面切换)
7. **语音合成服务** - 完整实现 (文本转语音、WebSocket通信) **通过插件实现**
</details>

#### 部分完成功能 🔄

<details>
<summary>展开部分完成功能</summary>

1. **移动端适配** - 60%完成 (基础响应式，需优化)
2. **API文档** - 70%完成 (OpenAPI规范，部分接口缺失)
3. **单元测试** - 30%完成 (核心模块有测试，覆盖率有待提升)
4. **性能监控** - 40%完成 (有基础日志，缺乏完整监控)
5. **语音识别** - 50%完成 (基础框架，需完善识别算法)
6. **讨论社区** - 80%完成 (课程讨论、评论、点赞，需要空间内自定义频道或节点功能)
7. **训练课程系统** - 50% (课程创建、进度跟踪、DAG结构，需要更新与新问题结构配合，更新训练编辑UI/UX)
8. **作业管理系统** - 50% (作业发布、提交、评分，需要更新与新问题结构配合，更新作业编辑UI/UX)
9. **翻译服务** - 80% (多语言翻译、实时翻译，仅支持libretranslate，需添加其他翻译引擎 e.g. Google, Bing...) **通过插件实现**
10. **题目判题逻辑** - 40% (仅支持multi-choice，需支持text, audio, match等题型判题) _(需完善：见英文文档注释)_

</details>

#### 待完善功能 ❌

<details>
<summary>展开待完善功能</summary>

- 智能发音评估
- AI学习路径推荐
- 学习进度分析报表
- 集群负载均衡（目前为单机部署，扩展性需优化）

</details>
---

## 插件系统架构

### 插件系统特性

基于**Cordis**依赖注入框架构建。

#### 核心特性 ✅

- 动态加载 – 支持插件热加载与卸载
- 事件驱动 – 丰富的事件钩子系统
- 类型安全 – TypeScript完整支持
- 依赖注入 – 基于Cordis的DI容器
- 配置管理 – Schema驱动的配置验证
- 生命周期管理 – 完整的插件生命周期管理

#### 内置插件模块

| 插件名称             | 功能描述                      | 状态               |
| -------------------- | ---------------------------- | ------------------ |
| `gooselang`          | 核心服务框架                 | ✅ 完整实现        |
| `ui-default`         | 默认前端界面                 | ✅ 完整实现        |
| `utils`              | 公共工具库                   | ✅ 完整实现        |
| `loader`             | 动态资源加载器               | ✅ 完整实现        |
| `openapi`            | API文档生成                  | ✅ 完整实现        |
| `elastic`            | Elasticsearch搜索集成        | ✅ 完整实现        |
| `geoip`              | IP地理位置服务               | ✅ 完整实现        |
| `login-with-github`  | GitHub OAuth认证             | ✅ 完整实现        |
| `login-with-google`  | Google OAuth认证             | ✅ 完整实现        |
| `sonic`              | 高性能搜索引擎               | ✅ 完整实现        |
| `goosetranslator`    | 多语言翻译服务               | ✅ 80%完成         |
| `goosesynthesizer`   | 语音合成服务                 | ✅ 完整实现        |
| `gooselangjudge`     | 编程题判题引擎               | (仅作参考)         |
| `language-tool`      | 语言工具集成                 | (测试模块)         |

#### 插件开发脚手架

```typescript
export default {
  name: 'plugin-name',
  schema: ConfigSchema,
  apply: (ctx: Context, config: Config) => {
    // 插件逻辑实现
    ctx.on('event-name', handler);
    ctx.command('command-name', handler);
  }
};
```

#### 插件管理命令行

```bash
# 插件管理命令
gooselang addon list              # 列出已安装插件
gooselang addon add <name>        # 安装插件
gooselang addon remove <name>     # 移除插件
gooselang addon create <name>     # 创建插件脚手架
```

#### 事件钩子系统

插件可监听的核心事件：

- **应用生命周期**: `app/started`, `app/ready`, `app/exit`
- **用户事件**: `user/message`, `user/import/*`
- **学习内容**: `problem/add`, `problem/edit`, `problem/del`
- **课程管理**: `contest/add`, `contest/edit`
- **记录跟踪**: `record/change`, `record/judge`
- **翻译服务**: `translation/change`

---

## 可复用UI组件清单

### 高复用价值组件

#### 1. AutoComplete 自动补全组件

- **位置**: `packages/ui-default/components/autocomplete/components/AutoComplete.tsx`
- **功能**:
  - 支持单选/多选模式
  - 异步数据加载和缓存
  - 拖拽排序功能
  - 键盘导航支持
  - 自由输入模式(freeSolo)
- **复用价值**: ⭐⭐⭐⭐⭐ (核心交互组件)

#### 2. Editor 代码/文档编辑器

- **位置**: `packages/ui-default/components/editor/index.tsx`
- **功能**:
  - Monaco代码编辑器集成
  - Markdown编辑器集成
  - 语法高亮、代码补全
  - 主题切换、自动布局
  - 多语言支持
- **复用价值**: ⭐⭐⭐⭐⭐ (核心功能组件)

#### 3. Dialog 对话框系统

- **位置**: `packages/ui-default/components/dialog/index.tsx`
- **功能**:
  - InfoDialog (信息提示)
  - ActionDialog (操作确认)
  - ConfirmDialog (选择确认)
  - 自定义尺寸和样式
- **复用价值**: ⭐⭐⭐⭐ (通用UI组件)

#### 4. IconComponent 图标组件

- **位置**: `packages/ui-default/components/react/IconComponent.tsx`
- **功能**:
  - Iconify图标库集成
  - 统一的图标接口
  - 尺寸和颜色定制
- **复用价值**: ⭐⭐⭐⭐ (基础UI组件)

---

### 领域特定组件

#### 5. ProblemConfigEditor 编程题目配置编辑器
:::warning
_此组件保留自OJ系统，仅供参考，未完全集成到GooseLang，但可作为编程题配置的参考实现。_
:::

- **位置**: `packages/ui-default/components/problemconfig/ProblemConfigEditor.tsx`
- **功能**:
  - 编程题目YAML配置编辑
  - 测试用例输入输出配置
  - 时间限制、内存限制设置
  - 判题器(checker)和交互器(interactor)配置
  - 实时预览和验证
  - 差异对比显示
- **复用价值**: ⭐⭐⭐ (在线编程判题系统专用)

#### 6. MessagePad 消息系统组件

- **位置**: `packages/ui-default/components/messagepad/`
- **功能**:
  - 对话列表和内容显示
  - 实时消息推送
  - 历史消息滚动加载
- **复用价值**: ⭐⭐⭐ (社交功能通用)

---

### 工具类组件

#### 7. DomComponent DOM桥接组件

- **位置**: `packages/ui-default/components/react/DomComponent.tsx`
- **功能**:
  - jQuery DOM元素与React组件桥接
- **复用价值**: ⭐⭐ (迁移期过渡组件)

#### 8. PanelComponent 面板组件
:::warning
_此组件保留自OJ系统，仅供参考，未完全集成到GooseLang，但可作为编程题配置的参考实现。_
:::

- **位置**: `packages/ui-default/components/scratchpad/PanelComponent.jsx`
- **功能**:
  - 标准化面板布局容器
- **复用价值**: ⭐⭐⭐ (布局组件)

---

### 专业选择器组件

#### 9. 各类AutoComplete特化组件

- **位置**: `packages/ui-default/components/autocomplete/`
  - UserSelectAutoComplete (用户选择)
  - ProblemSelectAutoComplete (题目选择)
  - FileSelectAutoComplete (文件选择)
  - SpaceSelectAutoComplete (空间选择)
- **复用价值**: ⭐⭐⭐ (业务特化组件)

---

### 组件复用建议

1. **高复用组件**可直接提取为独立NPM包发布
2. **业务特化组件**适合在类似语言学习系统中复用
3. **基础UI组件**建议标准化接口，提高通用性
4. **工具类组件**可作为技术迁移的参考实现

---

*本文档基于GooseLang语言学习平台代码分析生成，涵盖项目架构、依赖关系、功能模块、文件索引、完成度评估和UI组件清单等技术要点。此平台专注于多语言学习，包含听力、口语、阅读、写作、词汇、语法等全面的语言学习功能，以及语音合成、翻译服务等先进技术支持。*