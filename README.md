# 我的闹钟 (MyAlarm)

一个简单的 React Native 闹钟应用。

## 功能特性

- ✅ 实时时钟显示
- ✅ 添加自定义闹钟
- ✅ 设置闹钟标签
- ✅ 选择重复日期或指定日期
- ✅ 今日跳过功能（重复闹钟）
- ✅ 开启/关闭闹钟
- ✅ 删除闹钟
- ✅ 系统通知提醒
- ✅ 跨平台支持（Web/Android/iOS）
- ✅ 美观的深色主题界面

## 安装和运行

1. 安装依赖：

```bash
yarn install
```

2. 运行项目：

### 📱 移动设备/模拟器

对于 Android：

```bash
yarn android
```

对于 iOS：

```bash
yarn ios
```

### 💻 PC 浏览器测试

在浏览器中运行（React Native Web）：

```bash
yarn web
```

然后在浏览器中打开 `http://localhost:3000`

### 🔧 Android 模拟器设置

1. 下载安装 [Android Studio](https://developer.android.com/studio)
2. 打开 Android Studio > More Actions > Virtual Device Manager
3. 创建并启动一个 Android 虚拟设备
4. 运行 `yarn android`

## 项目结构

```
MyAlarm/
├── App.js                    # 主应用组件
├── src/
│   └── components/
│       ├── AlarmClock.js     # 时钟显示组件
│       ├── AlarmList.js      # 闹钟列表组件
│       └── AddAlarmModal.js  # 添加闹钟模态框
├── package.json
└── README.md
```

## 使用说明

1. 打开应用后可以看到当前时间
2. 点击右上角的 "+" 按钮添加新闹钟
3. 设置时间、标签
4. 选择"重复"模式设置重复日期，或选择"指定日期"设置具体日期
5. 在闹钟列表中可以开启/关闭、今日跳过或删除闹钟
6. 闹钟到时会同时显示应用内提醒和系统通知

## 通知功能

### 🌐 Web 版本

- 首次使用时会请求通知权限
- 支持浏览器原生通知
- 可在系统通知栏中查看闹钟提醒

### 📱 Android 版本

- 支持本地推送通知
- 在 Android 通知界面显示闹钟信息
- 支持振动和声音提醒
- 适配 Android 8.0+通知通道

### 🍎 iOS 版本

- 支持本地推送通知
- 在 iOS 通知中心显示
- 支持声音和横幅提醒

## 技术栈

- React Native 0.80.0
- React 18.2.0
- JavaScript (ES6+)
