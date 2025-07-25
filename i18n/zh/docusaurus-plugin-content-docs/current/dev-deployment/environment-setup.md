---
sidebar_position: 1
id: environment-setup
title: 环境搭建
---

# 🌄 环境搭建

本指南将帮助您搭建 GooseLang 开发所需的基本环境。

## 📋 前置条件

在开始 GooseLang 开发之前，请确保您的系统已安装以下必需组件：

- **操作系统**：Linux（推荐 Ubuntu/Debian）、macOS 或带有 WSL2 的 Windows
- **包管理器**：`apt`（Ubuntu/Debian）或您系统对应的包管理器
- **网络连接**：稳定的网络连接以下载依赖项
- **磁盘空间**：完整安装至少需要 2GB 的可用空间

## 🔄 系统更新

首先，让我们确保您的系统已更新到最新的软件包和安全补丁：

```bash
# 更新软件包列表
sudo apt-get update

# 将现有软件包升级到最新版本
sudo apt-get upgrade -y
```

> **💡 提示**：定期运行这些命令有助于防止兼容性问题和安全漏洞。

## 📦 安装 Node.js 和 Yarn

Node.js 和 Yarn 是运行 GooseLang 开发环境的必需组件：

```bash
# 安装 Node.js
sudo apt-get install nodejs -y

# 通过 npm 安装 Yarn
sudo npm install -g yarn

# 验证安装
node --version
yarn --version
```

> **🔍 验证**：您应该能看到 Node.js 和 Yarn 的版本号。如果显示"命令未找到"，则可能安装失败。

## 📥 安装 `git`

使用以下命令安装 `git`：

```bash
# 如果尚未安装 Git，则安装它
sudo apt-get install git -y

# 验证 Git 安装
git --version
```


