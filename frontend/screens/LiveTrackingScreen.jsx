import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, Share2, MapPin, Clock, AlertTriangle, Phone, X } from 'lucide-react-native';
import bookingService from '../services/bookingService';
import busService from '../services/busService';

const defaultStops = [
  { name: 'Dadar West', time: '08:00 PM', done: true },
  { name: 'Kalyan', time: '09:05 PM', done: true },
  { name: 'Lonavala', time: '10:00 PM', done: false, current: true },
  { name: 'Pune (Swargate)', time: '11:00 PM', done: false },
];

export default function LiveTrackingScreen({ onNavigate, booking }) {
  const [progress, setProgress] = useState(60);
  const [delayInfo, setDelayInfo] = useState({ title: 'On Time', sub: 'Bus is running on scheduled time', isDelayed: false });
  const [eta, setEta] = useState(booking.selectedBus?.arrival || '11:00 PM');
  const [stops, setStops] = useState(defaultStops);

  useEffect(() => {
    const t = setInterval(() => {
      setProgress(p => (p >= 80 ? 60 : p + 0.5));
    }, 200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const bId = booking.backendBookingId || booking.id;
    if (bId) {
      bookingService.getBookingTracking(bId)
        .then(res => {
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
        .then(res => {
          const trk = res?.data?.tracking;
          if (trk?.eta) setEta(trk.eta);
        })
        .catch(() => {});
    }
  }, [booking]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => onNavigate('my-trips')} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Live Tracking</Text>
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
                <Text style={styles.busBadgeText}>BUS ON WAY</Text>
              </View>
            </View>
          </View>
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
            <Text style={styles.cardTitle}>Route Progress</Text>
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
                    {stop.name} {stop.current ? '• Current' : ''}
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
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  mapCard: {
    height: 200,
    borderRadius: 24,
    backgroundColor: '#A7F3D0',
    overflow: 'hidden',
    elevation: 3,
  },
  mapCanvas: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  roadTrack: {
    width: '80%',
    height: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    overflow: 'hidden',
  },
  roadFill: {
    height: '100%',
    backgroundColor: '#D13239',
  },
  busMarkerCol: {
    position: 'absolute',
    alignItems: 'center',
  },
  busBadge: {
    backgroundColor: '#D13239',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  busBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  delayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FEF3C7',
    borderRadius: 20,
    padding: 14,
  },
  delayIconBox: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  delayTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
  },
  delaySub: {
    fontSize: 12,
    color: '#B45309',
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
  routeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  etaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  timelineList: {
    gap: 0,
  },
  stopRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stopTimelineCol: {
    alignItems: 'center',
  },
  stopIconBox: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: {
    width: 2,
    height: 32,
    marginVertical: 2,
  },
  stopTextCol: {
    paddingTop: 4,
  },
  stopName: {
    fontSize: 14,
    fontWeight: '700',
  },
  stopTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelOutlineBtn: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: '#D13239',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D13239',
  },
  callBtn: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  callBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
});
