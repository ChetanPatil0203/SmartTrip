import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Home, Ticket, Tag, User, HelpCircle, Settings, LogOut, ChevronRight, Zap, X } from 'lucide-react-native';

const items = [
  { Icon: Home, label: 'Home', sub: 'Main dashboard', screen: 'home', color: '#D13239' },
  { Icon: Ticket, label: 'My Trips', sub: 'Your bookings', screen: 'my-trips', color: '#2563EB' },
  { Icon: Tag, label: 'Offers', sub: 'Deals & coupons', screen: 'offers', color: '#D97706' },
  { Icon: User, label: 'Profile', sub: 'Account settings', screen: 'profile', color: '#7C3AED' },
  { Icon: HelpCircle, label: 'Help & Support', sub: 'FAQs & contact', screen: 'help-support', color: '#059669' },
  { Icon: Settings, label: 'Settings', sub: 'Preferences', screen: 'settings', color: '#6B7280' },
];

export default function SideMenuScreen({ onNavigate }) {
  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => onNavigate('home')}>
        <View style={styles.menuDrawer} onStartShouldSetResponder={() => true}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => onNavigate('home')}
              style={styles.closeBtn}
              activeOpacity={0.7}
            >
              <X size={16} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Logo */}
            <View style={styles.logoRow}>
              <View style={styles.logoBox}>
                <Zap size={20} color="#FFD700" fill="#FFD700" />
              </View>
              <Text style={styles.appName}>SmartBus</Text>
            </View>

            {/* User */}
            <View style={styles.userRow}>
              <View style={styles.userAvatar}>
                <User size={22} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.userName}>Rohit Patil</Text>
                <Text style={styles.userEmail}>rohit@email.com</Text>
              </View>
            </View>
          </View>

          {/* Menu Items */}
          <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
            {items.map(({ Icon, label, sub, screen, color }, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => screen && onNavigate(screen)}
                style={styles.menuItem}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIconBox, { backgroundColor: color + '15' }]}>
                  <Icon size={18} color={color} />
                </View>
                <View style={styles.flex1}>
                  <Text style={styles.menuLabel}>{label}</Text>
                  <Text style={styles.menuSub}>{sub}</Text>
                </View>
                <ChevronRight size={15} color="#D1D5DB" />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Logout */}
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={() => onNavigate('login')}
              style={styles.logoutBtn}
              activeOpacity={0.8}
            >
              <View style={styles.logoutIconBox}>
                <LogOut size={18} color="#D13239" />
              </View>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  backdrop: {
    flex: 1,
  },
  menuDrawer: {
    width: 320,
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 24,
    backgroundColor: '#D13239',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userEmail: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  menuList: {
    flex: 1,
    paddingVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex1: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  menuSub: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFF0F0',
    borderWidth: 1,
    borderColor: '#FFE0E0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  logoutIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFE0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D13239',
  },
});
