import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch } from 'react-native';
import { ArrowLeft, Bell, Moon, Globe, Shield, Smartphone, ChevronRight, LogOut } from 'lucide-react-native';

export default function SettingsScreen({ onNavigate }) {
  const [s, setS] = useState({
    pushNotifs: true,
    emailNotifs: false,
    smsNotifs: true,
    delayAlerts: true,
    offerNotifs: true,
    darkMode: false,
    biometric: false,
    locationAccess: true,
    lang: 'English',
  });

  const toggle = (k) => setS(prev => ({ ...prev, [k]: !prev[k] }));

  const Section = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );

  const Row = ({ Icon, label, sub, color, right }) => (
    <View style={styles.row}>
      <View style={[styles.rowIconBox, { backgroundColor: color + '15' }]}>
        <Icon size={17} color={color} />
      </View>
      <View style={styles.flex1}>
        <Text style={styles.rowLabel}>{label}</Text>
        {sub && <Text style={styles.rowSub}>{sub}</Text>}
      </View>
      {right}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('profile')} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Section title="NOTIFICATIONS">
          <Row Icon={Bell} label="Push Notifications" sub="App alerts & updates" color="#D13239" right={<Switch value={s.pushNotifs} onValueChange={() => toggle('pushNotifs')} trackColor={{ true: '#D13239' }} />} />
          <Row Icon={Bell} label="Email Notifications" sub="Booking summaries" color="#2563EB" right={<Switch value={s.emailNotifs} onValueChange={() => toggle('emailNotifs')} trackColor={{ true: '#D13239' }} />} />
          <Row Icon={Bell} label="SMS Alerts" sub="OTP & important alerts" color="#059669" right={<Switch value={s.smsNotifs} onValueChange={() => toggle('smsNotifs')} trackColor={{ true: '#D13239' }} />} />
          <Row Icon={Bell} label="Delay Alerts" sub="Get notified of delays" color="#D97706" right={<Switch value={s.delayAlerts} onValueChange={() => toggle('delayAlerts')} trackColor={{ true: '#D13239' }} />} />
          <Row Icon={Bell} label="Offers & Deals" sub="Promo notifications" color="#7C3AED" right={<Switch value={s.offerNotifs} onValueChange={() => toggle('offerNotifs')} trackColor={{ true: '#D13239' }} />} />
        </Section>

        <Section title="APPEARANCE">
          <Row Icon={Moon} label="Dark Mode" sub="Coming soon" color="#1E3A5F" right={<Switch value={s.darkMode} onValueChange={() => toggle('darkMode')} trackColor={{ true: '#D13239' }} />} />
          <Row Icon={Globe} label="Language" sub={s.lang} color="#0EA5E9" right={<ChevronRight size={16} color="#D1D5DB" />} />
        </Section>

        <Section title="PRIVACY & SECURITY">
          <Row Icon={Shield} label="Biometric Login" sub="Face ID / Fingerprint" color="#059669" right={<Switch value={s.biometric} onValueChange={() => toggle('biometric')} trackColor={{ true: '#D13239' }} />} />
          <Row Icon={Smartphone} label="Location Access" sub="Required for tracking" color="#D13239" right={<Switch value={s.locationAccess} onValueChange={() => toggle('locationAccess')} trackColor={{ true: '#D13239' }} />} />
        </Section>

        <View style={styles.card}>
          <TouchableOpacity onPress={() => onNavigate('login')} style={styles.row} activeOpacity={0.7}>
            <View style={styles.logoutIconBox}>
              <LogOut size={17} color="#D13239" />
            </View>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerVersionText}>SmartBus v1.0.0 · Made with ❤️</Text>
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
    backgroundColor: '#D13239',
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
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  section: {
    gap: 6,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1.5,
    paddingLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  rowIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex1: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  rowSub: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  logoutIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D13239',
  },
  footerVersionText: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '600',
    color: '#D1D5DB',
    marginTop: 8,
  },
});
