import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, RefreshControl } from "react-native";
import {
  ArrowLeft,
  SlidersHorizontal,
  ArrowUpDown,
  Star,
  Clock,
  Armchair,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
} from "lucide-react-native";
import { CardSkeleton } from "../components/SkeletonLoader";
import EmptyState from "../components/EmptyState";
import busService from "../services/busService";

// Map backend schedule to UI bus shape
function mapScheduleToBus(sched) {
  return {
    id: sched.id,
    operator: sched.bus?.operator?.name || 'Bus Operator',
    rating: sched.bus?.operator?.rating || 4.0,
    departure: sched.departureTime || '—',
    arrival: sched.arrivalTime || '—',
    duration: sched.route?.duration || '—',
    from: sched.route?.source || '—',
    to: sched.route?.destination || '—',
    type: sched.bus?.busType || 'Bus',
    price: sched.fare || 0,
    seats: sched.availableSeats ?? '?',
    onTime: 90,
    score: sched.bus?.operator?.rating || 4.0,
    bookingAccuracy: 95,
  };
}

export default function SearchResultsScreen({ onNavigate, booking, setBooking }) {
  const [sort, setSort] = useState("Price");
  const [loading, setLoading] = useState(true);
  const [buses, setBuses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBuses = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);

      const res = await busService.searchBuses({
        source: booking.from || '',
        destination: booking.to || '',
        date: booking.date || new Date().toISOString().split('T')[0],
        passengers: booking.passengers || 1,
      });

      const schedules = res?.data?.schedules || res?.data?.buses || [];
      setBuses(schedules.map(mapScheduleToBus));
    } catch {
      setBuses([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchBuses(); }, [booking.from, booking.to, booking.date]);

  const sorted = [...buses].sort((a, b) => {
    if (sort === "Price") return a.price - b.price;
    if (sort === "Rating") return b.rating - a.rating;
    return a.departure.localeCompare(b.departure);
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
          <View style={styles.headerInfo}>
            <Text style={styles.routeTitle} numberOfLines={1}>
              {booking.from || "Mumbai"} → {booking.to || "Pune"}
            </Text>
            <Text style={styles.routeSub}>
              {booking.date || "25 May 2024"} · {sorted.length} buses found
            </Text>
          </View>
        </View>
        <View style={styles.sortRow}>
          {["Price", "Rating", "Departure"].map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => {
                setLoading(true);
                setSort(s);
              }}
              style={[
                styles.sortChip,
                { backgroundColor: sort === s ? "#FFFFFF" : "rgba(255,255,255,0.18)" },
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.sortChipText, { color: sort === s ? "#D13239" : "#FFFFFF" }]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Filter Row */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          onPress={() => onNavigate("filter")}
          style={styles.filterBtn}
          activeOpacity={0.7}
        >
          <SlidersHorizontal size={14} color="#4B5563" />
          <Text style={styles.filterBtnText}>Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn} activeOpacity={0.7}>
          <ArrowUpDown size={14} color="#4B5563" />
          <Text style={styles.filterBtnText}>Sort</Text>
        </TouchableOpacity>
        <Text style={styles.resultCount}>{sorted.length} results</Text>
      </View>

      {/* Bus Cards */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : sorted.length === 0 ? (
          <EmptyState
            title="No Buses Found"
            subtitle="Try changing your departure date or reset applied filters."
            onAction={() => onNavigate("filter")}
            actionLabel="Change Filters"
          />
        ) : (
          sorted.map((bus) => (
            <View key={bus.id} style={styles.busCard}>
              {/* Operator Header */}
              <View style={styles.cardHeader}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={styles.operatorName} numberOfLines={1}>
                    {bus.operator}
                  </Text>
                  <Text style={styles.busType} numberOfLines={1}>
                    {bus.type}
                  </Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Star size={11} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.ratingText}>{bus.rating}</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                {/* Times */}
                <View style={styles.timeRow}>
                  <View style={styles.timeBlock}>
                    <Text style={styles.timeText}>{bus.departure}</Text>
                    <Text style={styles.citySub} numberOfLines={1}>
                      {bus.from}
                    </Text>
                  </View>
                  <View style={styles.durationCol}>
                    <View style={styles.durationRow}>
                      <Clock size={10} color="#9CA3AF" />
                      <Text style={styles.durationText}>{bus.duration}</Text>
                    </View>
                    <View style={styles.lineRow}>
                      <View style={styles.dashLine} />
                      <View style={styles.redDot} />
                      <View style={styles.dashLine} />
                    </View>
                    <Text style={styles.nonStopText}>Direct</Text>
                  </View>
                  <View style={[styles.timeBlock, styles.alignRight]}>
                    <Text style={styles.timeText}>{bus.arrival}</Text>
                    <Text style={styles.citySub} numberOfLines={1}>
                      {bus.to}
                    </Text>
                  </View>
                </View>

                {/* Scores */}
                <View style={styles.scoresRow}>
                  <View style={[styles.scoreBadge, { backgroundColor: "#EFF6FF" }]}>
                    <ShieldCheck size={11} color="#2563EB" />
                    <Text style={[styles.scoreBadgeText, { color: "#1D4ED8" }]}>
                      {bus.score}/5 Score
                    </Text>
                  </View>
                  <View style={[styles.scoreBadge, { backgroundColor: "#F0FFF4" }]}>
                    <TrendingUp size={11} color="#059669" />
                    <Text style={[styles.scoreBadgeText, { color: "#047857" }]}>
                      {bus.onTime}% On-Time
                    </Text>
                  </View>
                </View>

                {/* Price & CTA */}
                <View style={styles.priceRow}>
                  <View>
                    <Text style={styles.priceText}>₹{bus.price}</Text>
                    <View style={styles.seatsLeftRow}>
                      <Armchair size={10} color="#64748B" />
                      <Text style={styles.seatsLeftText}>{bus.seats} seats left</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setBooking({ selectedBus: bus });
                      onNavigate("bus-details");
                    }}
                    style={styles.viewSeatsBtn}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.viewSeatsText}>VIEW SEATS</Text>
                    <ChevronRight size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
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
    backgroundColor: "#D13239",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: {
    flex: 1,
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
  routeSub: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.75)",
    marginTop: 1,
  },
  sortRow: {
    flexDirection: "row",
    gap: 8,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  sortChipText: {
    fontSize: 12,
    fontWeight: "700",
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
  },
  filterBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
  },
  resultCount: {
    marginLeft: "auto",
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  scrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  busCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 3,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  operatorName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
  busType: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#D97706",
  },
  cardBody: {
    padding: 16,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 12,
  },
  timeBlock: {
    flex: 1,
  },
  timeText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
  },
  citySub: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },
  durationCol: {
    alignItems: "center",
    paddingHorizontal: 8,
  },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  durationText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "700",
  },
  lineRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  dashLine: {
    width: 28,
    height: 1,
    backgroundColor: "#CBD5E1",
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D13239",
  },
  nonStopText: {
    fontSize: 10,
    color: "#94A3B8",
  },
  alignRight: {
    alignItems: "flex-end",
  },
  scoresRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  scoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoreBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 12,
  },
  priceText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#D13239",
  },
  seatsLeftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  seatsLeftText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
  },
  viewSeatsBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#D13239",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewSeatsText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
});
