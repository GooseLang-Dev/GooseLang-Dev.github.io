---
sidebar_position: 3
id: project-setup
title: 项目配置
---

# 🚀 项目配置

本指南将帮助您完成 GooseLang 的基本安装和运行步骤。

## 📥 克隆仓库

首先，克隆 GooseLang 仓库并进入项目目录：

```bash
# 创建开发目录（可选）
mkdir ~/Development
cd ~/Development

# 克隆仓库
git clone https://github.com/GooseLang-Dev/GooseLang.git

# 进入项目目录
cd GooseLang

# 验证当前目录是否正确
pwd
```

## 🛠️ 安装依赖

使用 Yarn 安装所有必需的项目依赖：

```bash
# 安装所有项目依赖
yarn install
```

## 📦 安装默认 UI 插件（可选）

此插件提供前端开发所需的默认用户界面：

```bash
# 安装默认 UI 插件
yarn gooselang addon add @gooselang/ui-default

# 验证安装
yarn gooselang addon list
```

> **🎨 注意**：如果您计划进行用户界面开发或需要完整的开发环境，请安装此插件。

## 🚀 运行应用程序

### 启动后端服务器

```bash
# 以调试模式启动后端并启用文件监视
yarn debug --port=2333 --watch

# 或者：以生产模式启动
yarn start --port=2333
```

### 启动前端开发服务器

```bash
# 启动前端开发服务器
yarn build:ui:dev

# 或者构建生产版本
yarn build:ui
```

> **🌐 访问**：启动后，您可以通过 `http://localhost:3000`（前端）和 `http://localhost:2333`（后端 API）访问应用程序。

## ⚙️ 安装后步骤

### 设置超级管理员用户

通过应用程序注册用户后，您可以将其提升为超级管理员：

```bash
# 将 ID 为 2 的用户设置为超级管理员
yarn gooselang cli user setSuperAdmin 2

# 验证更改
yarn gooselang cli user list
```

> **🔑 超级管理员**：超级管理员可以访问所有功能并管理其他用户。

