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

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarms, setAlarms] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 检查闹钟是否到时
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTimeString = `${now
        .getHours()
        .toString()
        .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

      alarms.forEach((alarm) => {
        if (
          alarm.isActive &&
          alarm.time === currentTimeString &&
          now.getSeconds() === 0
        ) {
          Alert.alert("闹钟提醒", `闹钟响了！${alarm.label}`);
          // 闹钟响后可以选择关闭或延迟
          setAlarms((prevAlarms) =>
            prevAlarms.map((a) =>
              a.id === alarm.id ? { ...a, isActive: false } : a
            )
          );
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* 标题栏 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>我的闹钟</Text>
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
    backgroundColor: "#1a1a2e",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#16213e",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: "#0f4c75",
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
