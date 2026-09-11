import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { ArrowLeft, CreditCard, Wallet, Smartphone, Building, ShieldCheck, CheckCircle2, ChevronRight, Zap } from 'lucide-react-native';

const paymentMethods = [
  { id: 'upi', label: 'UPI (Google Pay, PhonePe, Paytm)', Icon: Smartphone, desc: 'Instant 0% Convenience Fee' },
  { id: 'card', label: 'Credit / Debit Card', Icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
  { id: 'wallet', label: 'Wallets & PayLater', Icon: Wallet, desc: 'Paytm, Amazon Pay, Mobikwik' },
  { id: 'netbanking', label: 'Net Banking', Icon: Building, desc: 'SBI, HDFC, ICICI, Axis & All Banks' },
];

export default function PaymentScreen({ onNavigate, booking, setBooking }) {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);

  const bookingType = booking.bookingType || 'bus';
  const rawBase = booking.totalAmount || 1540;
  const taxes = Math.round(rawBase * 0.05);
  const convenienceFee = 25;
  const discount = booking.discount || 0;
  const finalTotal = Math.max(0, rawBase + taxes + convenienceFee - discount);

  const handlePayNow = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setBooking({
        paymentMethod: selectedMethod,
        totalAmount: finalTotal,
      });

      // Route to category-specific confirmation ticket!
      if (bookingType === 'train') onNavigate('train-ticket');
      else if (bookingType === 'flight') onNavigate('flight-ticket');
      else if (bookingType === 'hotel') onNavigate('hotel-ticket');
      else onNavigate('booking-confirmation');
    }, 1200);
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
            <Text style={styles.headerTitle}>Universal Payment Checkout</Text>
            <Text style={styles.headerSub}>Secure 256-bit SSL Encrypted</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Booking Summary Box */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Zap size={16} color="#D13239" />
            <Text style={styles.summaryTitle}>{bookingType.toUpperCase()} BOOKING SUMMARY</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.sumLabel}>Reference PNR</Text>
            <Text style={styles.sumVal}>{booking.pnr || 'ST948120'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.sumLabel}>Traveler(s)</Text>
            <Text style={styles.sumVal}>{booking.passengerList?.length || 1} Person(s)</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <Text style={styles.sectionTitle}>SELECT PAYMENT METHOD</Text>
        <View style={styles.methodsList}>
          {paymentMethods.map((m) => {
            const active = selectedMethod === m.id;
            const IconComp = m.Icon;
            return (
              <TouchableOpacity
                key={m.id}
                onPress={() => setSelectedMethod(m.id)}
                style={[styles.methodCard, active && styles.methodCardActive]}
                activeOpacity={0.8}
              >
                <View style={[styles.iconCircle, active && styles.iconCircleActive]}>
                  <IconComp size={18} color={active ? '#FFFFFF' : '#64748B'} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.methodLabel, active && styles.methodLabelActive]}>{m.label}</Text>
                  <Text style={styles.methodDesc}>{m.desc}</Text>
                </View>
                <View style={[styles.radio, active && styles.radioActive]}>
                  {active && <CheckCircle2 size={12} color="#FFFFFF" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Fare Transparency Breakdown */}
        <View style={styles.breakdownCard}>
          <Text style={styles.sectionTitle}>FARES & PRICE TRANSPARENCY</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Base Fare</Text>
            <Text style={styles.priceVal}>₹{rawBase}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>GST & Govt Charges (5%)</Text>
            <Text style={styles.priceVal}>₹{taxes}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>SmartTrip Convenience Fee</Text>
            <Text style={styles.priceVal}>₹{convenienceFee}</Text>
          </View>
          {discount > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.discLabel}>Promo Discount</Text>
              <Text style={styles.discVal}>-₹{discount}</Text>
            </View>
          )}

          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Payable Amount</Text>
            <Text style={styles.totalVal}>₹{finalTotal}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Payment Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Final Amount</Text>
          <Text style={styles.bottomPrice}>₹{finalTotal}</Text>
        </View>
        <TouchableOpacity
          onPress={handlePayNow}
          disabled={processing}
          style={styles.payBtn}
          activeOpacity={0.8}
        >
          {processing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.payBtnText}>Pay & Confirm Ticket</Text>
              <ChevronRight size={16} color="#FFFFFF" />
            </>
          )}
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
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  summaryTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D13239',
    letterSpacing: 0.5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sumLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  sumVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  methodsList: {
    gap: 8,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  methodCardActive: {
    borderColor: '#D13239',
    backgroundColor: '#FFF5F5',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleActive: {
    backgroundColor: '#D13239',
  },
  methodLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  methodLabelActive: {
    color: '#D13239',
  },
  methodDesc: {
    fontSize: 10,
    color: '#64748B',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    backgroundColor: '#D13239',
    borderColor: '#D13239',
  },
  breakdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  priceVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  discLabel: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '700',
  },
  discVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#10B981',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '900',
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
  payBtn: {
    backgroundColor: '#D13239',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 160,
    justifyContent: 'center',
  },
  payBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
