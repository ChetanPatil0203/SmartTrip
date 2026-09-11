import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import BottomNav from '../components/BottomNav';
import { ArrowLeft, Tag, Copy, Check, Bus, Train, Plane, Building2, ChevronRight, Gift } from 'lucide-react-native';
import { offerService } from '../services/miscService';

const categoryOffers = [
  {
    id: 'OFF-1',
    category: 'bus',
    title: 'Flat 20% OFF on Bus Bookings',
    code: 'SMARTBUS20',
    discount: '20% OFF',
    validity: 'Valid till 30 Jun 2024',
    minBooking: '₹500',
    terms: 'Applicable on all intercity AC & Sleeper bus bookings.',
    color: '#D13239',
    bg: '#FFF0F0',
  },
  {
    id: 'OFF-2',
    category: 'train',
    title: 'Flat ₹100 Cashback on Train Tickets',
    code: 'RAIL100',
    discount: '₹100 OFF',
    validity: 'Valid till 15 Jul 2024',
    minBooking: '₹800',
    terms: 'Valid on 3A, 2A, 1A & Executive Chair Car bookings.',
    color: '#2563EB',
    bg: '#EFF6FF',
  },
  {
    id: 'OFF-3',
    category: 'flight',
    title: 'Save Up to ₹1,500 on Flight Bookings',
    code: 'FLYTRIP1500',
    discount: 'Up to ₹1,500',
    validity: 'Valid till 31 Jul 2024',
    minBooking: '₹3,500',
    terms: 'Valid on all domestic airline non-stop flights.',
    color: '#0284C7',
    bg: '#F0F9FF',
  },
  {
    id: 'OFF-4',
    category: 'hotel',
    title: 'Extra 15% OFF on Luxury Hotels & Resorts',
    code: 'STAYGOA15',
    discount: '15% OFF',
    validity: 'Valid till 10 Aug 2024',
    minBooking: '₹2,500',
    terms: 'Applicable on 4-star and 5-star hotel property stays.',
    color: '#059669',
    bg: '#ECFDF5',
  },
];

export default function OffersScreen({ onNavigate }) {
  const [selectedCat, setSelectedCat] = useState('all');
  const [copiedCode, setCopiedCode] = useState(null);
  const [apiOffers, setApiOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    offerService.getOffers({ limit: 50 })
      .then(res => {
        const offers = res?.data?.offers || [];
        if (offers.length > 0) {
          // Map backend offers to UI shape
          const mapped = offers.map(o => ({
            id: o.id,
            category: (o.travelType || 'all').toLowerCase(),
            title: o.title,
            code: o.couponCode || '',
            discount: o.discountType === 'PERCENTAGE' ? `${o.discountValue}% OFF` : `₹${o.discountValue} OFF`,
            validity: o.validUntil ? `Valid till ${new Date(o.validUntil).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}` : 'Limited time',
            minBooking: o.minBookingAmount ? `₹${o.minBookingAmount}` : 'No minimum',
            terms: o.description || '',
            color: '#D13239',
            bg: '#FFF0F0',
          }));
          setApiOffers(mapped);
        } else {
          setApiOffers(categoryOffers);
        }
      })
      .catch(() => setApiOffers(categoryOffers))
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = (code) => {
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredOffers = apiOffers.filter(o => selectedCat === 'all' || o.category === selectedCat);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => onNavigate('home')} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Offers & Promo Codes</Text>
            <Text style={styles.headerSub}>Exclusive discounts across Bus, Train, Flight & Hotel</Text>
          </View>
        </View>
      </View>

      {/* Category Tabs */}
      <View style={styles.catBar}>
        {['all', 'bus', 'train', 'flight', 'hotel'].map((c) => {
          const active = selectedCat === c;
          return (
            <TouchableOpacity
              key={c}
              onPress={() => setSelectedCat(c)}
              style={[styles.catTab, active && styles.catTabActive]}
            >
              <Text style={[styles.catTabText, active && styles.catTabTextActive]}>
                {c === 'all' ? 'All Offers' : c.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredOffers.map((offer) => (
          <View key={offer.id} style={styles.offerCard}>
            <View style={[styles.cardHeader, { backgroundColor: offer.bg }]}>
              <View style={styles.badgeRow}>
                <View style={[styles.discBadge, { backgroundColor: offer.color }]}>
                  <Text style={styles.discBadgeText}>{offer.discount}</Text>
                </View>
                <Text style={styles.validityText}>{offer.validity}</Text>
              </View>
              <Text style={styles.offerTitle}>{offer.title}</Text>
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.termsText}>• {offer.terms}</Text>
              <Text style={styles.minBookingText}>• Min Booking Amount: {offer.minBooking}</Text>

              {/* Coupon Box */}
              <View style={styles.couponBox}>
                <View>
                  <Text style={styles.codeLabel}>PROMO CODE</Text>
                  <Text style={styles.codeText}>{offer.code}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleCopy(offer.code)}
                  style={[styles.copyBtn, { backgroundColor: copiedCode === offer.code ? '#10B981' : offer.color }]}
                  activeOpacity={0.8}
                >
                  {copiedCode === offer.code ? (
                    <Check size={14} color="#FFFFFF" />
                  ) : (
                    <Copy size={14} color="#FFFFFF" />
                  )}
                  <Text style={styles.copyBtnText}>
                    {copiedCode === offer.code ? 'COPIED' : 'COPY CODE'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <BottomNav current="offers" onNavigate={onNavigate} />
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
    backgroundColor: '#D13239',
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
  },
  catBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  catTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  catTabActive: {
    backgroundColor: '#D13239',
  },
  catTabText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
  },
  catTabTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 90,
  },
  offerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 3,
  },
  cardHeader: {
    padding: 14,
    gap: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  discBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  validityText: {
    fontSize: 10,
    color: '#64748B',
  },
  offerTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  cardBody: {
    padding: 14,
    gap: 6,
  },
  termsText: {
    fontSize: 11,
    color: '#64748B',
  },
  minBookingText: {
    fontSize: 11,
    color: '#64748B',
  },
  couponBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 6,
  },
  codeLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  codeText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  copyBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
});
