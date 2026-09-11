import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, User, UserPlus, Edit3, Trash2 } from 'lucide-react-native';

const initial = [
  { name: 'Rohit Patil', gender: 'Male', age: 25 },
  { name: 'Sanket Patil', gender: 'Male', age: 23 },
  { name: 'Priya Patil', gender: 'Female', age: 22 },
];

export default function SavedPassengersScreen({ onNavigate }) {
  const [passengers, setPassengers] = useState(initial);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('profile')} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Saved Passengers</Text>
          <Text style={styles.headerSub}>{passengers.length} travellers saved</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {passengers.map((p, i) => (
          <View key={i} style={styles.card}>
            <View
              style={[
                styles.cardTopStrip,
                { backgroundColor: p.gender === 'Female' ? '#F472B6' : '#3B82F6' },
              ]}
            />
            <View style={styles.cardBody}>
              <View
                style={[
                  styles.avatarBox,
                  { backgroundColor: p.gender === 'Female' ? '#FCE7F3' : '#EFF6FF' },
                ]}
              >
                <User size={28} color={p.gender === 'Female' ? '#EC4899' : '#3B82F6'} />
              </View>
              <View style={styles.flex1}>
                <Text style={styles.pName}>{p.name}</Text>
                <View style={styles.badgeRow}>
                  <View
                    style={[
                      styles.genderBadge,
                      { backgroundColor: p.gender === 'Female' ? '#FCE7F3' : '#EFF6FF' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.genderText,
                        { color: p.gender === 'Female' ? '#EC4899' : '#3B82F6' },
                      ]}
                    >
                      {p.gender}
                    </Text>
                  </View>
                  <Text style={styles.ageText}>· {p.age} Yrs</Text>
                </View>
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.editBtn} activeOpacity={0.7}>
                  <Edit3 size={15} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setPassengers(prev => prev.filter((_, pi) => pi !== i))}
                  style={styles.deleteBtn}
                  activeOpacity={0.7}
                >
                  <Trash2 size={15} color="#D13239" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity
          onPress={() => setPassengers(prev => [...prev, { name: 'New Passenger', gender: 'Male', age: 25 }])}
          style={styles.addBtn}
          activeOpacity={0.7}
        >
          <UserPlus size={18} color="#6B7280" />
          <Text style={styles.addBtnText}>ADD NEW PASSENGER</Text>
        </TouchableOpacity>
      </ScrollView>
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
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  scrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
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
  cardTopStrip: {
    height: 3,
    width: '100%',
  },
  cardBody: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBox: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex1: {
    flex: 1,
  },
  pName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  genderBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  genderText: {
    fontSize: 10,
    fontWeight: '700',
  },
  ageText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    justifyContent: 'center',
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
});
