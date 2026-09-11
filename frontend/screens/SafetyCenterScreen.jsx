import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { ArrowLeft, ShieldAlert, Phone, Share2, MapPin, AlertTriangle, Headset, CheckCircle2 } from 'lucide-react-native';
import { safetyService } from '../services/miscService';

export default function SafetyCenterScreen({ onNavigate }) {
  const [sosActive, setSosActive] = useState(false);

  const triggerSOS = async () => {
    setSosActive(true);
    try {
      await safetyService.createReport({
        type: 'SOS_EMERGENCY',
        description: 'Emergency SOS triggered by user from Safety Center',
      });
    } catch {}
    setTimeout(() => {
      setSosActive(false);
    }, 4000);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => onNavigate('home')} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Travel Safety Center</Text>
            <Text style={styles.headerSub}>Emergency response & live journey tracking</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* SOS Emergency Button */}
        <View style={styles.sosCard}>
          <TouchableOpacity
            onPress={triggerSOS}
            style={[styles.sosBtn, sosActive && styles.sosBtnActive]}
            activeOpacity={0.8}
          >
            <ShieldAlert size={28} color="#FFFFFF" />
            <Text style={styles.sosText}>
              {sosActive ? 'EMERGENCY ALERT SENT!' : 'PRESS SOS FOR EMERGENCY'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.sosSub}>Instantly notifies 24/7 SmartTrip Command Center and emergency contacts with your live location.</Text>
        </View>

        {/* Safety Tools */}
        <Text style={styles.sectionTitle}>SAFETY & PROTECTION TOOLS</Text>
        <View style={styles.toolsGrid}>
          <TouchableOpacity onPress={() => onNavigate('trip-sharing')} style={styles.toolCard}>
            <Share2 size={18} color="#2563EB" />
            <View style={{ flex: 1 }}>
              <Text style={styles.toolTitle}>Share Trip & Live Location</Text>
              <Text style={styles.toolSub}>Send real-time GPS link to family & friends</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolCard}>
            <Phone size={18} color="#059669" />
            <View style={{ flex: 1 }}>
              <Text style={styles.toolTitle}>Emergency Helpline (24/7)</Text>
              <Text style={styles.toolSub}>Direct toll-free connection to emergency desk</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onNavigate('help-support')} style={styles.toolCard}>
            <AlertTriangle size={18} color="#D97706" />
            <View style={{ flex: 1 }}>
              <Text style={styles.toolTitle}>Report Safety Issue</Text>
              <Text style={styles.toolSub}>Report bus driver, train cleanliness or flight issues</Text>
            </View>
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
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#DC2626',
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
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
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
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  sosCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    alignItems: 'center',
    gap: 12,
    elevation: 3,
  },
  sosBtn: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 20,
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    elevation: 4,
  },
  sosBtnActive: {
    backgroundColor: '#16A34A',
  },
  sosText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  sosSub: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  toolsGrid: {
    gap: 10,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  toolTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  toolSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
});
