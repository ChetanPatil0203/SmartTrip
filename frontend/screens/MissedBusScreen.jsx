import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, Bus, Phone, HelpCircle, RefreshCw, Navigation, Clock, AlertTriangle } from 'lucide-react-native';

const nextBuses = [
  { operator: 'Shivneri Travels', time: '09:00 PM', seats: 18, price: 820 },
  { operator: 'VRL Travels', time: '09:30 PM', seats: 24, price: 750 },
];

export default function MissedBusScreen({ onNavigate, booking }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('live-tracking')} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Missed Bus Assistance</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.cardCenter}>
          <View style={styles.iconBox}>
            <AlertTriangle size={40} color="#D13239" />
          </View>
          <View style={styles.alignCenter}>
            <Text style={styles.heroTitle}>Missed Your Bus?</Text>
            <Text style={styles.heroSub}>
              Don't worry — we'll help you get on the next available bus.
            </Text>
          </View>
        </View>

        {/* Situation */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Situation</Text>
          <View style={styles.departedRow}>
            <View style={styles.busRow}>
              <Bus size={16} color="#D13239" />
              <Text style={styles.busRowText}>Your Bus</Text>
            </View>
            <Text style={styles.departedBadge}>DEPARTED</Text>
          </View>
          <View style={styles.grid2}>
            <View style={[styles.gridCell, { backgroundColor: '#FFF0F0' }]}>
              <Text style={styles.cellLabel}>Departed At</Text>
              <Text style={styles.cellVal}>{booking.selectedBus?.departure || '08:00 PM'}</Text>
            </View>
            <View style={[styles.gridCell, { backgroundColor: '#EFF6FF' }]}>
              <Text style={styles.cellLabel}>Route</Text>
              <Text style={styles.cellVal}>{booking.from || 'Mumbai'} → {booking.to || 'Pune'}</Text>
            </View>
          </View>
        </View>

        {/* Next buses */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Clock size={16} color="#D13239" />
            <Text style={styles.cardTitle}>Next Available Buses</Text>
          </View>
          {nextBuses.map((bus, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => onNavigate('search-results')}
              style={styles.busItem}
              activeOpacity={0.7}
            >
              <View>
                <Text style={styles.busOperator}>{bus.operator}</Text>
                <Text style={styles.busSub}>{bus.seats} seats · ₹{bus.price}</Text>
              </View>
              <View style={styles.alignRight}>
                <Text style={styles.busTime}>{bus.time}</Text>
                <Text style={styles.bookNowText}>Book Now →</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Options grid */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>What do you need?</Text>
          <View style={styles.grid2}>
            {[
              { Icon: RefreshCw, label: 'Find Next Bus', action: () => onNavigate('search-results'), color: '#D13239', bg: '#FFF0F0' },
              { Icon: Phone, label: 'Call Operator', action: () => {}, color: '#2563EB', bg: '#EFF6FF' },
              { Icon: Navigation, label: 'Live Tracking', action: () => onNavigate('live-tracking'), color: '#059669', bg: '#F0FFF4' },
              { Icon: HelpCircle, label: 'Get Refund', action: () => onNavigate('cancel-ticket'), color: '#D97706', bg: '#FFFBEB' },
            ].map(({ Icon, label, action, color, bg }) => (
              <TouchableOpacity
                key={label}
                onPress={action}
                style={[styles.optionBtn, { backgroundColor: bg }]}
                activeOpacity={0.8}
              >
                <View style={styles.optionIconBox}>
                  <Icon size={18} color={color} />
                </View>
                <Text style={styles.optionLabel}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  cardCenter: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    elevation: 2,
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alignCenter: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
  },
  heroSub: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  departedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },
  busRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  busRowText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  departedBadge: {
    fontSize: 12,
    fontWeight: '900',
    color: '#DC2626',
  },
  grid2: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  gridCell: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderRadius: 16,
  },
  cellLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  cellVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
    marginTop: 2,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  busItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 8,
  },
  busOperator: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  busSub: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  busTime: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
  },
  bookNowText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D13239',
    marginTop: 2,
  },
  optionBtn: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  optionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
});
