import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, Check, Users, Shield, Zap, ChevronRight, Armchair } from 'lucide-react-native';

const classesList = [
  { code: 'EC', name: 'Exec. Chair Car', price: 1450, status: 'Available 24', color: '#2563EB' },
  { code: 'CC', name: 'AC Chair Car', price: 920, status: 'Available 82', color: '#0284C7' },
  { code: '3A', name: 'AC 3 Tier', price: 1210, status: 'Available 45', color: '#059669' },
  { code: '2A', name: 'AC 2 Tier', price: 1680, status: 'Available 18', color: '#D97706' },
  { code: '1A', name: 'AC First Class', price: 2450, status: 'RAC 04', color: '#9333EA' },
  { code: 'SL', name: 'Sleeper', price: 420, status: 'WL 12', color: '#DC2626' },
];

const berthPreferences = [
  { id: 'Lower', label: 'Lower Berth', sub: 'Window View' },
  { id: 'Middle', label: 'Middle Berth', sub: 'Standard' },
  { id: 'Upper', label: 'Upper Berth', sub: 'Quiet Top' },
  { id: 'Side Lower', label: 'Side Lower', sub: 'Extra Space' },
  { id: 'Side Upper', label: 'Side Upper', sub: 'Top Single' },
];

export default function TrainSeatSelectionScreen({ onNavigate, booking, setBooking }) {
  const [selectedClassCode, setSelectedClassCode] = useState(booking.trainClassCode || 'EC');
  const [berthPref, setBerthPref] = useState(booking.selectedTrainBerthPref || 'Lower');
  const [passengerCount, setPassengerCount] = useState(1);

  const currentClass = classesList.find(c => c.code === selectedClassCode) || classesList[0];
  const totalFare = currentClass.price * passengerCount;

  const handleContinue = () => {
    setBooking({
      trainClass: currentClass.name,
      trainClassCode: currentClass.code,
      selectedTrainBerthPref: berthPref,
      passengers: passengerCount,
      totalAmount: totalFare,
      bookingType: 'train',
    });
    onNavigate('train-passenger-details');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => onNavigate('train-details')} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Select Class & Berth Preference</Text>
            <Text style={styles.headerSub}>{booking.selectedTrain?.name || '12009 Shatabdi Express'}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Class Selection Tabs */}
        <Text style={styles.sectionHeading}>1. CHOOSE TRAVEL CLASS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.classesScroll}>
          {classesList.map((c) => {
            const active = selectedClassCode === c.code;
            return (
              <TouchableOpacity
                key={c.code}
                onPress={() => setSelectedClassCode(c.code)}
                style={[
                  styles.classCard,
                  active && { borderColor: c.color, backgroundColor: '#FFFFFF' },
                ]}
                activeOpacity={0.8}
              >
                <View style={styles.classCardTop}>
                  <Text style={[styles.classCardCode, active && { color: c.color }]}>{c.code}</Text>
                  {active && <View style={[styles.activeDot, { backgroundColor: c.color }]} />}
                </View>
                <Text style={styles.classCardName}>{c.name}</Text>
                <Text style={styles.classCardPrice}>₹{c.price}</Text>
                <Text style={[styles.classCardStatus, { color: c.color }]}>{c.status}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Passenger Counter */}
        <Text style={styles.sectionHeading}>2. PASSENGER COUNT</Text>
        <View style={styles.counterBox}>
          <View style={styles.counterInfo}>
            <Users size={18} color="#2563EB" />
            <View>
              <Text style={styles.counterTitle}>Number of Passengers</Text>
              <Text style={styles.counterSub}>Max 6 tickets per booking</Text>
            </View>
          </View>
          <View style={styles.counterControls}>
            <TouchableOpacity
              onPress={() => setPassengerCount(Math.max(1, passengerCount - 1))}
              style={styles.countBtn}
            >
              <Text style={styles.countBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.countNum}>{passengerCount}</Text>
            <TouchableOpacity
              onPress={() => setPassengerCount(Math.min(6, passengerCount + 1))}
              style={styles.countBtn}
            >
              <Text style={styles.countBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Berth Preference */}
        <Text style={styles.sectionHeading}>3. BERTH / SEAT PREFERENCE</Text>
        <View style={styles.berthGrid}>
          {berthPreferences.map((b) => {
            const active = berthPref === b.id;
            return (
              <TouchableOpacity
                key={b.id}
                onPress={() => setBerthPref(b.id)}
                style={[styles.berthCard, active && styles.berthCardActive]}
                activeOpacity={0.8}
              >
                <View style={styles.berthIconBox}>
                  <Armchair size={16} color={active ? '#2563EB' : '#64748B'} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.berthTitle, active && styles.berthTitleActive]}>{b.label}</Text>
                  <Text style={styles.berthSub}>{b.sub}</Text>
                </View>
                {active && (
                  <View style={styles.checkBadge}>
                    <Check size={12} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selected Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Selected Class:</Text>
            <Text style={styles.summaryVal}>{currentClass.name} ({currentClass.code})</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Berth Preference:</Text>
            <Text style={styles.summaryVal}>{berthPref}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Base Fare ({passengerCount} Pax):</Text>
            <Text style={styles.summaryPrice}>₹{totalFare}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Total Fare ({passengerCount} Pax)</Text>
          <Text style={styles.bottomPrice}>₹{totalFare}</Text>
        </View>
        <TouchableOpacity onPress={handleContinue} style={styles.continueBtn} activeOpacity={0.8}>
          <Text style={styles.continueText}>Passenger Details</Text>
          <ChevronRight size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#1E3A5F',
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
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 10,
    marginTop: 10,
    letterSpacing: 0.5,
  },
  classesScroll: {
    gap: 10,
    paddingBottom: 4,
  },
  classCard: {
    width: 125,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  classCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  classCardCode: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  classCardName: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  classCardPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 6,
  },
  classCardStatus: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  counterBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  counterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  counterTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  counterSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  countBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2563EB',
  },
  countNum: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  berthGrid: {
    gap: 10,
  },
  berthCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  berthCardActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  berthIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  berthTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  berthTitleActive: {
    color: '#2563EB',
  },
  berthSub: {
    fontSize: 11,
    color: '#64748B',
  },
  checkBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 16,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  summaryVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  summaryPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#2563EB',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8,
  },
  bottomLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  bottomPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  continueBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
