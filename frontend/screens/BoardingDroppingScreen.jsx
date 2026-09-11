import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, MapPin, Navigation, Clock, AlertTriangle, ArrowRight, Check, ChevronDown, ChevronUp } from 'lucide-react-native';

const boardingPoints = [
  { name: 'Dadar West, Mumbai', time: '8:00 PM', address: 'Near Dadar Station, West Side', landmark: "Next to McDonald's", distance: '850 m', walk: '12 min' },
  { name: 'Sion, Mumbai', time: '8:20 PM', address: 'Sion Circle, Mumbai', landmark: 'Opp. Sion Hospital', distance: '2.1 km', walk: '28 min' },
  { name: 'Kurla, Mumbai', time: '8:40 PM', address: 'LBS Marg, Kurla West', landmark: 'Near Kurla Station (W)', distance: '4.5 km', walk: '~Auto/Taxi' },
];
const droppingPoints = [
  { name: 'Shivajinagar, Pune', time: '11:00 PM', address: 'Near Station Road', landmark: 'Opp. Shivajinagar Court' },
  { name: 'Swargate, Pune', time: '11:15 PM', address: 'Swargate Bus Stand', landmark: 'Main Bus Terminal' },
  { name: 'Hadapsar, Pune', time: '11:40 PM', address: 'Magarpatta Road', landmark: 'Near Magarpatta City' },
];

const PointCard = ({
  type, points, idx, expanded, onToggle, onSelect, color, isBoarding,
}) => {
  const p = points[idx];
  return (
    <View style={styles.card}>
      <View style={[styles.colorTopBar, { backgroundColor: color }]} />
      <View style={styles.cardBody}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardTitleRow}>
            <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
              <MapPin size={16} color={color} />
            </View>
            <Text style={styles.cardTitleText}>{type} Point</Text>
          </View>
          <TouchableOpacity
            onPress={onToggle}
            style={[styles.changeBtn, { borderColor: color + '40', backgroundColor: color + '10' }]}
            activeOpacity={0.7}
          >
            <Text style={[styles.changeBtnText, { color }]}>Change</Text>
            {expanded ? <ChevronUp size={12} color={color} /> : <ChevronDown size={12} color={color} />}
          </TouchableOpacity>
        </View>

        {/* Selected point info */}
        <View style={styles.pointInfoBox}>
          <Text style={styles.pointName}>{p.name}</Text>
          <Text style={[styles.pointTime, { color }]}>{p.time}</Text>
          <Text style={styles.pointSub}>{p.address}</Text>
          <Text style={styles.pointSub}>📍 {p.landmark}</Text>
        </View>

        {/* Distance info (boarding only) */}
        {isBoarding && (
          <View style={styles.distanceRow}>
            <View style={[styles.distBadge, { backgroundColor: '#EFF6FF' }]}>
              <Navigation size={13} color="#2563EB" />
              <View>
                <Text style={[styles.distLabel, { color: '#60A5FA' }]}>Distance</Text>
                <Text style={[styles.distVal, { color: '#1D4ED8' }]}>{p.distance}</Text>
              </View>
            </View>
            <View style={[styles.distBadge, { backgroundColor: '#F0FFF4' }]}>
              <Clock size={13} color="#059669" />
              <View>
                <Text style={[styles.distLabel, { color: '#34D399' }]}>Walking</Text>
                <Text style={[styles.distVal, { color: '#047857' }]}>{p.walk}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.mapsBtn} activeOpacity={0.7}>
              <MapPin size={13} color="#D13239" />
              <Text style={styles.mapsText}>Maps</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Alert */}
        {isBoarding && (
          <View style={styles.alertBox}>
            <AlertTriangle size={13} color="#D97706" />
            <Text style={styles.alertText}>
              ⚠️ Verify boarding point before journey — it may be updated by the operator.
            </Text>
          </View>
        )}

        {/* Dropdown Options */}
        {expanded && (
          <View style={styles.dropdownCol}>
            {points.map((pt, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => onSelect(i)}
                style={[
                  styles.dropdownOption,
                  {
                    backgroundColor: i === idx ? color + '10' : 'transparent',
                    borderColor: i === idx ? color + '30' : 'transparent',
                  },
                ]}
                activeOpacity={0.7}
              >
                <View style={[styles.radioCircle, { borderColor: i === idx ? color : '#D1D5DB' }]}>
                  {i === idx && <View style={[styles.radioInner, { backgroundColor: color }]} />}
                </View>
                <View style={styles.flex1}>
                  <Text style={styles.optionName}>{pt.name}</Text>
                  <Text style={styles.optionSub}>{pt.time} · {pt.address}</Text>
                  {isBoarding && (
                    <Text style={[styles.optionMeta, { color }]}>{pt.distance} · {pt.walk} walk</Text>
                  )}
                </View>
                {i === idx && <Check size={14} color={color} />}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default function BoardingDroppingScreen({ onNavigate, booking, setBooking }) {
  const [boardIdx, setBoardIdx] = useState(0);
  const [dropIdx, setDropIdx] = useState(1);
  const [showBoard, setShowBoard] = useState(false);
  const [showDrop, setShowDrop] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('seat-selection')} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={18} color="#111827" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Boarding & Dropping</Text>
          <Text style={styles.headerSub}>Select your pickup & drop points</Text>
        </View>
      </View>

      {/* Steps indicator */}
      <View style={styles.stepsBar}>
        {['Seat', 'Boarding', 'Passengers', 'Payment'].map((step, i) => (
          <React.Fragment key={step}>
            <View style={styles.stepCol}>
              <View
                style={[
                  styles.stepBadge,
                  {
                    backgroundColor: i <= 1 ? '#D13239' : '#E5E7EB',
                  },
                ]}
              >
                {i < 1 ? (
                  <Check size={12} color="#FFFFFF" strokeWidth={3} />
                ) : (
                  <Text style={[styles.stepNum, { color: i <= 1 ? '#FFFFFF' : '#9CA3AF' }]}>{i + 1}</Text>
                )}
              </View>
              <Text style={[styles.stepLabel, { color: i <= 1 ? '#D13239' : '#9CA3AF' }]}>{step}</Text>
            </View>
            {i < 3 && (
              <View
                style={[
                  styles.stepLine,
                  { backgroundColor: i < 1 ? '#D13239' : '#E5E7EB' },
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <PointCard
          type="Boarding"
          points={boardingPoints}
          idx={boardIdx}
          expanded={showBoard}
          onToggle={() => { setShowBoard(!showBoard); setShowDrop(false); }}
          onSelect={i => { setBoardIdx(i); setShowBoard(false); }}
          color="#22C55E"
          isBoarding={true}
        />
        <PointCard
          type="Dropping"
          points={droppingPoints}
          idx={dropIdx}
          expanded={showDrop}
          onToggle={() => { setShowDrop(!showDrop); setShowBoard(false); }}
          onSelect={i => { setDropIdx(i); setShowDrop(false); }}
          color="#D13239"
          isBoarding={false}
        />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => {
            setBooking({ boardingPoint: boardingPoints[boardIdx].name, droppingPoint: droppingPoints[dropIdx].name });
            onNavigate('passenger-details');
          }}
          style={styles.continueBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.continueBtnText}>CONTINUE</Text>
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
    gap: 12,
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
  colorTopBar: {
    height: 4,
    width: '100%',
  },
  cardBody: {
    padding: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  changeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  changeBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  pointInfoBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  pointName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  pointTime: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  pointSub: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  distanceRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  distBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    padding: 10,
  },
  distLabel: {
    fontSize: 9,
    fontWeight: '600',
  },
  distVal: {
    fontSize: 12,
    fontWeight: '900',
  },
  mapsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#FFF0F0',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FFE0E0',
  },
  mapsText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D13239',
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FEF3C7',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  alertText: {
    flex: 1,
    fontSize: 10,
    color: '#B45309',
    fontWeight: '500',
    lineHeight: 14,
  },
  dropdownCol: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    gap: 8,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  flex1: {
    flex: 1,
  },
  optionName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  optionSub: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  optionMeta: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
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
