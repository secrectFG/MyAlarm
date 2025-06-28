import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  StatusBar,
} from "react-native";

import AlarmClock from "./components/AlarmClock";
import AlarmList from "./components/AlarmList";
import AddAlarmModal from "./components/AddAlarmModal";
import NotificationService from "./services/NotificationService";

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarms, setAlarms] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notificationPermission, setNotificationPermission] =
    useState("default");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 初始化通知服务
  useEffect(() => {
    const initNotifications = async () => {
      const permission = await NotificationService.requestPermission();
      setNotificationPermission(permission);
    };

    initNotifications();
  }, []);

  // 检查闹钟是否到时
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTimeString = `${now
        .getHours()
        .toString()
        .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
      const currentDateString = now.toISOString().split("T")[0];

      alarms.forEach((alarm) => {
        if (
          alarm.isActive &&
          alarm.time === currentTimeString &&
          now.getSeconds() === 0
        ) {
          let shouldTrigger = false;

          if (alarm.isSpecificDate && alarm.specificDate) {
            // 指定日期闹钟：只在指定日期触发
            if (alarm.specificDate === currentDateString) {
              shouldTrigger = true;
              // 指定日期闹钟触发后自动删除
              setAlarms((prevAlarms) =>
                prevAlarms.filter((a) => a.id !== alarm.id)
              );
            }
          } else if (alarm.repeat && alarm.repeat.length > 0) {
            // 重复闹钟：检查是否在重复日期中
            const weekDayNames = [
              "周日",
              "周一",
              "周二",
              "周三",
              "周四",
              "周五",
              "周六",
            ];
            const currentWeekDay = weekDayNames[now.getDay()];

            // 检查今天是否被跳过
            const skippedDates = alarm.skippedDates || [];
            const isTodaySkipped = skippedDates.includes(currentDateString);

            if (alarm.repeat.includes(currentWeekDay) && !isTodaySkipped) {
              shouldTrigger = true;
              // 重复闹钟不删除，只是关闭
              setAlarms((prevAlarms) =>
                prevAlarms.map((a) =>
                  a.id === alarm.id ? { ...a, isActive: false } : a
                )
              );
            }
          }

          if (shouldTrigger) {
            const alertMessage = alarm.isSpecificDate
              ? `指定日期闹钟响了！${alarm.label}`
              : `闹钟响了！${alarm.label}`;

            // 显示Alert对话框
            Alert.alert("闹钟提醒", alertMessage);

            // 同时显示系统通知
            const notificationTitle = "⏰ 闹钟提醒";
            const notificationBody = alarm.isSpecificDate
              ? `指定日期闹钟：${alarm.label} (${alarm.time})`
              : `重复闹钟：${alarm.label} (${alarm.time})`;

            NotificationService.showNotification(
              notificationTitle,
              notificationBody,
              {
                icon: "/favicon.ico",
                badge: "/favicon.ico",
                actions: [
                  {
                    action: "dismiss",
                    title: "关闭",
                  },
                ],
              }
            );
          }
        }
      });
    };

    checkAlarms();
  }, [currentTime, alarms]);

  const addAlarm = (alarmData) => {
    const newAlarm = {
      id: Date.now().toString(),
      ...alarmData,
      isActive: true,
    };
    setAlarms([...alarms, newAlarm]);
    setShowAddModal(false);
  };

  const toggleAlarm = (id) => {
    setAlarms(
      alarms.map((alarm) =>
        alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm
      )
    );
  };

  const deleteAlarm = (id) => {
    setAlarms(alarms.filter((alarm) => alarm.id !== id));
  };

  const skipTodayAlarm = (id) => {
    const today = new Date().toISOString().split("T")[0];
    setAlarms(
      alarms.map((alarm) => {
        if (alarm.id === id) {
          const skippedDates = alarm.skippedDates || [];
          if (!skippedDates.includes(today)) {
            return {
              ...alarm,
              skippedDates: [...skippedDates, today],
            };
          }
        }
        return alarm;
      })
    );
  };

  const cancelSkipToday = (id) => {
    const today = new Date().toISOString().split("T")[0];
    setAlarms(
      alarms.map((alarm) => {
        if (alarm.id === id) {
          const skippedDates = alarm.skippedDates || [];
          return {
            ...alarm,
            skippedDates: skippedDates.filter((date) => date !== today),
          };
        }
        return alarm;
      })
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8E1" />

      {/* 标题栏 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>我的闹钟</Text>
          {notificationPermission !== "granted" && (
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={async () => {
                if (NotificationService.isSupported()) {
                  const permission =
                    await NotificationService.requestPermission();
                  setNotificationPermission(permission);
                  if (permission === "granted") {
                    Alert.alert("成功", "通知权限已获得！");
                  } else {
                    Alert.alert("提示", "请在浏览器设置中允许通知权限");
                  }
                } else {
                  Alert.alert("提示", "您的设备不支持通知功能");
                }
              }}
            >
              <Text style={styles.notificationButtonText}>
                {notificationPermission === "denied" ? "🔕" : "🔔"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* 当前时间显示 */}
      <AlarmClock currentTime={currentTime} />

      {/* 闹钟列表 */}
      <AlarmList
        alarms={alarms}
        onToggle={toggleAlarm}
        onDelete={deleteAlarm}
        onSkipToday={skipTodayAlarm}
        onCancelSkipToday={cancelSkipToday}
      />

      {/* 添加闹钟模态框 */}
      <AddAlarmModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addAlarm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E1",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#FFE082",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
  },
  notificationButton: {
    marginLeft: 15,
    width: 32,
    height: 32,
    backgroundColor: "#FF9800",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationButtonText: {
    fontSize: 16,
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: "#F57C00",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export default App;
