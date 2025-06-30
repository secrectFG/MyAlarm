import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';

const AlarmItem = ({
  alarm,
  onToggle,
  onDelete,
  onSkipToday,
  onCancelSkipToday,
  onEdit,
}) => {
  const formatDateForDisplay = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const weekDayNames = [
      '周日',
      '周一',
      '周二',
      '周三',
      '周四',
      '周五',
      '周六',
    ];
    const weekDay = weekDayNames[date.getDay()];
    return `${year}年${month}月${day}日 ${weekDay}`;
  };

  // 检查今天是否被跳过
  const today = new Date().toISOString().split('T')[0];
  const skippedDates = alarm.skippedDates || [];
  const isTodaySkipped = skippedDates.includes(today);

  // 检查今天是否是重复日期
  const isRepeatAlarm =
    !alarm.isSpecificDate && alarm.repeat && alarm.repeat.length > 0;
  const weekDayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const todayWeekDay = weekDayNames[new Date().getDay()];
  const shouldShowSkipButton =
    isRepeatAlarm && alarm.repeat.includes(todayWeekDay);

  return (
    <View style={styles.alarmItem}>
      <View style={styles.topRow}>
        <View style={styles.alarmInfo}>
          <Text style={styles.alarmTime}>{alarm.time}</Text>
          <Text style={styles.alarmLabel}>{alarm.label}</Text>
          {alarm.isSpecificDate && alarm.specificDate ? (
            <Text style={styles.alarmRepeat}>
              指定日期: {formatDateForDisplay(alarm.specificDate)}
            </Text>
          ) : (
            alarm.repeat &&
            alarm.repeat.length > 0 && (
              <>
                <Text style={styles.alarmRepeat}>
                  重复: {alarm.repeat.join(', ')}
                </Text>
                {isTodaySkipped && shouldShowSkipButton && (
                  <Text style={styles.skipStatus}>今日已跳过</Text>
                )}
              </>
            )
          )}
        </View>
        <Switch
          value={alarm.isActive}
          onValueChange={() => onToggle(alarm.id)}
          trackColor={{ false: '#CCCCCC', true: '#FFD54F' }}
          thumbColor={alarm.isActive ? '#FF9800' : '#f4f3f4'}
        />
      </View>

      <View style={styles.bottomActions}>
        {/* 今日跳过按钮 */}
        {shouldShowSkipButton && (
          <TouchableOpacity
            style={[
              styles.skipButton,
              isTodaySkipped && styles.skipButtonActive,
            ]}
            onPress={() => {
              if (isTodaySkipped) {
                onCancelSkipToday(alarm.id);
              } else {
                onSkipToday(alarm.id);
              }
            }}
          >
            <Text
              style={[
                styles.skipButtonText,
                isTodaySkipped && styles.skipButtonTextActive,
              ]}
            >
              {isTodaySkipped ? '取消跳过' : '今日跳过'}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onEdit(alarm)}
        >
          <Text style={styles.editButtonText}>编辑</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(alarm.id)}
        >
          <Text style={styles.deleteButtonText}>删除</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AlarmList = ({
  alarms,
  onToggle,
  onDelete,
  onSkipToday,
  onCancelSkipToday,
  onEdit,
}) => {
  const renderAlarmItem = ({ item }) => (
    <AlarmItem
      alarm={item}
      onToggle={onToggle}
      onDelete={onDelete}
      onSkipToday={onSkipToday}
      onCancelSkipToday={onCancelSkipToday}
      onEdit={onEdit}
    />
  );

  if (alarms.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>还没有设置任何闹钟</Text>
        <Text style={styles.emptySubText}>点击右上角的 + 按钮添加闹钟</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={alarms}
        renderItem={renderAlarmItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FFF8E1',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFF8E1',
  },
  emptyText: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  },
  alarmItem: {
    backgroundColor: '#FFECB3',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFD54F',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  alarmInfo: {
    flex: 1,
    marginRight: 10,
  },
  alarmTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'monospace',
  },
  alarmLabel: {
    fontSize: 16,
    color: '#555555',
    marginTop: 5,
  },
  alarmRepeat: {
    fontSize: 12,
    color: '#777777',
    marginTop: 3,
  },
  skipStatus: {
    fontSize: 11,
    color: '#FF9800',
    marginTop: 2,
    fontWeight: 'bold',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 213, 79, 0.5)',
    paddingTop: 10,
  },
  skipButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    marginLeft: 10,
  },
  skipButtonActive: {
    backgroundColor: '#F57C00',
  },
  skipButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  skipButtonTextActive: {
    color: '#ffffff',
  },
  deleteButton: {
    backgroundColor: '#E53935',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#1E88E5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AlarmList;
