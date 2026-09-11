import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, Bus, Star, Clock, Armchair, AlertCircle, ChevronRight, RefreshCw } from 'lucide-react-native';

const altBuses = [
  { id: 'a1', operator: 'Shivneri Travels', departure: '08:30 PM', arrival: '11:45 PM', duration: '3.15h', type: 'Volvo AC Sleeper', price: 820, seats: 14, rating: 4.3, onTime: 89, match: 'Best Match' },
  { id: 'a2', operator: 'VRL Travels', departure: '09:00 PM', arrival: '12:15 AM', duration: '3.25h', type: 'AC Sleeper', price: 750, seats: 22, rating: 4.5, onTime: 94, match: 'Most Reliable' },
  { id: 'a3', operator: 'Sai Travels', departure: '09:30 PM', arrival: '12:30 AM', duration: '3h', type: 'AC Seater', price: 680, seats: 30, rating: 4.0, onTime: 85, match: 'Budget' },
];

export default function AlternativeBusScreen({ onNavigate, booking, setBooking }) {
  const [selected, setSelected] = useState(null);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('delay-alert')} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Alternative Buses</Text>
          <Text style={styles.headerSub}>
            {booking.from || 'Mumbai'} → {booking.to || 'Pune'} · {booking.date}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Reason banner */}
        <View style={styles.reasonCard}>
          <AlertCircle size={18} color="#D97706" />
          <View style={styles.flex1}>
            <Text style={styles.reasonTitle}>Your bus is delayed by ~25 min</Text>
            <Text style={styles.reasonSub}>Here are the best alternative buses on the same route.</Text>
          </View>
        </View>

        <View style={styles.countRow}>
          <RefreshCw size={14} color="#9CA3AF" />
          <Text style={styles.countText}>{altBuses.length} alternatives found</Text>
        </View>

        {altBuses.map(bus => (
          <TouchableOpacity
            key={bus.id}
            onPress={() => setSelected(bus.id)}
            style={[
              styles.busCard,
              { borderColor: selected === bus.id ? '#D13239' : 'transparent' },
            ]}
            activeOpacity={0.8}
          >
            {/* Match badge & rating */}
            <View style={styles.busHeaderRow}>
              <View style={styles.matchBadge}>
                <Text style={styles.matchBadgeText}>{bus.match}</Text>
              </View>
              <View style={styles.ratingBadge}>
                <Star size={10} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.ratingText}>{bus.rating}</Text>
              </View>
            </View>

            <View style={styles.busBody}>
              <Text style={styles.operatorName}>{bus.operator}</Text>
              <Text style={styles.busTypeSub}>{bus.type}</Text>

              <View style={styles.timeRow}>
                <View>
                  <Text style={styles.timeText}>{bus.departure}</Text>
                  <Text style={styles.citySub}>{booking.from || 'Mumbai'}</Text>
                </View>
                <View style={styles.durationCol}>
                  <View style={styles.durationRow}>
                    <Clock size={10} color="#9CA3AF" />
                    <Text style={styles.durationText}>{bus.duration}</Text>
                  </View>
                  <View style={styles.lineRow}>
                    <View style={styles.line} />
                    <Bus size={14} color="#D13239" />
                    <View style={styles.line} />
                  </View>
                </View>
                <View style={styles.alignRight}>
                  <Text style={styles.timeText}>{bus.arrival}</Text>
                  <Text style={styles.citySub}>{booking.to || 'Pune'}</Text>
                </View>
              </View>

              <View style={styles.priceRow}>
                <View>
                  <Text style={styles.priceText}>₹{bus.price}</Text>
                  <View style={styles.seatsRow}>
                    <Armchair size={10} color="#9CA3AF" />
                    <Text style={styles.seatsText}>
                      {bus.seats} left · {bus.onTime}% on-time
                    </Text>
                  </View>
                </View>
                <View style={[styles.radioCircle, { borderColor: selected === bus.id ? '#D13239' : '#D1D5DB' }]}>
                  {selected === bus.id && <View style={styles.radioInner} />}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => onNavigate('refund-status')}
          style={styles.refundBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.refundBtnText}>Request Refund</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!selected}
          onPress={() => {
            const bObj = altBuses.find(b => b.id === selected);
            if (bObj) {
              setBooking({ selectedBus: { ...bObj, from: booking.from, to: booking.to, score: bObj.rating, bookingAccuracy: 95 } });
              onNavigate('seat-selection');
            }
          }}
          style={[styles.bookAltBtn, { opacity: selected ? 1 : 0.4 }]}
          activeOpacity={0.8}
        >
          <Text style={styles.bookAltBtnText}>Book Alternative</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#D13239',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 100,
  },
  reasonCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FEF3C7',
    borderRadius: 20,
    padding: 16,
  },
  flex1: {
    flex: 1,
  },
  reasonTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
  },
  reasonSub: {
    fontSize: 12,
    color: '#B45309',
    marginTop: 2,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  busCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 2,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  busHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  matchBadge: {
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#D13239',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
  busBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  operatorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  busTypeSub: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timeText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
  },
  citySub: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  durationCol: {
    alignItems: 'center',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  durationText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginVertical: 4,
  },
  line: {
    width: 32,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#D13239',
  },
  seatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  seatsText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D13239',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  refundBtn: {
    flex: 1,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#D13239',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refundBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D13239',
  },
  bookAltBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#D13239',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    elevation: 4,
  },
  bookAltBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
