import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, CheckCircle2, Clock, Landmark, ChevronRight, ShieldCheck } from 'lucide-react-native';

const refundSteps = [
  { title: 'Cancellation Requested', time: 'Today, 10:30 AM', desc: 'Booking cancellation submitted successfully', done: true },
  { title: 'Refund Processing', time: 'Today, 10:32 AM', desc: 'Verification complete. Refund amount calculated', done: true },
  { title: 'Refund Initiated', time: 'Today, 10:35 AM', desc: 'Sent to payment gateway (UPI / Bank)', done: true },
  { title: 'Bank Processing', time: 'In Progress', desc: 'Bank processing transaction reference #REF98201', done: false, active: true },
  { title: 'Refund Credited to Account', time: 'Expected by tomorrow', desc: '₹1,386 credited to original payment source', done: false },
];

export default function RefundStatusScreen({ onNavigate, booking }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => onNavigate('my-trips')} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Refund Status Tracker</Text>
            <Text style={styles.headerSub}>Transaction Ref: #RF-881920</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.statusBanner}>
          <View style={styles.bannerHeader}>
            <Landmark size={20} color="#059669" />
            <Text style={styles.bannerTitle}>REFUND IN PROGRESS</Text>
          </View>
          <Text style={styles.amountText}>₹1,386</Text>
          <Text style={styles.subText}>Refund initiated to original UPI / Bank account. Estimated arrival in 24-48 hours.</Text>
        </View>

        {/* Refund Step-by-Step Timeline */}
        <View style={styles.timelineCard}>
          <Text style={styles.sectionTitle}>REFUND PROGRESS TIMELINE</Text>
          <View style={styles.timelineList}>
            {refundSteps.map((step, index) => (
              <View key={step.title} style={styles.stepRow}>
                <View style={styles.dotCol}>
                  <View
                    style={[
                      styles.dot,
                      step.done && styles.dotDone,
                      step.active && styles.dotActive,
                    ]}
                  >
                    {step.done && <CheckCircle2 size={12} color="#FFFFFF" />}
                    {step.active && <Clock size={12} color="#FFFFFF" />}
                  </View>
                  {index < refundSteps.length - 1 && (
                    <View style={[styles.line, step.done && styles.lineDone]} />
                  )}
                </View>

                <View style={styles.stepDetails}>
                  <Text style={[styles.stepTitle, step.active && styles.stepTitleActive]}>{step.title}</Text>
                  <Text style={styles.stepTime}>{step.time}</Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Back CTA */}
        <TouchableOpacity
          onPress={() => onNavigate('home')}
          style={styles.homeBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.homeBtnText}>Back to Dashboard</Text>
          <ChevronRight size={16} color="#FFFFFF" />
        </TouchableOpacity>
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
    backgroundColor: '#059669',
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
    paddingBottom: 40,
  },
  statusBanner: {
    backgroundColor: '#ECFDF5',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 6,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bannerTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.5,
  },
  amountText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#047857',
  },
  subText: {
    fontSize: 12,
    color: '#065F46',
    lineHeight: 18,
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  timelineList: {
    paddingLeft: 4,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  dotCol: {
    alignItems: 'center',
    width: 24,
    marginRight: 12,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: {
    backgroundColor: '#10B981',
  },
  dotActive: {
    backgroundColor: '#2563EB',
  },
  line: {
    width: 2,
    height: 36,
    backgroundColor: '#E2E8F0',
    marginTop: 2,
  },
  lineDone: {
    backgroundColor: '#10B981',
  },
  stepDetails: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  stepTitleActive: {
    fontSize: 14,
    fontWeight: '900',
    color: '#2563EB',
  },
  stepTime: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },
  stepDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  homeBtn: {
    backgroundColor: '#059669',
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  homeBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
