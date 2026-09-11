import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, Star, Check, RefreshCw } from 'lucide-react-native';

const starRatings = [5, 4, 3, 2];
const propertyTypes = ['Hotel', 'Resort', 'Hostel', 'Apartment', 'Villa'];
const amenitiesList = ['Wi-Fi', 'Parking', 'Pool', 'Breakfast', 'AC', 'Restaurant', 'Gym'];

export default function HotelFilterScreen({ onNavigate }) {
  const [selectedStars, setSelectedStars] = useState([5, 4]);
  const [selectedProps, setSelectedProps] = useState(['Resort', 'Hotel']);
  const [selectedAmenities, setSelectedAmenities] = useState(['Wi-Fi', 'Pool', 'Breakfast']);
  const [freeCancelOnly, setFreeCancelOnly] = useState(true);

  const toggleStar = (s) => {
    if (selectedStars.includes(s)) setSelectedStars(selectedStars.filter(x => x !== s));
    else setSelectedStars([...selectedStars, s]);
  };

  const toggleProp = (p) => {
    if (selectedProps.includes(p)) setSelectedProps(selectedProps.filter(x => x !== p));
    else setSelectedProps([...selectedProps, p]);
  };

  const toggleAmenity = (a) => {
    if (selectedAmenities.includes(a)) setSelectedAmenities(selectedAmenities.filter(x => x !== a));
    else setSelectedAmenities([...selectedAmenities, a]);
  };

  const handleReset = () => {
    setSelectedStars([]);
    setSelectedProps([]);
    setSelectedAmenities([]);
    setFreeCancelOnly(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => onNavigate('hotel-search-results')} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Filter Hotels</Text>
            <Text style={styles.headerSub}>Refine by stars, property type & amenities</Text>
          </View>
          <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
            <RefreshCw size={14} color="#FFFFFF" />
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Star Rating */}
        <Text style={styles.filterTitle}>STAR RATING</Text>
        <View style={styles.chipRow}>
          {starRatings.map((s) => {
            const active = selectedStars.includes(s);
            return (
              <TouchableOpacity
                key={s}
                onPress={() => toggleStar(s)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Star size={12} color={active ? '#FFFFFF' : '#FFD700'} fill="#FFD700" />
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{s} Star</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Property Type */}
        <Text style={styles.filterTitle}>PROPERTY TYPE</Text>
        <View style={styles.chipRow}>
          {propertyTypes.map((p) => {
            const active = selectedProps.includes(p);
            return (
              <TouchableOpacity
                key={p}
                onPress={() => toggleProp(p)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{p}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Amenities */}
        <Text style={styles.filterTitle}>AMENITIES</Text>
        <View style={styles.amenitiesGrid}>
          {amenitiesList.map((a) => {
            const active = selectedAmenities.includes(a);
            return (
              <TouchableOpacity
                key={a}
                onPress={() => toggleAmenity(a)}
                style={styles.checkRow}
              >
                <View style={[styles.checkbox, active && styles.checkboxActive]}>
                  {active && <Check size={12} color="#FFFFFF" />}
                </View>
                <Text style={styles.checkText}>{a}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={handleReset} style={styles.resetOutlineBtn}>
          <Text style={styles.resetOutlineText}>Reset All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onNavigate('hotel-search-results')}
          style={styles.applyBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.applyText}>Apply Filters</Text>
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
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resetText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 80,
  },
  filterTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginTop: 6,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  amenitiesGrid: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  checkText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
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
    gap: 12,
  },
  resetOutlineBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  resetOutlineText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  applyBtn: {
    flex: 2,
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  applyText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
