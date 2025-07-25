---
sidebar_position: 5
id: checklist-&-troubleshoot
title: 检查清单和故障排除
---

# ✅ 检查清单和故障排除

## 验证检查清单

安装完成后，请检查以下项目以确保一切正常运行：

- [ ] 系统包已更新
- [ ] Node.js 和 Yarn 已安装且正常运行
- [ ] 项目依赖已成功安装
- [ ] 后端服务器启动无错误
- [ ] 前端开发服务器启动无错误
- [ ] 可以在浏览器中访问应用程序
- [ ] 默认 UI 插件正常工作（如已安装）

## 🔧 故障排除

### 常见问题及解决方案

如果在运行应用程序时遇到错误，请尝试以下解决方案：

#### 问题 1：权限被拒绝

```bash
# 使脚本可执行
chmod +x /GooseLang-Dev/packages/gooselang/bin/gooselang.js

# 重新尝试运行
yarn debug --port=2333 --watch
```

#### 问题 2：端口已被占用

```bash
# 检查端口占用情况
sudo lsof -i :2333

# 如需要，终止占用进程
sudo kill -9 <PID>

# 或使用不同的端口
yarn debug --port=2334 --watch
```

#### 问题 3：行尾符问题（Windows/WSL）

```bash
# 安装 dos2unix 工具
sudo apt-get install dos2unix

# 转换 gooselang 脚本的行尾符
dos2unix /GooseLang-Dev/packages/gooselang/bin/gooselang.js
```

> **📞 技术支持**：如果您仍然遇到问题，请查看我们的 [GitHub 问题页面](https://github.com/GooseLang-Dev/GooseLang/issues) 或向社区寻求帮助。

