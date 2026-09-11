import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, Plane, Luggage, Utensils, ShieldAlert, ChevronRight, Info, CheckCircle2 } from 'lucide-react-native';

export default function FlightDetailsScreen({ onNavigate, booking }) {
  const flight = booking.selectedFlight || {
    airline: 'SmartAir',
    flightNo: 'ST-402',
    from: 'Mumbai (BOM)',
    to: 'Delhi (DEL)',
    depTime: '09:30 AM',
    arrTime: '11:45 AM',
    duration: '2h 15m',
    price: 5490,
    baggage: '7kg Cabin + 15kg Check-in',
    aircraft: 'Boeing 737-800',
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => onNavigate('flight-search-results')} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Flight Details & Fare Breakdown</Text>
            <Text style={styles.headerSub}>{flight.airline} · {flight.flightNo}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Flight Overview Card */}
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <View>
              <Text style={styles.airlineName}>{flight.airline}</Text>
              <Text style={styles.aircraftMeta}>Aircraft: {flight.aircraft}</Text>
            </View>
            <View style={styles.nonStopBadge}>
              <Text style={styles.nonStopText}>Non-Stop</Text>
            </View>
          </View>

          <View style={styles.routeBox}>
            <View>
              <Text style={styles.timeText}>{flight.depTime}</Text>
              <Text style={styles.cityText}>{flight.from}</Text>
              <Text style={styles.terminalText}>Terminal 2 (T2)</Text>
            </View>

            <View style={styles.planeCol}>
              <Text style={styles.durationText}>{flight.duration}</Text>
              <Plane size={16} color="#0284C7" style={{ transform: [{ rotate: '90deg' }] }} />
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.timeText}>{flight.arrTime}</Text>
              <Text style={styles.cityText}>{flight.to}</Text>
              <Text style={styles.terminalText}>Terminal 3 (T3)</Text>
            </View>
          </View>
        </View>

        {/* Baggage & In-flight Perks */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>BAGGAGE & IN-FLIGHT INCLUSIONS</Text>
          <View style={styles.perkRow}>
            <Luggage size={16} color="#0284C7" />
            <View style={{ flex: 1 }}>
              <Text style={styles.perkTitle}>Cabin Baggage</Text>
              <Text style={styles.perkSub}>1 piece up to 7 KG per passenger</Text>
            </View>
          </View>

          <View style={styles.perkRow}>
            <Luggage size={16} color="#0284C7" />
            <View style={{ flex: 1 }}>
              <Text style={styles.perkTitle}>Check-in Baggage</Text>
              <Text style={styles.perkSub}>15 KG (1 piece) included free</Text>
            </View>
          </View>

          <View style={styles.perkRow}>
            <Utensils size={16} color="#0284C7" />
            <View style={{ flex: 1 }}>
              <Text style={styles.perkTitle}>In-flight Meal</Text>
              <Text style={styles.perkSub}>Complimentary hot snacks & beverages</Text>
            </View>
          </View>
        </View>

        {/* Cancellation Policy */}
        <View style={styles.card}>
          <View style={styles.policyHeader}>
            <ShieldAlert size={16} color="#EAB308" />
            <Text style={styles.sectionTitle}>CANCELLATION & REFUND POLICY</Text>
          </View>
          <View style={styles.policyRow}>
            <Text style={styles.policyLabel}>Cancel 24h before departure:</Text>
            <Text style={styles.policyVal}>₹1,500 Fee (Refund ₹3,990)</Text>
          </View>
          <View style={styles.policyRow}>
            <Text style={styles.policyLabel}>Cancel within 24h:</Text>
            <Text style={styles.policyVal}>₹2,500 Fee</Text>
          </View>
        </View>

        {/* Fare Summary */}
        <View style={styles.fareCard}>
          <Text style={styles.sectionTitle}>FARE BREAKDOWN</Text>
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Base Fare (1 Adult)</Text>
            <Text style={styles.fareVal}>₹{flight.price - 650}</Text>
          </View>
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Taxes & Airport User Charges</Text>
            <Text style={styles.fareVal}>₹650</Text>
          </View>
          <View style={[styles.fareRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Fare</Text>
            <Text style={styles.totalVal}>₹{flight.price}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Total Payable</Text>
          <Text style={styles.bottomPrice}>₹{flight.price}</Text>
        </View>
        <TouchableOpacity
          onPress={() => onNavigate('flight-seat-selection')}
          style={styles.continueBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.continueText}>Select Aircraft Seat</Text>
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  airlineName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  aircraftMeta: {
    fontSize: 11,
    color: '#64748B',
  },
  nonStopBadge: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  nonStopText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284C7',
  },
  routeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    marginTop: 4,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  cityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
    marginTop: 2,
  },
  terminalText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  planeCol: {
    alignItems: 'center',
  },
  durationText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  perkTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  perkSub: {
    fontSize: 11,
    color: '#64748B',
  },
  policyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  policyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  policyLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  policyVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  fareCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fareLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  fareVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0284C7',
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
