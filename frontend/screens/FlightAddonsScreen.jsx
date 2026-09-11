import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, Luggage, Utensils, Shield, Check, ChevronRight } from 'lucide-react-native';

const baggageOptions = [
  { id: '15 KG', label: '15 KG Standard', price: 0 },
  { id: '20 KG', label: '20 KG (+5 KG Extra)', price: 900 },
  { id: '30 KG', label: '30 KG (+15 KG Extra)', price: 1800 },
];

const mealOptions = [
  { id: 'None', label: 'No Meal', price: 0 },
  { id: 'Veg Thali', label: 'Gourmet Veg Thali', price: 350 },
  { id: 'Non-Veg Sandwich', label: 'Non-Veg Club Sandwich', price: 400 },
  { id: 'Snack Box', label: 'Healthy Snack & Beverage Box', price: 250 },
];

export default function FlightAddonsScreen({ onNavigate, booking, setBooking }) {
  const [selectedBaggage, setSelectedBaggage] = useState(booking.flightAddons?.baggage || '15 KG');
  const [selectedMeal, setSelectedMeal] = useState(booking.flightAddons?.meal || 'None');
  const [insurance, setInsurance] = useState(true);

  const baggagePrice = baggageOptions.find(b => b.id === selectedBaggage)?.price || 0;
  const mealPrice = mealOptions.find(m => m.id === selectedMeal)?.price || 0;
  const insurancePrice = insurance ? 199 : 0;

  const basePrice = (booking.selectedFlight?.price || 5490) + (booking.flightSeatPrice || 0);
  const totalAmount = basePrice + baggagePrice + mealPrice + insurancePrice;

  const handleContinue = () => {
    setBooking({
      flightAddons: {
        baggage: selectedBaggage,
        meal: selectedMeal,
        insurance,
      },
      totalAmount,
      bookingType: 'flight',
    });
    onNavigate('flight-passenger-details');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => onNavigate('flight-seat-selection')} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Flight Add-ons & Services</Text>
            <Text style={styles.headerSub}>Customize baggage, meal & insurance</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Excess Baggage */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Luggage size={16} color="#0284C7" />
            <Text style={styles.sectionTitle}>EXCESS CHECK-IN BAGGAGE</Text>
          </View>
          <View style={styles.optionsList}>
            {baggageOptions.map((b) => {
              const active = selectedBaggage === b.id;
              return (
                <TouchableOpacity
                  key={b.id}
                  onPress={() => setSelectedBaggage(b.id)}
                  style={[styles.optionCard, active && styles.optionCardActive]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.optionLabel}>{b.label}</Text>
                    <Text style={styles.optionPrice}>{b.price === 0 ? 'Included Free' : `+₹${b.price}`}</Text>
                  </View>
                  <View style={[styles.radio, active && styles.radioActive]}>
                    {active && <Check size={12} color="#FFFFFF" />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* In-Flight Meals */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Utensils size={16} color="#0284C7" />
            <Text style={styles.sectionTitle}>IN-FLIGHT MEALS</Text>
          </View>
          <View style={styles.optionsList}>
            {mealOptions.map((m) => {
              const active = selectedMeal === m.id;
              return (
                <TouchableOpacity
                  key={m.id}
                  onPress={() => setSelectedMeal(m.id)}
                  style={[styles.optionCard, active && styles.optionCardActive]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.optionLabel}>{m.label}</Text>
                    <Text style={styles.optionPrice}>{m.price === 0 ? 'No Meal' : `+₹${m.price}`}</Text>
                  </View>
                  <View style={[styles.radio, active && styles.radioActive]}>
                    {active && <Check size={12} color="#FFFFFF" />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Travel Insurance */}
        <View style={styles.sectionCard}>
          <TouchableOpacity
            onPress={() => setInsurance(!insurance)}
            style={[styles.insuranceCard, insurance && styles.insuranceCardActive]}
            activeOpacity={0.8}
          >
            <Shield size={20} color={insurance ? '#0284C7' : '#64748B'} />
            <View style={{ flex: 1 }}>
              <Text style={styles.insuranceTitle}>Secure Your Journey (₹199/Pax)</Text>
              <Text style={styles.insuranceSub}>Covers flight cancellation, medical emergencies & baggage loss up to ₹5,00,000.</Text>
            </View>
            <View style={[styles.radio, insurance && styles.radioActive]}>
              {insurance && <Check size={12} color="#FFFFFF" />}
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Total (Incl. Add-ons)</Text>
          <Text style={styles.bottomPrice}>₹{totalAmount}</Text>
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
    gap: 14,
    paddingBottom: 90,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  optionsList: {
    gap: 8,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  optionCardActive: {
    backgroundColor: '#F0F9FF',
    borderColor: '#0284C7',
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  optionPrice: {
    fontSize: 11,
    color: '#0284C7',
    fontWeight: '600',
    marginTop: 2,
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
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  insuranceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  insuranceTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  insuranceSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
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
