import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, AlertTriangle, ShieldCheck, ChevronRight, XCircle } from 'lucide-react-native';

export default function CancelTicketScreen({ onNavigate, booking }) {
  const [reason, setReason] = useState('Change of plans');
  const bookingType = booking.bookingType || 'bus';
  const rawPrice = booking.totalAmount || 1540;
  const cancelFee = Math.round(rawPrice * 0.1);
  const refundAmount = rawPrice - cancelFee;

  const handleConfirmCancel = () => {
    onNavigate('refund-status');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => onNavigate('my-trips')} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Cancel Booking & Request Refund</Text>
            <Text style={styles.headerSub}>{bookingType.toUpperCase()} PNR: {booking.pnr || 'ST948120'}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Warning Box */}
        <View style={styles.warningBox}>
          <AlertTriangle size={20} color="#D97706" />
          <View style={{ flex: 1 }}>
            <Text style={styles.warningTitle}>Cancellation Policy Notice</Text>
            <Text style={styles.warningSub}>
              Cancellations requested 24h prior to departure are eligible for up to 90% instant refund back to your original payment method.
            </Text>
          </View>
        </View>

        {/* Refund Calculation */}
        <View style={styles.calcCard}>
          <Text style={styles.sectionTitle}>REFUND CALCULATION</Text>
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>Original Booking Paid</Text>
            <Text style={styles.calcVal}>₹{rawPrice}</Text>
          </View>
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>Cancellation Charges (10%)</Text>
            <Text style={[styles.calcVal, { color: '#DC2626' }]}>-₹{cancelFee}</Text>
          </View>
          <View style={[styles.calcRow, styles.refundTotalRow]}>
            <Text style={styles.refundTotalLabel}>Estimated Refund Amount</Text>
            <Text style={styles.refundTotalVal}>₹{refundAmount}</Text>
          </View>
          <Text style={styles.etaText}>Expected Refund Credit Date: <Text style={{ fontWeight: '800' }}>Within 2-4 business days</Text></Text>
        </View>

        {/* Reason for Cancellation */}
        <View style={styles.reasonsCard}>
          <Text style={styles.sectionTitle}>SELECT REASON FOR CANCELLATION</Text>
          {['Change of plans', 'Found alternative travel', 'Personal emergency', 'Medical reasons'].map((r) => {
            const active = reason === r;
            return (
              <TouchableOpacity
                key={r}
                onPress={() => setReason(r)}
                style={[styles.reasonChip, active && styles.reasonChipActive]}
              >
                <Text style={[styles.reasonText, active && styles.reasonTextActive]}>{r}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Sticky Action */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          onPress={handleConfirmCancel}
          style={styles.cancelConfirmBtn}
          activeOpacity={0.8}
        >
          <XCircle size={16} color="#FFFFFF" />
          <Text style={styles.cancelConfirmText}>Confirm Cancellation & Refund</Text>
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
    gap: 14,
    paddingBottom: 90,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  warningSub: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 2,
    lineHeight: 16,
  },
  calcCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calcLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  calcVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  refundTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    marginTop: 4,
  },
  refundTotalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  refundTotalVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#10B981',
  },
  etaText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },
  reasonsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  reasonChip: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reasonChipActive: {
    backgroundColor: '#FFF0F0',
    borderColor: '#D13239',
  },
  reasonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  reasonTextActive: {
    color: '#D13239',
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
  },
  cancelConfirmBtn: {
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cancelConfirmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
