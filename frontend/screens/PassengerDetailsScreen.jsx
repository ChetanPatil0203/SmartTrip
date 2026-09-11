import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, UserPlus, User, Hash, Check, ArrowRight } from 'lucide-react-native';

const emptyP = (seat) => ({ name: '', age: '', gender: 'Male', seat });

export default function PassengerDetailsScreen({ onNavigate, booking, setBooking }) {
  const seats = booking.selectedSeats.length > 0 ? booking.selectedSeats : [7, 8];
  const [passengers, setPassengers] = useState(seats.map(s => emptyP(s)));

  const update = (i, field, val) =>
    setPassengers(prev => prev.map((p, pi) => (pi === i ? { ...p, [field]: val } : p)));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('boarding-dropping')} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={18} color="#111827" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Passenger Details</Text>
          <Text style={styles.headerSub}>Enter passenger information</Text>
        </View>
      </View>

      {/* Steps Bar */}
      <View style={styles.stepsBar}>
        {['Seat', 'Boarding', 'Passengers', 'Payment'].map((step, i) => (
          <React.Fragment key={step}>
            <View style={styles.stepCol}>
              <View
                style={[
                  styles.stepBadge,
                  { backgroundColor: i <= 2 ? '#D13239' : '#E5E7EB' },
                ]}
              >
                {i < 2 ? (
                  <Check size={12} color="#FFFFFF" strokeWidth={3} />
                ) : (
                  <Text style={[styles.stepNum, { color: i <= 2 ? '#FFFFFF' : '#9CA3AF' }]}>{i + 1}</Text>
                )}
              </View>
              <Text style={[styles.stepLabel, { color: i <= 2 ? '#D13239' : '#9CA3AF' }]}>{step}</Text>
            </View>
            {i < 3 && (
              <View style={[styles.stepLine, { backgroundColor: i < 2 ? '#D13239' : '#E5E7EB' }]} />
            )}
          </React.Fragment>
        ))}
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {passengers.map((p, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.badgeIndex}>
                <Text style={styles.badgeIndexText}>{i + 1}</Text>
              </View>
              <Text style={styles.cardHeaderText}>Passenger {i + 1}</Text>
              <View style={styles.seatBadge}>
                <Hash size={12} color="#D13239" />
                <Text style={styles.seatBadgeText}>Seat {p.seat}</Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>FULL NAME *</Text>
                <View style={styles.inputWrapper}>
                  <User size={16} color="#9CA3AF" />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter full name"
                    placeholderTextColor="#9CA3AF"
                    value={p.name}
                    onChangeText={v => update(i, 'name', v)}
                  />
                </View>
              </View>

              <View style={styles.rowFields}>
                <View style={styles.flex1}>
                  <Text style={styles.label}>AGE *</Text>
                  <TextInput
                    style={styles.singleInput}
                    placeholder="Age"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                    value={p.age}
                    onChangeText={v => update(i, 'age', v)}
                  />
                </View>
                <View style={styles.flex1}>
                  <Text style={styles.label}>GENDER</Text>
                  <View style={styles.genderRow}>
                    {['Male', 'Female'].map(g => (
                      <TouchableOpacity
                        key={g}
                        onPress={() => update(i, 'gender', g)}
                        style={[
                          styles.genderBtn,
                          {
                            borderColor: p.gender === g ? '#D13239' : '#E5E7EB',
                            backgroundColor: p.gender === g ? '#D13239' : 'transparent',
                          },
                        ]}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.genderBtnText, { color: p.gender === g ? '#FFFFFF' : '#6B7280' }]}>
                          {g}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity
          onPress={() => setPassengers(prev => [...prev, emptyP(0)])}
          style={styles.addBtn}
          activeOpacity={0.7}
        >
          <UserPlus size={18} color="#6B7280" />
          <Text style={styles.addBtnText}>ADD ANOTHER PASSENGER</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => { setBooking({ passengerList: passengers }); onNavigate('payment'); }}
          style={styles.continueBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.continueBtnText}>CONTINUE TO PAYMENT</Text>
          <ArrowRight size={18} color="#FFFFFF" />
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  headerSub: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  stepsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  stepCol: {
    alignItems: 'center',
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: {
    fontSize: 10,
    fontWeight: '700',
  },
  stepLabel: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 4,
  },
  stepLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 4,
    marginBottom: 12,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 100,
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
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  badgeIndex: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: '#D13239',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIndexText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  cardHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  seatBadge: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  seatBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D13239',
  },
  cardBody: {
    padding: 16,
    gap: 12,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    padding: 0,
  },
  rowFields: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
    gap: 6,
  },
  singleInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 6,
  },
  genderBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  addBtn: {
    width: '100%',
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  continueBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#D13239',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 4,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
