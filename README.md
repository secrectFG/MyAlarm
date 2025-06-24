# 我的闹钟 (MyAlarm)

一个简单的React Native闹钟应用。

## 功能特性

- ✅ 实时时钟显示
- ✅ 添加自定义闹钟
- ✅ 设置闹钟标签
- ✅ 选择重复日期
- ✅ 开启/关闭闹钟
- ✅ 删除闹钟
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

### 💻 PC浏览器测试
在浏览器中运行（React Native Web）：
```bash
yarn web
```
然后在浏览器中打开 `http://localhost:3000`

### 🔧 Android模拟器设置
1. 下载安装 [Android Studio](https://developer.android.com/studio)
2. 打开Android Studio > More Actions > Virtual Device Manager
3. 创建并启动一个Android虚拟设备
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
3. 设置时间、标签和重复日期
4. 在闹钟列表中可以开启/关闭或删除闹钟
5. 闹钟到时会弹出提醒

## 技术栈

- React Native 0.80.0
- React 18.2.0
- JavaScript (ES6+) 