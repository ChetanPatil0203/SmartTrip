import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import BottomNav from "../components/BottomNav";
import EmptyState from "../components/EmptyState";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Armchair,
  Navigation,
  X,
  Ticket,
  ChevronRight,
  Bus,
  Train,
  Plane,
  Building2,
} from "lucide-react-native";

const allTrips = {
  upcoming: [
    {
      pnr: "SB12345678",
      category: "bus",
      operator: "Neeta Tours & Travels",
      date: "25 May 2024",
      time: "08:00 PM",
      from: "Mumbai",
      to: "Pune",
      seats: "7, 8",
      price: 1540,
      status: "Confirmed",
      ticketScreen: "ticket",
      trackScreen: "live-tracking",
    },
    {
      pnr: "PNR-TRN882",
      category: "train",
      operator: "12009 Shatabdi Express",
      date: "28 May 2024",
      time: "06:30 AM",
      from: "Mumbai Central",
      to: "Ahmedabad",
      seats: "Coach B3 - 42",
      price: 1450,
      status: "Confirmed",
      ticketScreen: "train-ticket",
      trackScreen: "train-live-status",
    },
    {
      pnr: "PNR-FL772",
      category: "flight",
      operator: "SmartAir (ST-402)",
      date: "02 Jun 2024",
      time: "09:30 AM",
      from: "Mumbai (BOM)",
      to: "Delhi (DEL)",
      seats: "Seat 2A (Win)",
      price: 5490,
      status: "Confirmed",
      ticketScreen: "flight-ticket",
      trackScreen: null,
    },
    {
      pnr: "ST-HTL-992",
      category: "hotel",
      operator: "Taj Holiday Village Resort",
      date: "10 Jun 2024",
      time: "02:00 PM",
      from: "Goa",
      to: "3 Nights Stay",
      seats: "Deluxe Sea View",
      price: 5040,
      status: "Confirmed",
      ticketScreen: "hotel-ticket",
      trackScreen: null,
    },
  ],
  completed: [
    {
      pnr: "SB11223344",
      category: "bus",
      operator: "Shivneri Travels",
      date: "10 Apr 2024",
      time: "07:00 PM",
      from: "Mumbai",
      to: "Pune",
      seats: "12",
      price: 800,
      status: "Completed",
      ticketScreen: "ticket",
    },
    {
      pnr: "TRN-55123",
      category: "train",
      operator: "Rajdhani Express",
      date: "15 Mar 2024",
      time: "05:00 PM",
      from: "Mumbai",
      to: "Delhi",
      seats: "AC 2A",
      price: 2290,
      status: "Completed",
      ticketScreen: "train-ticket",
    },
  ],
  cancelled: [
    {
      pnr: "SB55667788",
      category: "bus",
      operator: "Sai Travels",
      date: "05 Mar 2024",
      time: "06:00 PM",
      from: "Pune",
      to: "Nashik",
      seats: "5",
      price: 700,
      status: "Cancelled",
      ticketScreen: "ticket",
    },
    {
      pnr: "FL-99124",
      category: "flight",
      operator: "IndigoSky (IS-612)",
      date: "01 Feb 2024",
      time: "11:15 AM",
      from: "Pune",
      to: "Delhi",
      seats: "14B",
      price: 4890,
      status: "Cancelled",
      ticketScreen: "flight-ticket",
    },
  ],
};

const categoryIcons = {
  bus: { Icon: Bus, label: "BUS", color: "#D13239", bg: "#FFF0F0" },
  train: { Icon: Train, label: "TRAIN", color: "#2563EB", bg: "#EFF6FF" },
  flight: { Icon: Plane, label: "FLIGHT", color: "#0284C7", bg: "#F0F9FF" },
  hotel: { Icon: Building2, label: "HOTEL", color: "#059669", bg: "#ECFDF5" },
};

const tabCfg = {
  upcoming: { Icon: Clock, color: "#2563EB", bg: "#EFF6FF", label: "UPCOMING" },
  completed: { Icon: CheckCircle, color: "#16A34A", bg: "#F0FFF4", label: "COMPLETED" },
  cancelled: { Icon: XCircle, color: "#D13239", bg: "#FFF0F0", label: "CANCELLED" },
};

export default function MyTripsScreen({ onNavigate, booking }) {
  const [statusTab, setStatusTab] = useState("upcoming");
  const [catFilter, setCatFilter] = useState("all");

  const filteredTrips = (allTrips[statusTab] || []).filter((t) => {
    if (catFilter === "all") return true;
    return t.category === catFilter;
  });

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
          <View>
            <Text style={styles.headerTitle}>My Trips</Text>
            <Text style={styles.headerSub}>Manage your Bus, Train, Flight & Hotel journeys</Text>
          </View>
        </View>

        {/* Status Switcher (Upcoming | Completed | Cancelled) */}
        <View style={styles.tabSwitchContainer}>
          {["upcoming", "completed", "cancelled"].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setStatusTab(t)}
              style={[
                styles.tabSwitchBtn,
                { backgroundColor: statusTab === t ? "#FFFFFF" : "transparent" },
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabSwitchText,
                  { color: statusTab === t ? "#D13239" : "rgba(255,255,255,0.85)" },
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Category Filter Chips */}
      <View style={styles.catFilterBar}>
        {["all", "bus", "train", "flight", "hotel"].map((c) => {
          const active = catFilter === c;
          return (
            <TouchableOpacity
              key={c}
              onPress={() => setCatFilter(c)}
              style={[styles.catFilterChip, active && styles.catFilterChipActive]}
            >
              <Text style={[styles.catFilterText, active && styles.catFilterTextActive]}>
                {c === "all" ? "All Journeys" : c.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredTrips.length === 0 ? (
          <EmptyState
            type="no-trips"
            title={`No ${statusTab.toLowerCase()} ${catFilter === "all" ? "trips" : catFilter + " trips"}`}
            subtitle="You don't have any journeys in this category yet. Book a new trip anytime!"
            onAction={() => onNavigate("home")}
            actionLabel="Book a Journey"
          />
        ) : (
          filteredTrips.map((trip) => {
            const catInfo = categoryIcons[trip.category] || categoryIcons.bus;
            const CatIcon = catInfo.Icon;
            const cfg = tabCfg[statusTab];

            return (
              <View key={trip.pnr} style={styles.tripCard}>
                <View style={[styles.cardTopStrip, { backgroundColor: catInfo.color }]} />
                <View style={styles.cardPad}>
                  {/* Header Row */}
                  <View style={styles.cardHeaderRow}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
                      <View style={[styles.catIconCircle, { backgroundColor: catInfo.bg }]}>
                        <CatIcon size={14} color={catInfo.color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.operatorName} numberOfLines={1}>
                          {trip.operator}
                        </Text>
                        <Text style={styles.dateSub}>
                          {trip.date} · {trip.time}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                      <cfg.Icon size={11} color={cfg.color} />
                      <Text style={[styles.statusBadgeText, { color: cfg.color }]}>
                        {cfg.label}
                      </Text>
                    </View>
                  </View>

                  {/* Route Box */}
                  <View style={styles.routeBox}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cityText} numberOfLines={1}>
                        {trip.from}
                      </Text>
                      <Text style={styles.routeLabelText}>Origin</Text>
                    </View>
                    <View style={styles.busLineContainer}>
                      <View style={styles.dashLine} />
                      <CatIcon size={14} color={catInfo.color} />
                      <View style={styles.dashLine} />
                    </View>
                    <View style={{ flex: 1, alignItems: "flex-end" }}>
                      <Text style={styles.cityText} numberOfLines={1}>
                        {trip.to}
                      </Text>
                      <Text style={styles.routeLabelText}>Destination</Text>
                    </View>
                  </View>

                  {/* Ref & Seats */}
                  <View style={styles.pnrSeatRow}>
                    <View>
                      <Text style={styles.pnrText}>
                        Ref/PNR: <Text style={styles.pnrBold}>{trip.pnr}</Text>
                      </Text>
                      <Text style={styles.seatsText}>Allocated: {trip.seats}</Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={styles.paidLabel}>Paid Amount</Text>
                      <Text style={styles.paidVal}>₹{trip.price.toLocaleString()}</Text>
                    </View>
                  </View>

                  {/* Actions */}
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      onPress={() => onNavigate(trip.ticketScreen || "ticket")}
                      style={[styles.outlineBtn, { borderColor: catInfo.color }]}
                      activeOpacity={0.7}
                    >
                      <Ticket size={13} color={catInfo.color} />
                      <Text style={[styles.outlineBtnText, { color: catInfo.color }]}>
                        View Ticket
                      </Text>
                    </TouchableOpacity>

                    {statusTab === "upcoming" && trip.trackScreen && (
                      <TouchableOpacity
                        onPress={() => onNavigate(trip.trackScreen)}
                        style={[styles.trackBtn, { backgroundColor: catInfo.color }]}
                        activeOpacity={0.8}
                      >
                        <Navigation size={13} color="#FFFFFF" />
                        <Text style={styles.trackBtnText}>Live Tracker</Text>
                      </TouchableOpacity>
                    )}

                    {statusTab === "upcoming" && (
                      <TouchableOpacity
                        onPress={() => onNavigate("cancel-ticket")}
                        style={styles.cancelIconBtn}
                        activeOpacity={0.7}
                      >
                        <X size={14} color="#D13239" />
                      </TouchableOpacity>
                    )}

                    {statusTab === "cancelled" && (
                      <TouchableOpacity
                        onPress={() => onNavigate("refund-status")}
                        style={styles.refundBtn}
                        activeOpacity={0.8}
                      >
                        <ChevronRight size={13} color="#FFFFFF" />
                        <Text style={styles.refundBtnText}>Refund Status</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <BottomNav current="my-trips" onNavigate={onNavigate} />
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
    backgroundColor: "#D13239",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
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
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.75)",
    marginTop: 1,
  },
  tabSwitchContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    borderRadius: 14,
    padding: 3,
    gap: 4,
  },
  tabSwitchBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 11,
    alignItems: "center",
  },
  tabSwitchText: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "capitalize",
  },
  catFilterBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  catFilterChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  catFilterChipActive: {
    backgroundColor: "#0F172A",
  },
  catFilterText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#64748B",
  },
  catFilterTextActive: {
    color: "#FFFFFF",
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 100,
  },
  tripCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardTopStrip: {
    height: 4,
    width: "100%",
  },
  cardPad: {
    padding: 16,
    gap: 10,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  catIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  operatorName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  dateSub: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  routeBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  cityText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#0F172A",
  },
  routeLabelText: {
    fontSize: 9,
    color: "#94A3B8",
  },
  busLineContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 6,
  },
  dashLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
  },
  pnrSeatRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pnrText: {
    fontSize: 12,
    color: "#64748B",
  },
  pnrBold: {
    fontWeight: "800",
    color: "#0F172A",
  },
  seatsText: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  paidLabel: {
    fontSize: 10,
    color: "#94A3B8",
  },
  paidVal: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0F172A",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  outlineBtn: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  outlineBtnText: {
    fontSize: 12,
    fontWeight: "800",
  },
  trackBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  trackBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  cancelIconBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFF0F0",
    borderWidth: 1,
    borderColor: "#FFE0E0",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  refundBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#059669",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  refundBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
});
