import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  ArrowLeft,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Tag,
  CreditCard,
  ChevronRight,
} from "lucide-react-native";
import cabService from "../services/cabService";

const initialRideOptions = [
  {
    id: "auto-std",
    category: "auto",
    isEv: false,
    name: "Smart Auto",
    tagline: "Affordable, quick city commute",
    vehicleModel: "Bajaj RE / TVS King",
    seats: 3,
    etaMin: 2,
    baseFare: 95,
    discountFare: 80,
    emoji: "🛺",
    popularBadge: "MOST POPULAR",
    features: ["No bargaining", "Pocket friendly", "Direct pickup"],
  },
  {
    id: "auto-ev",
    category: "auto",
    isEv: true,
    name: "Smart Auto EV",
    tagline: "100% Electric, silent & eco-friendly",
    vehicleModel: "Mahindra Treo / Piaggio Ape E",
    seats: 3,
    etaMin: 3,
    baseFare: 105,
    discountFare: 90,
    emoji: "⚡🛺",
    popularBadge: "GREEN RIDE",
    features: ["Zero emissions", "Quiet ride", "Clean vehicle"],
  },
  {
    id: "cab-mini",
    category: "cab",
    isEv: false,
    name: "Smart Cab Mini",
    tagline: "Everyday pocket-friendly AC rides",
    vehicleModel: "Maruti WagonR / Tata Tiago",
    seats: 4,
    etaMin: 4,
    baseFare: 195,
    discountFare: 175,
    emoji: "🚗",
    popularBadge: null,
    features: ["Compact AC", "Trained driver", "Boot space for 2 bags"],
  },
  {
    id: "cab-sedan",
    category: "cab",
    isEv: false,
    name: "Prime Sedan",
    tagline: "Comfortable spacious sedans & top drivers",
    vehicleModel: "Maruti Dzire / Honda Amaze",
    seats: 4,
    etaMin: 3,
    baseFare: 265,
    discountFare: 240,
    emoji: "🚘",
    popularBadge: "TOP RATED",
    features: ["Extra legroom", "Top 5★ drivers", "Large boot space"],
  },
  {
    id: "cab-suv",
    category: "cab",
    isEv: false,
    name: "Prime SUV / XL",
    tagline: "Spacious 6-seater for group & heavy luggage",
    vehicleModel: "Maruti Ertiga / Toyota Innova",
    seats: 6,
    etaMin: 6,
    baseFare: 420,
    discountFare: 385,
    emoji: "🚙",
    popularBadge: "6 SEATER",
    features: ["6 Passenger seats", "Maximum luggage", "AC in all rows"],
  },
];

export default function CabSearchResultsScreen({ onNavigate, booking, setBooking }) {
  const defaultTab = booking.category === "auto" ? "auto" : "all";
  const [activeFilter, setActiveFilter] = useState(defaultTab);
  const [selectedId, setSelectedId] = useState(
    booking.category === "auto" ? "auto-std" : "cab-sedan"
  );
  const [rides, setRides] = useState(initialRideOptions);
  const [isBooking, setIsBooking] = useState(false);
  const [promoApplied, setPromoApplied] = useState(true);

  const pickup = booking.ridePickup || "Chhatrapati Shivaji Maharaj Terminus (CSMT)";
  const drop = booking.rideDrop || "Bandra Kurla Complex (BKC)";

  useEffect(() => {
    let mounted = true;
    const fetchBackendCabs = async () => {
      try {
        const res = await cabService.searchCabs({
          pickup,
          drop,
          category: activeFilter === "all" ? "all" : activeFilter,
        });
        if (mounted && res && res.data && res.data.rideOptions && res.data.rideOptions.length > 0) {
          setRides(res.data.rideOptions);
        }
      } catch (err) {
        console.warn("Live cab search notice:", err.message);
      }
    };
    fetchBackendCabs();
    return () => { mounted = false; };
  }, [activeFilter, pickup, drop]);

  const filteredRides = rides.filter((r) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "auto") return r.category === "auto";
    if (activeFilter === "cab") return r.category === "cab" || r.category === "sedan" || r.category === "suv";
    if (activeFilter === "ev") return r.isEv;
    return true;
  });

  const selectedVehicle = filteredRides.find((r) => r.id === selectedId) || filteredRides[0] || rides[0];
  const finalPrice = promoApplied ? selectedVehicle.discountFare : selectedVehicle.baseFare;

  const handleConfirmRide = async () => {
    setIsBooking(true);

    try {
      // Call backend cab booking API
      const res = await cabService.bookCab({
        pickupAddress: pickup,
        dropAddress: drop,
        vehicleId: selectedVehicle.id,
        promoApplied,
      });

      if (res && res.data) {
        setIsBooking(false);
        setBooking({
          bookingId: res.data.bookingId,
          bookingReference: res.data.bookingReference,
          selectedRide: selectedVehicle,
          rideDriver: res.data.rideDriver,
          rideOtp: res.data.rideOtp,
          totalAmount: res.data.totalAmount || finalPrice,
          bookingType: res.data.bookingType || selectedVehicle.category,
        });
        onNavigate("cab-tracking");
        return;
      }
    } catch (err) {
      console.warn("Live cab booking fallback active:", err.message);
    }

    // Offline Fallback
    const mockDriver = {
      name: selectedVehicle.category === "auto" ? "Ramesh Pawar" : "Sanjay Gaikwad",
      rating: "4.9",
      totalTrips: "1,840 trips",
      phone: "+91 98234 56789",
      vehicleName: selectedVehicle.name,
      vehicleModel: selectedVehicle.vehicleModel,
      plateNumber: selectedVehicle.category === "auto" ? "MH 01 AB 4321" : "MH 02 CE 8976",
      etaMins: selectedVehicle.etaMin,
      otp: Math.floor(1000 + Math.random() * 9000).toString(),
      price: finalPrice,
      pickupAddress: pickup,
      dropAddress: drop,
      distance: "14.2 km",
      duration: "28 mins",
      category: selectedVehicle.category,
      emoji: selectedVehicle.emoji,
    };

    setIsBooking(false);
    setBooking({
      selectedRide: selectedVehicle,
      rideDriver: mockDriver,
      rideOtp: mockDriver.otp,
      totalAmount: finalPrice,
      bookingType: selectedVehicle.category,
    });
    onNavigate("cab-tracking");
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onNavigate("home")}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#1F2937" />
        </TouchableOpacity>

        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>Select Your Ride</Text>
          <Text style={styles.headerSub}>Fast pickup · Upfront fixed price</Text>
        </View>

        <View style={styles.safetyBadge}>
          <ShieldCheck size={14} color="#059669" />
          <Text style={styles.safetyText}>Safe Ride</Text>
        </View>
      </View>

      {/* Route Summary Card */}
      <View style={styles.routeCard}>
        <View style={styles.routeCol}>
          <View style={styles.routeRow}>
            <View style={[styles.dot, { backgroundColor: "#10B981" }]} />
            <Text style={styles.routeLabel} numberOfLines={1}>
              <Text style={styles.routeBold}>Pickup: </Text>
              {pickup}
            </Text>
          </View>
          <View style={styles.routeDottedLine} />
          <View style={styles.routeRow}>
            <View style={[styles.dot, { backgroundColor: "#EF4444" }]} />
            <Text style={styles.routeLabel} numberOfLines={1}>
              <Text style={styles.routeBold}>Drop: </Text>
              {drop}
            </Text>
          </View>
        </View>
        <View style={styles.routeMetaCol}>
          <Text style={styles.routeDistance}>14.2 km</Text>
          <Text style={styles.routeTime}>~28 mins</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          onPress={() => setActiveFilter("all")}
          style={[styles.filterChip, activeFilter === "all" && styles.filterChipActive]}
        >
          <Text
            style={[styles.filterChipText, activeFilter === "all" && styles.filterChipTextActive]}
          >
            All Rides
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveFilter("auto")}
          style={[styles.filterChip, activeFilter === "auto" && styles.filterChipActive]}
        >
          <Text style={styles.chipEmoji}>🛺</Text>
          <Text
            style={[styles.filterChipText, activeFilter === "auto" && styles.filterChipTextActive]}
          >
            Auto Rickshaw
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveFilter("cab")}
          style={[styles.filterChip, activeFilter === "cab" && styles.filterChipActive]}
        >
          <Text style={styles.chipEmoji}>🚕</Text>
          <Text
            style={[styles.filterChipText, activeFilter === "cab" && styles.filterChipTextActive]}
          >
            Cabs / Taxi
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveFilter("ev")}
          style={[styles.filterChip, activeFilter === "ev" && styles.filterChipActive]}
        >
          <Text style={styles.chipEmoji}>⚡</Text>
          <Text
            style={[styles.filterChipText, activeFilter === "ev" && styles.filterChipTextActive]}
          >
            Electric EV
          </Text>
        </TouchableOpacity>
      </View>

      {/* Ride Options List */}
      <ScrollView
        contentContainerStyle={styles.scrollList}
        showsVerticalScrollIndicator={false}
      >
        {filteredRides.map((ride) => {
          const isSelected = ride.id === selectedId;
          const displayPrice = promoApplied ? ride.discountFare : ride.baseFare;

          return (
            <TouchableOpacity
              key={ride.id}
              onPress={() => setSelectedId(ride.id)}
              style={[styles.rideCard, isSelected && styles.rideCardSelected]}
              activeOpacity={0.85}
            >
              {ride.popularBadge && (
                <View
                  style={[
                    styles.badgeRibbon,
                    ride.popularBadge === "GREEN RIDE" && { backgroundColor: "#10B981" },
                  ]}
                >
                  <Text style={styles.badgeRibbonText}>{ride.popularBadge}</Text>
                </View>
              )}

              <View style={styles.rideTopRow}>
                {/* Vehicle Visual */}
                <View style={styles.vehicleGraphicBox}>
                  <Text style={styles.vehicleEmoji}>{ride.emoji}</Text>
                  <View style={styles.etaPill}>
                    <Clock size={10} color="#374151" />
                    <Text style={styles.etaPillText}>{ride.etaMin} min</Text>
                  </View>
                </View>

                {/* Ride Info */}
                <View style={styles.rideInfoCol}>
                  <View style={styles.titleWithSeats}>
                    <Text style={styles.rideTitle}>{ride.name}</Text>
                    <View style={styles.seatPill}>
                      <Text style={styles.seatPillText}>👥 {ride.seats}</Text>
                    </View>
                  </View>

                  <Text style={styles.rideTagline}>{ride.tagline}</Text>
                  <Text style={styles.vehicleModel}>{ride.vehicleModel}</Text>

                  {/* Highlights */}
                  <View style={styles.featuresRow}>
                    {ride.features.map((f, i) => (
                      <Text key={i} style={styles.featureItem}>
                        ✓ {f}
                      </Text>
                    ))}
                  </View>
                </View>

                {/* Price Column */}
                <View style={styles.priceCol}>
                  <Text style={styles.priceText}>₹{displayPrice}</Text>
                  {promoApplied && (
                    <Text style={styles.strikePrice}>₹{ride.baseFare}</Text>
                  )}
                  {isSelected && (
                    <View style={styles.selectedRadio}>
                      <CheckCircle2 size={20} color="#D13239" />
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Safety & Info Strip */}
        <View style={styles.safetyInfoCard}>
          <View style={styles.safetyIconCircle}>
            <ShieldCheck size={22} color="#2563EB" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.safetyTitle}>SmartTrip Ride Safety Guarantee</Text>
            <Text style={styles.safetySubtitle}>
              Live GPS tracking • 24x7 Emergency SOS support • Verified drivers & sanitized vehicles.
            </Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Floating Booking Bar */}
      <View style={styles.bottomBar}>
        {/* Promo bar */}
        <View style={styles.bottomPromoRow}>
          <View style={styles.promoLeft}>
            <Tag size={14} color="#D13239" />
            <Text style={styles.promoCodeText}>
              <Text style={{ fontWeight: "700" }}>SMARTTRIP</Text> applied (-₹15 discount)
            </Text>
          </View>
          <TouchableOpacity onPress={() => setPromoApplied(!promoApplied)}>
            <Text style={styles.promoToggleText}>
              {promoApplied ? "Remove" : "Apply"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Payment & CTA button */}
        <View style={styles.ctaRow}>
          <View style={styles.ctaPriceBox}>
            <View style={styles.paymentMethodRow}>
              <CreditCard size={14} color="#4B5563" />
              <Text style={styles.paymentMethodLabel}>Cash / UPI</Text>
            </View>
            <Text style={styles.ctaTotalAmount}>₹{finalPrice}</Text>
          </View>

          <TouchableOpacity
            onPress={handleConfirmRide}
            style={styles.confirmBtn}
            activeOpacity={0.85}
            disabled={isBooking}
          >
            {isBooking ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.confirmBtnContent}>
                <Text style={styles.confirmBtnText}>
                  Book {selectedVehicle.name}
                </Text>
                <ChevronRight size={18} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  headerSub: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 1,
  },
  safetyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  safetyText: {
    fontSize: 11,
    color: "#059669",
    fontWeight: "700",
  },
  routeCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  routeCol: {
    flex: 1,
    marginRight: 12,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  routeDottedLine: {
    width: 2,
    height: 12,
    backgroundColor: "#CBD5E1",
    marginLeft: 3,
    marginVertical: 2,
  },
  routeLabel: {
    fontSize: 12,
    color: "#4B5563",
    flex: 1,
  },
  routeBold: {
    fontWeight: "700",
    color: "#1F2937",
  },
  routeMetaCol: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  routeDistance: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  routeTime: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 1,
  },
  filterBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterChipActive: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  chipEmoji: {
    fontSize: 13,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  scrollList: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  rideCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  rideCardSelected: {
    borderColor: "#D13239",
    backgroundColor: "#FFF8F8",
  },
  badgeRibbon: {
    position: "absolute",
    top: 0,
    right: 18,
    backgroundColor: "#D13239",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  badgeRibbonText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  rideTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  vehicleGraphicBox: {
    alignItems: "center",
    justifyContent: "center",
    width: 62,
    marginRight: 12,
  },
  vehicleEmoji: {
    fontSize: 34,
  },
  etaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  etaPillText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#374151",
  },
  rideInfoCol: {
    flex: 1,
  },
  titleWithSeats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rideTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  seatPill: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  seatPillText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#4B5563",
  },
  rideTagline: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },
  vehicleModel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#374151",
    marginTop: 2,
  },
  featuresRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  featureItem: {
    fontSize: 10,
    color: "#059669",
    fontWeight: "600",
  },
  priceCol: {
    alignItems: "flex-end",
    marginLeft: 8,
    minWidth: 64,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  strikePrice: {
    fontSize: 11,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
    marginTop: 1,
  },
  selectedRadio: {
    marginTop: 8,
  },
  safetyInfoCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    marginTop: 4,
  },
  safetyIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },
  safetyTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E40AF",
  },
  safetySubtitle: {
    fontSize: 11,
    color: "#3B82F6",
    marginTop: 2,
    lineHeight: 16,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 10,
  },
  bottomPromoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  promoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  promoCodeText: {
    fontSize: 12,
    color: "#374151",
  },
  promoToggleText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#D13239",
  },
  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  ctaPriceBox: {
    justifyContent: "center",
  },
  paymentMethodRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  paymentMethodLabel: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
  },
  ctaTotalAmount: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginTop: 2,
  },
  confirmBtn: {
    backgroundColor: "#D13239",
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 190,
  },
  confirmBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  confirmBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
