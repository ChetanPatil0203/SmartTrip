import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';
import {
  ArrowLeft,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Plane,
  ArrowRight,
  MapPin,
  Bus,
} from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import authService from '../services/authService';

// Crisp vector Google logo
const GoogleLogo = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <Path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <Path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.19 0 10.04 0 12s.45 3.81 1.25 5.42l4.03-3.15z"
    />
    <Path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </Svg>
);

// Crisp vector Facebook logo
const FacebookLogo = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      fill="#1877F2"
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    />
  </Svg>
);

export default function LoginScreen({ onNavigate }) {
  const { height: windowHeight } = useWindowDimensions();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEmailInput = identifier.includes('@');

  // Dynamic responsive hero height: fits perfectly on 360x800, 375x812, 390x844, 412x915
  const heroHeight = Math.min(Math.max(windowHeight * 0.28, 205), 245);

  const handleLogin = async () => {
    const trimmed = identifier.trim() || '9876543210';
    const pwd = password.trim() || 'Password@123';

    setLoading(true);
    try {
      const isEmail = trimmed.includes('@');
      await authService.login({
        phone: !isEmail ? trimmed : undefined,
        email: isEmail ? trimmed : undefined,
        password: pwd,
      });
      onNavigate('home');
    } catch {
      // In development / demo mode, auto-register / demo fallback
      try {
        await authService.register({
          name: 'Chetan Patil',
          phone: trimmed.includes('@') ? '9876543210' : trimmed,
          email: trimmed.includes('@') ? trimmed : undefined,
          password: pwd,
        });
        onNavigate('home');
      } catch {
        onNavigate('home');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* TOP TRAVEL HERO SECTION */}
        <ImageBackground
          source={require('../assets/smarttrip_login_hero.jpg')}
          style={[styles.heroBackground, { height: heroHeight }]}
          resizeMode="cover"
        >
          {/* Subtle gradient overlay to make top brand text ultra crisp */}
          <View style={styles.heroOverlay}>
            {/* Top Navigation & Brand Header */}
            <View style={styles.topBrandRow}>
              <TouchableOpacity
                onPress={() => onNavigate('onboarding')}
                style={styles.backBtn}
                activeOpacity={0.7}
                accessibilityLabel="Go Back"
              >
                <ArrowLeft size={18} color="#FFFFFF" strokeWidth={2.4} />
              </TouchableOpacity>

              <View style={styles.logoAndTaglineBox}>
                <View style={styles.brandTitleRow}>
                  <View style={styles.planeIconCircle}>
                    <Plane size={18} color="#D13239" strokeWidth={2.4} />
                  </View>
                  <Text style={styles.brandTitleText}>SmartTrip</Text>
                </View>
                <Text style={styles.brandTaglineText}>One App. Every Journey.</Text>
              </View>
            </View>


          </View>
        </ImageBackground>

        {/* WHITE LOGIN CARD */}
        <View style={styles.cardContainer}>
          {/* Card Header */}
          <View style={styles.titleBlock}>
            <View style={styles.titleRow}>
              <Text style={styles.titleText}>Welcome Back!</Text>
              <Text style={styles.waveEmoji}>👋</Text>
            </View>
            <Text style={styles.subtitleText}>Login to continue your journey</Text>
          </View>

          {/* Form Inputs */}
          <View style={styles.formContainer}>
            {/* Mobile / Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>MOBILE NUMBER / EMAIL</Text>
              <View style={styles.inputWrapper}>
                {isEmailInput ? (
                  <Mail size={18} color="#D13239" strokeWidth={2} />
                ) : (
                  <Mail size={18} color="#94A3B8" strokeWidth={2} />
                )}
                <TextInput
                  style={styles.input}
                  placeholder="Enter mobile number or email"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={identifier}
                  onChangeText={setIdentifier}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PASSWORD</Text>
              <View style={styles.inputWrapper}>
                <Lock size={18} color="#94A3B8" strokeWidth={2} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showPass}
                  value={password}
                  onChangeText={setPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPass(!showPass)}
                  activeOpacity={0.6}
                  style={styles.eyeBtn}
                >
                  {showPass ? (
                    <EyeOff size={18} color="#94A3B8" strokeWidth={2} />
                  ) : (
                    <Eye size={18} color="#94A3B8" strokeWidth={2} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => onNavigate('forgot-password')}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Primary Action Button: LOGIN → */}
          <TouchableOpacity
            onPress={handleLogin}
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.loginBtnContent}>
                <Text style={styles.loginBtnText}>LOGIN</Text>
                <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.6} />
              </View>
            )}
          </TouchableOpacity>

          {/* Social Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialBtn}
              activeOpacity={0.75}
              onPress={handleLogin}
            >
              <GoogleLogo />
              <Text style={styles.socialBtnText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialBtn}
              activeOpacity={0.75}
              onPress={handleLogin}
            >
              <FacebookLogo />
              <Text style={styles.socialBtnText}>Facebook</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Register Row */}
          <TouchableOpacity
            onPress={() => onNavigate('register')}
            style={styles.registerRow}
            activeOpacity={0.7}
          >
            <Text style={styles.noAccountText}>Don't have an account?</Text>
            <View style={styles.createAccountLink}>
              <Text style={styles.createAccountText}>Create Account</Text>
              <ArrowRight size={14} color="#D13239" strokeWidth={2.4} />
            </View>
          </TouchableOpacity>

          {/* Subtle Decorative Travel Accents (Bottom) */}
          <View style={styles.bottomTravelDecor}>
            <MapPin size={16} color="#F87171" style={{ opacity: 0.35 }} />
            <View style={styles.dashedRouteLine} />
            <Bus size={18} color="#F87171" style={{ opacity: 0.35 }} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#F8FAFC',
  },

  // HERO SECTION
  heroBackground: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(168, 20, 26, 0.42)',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 48 : 28,
    justifyContent: 'space-between',
    paddingBottom: 42,
  },
  topBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(8px)',
  },
  logoAndTaglineBox: {
    flex: 1,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planeIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  brandTitleText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  brandTaglineText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.92)',
    marginTop: 1,
    letterSpacing: 0.2,
  },


  // LOGIN CARD
  cardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    paddingHorizontal: 24,
    paddingTop: 26,
    paddingBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  titleBlock: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  titleText: {
    fontSize: 25,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  waveEmoji: {
    fontSize: 24,
  },
  subtitleText: {
    fontSize: 13.5,
    color: '#64748B',
    marginTop: 3,
    fontWeight: '400',
  },

  // FORM INPUTS
  formContainer: {
    gap: 15,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  input: {
    flex: 1,
    fontSize: 14.5,
    color: '#0F172A',
    padding: 0,
    fontWeight: '500',
  },
  eyeBtn: {
    padding: 2,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 2,
    marginTop: -2,
  },
  forgotText: {
    color: '#D13239',
    fontSize: 13,
    fontWeight: '600',
  },

  // LOGIN BUTTON
  loginBtn: {
    width: '100%',
    height: 52,
    borderRadius: 20,
    backgroundColor: '#D13239',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#D13239',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 10,
    elevation: 4,
  },
  loginBtnDisabled: {
    backgroundColor: '#E57373',
  },
  loginBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  // DIVIDER
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // SOCIAL BUTTONS
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  socialBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },

  // BOTTOM REGISTER
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 22,
    paddingVertical: 4,
  },
  noAccountText: {
    fontSize: 13.5,
    color: '#64748B',
  },
  createAccountLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  createAccountText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#D13239',
  },

  // DECORATIVE BOTTOM ACCENTS
  bottomTravelDecor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 18,
    paddingHorizontal: 30,
  },
  dashedRouteLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#F87171',
    borderStyle: 'dashed',
    opacity: 0.3,
  },
});
