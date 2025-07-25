---
sidebar_position: 5
id: checklist-&-troubleshoot
title: Checklist & Troubleshoot
---

# ✅ Checklist & Troubleshooting

## Verification Checklist

After installation, verify everything is working by checking these items:

- [ ] System packages are updated
- [ ] Node.js and Yarn are installed and working
- [ ] Project dependencies are installed successfully
- [ ] Backend server starts without errors
- [ ] Frontend development server starts without errors
- [ ] You can access the application in your browser
- [ ] Default UI addon is working (if installed)

## 🔧 Troubleshooting

### Common Issues and Solutions

If you encounter errors when running the application, try these solutions:

#### Issue 1: Permission Denied

```bash
# Make the script executable
chmod +x /GooseLang-Dev/packages/gooselang/bin/gooselang.js

# Try running again
yarn debug --port=2333 --watch
```

#### Issue 2: Port Already in Use

```bash
# Check what's using the port
sudo lsof -i :2333

# Kill the process if needed
sudo kill -9 <PID>

# Or use a different port
yarn debug --port=2334 --watch
```

#### Issue 3: Line Ending Problems (Windows/WSL)

```bash
# Install dos2unix utility
sudo apt-get install dos2unix

# Convert line endings in the gooselang script
dos2unix /GooseLang-Dev/packages/gooselang/bin/gooselang.js
```

> **📞 Support**: If you continue to experience issues, please check our [GitHub issues page](https://github.com/GooseLang-Dev/GooseLang/issues) or reach out to the community for help.

