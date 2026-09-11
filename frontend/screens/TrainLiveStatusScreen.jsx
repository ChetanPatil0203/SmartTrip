import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, Train, Clock, MapPin, RefreshCw, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react-native';

const liveProgress = [
  { station: 'Mumbai Central (MMCT)', time: '06:30 AM', status: 'Passed', delay: 'On Time' },
  { station: 'Borivali (BVI)', time: '07:02 AM', status: 'Passed', delay: 'On Time' },
  { station: 'Vapi (VAPI)', time: '08:40 AM', status: 'Passed', delay: 'On Time' },
  { station: 'Surat (ST)', time: '09:55 AM', status: 'CURRENT LOCATION', delay: 'On Time', current: true },
  { station: 'Bharuch Jn (BH)', time: '10:45 AM', status: 'Next Station', delay: 'Exp. 10:45 AM' },
  { station: 'Vadodara Jn (BRC)', time: '11:40 AM', status: 'Upcoming', delay: 'Exp. 11:40 AM' },
  { station: 'Ahmedabad Jn (ADI)', time: '01:10 PM', status: 'Destination', delay: 'Exp. 01:10 PM' },
];

export default function TrainLiveStatusScreen({ onNavigate, booking }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => onNavigate('home')} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Where is My Train?</Text>
            <Text style={styles.headerSub}>12009 Shatabdi Express · Live Status</Text>
          </View>
          <TouchableOpacity style={styles.refreshBtn}>
            <RefreshCw size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Live Banner */}
        <View style={styles.liveBanner}>
          <View style={styles.liveTopRow}>
            <View style={styles.livePulseDot} />
            <Text style={styles.liveStatusText}>LIVE TRACKING ACTIVE</Text>
          </View>
          <Text style={styles.locationTitle}>Train is currently near Surat</Text>
          <View style={styles.etaRow}>
            <Clock size={16} color="#FFD700" />
            <Text style={styles.etaText}>Expected arrival at Surat: <Text style={{ color: '#FFD700', fontWeight: '900' }}>09:55 AM</Text></Text>
          </View>
          <View style={styles.onTimeBadge}>
            <CheckCircle2 size={12} color="#10B981" />
            <Text style={styles.onTimeText}>Running ON TIME (0 mins delay)</Text>
          </View>
        </View>

        {/* Route Progress Timeline */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>ROUTE PROGRESS</Text>
          <View style={styles.timelineList}>
            {liveProgress.map((st, i) => {
              const isPassed = st.status === 'Passed';
              const isCurrent = st.current;
              return (
                <View key={st.station} style={styles.stRow}>
                  <Text style={styles.stTime}>{st.time}</Text>
                  <View style={styles.trackCol}>
                    <View
                      style={[
                        styles.trackDot,
                        isPassed && styles.dotPassed,
                        isCurrent && styles.dotCurrent,
                      ]}
                    >
                      {isCurrent && <Train size={12} color="#FFFFFF" />}
                    </View>
                    {i < liveProgress.length - 1 && (
                      <View style={[styles.trackLine, isPassed && styles.linePassed]} />
                    )}
                  </View>
                  <View style={styles.stInfo}>
                    <Text style={[styles.stName, isCurrent && styles.stNameCurrent]}>{st.station}</Text>
                    <Text style={[styles.stStatus, isCurrent && { color: '#2563EB', fontWeight: '800' }]}>
                      {st.status} · {st.delay}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          onPress={() => onNavigate('my-trips')}
          style={styles.tripsBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.tripsBtnText}>Back to My Trips</Text>
          <ChevronRight size={16} color="#FFFFFF" />
        </TouchableOpacity>
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
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  liveBanner: {
    backgroundColor: '#1E3A5F',
    borderRadius: 20,
    padding: 18,
    gap: 8,
  },
  liveTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  livePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  liveStatusText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 0.5,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  etaText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
  },
  onTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  onTimeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10B981',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  timelineList: {
    paddingLeft: 4,
  },
  stRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  stTime: {
    width: 65,
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    marginTop: 2,
  },
  trackCol: {
    alignItems: 'center',
    width: 24,
    marginRight: 10,
  },
  trackDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotPassed: {
    backgroundColor: '#10B981',
  },
  dotCurrent: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563EB',
  },
  trackLine: {
    width: 2,
    height: 28,
    backgroundColor: '#E2E8F0',
    marginTop: 2,
  },
  linePassed: {
    backgroundColor: '#10B981',
  },
  stInfo: {
    flex: 1,
  },
  stName: {
    fontSize: 13,
    color: '#334155',
  },
  stNameCurrent: {
    fontSize: 14,
    fontWeight: '900',
    color: '#2563EB',
  },
  stStatus: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  tripsBtn: {
    backgroundColor: '#1E3A5F',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tripsBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
