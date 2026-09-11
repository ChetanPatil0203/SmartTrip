import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import {
  ArrowLeft,
  Download,
  Share2,
  MapPin,
  Navigation,
  Armchair,
  QrCode,
  Bus,
  CalendarDays,
  Clock,
  ShieldCheck,
} from "lucide-react-native";

export default function TicketScreen({ onNavigate, booking }) {
  const seats = booking.selectedSeats.length || 2;
  const total =
    booking.totalAmount ||
    (booking.selectedBus?.price ?? 750) * seats + 40 - (booking.discount || 0);
  const pnr = booking.pnr || "SB12345678";
  const bookingId = booking.bookingId || "ST-BK-948201";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onNavigate("my-trips")}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ArrowLeft size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>E-Ticket</Text>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7}>
          <Share2 size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Ticket Card */}
        <View style={styles.ticketCard}>
          <View style={styles.colorTopStrip} />

          {/* Route Header */}
          <View style={styles.routeHeader}>
            <View style={styles.routeHeaderTop}>
              <Text style={styles.brandTitle}>SMARTTRIP · E-TICKET</Text>
              <View style={styles.confirmedBadge}>
                <ShieldCheck size={11} color="#16A34A" />
                <Text style={styles.confirmedText}>CONFIRMED</Text>
              </View>
            </View>

            <View style={styles.citiesRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cityName} numberOfLines={1}>
                  {booking.from || "Mumbai"}
                </Text>
                <Text style={styles.cityTime}>{booking.selectedBus?.departure || "08:00 PM"}</Text>
              </View>
              <View style={styles.durationCol}>
                <Bus size={20} color="#D13239" />
                <View style={styles.dashLine} />
                <Text style={styles.durationText}>{booking.selectedBus?.duration || "3h"}</Text>
              </View>
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text style={styles.cityName} numberOfLines={1}>
                  {booking.to || "Pune"}
                </Text>
                <Text style={styles.cityTime}>{booking.selectedBus?.arrival || "11:00 PM"}</Text>
              </View>
            </View>
          </View>

          {/* Notched Tear Divider */}
          <View style={styles.notchedDividerRow}>
            <View style={[styles.notch, styles.notchLeft]} />
            <View style={styles.dashedLineFull} />
            <View style={[styles.notch, styles.notchRight]} />
          </View>

          {/* Details Grid */}
          <View style={styles.detailsGrid}>
            {[
              {
                Icon: Bus,
                label: "Operator",
                value: booking.selectedBus?.operator || "Neeta Tours",
                color: "#D13239",
              },
              {
                Icon: CalendarDays,
                label: "Date",
                value: booking.date || "25 May 2024",
                color: "#2563EB",
              },
              {
                Icon: Armchair,
                label: "Seat(s)",
                value: booking.selectedSeats.length > 0 ? booking.selectedSeats.join(", ") : "7, 8",
                color: "#7C3AED",
              },
              {
                Icon: MapPin,
                label: "Boarding",
                value: booking.boardingPoint || "Dadar West",
                color: "#059669",
              },
              {
                Icon: Navigation,
                label: "Dropping",
                value: booking.droppingPoint || "Swargate",
                color: "#D97706",
              },
              {
                Icon: Clock,
                label: "Bus Type",
                value: booking.selectedBus?.type || "Volvo AC Sleeper",
                color: "#0EA5E9",
              },
            ].map(({ Icon, label, value, color }) => (
              <View key={label} style={styles.gridItem}>
                <View style={styles.itemLabelRow}>
                  <Icon size={12} color={color} />
                  <Text style={styles.itemLabel}>{label}</Text>
                </View>
                <Text style={styles.itemVal} numberOfLines={1}>
                  {value}
                </Text>
              </View>
            ))}
          </View>

          {/* PNR row */}
          <View style={styles.pnrSummaryRow}>
            <View>
              <Text style={styles.pnrSummaryLabel}>PNR / BOOKING ID</Text>
              <Text style={styles.pnrSummaryVal}>{pnr}</Text>
            </View>
            <View style={styles.alignRight}>
              <Text style={styles.pnrSummaryLabel}>AMOUNT PAID</Text>
              <Text style={styles.amountPaidVal}>₹{total.toLocaleString()}</Text>
            </View>
          </View>

          {/* QR Code */}
          <View style={styles.qrCol}>
            <View style={styles.qrLabelRow}>
              <QrCode size={13} color="#64748B" />
              <Text style={styles.qrText}>Scan barcode / QR to verify ticket</Text>
            </View>
            <View style={styles.qrBox}>
              <View style={styles.qrGrid}>
                {Array.from({ length: 49 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.qrPixel,
                      { backgroundColor: Math.sin(i * 2.7 + 3) > 0.1 ? "#0F172A" : "transparent" },
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.7}>
          <Download size={16} color="#D13239" />
          <Text style={styles.downloadBtnText}>Download</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onNavigate("live-tracking")}
          style={styles.trackBtn}
          activeOpacity={0.8}
        >
          <Navigation size={16} color="#FFFFFF" />
          <Text style={styles.trackBtnText}>Track Bus</Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 14,
    backgroundColor: "#D13239",
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
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    marginLeft: 12,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  ticketCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  colorTopStrip: {
    height: 6,
    backgroundColor: "#D13239",
  },
  routeHeader: {
    padding: 20,
  },
  routeHeaderTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 1,
  },
  confirmedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  confirmedText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#16A34A",
  },
  citiesRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cityName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
  },
  cityTime: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },
  durationCol: {
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
  },
  dashLine: {
    width: 48,
    height: 1,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
  },
  durationText: {
    fontSize: 10,
    color: "#64748B",
    fontWeight: "600",
  },
  notchedDividerRow: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    marginVertical: 4,
  },
  notch: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  notchLeft: {
    marginLeft: -10,
  },
  notchRight: {
    marginRight: -10,
  },
  dashedLineFull: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 20,
    gap: 16,
  },
  gridItem: {
    width: "45%",
  },
  itemLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 3,
  },
  itemLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  itemVal: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  pnrSummaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#FFF5F5",
    borderRadius: 14,
    padding: 12,
  },
  pnrSummaryLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 1,
  },
  pnrSummaryVal: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  amountPaidVal: {
    fontSize: 18,
    fontWeight: "900",
    color: "#D13239",
    marginTop: 2,
  },
  alignRight: {
    alignItems: "flex-end",
  },
  qrCol: {
    alignItems: "center",
    paddingBottom: 20,
    gap: 8,
  },
  qrLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  qrText: {
    fontSize: 11,
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
    width: 105,
    height: 105,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  qrPixel: {
    width: "14.28%",
    height: "14.28%",
    borderRadius: 2,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  downloadBtn: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: "#D13239",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  downloadBtnText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#D13239",
  },
  trackBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#D13239",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 3,
  },
  trackBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});
