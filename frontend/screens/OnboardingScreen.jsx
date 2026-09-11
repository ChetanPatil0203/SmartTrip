import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowRight, Bus, MapPin, Star } from 'lucide-react-native';

const slides = [
  {
    Icon: Bus,
    title: 'Easy Bus Booking',
    desc: 'Book tickets in seconds, choose your seat and travel comfortably across hundreds of routes.',
    accent: '#D13239',
    bgColor: '#FFF5F5',
    iconBg: '#FFF0F0',
  },
  {
    Icon: MapPin,
    title: 'Live Bus Tracking',
    desc: 'Track your bus in real-time. Get notified about delays, arrivals and route updates instantly.',
    accent: '#2563EB',
    bgColor: '#EFF6FF',
    iconBg: '#EFF6FF',
  },
  {
    Icon: Star,
    title: 'Top Rated Operators',
    desc: 'Choose from premium, verified bus operators with genuine traveller ratings and reviews.',
    accent: '#059669',
    bgColor: '#F0FFF4',
    iconBg: '#F0FFF4',
  },
];

export default function OnboardingScreen({ onNavigate }) {
  const [page, setPage] = useState(0);
  const slide = slides[page];
  const { Icon } = slide;

  return (
    <View style={[styles.container, { backgroundColor: slide.bgColor }]}>
      {/* Skip button */}
      <View style={styles.topRow}>
        <TouchableOpacity
          onPress={() => onNavigate('login')}
          style={[styles.skipBtn, { backgroundColor: slide.iconBg }]}
          activeOpacity={0.7}
        >
          <Text style={[styles.skipText, { color: slide.accent }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Illustration & text */}
      <View style={styles.centerContent}>
        <View style={styles.outerCircle}>
          <View style={[styles.innerCircle, { backgroundColor: slide.accent + '18' }]}>
            <Icon size={72} color={slide.accent} strokeWidth={1.2} />
          </View>
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.desc}>{slide.desc}</Text>
        </View>
      </View>

      {/* Dots + Next button */}
      <View style={styles.bottomBlock}>
        <View style={styles.dotsRow}>
          {slides.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setPage(i)}
              style={[
                styles.dot,
                {
                  width: i === page ? 28 : 8,
                  backgroundColor: i === page ? slide.accent : '#D1D5DB',
                },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={() => (page < slides.length - 1 ? setPage(p => p + 1) : onNavigate('login'))}
          style={[styles.nextBtn, { backgroundColor: slide.accent }]}
          activeOpacity={0.8}
        >
          <Text style={styles.nextBtnText}>
            {page < slides.length - 1 ? 'Next' : 'Get Started'}
          </Text>
          <ArrowRight size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topRow: {
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
  },
  skipBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 40,
  },
  outerCircle: {
    width: 208,
    height: 208,
    borderRadius: 104,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  innerCircle: {
    width: 144,
    height: 144,
    borderRadius: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  desc: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  bottomBlock: {
    alignItems: 'center',
    gap: 32,
    paddingBottom: 56,
    paddingHorizontal: 32,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
