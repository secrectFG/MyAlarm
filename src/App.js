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
import notifee, { TriggerType, EventType } from '@notifee/react-native';

import AlarmClock from './components/AlarmClock';
import AlarmList from './components/AlarmList';
import AddAlarmModal from './components/AddAlarmModal';

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarms, setAlarms] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState(null);

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
        sound: 'alarm', // 尝试使用系统闹钟声音
        vibration: true,
        vibrationPattern: [1000, 2000, 1000, 2000], // 修正为偶数个正数
        importance: 4, // IMPORTANCE_HIGH
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
            actions: [
              {
                title: '关闭闹钟',
                pressAction: {
                  id: 'dismiss',
                },
              },
            ],
            // 立即显示（即使在免打扰模式下）
            importance: 4, // IMPORTANCE_HIGH
            category: 'alarm',
            fullScreenAction: {
              id: 'default',
              launchActivity: 'default',
            },
            autoCancel: false,
            ongoing: true,
            sound: 'alarm', // 明确指定闹钟声音
            vibrationPattern: [1000, 500, 1000, 500, 1000, 500], // 修正为偶数个正数
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

  const handleEdit = alarm => {
    setEditingAlarm(alarm);
    setShowAddModal(true);
  };

  const saveEditedAlarm = async editedAlarm => {
    // First, cancel the old notification before making changes
    await cancelNotification(editedAlarm.id);

    const newAlarms = alarms.map(alarm =>
      alarm.id === editedAlarm.id ? editedAlarm : alarm,
    );
    setAlarms(newAlarms);

    // If the alarm is active, schedule a new notification
    if (editedAlarm.isActive) {
      await scheduleNotification(editedAlarm);
    }

    setEditingAlarm(null);
    setShowAddModal(false);
  };

  const handleModalClose = () => {
    setEditingAlarm(null);
    setShowAddModal(false);
  };

  // 测试通知功能 - 真正的闹钟测试
  const testNotification = async () => {
    try {
      const channelId = await notifee.createChannel({
        id: 'test',
        name: 'Test Channel',
        sound: 'alarm',
        vibration: true,
        vibrationPattern: [1000, 2000, 1000, 2000], // 修正为偶数个正数
        importance: 4, // IMPORTANCE_HIGH
      });

      // 创建一个2秒后触发的闹钟测试
      const testTime = new Date(Date.now() + 2000); // 2秒后

      const trigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: testTime.getTime(),
      };

      await notifee.createTriggerNotification(
        {
          id: 'test-alarm-notification',
          title: '🔔 测试闹钟响了！',
          body: '这是2秒后的闹钟测试，应该会响铃和震动！',
          android: {
            channelId,
            pressAction: {
              id: 'default',
              launchActivity: 'default',
            },
            actions: [
              {
                title: '关闭测试闹钟',
                pressAction: {
                  id: 'dismiss-test',
                },
              },
            ],
            importance: 4,
            category: 'alarm',
            fullScreenAction: {
              id: 'default',
              launchActivity: 'default',
            },
            autoCancel: false,
            ongoing: true,
            sound: 'alarm',
            vibrationPattern: [1000, 500, 1000, 500], // 修正为偶数个正数
          },
        },
        trigger,
      );

      Alert.alert(
        '测试闹钟已设置',
        '2秒后将触发闹钟，请注意听声音和感受震动！',
      );
      console.log('Test alarm scheduled for:', testTime);
    } catch (error) {
      console.error('测试通知失败:', error);
      Alert.alert('错误', '测试通知发送失败: ' + error.message);
    }
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
    Alert.alert('提示', '此功能正在开发中。');
  };

  const cancelSkipToday = id => {
    Alert.alert('提示', '此功能正在开发中。');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8E1" />

      {/* 标题栏 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>我的闹钟</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.testButton}
            onPress={testNotification}
          >
            <Text style={styles.testButtonText}>测试</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
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
        onEdit={handleEdit}
      />

      {/* 添加闹钟模态框 */}
      <AddAlarmModal
        visible={showAddModal}
        onClose={handleModalClose}
        onAdd={addAlarm}
        alarmToEdit={editingAlarm}
        onEdit={saveEditedAlarm}
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
    paddingVertical: 15,
    backgroundColor: '#FFD54F',
    borderBottomWidth: 1,
    borderBottomColor: '#FFC107',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  testButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#FF9800',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default App;
