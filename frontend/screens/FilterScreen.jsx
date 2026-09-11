import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, Check, RotateCcw } from 'lucide-react-native';

export default function FilterScreen({ onNavigate }) {
  const [busTypes, setBusTypes] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [maxPrice, setMaxPrice] = useState(3000);

  const toggle = (arr, setArr, val) => {
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const Chip = ({ label, active, onClick }) => (
    <TouchableOpacity
      onPress={onClick}
      style={[
        styles.chip,
        {
          borderColor: active ? '#D13239' : '#E5E7EB',
          backgroundColor: active ? '#D13239' : '#FFFFFF',
        },
      ]}
      activeOpacity={0.7}
    >
      {active && <Check size={11} color="#FFFFFF" strokeWidth={3} />}
      <Text style={[styles.chipText, { color: active ? '#FFFFFF' : '#6B7280' }]}>{label}</Text>
    </TouchableOpacity>
  );

  const Section = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('search-results')} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filter Buses</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Section title="Bus Type">
          <View style={styles.chipRow}>
            {['AC', 'Non-AC', 'Sleeper', 'Seater', 'Volvo', 'Semi-Sleeper'].map(t => (
              <Chip key={t} label={t} active={busTypes.includes(t)} onClick={() => toggle(busTypes, setBusTypes, t)} />
            ))}
          </View>
        </Section>

        <Section title="Price Range">
          <View style={styles.priceRow}>
            <Text style={styles.priceMin}>₹500</Text>
            <Text style={styles.priceCurrent}>Up to ₹{maxPrice.toLocaleString()}</Text>
            <Text style={styles.priceMin}>₹3000</Text>
          </View>
          <View style={styles.sliderTrack}>
            <View
              style={[
                styles.sliderFill,
                { width: `${((maxPrice - 500) / 2500) * 100}%` },
              ]}
            />
          </View>
          <View style={styles.sliderBtns}>
            {[1000, 1800, 2500, 3000].map(val => (
              <TouchableOpacity key={val} onPress={() => setMaxPrice(val)} style={styles.presetBtn}>
                <Text style={styles.presetText}>₹{val}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        <Section title="Ratings">
          <View style={styles.ratingList}>
            {['4★ & above', '3★ & above', '2★ & above'].map(r => (
              <TouchableOpacity
                key={r}
                onPress={() => toggle(ratings, setRatings, r)}
                style={styles.checkboxRow}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: ratings.includes(r) ? '#D13239' : '#D1D5DB',
                      backgroundColor: ratings.includes(r) ? '#D13239' : 'transparent',
                    },
                  ]}
                >
                  {ratings.includes(r) && <Check size={11} color="#FFFFFF" strokeWidth={3} />}
                </View>
                <Text style={styles.checkboxText}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        <Section title="Departure Time">
          <View style={styles.timeGrid}>
            {[
              { label: 'Morning', icon: '🌅', time: '6-12 AM' },
              { label: 'Afternoon', icon: '☀️', time: '12-6 PM' },
              { label: 'Evening', icon: '🌆', time: '6-10 PM' },
              { label: 'Night', icon: '🌙', time: '10 PM+' },
            ].map(t => (
              <TouchableOpacity key={t.label} style={styles.timeCard} activeOpacity={0.7}>
                <Text style={{ fontSize: 20 }}>{t.icon}</Text>
                <Text style={styles.timeLabel}>{t.label}</Text>
                <Text style={styles.timeSub}>{t.time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>
      </ScrollView>

      {/* Footer bar */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => { setBusTypes([]); setRatings([]); setMaxPrice(3000); }}
          style={styles.resetBtn}
          activeOpacity={0.8}
        >
          <RotateCcw size={15} color="#D13239" />
          <Text style={styles.resetBtnText}>RESET</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onNavigate('search-results')}
          style={styles.applyBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.applyBtnText}>APPLY FILTERS</Text>
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
    backgroundColor: '#D13239',
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
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 100,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceMin: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  priceCurrent: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D13239',
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    position: 'relative',
  },
  sliderFill: {
    height: 6,
    backgroundColor: '#D13239',
    borderRadius: 3,
  },
  sliderBtns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  presetBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  presetText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4B5563',
  },
  ratingList: {
    gap: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 4,
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  timeSub: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: '#D13239',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D13239',
  },
  applyBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#D13239',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
