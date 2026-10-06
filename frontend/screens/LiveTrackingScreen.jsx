import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, Vibration } from 'react-native';
import {
  ArrowLeft,
  Share2,
  MapPin,
  Clock,
  AlertTriangle,
  Phone,
  X,
  BellRing,
  Volume2,
  CheckCircle2,
} from 'lucide-react-native';
import bookingService from '../services/bookingService';
import busService from '../services/busService';

const defaultStops = [
  { name: 'Dadar West', time: '08:00 PM', done: true },
  { name: 'Kalyan', time: '09:05 PM', done: true },
  { name: 'Lonavala', time: '10:00 PM', done: false, current: true },
  { name: 'Pune (Swargate)', time: '11:00 PM', done: false, isDestination: true },
];

export default function LiveTrackingScreen({ onNavigate, booking }) {
  const [progress, setProgress] = useState(60);
  const [delayInfo, setDelayInfo] = useState({ title: 'On Time', sub: 'Bus is running on scheduled time', isDelayed: false });
  const [eta, setEta] = useState(booking.selectedBus?.arrival || '11:00 PM');
  const stops = defaultStops;

  // Advanced Feature 3: Destination Proximity Wake-Up Alarm
  const [alarmEnabled, setAlarmEnabled] = useState(true);
  const [alarmMinutes, setAlarmMinutes] = useState(15);
  const [alarmRingingModal, setAlarmRingingModal] = useState(false);

  const destinationStop = stops.find((s) => s.isDestination) || stops[stops.length - 1];

  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => (p >= 80 ? 60 : p + 0.5));
    }, 200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const bId = booking.backendBookingId || booking.id;
    if (bId) {
      bookingService.getBookingTracking(bId)
        .then((res) => {
          const trk = res?.data?.tracking;
          if (trk?.eta) setEta(trk.eta);
          if (trk?.status) {
            setDelayInfo({
              title: trk.status === 'DELAYED' ? 'Bus Delayed' : 'On Time',
              sub: trk.delayMinutes ? `Delayed by ${trk.delayMinutes} mins` : 'Running on schedule',
              isDelayed: trk.status === 'DELAYED',
            });
          }
        })
        .catch(() => {});
    } else if (booking.selectedBus?.id) {
      busService.getLiveTracking(booking.selectedBus.id)
        .then((res) => {
          const trk = res?.data?.tracking;
          if (trk?.eta) setEta(trk.eta);
        })
        .catch(() => {});
    }
  }, [booking]);

  const triggerTestAlarm = () => {
    try {
      Vibration.vibrate([500, 500, 500]);
    } catch {
      // web fallback
    }
    setAlarmRingingModal(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => onNavigate('my-trips')} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Live Trip Radar</Text>
            <Text style={styles.headerSub}>PNR: {booking.pnr || booking.bookingReference || 'SB12345678'}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => onNavigate('trip-sharing')} style={styles.backBtn} activeOpacity={0.7}>
          <Share2 size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Visual Route Canvas */}
        <View style={styles.mapCard}>
          <View style={styles.mapCanvas}>
            <View style={styles.roadTrack}>
              <View style={[styles.roadFill, { width: `${progress}%` }]} />
            </View>
            <View style={styles.busMarkerCol}>
              <Text style={{ fontSize: 32 }}>🚌</Text>
              <View style={styles.busBadge}>
                <Text style={styles.busBadgeText}>BUS EN ROUTE (68 KM/H)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Feature 3: Destination Proximity Wake-Up Alarm Card */}
        <View style={styles.alarmCard}>
          <View style={styles.alarmHeaderRow}>
            <View style={styles.alarmIconCircle}>
              <BellRing size={20} color="#D13239" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.alarmTitle}>Destination Proximity Alarm</Text>
                <TouchableOpacity
                  onPress={() => setAlarmEnabled(!alarmEnabled)}
                  style={[styles.toggleBtn, alarmEnabled ? styles.toggleOn : styles.toggleOff]}
                  activeOpacity={0.8}
                >
                  <View style={[styles.toggleThumb, alarmEnabled && styles.toggleThumbOn]} />
                </TouchableOpacity>
              </View>
              <Text style={styles.alarmSub}>
                Wake up before arrival so you never miss your stop while sleeping.
              </Text>
            </View>
          </View>

          {alarmEnabled && (
            <View style={styles.alarmConfigBox}>
              <View style={styles.alarmIntervalRow}>
                <Text style={styles.alarmIntervalLabel}>RING ALARM BEFORE:</Text>
                <View style={styles.alarmChipsRow}>
                  {[10, 15, 30].map((mins) => (
                    <TouchableOpacity
                      key={mins}
                      onPress={() => setAlarmMinutes(mins)}
                      style={[styles.alarmChip, alarmMinutes === mins && styles.alarmChipActive]}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.alarmChipText, alarmMinutes === mins && styles.alarmChipTextActive]}>
                        {mins} Mins
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Active Alarm Badge */}
              <View style={styles.alarmStatusBanner}>
                <CheckCircle2 size={15} color="#059669" />
                <Text style={styles.alarmStatusText}>
                  Armed: Will wake you {alarmMinutes} mins before {destinationStop.name}
                </Text>
              </View>

              {/* Test Sound button */}
              <TouchableOpacity
                onPress={triggerTestAlarm}
                style={styles.testAlarmBtn}
                activeOpacity={0.8}
              >
                <Volume2 size={14} color="#D13239" />
                <Text style={styles.testAlarmBtnText}>Test Alarm Ringtone & Vibration</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Delay Alert */}
        <View style={[styles.delayCard, !delayInfo.isDelayed && { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
          <View style={[styles.delayIconBox, !delayInfo.isDelayed && { backgroundColor: '#D1FAE5' }]}>
            <AlertTriangle size={16} color={delayInfo.isDelayed ? '#D97706' : '#059669'} />
          </View>
          <View>
            <Text style={[styles.delayTitle, !delayInfo.isDelayed && { color: '#065F46' }]}>{delayInfo.title}</Text>
            <Text style={[styles.delaySub, !delayInfo.isDelayed && { color: '#047857' }]}>{delayInfo.sub}</Text>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.card}>
          <View style={styles.routeHeaderRow}>
            <Text style={styles.cardTitle}>Live Route Milestones</Text>
            <View style={styles.etaBadge}>
              <Clock size={13} color="#9CA3AF" />
              <Text style={styles.etaText}>ETA: {eta}</Text>
            </View>
          </View>

          <View style={styles.timelineList}>
            {stops.map((stop, i) => (
              <View key={i} style={styles.stopRow}>
                <View style={styles.stopTimelineCol}>
                  <View
                    style={[
                      styles.stopIconBox,
                      {
                        backgroundColor: stop.done ? '#D13239' : stop.current ? '#F59E0B' : '#F3F4F6',
                      },
                    ]}
                  >
                    {stop.done ? (
                      <MapPin size={14} color="#FFFFFF" />
                    ) : stop.current ? (
                      <Text style={{ fontSize: 12 }}>🚌</Text>
                    ) : (
                      <MapPin size={14} color="#9CA3AF" />
                    )}
                  </View>
                  {i < stops.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        { backgroundColor: stop.done ? '#D13239' : '#E5E7EB' },
                      ]}
                    />
                  )}
                </View>
                <View style={styles.stopTextCol}>
                  <Text
                    style={[
                      styles.stopName,
                      { color: stop.current ? '#D97706' : stop.done ? '#1F2937' : '#9CA3AF' },
                    ]}
                  >
                    {stop.name} {stop.current ? '• Current' : ''} {stop.isDestination ? '🚩 Destination' : ''}
                  </Text>
                  <Text style={styles.stopTime}>{stop.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={() => onNavigate('cancel-ticket')}
            style={styles.cancelOutlineBtn}
            activeOpacity={0.7}
          >
            <X size={16} color="#D13239" />
            <Text style={styles.cancelBtnText}>Cancel Ticket</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.callBtn} activeOpacity={0.7}>
            <Phone size={16} color="#374151" />
            <Text style={styles.callBtnText}>Call Driver</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Alarm Ringing Overlay Modal */}
      <Modal
        visible={alarmRingingModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAlarmRingingModal(false)}
      >
        <View style={styles.alarmModalOverlay}>
          <View style={styles.alarmModalBox}>
            <View style={styles.alarmModalIcon}>
              <BellRing size={36} color="#FFFFFF" />
            </View>
            <Text style={styles.alarmModalTitle}>WAKE UP! ⏰</Text>
            <Text style={styles.alarmModalDestination}>
              Approaching {destinationStop.name}
            </Text>
            <Text style={styles.alarmModalSub}>
              Your stop is approximately {alarmMinutes} minutes away. Please prepare your luggage and check your seat.
            </Text>

            <View style={styles.alarmModalBtnCol}>
              <TouchableOpacity
                onPress={() => setAlarmRingingModal(false)}
                style={styles.dismissAlarmBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.dismissAlarmText}>I'm Awake / Dismiss Alarm</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setAlarmRingingModal(false);
                  setTimeout(() => setAlarmRingingModal(true), 5000);
                }}
                style={styles.snoozeBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.snoozeBtnText}>Snooze (5 Minutes)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#D13239',
  },
  headerLeft: {
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
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 32,
  },
  mapCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  mapCanvas: {
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  roadTrack: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  roadFill: {
    height: '100%',
    backgroundColor: '#D13239',
    borderRadius: 4,
  },
  busMarkerCol: {
    alignItems: 'center',
  },
  busBadge: {
    backgroundColor: '#D13239',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  busBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  /* Alarm Card Styling */
  alarmCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FFFBFB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  alarmHeaderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  alarmIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alarmTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  alarmSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 15,
  },
  toggleBtn: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  toggleOn: {
    backgroundColor: '#D13239',
  },
  toggleOff: {
    backgroundColor: '#E2E8F0',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },
  alarmConfigBox: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#FEE2E2',
    gap: 10,
  },
  alarmIntervalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alarmIntervalLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  alarmChipsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  alarmChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  alarmChipActive: {
    backgroundColor: '#D13239',
    borderColor: '#D13239',
  },
  alarmChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  alarmChipTextActive: {
    color: '#FFFFFF',
  },
  alarmStatusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  alarmStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
  testAlarmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 7,
    backgroundColor: '#FFF0F0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  testAlarmBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D13239',
  },
  delayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  delayIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  delayTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  delaySub: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  routeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  etaText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  timelineList: {
    gap: 12,
  },
  stopRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stopTimelineCol: {
    alignItems: 'center',
    width: 28,
  },
  stopIconBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 20,
    marginVertical: 4,
  },
  stopTextCol: {
    flex: 1,
    paddingTop: 2,
  },
  stopName: {
    fontSize: 13,
    fontWeight: '700',
  },
  stopTime: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelOutlineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FFF0F0',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D13239',
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  callBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  /* Ringing Modal */
  alarmModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  alarmModalBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    textAlign: 'center',
  },
  alarmModalIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#D13239',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  alarmModalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#D13239',
    letterSpacing: -0.5,
  },
  alarmModalDestination: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 6,
  },
  alarmModalSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginVertical: 14,
    lineHeight: 18,
  },
  alarmModalBtnCol: {
    width: '100%',
    gap: 10,
    marginTop: 8,
  },
  dismissAlarmBtn: {
    width: '100%',
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  dismissAlarmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  snoozeBtn: {
    width: '100%',
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  snoozeBtnText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
  },
});
