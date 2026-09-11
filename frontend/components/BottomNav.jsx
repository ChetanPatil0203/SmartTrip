import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Home, Ticket, Tag, User } from "lucide-react-native";

const items = [
  { screen: "home", label: "Home", Icon: Home },
  { screen: "my-trips", label: "My Trips", Icon: Ticket },
  { screen: "offers", label: "Offers", Icon: Tag },
  { screen: "profile", label: "Profile", Icon: User },
];

export default function BottomNav({ current, onNavigate }) {
  return (
    <View style={styles.container}>
      {items.map(({ screen, label, Icon }) => {
        const active = current === screen;
        return (
          <TouchableOpacity
            key={screen}
            onPress={() => onNavigate(screen)}
            style={styles.navItem}
            activeOpacity={0.7}
          >
            {active && <View style={styles.activeIndicator} />}
            <View style={[styles.iconBox, active && styles.activeIconBox]}>
              <Icon
                size={active ? 22 : 20}
                strokeWidth={active ? 2.5 : 1.8}
                color={active ? "#D13239" : "#64748B"}
              />
            </View>
            <Text
              style={[
                styles.label,
                {
                  color: active ? "#D13239" : "#64748B",
                  fontWeight: active ? "800" : "600",
                },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    elevation: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    zIndex: 100,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    gap: 3,
    position: "relative",
  },
  activeIndicator: {
    position: "absolute",
    top: 0,
    width: 36,
    height: 3,
    backgroundColor: "#D13239",
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  iconBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  activeIconBox: {
    transform: [{ scale: 1.05 }],
  },
  label: {
    fontSize: 11,
    letterSpacing: -0.1,
  },
});
