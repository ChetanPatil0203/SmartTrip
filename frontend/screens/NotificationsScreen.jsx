import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, Bell, Bus, Train, Plane, Building2, CheckCircle2, DollarSign, ChevronRight } from 'lucide-react-native';

const notificationsList = [
  { id: 1, type: 'bus', title: 'Bus Approaching Boarding Point', desc: 'Neeta Tours (SB12345678) is 12 mins away from Dadar TT Circle.', time: '10 mins ago', Icon: Bus, color: '#D13239', bg: '#FFF0F0' },
  { id: 2, type: 'train', title: 'Train Status Update', desc: '12009 Shatabdi Express is running ON TIME. Expected Surat arrival 09:55 AM.', time: '30 mins ago', Icon: Train, color: '#2563EB', bg: '#EFF6FF' },
  { id: 3, type: 'flight', title: 'Flight Web Check-in Open', desc: 'Flight ST-402 (BOM ➔ DEL) check-in is now open. Select your seat.', time: '2 hours ago', Icon: Plane, color: '#0284C7', bg: '#F0F9FF' },
  { id: 4, type: 'hotel', title: 'Hotel Check-in Reminder', desc: 'Check-in at Taj Holiday Village, Goa starts at 02:00 PM today.', time: '4 hours ago', Icon: Building2, color: '#059669', bg: '#ECFDF5' },
  { id: 5, type: 'refund', title: 'Refund Initiated', desc: '₹1,386 refund initiated for booking ST55667. Expected in 24-48h.', time: 'Yesterday', Icon: DollarSign, color: '#D97706', bg: '#FEF3C7' },
];

export default function NotificationsScreen({ onNavigate }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => onNavigate('home')} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Notifications Center</Text>
            <Text style={styles.headerSub}>Real-time alerts for all your journeys</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {notificationsList.map((n) => {
          const IconComp = n.Icon;
          return (
            <View key={n.id} style={styles.notifCard}>
              <View style={[styles.iconBox, { backgroundColor: n.bg }]}>
                <IconComp size={18} color={n.color} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.topRow}>
                  <Text style={styles.notifTitle}>{n.title}</Text>
                  <Text style={styles.timeText}>{n.time}</Text>
                </View>
                <Text style={styles.notifDesc}>{n.desc}</Text>
              </View>
            </View>
          );
        })}
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
    backgroundColor: '#D13239',
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
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  timeText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  notifDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 16,
  },
});
