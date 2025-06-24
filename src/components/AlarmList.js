import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";

const AlarmItem = ({
  alarm,
  onToggle,
  onDelete,
  onSkipToday,
  onCancelSkipToday,
}) => {
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const weekDayNames = [
      "周日",
      "周一",
      "周二",
      "周三",
      "周四",
      "周五",
      "周六",
    ];
    const weekDay = weekDayNames[date.getDay()];
    return `${year}年${month}月${day}日 ${weekDay}`;
  };

  // 检查今天是否被跳过
  const today = new Date().toISOString().split("T")[0];
  const skippedDates = alarm.skippedDates || [];
  const isTodaySkipped = skippedDates.includes(today);

  // 检查今天是否是重复日期
  const isRepeatAlarm =
    !alarm.isSpecificDate && alarm.repeat && alarm.repeat.length > 0;
  const weekDayNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const todayWeekDay = weekDayNames[new Date().getDay()];
  const shouldShowSkipButton =
    isRepeatAlarm && alarm.repeat.includes(todayWeekDay);

  return (
    <View style={styles.alarmItem}>
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
                重复: {alarm.repeat.join(", ")}
              </Text>
              {isTodaySkipped && shouldShowSkipButton && (
                <Text style={styles.skipStatus}>今日已跳过</Text>
              )}
            </>
          )
        )}
      </View>

      <View style={styles.alarmActions}>
        <Switch
          value={alarm.isActive}
          onValueChange={() => onToggle(alarm.id)}
          trackColor={{ false: "#767577", true: "#0f4c75" }}
          thumbColor={alarm.isActive ? "#3282b8" : "#f4f3f4"}
        />

        {/* 今日跳过按钮 - 只对重复闹钟显示 */}
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
              {isTodaySkipped ? "取消跳过" : "今日跳过"}
            </Text>
          </TouchableOpacity>
        )}

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
}) => {
  const renderAlarmItem = ({ item }) => (
    <AlarmItem
      alarm={item}
      onToggle={onToggle}
      onDelete={onDelete}
      onSkipToday={onSkipToday}
      onCancelSkipToday={onCancelSkipToday}
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
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#bbbbbb",
    textAlign: "center",
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: "#888888",
    textAlign: "center",
  },
  alarmItem: {
    flexDirection: "row",
    backgroundColor: "#16213e",
    padding: 20,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  alarmInfo: {
    flex: 1,
  },
  alarmTime: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    fontFamily: "monospace",
  },
  alarmLabel: {
    fontSize: 16,
    color: "#bbbbbb",
    marginTop: 5,
  },
  alarmRepeat: {
    fontSize: 12,
    color: "#888888",
    marginTop: 3,
  },
  skipStatus: {
    fontSize: 11,
    color: "#f39c12",
    marginTop: 2,
    fontWeight: "bold",
  },
  alarmActions: {
    alignItems: "center",
  },
  skipButton: {
    backgroundColor: "#f39c12",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
    minWidth: 60,
    alignItems: "center",
  },
  skipButtonActive: {
    backgroundColor: "#e67e22",
  },
  skipButtonText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
  skipButtonTextActive: {
    color: "#ffffff",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default AlarmList;
