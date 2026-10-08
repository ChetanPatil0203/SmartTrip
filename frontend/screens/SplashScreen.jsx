import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Circle } from "react-native-svg";
import { Bus, Train, Plane, Building2, Car } from "lucide-react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Custom Crisp Auto Rickshaw SVG icon matching Lucide style
const AutoRickshawIcon = ({ size = 13, color = "#475569" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 11L6 4.5H18L20 11V17.5C20 18.3 19.3 19 18.5 19H17C16.2 19 15.5 18.3 15.5 17.5V16.5H8.5V17.5C8.5 18.3 7.8 19 7 19H5.5C4.7 19 4 18.3 4 17.5V11Z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
    <Path d="M5.5 10.5H18.5" stroke={color} strokeWidth={1.5} />
    <Path d="M7 4.5L8.2 10.5" stroke={color} strokeWidth={1.4} />
    <Path d="M17 4.5L15.8 10.5" stroke={color} strokeWidth={1.4} />
    <Circle cx="12" cy="13.5" r="1.5" fill={color} />
    <Circle cx="6.5" cy="19" r="1.5" fill={color} />
    <Circle cx="17.5" cy="19" r="1.5" fill={color} />
  </Svg>
);

// SmartTrip Takeoff Jet Logo with aerodynamic speed streaks
const SmartTripJetLogo = ({ size = 38 }) => (
  <Svg width={size} height={size} viewBox="0 0 54 54" fill="none">
    {/* Speed trails */}
    <Path
      d="M10 43C14 40 18 36 21 33"
      stroke="#D13239"
      strokeWidth="2.6"
      strokeLinecap="round"
    />
    <Path
      d="M5 37C9 35 13 32 15 30"
      stroke="#D13239"
      strokeWidth="2.1"
      strokeLinecap="round"
    />
    <Path
      d="M14 47C17 45 20 42 23 38"
      stroke="#D13239"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    {/* Red commercial airplane angled 45deg taking off */}
    <Path
      d="M47 9C47 9 44.5 7.5 41.5 8C38 8.8 31.5 14 25.5 19.5L14 18.5L11 21.5L19.5 25.5L14.5 32.5L9 31.5L7 33.5L13.5 38.5L18.5 45L20.5 43L19.5 37.5L26.5 32.5L30.5 41L33.5 38L32.5 26.5C38 20.5 43.2 14 45.5 10.5C46.5 9 47 9 47 9Z"
      fill="#D13239"
    />
    <Circle cx="43" cy="10.5" r="1.4" fill="#FFFFFF" opacity={0.85} />
  </Svg>
);

const TRAVEL_MODES = [
  { id: "bus", label: "Bus", Icon: Bus },
  { id: "train", label: "Train", Icon: Train },
  { id: "flight", label: "Flight", Icon: Plane },
  { id: "hotel", label: "Hotel", Icon: Building2 },
  { id: "cab", label: "Cab", Icon: Car },
  { id: "auto", label: "Auto", Icon: AutoRickshawIcon },
];

export default function SplashScreen({ onNavigate }) {
  const insets = useSafeAreaInsets();
  const [selectedMode, setSelectedMode] = useState("bus");
  const [activeDot, setActiveDot] = useState(0);

  // Animated controllers
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.92)).current;

  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(new Animated.Value(8)).current;

  const chipsOpacity = useRef(new Animated.Value(0)).current;
  const chipsTranslateY = useRef(new Animated.Value(12)).current;

  const heroOpacity = useRef(new Animated.Value(0)).current;

  const bottomCardOpacity = useRef(new Animated.Value(0)).current;
  const bottomCardTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // 1. Logo entrance (400ms)
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 7,
        tension: 90,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Tagline entrance (350ms, delay 150ms)
    Animated.parallel([
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 350,
        delay: 150,
        useNativeDriver: true,
      }),
      Animated.timing(taglineTranslateY, {
        toValue: 0,
        duration: 350,
        delay: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // 3. Category chips entrance (400ms, delay 250ms)
    Animated.parallel([
      Animated.timing(chipsOpacity, {
        toValue: 1,
        duration: 400,
        delay: 250,
        useNativeDriver: true,
      }),
      Animated.spring(chipsTranslateY, {
        toValue: 0,
        friction: 8,
        tension: 85,
        delay: 250,
        useNativeDriver: true,
      }),
    ]).start();

    // 4. Hero scene reveal (500ms, delay 280ms)
    Animated.timing(heroOpacity, {
      toValue: 1,
      duration: 500,
      delay: 280,
      useNativeDriver: true,
    }).start();

    // 5. Bottom card reveal (450ms, delay 400ms)
    Animated.parallel([
      Animated.timing(bottomCardOpacity, {
        toValue: 1,
        duration: 450,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.spring(bottomCardTranslateY, {
        toValue: 0,
        friction: 8,
        tension: 90,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Subtle pagination dot cycle: 0 -> 1 -> 2
    const dotInterval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 3);
    }, 800);

    // Auto-advance timer (2.6s)
    const autoNavTimer = setTimeout(() => {
      navigateToNext();
    }, 2600);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(autoNavTimer);
    };
  }, []);

  const navigateToNext = () => {
    if (typeof onNavigate === "function") {
      onNavigate("onboarding");
    }
  };

  const handleModePress = (id) => {
    setSelectedMode(id);
  };

  const isCompact = SCREEN_HEIGHT < 750;

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.root}
      onPress={navigateToNext}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#C8DEF5" translucent />

      {/* 1. TOP BRANDING SECTION */}
      <View
        style={[
          styles.topContainer,
          {
            paddingTop: Math.max(insets.top, 10) + (isCompact ? 4 : 8),
          },
        ]}
      >
        <Animated.View
          style={[
            styles.brandRow,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <SmartTripJetLogo size={isCompact ? 34 : 38} />
          <View style={styles.brandTitleContainer}>
            <Text style={[styles.brandTitleMain, isCompact && styles.brandTitleMainSmall]}>
              Smart<Text style={styles.brandTitleRed}>Trip</Text>
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.taglineContainer,
            {
              opacity: taglineOpacity,
              transform: [{ translateY: taglineTranslateY }],
            },
          ]}
        >
          <Text style={[styles.taglineText, isCompact && styles.taglineTextSmall]}>
            One App. Every Journey.
          </Text>
        </Animated.View>

        {/* 2. COMPACT TRAVEL MODE CHIPS BAR (Fitting all 6 modes proportionally) */}
        <Animated.View
          style={[
            styles.chipsBarWrapper,
            {
              opacity: chipsOpacity,
              transform: [{ translateY: chipsTranslateY }],
            },
          ]}
        >
          <View style={styles.chipsBar}>
            {TRAVEL_MODES.map((mode, index) => {
              const isActive = selectedMode === mode.id;
              const IconComp = mode.Icon;
              return (
                <React.Fragment key={mode.id}>
                  <TouchableOpacity
                    style={[styles.chipItem, isActive && styles.chipItemActive]}
                    onPress={() => handleModePress(mode.id)}
                    activeOpacity={0.8}
                  >
                    <IconComp
                      size={isCompact ? 11.5 : 13}
                      color={isActive ? "#FFFFFF" : "#475569"}
                      strokeWidth={isActive ? 2.3 : 2}
                    />
                    <Text
                      style={[
                        styles.chipText,
                        isActive ? styles.chipTextActive : styles.chipTextInactive,
                        isCompact && styles.chipTextSmall,
                      ]}
                      numberOfLines={1}
                    >
                      {mode.label}
                    </Text>
                  </TouchableOpacity>

                  {/* Subtle divider */}
                  {index < TRAVEL_MODES.length - 1 && !isActive && selectedMode !== TRAVEL_MODES[index + 1].id && (
                    <View style={styles.chipDivider} />
                  )}
                </React.Fragment>
              );
            })}
          </View>
        </Animated.View>
      </View>

      {/* 3. HERO VISUAL SCENE WITH SEAMLESS WAVE (Zero Cropping - Fixed Aspect Ratio) */}
      <Animated.View
        style={[
          styles.heroContainer,
          {
            opacity: heroOpacity,
          },
        ]}
      >
        <Image
          source={require("../assets/smarttrip_hero_with_wave.jpg")}
          style={styles.heroImage}
          resizeMode="cover"
        />
      </Animated.View>

      {/* 4. BOTTOM CURVED WHITE SECTION */}
      <Animated.View
        style={[
          styles.bottomCard,
          {
            opacity: bottomCardOpacity,
            transform: [{ translateY: bottomCardTranslateY }],
            paddingBottom: Math.max(insets.bottom, 16) + (isCompact ? 6 : 14),
          },
        ]}
      >
        {/* Headings */}
        <View style={styles.headlineWrapper}>
          <Text style={[styles.journeyTitle, isCompact && styles.journeyTitleSmall]}>
            Your journey
          </Text>
          <Text style={[styles.startsHereTitle, isCompact && styles.startsHereTitleSmall]}>
            starts here.
          </Text>
        </View>

        {/* Minimal Progress Indicator (Single active red pill + 2 soft gray dots) */}
        <View style={styles.progressContainer}>
          {[0, 1, 2].map((idx) => {
            const isActive = activeDot === idx;
            return (
              <View
                key={idx}
                style={[
                  styles.dotBase,
                  isActive ? styles.dotPillActive : styles.dotCircleInactive,
                ]}
              />
            );
          })}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#C8DEF5",
    justifyContent: "space-between",
  },
  topContainer: {
    alignItems: "center",
    paddingHorizontal: 12,
    zIndex: 10,
    backgroundColor: "transparent",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  brandTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandTitleMain: {
    fontSize: 30,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  brandTitleMainSmall: {
    fontSize: 26,
  },
  brandTitleRed: {
    color: "#D13239",
  },
  taglineContainer: {
    marginTop: 2,
    marginBottom: 8,
  },
  taglineText: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#334155",
    letterSpacing: 0.2,
  },
  taglineTextSmall: {
    fontSize: 12,
  },
  chipsBarWrapper: {
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
  },
  chipsBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 22,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.9)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    width: "100%",
  },
  chipItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 2,
    borderRadius: 18,
    gap: 3,
  },
  chipItemActive: {
    flex: 1.15,
    backgroundColor: "#D13239",
    shadowColor: "#D13239",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  chipText: {
    fontSize: 10.5,
    fontWeight: "700",
  },
  chipTextSmall: {
    fontSize: 9.5,
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  chipTextInactive: {
    color: "#475569",
  },
  chipDivider: {
    width: 1,
    height: 12,
    backgroundColor: "#E2E8F0",
  },
  heroContainer: {
    width: "100%",
    aspectRatio: 576 / 546,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#C8DEF5",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  bottomCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 12,
    paddingHorizontal: 24,
    zIndex: 30,
  },
  headlineWrapper: {
    alignItems: "center",
    marginBottom: 10,
  },
  journeyTitle: {
    fontSize: 27,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  journeyTitleSmall: {
    fontSize: 23,
  },
  startsHereTitle: {
    fontSize: 27,
    fontWeight: "900",
    color: "#D13239",
    letterSpacing: -0.5,
    textAlign: "center",
    marginTop: -2,
  },
  startsHereTitleSmall: {
    fontSize: 23,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 6,
    marginBottom: 6,
  },
  dotBase: {
    height: 6,
    borderRadius: 3,
  },
  dotPillActive: {
    width: 20,
    backgroundColor: "#D13239",
  },
  dotCircleInactive: {
    width: 6,
    backgroundColor: "#CBD5E1",
  },
});
