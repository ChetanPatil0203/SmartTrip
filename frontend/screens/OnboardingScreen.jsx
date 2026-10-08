import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  useWindowDimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { Bus, MapPin, Star } from 'lucide-react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

// Custom SmartTrip Airplane Logo Icon with speed wings
const SmartTripPlaneIcon = () => (
  <Svg width={30} height={30} viewBox="0 0 32 32" fill="none">
    {/* Upper speed streak */}
    <Path
      d="M4 14H10"
      stroke="#D13239"
      strokeWidth={2}
      strokeLinecap="round"
    />
    {/* Lower speed streak */}
    <Path
      d="M2 19H8"
      stroke="#D13239"
      strokeWidth={2}
      strokeLinecap="round"
    />
    {/* Dynamic taking-off airplane */}
    <Path
      d="M9 16L18 8L20 9L15 15H27C28.6 15 29.5 16 27 17H15L20 23L18 24L9 16Z"
      fill="#D13239"
    />
  </Svg>
);

// Curved wave swoosh at the bottom of the hero image
const HeroBottomWave = ({ accentColor }) => (
  <View style={styles.waveWrapper} pointerEvents="none">
    <Svg width="100%" height={38} viewBox="0 0 360 38" preserveAspectRatio="none">
      {/* Background colored accent wave swoosh */}
      <Path
        d="M0 8 Q 90 34, 180 18 T 360 28 L 360 38 L 0 38 Z"
        fill={accentColor}
        opacity={0.88}
      />
      {/* Foreground crisp white wave blending with screen */}
      <Path
        d="M0 16 Q 110 38, 200 20 T 360 32 L 360 38 L 0 38 Z"
        fill="#FFFFFF"
      />
    </Svg>
  </View>
);

// Subtle travel-themed decorative footer details
const BottomTravelDecor = ({ accentColor }) => (
  <View style={styles.decorContainer} pointerEvents="none">
    <Svg width="100%" height={42} viewBox="0 0 360 42" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id="decorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={accentColor} stopOpacity="0" />
          <Stop offset="100%" stopColor={accentColor} stopOpacity="0.08" />
        </LinearGradient>
      </Defs>

      {/* Subtle bottom gradient tint */}
      <Path d="M0 10 Q 180 0 360 10 L 360 42 L 0 42 Z" fill="url(#decorGrad)" />

      {/* Dotted travel route curve */}
      <Path
        d="M 36 20 Q 95 34, 170 18 T 300 26"
        fill="none"
        stroke={accentColor}
        strokeWidth={1.4}
        strokeDasharray="4, 5"
        strokeOpacity={0.4}
      />

      {/* Left location pin mark */}
      <Circle cx={36} cy={16} r={4.5} fill={accentColor} opacity={0.65} />
      <Circle cx={36} cy={16} r={2} fill="#FFFFFF" />

      {/* Right mini vehicle silhouette */}
      <Path
        d="M 302 24 C 302 22, 305 20, 308 20 H 322 C 324 20, 326 22, 326 24 V 31 H 302 Z"
        fill={accentColor}
        opacity={0.25}
      />
      <Circle cx={308} cy={31} r={2.5} fill={accentColor} opacity={0.45} />
      <Circle cx={320} cy={31} r={2.5} fill={accentColor} opacity={0.45} />
    </Svg>
  </View>
);

const slides = [
  {
    id: 1,
    image: require('../assets/onboarding_bus.jpg'),
    icon: Bus,
    iconColor: '#D13239',
    iconBg: '#FEE2E2',
    highlightWord: 'Bus',
    titlePrefix: 'Easy ',
    titleSuffix: ' Booking',
    desc: 'Book tickets in seconds, choose your seat and travel comfortably across hundreds of routes.',
    accent: '#D13239',
    swooshColor: '#D13239',
    buttonText: 'Next →',
    hasTrackingOverlay: false,
    hasRatingOverlay: false,
  },
  {
    id: 2,
    image: require('../assets/onboarding_tracking.jpg'),
    icon: MapPin,
    iconColor: '#2563EB',
    iconBg: '#DBEAFE',
    highlightWord: 'Bus',
    titlePrefix: 'Live ',
    titleSuffix: ' Tracking',
    desc: 'Track your bus in real-time. Get notified about delays, arrivals and route updates instantly.',
    accent: '#2563EB',
    swooshColor: '#D13239', // SmartTrip red brand swoosh
    buttonText: 'Next →',
    hasTrackingOverlay: true,
    hasRatingOverlay: false,
  },
  {
    id: 3,
    image: require('../assets/onboarding_operators.jpg'),
    icon: Star,
    iconColor: '#16A34A',
    iconBg: '#DCFCE7',
    highlightWord: 'Rated',
    titlePrefix: 'Top ',
    titleSuffix: ' Operators',
    desc: 'Choose from premium, verified bus operators with genuine traveller ratings and reviews.',
    accent: '#16A34A',
    swooshColor: '#D13239', // SmartTrip red brand swoosh
    buttonText: 'Get Started →',
    hasTrackingOverlay: false,
    hasRatingOverlay: true,
  },
];

export default function OnboardingScreen({ onNavigate }) {
  const [page, setPage] = useState(0);
  const { height: windowHeight } = useWindowDimensions();

  const slide = slides[page];
  const IconComponent = slide.icon;

  // Adaptive hero height based on viewport
  const heroHeight = Math.min(Math.max(windowHeight * 0.34, 230), 285);

  const handleNext = () => {
    if (page < slides.length - 1) {
      setPage(prev => prev + 1);
    } else {
      onNavigate('login');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* TOP BRAND HEADER */}
      <View style={styles.topHeader}>
        <View style={styles.brandRow}>
          <SmartTripPlaneIcon />
          <View style={styles.brandTextContainer}>
            <View style={styles.brandTitleRow}>
              <Text style={styles.brandTitleDark}>Smart</Text>
              <Text style={styles.brandTitleRed}>Trip</Text>
            </View>
            <Text style={styles.brandTagline}>One App. Every Journey.</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => onNavigate('login')}
          style={styles.skipBtn}
          activeOpacity={0.65}
          accessibilityLabel="Skip Onboarding"
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* HERO VISUAL CONTAINER */}
      <View style={[styles.heroCard, { height: heroHeight }]}>
        <ImageBackground
          source={slide.image}
          style={styles.heroImage}
          resizeMode="cover"
        >
          {/* SCREEN 2: Floating Live Tracking Badges */}
          {slide.hasTrackingOverlay && (
            <>
              {/* Top-Right: ● Live Tracking Badge */}
              <View style={styles.liveTrackingPill}>
                <View style={styles.livePulseDot} />
                <Text style={styles.liveTrackingText}>Live Tracking</Text>
              </View>

              {/* Bottom Info Card: Bus KA-12-AB-1234 */}
              <View style={styles.busInfoCard}>
                <Text style={styles.busNumberText}>Bus  KA-12-AB-1234</Text>
                <View style={styles.statusRow}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>On Time  •  2h 15m left</Text>
                </View>
              </View>
            </>
          )}

          {/* SCREEN 3: Floating ★ 4.8 Rating Card */}
          {slide.hasRatingOverlay && (
            <View style={styles.ratingCard}>
              <View style={styles.ratingRow}>
                <Text style={styles.ratingStar}>★</Text>
                <Text style={styles.ratingScore}>4.8</Text>
              </View>
              <Text style={styles.ratingLabel}>Top Rated Operators</Text>
            </View>
          )}

          {/* Wave Swoosh at the base of the image */}
          <HeroBottomWave accentColor={slide.swooshColor} />
        </ImageBackground>
      </View>

      {/* CENTER FEATURE HIGHLIGHT */}
      <View style={styles.centerSection}>
        {/* Circular feature icon with tinted background */}
        <View style={[styles.iconCircle, { backgroundColor: slide.iconBg }]}>
          <IconComponent
            size={32}
            color={slide.iconColor}
            strokeWidth={2.2}
          />
        </View>

        {/* Feature Title with highlighted keyword */}
        <Text style={styles.featureTitle}>
          {slide.titlePrefix}
          <Text style={{ color: slide.iconColor }}>{slide.highlightWord}</Text>
          {slide.titleSuffix}
        </Text>

        {/* Descriptive sentence */}
        <Text style={styles.featureDesc}>{slide.desc}</Text>
      </View>

      {/* BOTTOM SECTION: PROGRESS INDICATOR + CTA + DECOR */}
      <View style={styles.bottomSection}>
        {/* Step Indicator (Active pill + Inactive dots) */}
        <View style={styles.indicatorRow}>
          {slides.map((s, index) => {
            const isActive = index === page;
            return (
              <TouchableOpacity
                key={s.id}
                onPress={() => setPage(index)}
                activeOpacity={0.7}
                style={[
                  styles.indicatorDot,
                  isActive
                    ? [styles.indicatorActive, { backgroundColor: slide.accent }]
                    : styles.indicatorInactive,
                ]}
              />
            );
          })}
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.88}
          style={[styles.primaryBtn, { backgroundColor: slide.accent }]}
        >
          <Text style={styles.primaryBtnText}>{slide.buttonText}</Text>
        </TouchableOpacity>
      </View>

      {/* SUBTLE TRAVEL-THEMED BOTTOM DECOR */}
      <BottomTravelDecor accentColor={slide.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },

  /* TOP SECTION */
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 48,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTextContainer: {
    justifyContent: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitleDark: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  brandTitleRed: {
    fontSize: 20,
    fontWeight: '900',
    color: '#D13239',
    letterSpacing: -0.4,
  },
  brandTagline: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: -1,
  },
  skipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },

  /* HERO CONTAINER */
  heroCard: {
    marginHorizontal: 16,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  heroImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  waveWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 38,
  },

  /* SCREEN 2 FLOATING BADGES */
  liveTrackingPill: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    gap: 6,
  },
  livePulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  liveTrackingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  busInfoCard: {
    position: 'absolute',
    bottom: 30,
    left: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 5,
  },
  busNumberText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
  },

  /* SCREEN 3 FLOATING BADGES */
  ratingCard: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  ratingStar: {
    fontSize: 15,
    color: '#EF4444',
  },
  ratingScore: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  ratingLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },

  /* CENTER SECTION */
  centerSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 4,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  featureTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  featureDesc: {
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: 8,
  },

  /* BOTTOM SECTION */
  bottomSection: {
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 16,
    marginBottom: 6,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  indicatorDot: {
    height: 6,
    borderRadius: 3,
  },
  indicatorActive: {
    width: 26,
  },
  indicatorInactive: {
    width: 7,
    backgroundColor: '#E2E8F0',
  },
  primaryBtn: {
    width: '100%',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  /* TRAVEL FOOTER DECOR */
  decorContainer: {
    width: '100%',
    height: 42,
    marginTop: -4,
  },
});
