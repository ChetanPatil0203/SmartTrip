import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowLeft } from "lucide-react-native";

export default function Header({ title, subtitle, onBack, right, red, categoryColor }) {
  const bgStyle = categoryColor
    ? { backgroundColor: categoryColor }
    : red
      ? styles.redBg
      : styles.whiteBg;

  const textColor = categoryColor || red ? "#FFFFFF" : "#0F172A";
  const subColor = categoryColor || red ? "rgba(255, 255, 255, 0.75)" : "#64748B";

  return (
    <View style={[styles.container, bgStyle]}>
      {onBack && (
        <TouchableOpacity
          onPress={onBack}
          style={[styles.backBtn, (categoryColor || red) && styles.backBtnDark]}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={textColor} strokeWidth={2.2} />
        </TouchableOpacity>
      )}
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: subColor }]} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      {right && <View style={styles.rightContainer}>{right}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    gap: 12,
  },
  whiteBg: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  redBg: {
    backgroundColor: "#D13239",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
  },
  backBtnDark: {
    backgroundColor: "rgba(255, 255, 255, 0.18)",
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
