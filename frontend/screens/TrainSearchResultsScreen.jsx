import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import {
  ArrowLeft,
  Train,
  Clock,
  Calendar,
  ChevronRight,
  Filter,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react-native";
import { CardSkeleton } from "../components/SkeletonLoader";
import EmptyState from "../components/EmptyState";

const mockTrains = [
  {
    number: "12009",
    name: "Shatabdi Express",
    from: "Mumbai Central (MMCT)",
    to: "Ahmedabad Jn (ADI)",
    depTime: "06:30 AM",
    arrTime: "01:10 PM",
    duration: "6h 40m",
    runningDays: ["M", "T", "W", "T", "F", "S"],
    classes: [
      {
        code: "EC",
        name: "Exec. Chair Car",
        price: 1450,
        status: "Available 24",
        statusType: "available",
      },
      {
        code: "CC",
        name: "AC Chair Car",
        price: 920,
        status: "Available 82",
        statusType: "available",
      },
    ],
  },
  {
    number: "12951",
    name: "Mumbai Rajdhani Express",
    from: "Mumbai Central (MMCT)",
    to: "Ahmedabad Jn (ADI)",
    depTime: "05:00 PM",
    arrTime: "10:55 PM",
    duration: "5h 55m",
    runningDays: ["M", "T", "W", "T", "F", "S", "S"],
    classes: [
      { code: "1A", name: "AC 1st Class", price: 2450, status: "RAC 04", statusType: "rac" },
      {
        code: "2A",
        name: "AC 2 Tier",
        price: 1680,
        status: "Available 18",
        statusType: "available",
      },
      {
        code: "3A",
        name: "AC 3 Tier",
        price: 1210,
        status: "Available 45",
        statusType: "available",
      },
    ],
  },
  {
    number: "11019",
    name: "Konark Express",
    from: "Mumbai CST (CSMT)",
    to: "Ahmedabad Jn (ADI)",
    depTime: "03:15 PM",
    arrTime: "11:45 PM",
    duration: "8h 30m",
    runningDays: ["M", "W", "F", "S"],
    classes: [
      { code: "SL", name: "Sleeper", price: 420, status: "WL 12", statusType: "waitlist" },
      {
        code: "3A",
        name: "AC 3 Tier",
        price: 1100,
        status: "Available 06",
        statusType: "available",
      },
      {
        code: "2A",
        name: "AC 2 Tier",
        price: 1540,
        status: "Available 02",
        statusType: "available",
      },
    ],
  },
];

export default function TrainSearchResultsScreen({ onNavigate, booking, setBooking }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectTrain = (train, cls) => {
    setBooking({
      selectedTrain: train,
      trainClass: cls.name,
      trainClassCode: cls.code,
      totalAmount: cls.price,
      bookingType: "train",
    });
    onNavigate("train-details");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => onNavigate("home")}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {booking.trainFrom || "Mumbai"} ➔ {booking.trainTo || "Ahmedabad"}
            </Text>
            <Text style={styles.headerSub}>
              {booking.trainDate || "28 May 2024"} · {mockTrains.length} Trains Found
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => onNavigate("train-live-status")}
            style={styles.statusQuickBtn}
            activeOpacity={0.8}
          >
            <Clock size={13} color="#FFFFFF" />
            <Text style={styles.statusQuickText}>Live Status</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : mockTrains.length === 0 ? (
          <EmptyState
            title="No Trains Available"
            subtitle="Try selecting a different travel date or alternate stations."
            onAction={() => onNavigate("home")}
            actionLabel="Modify Search"
          />
        ) : (
          mockTrains.map((train) => (
            <View key={train.number} style={styles.trainCard}>
              {/* Top Bar */}
              <View style={styles.cardHeader}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <View style={styles.trainNameRow}>
                    <Text style={styles.trainNumber}>{train.number}</Text>
                    <Text style={styles.trainName} numberOfLines={1}>
                      {train.name}
                    </Text>
                  </View>
                  <Text style={styles.runningDays}>Runs on: {train.runningDays.join(" ")}</Text>
                </View>
                <View style={styles.irctcBadge}>
                  <ShieldCheck size={12} color="#059669" />
                  <Text style={styles.irctcText}>IRCTC</Text>
                </View>
              </View>

              {/* Departure/Arrival info */}
              <View style={styles.routeBox}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.timeText}>{train.depTime}</Text>
                  <Text style={styles.stationText} numberOfLines={1}>
                    {train.from}
                  </Text>
                </View>
                <View style={styles.durationCol}>
                  <Text style={styles.durationText}>{train.duration}</Text>
                  <View style={styles.durationLine}>
                    <View style={styles.lineDot} />
                    <View style={styles.dashLine} />
                    <Train size={14} color="#2563EB" />
                    <View style={styles.dashLine} />
                    <View style={styles.lineDot} />
                  </View>
                </View>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <Text style={styles.timeText}>{train.arrTime}</Text>
                  <Text style={styles.stationText} numberOfLines={1}>
                    {train.to}
                  </Text>
                </View>
              </View>

              {/* Class Cards */}
              <Text style={styles.availableClassesLabel}>AVAILABLE CLASSES & FARE:</Text>
              <View style={styles.classesGrid}>
                {train.classes.map((cls) => {
                  const isAvailable = cls.statusType === "available";
                  const isRac = cls.statusType === "rac";
                  return (
                    <TouchableOpacity
                      key={cls.code}
                      onPress={() => handleSelectTrain(train, cls)}
                      style={styles.classBox}
                      activeOpacity={0.8}
                    >
                      <View style={styles.classHeader}>
                        <Text style={styles.classCode}>{cls.code}</Text>
                        <Text style={styles.classFare}>₹{cls.price}</Text>
                      </View>
                      <Text style={styles.className} numberOfLines={1}>
                        {cls.name}
                      </Text>
                      <View
                        style={[
                          styles.statusTag,
                          {
                            backgroundColor: isAvailable
                              ? "#DCFCE7"
                              : isRac
                                ? "#FEF3C7"
                                : "#FEE2E2",
                          },
                        ]}
                      >
                        {isAvailable && <CheckCircle2 size={10} color="#16A34A" />}
                        {isRac && <AlertTriangle size={10} color="#D97706" />}
                        {!isAvailable && !isRac && <XCircle size={10} color="#DC2626" />}
                        <Text
                          style={[
                            styles.statusTagText,
                            { color: isAvailable ? "#15803D" : isRac ? "#B45309" : "#B91C1C" },
                          ]}
                        >
                          {cls.status}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Card Action */}
              <TouchableOpacity
                onPress={() => handleSelectTrain(train, train.classes[0])}
                style={styles.viewSeatsBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.viewSeatsText}>View Seats & Schedule</Text>
                <ChevronRight size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 14,
    backgroundColor: "#1E3A5F",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
  headerSub: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.75)",
    marginTop: 2,
  },
  statusQuickBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#2563EB",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusQuickText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 40,
  },
  trainCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 3,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  trainNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  trainNumber: {
    fontSize: 12,
    fontWeight: "900",
    color: "#2563EB",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  trainName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
  runningDays: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 4,
  },
  irctcBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  irctcText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#059669",
  },
  routeBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  timeText: {
    fontSize: 17,
    fontWeight: "900",
    color: "#0F172A",
  },
  stationText: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  durationCol: {
    alignItems: "center",
    paddingHorizontal: 8,
  },
  durationText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2563EB",
    marginBottom: 4,
  },
  durationLine: {
    flexDirection: "row",
    alignItems: "center",
  },
  lineDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#94A3B8",
  },
  dashLine: {
    width: 24,
    height: 1,
    backgroundColor: "#CBD5E1",
  },
  availableClassesLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#94A3B8",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  classesGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  classBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 10,
  },
  classHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  classCode: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1E3A5F",
  },
  classFare: {
    fontSize: 13,
    fontWeight: "900",
    color: "#0F172A",
  },
  className: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 2,
    marginBottom: 6,
  },
  statusTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  statusTagText: {
    fontSize: 10,
    fontWeight: "800",
  },
  viewSeatsBtn: {
    backgroundColor: "#1E3A5F",
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  viewSeatsText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
