import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SearchX, AlertCircle, RefreshCw, Ticket } from "lucide-react-native";

export default function EmptyState({
  type = "empty", // 'empty' | 'no-trips' | 'error'
  title,
  subtitle,
  onAction,
  actionLabel,
}) {
  const isError = type === "error";
  const isNoTrips = type === "no-trips";

  const defaultTitle = isError
    ? "Something went wrong"
    : isNoTrips
      ? "No upcoming trips"
      : "No results found";

  const defaultSub = isError
    ? "Unable to load details right now. Please check your network connection."
    : isNoTrips
      ? "You have no booked trips. Start exploring new destinations today!"
      : "Try changing your search parameters or clearing applied filters.";

  const defaultActionText = isError ? "Try Again" : isNoTrips ? "Book a Journey" : "Reset Filters";

  const IconComponent = isError ? AlertCircle : isNoTrips ? Ticket : SearchX;
  const iconColor = isError ? "#EF4444" : "#64748B";
  const iconBg = isError ? "#FEF2F2" : "#F1F5F9";

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
        <IconComponent size={36} color={iconColor} strokeWidth={1.8} />
      </View>

      <View style={styles.textCol}>
        <Text style={styles.title}>{title || defaultTitle}</Text>
        <Text style={styles.subtitle}>{subtitle || defaultSub}</Text>
      </View>

      {onAction && (
        <TouchableOpacity
          onPress={onAction}
          style={[styles.actionBtn, isError && styles.errorBtn]}
          activeOpacity={0.8}
        >
          {isError && <RefreshCw size={14} color="#FFFFFF" />}
          <Text style={styles.actionBtnText}>{actionLabel || defaultActionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
    gap: 16,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  textCol: {
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
    maxWidth: 280,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#D13239",
    marginTop: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  errorBtn: {
    backgroundColor: "#EF4444",
  },
  actionBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
