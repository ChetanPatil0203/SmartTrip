import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

export default function SkeletonLoader({ width = "100%", height = 20, borderRadius = 12, style }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View style={[styles.skeleton, { width, height, borderRadius, opacity }, style]} />
  );
}

export function CardSkeleton() {
  return (
    <View style={styles.cardSkeletonContainer}>
      <View style={styles.cardSkeletonHeader}>
        <SkeletonLoader width={140} height={18} borderRadius={6} />
        <SkeletonLoader width={60} height={22} borderRadius={10} />
      </View>

      <View style={styles.cardSkeletonRow}>
        <View style={{ gap: 4 }}>
          <SkeletonLoader width={80} height={24} borderRadius={6} />
          <SkeletonLoader width={50} height={12} borderRadius={4} />
        </View>

        <View style={{ alignItems: "center", gap: 4 }}>
          <SkeletonLoader width={60} height={12} borderRadius={4} />
          <SkeletonLoader width={90} height={4} borderRadius={2} />
        </View>

        <View style={{ alignItems: "flex-end", gap: 4 }}>
          <SkeletonLoader width={80} height={24} borderRadius={6} />
          <SkeletonLoader width={50} height={12} borderRadius={4} />
        </View>
      </View>

      <View style={styles.cardSkeletonFooter}>
        <SkeletonLoader width={90} height={24} borderRadius={6} />
        <SkeletonLoader width={110} height={40} borderRadius={12} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#E2E8F0",
  },
  cardSkeletonContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 14,
    marginBottom: 12,
  },
  cardSkeletonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardSkeletonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 14,
  },
  cardSkeletonFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 4,
  },
});
