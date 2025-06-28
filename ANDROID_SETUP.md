# Android 开发环境配置指南

## 🤖 自动化安装脚本

### 一键安装所有工具

```powershell
# 运行自动化安装脚本
.\setup-android-env.ps1
```

### 可选参数

```powershell
# 跳过 JDK 安装（如果已有合适版本）
.\setup-android-env.ps1 -SkipJDK

# 跳过 Android Studio 安装（如果已安装）
.\setup-android-env.ps1 -SkipAndroidStudio

# 详细输出模式
.\setup-android-env.ps1 -Verbose
```

## 🛠️ 脚本功能说明

该脚本将自动完成以下任务：

### 1. 安装包管理器

- 自动安装 Chocolatey 包管理器
- 用于后续软件的自动化安装

### 2. 安装 JDK 17

- 检查当前 JDK 版本
- 如果版本不兼容，自动安装 OpenJDK 17
- 配置 JAVA_HOME 环境变量

### 3. 安装 Android Studio

- 优先使用 Chocolatey 安装
- 如果失败，自动下载官方安装包
- 提供安装向导指导

### 4. 配置环境变量

- 自动设置 ANDROID_HOME
- 添加 Android SDK 工具到 PATH
- 包含 platform-tools, tools, tools/bin

### 5. 创建配置文件

- 生成 gradle.properties 文件
- 优化 Gradle 构建性能
- 启用 AndroidX 和 Jetifier

### 6. 验证安装

- 检查 Java 版本
- 验证 ADB 工具
- 运行 React Native doctor 诊断

## 📋 安装后步骤

脚本运行完成后，你需要手动完成以下步骤：

### 1. 启动 Android Studio

```powershell
# 启动 Android Studio
& "${env:ProgramFiles}\Android\Android Studio\bin\studio64.exe"
```

### 2. 完成 Android Studio 初始设置

- 选择 "Standard" 安装类型
- 等待 SDK 组件下载完成
- 接受所有许可协议

### 3. 创建 Android Virtual Device (AVD)

1. 打开 AVD Manager
2. 点击 "Create Virtual Device"
3. 选择设备类型（推荐 Pixel 6）
4. 选择系统镜像（推荐 API 30+）
5. 配置 AVD 设置并创建

### 4. 启动模拟器

```powershell
# 列出所有可用的 AVD
emulator -list-avds

# 启动指定的 AVD
emulator -avd "你的AVD名称"
```

### 5. 测试 React Native 应用

```powershell
# 在新终端中启动 Metro 服务器
yarn start

# 在另一个终端中运行 Android 应用
yarn android
```

## 🔧 手动安装指南

如果自动脚本失败，可以手动安装：

### 1. 下载 Android Studio

- 访问：https://developer.android.com/studio
- 下载 Windows 版本
- 运行安装程序

### 2. 下载 JDK 17

- 访问：https://jdk.java.net/17/
- 下载 Windows x64 版本
- 解压到 `C:\Program Files\Java\jdk-17`

### 3. 配置环境变量

```powershell
# 设置 JAVA_HOME
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-17", "User")

# 设置 ANDROID_HOME
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:LOCALAPPDATA\Android\Sdk", "User")

# 更新 PATH
$newPath = $env:PATH + ";$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools"
[Environment]::SetEnvironmentVariable("PATH", $newPath, "User")
```

## 🚨 常见问题解决

### 问题 1: 权限不足

**解决方案：** 以管理员身份运行 PowerShell

### 问题 2: Chocolatey 安装失败

**解决方案：** 手动安装 Chocolatey 或使用手动安装方式

### 问题 3: 网络连接问题

**解决方案：** 使用 VPN 或手动下载安装包

### 问题 4: 虚拟化未启用

**解决方案：**

- 在 BIOS 中启用 VT-x/AMD-V
- 在 Windows 功能中启用 Hyper-V 或 Windows Hypervisor Platform

### 问题 5: 模拟器启动失败

**解决方案：**

- 确保 BIOS 中启用了虚拟化
- 检查 Android SDK 是否正确安装
- 尝试重新创建 AVD

## 📞 技术支持

如果遇到问题，请：

1. 检查系统要求（Windows 10+, 8GB+ RAM）
2. 确保网络连接正常
3. 查看 Android Studio 的官方文档
