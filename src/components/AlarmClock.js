import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AlarmClock = ({ currentTime }) => {
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return { hours, minutes, seconds };
  };

  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("zh-CN", options);
  };

  const { hours, minutes, seconds } = formatTime(currentTime);

  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>
          {hours}:{minutes}
        </Text>
        <Text style={styles.secondsText}>:{seconds}</Text>
      </View>
      <Text style={styles.dateText}>{formatDate(currentTime)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#FFC107",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  timeText: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#333333",
    fontFamily: "monospace",
  },
  secondsText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#666666",
    fontFamily: "monospace",
  },
  dateText: {
    fontSize: 16,
    color: "#555555",
    marginTop: 10,
  },
});

export default AlarmClock;
