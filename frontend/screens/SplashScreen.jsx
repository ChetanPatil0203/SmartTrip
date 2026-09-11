import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Bus, Train, Plane, Building2 } from "lucide-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SmartTripLogo = ({ size = 76 }) => (
  <Svg width={size} height={size * 1.15} viewBox="0 0 100 115" fill="none">
    {/* Red Location Pin Base */}
    <Path
      d="M50 5C27.91 5 10 22.91 10 45C10 70 50 110 50 110C50 110 90 70 90 45C90 22.91 72.09 5 50 5Z"
      fill="#D13239"
    />
    {/* Inner White Road Curve */}
    <Path
      d="M36 78C42 60 42 46 60 26C64 22 70 20 74 18C64 26 54 38 48 56C45 65 44 73 42 80Z"
      fill="#FFFFFF"
    />
    <Path
      d="M48 80C50 71 54 58 64 44C68 38 74 31 80 26C76 32 70 40 64 48C58 60 54 70 52 80Z"
      fill="#FFFFFF"
      opacity={0.8}
    />
    {/* Top Right Flying Airplane accent */}
    <Path d="M74 10L94 3L86 23L78 16L71 18L76 11L74 10Z" fill="#D13239" />
  </Svg>
);

export default function SplashScreen({ onNavigate }) {
  const [activeDot, setActiveDot] = useState(0);

  // Animation controllers
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  const brandOpacity = useRef(new Animated.Value(0)).current;

  const categoriesOpacity = useRef(new Animated.Value(0)).current;
  const categoriesTranslateY = useRef(new Animated.Value(20)).current;

  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslateY = useRef(new Animated.Value(30)).current;

  const waveOpacity = useRef(new Animated.Value(0)).current;
  const waveTranslateY = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    // 1. Logo animation
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Brand text fade
    Animated.timing(brandOpacity, {
      toValue: 1,
      duration: 500,
      delay: 200,
      useNativeDriver: true,
    }).start();

    // 3. Categories staggered slide-up
    Animated.parallel([
      Animated.timing(categoriesOpacity, {
        toValue: 1,
        duration: 500,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(categoriesTranslateY, {
        toValue: 0,
        duration: 500,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // 4. Hero image reveal
    Animated.parallel([
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 600,
        delay: 550,
        useNativeDriver: true,
      }),
      Animated.timing(heroTranslateY, {
        toValue: 0,
        duration: 600,
        delay: 550,
        useNativeDriver: true,
      }),
    ]).start();

    // 5. Bottom wave reveal
    Animated.parallel([
      Animated.timing(waveOpacity, {
        toValue: 1,
        duration: 500,
        delay: 700,
        useNativeDriver: true,
      }),
      Animated.timing(waveTranslateY, {
        toValue: 0,
        duration: 500,
        delay: 700,
        useNativeDriver: true,
      }),
    ]).start();

    // Looping active dot indicator animation
    const dotInterval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 4);
    }, 600);

    // Auto navigate after 3.4s
    const timer = setTimeout(() => {
      onNavigate("onboarding");
    }, 3400);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(timer);
    };
  }, []);

  const handleSkip = () => {
    onNavigate("onboarding");
  };

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.98} onPress={handleSkip}>
      {/* Top Header / Logo Section */}
      <View style={styles.topSection}>
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <SmartTripLogo size={80} />
        </Animated.View>

        <Animated.View style={[styles.brandWrapper, { opacity: brandOpacity }]}>
          <Text style={styles.brandTitle}>
            Smart<Text style={styles.brandRed}>Trip</Text>
          </Text>
          <Text style={styles.tagline}>One App. Every Journey.</Text>
        </Animated.View>
      </View>

      {/* Four Category Chips Row */}
      <Animated.View
        style={[
          styles.categoriesContainer,
          {
            opacity: categoriesOpacity,
            transform: [{ translateY: categoriesTranslateY }],
          },
        ]}
      >
        <View style={styles.categoryItem}>
          <View style={[styles.iconSquare, { backgroundColor: "#FFECEC" }]}>
            <Bus size={22} color="#D13239" strokeWidth={2.2} />
          </View>
          <Text style={styles.categoryLabel}>Bus</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.categoryItem}>
          <View style={[styles.iconSquare, { backgroundColor: "#E0F2FE" }]}>
            <Train size={22} color="#0284C7" strokeWidth={2.2} />
          </View>
          <Text style={styles.categoryLabel}>Train</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.categoryItem}>
          <View style={[styles.iconSquare, { backgroundColor: "#ECFEFF" }]}>
            <Plane size={22} color="#0D9488" strokeWidth={2.2} />
          </View>
          <Text style={styles.categoryLabel}>Flight</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.categoryItem}>
          <View style={[styles.iconSquare, { backgroundColor: "#F3E8FF" }]}>
            <Building2 size={22} color="#7C3AED" strokeWidth={2.2} />
          </View>
          <Text style={styles.categoryLabel}>Hotel</Text>
        </View>
      </Animated.View>

      {/* Main Realistic Travel Visual Section */}
      <Animated.View
        style={[
          styles.heroSection,
          {
            opacity: heroOpacity,
            transform: [{ translateY: heroTranslateY }],
          },
        ]}
      >
        {/* Script Calligraphy Quote */}
        <View style={styles.quoteWrapper}>
          <Text style={styles.quoteTextLine1}>Explore More</Text>
          <Text style={styles.quoteTextLine2}>Travel Better</Text>
          <Svg width={140} height={12} viewBox="0 0 140 12" fill="none">
            <Path
              d="M 5 6 C 45 1, 95 11, 135 4"
              stroke="#D13239"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          </Svg>
        </View>

        {/* Travel Visual Hero Image */}
        <Image
          source={require("../assets/smarttrip_splash_hero.png")}
          style={styles.heroImage}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Bottom Red Curved Wave & Loading Progress Indicators */}
      <Animated.View
        style={[
          styles.bottomWaveContainer,
          {
            opacity: waveOpacity,
            transform: [{ translateY: waveTranslateY }],
          },
        ]}
      >
        <Svg
          width="100%"
          height={90}
          viewBox="0 0 375 90"
          preserveAspectRatio="none"
          style={styles.waveSvg}
        >
          <Path d="M 0 45 C 100 15, 270 65, 375 25 L 375 90 L 0 90 Z" fill="#D13239" />
        </Svg>

        <View style={styles.redWaveFill}>
          {/* Looping Loading Dots */}
          <View style={styles.dotsRow}>
            {[0, 1, 2, 3].map((idx) => {
              const isActive = activeDot === idx;
              return (
                <View
                  key={idx}
                  style={[styles.dot, isActive ? styles.dotActive : styles.dotInactive]}
                />
              );
            })}
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    justifyContent: "space-between",
  },
  topSection: {
    alignItems: "center",
    paddingTop: 48,
    gap: 12,
  },
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  brandWrapper: {
    alignItems: "center",
    gap: 4,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: "900",
    color: "#1E293B",
    letterSpacing: -0.5,
  },
  brandRed: {
    color: "#D13239",
  },
  tagline: {
    fontSize: 15,
    fontWeight: "600",
    color: "#475569",
    letterSpacing: -0.2,
  },
  categoriesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingHorizontal: 24,
    marginVertical: 12,
  },
  categoryItem: {
    alignItems: "center",
    gap: 6,
  },
  iconSquare: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: "#E2E8F0",
  },
  heroSection: {
    flex: 1,
    position: "relative",
    width: "100%",
    minHeight: 280,
    marginTop: 10,
    overflow: "hidden",
  },
  quoteWrapper: {
    position: "absolute",
    top: 10,
    left: 24,
    zIndex: 10,
  },
  quoteTextLine1: {
    fontSize: 22,
    fontWeight: "700",
    fontStyle: "italic",
    color: "#D13239",
    letterSpacing: -0.3,
  },
  quoteTextLine2: {
    fontSize: 22,
    fontWeight: "700",
    fontStyle: "italic",
    color: "#D13239",
    letterSpacing: -0.3,
    marginTop: -4,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  bottomWaveContainer: {
    width: "100%",
    marginTop: -40,
    zIndex: 20,
  },
  waveSvg: {
    marginBottom: -1,
  },
  redWaveFill: {
    backgroundColor: "#D13239",
    paddingBottom: 28,
    paddingTop: 10,
    alignItems: "center",
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    borderRadius: 6,
  },
  dotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  dotInactive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.45)",
  },
});
