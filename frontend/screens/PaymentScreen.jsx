import React, { useState } from 'react';
import bookingService from '../services/bookingService';
import { couponService } from '../services/miscService';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert, TextInput } from 'react-native';
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  Smartphone,
  Building,
  CheckCircle2,
  ChevronRight,
  Leaf,
  Sparkles,
  Tag,
  Trash2,
  Percent,
} from 'lucide-react-native';

const paymentMethods = [
  { id: 'upi', label: 'UPI (Google Pay, PhonePe, Paytm)', Icon: Smartphone, desc: 'Instant 0% Convenience Fee' },
  { id: 'card', label: 'Credit / Debit Card', Icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
  { id: 'wallet', label: 'Wallets & PayLater', Icon: Wallet, desc: 'Paytm, Amazon Pay, Mobikwik' },
  { id: 'netbanking', label: 'Net Banking', Icon: Building, desc: 'SBI, HDFC, ICICI, Axis & All Banks' },
];

const POPULAR_COUPONS = [
  { code: 'WELCOME50', desc: '50% OFF (Max ₹300)', badge: '50% OFF' },
  { code: 'SMARTBUS20', desc: '20% OFF on tickets', badge: '20% OFF' },
  { code: 'MAHA50', desc: 'Flat ₹50 Instant Savings', badge: 'FLAT ₹50' },
  { code: 'FIRSTTRIP', desc: '₹75 OFF first booking', badge: '₹75 OFF' },
];

export default function PaymentScreen({ onNavigate, booking, setBooking }) {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);

  // Advanced Feature 8: Green Travel Coins & Eco-Rewards
  const [redeemCoins, setRedeemCoins] = useState(false);
  const userGreenCoins = 480;
  const coinsDiscount = redeemCoins ? 50 : 0;

  // Coupon / Promo Code State
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(booking.appliedCoupon || (booking.discount ? 'APPLIED' : ''));
  const [couponDiscount, setCouponDiscount] = useState(booking.discount || 0);
  const [couponMsg, setCouponMsg] = useState(null);
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  const bookingType = booking.bookingType || 'bus';
  const rawBase = booking.totalAmount || 1540;
  const taxes = Math.round(rawBase * 0.05);
  const convenienceFee = 25;
  const discount = couponDiscount;
  const finalTotal = Math.max(0, rawBase + taxes + convenienceFee - discount - coinsDiscount);

  const handleApplyCoupon = async (codeToApply) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) {
      setCouponMsg({ type: 'error', text: 'Please enter a coupon code' });
      return;
    }

    setCheckingCoupon(true);
    setCouponMsg(null);

    try {
      let savedAmount = 0;
      // 1. Try Backend Coupon Validator
      try {
        const res = await couponService.validateCoupon({
          code,
          amount: rawBase,
          bookingType,
        });
        if (res?.data?.discount) {
          savedAmount = Number(res.data.discount);
        }
      } catch (backendErr) {
        // Fallback to local promotional matrix
        if (code === 'WELCOME50') {
          savedAmount = Math.min(300, Math.round(rawBase * 0.5));
        } else if (code === 'SMARTBUS20') {
          savedAmount = Math.min(250, Math.round(rawBase * 0.2));
        } else if (code === 'MAHA50') {
          savedAmount = 50;
        } else if (code === 'FIRSTTRIP') {
          savedAmount = 75;
        } else if (code === 'RAIL100') {
          savedAmount = 100;
        } else if (code === 'FLYTRIP1500') {
          savedAmount = Math.min(1500, Math.round(rawBase * 0.1));
        } else if (code === 'STAYGOA15') {
          savedAmount = Math.min(1000, Math.round(rawBase * 0.15));
        } else {
          // Generic valid coupon fallback
          savedAmount = 50;
        }
      }

      if (savedAmount > 0) {
        setAppliedCoupon(code);
        setCouponDiscount(savedAmount);
        setCouponMsg({ type: 'success', text: `Success! Promo code ${code} applied. Saved ₹${savedAmount}!` });
        setBooking({
          ...booking,
          appliedCoupon: code,
          discount: savedAmount,
        });
      } else {
        setCouponMsg({ type: 'error', text: 'Invalid or expired coupon code. Try WELCOME50 or MAHA50' });
      }
    } catch {
      setCouponMsg({ type: 'error', text: 'Could not apply coupon. Please try again.' });
    } finally {
      setCheckingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon('');
    setCouponDiscount(0);
    setCouponInput('');
    setCouponMsg(null);
    setBooking({
      ...booking,
      appliedCoupon: '',
      discount: 0,
    });
  };

  const handlePayNow = async () => {
    setProcessing(true);
    try {
      let backendBookingId = booking.backendBookingId;
      if (!backendBookingId) {
        // Ensure valid passengers list
        const validPassengers = (booking.passengerList && booking.passengerList.length > 0)
          ? booking.passengerList.map((p, idx) => ({
              name: (p && p.name && p.name.trim()) ? p.name.trim() : (idx === 0 ? "Chetan Patil" : `Passenger ${idx + 1}`),
              age: (p && p.age && !isNaN(parseInt(p.age, 10))) ? parseInt(p.age, 10) : 25,
              gender: p.gender || "Male",
              seatNumber: (p && (p.seat || p.seatNumber)) ? String(p.seat || p.seatNumber) : String(idx + 7),
            }))
          : [{ name: "Chetan Patil", age: 24, gender: "Male", seatNumber: "7" }];

        const bookingPayload = {
          bookingType: (bookingType || 'bus').toUpperCase(),
          totalAmount: finalTotal || 750,
          travelDate: booking.date || new Date().toISOString().split('T')[0],
          passengers: validPassengers,
          // Bus specific
          ...(bookingType === 'bus' ? {
            scheduleId: booking.selectedBus?.id || "1563ed8d-dc69-4a20-a42e-1e9ce8868190",
            seatNumbers: (booking.selectedSeats && booking.selectedSeats.length > 0) ? booking.selectedSeats.map(String) : ["7"],
          } : {}),
          // Train specific
          ...(bookingType === 'train' ? {
            scheduleId: booking.selectedTrain?.id || "0059828e-1146-4ba0-a932-46f6de8128a6",
            classCode: booking.trainClass || "3A",
          } : {}),
          // Flight specific
          ...(bookingType === 'flight' ? {
            scheduleId: booking.selectedFlight?.id || "003e416c-5bf4-4204-acd3-c87560e3fd8e",
            seatNumbers: (booking.selectedFlightSeats && booking.selectedFlightSeats.length > 0) ? booking.selectedFlightSeats : ["12A"],
          } : {}),
          // Hotel specific
          ...(bookingType === 'hotel' ? {
            hotelId: booking.selectedHotel?.id || "h-1",
            roomId: booking.selectedRoom?.id || "r-1",
            checkInDate: booking.checkInDate || new Date().toISOString().split('T')[0],
            checkOutDate: booking.checkOutDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
            numberOfRooms: booking.hotelRooms || 1,
            numberOfGuests: booking.hotelGuests || 2,
          } : {}),
        };

        try {
          const bkRes = await bookingService.createBooking(bookingPayload);
          backendBookingId = bkRes?.data?.booking?.id;
        } catch (bkErr) {
          console.warn("Backend booking creation fallback:", bkErr.message);
          backendBookingId = 'ST-BK-' + Math.floor(100000 + Math.random() * 900000);
        }
      }

      let payRef = 'PAY-' + Date.now();
      if (backendBookingId) {
        try {
          const payRes = await bookingService.initiatePayment({
            bookingId: backendBookingId,
            amount: finalTotal,
            method: selectedMethod.toUpperCase(),
          });
          payRef = payRes?.data?.paymentReference || payRef;
          await bookingService.verifyPayment({
            bookingId: backendBookingId,
            paymentReference: payRef,
            status: 'SUCCESS',
          });
        } catch { /* mock gateway clearance */ }
      }

      setBooking({
        paymentMethod: selectedMethod,
        totalAmount: finalTotal,
        backendBookingId,
        paymentReference: payRef,
        greenCoinsUsed: redeemCoins ? 200 : 0,
        greenCoinsEarned: 40,
      });

      if (bookingType === 'train') onNavigate('train-ticket');
      else if (bookingType === 'flight') onNavigate('flight-ticket');
      else if (bookingType === 'hotel') onNavigate('hotel-ticket');
      else onNavigate('booking-confirmation');
    } catch (error) {
      Alert.alert('Payment Failed', error.message || 'Could not process payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => onNavigate('home')} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Review & Payment</Text>
            <Text style={styles.headerSub}>100% Safe Mock Payment Environment</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Booking Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryRoute}>
              {booking.from || 'Mumbai'} ➔ {booking.to || 'Pune'}
            </Text>
            <Text style={styles.summaryType}>{bookingType.toUpperCase()}</Text>
          </View>
          <Text style={styles.summarySub}>
            Travel Date: {booking.date || 'Today'} • {booking.passengers || 1} Passenger(s)
          </Text>
        </View>

        {/* Feature 8: Green Travel Coins Redemption & Rewards Card */}
        <View style={styles.greenCoinsCard}>
          <View style={styles.greenCoinsHeader}>
            <View style={styles.greenIconBox}>
              <Leaf size={18} color="#059669" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.greenTitle}>SmartTrip Green Coins</Text>
              <Text style={styles.greenSub}>
                Your Eco-Balance: <Text style={{ fontWeight: '800', color: '#059669' }}>{userGreenCoins} Coins</Text> (Worth ₹120)
              </Text>
            </View>
          </View>

          {/* Redeem Toggle */}
          <TouchableOpacity
            onPress={() => setRedeemCoins(!redeemCoins)}
            style={[styles.redeemRow, redeemCoins && styles.redeemRowActive]}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, redeemCoins && styles.checkboxActive]}>
              {redeemCoins && <CheckCircle2 size={16} color="#FFFFFF" />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.redeemText, redeemCoins && styles.redeemTextActive]}>
                Redeem 200 Green Coins (Save Flat ₹50)
              </Text>
              <Text style={styles.redeemSub}>Instant deduction on this booking</Text>
            </View>
            <Text style={styles.redeemSavings}>-₹50</Text>
          </TouchableOpacity>

          <View style={styles.ecoEarnFootnote}>
            <Sparkles size={13} color="#D97706" />
            <Text style={styles.ecoEarnText}>
              🌱 You will earn <Text style={{ fontWeight: '800' }}>+40 Green Coins</Text> and save 8.4 kg CO2 on this trip!
            </Text>
          </View>
        </View>

        {/* Feature: Offers, Coupons & Promo Codes */}
        <View style={styles.couponCard}>
          <View style={styles.couponHeader}>
            <View style={styles.couponIconBox}>
              <Tag size={17} color="#D13239" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.couponTitle}>Apply Coupon / Promo Code</Text>
              <Text style={styles.couponSubtitle}>Save instant money on your journey</Text>
            </View>
          </View>

          {appliedCoupon ? (
            /* Applied State */
            <View style={styles.appliedBanner}>
              <View style={styles.appliedLeft}>
                <CheckCircle2 size={18} color="#16A34A" />
                <View style={{ marginLeft: 8 }}>
                  <View style={styles.appliedBadgeRow}>
                    <Text style={styles.appliedCode}>{appliedCoupon}</Text>
                    <Text style={styles.appliedSaveText}>₹{couponDiscount} Saved</Text>
                  </View>
                  <Text style={styles.appliedDesc}>Promo discount applied to your final fare</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleRemoveCoupon}
                style={styles.removeCouponBtn}
                activeOpacity={0.7}
              >
                <Trash2 size={14} color="#EF4444" />
                <Text style={styles.removeCouponText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Input & Popular Chips State */
            <View>
              <View style={styles.couponInputRow}>
                <TextInput
                  style={styles.couponInput}
                  placeholder="Enter code (e.g. WELCOME50)"
                  placeholderTextColor="#94A3B8"
                  value={couponInput}
                  onChangeText={(text) => {
                    setCouponInput(text.toUpperCase());
                    if (couponMsg) setCouponMsg(null);
                  }}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => handleApplyCoupon()}
                  disabled={checkingCoupon || !couponInput.trim()}
                  style={[
                    styles.applyBtn,
                    (!couponInput.trim() || checkingCoupon) && styles.applyBtnDisabled,
                  ]}
                  activeOpacity={0.8}
                >
                  {checkingCoupon ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.applyBtnText}>APPLY</Text>
                  )}
                </TouchableOpacity>
              </View>

              {couponMsg && (
                <Text
                  style={[
                    styles.couponMsgText,
                    couponMsg.type === 'error' ? styles.couponMsgErr : styles.couponMsgOk,
                  ]}
                >
                  {couponMsg.text}
                </Text>
              )}

              {/* Popular Coupons Chips */}
              <Text style={styles.popularHeading}>POPULAR DEALS & COUPONS</Text>
              <View style={styles.chipsScroll}>
                {POPULAR_COUPONS.map((c) => (
                  <TouchableOpacity
                    key={c.code}
                    onPress={() => {
                      setCouponInput(c.code);
                      handleApplyCoupon(c.code);
                    }}
                    style={styles.couponChip}
                    activeOpacity={0.7}
                  >
                    <View style={styles.chipTop}>
                      <Text style={styles.chipCode}>{c.code}</Text>
                      <View style={styles.chipBadge}>
                        <Text style={styles.chipBadgeText}>{c.badge}</Text>
                      </View>
                    </View>
                    <Text style={styles.chipDesc}>{c.desc}</Text>
                    <Text style={styles.chipTap}>Tap to Apply ➔</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Payment Methods */}
        <Text style={styles.sectionTitle}>SELECT PAYMENT METHOD</Text>
        <View style={styles.methodsList}>
          {paymentMethods.map((m) => {
            const isSelected = selectedMethod === m.id;
            const IconComponent = m.Icon;
            return (
              <TouchableOpacity
                key={m.id}
                onPress={() => setSelectedMethod(m.id)}
                style={[styles.methodCard, isSelected && styles.methodCardSelected]}
                activeOpacity={0.8}
              >
                <View style={[styles.methodIconBox, isSelected && styles.methodIconBoxSelected]}>
                  <IconComponent size={20} color={isSelected ? '#D13239' : '#4B5563'} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.methodLabel, isSelected && styles.methodLabelSelected]}>
                    {m.label}
                  </Text>
                  <Text style={styles.methodDesc}>{m.desc}</Text>
                </View>
                <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Fare Transparency Breakdown */}
        <View style={styles.breakdownCard}>
          <Text style={styles.sectionTitle}>FARES & PRICE TRANSPARENCY</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Base Fare</Text>
            <Text style={styles.priceVal}>₹{rawBase}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>GST & Govt Charges (5%)</Text>
            <Text style={styles.priceVal}>₹{taxes}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>SmartTrip Platform Fee</Text>
            <Text style={styles.priceVal}>₹{convenienceFee}</Text>
          </View>
          {discount > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.discLabel}>
                Promo Discount {appliedCoupon ? `(${appliedCoupon})` : ''}
              </Text>
              <Text style={styles.discVal}>-₹{discount}</Text>
            </View>
          )}
          {redeemCoins && (
            <View style={styles.priceRow}>
              <Text style={[styles.discLabel, { color: '#059669' }]}>🌿 Green Coins Discount</Text>
              <Text style={[styles.discVal, { color: '#059669' }]}>-₹50</Text>
            </View>
          )}

          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Payable Amount</Text>
            <Text style={styles.totalVal}>₹{finalTotal}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Payment Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Final Amount</Text>
          <Text style={styles.bottomPrice}>₹{finalTotal}</Text>
          {discount > 0 && (
            <Text style={{ fontSize: 10, color: '#D13239', fontWeight: '800' }}>
              ✓ ₹{discount} Coupon Applied
            </Text>
          )}
          {redeemCoins && (
            <Text style={{ fontSize: 10, color: '#059669', fontWeight: '700' }}>
              ✓ ₹50 Green Savings Applied
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={handlePayNow}
          disabled={processing}
          style={styles.payBtn}
          activeOpacity={0.8}
        >
          {processing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.payBtnText}>Pay & Confirm Ticket</Text>
              <ChevronRight size={16} color="#FFFFFF" />
            </>
          )}
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
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 110,
    maxWidth: 620,
    width: '100%',
    alignSelf: 'center',
  },
  /* Coupon & Promo Code */
  couponCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  couponHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  couponIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  couponSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  couponInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  couponInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  applyBtn: {
    height: 44,
    paddingHorizontal: 16,
    backgroundColor: '#D13239',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  couponMsgText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: -4,
  },
  couponMsgErr: {
    color: '#EF4444',
  },
  couponMsgOk: {
    color: '#16A34A',
  },
  appliedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    padding: 12,
  },
  appliedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appliedBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appliedCode: {
    fontSize: 13,
    fontWeight: '900',
    color: '#15803D',
    letterSpacing: 0.5,
  },
  appliedSaveText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16A34A',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  appliedDesc: {
    fontSize: 10,
    color: '#166534',
    marginTop: 2,
  },
  removeCouponBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  removeCouponText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  popularHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginTop: 4,
    marginBottom: 4,
  },
  chipsScroll: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  couponChip: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 8,
    minWidth: 130,
    flex: 1,
  },
  chipTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  chipCode: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  chipBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  chipBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#D13239',
  },
  chipDesc: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 2,
  },
  chipTap: {
    fontSize: 9,
    fontWeight: '700',
    color: '#D13239',
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryRoute: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  summaryType: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D13239',
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  summarySub: {
    fontSize: 12,
    color: '#6B7280',
  },
  /* Green Coins Card */
  greenCoinsCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 12,
  },
  greenCoinsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  greenIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greenTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
  },
  greenSub: {
    fontSize: 11,
    color: '#047857',
    marginTop: 1,
  },
  redeemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  redeemRowActive: {
    borderColor: '#059669',
    backgroundColor: '#F0FDF4',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  redeemText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  redeemTextActive: {
    color: '#065F46',
    fontWeight: '800',
  },
  redeemSub: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 1,
  },
  redeemSavings: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
  },
  ecoEarnFootnote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ecoEarnText: {
    fontSize: 11,
    color: '#047857',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.5,
    marginVertical: 4,
  },
  methodsList: {
    gap: 10,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  methodCardSelected: {
    borderColor: '#D13239',
    backgroundColor: '#FFFBFB',
  },
  methodIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodIconBoxSelected: {
    backgroundColor: '#FFF0F0',
  },
  methodLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  methodLabelSelected: {
    color: '#D13239',
  },
  methodDesc: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#D13239',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D13239',
  },
  breakdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  priceLabel: {
    fontSize: 12,
    color: '#4B5563',
  },
  priceVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  discLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  discVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    marginTop: 6,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  totalVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#D13239',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  bottomLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '700',
  },
  bottomPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#D13239',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
  },
  payBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
