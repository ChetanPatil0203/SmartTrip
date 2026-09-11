import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, Clock, AlertTriangle, RefreshCw, Navigation, Phone, CalendarClock } from 'lucide-react-native';

export default function DelayAlertScreen({ onNavigate, booking }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('live-tracking')} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Delay Alert</Text>
          <Text style={styles.headerSub}>PNR: {booking.pnr || 'SB12345678'}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.bannerCard}>
          <View style={styles.topYellowBar} />
          <View style={styles.bannerBody}>
            <View style={styles.circleOuter}>
              <AlertTriangle size={36} color="#D97706" />
            </View>
            <View style={styles.alignCenter}>
              <Text style={styles.bannerTitle}>Bus Delay Alert</Text>
              <Text style={styles.bannerSub}>Your bus is running behind schedule</Text>
            </View>
          </View>
        </View>

        {/* Delay info grid */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Delay Information</Text>
          <View style={styles.gridRow}>
            {[
              { label: 'Scheduled', value: booking.selectedBus?.departure || '08:00 PM', color: '#2563EB', bg: '#EFF6FF', Icon: Clock },
              { label: 'Expected', value: '08:25 PM', color: '#D97706', bg: '#FFFBEB', Icon: CalendarClock },
              { label: 'Delay', value: '~25 min', color: '#D13239', bg: '#FFF5F5', Icon: AlertTriangle },
            ].map(({ label, value, color, bg, Icon }) => (
              <View key={label} style={[styles.gridColCard, { backgroundColor: bg }]}>
                <Icon size={18} color={color} />
                <View style={styles.alignCenter}>
                  <Text style={styles.gridLabel}>{label}</Text>
                  <Text style={[styles.gridVal, { color }]}>{value}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.infoAlertBox}>
            <Text style={styles.infoAlertText}>
              ⚠️ Heavy traffic near Lonavala has caused this delay. The operator is working to minimise further delay. We apologise for the inconvenience.
            </Text>
          </View>
        </View>

        {/* Smart prediction */}
        <View style={styles.card}>
          <View style={styles.predictionHeader}>
            <View style={styles.iconBox}>
              <CalendarClock size={16} color="#2563EB" />
            </View>
            <View>
              <Text style={styles.cardTitle}>Smart Delay Prediction</Text>
              <Text style={styles.predictionSub}>Based on current traffic & route data</Text>
            </View>
          </View>

          <View style={styles.predictionList}>
            {[
              { stop: 'Lonavala', current: true, eta: 'Now', delay: '+20 min' },
              { stop: 'Khopoli', current: false, eta: '09:40 PM', delay: '+22 min' },
              { stop: 'Pune (Swargate)', current: false, eta: '11:25 PM', delay: '+25 min' },
            ].map((s, i) => (
              <View
                key={i}
                style={[
                  styles.stopPredictionRow,
                  { backgroundColor: s.current ? '#FFFBEB' : '#F9FAFB' },
                ]}
              >
                <View style={styles.stopLeftRow}>
                  <View style={[styles.dot, { backgroundColor: s.current ? '#D97706' : '#9CA3AF' }]} />
                  <Text style={styles.stopNameText}>{s.stop}</Text>
                  {s.current && (
                    <View style={styles.currentBadge}>
                      <Text style={styles.currentBadgeText}>CURRENT</Text>
                    </View>
                  )}
                </View>
                <View style={styles.alignRight}>
                  <Text style={styles.etaText}>{s.eta}</Text>
                  <Text style={styles.delayDiffText}>{s.delay}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            onPress={() => onNavigate('live-tracking')}
            style={styles.primaryBtn}
            activeOpacity={0.8}
          >
            <Navigation size={16} color="#FFFFFF" />
            <Text style={styles.primaryBtnText}>Track Bus</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.7}>
            <Phone size={16} color="#374151" />
            <Text style={styles.secondaryBtnText}>Contact</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onNavigate('alternative-bus')}
            style={styles.fullWidthSecondaryBtn}
            activeOpacity={0.7}
          >
            <RefreshCw size={16} color="#374151" />
            <Text style={styles.secondaryBtnText}>Find Alternative Bus</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#D97706',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    paddingBottom: 40,
  },
  bannerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 2,
  },
  topYellowBar: {
    height: 6,
    backgroundColor: '#F59E0B',
  },
  bannerBody: {
    padding: 20,
    alignItems: 'center',
    gap: 16,
  },
  circleOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFBEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alignCenter: {
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
  },
  bannerSub: {
    fontSize: 14,
    color: '#6B7280',
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
  gridRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  gridColCard: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  gridLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  gridVal: {
    fontSize: 14,
    fontWeight: '900',
    marginTop: 2,
  },
  infoAlertBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 12,
  },
  infoAlertText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
    lineHeight: 18,
  },
  predictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  predictionSub: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  predictionList: {
    gap: 8,
  },
  stopPredictionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 16,
  },
  stopLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stopNameText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  currentBadge: {
    backgroundColor: '#FDE68A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  currentBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#92400E',
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  etaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  delayDiffText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  primaryBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#D13239',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  fullWidthSecondaryBtn: {
    width: '100%',
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
