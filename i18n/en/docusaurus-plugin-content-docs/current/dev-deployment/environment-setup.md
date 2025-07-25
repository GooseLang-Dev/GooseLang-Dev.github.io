---
sidebar_position: 1
id: environment-setup
title: Environment Setup
---

# 🌄 Environment Setup

This guide will help you set up the basic environment needed for GooseLang development.

## 📋 Prerequisites

Before starting with GooseLang development, ensure you have the following prerequisites installed on your system:

- **Operating System**: Linux (Ubuntu/Debian recommended), macOS, or Windows with WSL2
- **Package Manager**: `apt` (Ubuntu/Debian) or equivalent for your system
- **Network Access**: Stable internet connection for downloading dependencies
- **Disk Space**: At least 2GB of free space for the complete installation

## 🔄 System Updates

First, let's ensure your system is up to date with the latest packages and security patches:

```bash
# Update package lists
sudo apt-get update

# Upgrade existing packages to their latest versions
sudo apt-get upgrade -y
```

> **💡 Tip**: Running these commands regularly helps prevent compatibility issues and security vulnerabilities.

## 📦 Install Node.js and Yarn

Node.js and Yarn are essential for running the GooseLang development environment:

```bash
# Install Node.js
sudo apt-get install nodejs -y

# Install Yarn through npm
sudo npm install -g yarn

# Verify the installations
node --version
yarn --version
```

> **🔍 Verification**: You should see version numbers displayed for both Node.js and Yarn. If you see "command not found", the installation may have failed.

## 📥 Installing `git`

Install `git` using the following command:

```bash
# Install Git if not already installed
sudo apt-get install git -y

# Verify Git installation
git --version
```


