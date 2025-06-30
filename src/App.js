import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  StatusBar,
} from 'react-native';
import notifee, { TriggerType, TimestampTrigger } from '@notifee/react-native';

import AlarmClock from './components/AlarmClock';
import AlarmList from './components/AlarmList';
import AddAlarmModal from './components/AddAlarmModal';

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarms, setAlarms] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // 1. 应用启动时请求权限
  useEffect(() => {
    const requestPermission = async () => {
      await notifee.requestPermission();
    };
    requestPermission();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 2. 创建一个函数来调度通知
  const scheduleNotification = async alarm => {
    if (!alarm.isActive) return;

    try {
      const channelId = await notifee.createChannel({
        id: 'alarms',
        name: 'Alarms Channel',
        sound: 'default',
        vibration: true,
        vibrationPattern: [300, 500],
      });

      const now = new Date();
      const [hour, minute] = alarm.time.split(':');
      let alarmDate = new Date();
      alarmDate.setHours(parseInt(hour, 10));
      alarmDate.setMinutes(parseInt(minute, 10));
      alarmDate.setSeconds(0);
      alarmDate.setMilliseconds(0);

      // 如果闹钟时间已过，则设置为明天
      if (alarmDate.getTime() <= now.getTime()) {
        alarmDate.setDate(alarmDate.getDate() + 1);
      }

      const trigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: alarmDate.getTime(),
      };

      await notifee.createTriggerNotification(
        {
          id: alarm.id,
          title: '⏰ 闹钟提醒',
          body: `${alarm.label || '该起床了！'} (${alarm.time})`,
          android: {
            channelId,
            pressAction: {
              id: 'default',
              launchActivity: 'default',
            },
            // 立即显示（即使在免打扰模式下）
            importance: notifee.AndroidImportance.HIGH,
          },
        },
        trigger,
      );

      console.log(
        `Notification scheduled for alarm ${alarm.id} at ${alarmDate}`,
      );
    } catch (e) {
      console.error('Failed to schedule notification', e);
    }
  };

  // 3. 创建一个函数来取消通知
  const cancelNotification = async alarmId => {
    try {
      await notifee.cancelNotification(alarmId);
      console.log(`Notification cancelled for alarm ${alarmId}`);
    } catch (e) {
      console.error('Failed to cancel notification', e);
    }
  };

  const addAlarm = alarmData => {
    const newAlarm = {
      id: Date.now().toString(),
      ...alarmData,
      isActive: true,
    };
    setAlarms([...alarms, newAlarm]);
    // 调度新闹钟
    scheduleNotification(newAlarm);
    setShowAddModal(false);
  };

  const toggleAlarm = id => {
    let toggledAlarm;
    const newAlarms = alarms.map(alarm => {
      if (alarm.id === id) {
        toggledAlarm = { ...alarm, isActive: !alarm.isActive };
        return toggledAlarm;
      }
      return alarm;
    });
    setAlarms(newAlarms);

    // 根据状态调度或取消通知
    if (toggledAlarm) {
      if (toggledAlarm.isActive) {
        scheduleNotification(toggledAlarm);
      } else {
        cancelNotification(toggledAlarm.id);
      }
    }
  };

  const deleteAlarm = id => {
    setAlarms(alarms.filter(alarm => alarm.id !== id));
    // 删除闹钟时取消通知
    cancelNotification(id);
  };

  //  (跳过和取消跳过功能暂时简化，因为它们需要更复杂的调度逻辑)
  const skipTodayAlarm = id => {
    Alert.alert('提示', '此功能正在使用新的通知服务重构中。');
  };

  const cancelSkipToday = id => {
    Alert.alert('提示', '此功能正在使用新的通知服务重构中。');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8E1" />

      {/* 标题栏 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>我的闹钟</Text>
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
    backgroundColor: '#FFF8E1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#FFE082',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  notificationButton: {
    marginLeft: 15,
    width: 32,
    height: 32,
    backgroundColor: '#FF9800',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationButtonText: {
    fontSize: 16,
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#F57C00',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default App;
