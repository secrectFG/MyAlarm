import { Platform } from "react-native";

class NotificationService {
  constructor() {
    this.isWeb = Platform.OS === "web";
    this.permission = "default";

    if (this.isWeb) {
      this.initWebNotifications();
    } else {
      this.initReactNativeNotifications();
    }
  }

  // Web通知初始化
  async initWebNotifications() {
    if ("Notification" in window) {
      this.permission = Notification.permission;
      if (this.permission === "default") {
        try {
          this.permission = await Notification.requestPermission();
        } catch (error) {
          console.error("请求通知权限失败:", error);
        }
      }
    }
  }

  // React Native通知初始化
  async initReactNativeNotifications() {
    // 在Web环境下不初始化React Native通知
    if (this.isWeb) {
      console.log("Web环境，跳过React Native通知初始化");
      return;
    }

    try {
      // 动态导入 React Native 通知库
      const PushNotification = await import(
        "react-native-push-notification"
      ).then((module) => module.default);

      PushNotification.configure({
        onRegister: function (token) {
          console.log("TOKEN:", token);
        },
        onNotification: function (notification) {
          console.log("NOTIFICATION:", notification);
        },
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },
        popInitialNotification: true,
        requestPermissions: true,
      });

      // 创建默认通知通道（Android 8.0+）
      PushNotification.createChannel(
        {
          channelId: "alarm-channel",
          channelName: "闹钟提醒",
          channelDescription: "闹钟应用的提醒通知",
          soundName: "default",
          importance: 4,
          vibrate: true,
        },
        (created) => console.log(`通知通道创建${created ? "成功" : "失败"}`)
      );

      this.PushNotification = PushNotification;
      this.permission = "granted";
    } catch (error) {
      console.error("React Native 通知初始化失败:", error);
    }
  }

  // 请求通知权限
  async requestPermission() {
    if (this.isWeb) {
      if ("Notification" in window) {
        try {
          this.permission = await Notification.requestPermission();
          return this.permission;
        } catch (error) {
          console.error("请求通知权限失败:", error);
          return "denied";
        }
      }
    } else {
      // React Native 权限在初始化时已请求
      return this.permission;
    }
    return "denied";
  }

  // 显示通知
  showNotification(title, body, options = {}) {
    if (this.permission !== "granted") {
      console.log("没有通知权限");
      return null;
    }

    if (this.isWeb) {
      return this.showWebNotification(title, body, options);
    } else {
      return this.showReactNativeNotification(title, body, options);
    }
  }

  // Web通知
  showWebNotification(title, body, options = {}) {
    if ("Notification" in window) {
      const notification = new Notification(title, {
        body: body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "alarm-notification",
        requireInteraction: true,
        silent: false,
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // 10秒后自动关闭
      setTimeout(() => {
        notification.close();
      }, 10000);

      return notification;
    }
    return null;
  }

  // React Native通知
  showReactNativeNotification(title, body, options = {}) {
    if (this.PushNotification) {
      this.PushNotification.localNotification({
        title: title,
        message: body,
        channelId: "alarm-channel",
        importance: "high",
        priority: "high",
        vibrate: true,
        vibration: 300,
        playSound: true,
        soundName: "default",
        actions: ["关闭"],
        invokeApp: true,
        ...options,
      });

      return true;
    }
    return null;
  }

  // 取消所有通知
  cancelAllNotifications() {
    if (this.isWeb) {
      // Web通知没有直接的取消所有方法
      console.log("Web通知无法批量取消");
    } else if (this.PushNotification) {
      this.PushNotification.cancelAllLocalNotifications();
    }
  }

  // 检查权限状态
  getPermissionStatus() {
    return this.permission;
  }

  // 是否支持通知
  isSupported() {
    if (this.isWeb) {
      return "Notification" in window;
    } else {
      return !!this.PushNotification;
    }
  }
}

// 创建单例实例
const notificationService = new NotificationService();

export default notificationService;
