import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, Plane, ChevronRight, Check } from 'lucide-react-native';

const seatRows = [
  { row: 1, type: 'premium', seats: [{ id: '1A', p: 500 }, { id: '1B', p: 350 }, { id: '1C', p: 350 }, { id: '1D', p: 350 }, { id: '1E', p: 350 }, { id: '1F', p: 500 }] },
  { row: 2, type: 'premium', seats: [{ id: '2A', p: 500 }, { id: '2B', p: 350 }, { id: '2C', p: 350 }, { id: '2D', p: 350 }, { id: '2E', p: 350 }, { id: '2F', p: 500 }] },
  { row: 3, type: 'standard', seats: [{ id: '3A', p: 250 }, { id: '3B', p: 0, occ: true }, { id: '3C', p: 0 }, { id: '3D', p: 0 }, { id: '3E', p: 0, occ: true }, { id: '3F', p: 250 }] },
  { row: 4, type: 'standard', seats: [{ id: '4A', p: 250 }, { id: '4B', p: 0 }, { id: '4C', p: 0 }, { id: '4D', p: 0, occ: true }, { id: '4E', p: 0 }, { id: '4F', p: 250 }] },
  { row: 5, type: 'standard', seats: [{ id: '5A', p: 250 }, { id: '5B', p: 0 }, { id: '5C', p: 0, occ: true }, { id: '5D', p: 0 }, { id: '5E', p: 0 }, { id: '5F', p: 250 }] },
  { row: 6, type: 'standard', seats: [{ id: '6A', p: 250 }, { id: '6B', p: 0 }, { id: '6C', p: 0 }, { id: '6D', p: 0 }, { id: '6E', p: 0 }, { id: '6F', p: 250 }] },
];

export default function FlightSeatSelectionScreen({ onNavigate, booking, setBooking }) {
  const [selectedSeat, setSelectedSeat] = useState('2A');
  const [seatPrice, setSeatPrice] = useState(500);

  const toggleSeat = (s) => {
    if (s.occ) return;
    setSelectedSeat(s.id);
    setSeatPrice(s.p);
  };

  const handleContinue = () => {
    setBooking({
      selectedFlightSeats: [selectedSeat],
      flightSeatPrice: seatPrice,
      totalAmount: (booking.selectedFlight?.price || 5490) + seatPrice,
      bookingType: 'flight',
    });
    onNavigate('flight-addons');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => onNavigate('flight-details')} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Select Aircraft Seat</Text>
            <Text style={styles.headerSub}>SmartAir · Boeing 737 (3x3 Layout)</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Legend Bar */}
        <View style={styles.legendBar}>
          <View style={styles.legendItem}>
            <View style={[styles.seatBoxLegend, { borderColor: '#CBD5E1' }]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.seatBoxLegend, { backgroundColor: '#0284C7', borderColor: '#0284C7' }]} />
            <Text style={styles.legendText}>Selected</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.seatBoxLegend, { backgroundColor: '#E2E8F0', borderColor: '#E2E8F0' }]} />
            <Text style={styles.legendText}>Occupied</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.seatBoxLegend, { backgroundColor: '#F3E8FF', borderColor: '#9333EA' }]} />
            <Text style={styles.legendText}>XL Legroom</Text>
          </View>
        </View>

        {/* Cockpit Indicator */}
        <View style={styles.cockpitIndicator}>
          <Plane size={18} color="#0284C7" style={{ transform: [{ rotate: '180deg' }] }} />
          <Text style={styles.cockpitText}>FRONT OF AIRCRAFT</Text>
        </View>

        {/* Aircraft Seat Grid */}
        <View style={styles.fuselage}>
          <View style={styles.colHeaderRow}>
            <Text style={styles.colLabel}>A (Win)</Text>
            <Text style={styles.colLabel}>B</Text>
            <Text style={styles.colLabel}>C (Aisle)</Text>
            <View style={{ width: 24 }} />
            <Text style={styles.colLabel}>D (Aisle)</Text>
            <Text style={styles.colLabel}>E</Text>
            <Text style={styles.colLabel}>F (Win)</Text>
          </View>

          {seatRows.map((r) => (
            <View key={r.row} style={styles.rowGrid}>
              {/* Left Seats A, B, C */}
              {r.seats.slice(0, 3).map((s) => {
                const isSelected = selectedSeat === s.id;
                const isOccupied = s.occ;
                const isPremium = r.type === 'premium';
                return (
                  <TouchableOpacity
                    key={s.id}
                    onPress={() => toggleSeat(s)}
                    disabled={isOccupied}
                    style={[
                      styles.seatBtn,
                      isPremium && styles.seatPremium,
                      isSelected && styles.seatSelected,
                      isOccupied && styles.seatOccupied,
                    ]}
                  >
                    <Text
                      style={[
                        styles.seatText,
                        isPremium && { color: '#9333EA' },
                        isSelected && { color: '#FFFFFF' },
                        isOccupied && { color: '#94A3B8' },
                      ]}
                    >
                      {s.id}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {/* Aisle Spacer */}
              <View style={styles.aisle}>
                <Text style={styles.rowNum}>{r.row}</Text>
              </View>

              {/* Right Seats D, E, F */}
              {r.seats.slice(3, 6).map((s) => {
                const isSelected = selectedSeat === s.id;
                const isOccupied = s.occ;
                const isPremium = r.type === 'premium';
                return (
                  <TouchableOpacity
                    key={s.id}
                    onPress={() => toggleSeat(s)}
                    disabled={isOccupied}
                    style={[
                      styles.seatBtn,
                      isPremium && styles.seatPremium,
                      isSelected && styles.seatSelected,
                      isOccupied && styles.seatOccupied,
                    ]}
                  >
                    <Text
                      style={[
                        styles.seatText,
                        isPremium && { color: '#9333EA' },
                        isSelected && { color: '#FFFFFF' },
                        isOccupied && { color: '#94A3B8' },
                      ]}
                    >
                      {s.id}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {/* Selected Seat Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.sumRow}>
            <Text style={styles.sumLabel}>Selected Seat:</Text>
            <Text style={styles.sumVal}>{selectedSeat} ({seatPrice === 0 ? 'Free' : `+₹${seatPrice}`})</Text>
          </View>
          <View style={styles.sumRow}>
            <Text style={styles.sumLabel}>Base Flight Ticket:</Text>
            <Text style={styles.sumVal}>₹{booking.selectedFlight?.price || 5490}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Selected Seat: {selectedSeat}</Text>
          <Text style={styles.bottomPrice}>₹{(booking.selectedFlight?.price || 5490) + seatPrice}</Text>
        </View>
        <TouchableOpacity onPress={handleContinue} style={styles.continueBtn} activeOpacity={0.8}>
          <Text style={styles.continueText}>Select Add-ons</Text>
          <ChevronRight size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#0284C7',
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
    paddingBottom: 90,
  },
  legendBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  seatBoxLegend: {
    width: 14,
    height: 14,
    borderRadius: 4,
    borderWidth: 1,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  cockpitIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  cockpitText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  fuselage: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  colHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  colLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    width: 36,
    textAlign: 'center',
  },
  rowGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seatBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatPremium: {
    backgroundColor: '#F3E8FF',
    borderColor: '#C084FC',
  },
  seatSelected: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  seatOccupied: {
    backgroundColor: '#E2E8F0',
    borderColor: '#E2E8F0',
  },
  seatText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
  },
  aisle: {
    width: 24,
    alignItems: 'center',
  },
  rowNum: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  sumRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sumLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  sumVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8,
  },
  bottomLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  bottomPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  continueBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
