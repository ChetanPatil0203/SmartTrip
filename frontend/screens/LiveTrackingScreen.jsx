import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Vibration,
  Linking,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import {
  ArrowLeft,
  Share2,
  MapPin,
  Clock,
  AlertTriangle,
  Phone,
  X,
  BellRing,
  Volume2,
  CheckCircle2,
  Navigation,
  Compass,
  Radio,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  Gauge,
  Thermometer,
  ShieldAlert,
} from 'lucide-react-native';
import bookingService from '../services/bookingService';
import busService from '../services/busService';

// Dynamic stop generator based on source & destination
const getStopsForRoute = (from = 'Jalgaon', to = 'Pune') => {
  const f = (from || 'Jalgaon').toLowerCase();
  const t = (to || 'Pune').toLowerCase();

  if (f.includes('jalgaon') && t.includes('pune')) {
    return [
      { name: 'Akashwani Chowk, Jalgaon', time: '09:30 PM', done: true, distance: '0 km' },
      { name: 'Dhule Highway Bypass', time: '11:15 PM', done: true, distance: '90 km' },
      { name: 'Malegaon Phata (Food Hub)', time: '12:45 AM', done: true, distance: '150 km' },
      { name: 'Chh. Sambhajinagar Phata', time: '02:30 AM', done: false, current: true, distance: '235 km' },
      { name: 'Ahmednagar Bypass Flyover', time: '04:45 AM', done: false, distance: '315 km' },
      { name: 'Wakad Bridge / Swargate, Pune', time: '06:30 AM', done: false, isDestination: true, distance: '385 km' },
    ];
  }
  if (f.includes('jalgaon') && t.includes('nashik')) {
    return [
      { name: 'Akashwani Chowk, Jalgaon', time: '07:00 AM', done: true, distance: '0 km' },
      { name: 'Erandol Bypass', time: '07:45 AM', done: true, distance: '32 km' },
      { name: 'Dhule Gurudwara Chowk', time: '09:15 AM', done: true, distance: '90 km' },
      { name: 'Malegaon Toll Plaza', time: '10:15 AM', done: false, current: true, distance: '145 km' },
      { name: 'Chandwad Ghat View', time: '11:00 AM', done: false, distance: '190 km' },
      { name: 'Dwarka Circle, Nashik', time: '11:30 AM', done: false, isDestination: true, distance: '245 km' },
    ];
  }
  if (f.includes('jalgaon') && t.includes('mumbai')) {
    return [
      { name: 'Old B.J. Market, Jalgaon', time: '08:30 PM', done: true, distance: '0 km' },
      { name: 'Dhule Bypass (NH-3 / NH-6)', time: '10:15 PM', done: true, distance: '90 km' },
      { name: 'Nashik Dwarka Flyover', time: '01:30 AM', done: false, current: true, distance: '245 km' },
      { name: 'Kasara Ghat / Igatpuri', time: '03:15 AM', done: false, distance: '320 km' },
      { name: 'Thane Teen Hath Naka', time: '04:45 AM', done: false, distance: '385 km' },
      { name: 'Dadar Asiad Stand, Mumbai', time: '05:30 AM', done: false, isDestination: true, distance: '415 km' },
    ];
  }
  // Default / Mumbai -> Pune
  return [
    { name: `${from || 'Mumbai'} Boarding Stand`, time: '08:00 PM', done: true, distance: '0 km' },
    { name: 'Vashi Highway Toll Plaza', time: '09:00 PM', done: true, distance: '38 km' },
    { name: 'Lonavala Expressway Ghat', time: '10:15 PM', done: false, current: true, distance: '95 km' },
    { name: `${to || 'Pune'} Drop Terminal`, time: '11:15 PM', done: false, isDestination: true, distance: '150 km' },
  ];
};

export default function LiveTrackingScreen({ onNavigate, booking = {} }) {
  const fromCity = booking.from || 'Jalgaon';
  const toCity = booking.to || 'Pune';
  const pnr = booking.pnr || booking.bookingReference || 'ST89421034';
  const operatorName = booking.selectedBus?.operator || 'MSRTC Shivneri';
  const busNumber = booking.selectedBus?.busNumber || 'MH-19-SS-1001';
  const boardingPoint = booking.boardingPoint || (fromCity.includes('Jalgaon') ? 'Akashwani Chowk, Jalgaon' : 'Dadar West');

  const [progress, setProgress] = useState(58);
  const [speed, setSpeed] = useState(68);
  const [activeTab, setActiveTab] = useState('radar'); // 'radar' | 'timeline'
  const [delayInfo, setDelayInfo] = useState({
    title: 'On Time (वेळेवर)',
    sub: 'Bus is running on scheduled speed via NH Highway',
    isDelayed: false,
  });
  const [eta, setEta] = useState(booking.selectedBus?.arrival || '06:30 AM');
  const stops = getStopsForRoute(fromCity, toCity);
  const currentStop = stops.find((s) => s.current) || stops[2];
  const destinationStop = stops.find((s) => s.isDestination) || stops[stops.length - 1];

  // Proximity Wake-Up Alarm State
  const [alarmEnabled, setAlarmEnabled] = useState(true);
  const [alarmMinutes, setAlarmMinutes] = useState(15);
  const [alarmRingingModal, setAlarmRingingModal] = useState(false);
  const [shareSuccessToast, setShareSuccessToast] = useState(false);

  // Radar sweep animation
  const radarAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Rotating radar beam
    Animated.loop(
      Animated.timing(radarAnim, {
        toValue: 1,
        duration: 3500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulse effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Live speed & progress drift simulation
    const interval = setInterval(() => {
      setProgress((p) => (p >= 75 ? 58 : p + 0.3));
      setSpeed(64 + Math.floor(Math.random() * 8));
    }, 1800);

    return () => clearInterval(interval);
  }, [radarAnim, pulseAnim]);

  useEffect(() => {
    const bId = booking.backendBookingId || booking.id;
    if (bId) {
      bookingService
        .getBookingTracking(bId)
        .then((res) => {
          const trk = res?.data?.tracking;
          if (trk?.eta) setEta(trk.eta);
          if (trk?.status) {
            setDelayInfo({
              title: trk.status === 'DELAYED' ? 'Bus Delayed' : 'On Time (वेळेवर)',
              sub: trk.delayMinutes ? `Delayed by ${trk.delayMinutes} mins` : 'Running on schedule',
              isDelayed: trk.status === 'DELAYED',
            });
          }
        })
        .catch(() => {});
    } else if (booking.selectedBus?.id) {
      busService
        .getLiveTracking(booking.selectedBus.id)
        .then((res) => {
          const trk = res?.data?.tracking;
          if (trk?.eta) setEta(trk.eta);
        })
        .catch(() => {});
    }
  }, [booking]);

  const spin = radarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const triggerTestAlarm = () => {
    try {
      Vibration.vibrate([500, 300, 500, 300]);
    } catch {}
    setAlarmRingingModal(true);
  };

  // Open Boarding point in Google Maps
  const openBoardingInGoogleMaps = () => {
    const q = encodeURIComponent(`${boardingPoint}, Maharashtra`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`).catch(() => {});
  };

  // Share Live Radar link directly to WhatsApp
  const shareLiveTrackingWhatsApp = async () => {
    const shareText =
      `📡 *SmartTrip Live Bus Radar*\n\n` +
      `🚌 *Bus:* ${operatorName} (${busNumber})\n` +
      `📍 *Route:* ${fromCity} ➔ ${toCity}\n` +
      `⏱️ *Current Status:* En Route near ${currentStop.name} (${speed} km/h)\n` +
      `🏁 *Next Stop ETA:* ${eta}\n` +
      `📌 *PNR:* ${pnr}\n\n` +
      `🔴 Track live on GPS Radar:\n` +
      `https://smarttrip.in/radar/${pnr}`;

    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    try {
      await Linking.openURL(waUrl);
    } catch {
      setShareSuccessToast(true);
      setTimeout(() => setShareSuccessToast(false), 3000);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => onNavigate('my-trips')} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.headerTitle}>Live GPS Radar</Text>
              <View style={styles.livePill}>
                <View style={styles.livePillDot} />
                <Text style={styles.livePillText}>LIVE</Text>
              </View>
            </View>
            <Text style={styles.headerSub}>
              {fromCity} ➔ {toCity} · PNR: {pnr}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={shareLiveTrackingWhatsApp} style={styles.shareBtn} activeOpacity={0.7}>
          <Share2 size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab('radar')}
          style={[styles.tabBtn, activeTab === 'radar' && styles.tabBtnActive]}
          activeOpacity={0.8}
        >
          <Radio size={14} color={activeTab === 'radar' ? '#FFFFFF' : '#64748B'} />
          <Text style={[styles.tabText, activeTab === 'radar' && styles.tabTextActive]}>
            GPS Radar & Map
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('timeline')}
          style={[styles.tabBtn, activeTab === 'timeline' && styles.tabBtnActive]}
          activeOpacity={0.8}
        >
          <Clock size={14} color={activeTab === 'timeline' ? '#FFFFFF' : '#64748B'} />
          <Text style={[styles.tabText, activeTab === 'timeline' && styles.tabTextActive]}>
            Route Milestones
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* RADAR VIEW */}
        {activeTab === 'radar' && (
          <>
            {/* Visual High-Tech Satellite Radar Card */}
            <View style={styles.radarCard}>
              {/* Radar Map Canvas */}
              <View style={styles.radarCanvas}>
                {/* Concentric Radar Circles */}
                <View style={[styles.radarRing, { width: 260, height: 260, borderRadius: 130 }]} />
                <View style={[styles.radarRing, { width: 180, height: 180, borderRadius: 90 }]} />
                <View style={[styles.radarRing, { width: 100, height: 100, borderRadius: 50 }]} />

                {/* Radar Grid Axes */}
                <View style={styles.radarAxisH} />
                <View style={styles.radarAxisV} />

                {/* Rotating Radar Sweep Line */}
                <Animated.View style={[styles.radarSweepBeam, { transform: [{ rotate: spin }] }]} />

                {/* Route Path Polyline (Highway Curved Track) */}
                <View style={styles.highwayRouteLine} />

                {/* Start Station Pin */}
                <View style={styles.startPin}>
                  <View style={styles.pinCircleStart}>
                    <MapPin size={10} color="#FFFFFF" />
                  </View>
                  <Text style={styles.pinTextStart}>{fromCity}</Text>
                </View>

                {/* Live Bus Moving Marker */}
                <Animated.View
                  style={[
                    styles.liveBusPin,
                    {
                      left: `${progress}%`,
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                >
                  <View style={styles.busGlowHalo} />
                  <View style={styles.busPinCircle}>
                    <Text style={{ fontSize: 16 }}>🚌</Text>
                  </View>
                  <View style={styles.busSpeedBadge}>
                    <Text style={styles.busSpeedText}>{speed} KM/H</Text>
                  </View>
                </Animated.View>

                {/* Destination Pin */}
                <View style={styles.destPin}>
                  <View style={styles.pinCircleDest}>
                    <CheckCircle2 size={10} color="#FFFFFF" />
                  </View>
                  <Text style={styles.pinTextDest}>{toCity}</Text>
                </View>

                {/* Current Location Legend on Map */}
                <View style={styles.radarLocationHud}>
                  <Text style={styles.hudSub}>CURRENT POSITION (लाइव्ह स्थान):</Text>
                  <Text style={styles.hudTitle}>
                    Near {currentStop.name}
                  </Text>
                </View>
              </View>

              {/* Telemetry Status Strip */}
              <View style={styles.telemetryBar}>
                <View style={styles.telemetryItem}>
                  <Gauge size={13} color="#10B981" />
                  <Text style={styles.telemetryVal}>{speed} km/h</Text>
                  <Text style={styles.telemetryLabel}>Cruising Speed</Text>
                </View>
                <View style={styles.telemetryDivider} />
                <View style={styles.telemetryItem}>
                  <Thermometer size={13} color="#38BDF8" />
                  <Text style={styles.telemetryVal}>21.5°C</Text>
                  <Text style={styles.telemetryLabel}>Cabin AC</Text>
                </View>
                <View style={styles.telemetryDivider} />
                <View style={styles.telemetryItem}>
                  <Radio size={13} color="#F59E0B" />
                  <Text style={styles.telemetryVal}>OBD-II 3D</Text>
                  <Text style={styles.telemetryLabel}>GPS Precision</Text>
                </View>
              </View>
            </View>

            {/* Distance to User's Boarding Stop Card */}
            <View style={styles.boardingRadarCard}>
              <View style={styles.boardingIconBox}>
                <Navigation size={18} color="#D13239" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.boardingTitle}>Your Boarding Point Distance</Text>
                <Text style={styles.boardingSub} numberOfLines={1}>
                  {boardingPoint}
                </Text>
                <View style={styles.distanceBadgeRow}>
                  <Text style={styles.distanceHighlight}>📍 2.4 KM Away</Text>
                  <Text style={styles.distanceWalkTime}>· ~7 min by auto</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={openBoardingInGoogleMaps}
                style={styles.mapsBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.mapsBtnText}>Open Maps</Text>
                <ExternalLink size={12} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Verified Driver & Bus Details */}
            <View style={styles.driverCard}>
              <View style={styles.driverLeft}>
                <View style={styles.driverAvatar}>
                  <Text style={{ fontSize: 20 }}>👨‍✈️</Text>
                  <View style={styles.driverVerifiedBadge}>
                    <ShieldCheck size={10} color="#FFFFFF" />
                  </View>
                </View>
                <View>
                  <Text style={styles.driverName}>Rameshwar Patil</Text>
                  <Text style={styles.driverExp}>⭐ 4.9 · 12 Yrs Exp · Police Verified</Text>
                  <Text style={styles.driverBusNo}>{busNumber} · {operatorName}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => Linking.openURL('tel:+919822012345')}
                style={styles.callDriverBtn}
                activeOpacity={0.8}
              >
                <Phone size={14} color="#FFFFFF" />
                <Text style={styles.callDriverText}>Call</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* TIMELINE VIEW */}
        {activeTab === 'timeline' && (
          <View style={styles.card}>
            <View style={styles.routeHeaderRow}>
              <Text style={styles.cardTitle}>Live Route Milestones</Text>
              <View style={styles.etaBadge}>
                <Clock size={13} color="#9CA3AF" />
                <Text style={styles.etaText}>ETA: {eta}</Text>
              </View>
            </View>

            <View style={styles.timelineList}>
              {stops.map((stop, i) => (
                <View key={i} style={styles.stopRow}>
                  <View style={styles.stopTimelineCol}>
                    <View
                      style={[
                        styles.stopIconBox,
                        {
                          backgroundColor: stop.done
                            ? '#059669'
                            : stop.current
                            ? '#D13239'
                            : '#F3F4F6',
                        },
                      ]}
                    >
                      {stop.done ? (
                        <CheckCircle2 size={13} color="#FFFFFF" />
                      ) : stop.current ? (
                        <Text style={{ fontSize: 11 }}>🚌</Text>
                      ) : (
                        <MapPin size={13} color="#9CA3AF" />
                      )}
                    </View>
                    {i < stops.length - 1 && (
                      <View
                        style={[
                          styles.timelineLine,
                          { backgroundColor: stop.done ? '#059669' : '#E5E7EB' },
                        ]}
                      />
                    )}
                  </View>
                  <View style={styles.stopTextCol}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text
                        style={[
                          styles.stopName,
                          {
                            color: stop.current ? '#D13239' : stop.done ? '#1F2937' : '#9CA3AF',
                            fontWeight: stop.current ? '800' : '600',
                          },
                        ]}
                      >
                        {stop.name}
                      </Text>
                      <Text style={styles.stopDistance}>{stop.distance}</Text>
                    </View>
                    <Text style={styles.stopTime}>
                      {stop.time} {stop.current ? '• Live Bus Here' : ''} {stop.isDestination ? '🚩 Final Stop' : ''}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Feature: Destination Proximity Wake-Up Alarm Card */}
        <View style={styles.alarmCard}>
          <View style={styles.alarmHeaderRow}>
            <View style={styles.alarmIconCircle}>
              <BellRing size={20} color="#D13239" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.alarmTitle}>Destination Wake-Up Alarm</Text>
                <TouchableOpacity
                  onPress={() => setAlarmEnabled(!alarmEnabled)}
                  style={[styles.toggleBtn, alarmEnabled ? styles.toggleOn : styles.toggleOff]}
                  activeOpacity={0.8}
                >
                  <View style={[styles.toggleThumb, alarmEnabled && styles.toggleThumbOn]} />
                </TouchableOpacity>
              </View>
              <Text style={styles.alarmSub}>
                Wake up before reaching {destinationStop.name} so you never sleep past your stop.
              </Text>
            </View>
          </View>

          {alarmEnabled && (
            <View style={styles.alarmConfigBox}>
              <View style={styles.alarmIntervalRow}>
                <Text style={styles.alarmIntervalLabel}>RING ALARM BEFORE:</Text>
                <View style={styles.alarmChipsRow}>
                  {[10, 15, 30].map((mins) => (
                    <TouchableOpacity
                      key={mins}
                      onPress={() => setAlarmMinutes(mins)}
                      style={[styles.alarmChip, alarmMinutes === mins && styles.alarmChipActive]}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.alarmChipText,
                          alarmMinutes === mins && styles.alarmChipTextActive,
                        ]}
                      >
                        {mins} Mins
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Active Alarm Badge */}
              <View style={styles.alarmStatusBanner}>
                <CheckCircle2 size={15} color="#059669" />
                <Text style={styles.alarmStatusText}>
                  Armed: Will wake you {alarmMinutes} mins before {destinationStop.name}
                </Text>
              </View>

              {/* Test Sound button */}
              <TouchableOpacity
                onPress={triggerTestAlarm}
                style={styles.testAlarmBtn}
                activeOpacity={0.8}
              >
                <Volume2 size={14} color="#D13239" />
                <Text style={styles.testAlarmBtnText}>Test Alarm Ringtone & Vibration</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Delay Status Card */}
        <View style={[styles.delayCard, !delayInfo.isDelayed && { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
          <View style={[styles.delayIconBox, !delayInfo.isDelayed && { backgroundColor: '#D1FAE5' }]}>
            <AlertTriangle size={16} color={delayInfo.isDelayed ? '#D97706' : '#059669'} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.delayTitle, !delayInfo.isDelayed && { color: '#065F46' }]}>
              {delayInfo.title}
            </Text>
            <Text style={[styles.delaySub, !delayInfo.isDelayed && { color: '#047857' }]}>
              {delayInfo.sub}
            </Text>
          </View>
        </View>

        {/* WhatsApp Live Tracking Share Button */}
        <TouchableOpacity
          onPress={shareLiveTrackingWhatsApp}
          style={styles.whatsappRadarBtn}
          activeOpacity={0.85}
        >
          <Text style={{ fontSize: 18 }}>🟢</Text>
          <Text style={styles.whatsappRadarBtnText}>Share Live GPS Tracking on WhatsApp</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Alarm Ringing Overlay Modal */}
      <Modal
        visible={alarmRingingModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAlarmRingingModal(false)}
      >
        <View style={styles.alarmModalOverlay}>
          <View style={styles.alarmModalBox}>
            <View style={styles.alarmModalIcon}>
              <BellRing size={36} color="#FFFFFF" />
            </View>
            <Text style={styles.alarmModalTitle}>WAKE UP! ⏰</Text>
            <Text style={styles.alarmModalDestination}>
              Approaching {destinationStop.name}
            </Text>
            <Text style={styles.alarmModalSub}>
              Your stop is approximately {alarmMinutes} minutes away. Please prepare your luggage and check your seat.
            </Text>

            <View style={styles.alarmModalBtnCol}>
              <TouchableOpacity
                onPress={() => setAlarmRingingModal(false)}
                style={styles.dismissAlarmBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.dismissAlarmText}>I'm Awake / Dismiss Alarm</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setAlarmRingingModal(false);
                  setTimeout(() => setAlarmRingingModal(true), 5000);
                }}
                style={styles.snoozeBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.snoozeBtnText}>Snooze (5 Minutes)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1120',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
    backgroundColor: '#DC2626',
    borderRadius: 6,
  },
  livePillDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FFFFFF',
  },
  livePillText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#0F172A',
    gap: 10,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#1E293B',
  },
  tabBtnActive: {
    backgroundColor: '#DC2626',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 36,
  },
  radarCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
    overflow: 'hidden',
  },
  radarCanvas: {
    height: 220,
    backgroundColor: '#060B14',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  radarRing: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.12)',
  },
  radarAxisH: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
  },
  radarAxisV: {
    position: 'absolute',
    height: '100%',
    width: 1,
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
  },
  radarSweepBeam: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderRightWidth: 2,
    borderRightColor: 'rgba(56, 189, 248, 0.45)',
  },
  highwayRouteLine: {
    position: 'absolute',
    left: 40,
    right: 40,
    height: 4,
    backgroundColor: '#1E293B',
    borderRadius: 2,
  },
  startPin: {
    position: 'absolute',
    left: 20,
    top: 90,
    alignItems: 'center',
  },
  pinCircleStart: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinTextStart: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 4,
  },
  destPin: {
    position: 'absolute',
    right: 20,
    top: 90,
    alignItems: 'center',
  },
  pinCircleDest: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinTextDest: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 4,
  },
  liveBusPin: {
    position: 'absolute',
    top: 75,
    alignItems: 'center',
    marginLeft: -20,
  },
  busGlowHalo: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(220, 38, 38, 0.25)',
    top: -2,
  },
  busPinCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 8,
  },
  busSpeedBadge: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#38BDF8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  busSpeedText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#38BDF8',
    letterSpacing: 0.2,
  },
  radarLocationHud: {
    position: 'absolute',
    bottom: 12,
    left: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  hudSub: {
    fontSize: 8,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.5,
  },
  hudTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 1,
  },
  telemetryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  telemetryItem: {
    alignItems: 'center',
    gap: 2,
  },
  telemetryVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  telemetryLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  telemetryDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#1E293B',
  },
  boardingRadarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  boardingIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardingTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  boardingSub: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  distanceBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  distanceHighlight: {
    fontSize: 11,
    fontWeight: '800',
    color: '#38BDF8',
  },
  distanceWalkTime: {
    fontSize: 11,
    color: '#64748B',
  },
  mapsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DC2626',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  mapsBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  driverLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  driverVerifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  driverExp: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  driverBusNo: {
    fontSize: 11,
    fontWeight: '600',
    color: '#38BDF8',
    marginTop: 2,
  },
  callDriverBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  callDriverText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  routeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  etaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
  },
  timelineList: {
    gap: 12,
  },
  stopRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stopTimelineCol: {
    alignItems: 'center',
    width: 26,
  },
  stopIconBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 20,
    marginVertical: 4,
  },
  stopTextCol: {
    flex: 1,
    paddingTop: 2,
  },
  stopName: {
    fontSize: 13,
  },
  stopDistance: {
    fontSize: 11,
    color: '#64748B',
  },
  stopTime: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  alarmCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#1E293B',
  },
  alarmHeaderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  alarmIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alarmTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  alarmSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 15,
  },
  toggleBtn: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  toggleOn: {
    backgroundColor: '#DC2626',
  },
  toggleOff: {
    backgroundColor: '#334155',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },
  alarmConfigBox: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    gap: 10,
  },
  alarmIntervalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alarmIntervalLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
  },
  alarmChipsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  alarmChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
  },
  alarmChipActive: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  alarmChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  alarmChipTextActive: {
    color: '#FFFFFF',
  },
  alarmStatusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  alarmStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34D399',
  },
  testAlarmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.3)',
  },
  testAlarmBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F87171',
  },
  delayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  delayIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  delayTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  delaySub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  whatsappRadarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#15803D',
    paddingVertical: 14,
    borderRadius: 14,
    elevation: 4,
  },
  whatsappRadarBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  alarmModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  alarmModalBox: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  alarmModalIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  alarmModalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#DC2626',
    letterSpacing: -0.5,
  },
  alarmModalDestination: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 6,
  },
  alarmModalSub: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginVertical: 14,
    lineHeight: 18,
  },
  alarmModalBtnCol: {
    width: '100%',
    gap: 10,
    marginTop: 8,
  },
  dismissAlarmBtn: {
    width: '100%',
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  dismissAlarmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  snoozeBtn: {
    width: '100%',
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  snoozeBtnText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  },
});
