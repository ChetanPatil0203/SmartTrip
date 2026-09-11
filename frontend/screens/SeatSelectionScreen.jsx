import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';

const bookedSeats = new Set([6, 10, 19, 23, 34, 35]);
const femaleSeats = new Set([4, 16, 24]);

const upperLayout = [
  [1, 2, null, 3, 4],
  [5, 6, null, 7, 8],
  [9, 10, null, 15, 16],
  [17, 18, null, 12, 13],
  [20, 21, null, 11, 14],
  [22, 23, null, 26, 27],
];
const lowerLayout = [
  [21, 22, 23, null, 24, 25],
  [33, 34, 35, null, 36, 37],
];

export default function SeatSelectionScreen({ onNavigate, booking, setBooking }) {
  const [selected, setSelected] = useState([]);
  const [deck, setDeck] = useState('upper');
  const price = booking.selectedBus?.price ?? 750;
  const layout = deck === 'upper' ? upperLayout : lowerLayout;

  const getStatus = (seat) => {
    if (bookedSeats.has(seat)) return 'booked';
    if (femaleSeats.has(seat)) return 'female';
    if (selected.includes(seat)) return 'selected';
    return 'available';
  };

  const toggle = (seat) => {
    const s = getStatus(seat);
    if (s === 'booked' || s === 'female') return;
    setSelected(prev => prev.includes(seat) ? prev.filter(x => x !== seat) : [...prev, seat]);
  };

  const getSeatStyle = (status) => {
    switch (status) {
      case 'available':
        return { bg: '#F0FFF4', border: '#86EFAC', text: '#166534' };
      case 'selected':
        return { bg: '#D13239', border: '#D13239', text: '#FFFFFF' };
      case 'booked':
        return { bg: '#374151', border: '#4B5563', text: '#9CA3AF' };
      case 'female':
        return { bg: '#FCE7F3', border: '#F472B6', text: '#831843' };
      default:
        return { bg: '#F0FFF4', border: '#86EFAC', text: '#166534' };
    }
  };

  const legend = [
    { label: 'Available', color: '#86EFAC' },
    { label: 'Selected', color: '#D13239' },
    { label: 'Booked', color: '#374151' },
    { label: 'Female', color: '#F472B6' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('bus-details')} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={18} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.operatorTitle}>{booking.selectedBus?.operator}</Text>
          <Text style={styles.busTimeSub}>
            {booking.selectedBus?.departure} – {booking.selectedBus?.arrival}
          </Text>
        </View>
      </View>

      {/* Legend */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.legendContainer}>
        {legend.map(l => (
          <View key={l.label} style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: l.color, borderColor: l.color }]} />
            <Text style={styles.legendText}>{l.label}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Deck Toggle */}
      <View style={styles.deckToggleRow}>
        {['upper', 'lower'].map(d => (
          <TouchableOpacity
            key={d}
            onPress={() => setDeck(d)}
            style={[
              styles.deckBtn,
              { backgroundColor: deck === d ? '#D13239' : 'transparent' }
            ]}
            activeOpacity={0.8}
          >
            <Text style={[styles.deckBtnText, { color: deck === d ? '#FFFFFF' : '#6B7280' }]}>
              {d.toUpperCase()} DECK
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bus Front Indicator */}
      <View style={styles.frontIndicatorRow}>
        <View style={styles.frontBadge}>
          <Text style={styles.frontText}>FRONT</Text>
          <View style={styles.frontIcon}>
            <Text style={{ fontSize: 12 }}>🪟</Text>
          </View>
        </View>
      </View>

      {/* Seat Grid */}
      <ScrollView contentContainerStyle={styles.gridContent}>
        <View style={styles.gridCol}>
          {layout.map((row, ri) => (
            <View key={ri} style={styles.row}>
              {row.map((seat, ci) => {
                if (seat === null) return <View key={ci} style={styles.emptySeat} />;
                const status = getStatus(seat);
                const sStyle = getSeatStyle(status);
                return (
                  <TouchableOpacity
                    key={`${ri}-${ci}`}
                    onPress={() => toggle(seat)}
                    disabled={status === 'booked'}
                    style={[
                      styles.seatBtn,
                      {
                        backgroundColor: sStyle.bg,
                        borderColor: sStyle.border,
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.seatNum, { color: sStyle.text }]}>{seat}</Text>
                    {status === 'selected' && <View style={styles.selectedDot} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <View>
            <Text style={styles.footerLabel}>SELECTED SEATS</Text>
            <Text style={styles.selectedSeatsText}>
              {selected.length > 0 ? selected.join(', ') : '—'}
            </Text>
          </View>
          <View style={styles.alignRight}>
            <Text style={styles.footerLabel}>TOTAL FARE</Text>
            <Text style={styles.farePrice}>
              ₹{(selected.length * price).toLocaleString()}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => { setBooking({ selectedSeats: selected }); onNavigate('boarding-dropping'); }}
          disabled={selected.length === 0}
          style={[styles.proceedBtn, { opacity: selected.length > 0 ? 1 : 0.4 }]}
          activeOpacity={0.8}
        >
          <Text style={styles.proceedBtnText}>PROCEED</Text>
          <ArrowRight size={18} color="#FFFFFF" />
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  operatorTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  busTimeSub: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4B5563',
  },
  deckToggleRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    padding: 4,
  },
  deckBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  deckBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  frontIndicatorRow: {
    alignItems: 'flex-end',
    marginHorizontal: 16,
    marginTop: 12,
  },
  frontBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  frontText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
  },
  frontIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContent: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingBottom: 120,
  },
  gridCol: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  emptySeat: {
    width: 44,
  },
  seatBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  seatNum: {
    fontSize: 12,
    fontWeight: '700',
  },
  selectedDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4ADE80',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  footerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  selectedSeatsText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 2,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  farePrice: {
    fontSize: 20,
    fontWeight: '900',
    color: '#D13239',
    marginTop: 2,
  },
  proceedBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#D13239',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  proceedBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
