---
id: goosenlp-user-guide
title: GooseNLP 用户使用指南
sidebar_position: 1
---

# GooseNLP 用户使用指南

## 目录
1. [快速开始](#快速开始)
2. [安装部署](#安装部署)
3. [配置说明](#配置说明)
4. [使用流程](#使用流程)
5. [功能说明](#功能说明)
6. [常见问题](#常见问题)
7. [注意事项](#注意事项)

## 快速开始

GooseNLP 是 GooseLang 系统的自然语言处理插件，为文本材料提供词性标注、命名实体识别等功能。

### 主要功能
- 🏷️ **词性标注**：识别名词、动词、形容词等词性
- 🔍 **命名实体识别**：识别人名、地名、组织等
- 🌐 **多语言支持**：支持英语、中文、西班牙语
- 📊 **交互式展示**：点击查看详细语言分析

## 安装部署

### 前置要求
- Node.js 18+
- Python 3.8+
- MongoDB
- GooseLang 系统

### 安装步骤

#### 1. 前置准备

确保系统已安装 Python 3.8 或更高版本：

```bash
# 检查 Python 版本
python3 --version

# 如果未安装，请根据操作系统安装：
# macOS: brew install python3
# Ubuntu/Debian: sudo apt-get install python3 python3-pip
# Windows: 从 python.org 下载安装
```

#### 2. 安装 GooseNLP 插件

```bash
# 进入 GooseLang 项目目录
cd /path/to/GooseLang

# 安装依赖
yarn install

# 进入 GooseNLP 目录
cd packages/goosenlp
```

#### 3. 一键启动（推荐）

GooseNLP 提供了一键启动命令，会自动完成以下操作：
- 创建 Python 虚拟环境
- 安装所需依赖
- 下载语言模型（英语、中文、西班牙语）
- 启动 spaCy 服务和 GooseNLP 插件

```bash
# 在 packages/goosenlp 目录下运行
npm run dev
```

首次运行时，系统会自动：
1. 在用户目录创建配置和虚拟环境
2. 安装 Python 依赖包
3. 下载 spaCy 语言模型（约 500MB）
4. 启动所有必要的服务

#### 4. 配置文件位置

GooseNLP 的配置文件和虚拟环境存放在用户目录下：

**macOS/Linux:**
```
~/.gooselang/
├── goosenlp/
│   ├── venv/          # Python 虚拟环境
│   ├── logs/          # 日志文件
│   └── config/        # 配置文件
└── nlp.yaml           # NLP 插件配置
```

**Windows:**
```
%USERPROFILE%\.gooselang\
├── goosenlp\
│   ├── venv\          # Python 虚拟环境
│   ├── logs\          # 日志文件
│   └── config\        # 配置文件
└── nlp.yaml           # NLP 插件配置
```

**注意**：不同操作系统的路径表示：
- macOS/Linux: `~` 代表用户主目录，如 `/Users/username` 或 `/home/username`
- Windows: `%USERPROFILE%` 通常是 `C:\Users\username`

## 配置说明

### 1. GooseLang 系统配置

在 GooseLang 的配置文件中添加 GooseNLP 配置：

```yaml
# config/default.yaml 或 config/production.yaml

goosenlp:
  # 是否禁用插件
  disable: false
  
  # spaCy 服务地址
  spacy_url: http://127.0.0.1:1407
  
  # 是否启用缓存
  cache_enabled: true
  
  # 最大文本长度
  max_text_length: 50000
  
  # 主机配置
  hosts:
    - server: http://localhost:1337  # GooseLang 服务器地址
      uname: goosenlp_user          # 认证用户名
      password: your_password        # 认证密码
      priority: 1                    # 优先级
      concurrency: 2                 # 并发数
```

### 2. 环境变量配置

支持通过环境变量覆盖配置：

```bash
# GooseLang 服务器地址
export GOOSELANG_SERVER_URL=http://your-server:1337

# MongoDB 连接（如果需要独立配置）
export MONGODB_URL=mongodb://localhost:27017/gooselang
```

### 3. 插件配置文件

插件配置文件位于用户目录：

**macOS/Linux:** `~/.gooselang/nlp.yaml`  
**Windows:** `%USERPROFILE%\.gooselang\nlp.yaml`

配置示例：

```yaml
# nlp.yaml
type: goosenlp
server: http://localhost:1337
uname: nlp_worker
password: secure_password
spacyUrl: http://127.0.0.1:1407
cacheEnabled: true
concurrency: 2
```

首次运行 `npm run dev` 时会自动创建默认配置文件。

## 使用流程

### 1. 在材料列表中启用 NLP

1. 打开包含文本材料的题目页面
2. 在材料列表上方找到"词性标注"开关
3. 打开开关，系统将自动分析当前材料

![NLP Toggle Switch](./images/nlp-toggle.png)

### 2. 查看标注结果

启用后，文本将被标注为不同颜色的短语块：

- 🔵 **蓝色**：名词/名词短语
- 🟢 **绿色**：动词/动词短语
- 🟡 **黄色**：形容词
- 🟠 **橙色**：副词
- 🟣 **紫色**：专有名词
- 其他颜色对应不同词性

### 3. 交互式查看详情

#### 基本交互

- **鼠标悬停**：快速查看词性和词根信息
- **点击固定**：点击短语标签固定显示详细信息
- **再次点击**：关闭详情窗口

#### 详情窗口内容

详情窗口以优雅的下拉菜单形式展示，包含：

1. **短语信息**
   - 短语类型（如 noun_phrase、verb_phrase）
   - 主要词性（如 NOUN、VERB）

2. **组成成分**（多词短语）
   - 每个词的原文
   - 词性标记（POS）
   - 词性说明（如"名词"、"动词"）

#### 界面展示示例

当您点击一个短语时，会看到类似这样的信息框：

```
┌─────────────────────────────┐
│ Type: noun_phrase           │
│ Main POS: NOUN              │
│ ─────────────────────────── │
│ Components:                 │
│ • The: DET (限定词)         │
│ • quick: ADJ (形容词)       │
│ • brown: ADJ (形容词)       │
│ • fox: NOUN (名词)          │
└─────────────────────────────┘
```

信息框会智能定位，确保始终在视口内完整显示。

### 4. 切换材料

当切换到其他材料时：
- NLP 开关会自动重置
- 需要重新开启以分析新材料
- 已分析的结果会被缓存，再次查看时加载更快

## 功能说明

### 支持的语言

目前支持以下语言的自动检测和分析：

| 语言 | 代码 | 特性 |
|------|------|------|
| 英语 | en | 完整的词性、实体、依存分析 |
| 中文 | zh | 分词、词性、实体识别 |
| 西班牙语 | es | 词性、实体、依存分析 |

系统会自动检测文本语言，也可以根据系统语言设置自动选择。

### NLP 功能特性

1. **词性标注（POS Tagging）**
   - 识别每个词的语法角色
   - 提供详细的词性说明

2. **短语提取**
   - 智能组合相关词汇
   - 保持阅读流畅性

3. **命名实体识别（NER）**
   - 识别人名、地名、组织机构等
   - 在统计信息中显示

4. **词形还原（Lemmatization）**
   - 显示词汇的原形
   - 帮助理解词汇变化

### 性能优化

- **智能缓存**：相同内容不会重复处理
- **流式加载**：大文本分批处理
- **并发处理**：支持多材料同时分析

## 常见问题

### Q1: 为什么开启 NLP 后一直在加载？

**可能原因**：
1. spaCy 服务未启动
2. 网络连接问题
3. 文本过长超出限制

**解决方法**：
1. 检查 spaCy 服务是否运行：`curl http://127.0.0.1:1407/health`
2. 查看 GooseNLP 插件日志
3. 确认文本长度不超过配置的最大值

### Q2: 语言识别不准确怎么办？

**解决方法**：
1. 系统会自动检测并纠正语言
2. 确保文本包含足够的语言特征
3. 混合语言文本可能影响识别准确性

### Q3: 如何添加新的语言支持？

**步骤**：
1. 安装对应的 spaCy 语言模型
2. 在 `spacy_server.py` 中添加模型配置
3. 更新语言检测逻辑
4. 重启服务

### Q4: 缓存如何清理？

**MongoDB 缓存**：
```javascript
// 连接到 MongoDB
use gooselang;
// 清理 NLP 缓存
db.nlp_cache.remove({});
```

**内存缓存**：
重启 GooseNLP 插件即可清理内存缓存。

### Q5: 如何查看处理日志？

日志文件位置因操作系统而异：

**macOS/Linux:**
- GooseNLP 插件日志：查看控制台输出
- spaCy 服务日志：`~/.gooselang/goosenlp/logs/`

**Windows:**
- GooseNLP 插件日志：查看控制台输出
- spaCy 服务日志：`%USERPROFILE%\.gooselang\goosenlp\logs\`

## 注意事项

### 安全注意事项

1. **认证配置**
   - 务必设置强密码
   - 不要在配置文件中硬编码敏感信息
   - 使用环境变量管理凭据

2. **网络安全**
   - spaCy 服务建议只监听本地地址
   - 生产环境使用 HTTPS
   - 配置防火墙规则

### 性能注意事项

1. **资源占用**
   - NLP 处理较消耗 CPU 和内存
   - 建议配置足够的系统资源
   - 可调整并发数控制资源使用

2. **文本长度**
   - 超长文本可能导致处理缓慢
   - 建议设置合理的最大长度限制
   - 考虑分段处理大文档

### 使用建议

1. **最佳实践**
   - 定期清理过期缓存
   - 监控服务运行状态
   - 及时更新语言模型

2. **故障处理**
   - 保持日志记录
   - 设置监控告警
   - 准备降级方案

## 附录

### 命令速查

```bash
# 一键启动（推荐）
npm run dev          # 自动设置环境并启动所有服务

# 分别启动
npm run start:python  # 仅启动 spaCy 服务
npm run start:node    # 仅启动 GooseNLP 插件

# 调试和测试
npm run test         # 运行测试
npm run health       # 健康检查
npm run info         # 查看服务信息

# 手动管理（通常不需要）
# 激活虚拟环境
# macOS/Linux:
source ~/.gooselang/goosenlp/venv/bin/activate
# Windows:
%USERPROFILE%\.gooselang\goosenlp\venv\Scripts\activate

# 查看已安装的语言模型
python -m spacy info
```

### 配置模板

完整的配置示例文件可在 `packages/goosenlp/nlp.example.yaml` 中找到。

### 测试服务器（开发者工具）

GooseNLP 提供了一个独立的测试页面，方便开发者快速测试 NLP 功能：

```bash
# 启动测试服务器
npm run test-server
```

访问 http://127.0.0.1:3456 查看测试页面，功能包括：
- 输入任意文本进行实时分析
- 测试多语言自动检测
- 查看详细的 NLP 分析结果
- 验证服务连接状态

这是调试 NLP 服务和测试新功能的便捷工具。

### 获取帮助

- 查看项目文档：`packages/goosenlp/README.md`
- 提交问题：GitHub Issues
- 社区讨论：GooseLang 论坛

---

*本指南版本：1.0.0*  
*最后更新：2025-08-02*