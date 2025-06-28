import React, { useState, useRef } from "react";
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
  const [isSpecificDate, setIsSpecificDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const dateInputRef = useRef(null);

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

  const toggleAllDays = () => {
    const allDayKeys = weekDays.map((day) => day.key);
    if (selectedDays.length === weekDays.length) {
      // 如果已经选择了所有天，则取消选择
      setSelectedDays([]);
    } else {
      // 否则选择所有天
      setSelectedDays(allDayKeys);
    }
  };

  const handleSpecificDateMode = () => {
    setIsSpecificDate(true);
    setSelectedDays([]);
    // 设置默认日期为今天
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setSelectedDate(formattedDate);
  };

  const handleRepeatMode = () => {
    setIsSpecificDate(false);
    setSelectedDate("");
  };

  const handleDateChange = (date) => {
    const today = new Date();
    const selectedDateObj = new Date(date);

    // 不允许选择早于今天的日期
    if (selectedDateObj >= today.setHours(0, 0, 0, 0)) {
      setSelectedDate(date);
    } else {
      Alert.alert("错误", "不能选择早于今天的日期");
    }
  };

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

    // 验证重复或指定日期设置
    if (!isSpecificDate && selectedDays.length === 0) {
      Alert.alert("错误", "请选择重复日期或指定具体日期");
      return;
    }

    if (isSpecificDate && !selectedDate) {
      Alert.alert("错误", "请选择具体日期");
      return;
    }

    const alarmData = {
      time: time,
      label: label.trim() || "闹钟",
      repeat: isSpecificDate ? [] : selectedDays,
      specificDate: isSpecificDate ? selectedDate : null,
      isSpecificDate: isSpecificDate,
    };

    onAdd(alarmData);
    resetForm();
  };

  const resetForm = () => {
    setTime("");
    setLabel("");
    setSelectedDays([]);
    setIsSpecificDate(false);
    setSelectedDate("");
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
              <Text style={styles.sectionTitle}>提醒方式</Text>

              {/* 选择模式按钮 */}
              <View style={styles.modeContainer}>
                <TouchableOpacity
                  style={[
                    styles.modeButton,
                    !isSpecificDate && styles.modeButtonSelected,
                  ]}
                  onPress={handleRepeatMode}
                >
                  <Text
                    style={[
                      styles.modeButtonText,
                      !isSpecificDate && styles.modeButtonTextSelected,
                    ]}
                  >
                    重复
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modeButton,
                    isSpecificDate && styles.modeButtonSelected,
                  ]}
                  onPress={handleSpecificDateMode}
                >
                  <Text
                    style={[
                      styles.modeButtonText,
                      isSpecificDate && styles.modeButtonTextSelected,
                    ]}
                  >
                    指定日期
                  </Text>
                </TouchableOpacity>
              </View>

              {/* 重复模式界面 */}
              {!isSpecificDate && (
                <>
                  {/* 每天按钮 */}
                  <TouchableOpacity
                    style={[
                      styles.everyDayButton,
                      selectedDays.length === weekDays.length &&
                        styles.everyDayButtonSelected,
                    ]}
                    onPress={toggleAllDays}
                  >
                    <Text
                      style={[
                        styles.everyDayButtonText,
                        selectedDays.length === weekDays.length &&
                          styles.everyDayButtonTextSelected,
                      ]}
                    >
                      每天
                    </Text>
                  </TouchableOpacity>

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
                </>
              )}

              {/* 指定日期模式界面 */}
              {isSpecificDate && (
                <View style={styles.datePickerContainer}>
                  <Text style={styles.dateLabel}>选择日期</Text>

                  {/* 隐藏的日期输入 */}
                  <input
                    ref={dateInputRef}
                    type="date"
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    style={{ display: "none" }}
                  />

                  {/* 可点击的日期显示区域 */}
                  <TouchableOpacity
                    style={styles.dateSelectButton}
                    onPress={() => {
                      if (dateInputRef.current) {
                        dateInputRef.current.showPicker
                          ? dateInputRef.current.showPicker()
                          : dateInputRef.current.click();
                      }
                    }}
                  >
                    <View style={styles.dateDisplayContainer}>
                      {selectedDate ? (
                        <>
                          <Text style={styles.selectedDateMain}>
                            {formatDateForDisplay(selectedDate)}
                          </Text>
                          <Text style={styles.dateHint}>点击修改日期</Text>
                        </>
                      ) : (
                        <>
                          <Text style={styles.datePrompt}>点击选择日期</Text>
                          <Text style={styles.dateHint}>📅</Text>
                        </>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              )}
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
    backgroundColor: "#FFFDE7",
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
    borderBottomColor: "#FFD54F",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },
  closeButton: {
    fontSize: 20,
    color: "#666666",
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
    color: "#333333",
    marginBottom: 10,
  },
  timeInput: {
    backgroundColor: "#FFF8E1",
    color: "#333333",
    fontSize: 24,
    fontFamily: "monospace",
    textAlign: "center",
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFD54F",
  },
  labelInput: {
    backgroundColor: "#FFF8E1",
    color: "#333333",
    fontSize: 16,
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFD54F",
  },
  everyDayButton: {
    backgroundColor: "#FFF8E1",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#FF9800",
    alignItems: "center",
    alignSelf: "center",
  },
  everyDayButtonSelected: {
    backgroundColor: "#FF9800",
  },
  everyDayButtonText: {
    color: "#FF9800",
    fontSize: 16,
    fontWeight: "bold",
  },
  everyDayButtonTextSelected: {
    color: "#ffffff",
  },
  modeContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  modeButton: {
    flex: 1,
    backgroundColor: "#FFF8E1",
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFD54F",
  },
  modeButtonSelected: {
    backgroundColor: "#FFD54F",
  },
  modeButtonText: {
    color: "#666666",
    fontSize: 16,
    fontWeight: "bold",
  },
  modeButtonTextSelected: {
    color: "#333333",
  },
  datePickerContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  dateLabel: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 15,
    fontWeight: "bold",
  },
  dateSelectButton: {
    backgroundColor: "#FFF8E1",
    borderWidth: 2,
    borderColor: "#FFD54F",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    alignItems: "center",
    minHeight: 80,
    justifyContent: "center",
  },
  dateDisplayContainer: {
    alignItems: "center",
  },
  selectedDateMain: {
    fontSize: 18,
    color: "#333333",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  datePrompt: {
    fontSize: 18,
    color: "#FF9800",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  dateHint: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  dayButton: {
    backgroundColor: "#FFF8E1",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#FFD54F",
    minWidth: 45,
    alignItems: "center",
  },
  dayButtonSelected: {
    backgroundColor: "#FFD54F",
  },
  dayButtonText: {
    color: "#666666",
    fontSize: 12,
    fontWeight: "bold",
  },
  dayButtonTextSelected: {
    color: "#333333",
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#FFD54F",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#BDBDBD",
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
    backgroundColor: "#FF9800",
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
