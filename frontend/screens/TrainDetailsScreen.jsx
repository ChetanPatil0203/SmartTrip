import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, Train, Clock, MapPin, ShieldCheck, Wifi, Utensils, Zap, ChevronRight } from 'lucide-react-native';

const routeTimeline = [
  { station: 'Mumbai Central (MMCT)', code: 'MMCT', time: '06:30 AM', day: 'Day 1', stop: 'Source', distance: '0 km' },
  { station: 'Borivali (BVI)', code: 'BVI', time: '07:02 AM', day: 'Day 1', stop: '2 mins', distance: '30 km' },
  { station: 'Vapi (VAPI)', code: 'VAPI', time: '08:40 AM', day: 'Day 1', stop: '2 mins', distance: '170 km' },
  { station: 'Surat (ST)', code: 'ST', time: '09:55 AM', day: 'Day 1', stop: '5 mins', distance: '263 km' },
  { station: 'Bharuch Jn (BH)', code: 'BH', time: '10:45 AM', day: 'Day 1', stop: '2 mins', distance: '322 km' },
  { station: 'Vadodara Jn (BRC)', code: 'BRC', time: '11:40 AM', day: 'Day 1', stop: '5 mins', distance: '392 km' },
  { station: 'Anand Jn (ANND)', code: 'ANND', time: '12:15 PM', day: 'Day 1', stop: '2 mins', distance: '427 km' },
  { station: 'Ahmedabad Jn (ADI)', code: 'ADI', time: '01:10 PM', day: 'Day 1', stop: 'Destination', distance: '493 km' },
];

export default function TrainDetailsScreen({ onNavigate, booking, setBooking }) {
  const train = booking.selectedTrain || {
    number: '12009',
    name: 'Shatabdi Express',
    from: 'Mumbai Central',
    to: 'Ahmedabad',
    duration: '6h 40m',
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => onNavigate('train-search-results')} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>{train.number} - {train.name}</Text>
            <Text style={styles.headerSub}>Route Timeline & Train Schedule</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Train Overview Banner */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <View>
              <Text style={styles.trainTitle}>{train.name}</Text>
              <Text style={styles.trainSub}>Superfast Express · Daily Service</Text>
            </View>
            <View style={styles.badgeClass}>
              <Text style={styles.badgeClassText}>{booking.trainClass || 'EC'}</Text>
            </View>
          </View>

          <View style={styles.amenitiesRow}>
            <View style={styles.amenityChip}>
              <Utensils size={12} color="#2563EB" />
              <Text style={styles.amenityText}>Pantry Onboard</Text>
            </View>
            <View style={styles.amenityChip}>
              <Wifi size={12} color="#2563EB" />
              <Text style={styles.amenityText}>High-speed Wi-Fi</Text>
            </View>
            <View style={styles.amenityChip}>
              <Zap size={12} color="#2563EB" />
              <Text style={styles.amenityText}>Charging Port</Text>
            </View>
          </View>
        </View>

        {/* Route Timeline */}
        <View style={styles.timelineSection}>
          <View style={styles.sectionHeader}>
            <MapPin size={16} color="#2563EB" />
            <Text style={styles.sectionTitle}>Route Timeline (8 Intermediate Stations)</Text>
          </View>

          <View style={styles.timelineBox}>
            {routeTimeline.map((item, index) => {
              const isFirst = index === 0;
              const isLast = index === routeTimeline.length - 1;
              return (
                <View key={item.code} style={styles.stationRow}>
                  <Text style={styles.stationTime}>{item.time}</Text>

                  <View style={styles.timelineCol}>
                    <View
                      style={[
                        styles.dot,
                        isFirst ? styles.firstDot : isLast ? styles.lastDot : styles.midDot,
                      ]}
                    />
                    {!isLast && <View style={styles.vertLine} />}
                  </View>

                  <View style={styles.stationDetails}>
                    <Text style={[styles.stationName, (isFirst || isLast) && styles.stationBold]}>
                      {item.station}
                    </Text>
                    <View style={styles.stationMeta}>
                      <Text style={styles.metaText}>{item.distance}</Text>
                      <Text style={styles.metaDot}>•</Text>
                      <Text style={styles.metaText}>{item.stop}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Fare Overview & CTA */}
        <View style={styles.fareCard}>
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Selected Class Fare</Text>
            <Text style={styles.fareValue}>₹{booking.totalAmount || 1450}</Text>
          </View>
          <Text style={styles.taxNotice}>Inclusive of IRCTC Convenience Fee & GST</Text>
        </View>
      </ScrollView>

      {/* Bottom Sticky CTA */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Total Payable</Text>
          <Text style={styles.bottomPrice}>₹{booking.totalAmount || 1450}</Text>
        </View>
        <TouchableOpacity
          onPress={() => onNavigate('train-seat-selection')}
          style={styles.continueBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.continueText}>Select Berth / Seats</Text>
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
    backgroundColor: '#1E3A5F',
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
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
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
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 90,
  },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  trainTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  trainSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  badgeClass: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeClassText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
  },
  amenitiesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  amenityText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  timelineSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
  },
  timelineBox: {
    paddingLeft: 4,
  },
  stationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stationTime: {
    width: 65,
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    marginTop: 2,
  },
  timelineCol: {
    alignItems: 'center',
    width: 24,
    marginRight: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 3,
  },
  firstDot: {
    backgroundColor: '#2563EB',
  },
  lastDot: {
    backgroundColor: '#10B981',
  },
  midDot: {
    backgroundColor: '#CBD5E1',
  },
  vertLine: {
    width: 2,
    height: 32,
    backgroundColor: '#E2E8F0',
    marginTop: 2,
  },
  stationDetails: {
    flex: 1,
  },
  stationName: {
    fontSize: 13,
    color: '#334155',
  },
  stationBold: {
    fontWeight: '800',
    color: '#0F172A',
  },
  stationMeta: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
  },
  metaText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  metaDot: {
    fontSize: 10,
    color: '#94A3B8',
  },
  fareCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fareLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E3A5F',
  },
  fareValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2563EB',
  },
  taxNotice: {
    fontSize: 11,
    color: '#60A5FA',
    marginTop: 4,
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
    backgroundColor: '#2563EB',
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
