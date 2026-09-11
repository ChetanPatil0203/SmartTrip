import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, Share2, Copy, Check, MessageCircle, Phone, Mail, Link2, MapPin, Clock, Bus } from 'lucide-react-native';

export default function TripSharingScreen({ onNavigate, booking }) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const link = `https://smartbus.in/track/${booking.pnr || 'SB12345678'}`;

  const copyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareVia = (method) => {
    if (method === 'Copy Link') {
      copyLink();
      return;
    }
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('live-tracking')} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Share Live Trip</Text>
          <Text style={styles.headerSub}>Let your family track you</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Snapshot Card */}
        <View style={styles.card}>
          <View style={styles.colorStrip} />
          <View style={styles.cardPad}>
            <View style={styles.liveHeaderRow}>
              <Text style={styles.brandTitle}>LIVE TRIP · SMARTBUS</Text>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>

            <View style={styles.grid2}>
              {[
                { Icon: Bus, label: 'PNR', value: booking.pnr || 'SB12345678', color: '#D13239' },
                { Icon: MapPin, label: 'From → To', value: `${booking.from || 'Mumbai'} → ${booking.to || 'Pune'}`, color: '#2563EB' },
                { Icon: Clock, label: 'ETA', value: booking.selectedBus?.arrival || '11:00 PM', color: '#059669' },
                { Icon: MapPin, label: 'Drop Point', value: booking.droppingPoint || 'Swargate', color: '#D97706' },
              ].map(({ Icon, label, value, color }) => (
                <View key={label} style={styles.gridCell}>
                  <View style={styles.cellHeaderRow}>
                    <Icon size={11} color={color} />
                    <Text style={styles.cellLabel}>{label}</Text>
                  </View>
                  <Text style={styles.cellVal}>{value}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Link Card */}
        <View style={styles.card}>
          <View style={styles.linkHeaderRow}>
            <Link2 size={16} color="#D13239" />
            <Text style={styles.cardTitle}>Tracking Link</Text>
          </View>
          <View style={styles.linkBox}>
            <Text style={styles.linkText} numberOfLines={1}>{link}</Text>
            <TouchableOpacity onPress={copyLink}>
              {copied ? <Check size={16} color="#16A34A" strokeWidth={3} /> : <Copy size={16} color="#D13239" />}
            </TouchableOpacity>
          </View>
          {copied && <Text style={styles.copiedSuccessText}>✓ Link copied to clipboard</Text>}
        </View>

        {/* Share via */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Share Via</Text>
          <View style={styles.grid3}>
            {[
              { Icon: MessageCircle, label: 'WhatsApp', color: '#22C55E', bg: '#F0FFF4' },
              { Icon: MessageCircle, label: 'SMS', color: '#2563EB', bg: '#EFF6FF' },
              { Icon: Mail, label: 'Email', color: '#D97706', bg: '#FFFBEB' },
              { Icon: Phone, label: 'Call', color: '#7C3AED', bg: '#F5F3FF' },
              { Icon: Share2, label: 'More', color: '#6B7280', bg: '#F3F4F6' },
              { Icon: Link2, label: 'Copy Link', color: '#D13239', bg: '#FFF0F0' },
            ].map(({ Icon, label, color, bg }) => (
              <TouchableOpacity
                key={label}
                onPress={() => shareVia(label)}
                style={[styles.shareItem, { backgroundColor: bg }]}
                activeOpacity={0.8}
              >
                <Icon size={22} color={color} />
                <Text style={styles.shareItemLabel}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {shared && (
          <View style={styles.sharedSuccessBox}>
            <Text style={styles.sharedSuccessTitle}>✓ Trip shared successfully!</Text>
            <Text style={styles.sharedSuccessSub}>Your contact can now track your journey live.</Text>
          </View>
        )}
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
  headerSub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    padding: 16,
  },
  colorStrip: {
    height: 4,
    width: '100%',
    backgroundColor: '#D13239',
  },
  cardPad: {
    paddingTop: 8,
  },
  liveHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#15803D',
  },
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridCell: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 12,
  },
  cellHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  cellLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  cellVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
  },
  linkHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  linkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 12,
    color: '#4B5563',
    marginRight: 8,
  },
  copiedSuccessText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16A34A',
    textAlign: 'center',
    marginTop: 8,
  },
  grid3: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  shareItem: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    gap: 6,
  },
  shareItemLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#374151',
  },
  sharedSuccessBox: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  sharedSuccessTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#15803D',
  },
  sharedSuccessSub: {
    fontSize: 12,
    color: '#16A34A',
    marginTop: 2,
  },
});
