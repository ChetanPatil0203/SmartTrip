import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Star,
  Filter,
  Wifi,
  ShieldCheck,
  ChevronRight,
  Award,
} from "lucide-react-native";
import { CardSkeleton } from "../components/SkeletonLoader";
import EmptyState from "../components/EmptyState";
import { hotelService } from "../services/travelService";

const mockHotels = [
  {
    id: "HT-101",
    name: "Taj Holiday Village Resort & Spa",
    location: "Calangute, Goa",
    distance: "0.4 km from beach",
    starRating: 5,
    guestRating: "4.9",
    reviewsCount: "1,280",
    pricePerNight: 4500,
    taxes: 540,
    cancellation: "Free Cancellation till 24h before",
    amenities: ["Wi-Fi", "Pool", "Breakfast", "Spa"],
    color: "#059669",
  },
  {
    id: "HT-102",
    name: "Grand Hyatt Beach Resort",
    location: "Bambolim, Goa",
    distance: "1.2 km from city center",
    starRating: 5,
    guestRating: "4.8",
    reviewsCount: "940",
    pricePerNight: 5800,
    taxes: 690,
    cancellation: "Free Cancellation till 48h before",
    amenities: ["Wi-Fi", "Pool", "Gym", "Bar"],
    color: "#059669",
  },
  {
    id: "HT-103",
    name: "Lemon Tree Amarante Beach Resort",
    location: "Candolim, Goa",
    distance: "0.2 km from beach",
    starRating: 4,
    guestRating: "4.6",
    reviewsCount: "2,150",
    pricePerNight: 3200,
    taxes: 380,
    cancellation: "Free Cancellation",
    amenities: ["Wi-Fi", "Pool", "Breakfast"],
    color: "#059669",
  },
  {
    id: "HT-104",
    name: "Zostel Goa Hostel & Villas",
    location: "Anjuna, Goa",
    distance: "0.8 km from Anjuna flea market",
    starRating: 3,
    guestRating: "4.7",
    reviewsCount: "3,410",
    pricePerNight: 1200,
    taxes: 140,
    cancellation: "Non-refundable",
    amenities: ["Wi-Fi", "AC", "Café"],
    color: "#059669",
  },
];

export default function HotelSearchResultsScreen({ onNavigate, booking, setBooking }) {
  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState(mockHotels);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    hotelService.searchHotels({
      city: booking.hotelDestination || 'Goa',
      checkIn: booking.checkInDate || new Date().toISOString().split('T')[0],
      checkOut: booking.checkOutDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      rooms: booking.hotelRooms || 1,
      guests: booking.hotelGuests || 2,
    })
      .then(res => {
        if (!isMounted) return;
        const hotelList = res?.data?.hotels || [];
        if (hotelList.length > 0) {
          const mapped = hotelList.map(h => ({
            id: h.id,
            name: h.name,
            location: `${h.address || ''}, ${h.city || ''}`.trim(),
            distance: 'City Center',
            starRating: h.starRating || 4,
            guestRating: String(h.rating || '4.5'),
            reviewsCount: '250+',
            pricePerNight: h.startingPrice || 3500,
            taxes: Math.round((h.startingPrice || 3500) * 0.12),
            cancellation: 'Free Cancellation available',
            amenities: h.amenities || ['Wi-Fi', 'AC', 'Breakfast'],
            color: '#059669',
          }));
          setHotels(mapped);
        } else {
          setHotels(mockHotels);
        }
      })
      .catch(() => {
        if (isMounted) setHotels(mockHotels);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [booking.hotelDestination, booking.checkInDate, booking.checkOutDate]);

  const handleSelectHotel = (hotel) => {
    setBooking({
      selectedHotel: hotel,
      totalAmount: hotel.pricePerNight + hotel.taxes,
      bookingType: "hotel",
    });
    onNavigate("hotel-details");
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
              Hotels in {booking.hotelDestination || "Goa"}
            </Text>
            <Text style={styles.headerSub}>
              {booking.checkInDate || "Today"} - {booking.checkOutDate || "Tomorrow"} ·{" "}
              {booking.hotelGuests || "2 Guests"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => onNavigate("hotel-filter")}
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
        ) : hotels.length === 0 ? (
          <EmptyState
            title="No Hotels Found"
            subtitle="Try searching for a different destination or altering guest options."
            onAction={() => onNavigate("hotel-filter")}
            actionLabel="Change Filters"
          />
        ) : (
          hotels.map((h) => (
            <TouchableOpacity
              key={h.id}
              onPress={() => handleSelectHotel(h)}
              style={styles.hotelCard}
              activeOpacity={0.8}
            >
              {/* Hotel Image Simulated Header */}
              <View style={styles.imageHeaderBox}>
                <View style={styles.starRow}>
                  {Array.from({ length: h.starRating }).map((_, i) => (
                    <Star key={i} size={12} color="#FFD700" fill="#FFD700" />
                  ))}
                </View>
                <View style={styles.ratingBadge}>
                  <Award size={12} color="#FFFFFF" />
                  <Text style={styles.ratingText}>
                    {h.guestRating} Superb ({h.reviewsCount})
                  </Text>
                </View>
              </View>

              <View style={styles.cardPad}>
                <Text style={styles.hotelName} numberOfLines={1}>
                  {h.name}
                </Text>
                <View style={styles.locationRow}>
                  <MapPin size={12} color="#64748B" />
                  <Text style={styles.locationText} numberOfLines={1}>
                    {h.location} · {h.distance}
                  </Text>
                </View>

                {/* Amenities */}
                <View style={styles.amenitiesRow}>
                  {h.amenities.map((a) => (
                    <View key={a} style={styles.amenityChip}>
                      <Text style={styles.amenityText}>• {a}</Text>
                    </View>
                  ))}
                </View>

                {/* Cancellation Tag */}
                <View style={styles.cancelTag}>
                  <ShieldCheck size={12} color="#059669" />
                  <Text style={styles.cancelText} numberOfLines={1}>
                    {h.cancellation}
                  </Text>
                </View>

                {/* Price & CTA */}
                <View style={styles.priceRow}>
                  <View>
                    <Text style={styles.pricePerNight}>
                      ₹{h.pricePerNight.toLocaleString()}{" "}
                      <Text style={styles.perNightLabel}>/ night</Text>
                    </Text>
                    <Text style={styles.taxesText}>+ ₹{h.taxes} taxes & fees</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleSelectHotel(h)}
                    style={styles.viewRoomsBtn}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.viewRoomsText}>View Rooms</Text>
                    <ChevronRight size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
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
    backgroundColor: "#059669",
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
    gap: 16,
    paddingBottom: 40,
  },
  hotelCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 3,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  imageHeaderBox: {
    height: 85,
    backgroundColor: "#047857",
    padding: 14,
    justifyContent: "space-between",
  },
  starRow: {
    flexDirection: "row",
    gap: 4,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  cardPad: {
    padding: 16,
    gap: 8,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 11,
    color: "#64748B",
  },
  amenitiesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  amenityChip: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  amenityText: {
    fontSize: 10,
    color: "#334155",
    fontWeight: "600",
  },
  cancelTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  cancelText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#059669",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 10,
    marginTop: 6,
  },
  pricePerNight: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
  },
  perNightLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
  },
  taxesText: {
    fontSize: 10,
    color: "#94A3B8",
  },
  viewRoomsBtn: {
    backgroundColor: "#059669",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewRoomsText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});
