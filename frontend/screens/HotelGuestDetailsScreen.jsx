import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
import { ArrowLeft, User, Phone, Mail, Check, ChevronRight, Sparkles } from 'lucide-react-native';

export default function HotelGuestDetailsScreen({ onNavigate, booking, setBooking }) {
  const [guestName, setGuestName] = useState('Rahul Sharma');
  const [phone, setPhone] = useState('+91 9876543210');
  const [email, setEmail] = useState('rahul.sharma@example.com');
  const [earlyCheckIn, setEarlyCheckIn] = useState(true);
  const [extraBed, setExtraBed] = useState(false);

  const handleProceedPayment = () => {
    setBooking({
      hotelGuestDetails: {
        fullName: guestName,
        phone,
        email,
        earlyCheckIn,
        extraBed,
      },
      passengerList: [{ name: guestName, phone, email }],
      bookingType: 'hotel',
    });
    onNavigate('payment');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => onNavigate('hotel-details')} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Hotel Guest Details</Text>
            <Text style={styles.headerSub}>Primary Guest Registration</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Form Card */}
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <User size={18} color="#059669" />
            <Text style={styles.formTitle}>Primary Guest Info</Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>FULL NAME (FOR HOTEL CHECK-IN)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Rahul Sharma"
              placeholderTextColor="#9CA3AF"
              value={guestName}
              onChangeText={setGuestName}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>MOBILE NUMBER (FOR SMS VOUCHER)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="+91 9876543210"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>EMAIL ADDRESS (FOR BOOKING VOUCHER)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="rahul@example.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        {/* Special Requests */}
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Sparkles size={18} color="#059669" />
            <Text style={styles.formTitle}>Special Requests (Optional)</Text>
          </View>

          <TouchableOpacity
            onPress={() => setEarlyCheckIn(!earlyCheckIn)}
            style={[styles.checkRow, earlyCheckIn && styles.checkRowActive]}
          >
            <View style={[styles.checkbox, earlyCheckIn && styles.checkboxActive]}>
              {earlyCheckIn && <Check size={12} color="#FFFFFF" />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.checkTitle}>Request Early Check-in</Text>
              <Text style={styles.checkSub}>Subject to room availability on arrival</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setExtraBed(!extraBed)}
            style={[styles.checkRow, extraBed && styles.checkRowActive]}
          >
            <View style={[styles.checkbox, extraBed && styles.checkboxActive]}>
              {extraBed && <Check size={12} color="#FFFFFF" />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.checkTitle}>Extra Rollaway Bed (+₹800)</Text>
              <Text style={styles.checkSub}>Comfortable extra mattress for 3rd guest</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Total Payable Amount</Text>
          <Text style={styles.bottomPrice}>₹{(booking.totalAmount || 5040) + (extraBed ? 800 : 0)}</Text>
        </View>
        <TouchableOpacity onPress={handleProceedPayment} style={styles.continueBtn} activeOpacity={0.8}>
          <Text style={styles.continueText}>Proceed to Payment</Text>
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
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 90,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  textInput: {
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#0F172A',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  checkRowActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#059669',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  checkTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  checkSub: {
    fontSize: 10,
    color: '#64748B',
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
    backgroundColor: '#059669',
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
