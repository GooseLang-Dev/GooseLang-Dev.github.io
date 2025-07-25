# 🚀 Environment Setup

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

## 📦 Install Node.js and npm

Node.js and npm are essential for running the GooseLang development environment:

```bash
# Install Node.js and npm together
sudo apt-get install nodejs npm -y

# Verify the installation
node --version
npm --version
```

> **🔍 Verification**: You should see version numbers displayed for both Node.js and npm. If you see "command not found", the installation may have failed.

## 🛠️ Project Setup

Once you have all the prerequisites installed, you can set up the project:

```bash
# Install yarn package manager globally
npm install -g yarn

# Verify yarn installation
yarn --version
```

## 📥 Installing `git`

Install `git` using the following command:

```bash
# Install Git if not already installed
sudo apt-get install git -y

# Verify Git installation
git --version
```

Now clone the GooseLang repository and navigate to the project directory:

```bash
# Create a development directory (optional)
mkdir ~/Development
cd ~/Development

# Clone the repository
git clone https://github.com/GooseLang-Dev/GooseLang.git

# Navigate to the project directory
cd GooseLang

# Verify you're in the correct directory
pwd
```

> **💡 Tip**: The repository will be cloned into a new directory called `GooseLang`. Make sure you're in the directory where you want to create this folder before running the clone command.

Your development environment is now ready for GooseLang development. You can proceed with project-specific setup steps in the next guide.

