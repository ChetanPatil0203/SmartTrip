import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  ActivityIndicator, RefreshControl, Alert
} from 'react-native';
import BottomNav from '../components/BottomNav';
import EmptyState from '../components/EmptyState';
import {
  ArrowLeft, Clock, CheckCircle, XCircle, MapPin,
  Armchair, Navigation, Ticket, ChevronRight,
  Bus, Train, Plane, Building2,
} from 'lucide-react-native';
import bookingService from '../services/bookingService';

const CATEGORY_ICON = {
  BUS: Bus, TRAIN: Train, FLIGHT: Plane, HOTEL: Building2,
};

const STATUS_CONFIG = {
  CONFIRMED: { color: '#059669', bg: '#ECFDF5', Icon: CheckCircle },
  PENDING: { color: '#D97706', bg: '#FEF3C7', Icon: Clock },
  CANCELLED: { color: '#EF4444', bg: '#FFF0F0', Icon: XCircle },
  COMPLETED: { color: '#6366F1', bg: '#EEF2FF', Icon: CheckCircle },
  FAILED: { color: '#EF4444', bg: '#FFF0F0', Icon: XCircle },
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getBookingInfo(booking) {
  switch (booking.bookingType) {
    case 'BUS': {
      const sched = booking.busBooking?.schedule;
      return {
        operator: sched?.bus?.operator?.name || 'Bus',
        from: sched?.route?.source || '—',
        to: sched?.route?.destination || '—',
        time: sched?.departureTime || '',
        seats: booking.passengers?.map(p => p.seatNumber).filter(Boolean).join(', ') || '—',
        ticketScreen: 'ticket',
        trackScreen: 'live-tracking',
      };
    }
    case 'TRAIN': {
      const sched = booking.trainBooking?.schedule;
      return {
        operator: `${sched?.train?.trainNumber || ''} ${sched?.train?.trainName || 'Train'}`.trim(),
        from: sched?.route?.source || '—',
        to: sched?.route?.destination || '—',
        time: sched?.departureTime || '',
        seats: booking.trainBooking?.classCode || '—',
        ticketScreen: 'train-ticket',
        trackScreen: 'train-live-status',
      };
    }
    case 'FLIGHT': {
      const sched = booking.flightBooking?.schedule;
      return {
        operator: `${sched?.flight?.airline?.name || 'Flight'} (${sched?.flight?.flightNumber || ''})`,
        from: sched?.sourceAirport?.city || '—',
        to: sched?.destinationAirport?.city || '—',
        time: sched?.departureTime || '',
        seats: '—',
        ticketScreen: 'flight-ticket',
        trackScreen: null,
      };
    }
    case 'HOTEL': {
      const hb = booking.hotelBooking;
      return {
        operator: hb?.hotel?.name || 'Hotel',
        from: hb?.hotel?.city || '—',
        to: `${hb?.numberOfRooms || 1} Room(s)`,
        time: '',
        seats: hb?.room?.roomType || '—',
        ticketScreen: 'hotel-ticket',
        trackScreen: null,
      };
    }
    default:
      return { operator: '—', from: '—', to: '—', time: '', seats: '—', ticketScreen: null, trackScreen: null };
  }
}

export default function MyTripsScreen({ onNavigate, booking, setBooking }) {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      const res = await bookingService.getMyBookings({ limit: 50 });
      setBookings(res?.data?.bookings || []);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const now = new Date();
  const upcomingStatuses = ['CONFIRMED', 'PENDING'];
  const upcoming = bookings.filter(b => upcomingStatuses.includes(b.status) && new Date(b.travelDate) >= now);
  const past = bookings.filter(b => b.status === 'COMPLETED' || b.status === 'CANCELLED' || new Date(b.travelDate) < now);

  const displayed = activeTab === 'upcoming' ? upcoming : past;

  const handleCancelTrip = (bookingId) => {
    Alert.alert('Cancel Booking', 'Do you want to request cancellation for this booking?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          try {
            await bookingService.requestCancellation({ bookingId, reason: 'User requested cancellation' });
            Alert.alert('Success', 'Cancellation request submitted');
            fetchBookings(true);
          } catch (err) {
            Alert.alert('Error', err.message || 'Could not cancel booking');
          }
        },
      },
    ]);
  };

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', count: upcoming.length },
    { id: 'past', label: 'Past Trips', count: past.length },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => onNavigate('home')} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>My Trips</Text>
            <Text style={styles.headerSub}>{bookings.length} booking(s) found</Text>
          </View>
        </View>
        {/* Tabs */}
        <View style={styles.tabRow}>
          {tabs.map(t => (
            <TouchableOpacity
              key={t.id}
              style={[styles.tab, activeTab === t.id && styles.tabActive]}
              onPress={() => setActiveTab(t.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === t.id && styles.tabTextActive]}>
                {t.label} {t.count > 0 && `(${t.count})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}><ActivityIndicator size="large" color="#D13239" /></View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchBookings(true)} tintColor="#D13239" />}
        >
          {displayed.length === 0 ? (
            <EmptyState
              title={activeTab === 'upcoming' ? 'No upcoming trips' : 'No past trips'}
              subtitle={activeTab === 'upcoming' ? 'Start booking your next journey!' : 'Your completed and cancelled trips will appear here'}
            />
          ) : (
            displayed.map((b) => {
              const info = getBookingInfo(b);
              const CatIcon = CATEGORY_ICON[b.bookingType] || Bus;
              const statusCfg = STATUS_CONFIG[b.status] || STATUS_CONFIG.PENDING;
              const { Icon: StatusIcon } = statusCfg;

              return (
                <View key={b.id} style={styles.card}>
                  {/* Card Top */}
                  <View style={styles.cardTop}>
                    <View style={styles.catBadge}>
                      <CatIcon size={12} color="#D13239" />
                      <Text style={styles.catText}>{b.bookingType}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
                      <StatusIcon size={11} color={statusCfg.color} />
                      <Text style={[styles.statusText, { color: statusCfg.color }]}>{b.status}</Text>
                    </View>
                  </View>

                  {/* Operator */}
                  <Text style={styles.operatorText} numberOfLines={1}>{info.operator}</Text>

                  {/* Route */}
                  <View style={styles.routeRow}>
                    <Text style={styles.city}>{info.from}</Text>
                    <View style={styles.routeArrow}><MapPin size={14} color="#D13239" /></View>
                    <Text style={styles.city}>{info.to}</Text>
                  </View>

                  {/* Details */}
                  <View style={styles.detailsRow}>
                    <Text style={styles.detailText}>{formatDate(b.travelDate)}{info.time ? ` • ${info.time}` : ''}</Text>
                    <Text style={styles.detailText}>₹{b.totalAmount?.toLocaleString('en-IN')}</Text>
                  </View>

                  <View style={styles.pnrRow}>
                    <Ticket size={12} color="#9CA3AF" />
                    <Text style={styles.pnrText}>Ref: {b.bookingReference}</Text>
                  </View>

                  {/* Actions */}
                  <View style={styles.actionsRow}>
                    {info.ticketScreen && (
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => {
                          setBooking({ ...b });
                          onNavigate(info.ticketScreen);
                        }}
                      >
                        <Ticket size={14} color="#D13239" />
                        <Text style={styles.actionText}>View Ticket</Text>
                      </TouchableOpacity>
                    )}
                    {info.trackScreen && b.status === 'CONFIRMED' && (
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => onNavigate(info.trackScreen)}
                      >
                        <Navigation size={14} color="#2563EB" />
                        <Text style={[styles.actionText, { color: '#2563EB' }]}>Track</Text>
                      </TouchableOpacity>
                    )}
                    {b.status === 'CONFIRMED' && (
                      <TouchableOpacity
                        style={[styles.actionBtn, styles.cancelBtn]}
                        onPress={() => handleCancelTrip(b.id)}
                      >
                        <XCircle size={14} color="#EF4444" />
                        <Text style={[styles.actionText, { color: '#EF4444' }]}>Cancel</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      <BottomNav active="trips" onNavigate={onNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#D13239', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 0 },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 16 },
  backBtn: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  tabRow: { flexDirection: 'row' },
  tab: {
    flex: 1, paddingVertical: 12, alignItems: 'center',
    borderBottomWidth: 3, borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: '#FFFFFF' },
  tabText: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.6)' },
  tabTextActive: { color: '#FFFFFF', fontWeight: '800' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16, gap: 14, paddingBottom: 90 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16,
    borderWidth: 1, borderColor: '#E5E7EB',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    gap: 8,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#FFF0F0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  catText: { fontSize: 10, fontWeight: '700', color: '#D13239' },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  statusText: { fontSize: 10, fontWeight: '700' },
  operatorText: { fontSize: 14, fontWeight: '800', color: '#111827' },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  city: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  routeArrow: { flex: 1, alignItems: 'center' },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailText: { fontSize: 12, color: '#6B7280' },
  pnrRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pnrText: { fontSize: 11, color: '#9CA3AF' },
  actionsRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: 8, paddingHorizontal: 12,
    backgroundColor: '#FFF0F0', borderRadius: 10,
  },
  cancelBtn: { backgroundColor: '#FFF5F5' },
  actionText: { fontSize: 12, fontWeight: '600', color: '#D13239' },
});
