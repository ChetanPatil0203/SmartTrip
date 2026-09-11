import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import BottomNav from '../components/BottomNav';
import { User, Ticket, Tag, Bell, Shield, HelpCircle, Settings, LogOut, ChevronRight, Users, CreditCard } from 'lucide-react-native';
import authService from '../services/authService';

export default function ProfileScreen({ onNavigate }) {
  const [profile, setProfile] = useState({
    name: 'SmartTrip Traveler',
    mobile: '—',
    email: '—',
  });

  useEffect(() => {
    // 1. Load cached user
    authService.getUser().then(u => {
      if (u) {
        setProfile({
          name: u.name || 'SmartTrip Traveler',
          mobile: u.phone || u.mobile || '—',
          email: u.email || '—',
        });
      }
    });
    // 2. Fetch fresh profile from API
    authService.getProfile().then(res => {
      const u = res?.data?.user;
      if (u) {
        setProfile({
          name: u.name || 'SmartTrip Traveler',
          mobile: u.phone || u.mobile || '—',
          email: u.email || '—',
        });
      }
    }).catch(() => {});
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    onNavigate('login');
  };

  const initials = (profile.name || 'ST')
    .split(' ')
    .map(p => p[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const menuOptions = [
    { label: 'Saved Passengers & Travelers', screen: 'saved-passengers', Icon: Users, color: '#2563EB' },
    { label: 'My Trips & Bookings', screen: 'my-trips', Icon: Ticket, color: '#D13239' },
    { label: 'Special Offers & Coupons', screen: 'offers', Icon: Tag, color: '#D97706' },
    { label: 'Notifications Center', screen: 'notifications', Icon: Bell, color: '#0284C7' },
    { label: 'Travel Safety Center', screen: 'safety-center', Icon: Shield, color: '#DC2626' },
    { label: 'Help & Customer Support', screen: 'help-support', Icon: HelpCircle, color: '#059669' },
    { label: 'App Settings', screen: 'settings', Icon: Settings, color: '#64748B' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileHeaderRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{profile.name}</Text>
            <Text style={styles.userMeta}>{profile.mobile} {profile.email !== '—' ? `· ${profile.email}` : ''}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.menuCard}>
          {menuOptions.map((opt, i) => {
            const IconComp = opt.Icon;
            return (
              <TouchableOpacity
                key={opt.label}
                onPress={() => onNavigate(opt.screen)}
                style={[styles.menuRow, i === menuOptions.length - 1 && { borderBottomWidth: 0 }]}
                activeOpacity={0.7}
              >
                <View style={[styles.iconBox, { backgroundColor: opt.color + '15' }]}>
                  <IconComp size={16} color={opt.color} />
                </View>
                <Text style={styles.menuLabel}>{opt.label}</Text>
                <ChevronRight size={14} color="#94A3B8" />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutBtn}
          activeOpacity={0.8}
        >
          <LogOut size={16} color="#DC2626" />
          <Text style={styles.logoutText}>Log Out of SmartTrip</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav current="profile" onNavigate={onNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: '#D13239',
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#D13239',
  },
  userName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  userMeta: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 90,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF0F0',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 6,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#DC2626',
  },
});
