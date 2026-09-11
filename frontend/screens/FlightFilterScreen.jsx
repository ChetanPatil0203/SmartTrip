import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, Check, RefreshCw, Plane, Sun, Sunrise, Sunset, Moon } from 'lucide-react-native';

const stopsOptions = ['Non-stop', '1 Stop', '2+ Stops'];

const departureSlots = [
  { id: 'early', label: 'Early Morning', time: '00:00 - 06:00', Icon: Sunrise },
  { id: 'morning', label: 'Morning', time: '06:00 - 12:00', Icon: Sun },
  { id: 'afternoon', label: 'Afternoon', time: '12:00 - 18:00', Icon: Sunset },
  { id: 'night', label: 'Night', time: '18:00 - 00:00', Icon: Moon },
];

const airlinesList = ['SmartAir', 'IndigoSky', 'AirVistara', 'SpiceFly', 'AirIndia'];

export default function FlightFilterScreen({ onNavigate }) {
  const [selectedStops, setSelectedStops] = useState(['Non-stop']);
  const [selectedSlots, setSelectedSlots] = useState(['morning']);
  const [selectedAirlines, setSelectedAirlines] = useState(['SmartAir', 'IndigoSky']);

  const toggleStop = (stop) => {
    if (selectedStops.includes(stop)) {
      setSelectedStops(selectedStops.filter(s => s !== stop));
    } else {
      setSelectedStops([...selectedStops, stop]);
    }
  };

  const toggleSlot = (id) => {
    if (selectedSlots.includes(id)) {
      setSelectedSlots(selectedSlots.filter(s => s !== id));
    } else {
      setSelectedSlots([...selectedSlots, id]);
    }
  };

  const toggleAirline = (air) => {
    if (selectedAirlines.includes(air)) {
      setSelectedAirlines(selectedAirlines.filter(a => a !== air));
    } else {
      setSelectedAirlines([...selectedAirlines, air]);
    }
  };

  const handleReset = () => {
    setSelectedStops([]);
    setSelectedSlots([]);
    setSelectedAirlines([]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => onNavigate('flight-search-results')} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Filter Flights</Text>
            <Text style={styles.headerSub}>Refine by price, stops & timing</Text>
          </View>
          <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
            <RefreshCw size={14} color="#FFFFFF" />
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Stops Filter */}
        <Text style={styles.filterGroupTitle}>NUMBER OF STOPS</Text>
        <View style={styles.optionsRow}>
          {stopsOptions.map((stop) => {
            const active = selectedStops.includes(stop);
            return (
              <TouchableOpacity
                key={stop}
                onPress={() => toggleStop(stop)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{stop}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Departure Time Slots */}
        <Text style={styles.filterGroupTitle}>DEPARTURE TIME</Text>
        <View style={styles.timeGrid}>
          {departureSlots.map((slot) => {
            const active = selectedSlots.includes(slot.id);
            const IconComp = slot.Icon;
            return (
              <TouchableOpacity
                key={slot.id}
                onPress={() => toggleSlot(slot.id)}
                style={[styles.slotCard, active && styles.slotCardActive]}
              >
                <IconComp size={18} color={active ? '#0284C7' : '#64748B'} />
                <Text style={[styles.slotLabel, active && styles.slotLabelActive]}>{slot.label}</Text>
                <Text style={styles.slotTime}>{slot.time}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Airlines Filter */}
        <Text style={styles.filterGroupTitle}>PREFERRED AIRLINES</Text>
        <View style={styles.airlinesList}>
          {airlinesList.map((air) => {
            const active = selectedAirlines.includes(air);
            return (
              <TouchableOpacity
                key={air}
                onPress={() => toggleAirline(air)}
                style={styles.airlineCheckRow}
              >
                <View style={[styles.checkbox, active && styles.checkboxActive]}>
                  {active && <Check size={12} color="#FFFFFF" />}
                </View>
                <Text style={styles.airlineText}>{air}</Text>
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
          onPress={() => onNavigate('flight-search-results')}
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
    gap: 16,
    paddingBottom: 80,
  },
  filterGroupTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginTop: 6,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slotCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  slotCardActive: {
    borderColor: '#0284C7',
    backgroundColor: '#F0F9FF',
  },
  slotLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  slotLabelActive: {
    color: '#0284C7',
  },
  slotTime: {
    fontSize: 10,
    color: '#64748B',
  },
  airlinesList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  airlineCheckRow: {
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
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  airlineText: {
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
    backgroundColor: '#0284C7',
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
