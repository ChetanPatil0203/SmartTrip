import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
import { ArrowLeft, UserPlus, Trash2, Edit3, ShieldCheck, ChevronRight, User } from 'lucide-react-native';

const genders = ['Male', 'Female', 'Transgender'];
const idTypes = ['Aadhaar Card', 'PAN Card', 'Passport', 'Voter ID', 'Driving License'];
const berths = ['Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper'];

export default function TrainPassengerDetailsScreen({ onNavigate, booking, setBooking }) {
  const [passengers, setPassengers] = useState([
    { id: 1, name: 'Rahul Sharma', age: '28', gender: 'Male', idType: 'Aadhaar Card', berth: booking.selectedTrainBerthPref || 'Lower' },
  ]);

  const [nameInput, setNameInput] = useState('');
  const [ageInput, setAgeInput] = useState('');
  const [selectedGender, setSelectedGender] = useState('Male');
  const [selectedIdType, setSelectedIdType] = useState('Aadhaar Card');
  const [selectedBerth, setSelectedBerth] = useState('Lower');

  const addPassenger = () => {
    if (!nameInput.trim() || !ageInput.trim()) return;
    const newP = {
      id: Date.now(),
      name: nameInput,
      age: ageInput,
      gender: selectedGender,
      idType: selectedIdType,
      berth: selectedBerth,
    };
    setPassengers([...passengers, newP]);
    setNameInput('');
    setAgeInput('');
  };

  const removePassenger = (id) => {
    if (passengers.length === 1) return;
    setPassengers(passengers.filter(p => p.id !== id));
  };

  const handleProceedPayment = () => {
    setBooking({
      trainPassengerList: passengers,
      passengerList: passengers,
      totalAmount: (booking.totalAmount || 1450) * Math.max(1, passengers.length),
      bookingType: 'train',
    });
    onNavigate('payment');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => onNavigate('train-seat-selection')} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Train Passenger Details</Text>
            <Text style={styles.headerSub}>IRCTC Traveler Information</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Existing Passenger List */}
        <Text style={styles.sectionTitle}>ADDED PASSENGERS ({passengers.length})</Text>
        {passengers.map((p, index) => (
          <View key={p.id} style={styles.passengerCard}>
            <View style={styles.passengerCardHeader}>
              <View style={styles.avatarCircle}>
                <User size={16} color="#2563EB" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.pName}>Passenger {index + 1}: {p.name}</Text>
                <Text style={styles.pMeta}>{p.age} yrs · {p.gender} · {p.idType}</Text>
              </View>
              <View style={styles.berthBadge}>
                <Text style={styles.berthBadgeText}>{p.berth}</Text>
              </View>
              {passengers.length > 1 && (
                <TouchableOpacity onPress={() => removePassenger(p.id)} style={styles.deleteBtn}>
                  <Trash2 size={16} color="#DC2626" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {/* Add New Passenger Form */}
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <UserPlus size={16} color="#2563EB" />
            <Text style={styles.formTitle}>Add New Traveler</Text>
          </View>

          {/* Full Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>FULL NAME (AS PER GOVT ID)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Ramesh Kumar"
              placeholderTextColor="#9CA3AF"
              value={nameInput}
              onChangeText={setNameInput}
            />
          </View>

          {/* Age & Gender */}
          <View style={styles.rowTwoCols}>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>AGE</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 32"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={ageInput}
                onChangeText={setAgeInput}
              />
            </View>

            <View style={[styles.fieldGroup, { flex: 2 }]}>
              <Text style={styles.fieldLabel}>GENDER</Text>
              <View style={styles.genderRow}>
                {genders.map((g) => (
                  <TouchableOpacity
                    key={g}
                    onPress={() => setSelectedGender(g)}
                    style={[styles.genderChip, selectedGender === g && styles.genderChipActive]}
                  >
                    <Text style={[styles.genderText, selectedGender === g && styles.genderTextActive]}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* ID Type */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>ID PROOF TYPE</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.idScroll}>
              {idTypes.map((idT) => (
                <TouchableOpacity
                  key={idT}
                  onPress={() => setSelectedIdType(idT)}
                  style={[styles.idChip, selectedIdType === idT && styles.idChipActive]}
                >
                  <Text style={[styles.idText, selectedIdType === idT && styles.idTextActive]}>{idT}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Berth Preference */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>BERTH PREFERENCE</Text>
            <View style={styles.berthsRow}>
              {berths.map((b) => (
                <TouchableOpacity
                  key={b}
                  onPress={() => setSelectedBerth(b)}
                  style={[styles.berthChip, selectedBerth === b && styles.berthChipActive]}
                >
                  <Text style={[styles.berthText, selectedBerth === b && styles.berthTextActive]}>{b}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Add Passenger CTA */}
          <TouchableOpacity onPress={addPassenger} style={styles.addBtn} activeOpacity={0.8}>
            <Text style={styles.addBtnText}>+ Save & Add Traveler</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Passengers Total ({passengers.length})</Text>
          <Text style={styles.bottomPrice}>₹{(booking.totalAmount || 1450) * passengers.length}</Text>
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
    gap: 14,
    paddingBottom: 90,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  passengerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  passengerCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  pMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  berthBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  berthBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  deleteBtn: {
    padding: 6,
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
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  genderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  genderTextActive: {
    color: '#FFFFFF',
  },
  idScroll: {
    gap: 8,
  },
  idChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  idChipActive: {
    backgroundColor: '#1E3A5F',
    borderColor: '#1E3A5F',
  },
  idText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  idTextActive: {
    color: '#FFFFFF',
  },
  berthsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  berthChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  berthChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  berthText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  berthTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  addBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginTop: 4,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '800',
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
