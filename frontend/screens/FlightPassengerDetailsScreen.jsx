import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
import { ArrowLeft, UserPlus, Trash2, ShieldCheck, ChevronRight, User } from 'lucide-react-native';

export default function FlightPassengerDetailsScreen({ onNavigate, booking, setBooking }) {
  const [fullName, setFullName] = useState('Rahul Sharma');
  const [dob, setDob] = useState('15/08/1995');
  const [gender, setGender] = useState('Male');
  const [nationality, setNationality] = useState('Indian');
  const [phone, setPhone] = useState('+91 9876543210');
  const [email, setEmail] = useState('rahul.sharma@example.com');

  const handleProceedPayment = () => {
    const passengerData = {
      name: fullName,
      dob,
      gender,
      nationality,
      phone,
      email,
      seat: booking.selectedFlightSeats?.[0] || '2A',
    };
    setBooking({
      flightPassengerList: [passengerData],
      passengerList: [passengerData],
      bookingType: 'flight',
    });
    onNavigate('payment');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => onNavigate('flight-addons')} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Flight Passenger Details</Text>
            <Text style={styles.headerSub}>Air Traveler Registration</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Form Card */}
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <User size={18} color="#0284C7" />
            <Text style={styles.formTitle}>Primary Traveler Info</Text>
          </View>

          {/* Full Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>FULL NAME (AS ON PASSPORT / GOVT ID)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Rahul Sharma"
              placeholderTextColor="#9CA3AF"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          {/* DOB & Gender */}
          <View style={styles.rowTwoCols}>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>DATE OF BIRTH</Text>
              <TextInput
                style={styles.textInput}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#9CA3AF"
                value={dob}
                onChangeText={setDob}
              />
            </View>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>GENDER</Text>
              <View style={styles.genderRow}>
                {['Male', 'Female'].map((g) => (
                  <TouchableOpacity
                    key={g}
                    onPress={() => setGender(g)}
                    style={[styles.genderChip, gender === g && styles.genderChipActive]}
                  >
                    <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Nationality */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>NATIONALITY</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Indian"
              placeholderTextColor="#9CA3AF"
              value={nationality}
              onChangeText={setNationality}
            />
          </View>

          {/* Contact Details */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>MOBILE NUMBER (FOR SMS E-TICKET)</Text>
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
            <Text style={styles.fieldLabel}>EMAIL ADDRESS (FOR BOARDING PASS)</Text>
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
      </ScrollView>

      {/* Bottom Sticky Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Total Payable Amount</Text>
          <Text style={styles.bottomPrice}>₹{booking.totalAmount || 5989}</Text>
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
    backgroundColor: '#0284C7',
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
  rowTwoCols: {
    flexDirection: 'row',
    gap: 10,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 6,
  },
  genderChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  genderChipActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  genderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  genderTextActive: {
    color: '#FFFFFF',
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
    backgroundColor: '#0284C7',
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
