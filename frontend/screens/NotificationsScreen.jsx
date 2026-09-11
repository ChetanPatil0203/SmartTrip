import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { ArrowLeft, Bell, Bus, Train, Plane, Building2, DollarSign, Info, CheckCircle2 } from 'lucide-react-native';
import { notificationService } from '../services/miscService';

const TYPE_ICON_MAP = {
  BUS_BOOKING: { Icon: Bus, color: '#D13239', bg: '#FFF0F0' },
  TRAIN_BOOKING: { Icon: Train, color: '#2563EB', bg: '#EFF6FF' },
  FLIGHT_BOOKING: { Icon: Plane, color: '#0284C7', bg: '#F0F9FF' },
  HOTEL_BOOKING: { Icon: Building2, color: '#059669', bg: '#ECFDF5' },
  PAYMENT: { Icon: DollarSign, color: '#D97706', bg: '#FEF3C7' },
  REFUND: { Icon: DollarSign, color: '#059669', bg: '#ECFDF5' },
  CANCELLATION: { Icon: CheckCircle2, color: '#EF4444', bg: '#FFF0F0' },
  DELAY: { Icon: Bus, color: '#D97706', bg: '#FEF3C7' },
  GENERAL: { Icon: Bell, color: '#6366F1', bg: '#EEF2FF' },
};

function getIconConfig(type) {
  return TYPE_ICON_MAP[type] || TYPE_ICON_MAP.GENERAL;
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? 'Yesterday' : `${days} days ago`;
}

export default function NotificationsScreen({ onNavigate }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      const res = await notificationService.getNotifications({ limit: 50 });
      setNotifications(res?.data?.notifications || []);
    } catch {
      // If user not logged in or error, show empty
      setNotifications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => onNavigate('home')} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Notifications Center</Text>
            <Text style={styles.headerSub}>Real-time alerts for all your journeys</Text>
          </View>
          {notifications.some(n => !n.isRead) && (
            <TouchableOpacity onPress={handleMarkAllRead} style={styles.markAllBtn}>
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#D13239" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, notifications.length === 0 && styles.emptyContainer]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchNotifications(true)} tintColor="#D13239" />
          }
        >
          {notifications.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Bell size={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No notifications yet</Text>
              <Text style={styles.emptyDesc}>Your booking alerts and updates will appear here</Text>
            </View>
          ) : (
            notifications.map((n) => {
              const { Icon, color, bg } = getIconConfig(n.type);
              return (
                <TouchableOpacity
                  key={n.id}
                  style={[styles.notifCard, !n.isRead && styles.unreadCard]}
                  activeOpacity={0.8}
                  onPress={() => handleMarkRead(n.id)}
                >
                  <View style={[styles.iconBox, { backgroundColor: bg }]}>
                    <Icon size={18} color={color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.topRow}>
                      <Text style={styles.notifTitle} numberOfLines={1}>{n.title}</Text>
                      <Text style={styles.timeText}>{timeAgo(n.createdAt)}</Text>
                    </View>
                    <Text style={styles.notifDesc} numberOfLines={2}>{n.message}</Text>
                    {!n.isRead && <View style={styles.unreadDot} />}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 16, backgroundColor: '#D13239' },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  markAllBtn: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
  markAllText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16, gap: 12 },
  emptyContainer: { flex: 1 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 80 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#374151' },
  emptyDesc: { fontSize: 13, color: '#9CA3AF', textAlign: 'center' },
  notifCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  unreadCard: { borderColor: '#FCA5A5', backgroundColor: '#FFFBFB' },
  iconBox: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  notifTitle: { fontSize: 13, fontWeight: '800', color: '#0F172A', flex: 1 },
  timeText: { fontSize: 10, color: '#94A3B8' },
  notifDesc: { fontSize: 11, color: '#64748B', marginTop: 4, lineHeight: 16 },
  unreadDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D13239', marginTop: 4 },
});
