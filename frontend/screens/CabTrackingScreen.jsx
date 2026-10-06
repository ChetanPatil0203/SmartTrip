import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Share,
} from "react-native";
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  Shield,
  Share2,
  Navigation,
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  CreditCard,
} from "lucide-react-native";
import cabService from "../services/cabService";

export default function CabTrackingScreen({ onNavigate, booking }) {
  const driver = booking.rideDriver || {
    name: "Ramesh Pawar",
    rating: "4.9",
    totalTrips: "1,840 trips",
    phone: "+91 98234 56789",
    vehicleName: "Smart Auto",
    vehicleModel: "Bajaj RE Compact",
    plateNumber: "MH 01 AB 4321",
    etaMins: 2,
    otp: booking.rideOtp || "4892",
    price: booking.totalAmount || 80,
    pickupAddress: booking.ridePickup || "CSMT Station, Mumbai",
    dropAddress: booking.rideDrop || "Bandra Kurla Complex (BKC), Mumbai",
    distance: "14.2 km",
    duration: "28 mins",
    emoji: "🛺",
  };

  // Tracking stages: 1 = Arriving, 2 = Arrived, 3 = In Transit, 4 = Completed
  const [stage, setStage] = useState(1);
  const eta = driver.etaMins || 2;

  // Poll or sync tracking with backend
  useEffect(() => {
    if (!booking.bookingId) return;
    let isMounted = true;
    cabService.getLiveTracking(booking.bookingId)
      .then((res) => {
        if (isMounted && res && res.data && res.data.stage) {
          setStage(res.data.stage);
        }
      })
      .catch((err) => {
        console.warn("Could not sync tracking from server:", err.message);
      });
    return () => { isMounted = false; };
  }, [booking.bookingId]);

  const advanceStage = async () => {
    if (stage < 4) {
      const nextStage = stage + 1;
      setStage(nextStage);
      if (booking.bookingId) {
        try {
          await cabService.updateRideStatus(booking.bookingId, { stage: nextStage });
        } catch (e) {
          console.warn("Manual ride stage update failed:", e.message);
        }
      }
    }
  };

  const handleShareTrip = async () => {
    try {
      await Share.share({
        message: `I'm travelling in SmartTrip ${driver.vehicleName} (${driver.plateNumber}) with driver ${driver.name}. Track my live ride: https://smarttrip.in/track/${driver.otp}`,
      });
    } catch (e) {
      console.log("Share dismissed:", e.message);
    }
  };

  const handleSos = () => {
    Alert.alert(
      "Emergency SOS",
      "Calling 24x7 SmartTrip Safety Helpline (112 / Police emergency). Your live location is automatically shared with emergency contacts.",
      [{ text: "Cancel", style: "cancel" }, { text: "Call 112", style: "destructive" }]
    );
  };

  const handleCancelRide = () => {
    Alert.alert(
      "Cancel Ride?",
      "Are you sure you want to cancel this ride? There is ₹0 cancellation fee.",
      [
        { text: "No, Keep Ride", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            if (booking.bookingId) {
              try {
                await cabService.cancelCab(booking.bookingId);
              } catch (e) {
                console.warn("Cancel cab server sync:", e.message);
              }
            }
            onNavigate("home");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Floating App Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => onNavigate("home")}
          style={styles.iconCircle}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#111827" />
        </TouchableOpacity>

        <View style={styles.topStatusPill}>
          <View style={styles.liveDot} />
          <Text style={styles.topStatusText}>
            {stage === 1 && `Driver arriving in ${eta} min`}
            {stage === 2 && "Driver arrived at pickup location"}
            {stage === 3 && "Trip in progress · 24 mins to destination"}
            {stage === 4 && "Ride Completed! 🎉"}
          </Text>
        </View>

        <View style={styles.topRightActions}>
          <TouchableOpacity onPress={handleShareTrip} style={styles.iconCircle} activeOpacity={0.7}>
            <Share2 size={18} color="#1F2937" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSos} style={[styles.iconCircle, styles.sosCircle]} activeOpacity={0.7}>
            <Shield size={18} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Visual Simulated Map Display */}
        <View style={styles.mapContainer}>
          {/* Map Grid Roads Background */}
          <View style={styles.mapRoadH1} />
          <View style={styles.mapRoadH2} />
          <View style={styles.mapRoadV1} />
          <View style={styles.mapRoadV2} />

          {/* Route Path Polyline */}
          <View style={styles.routePathLine} />

          {/* Pickup Pin */}
          <View style={[styles.mapMarker, styles.pickupMarker]}>
            <MapPin size={16} color="#FFFFFF" />
            <Text style={styles.markerLabel}>Pickup</Text>
          </View>

          {/* Drop Pin */}
          <View style={[styles.mapMarker, styles.dropMarker]}>
            <MapPin size={16} color="#FFFFFF" />
            <Text style={styles.markerLabel}>Drop</Text>
          </View>

          {/* Driver Vehicle Marker */}
          <View
            style={[
              styles.vehicleMarker,
              stage === 1 && { top: 80, left: 110 },
              stage === 2 && { top: 60, left: 45 },
              stage === 3 && { top: 120, left: 180 },
              stage === 4 && { top: 170, left: 245 },
            ]}
          >
            <View style={styles.vehiclePulsingHalo} />
            <View style={styles.vehicleMarkerBubble}>
              <Text style={styles.markerEmoji}>{driver.emoji}</Text>
            </View>
            <View style={styles.etaMarkerTag}>
              <Text style={styles.etaMarkerTagText}>
                {stage === 1 ? `${eta} min` : stage === 2 ? "HERE" : "ON WAY"}
              </Text>
            </View>
          </View>

          {/* Map Overlay Badge */}
          <View style={styles.mapOverlayWatermark}>
            <Navigation size={12} color="#4B5563" />
            <Text style={styles.mapOverlayWatermarkText}>SmartTrip Live GPS Tracking</Text>
          </View>
        </View>

        {/* OTP Highlight Banner (Important for Auto & Cab) */}
        {stage < 3 && (
          <View style={styles.otpBanner}>
            <View style={styles.otpLeft}>
              <Text style={styles.otpSubTitle}>START RIDE OTP</Text>
              <Text style={styles.otpCode}>{driver.otp}</Text>
            </View>
            <View style={styles.otpRight}>
              <Text style={styles.otpNote}>
                Share this PIN with {driver.name} before boarding.
              </Text>
            </View>
          </View>
        )}

        {/* Driver Profile Card */}
        <View style={styles.driverCard}>
          <View style={styles.driverHeaderRow}>
            {/* Driver Avatar */}
            <View style={styles.driverAvatarBox}>
              <Text style={styles.driverAvatarEmoji}>👨🏽‍✈️</Text>
              <View style={styles.ratingBadge}>
                <Star size={10} color="#D97706" fill="#F59E0B" />
                <Text style={styles.ratingText}>{driver.rating}</Text>
              </View>
            </View>

            {/* Driver Info */}
            <View style={styles.driverInfoCol}>
              <Text style={styles.driverName}>{driver.name}</Text>
              <Text style={styles.driverVehicle}>{driver.vehicleName} · {driver.vehicleModel}</Text>
              <Text style={styles.driverTrips}>{driver.totalTrips} • Verified Partner</Text>
            </View>

            {/* Plate Number Box */}
            <View style={styles.plateBox}>
              <View style={styles.plateHeader}>
                <Text style={styles.plateInd}>IND</Text>
              </View>
              <Text style={styles.plateNumber}>{driver.plateNumber}</Text>
            </View>
          </View>

          {/* Action Buttons: Call, Message */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              onPress={() => Alert.alert("Calling Driver", `Dialing ${driver.phone}...`)}
              style={styles.actionBtn}
              activeOpacity={0.8}
            >
              <Phone size={16} color="#2563EB" />
              <Text style={[styles.actionBtnText, { color: "#2563EB" }]}>Call Driver</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Message Driver",
                  `Chat with ${driver.name}:\n"I am at the main gate waiting."`
                )
              }
              style={styles.actionBtn}
              activeOpacity={0.8}
            >
              <MessageSquare size={16} color="#059669" />
              <Text style={[styles.actionBtnText, { color: "#059669" }]}>Send Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stage Timeline Card */}
        <View style={styles.timelineCard}>
          <Text style={styles.cardHeaderTitle}>Ride Status</Text>

          <View style={styles.statusStep}>
            <View style={[styles.statusIconBox, { backgroundColor: "#DCFCE7" }]}>
              <CheckCircle2 size={16} color="#16A34A" />
            </View>
            <View style={styles.statusStepInfo}>
              <Text style={styles.statusStepTitle}>Ride Confirmed</Text>
              <Text style={styles.statusStepDesc}>Driver accepted your request</Text>
            </View>
            <Text style={styles.statusTime}>Just now</Text>
          </View>

          <View style={styles.verticalBar} />

          <View style={styles.statusStep}>
            <View
              style={[
                styles.statusIconBox,
                stage >= 2 ? { backgroundColor: "#DCFCE7" } : { backgroundColor: "#FEF3C7" },
              ]}
            >
              {stage >= 2 ? (
                <CheckCircle2 size={16} color="#16A34A" />
              ) : (
                <Clock size={16} color="#D97706" />
              )}
            </View>
            <View style={styles.statusStepInfo}>
              <Text style={styles.statusStepTitle}>Driver Arriving</Text>
              <Text style={styles.statusStepDesc}>
                {stage >= 2 ? "Driver has arrived at pickup location" : "On the way to pickup spot"}
              </Text>
            </View>
            <Text style={styles.statusTime}>{stage >= 2 ? "Arrived" : `${eta}m`}</Text>
          </View>

          <View style={styles.verticalBar} />

          <View style={styles.statusStep}>
            <View
              style={[
                styles.statusIconBox,
                stage >= 3 ? { backgroundColor: "#DCFCE7" } : { backgroundColor: "#F3F4F6" },
              ]}
            >
              <Navigation size={16} color={stage >= 3 ? "#16A34A" : "#9CA3AF"} />
            </View>
            <View style={styles.statusStepInfo}>
              <Text
                style={[
                  styles.statusStepTitle,
                  stage < 3 && { color: "#9CA3AF" },
                ]}
              >
                On Trip
              </Text>
              <Text style={styles.statusStepDesc}>Heading to {driver.dropAddress}</Text>
            </View>
          </View>

          {/* Interactive Simulation Button */}
          <TouchableOpacity
            onPress={advanceStage}
            style={styles.simulateBtn}
            activeOpacity={0.8}
          >
            <Sparkles size={16} color="#4F46E5" />
            <Text style={styles.simulateBtnText}>
              {stage === 1 && "Simulate: Driver Arrived"}
              {stage === 2 && "Simulate: Start Ride (OTP Verified)"}
              {stage === 3 && "Simulate: Reached Destination"}
              {stage === 4 && "Ride Completed ✓"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Trip & Fare Details */}
        <View style={styles.fareCard}>
          <Text style={styles.cardHeaderTitle}>Fare & Route Summary</Text>

          <View style={styles.routeItemRow}>
            <View style={[styles.circleDot, { backgroundColor: "#10B981" }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.routeLocTitle}>Pickup</Text>
              <Text style={styles.routeLocAddress}>{driver.pickupAddress}</Text>
            </View>
          </View>

          <View style={styles.routeItemRow}>
            <View style={[styles.circleDot, { backgroundColor: "#EF4444" }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.routeLocTitle}>Drop</Text>
              <Text style={styles.routeLocAddress}>{driver.dropAddress}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.fareRow}>
            <View style={styles.farePaymentType}>
              <CreditCard size={14} color="#6B7280" />
              <Text style={styles.farePaymentLabel}>Payment via Cash / UPI</Text>
            </View>
            <Text style={styles.fareAmountText}>₹{driver.price}</Text>
          </View>
        </View>

        {/* Cancel Button */}
        {stage < 3 && (
          <TouchableOpacity
            onPress={handleCancelRide}
            style={styles.cancelBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelBtnText}>Cancel Ride (No fee)</Text>
          </TouchableOpacity>
        )}

        {/* Back to Home CTA if completed */}
        {stage === 4 && (
          <TouchableOpacity
            onPress={() => onNavigate("home")}
            style={styles.doneHomeBtn}
            activeOpacity={0.85}
          >
            <Text style={styles.doneHomeBtnText}>Back to Home</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  topBar: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    zIndex: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  sosCircle: {
    backgroundColor: "#FEE2E2",
  },
  topStatusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2563EB",
  },
  topStatusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1D4ED8",
  },
  topRightActions: {
    flexDirection: "row",
    gap: 8,
  },
  scrollContent: {
    padding: 16,
  },
  mapContainer: {
    height: 220,
    backgroundColor: "#E2E8F0",
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  mapRoadH1: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    height: 18,
    backgroundColor: "#CBD5E1",
  },
  mapRoadH2: {
    position: "absolute",
    top: 150,
    left: 0,
    right: 0,
    height: 18,
    backgroundColor: "#CBD5E1",
  },
  mapRoadV1: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 70,
    width: 18,
    backgroundColor: "#CBD5E1",
  },
  mapRoadV2: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 200,
    width: 18,
    backgroundColor: "#CBD5E1",
  },
  routePathLine: {
    position: "absolute",
    top: 70,
    left: 60,
    width: 180,
    height: 90,
    borderWidth: 3,
    borderColor: "#3B82F6",
    borderStyle: "dashed",
    borderRadius: 24,
  },
  mapMarker: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    flexDirection: "row",
    gap: 4,
  },
  pickupMarker: {
    top: 45,
    left: 40,
    backgroundColor: "#10B981",
  },
  dropMarker: {
    top: 145,
    left: 220,
    backgroundColor: "#EF4444",
  },
  markerLabel: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  vehicleMarker: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  vehiclePulsingHalo: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(59, 130, 246, 0.25)",
  },
  vehicleMarkerBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#2563EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  markerEmoji: {
    fontSize: 18,
  },
  etaMarkerTag: {
    backgroundColor: "#111827",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  etaMarkerTagText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },
  mapOverlayWatermark: {
    position: "absolute",
    bottom: 8,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  mapOverlayWatermarkText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#374151",
  },
  otpBanner: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  otpLeft: {
    alignItems: "flex-start",
  },
  otpSubTitle: {
    color: "#94A3B8",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  otpCode: {
    color: "#38BDF8",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 3,
    marginTop: 2,
  },
  otpRight: {
    flex: 1,
    marginLeft: 18,
  },
  otpNote: {
    color: "#E2E8F0",
    fontSize: 12,
    lineHeight: 16,
  },
  driverCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  driverHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  driverAvatarBox: {
    position: "relative",
    marginRight: 12,
  },
  driverAvatarEmoji: {
    fontSize: 42,
  },
  ratingBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: "#FEF3C7",
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  ratingText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#92400E",
  },
  driverInfoCol: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  driverVehicle: {
    fontSize: 12,
    color: "#4B5563",
    marginTop: 2,
  },
  driverTrips: {
    fontSize: 11,
    color: "#059669",
    fontWeight: "600",
    marginTop: 2,
  },
  plateBox: {
    backgroundColor: "#FEF08A",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#000000",
    overflow: "hidden",
    alignItems: "center",
  },
  plateHeader: {
    backgroundColor: "#1E3A8A",
    width: "100%",
    alignItems: "center",
    paddingVertical: 1,
  },
  plateInd: {
    color: "#FFFFFF",
    fontSize: 7,
    fontWeight: "800",
  },
  plateNumber: {
    fontSize: 11,
    fontWeight: "800",
    color: "#000000",
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#F9FAFB",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },
  timelineCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 14,
  },
  statusStep: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  statusStepInfo: {
    flex: 1,
  },
  statusStepTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  statusStepDesc: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 1,
  },
  statusTime: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
  },
  verticalBar: {
    width: 2,
    height: 18,
    backgroundColor: "#E5E7EB",
    marginLeft: 15,
    marginVertical: 2,
  },
  simulateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#C7D2FE",
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 16,
  },
  simulateBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4338CA",
  },
  fareCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  routeItemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    gap: 10,
  },
  circleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  routeLocTitle: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
  },
  routeLocAddress: {
    fontSize: 13,
    color: "#1F2937",
    fontWeight: "600",
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 10,
  },
  fareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  farePaymentType: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  farePaymentLabel: {
    fontSize: 12,
    color: "#4B5563",
    fontWeight: "600",
  },
  fareAmountText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  cancelBtn: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#EF4444",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "700",
  },
  doneHomeBtn: {
    backgroundColor: "#10B981",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  doneHomeBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
