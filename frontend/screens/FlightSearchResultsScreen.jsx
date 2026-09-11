import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import {
  ArrowLeft,
  Plane,
  Clock,
  Filter,
  ChevronRight,
  Luggage,
  ShieldCheck,
  Sparkles,
} from "lucide-react-native";
import { CardSkeleton } from "../components/SkeletonLoader";
import EmptyState from "../components/EmptyState";

const mockFlights = [
  {
    id: "FL-101",
    airline: "SmartAir",
    flightNo: "ST-402",
    from: "Mumbai (BOM)",
    to: "Delhi (DEL)",
    depTime: "09:30 AM",
    arrTime: "11:45 AM",
    duration: "2h 15m",
    stops: "Non-stop",
    price: 5490,
    baggage: "7kg Cabin + 15kg Check-in",
    meal: "Free Meal Included",
    aircraft: "Boeing 737-800",
    color: "#0284C7",
  },
  {
    id: "FL-102",
    airline: "IndigoSky",
    flightNo: "IS-612",
    from: "Mumbai (BOM)",
    to: "Delhi (DEL)",
    depTime: "11:15 AM",
    arrTime: "01:30 PM",
    duration: "2h 15m",
    stops: "Non-stop",
    price: 4890,
    baggage: "7kg Cabin + 15kg Check-in",
    meal: "Buy Onboard",
    aircraft: "Airbus A320neo",
    color: "#1E3A5F",
  },
  {
    id: "FL-103",
    airline: "AirVistara",
    flightNo: "UK-944",
    from: "Mumbai (BOM)",
    to: "Delhi (DEL)",
    depTime: "04:00 PM",
    arrTime: "06:15 PM",
    duration: "2h 15m",
    stops: "Non-stop",
    price: 6200,
    baggage: "7kg Cabin + 20kg Check-in",
    meal: "Gourmet Dining",
    aircraft: "Airbus A321neo",
    color: "#7C3AED",
  },
  {
    id: "FL-104",
    airline: "SpiceFly",
    flightNo: "SG-281",
    from: "Mumbai (BOM)",
    to: "Delhi (DEL)",
    depTime: "07:45 PM",
    arrTime: "10:10 PM",
    duration: "2h 25m",
    stops: "1 Stop via JAI",
    price: 4120,
    baggage: "7kg Cabin + 15kg Check-in",
    meal: "Pre-book Snacks",
    aircraft: "Boeing 737 Max",
    color: "#EA580C",
  },
];

import { flightService } from "../services/travelService";

export default function FlightSearchResultsScreen({ onNavigate, booking, setBooking }) {
  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState(mockFlights);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    flightService.searchFlights({
      source: booking.flightFrom || 'Mumbai',
      destination: booking.flightTo || 'Delhi',
      date: booking.flightDepartureDate || new Date().toISOString().split('T')[0],
      passengers: 1,
      flightClass: booking.flightClass,
    })
      .then(res => {
        if (!isMounted) return;
        const schedules = res?.data?.schedules || [];
        if (schedules.length > 0) {
          const mapped = schedules.map(s => ({
            id: s.id,
            airline: s.flight?.airline?.name || 'SmartAir',
            flightNo: s.flight?.flightNumber || 'ST-101',
            from: s.sourceAirport?.city || booking.flightFrom || 'Mumbai',
            to: s.destinationAirport?.city || booking.flightTo || 'Delhi',
            depTime: s.departureTime || '09:30 AM',
            arrTime: s.arrivalTime || '11:45 AM',
            duration: s.duration || '2h 15m',
            stops: s.stops === 0 ? 'Non-stop' : `${s.stops} Stop`,
            price: s.baseFare || 5490,
            baggage: '7kg Cabin + 15kg Check-in',
            meal: 'Complimentary Snack',
            aircraft: s.flight?.aircraftType || 'Airbus A320',
            color: '#0284C7',
          }));
          setFlights(mapped);
        } else {
          setFlights(mockFlights);
        }
      })
      .catch(() => {
        if (isMounted) setFlights(mockFlights);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [booking.flightFrom, booking.flightTo, booking.flightDepartureDate, booking.flightClass]);

  const handleSelectFlight = (flight) => {
    setBooking({
      selectedFlight: flight,
      totalAmount: flight.price,
      bookingType: "flight",
    });
    onNavigate("flight-details");
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
              {booking.flightFrom || "Mumbai (BOM)"} ➔ {booking.flightTo || "Delhi (DEL)"}
            </Text>
            <Text style={styles.headerSub}>
              {booking.flightDepartureDate || "02 Jun 2024"} · {booking.flightClass || "Economy"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => onNavigate("flight-filter")}
            style={styles.filterBtn}
            activeOpacity={0.8}
          >
            <Filter size={14} color="#FFFFFF" />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : flights.length === 0 ? (
          <EmptyState
            title="No Flights Found"
            subtitle="Try adjusting your travel date, passengers, or class selection."
            onAction={() => onNavigate("flight-filter")}
            actionLabel="Change Search"
          />
        ) : (
          flights.map((f) => (
            <TouchableOpacity
              key={f.id}
              onPress={() => handleSelectFlight(f)}
              style={styles.flightCard}
              activeOpacity={0.8}
            >
              {/* Top Bar */}
              <View style={styles.cardHeader}>
                <View style={styles.airlineRow}>
                  <View style={[styles.airlineDot, { backgroundColor: f.color }]} />
                  <Text style={styles.airlineName}>{f.airline}</Text>
                  <Text style={styles.flightNo}>({f.flightNo})</Text>
                </View>
                <View style={styles.stopsBadge}>
                  <Text style={styles.stopsText}>{f.stops}</Text>
                </View>
              </View>

              {/* Departure/Arrival info */}
              <View style={styles.routeBox}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.timeText}>{f.depTime}</Text>
                  <Text style={styles.airportCode}>{f.from.split(" ")[1] || "(BOM)"}</Text>
                </View>

                <View style={styles.durationCol}>
                  <Text style={styles.durationText}>{f.duration}</Text>
                  <View style={styles.planeLine}>
                    <View style={styles.lineDot} />
                    <View style={styles.dashLine} />
                    <Plane size={14} color={f.color} style={{ transform: [{ rotate: "90deg" }] }} />
                    <View style={styles.dashLine} />
                    <View style={styles.lineDot} />
                  </View>
                </View>

                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <Text style={styles.timeText}>{f.arrTime}</Text>
                  <Text style={styles.airportCode}>{f.to.split(" ")[1] || "(DEL)"}</Text>
                </View>
              </View>

              {/* Baggage & Meal Info */}
              <View style={styles.perksRow}>
                <View style={styles.perkItem}>
                  <Luggage size={12} color="#64748B" />
                  <Text style={styles.perkText} numberOfLines={1}>
                    {f.baggage}
                  </Text>
                </View>
                <View style={styles.perkItem}>
                  <Sparkles size={12} color="#64748B" />
                  <Text style={styles.perkText} numberOfLines={1}>
                    {f.meal}
                  </Text>
                </View>
              </View>

              {/* Price & CTA */}
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.priceLabel}>Price per adult</Text>
                  <Text style={styles.priceValue}>₹{f.price.toLocaleString()}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleSelectFlight(f)}
                  style={[styles.selectBtn, { backgroundColor: f.color }]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.selectBtnText}>Select Flight</Text>
                  <ChevronRight size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
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
    backgroundColor: "#0284C7",
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
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  filterText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 40,
  },
  flightCard: {
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
    alignItems: "center",
    marginBottom: 12,
  },
  airlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  airlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  airlineName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  flightNo: {
    fontSize: 12,
    color: "#64748B",
  },
  stopsBadge: {
    backgroundColor: "#F0F9FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stopsText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#0284C7",
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
  airportCode: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0284C7",
    marginTop: 2,
  },
  durationCol: {
    alignItems: "center",
    paddingHorizontal: 8,
  },
  durationText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 4,
  },
  planeLine: {
    flexDirection: "row",
    alignItems: "center",
  },
  lineDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#CBD5E1",
  },
  dashLine: {
    width: 24,
    height: 1,
    backgroundColor: "#CBD5E1",
  },
  perksRow: {
    flexDirection: "row",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 10,
    marginBottom: 10,
  },
  perkItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 1,
  },
  perkText: {
    fontSize: 11,
    color: "#64748B",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 10,
    color: "#94A3B8",
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
  },
  selectBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  selectBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});
