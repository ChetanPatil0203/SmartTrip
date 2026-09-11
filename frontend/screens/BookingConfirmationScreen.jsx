import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from "react-native";
import { CheckCircle2, Download, Share2, Ticket, QrCode, ArrowRight } from "lucide-react-native";

export default function BookingConfirmationScreen({ onNavigate, booking }) {
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  const seats = booking.selectedSeats.length || 1;
  const total =
    booking.totalAmount ||
    (booking.selectedBus?.price ?? 750) * seats + 40 - (booking.discount || 0);
  const pnr = booking.pnr || "SB" + Math.floor(10000000 + Math.random() * 90000000);
  const bookingId = booking.bookingId || "ST-BK-948201";

  const Row = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailVal}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Success Header Banner */}
      <View style={styles.successHeader}>
        <Animated.View
          style={[styles.circleOuter, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}
        >
          <CheckCircle2 size={54} color="#16A34A" strokeWidth={2} />
        </Animated.View>

        <Animated.View style={[styles.textCenter, { opacity: opacityAnim }]}>
          <Text style={styles.title}>Booking Confirmed!</Text>
          <Text style={styles.subtitle}>Your journey is booked. Check ticket details below.</Text>
        </Animated.View>

        <View style={styles.pnrBadge}>
          <Text style={styles.pnrLabel}>BOOKING ID / PNR</Text>
          <Text style={styles.pnrValue}>
            {bookingId} · {pnr}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* QR Code Card */}
        <View style={styles.card}>
          <View style={styles.qrHeaderRow}>
            <QrCode size={16} color="#64748B" />
            <Text style={styles.qrHeaderText}>Scan at terminal to board</Text>
          </View>
          <View style={styles.qrBox}>
            <View style={styles.qrGrid}>
              {Array.from({ length: 49 }).map((_, i) => {
                const corner =
                  (i < 7 && i < 2) || (i < 7 && i > 4) || (i > 41 && i < 44) || (i > 41 && i > 46);
                const fill = Math.sin(i * 2.3 + 1) > 0 || corner;
                return (
                  <View
                    key={i}
                    style={[styles.qrPixel, { backgroundColor: fill ? "#0F172A" : "transparent" }]}
                  />
                );
              })}
            </View>
          </View>
        </View>

        {/* Journey Summary Details */}
        <View style={styles.card}>
          <View style={styles.journeyHeader}>
            <Ticket size={16} color="#D13239" />
            <Text style={styles.cardTitle}>Journey Summary</Text>
          </View>
          <View style={styles.detailsPad}>
            <Row label="Travel Type" value={(booking.bookingType || "bus").toUpperCase()} />
            <Row
              label="Operator / Line"
              value={
                booking.selectedBus?.operator ||
                booking.selectedTrain?.name ||
                booking.selectedFlight?.airline ||
                booking.selectedHotel?.name ||
                "Neeta Tours & Travels"
              }
            />
            <Row
              label="Route / Location"
              value={
                booking.hotelDestination
                  ? booking.hotelDestination
                  : `${booking.from || "Mumbai"} → ${booking.to || "Pune"}`
              }
            />
            <Row
              label="Date"
              value={
                booking.date ||
                booking.trainDate ||
                booking.flightDepartureDate ||
                booking.checkInDate ||
                "25 May 2024"
              }
            />
            <Row
              label="Boarding / Time"
              value={booking.boardingPoint || booking.selectedBus?.departure || "08:00 PM"}
            />
            <Row
              label="Seat / Berth / Room"
              value={booking.selectedSeats.length > 0 ? booking.selectedSeats.join(", ") : "Seat 7"}
            />
          </View>
          <View style={styles.paidSummaryRow}>
            <Text style={styles.paidLabel}>Total Amount Paid</Text>
            <Text style={styles.paidValue}>₹{total.toLocaleString()}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Action Footer */}
      <View style={styles.footer}>
        <View style={styles.actionBtnsRow}>
          <TouchableOpacity style={styles.outlineBtn} activeOpacity={0.7}>
            <Download size={15} color="#D13239" />
            <Text style={styles.outlineBtnText}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.outlineBtn} activeOpacity={0.7}>
            <Share2 size={15} color="#D13239" />
            <Text style={styles.outlineBtnText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onNavigate("ticket")}
            style={[styles.outlineBtn, { backgroundColor: "#FFF5F5" }]}
            activeOpacity={0.7}
          >
            <Ticket size={15} color="#D13239" />
            <Text style={styles.outlineBtnText}>View Ticket</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => onNavigate("my-trips")}
          style={styles.viewTripsBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.viewTripsBtnText}>GO TO MY TRIPS</Text>
          <ArrowRight size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  successHeader: {
    alignItems: "center",
    gap: 12,
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: "#F0FDF4",
    borderBottomWidth: 1,
    borderBottomColor: "#DCFCE7",
  },
  circleOuter: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },
  textCenter: {
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: "#475569",
    marginTop: 2,
    textAlign: "center",
  },
  pnrBadge: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  pnrLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#16A34A",
    letterSpacing: 1,
  },
  pnrValue: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0F172A",
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 130,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    elevation: 2,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  qrHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  qrHeaderText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  qrBox: {
    padding: 10,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  qrGrid: {
    width: 112,
    height: 112,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  qrPixel: {
    width: "14.28%",
    height: "14.28%",
    borderRadius: 2,
  },
  journeyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  detailsPad: {
    width: "100%",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  detailLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  detailVal: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
    maxWidth: "60%",
    textAlign: "right",
  },
  paidSummaryRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF5F5",
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
  },
  paidLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  paidValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#D13239",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  actionBtnsRow: {
    flexDirection: "row",
    gap: 8,
  },
  outlineBtn: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: "#D13239",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  outlineBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#D13239",
  },
  viewTripsBtn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#D13239",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 3,
  },
  viewTripsBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
