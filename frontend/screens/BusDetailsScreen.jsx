import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, Star, Clock, Wifi, Zap, Droplets, Lightbulb, Wind, MapPin, ChevronRight, ShieldCheck, TrendingUp, CheckCircle2, User } from 'lucide-react-native';

const amenities = [
  { Icon: Wifi, label: 'Wi-Fi', color: '#2563EB' },
  { Icon: Zap, label: 'Charging', color: '#D97706' },
  { Icon: Droplets, label: 'Water', color: '#0EA5E9' },
  { Icon: Lightbulb, label: 'Reading Light', color: '#F59E0B' },
  { Icon: Wind, label: 'Blanket', color: '#8B5CF6' },
];

const reviews = [
  { name: 'Rahul M.', rating: 5, text: 'Very comfortable journey. Bus was on time and staff was helpful.', verified: true },
  { name: 'Priya S.', rating: 4, text: 'Clean bus, good AC. Boarding point was easy to find.', verified: true },
  { name: 'Amit K.', rating: 4, text: 'Smooth ride. Slight delay at start but reached on time.', verified: true },
];

export default function BusDetailsScreen({ onNavigate, booking }) {
  const bus = booking.selectedBus;
  const [activeTab, setActiveTab] = useState('details');

  if (!bus) return null;

  return (
    <View style={styles.container}>
      {/* Hero */}
      <View style={styles.heroGradient}>
        <View style={styles.heroIconBox}>
          <Text style={{ fontSize: 72 }}>🚌</Text>
        </View>
        <TouchableOpacity onPress={() => onNavigate('search-results')} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.heroFooter}>
          <View>
            <Text style={styles.operatorTitle}>{bus.operator}</Text>
            <Text style={styles.busTypeSub}>{bus.type}</Text>
          </View>
          <View style={styles.ratingBox}>
            <Star size={12} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingVal}>{bus.rating}</Text>
          </View>
        </View>
      </View>

      {/* SmartBus Score Bar */}
      <View style={styles.scoreBar}>
        {[
          { Icon: ShieldCheck, label: `${bus.score}/5`, sub: 'SmartBus Score', color: '#D13239' },
          { Icon: TrendingUp, label: `${bus.onTime}%`, sub: 'On-Time', color: '#059669' },
          { Icon: CheckCircle2, label: `${bus.bookingAccuracy}%`, sub: 'Accuracy', color: '#2563EB' },
        ].map(({ Icon, label, sub, color }) => (
          <View key={sub} style={styles.scoreCol}>
            <View style={styles.scoreRow}>
              <Icon size={13} color={color} />
              <Text style={styles.scoreLabel}>{label}</Text>
            </View>
            <Text style={styles.scoreSub}>{sub}</Text>
          </View>
        ))}
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {['details', 'reviews'].map(t => (
          <TouchableOpacity
            key={t}
            onPress={() => setActiveTab(t)}
            style={styles.tabBtn}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, { color: activeTab === t ? '#D13239' : '#9CA3AF' }]}>
              {t === 'reviews' ? 'Reviews (3)' : 'Details'}
            </Text>
            {activeTab === t && <View style={styles.tabActiveLine} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'details' ? (
          <View style={styles.gap12}>
            {/* Route Card */}
            <View style={styles.card}>
              <View style={styles.routeHeader}>
                <View style={styles.alignCenter}>
                  <Text style={styles.timeTitle}>{bus.departure}</Text>
                  <Text style={styles.cityText}>{bus.from}</Text>
                </View>
                <View style={styles.durationCol}>
                  <View style={styles.durationRow}>
                    <Clock size={11} color="#9CA3AF" />
                    <Text style={styles.durationText}>{bus.duration}</Text>
                  </View>
                  <View style={styles.timelineRow}>
                    <View style={[styles.dot, { backgroundColor: '#22C55E' }]} />
                    <View style={styles.dashLine} />
                    <Text style={{ fontSize: 14 }}>🚌</Text>
                    <View style={styles.dashLine} />
                    <View style={[styles.dot, { backgroundColor: '#D13239' }]} />
                  </View>
                  <Text style={styles.nonStopText}>Non-stop</Text>
                </View>
                <View style={styles.alignCenter}>
                  <Text style={styles.timeTitle}>{bus.arrival}</Text>
                  <Text style={styles.cityText}>{bus.to}</Text>
                </View>
              </View>
            </View>

            {/* Amenities */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Amenities</Text>
              <View style={styles.amenitiesGrid}>
                {amenities.map(({ Icon, label, color }) => (
                  <View key={label} style={styles.amenityItem}>
                    <View style={[styles.amenityIconBox, { backgroundColor: color + '15' }]}>
                      <Icon size={22} color={color} />
                    </View>
                    <Text style={styles.amenityLabel}>{label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Boarding */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Boarding Points</Text>
              {[
                { name: 'Dadar West', time: '08:00 PM', addr: 'Near Station, West Side' },
                { name: 'Sion', time: '08:20 PM', addr: 'Sion Circle, Mumbai' },
                { name: 'Kurla', time: '08:40 PM', addr: 'LBS Marg, Kurla West' },
              ].map((p, i) => (
                <View key={i} style={styles.pointRow}>
                  <View style={[styles.pointIconBox, { backgroundColor: '#F0FDF4' }]}>
                    <MapPin size={14} color="#22C55E" />
                  </View>
                  <View style={styles.flex1}>
                    <Text style={styles.pointName}>{p.name}</Text>
                    <Text style={styles.pointAddr}>{p.addr}</Text>
                  </View>
                  <Text style={styles.pointTime}>{p.time}</Text>
                </View>
              ))}
            </View>

            {/* Dropping */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Dropping Points</Text>
              {[
                { name: 'Shivajinagar', time: '11:00 PM', addr: 'Near Station Road' },
                { name: 'Swargate', time: '11:15 PM', addr: 'Swargate Bus Stand' },
                { name: 'Hadapsar', time: '11:40 PM', addr: 'Magarpatta Road' },
              ].map((p, i) => (
                <View key={i} style={styles.pointRow}>
                  <View style={[styles.pointIconBox, { backgroundColor: '#FFF0F0' }]}>
                    <MapPin size={14} color="#D13239" />
                  </View>
                  <View style={styles.flex1}>
                    <Text style={styles.pointName}>{p.name}</Text>
                    <Text style={styles.pointAddr}>{p.addr}</Text>
                  </View>
                  <Text style={styles.pointTime}>{p.time}</Text>
                </View>
              ))}
            </View>

            {/* Cancellation Policy */}
            <View style={styles.cancelPolicyBox}>
              <Text style={styles.cancelTitle}>Cancellation Policy</Text>
              <Text style={styles.cancelText}>
                ✓ Free cancellation up to 6 hrs before departure{'\n'}
                • 50% refund up to 2 hrs before{'\n'}
                • No refund within 2 hrs of departure
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.gap12}>
            {reviews.map((r, i) => (
              <View key={i} style={styles.card}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewAvatar}>
                    <User size={18} color="#9CA3AF" />
                  </View>
                  <View style={styles.flex1}>
                    <View style={styles.reviewUserRow}>
                      <Text style={styles.reviewName}>{r.name}</Text>
                      {r.verified && (
                        <View style={styles.verifiedBadge}>
                          <CheckCircle2 size={10} color="#16A34A" />
                          <Text style={styles.verifiedText}>Verified</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.starsRow}>
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star
                          key={si}
                          size={10}
                          color={si < r.rating ? '#F59E0B' : '#E5E7EB'}
                          fill={si < r.rating ? '#F59E0B' : '#E5E7EB'}
                        />
                      ))}
                    </View>
                  </View>
                </View>
                <Text style={styles.reviewBody}>{r.text}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.startingFrom}>Starting from</Text>
          <Text style={styles.priceVal}>₹{bus.price}</Text>
          <Text style={styles.perSeat}>per seat</Text>
        </View>
        <TouchableOpacity
          onPress={() => onNavigate('seat-selection')}
          style={styles.selectSeatBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.selectSeatText}>SELECT SEAT</Text>
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
  heroGradient: {
    height: 208,
    backgroundColor: '#1E3A5F',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroIconBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 20,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroFooter: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  operatorTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  busTypeSub: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scoreBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
  },
  scoreCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
  },
  scoreSub: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    position: 'relative',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  tabActiveLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#D13239',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  gap12: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alignCenter: {
    alignItems: 'center',
  },
  timeTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
  },
  cityText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  durationCol: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
    gap: 4,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dashLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  nonStopText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  amenityItem: {
    alignItems: 'center',
    gap: 6,
  },
  amenityIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenityLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  pointIconBox: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex1: {
    flex: 1,
  },
  pointName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  pointAddr: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  pointTime: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  cancelPolicyBox: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FEF3C7',
    borderRadius: 24,
    padding: 20,
  },
  cancelTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 8,
  },
  cancelText: {
    fontSize: 12,
    color: '#B45309',
    lineHeight: 18,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#15803D',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  reviewBody: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  startingFrom: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  priceVal: {
    fontSize: 24,
    fontWeight: '900',
    color: '#D13239',
  },
  perSeat: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  selectSeatBtn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#D13239',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectSeatText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
