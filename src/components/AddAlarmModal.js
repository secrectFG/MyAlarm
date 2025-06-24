import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

const AddAlarmModal = ({ visible, onClose, onAdd }) => {
  const [time, setTime] = useState("");
  const [label, setLabel] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);

  const weekDays = [
    { key: "周一", value: "monday" },
    { key: "周二", value: "tuesday" },
    { key: "周三", value: "wednesday" },
    { key: "周四", value: "thursday" },
    { key: "周五", value: "friday" },
    { key: "周六", value: "saturday" },
    { key: "周日", value: "sunday" },
  ];

  const handleTimeChange = (text) => {
    // 简单的时间格式验证和自动格式化
    let formattedText = text.replace(/[^\d]/g, "");
    if (formattedText.length >= 3) {
      formattedText =
        formattedText.slice(0, 2) + ":" + formattedText.slice(2, 4);
    }
    setTime(formattedText);
  };

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const validateTime = (timeString) => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeString);
  };

  const handleSave = () => {
    if (!time.trim()) {
      Alert.alert("错误", "请输入时间");
      return;
    }

    if (!validateTime(time)) {
      Alert.alert("错误", "请输入正确的时间格式 (HH:MM)");
      return;
    }

    const alarmData = {
      time: time,
      label: label.trim() || "闹钟",
      repeat: selectedDays,
    };

    onAdd(alarmData);
    resetForm();
  };

  const resetForm = () => {
    setTime("");
    setLabel("");
    setSelectedDays([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>添加闹钟</Text>
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* 时间输入 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>时间</Text>
              <TextInput
                style={styles.timeInput}
                value={time}
                onChangeText={handleTimeChange}
                placeholder="08:00"
                placeholderTextColor="#888888"
                keyboardType="numeric"
                maxLength={5}
              />
            </View>

            {/* 标签输入 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>标签</Text>
              <TextInput
                style={styles.labelInput}
                value={label}
                onChangeText={setLabel}
                placeholder="闹钟标签 (可选)"
                placeholderTextColor="#888888"
              />
            </View>

            {/* 重复设置 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>重复</Text>
              <View style={styles.daysContainer}>
                {weekDays.map((day) => (
                  <TouchableOpacity
                    key={day.value}
                    style={[
                      styles.dayButton,
                      selectedDays.includes(day.key) &&
                        styles.dayButtonSelected,
                    ]}
                    onPress={() => toggleDay(day.key)}
                  >
                    <Text
                      style={[
                        styles.dayButtonText,
                        selectedDays.includes(day.key) &&
                          styles.dayButtonTextSelected,
                      ]}
                    >
                      {day.key}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* 底部按钮 */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>保存</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#16213e",
    borderRadius: 15,
    width: "90%",
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2c3e50",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  closeButton: {
    fontSize: 20,
    color: "#bbbbbb",
    fontWeight: "bold",
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  timeInput: {
    backgroundColor: "#1a1a2e",
    color: "#ffffff",
    fontSize: 24,
    fontFamily: "monospace",
    textAlign: "center",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3282b8",
  },
  labelInput: {
    backgroundColor: "#1a1a2e",
    color: "#ffffff",
    fontSize: 16,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3282b8",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  dayButton: {
    backgroundColor: "#1a1a2e",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#3282b8",
    minWidth: 45,
    alignItems: "center",
  },
  dayButtonSelected: {
    backgroundColor: "#3282b8",
  },
  dayButtonText: {
    color: "#bbbbbb",
    fontSize: 12,
    fontWeight: "bold",
  },
  dayButtonTextSelected: {
    color: "#ffffff",
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#2c3e50",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#95a5a6",
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#3282b8",
    padding: 15,
    borderRadius: 10,
    marginLeft: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddAlarmModal;
