import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, Star, MapPin, Clock, ShieldCheck, Wifi, Utensils, Award, ChevronRight, Bed, Users } from 'lucide-react-native';

const rooms = [
  {
    id: 'RM-1',
    name: 'Deluxe Sea View King Room',
    bed: '1 King Bed',
    guests: '2 Adults',
    breakfast: 'Free Breakfast Included',
    cancellation: 'Free Cancellation till 24h',
    price: 4500,
  },
  {
    id: 'RM-2',
    name: 'Executive Suite with Private Balcony',
    bed: '1 Super King Bed + Sofa',
    guests: '3 Guests',
    breakfast: 'Free Breakfast & Dinner',
    cancellation: 'Free Cancellation till 24h',
    price: 6800,
  },
  {
    id: 'RM-3',
    name: 'Luxury Beachfront Villa',
    bed: '2 King Beds',
    guests: '4 Guests',
    breakfast: 'All Meals Included',
    cancellation: 'Free Cancellation till 48h',
    price: 11200,
  },
];

export default function HotelDetailsScreen({ onNavigate, booking, setBooking }) {
  const hotel = booking.selectedHotel || {
    name: 'Taj Holiday Village Resort & Spa',
    location: 'Calangute, Goa',
    starRating: 5,
    guestRating: '4.9',
    pricePerNight: 4500,
  };

  const handleSelectRoom = (room) => {
    setBooking({
      selectedRoom: room,
      totalAmount: room.price + 540,
      bookingType: 'hotel',
    });
    onNavigate('hotel-guest-details');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => onNavigate('hotel-search-results')} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>{hotel.name}</Text>
            <Text style={styles.headerSub}>{hotel.location} · 5 Star Resort</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Photo Gallery Banner */}
        <View style={styles.galleryBanner}>
          <View style={styles.galleryBadge}>
            <Star size={12} color="#FFD700" fill="#FFD700" />
            <Text style={styles.galleryBadgeText}>⭐ {hotel.guestRating || '4.9'} (1,280 Reviews)</Text>
          </View>
        </View>

        {/* Hotel Info */}
        <View style={styles.card}>
          <Text style={styles.hTitle}>{hotel.name}</Text>
          <View style={styles.locRow}>
            <MapPin size={12} color="#059669" />
            <Text style={styles.locText}>{hotel.location}</Text>
          </View>
          <Text style={styles.descText}>
            Experience luxury living along Calangute beach with world-class dining, private villas, spa treatments, and stunning sunset ocean views.
          </Text>

          {/* Check-in / Check-out Times */}
          <View style={styles.timeBox}>
            <View style={styles.timeCol}>
              <Text style={styles.timeLabel}>CHECK-IN TIME</Text>
              <Text style={styles.timeVal}>02:00 PM</Text>
            </View>
            <View style={styles.timeDivider} />
            <View style={styles.timeCol}>
              <Text style={styles.timeLabel}>CHECK-OUT TIME</Text>
              <Text style={styles.timeVal}>11:00 AM</Text>
            </View>
          </View>
        </View>

        {/* Room Selection */}
        <Text style={styles.sectionTitle}>CHOOSE YOUR ROOM</Text>
        {rooms.map((r) => (
          <View key={r.id} style={styles.roomCard}>
            <View style={styles.roomHeader}>
              <Text style={styles.roomTitle}>{r.name}</Text>
              <View style={styles.freeBreakfastBadge}>
                <Utensils size={10} color="#059669" />
                <Text style={styles.freeBreakfastText}>{r.breakfast}</Text>
              </View>
            </View>

            <View style={styles.roomMetaRow}>
              <View style={styles.roomMetaItem}>
                <Bed size={12} color="#64748B" />
                <Text style={styles.roomMetaText}>{r.bed}</Text>
              </View>
              <View style={styles.roomMetaItem}>
                <Users size={12} color="#64748B" />
                <Text style={styles.roomMetaText}>{r.guests}</Text>
              </View>
            </View>

            <View style={styles.roomFooter}>
              <View>
                <Text style={styles.roomPrice}>₹{r.price.toLocaleString()} <Text style={styles.perNight}>/ night</Text></Text>
                <Text style={styles.cancelText}>{r.cancellation}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleSelectRoom(r)}
                style={styles.selectRoomBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.selectRoomText}>Select Room</Text>
                <ChevronRight size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#059669',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 40,
  },
  galleryBanner: {
    height: 120,
    backgroundColor: '#047857',
    borderRadius: 20,
    padding: 14,
    justifyContent: 'flex-end',
  },
  galleryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  galleryBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  hTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locText: {
    fontSize: 12,
    color: '#64748B',
  },
  descText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    marginTop: 4,
  },
  timeBox: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    borderRadius: 14,
    padding: 12,
    marginTop: 6,
  },
  timeCol: {
    flex: 1,
    alignItems: 'center',
  },
  timeDivider: {
    width: 1,
    backgroundColor: '#A7F3D0',
  },
  timeLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#047857',
    letterSpacing: 0.5,
  },
  timeVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#065F46',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginTop: 6,
  },
  roomCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  roomHeader: {
    gap: 4,
  },
  roomTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  freeBreakfastBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  freeBreakfastText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  roomMetaRow: {
    flexDirection: 'row',
    gap: 14,
  },
  roomMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  roomMetaText: {
    fontSize: 11,
    color: '#64748B',
  },
  roomFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  roomPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  perNight: {
    fontSize: 10,
    color: '#94A3B8',
  },
  cancelText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '700',
  },
  selectRoomBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectRoomText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
