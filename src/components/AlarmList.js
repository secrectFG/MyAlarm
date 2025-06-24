import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";

const AlarmItem = ({ alarm, onToggle, onDelete }) => {
  return (
    <View style={styles.alarmItem}>
      <View style={styles.alarmInfo}>
        <Text style={styles.alarmTime}>{alarm.time}</Text>
        <Text style={styles.alarmLabel}>{alarm.label}</Text>
        {alarm.repeat && alarm.repeat.length > 0 && (
          <Text style={styles.alarmRepeat}>
            重复: {alarm.repeat.join(", ")}
          </Text>
        )}
      </View>

      <View style={styles.alarmActions}>
        <Switch
          value={alarm.isActive}
          onValueChange={() => onToggle(alarm.id)}
          trackColor={{ false: "#767577", true: "#0f4c75" }}
          thumbColor={alarm.isActive ? "#3282b8" : "#f4f3f4"}
        />
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

const AlarmList = ({ alarms, onToggle, onDelete }) => {
  const renderAlarmItem = ({ item }) => (
    <AlarmItem alarm={item} onToggle={onToggle} onDelete={onDelete} />
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
  alarmActions: {
    alignItems: "center",
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
