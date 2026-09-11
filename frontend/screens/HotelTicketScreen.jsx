import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, CheckCircle2, QrCode, Download, Share2, MapPin, Phone, Calendar, Building2, User, X, Navigation } from 'lucide-react-native';

export default function HotelTicketScreen({ onNavigate, booking }) {
  const bookingId = booking.bookingId || 'ST-HTL-99214';
  const hotel = booking.selectedHotel || {
    name: 'Taj Holiday Village Resort & Spa',
    location: 'Calangute Beach Road, Sinquerim, Goa 403515',
  };
  const room = booking.selectedRoom || {
    name: 'Deluxe Sea View King Room',
  };
  const guest = booking.hotelGuestDetails?.fullName || 'Rahul Sharma';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => onNavigate('my-trips')} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Hotel Booking Confirmed</Text>
            <Text style={styles.headerSub}>SmartTrip Hotel Confirmation Voucher</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Ticket Voucher */}
        <View style={styles.ticketCard}>
          <View style={styles.topStatusBanner}>
            <CheckCircle2 size={20} color="#FFFFFF" />
            <Text style={styles.statusText}>HOTEL RESERVATION CONFIRMED ✓</Text>
          </View>

          <View style={styles.cardPad}>
            {/* Booking Ref */}
            <View style={styles.refRow}>
              <View>
                <Text style={styles.refLabel}>HOTEL BOOKING ID</Text>
                <Text style={styles.refValue}>{bookingId}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.refLabel}>STATUS</Text>
                <Text style={styles.confirmedTag}>Guaranteed Check-in</Text>
              </View>
            </View>

            {/* Hotel Title & Address */}
            <View style={styles.hotelHeaderBox}>
              <Text style={styles.hName}>{hotel.name}</Text>
              <View style={styles.locRow}>
                <MapPin size={12} color="#059669" />
                <Text style={styles.locText}>{hotel.location}</Text>
              </View>
            </View>

            {/* Check-in / Check-out */}
            <View style={styles.stayDatesGrid}>
              <View style={styles.stayBox}>
                <Text style={styles.stayLabel}>CHECK-IN</Text>
                <Text style={styles.stayDate}>{booking.checkInDate || '25 May 2024'}</Text>
                <Text style={styles.stayTime}>From 02:00 PM</Text>
              </View>
              <View style={styles.stayBox}>
                <Text style={styles.stayLabel}>CHECK-OUT</Text>
                <Text style={styles.stayDate}>{booking.checkOutDate || '28 May 2024'}</Text>
                <Text style={styles.stayTime}>Until 11:00 AM</Text>
              </View>
            </View>

            {/* Room & Guest Details */}
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Building2 size={14} color="#059669" />
                <Text style={styles.infoText}>Room: <Text style={styles.infoBold}>{room.name}</Text></Text>
              </View>
              <View style={styles.infoRow}>
                <User size={14} color="#059669" />
                <Text style={styles.infoText}>Primary Guest: <Text style={styles.infoBold}>{guest}</Text></Text>
              </View>
            </View>

            {/* QR Code */}
            <View style={styles.qrSection}>
              <QrCode size={100} color="#0F172A" />
              <Text style={styles.qrText}>Scan at Hotel Front Desk upon arrival</Text>
            </View>

            {/* Total Paid */}
            <View style={styles.paidRow}>
              <Text style={styles.paidLabel}>Total Amount Paid</Text>
              <Text style={styles.paidVal}>₹{booking.totalAmount || 5040}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
            <Phone size={16} color="#059669" />
            <Text style={styles.actionBtnText}>Contact Hotel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
            <Navigation size={16} color="#059669" />
            <Text style={styles.actionBtnText}>Get Directions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
            <Download size={16} color="#059669" />
            <Text style={styles.actionBtnText}>Download Voucher</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onNavigate('cancel-ticket')}
            style={[styles.actionBtn, { backgroundColor: '#FFF0F0', borderColor: '#FEE2E2' }]}
            activeOpacity={0.8}
          >
            <X size={16} color="#DC2626" />
            <Text style={[styles.actionBtnText, { color: '#DC2626' }]}>Cancel Booking</Text>
          </TouchableOpacity>
        </View>
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
    gap: 16,
    paddingBottom: 40,
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 4,
  },
  topStatusBanner: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cardPad: {
    padding: 18,
    gap: 14,
  },
  refRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
  },
  refLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  refValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#059669',
    marginTop: 2,
  },
  confirmedTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10B981',
  },
  hotelHeaderBox: {
    backgroundColor: '#ECFDF5',
    borderRadius: 14,
    padding: 12,
    gap: 4,
  },
  hName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
  stayDatesGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  stayBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  stayLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  stayDate: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  stayTime: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  infoSection: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#64748B',
  },
  infoBold: {
    fontWeight: '800',
    color: '#0F172A',
  },
  qrSection: {
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 6,
  },
  qrText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  paidRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  paidLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  paidVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionBtn: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
});
