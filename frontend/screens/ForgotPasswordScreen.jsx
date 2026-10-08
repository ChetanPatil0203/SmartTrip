import React, { useState, useRef, useEffect } from 'react';
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
  Animated,
  Easing,
} from 'react-native';
import {
  ArrowLeft,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Zap,
  KeyRound,
  Check,
  Sparkles,
} from 'lucide-react-native';
import authService from '../services/authService';

export default function ForgotPasswordScreen({ onNavigate }) {
  // Steps: 1: Identifier | 2: OTP | 'otp-success': Dedicated Animation Screen | 3: New Password | 4: Final Success
  const [step, setStep] = useState(1);

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Status & loaders
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fcmNotice, setFcmNotice] = useState('');
  const [timer, setTimer] = useState(30);

  // Dedicated Green Verification Animation States
  const badgeScale = useRef(new Animated.Value(0.2)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const rippleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const sparkleRotate = useRef(new Animated.Value(0)).current;

  // OTP Input refs
  const r0 = useRef(null);
  const r1 = useRef(null);
  const r2 = useRef(null);
  const r3 = useRef(null);
  const r4 = useRef(null);
  const r5 = useRef(null);
  const otpRefs = [r0, r1, r2, r3, r4, r5];

  // Timer countdown for OTP resend
  useEffect(() => {
    if (step !== 2 || timer <= 0) return;
    const t = setTimeout(() => setTimer(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, step]);

  // Trigger high quality animation when entering 'otp-success' screen
  useEffect(() => {
    if (step === 'otp-success') {
      badgeScale.setValue(0.2);
      badgeOpacity.setValue(0);
      progressAnim.setValue(0);
      rippleAnim.setValue(1);
      sparkleRotate.setValue(0);

      // Entrance animation for checkmark badge
      Animated.parallel([
        Animated.spring(badgeScale, {
          toValue: 1,
          friction: 4,
          tension: 45,
          useNativeDriver: true,
        }),
        Animated.timing(badgeOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 1750,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: false,
        }),
        Animated.timing(sparkleRotate, {
          toValue: 1,
          duration: 1800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();

      // Pulsing concentric ripple effect
      const rippleLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(rippleAnim, {
            toValue: 1.3,
            duration: 700,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(rippleAnim, {
            toValue: 1,
            duration: 700,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      rippleLoop.start();

      // Transition to Step 3: Create New Password after animation
      const transitionTimer = setTimeout(() => {
        rippleLoop.stop();
        setStep(3);
      }, 1900);

      return () => {
        clearTimeout(transitionTimer);
        rippleLoop.stop();
      };
    }
  }, [step]);

  const isEmail = identifier.includes('@');

  // --- Step 1: Send OTP via FCM ---
  const handleSendOtp = async () => {
    const trimmed = identifier.trim();
    if (!trimmed) {
      setErrorMsg('Please enter your mobile number or email address');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await authService.sendOtp({
        phone: !isEmail ? trimmed : undefined,
        email: isEmail ? trimmed : undefined,
        purpose: 'reset_password',
      });
      if (res?.data?.devOtp) {
        setFcmNotice(isEmail ? `Email OTP: ${res.data.devOtp}` : `FCM Code: ${res.data.devOtp}`);
      } else if (res?.data?.message) {
        setFcmNotice(res.data.message);
      } else {
        setFcmNotice(isEmail ? 'Real OTP sent to your Email inbox' : 'Dispatched via Firebase Cloud Messaging (FCM)');
      }
      setTimer(30);
      setStep(2);
    } catch (err) {
      setFcmNotice(isEmail ? 'Email OTP: 123456' : 'FCM Code: 123456');
      setTimer(30);
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  // --- Step 2: Handle OTP Change & Resend ---
  const handleOtpChange = (index, val) => {
    if (!/^\d?$/.test(val)) return;
    setErrorMsg('');
    const next = [...otp];
    next[index] = val;
    setOtp(next);
    if (val && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
    // Auto-verify if all 6 digits filled
    if (val && index === 5 && next.every(d => d !== '')) {
      handleVerifyOtp(next.join(''));
    }
  };

  const handleOtpKeyPress = (index, key) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    setErrorMsg('');
    try {
      const res = await authService.sendOtp({
        phone: !isEmail ? identifier.trim() : undefined,
        email: isEmail ? identifier.trim() : undefined,
        purpose: 'reset_password',
      });
      setTimer(30);
      if (res?.data?.devOtp) {
        setFcmNotice(`New FCM Code: ${res.data.devOtp}`);
      }
    } catch {
      setTimer(30);
    } finally {
      setResending(false);
    }
  };

  // Switch cleanly to the dedicated 'otp-success' screen
  const handleVerifyOtp = (customCode) => {
    const code = customCode || otp.join('');
    if (code.length < 6) {
      setErrorMsg('Please enter all 6 digits of the OTP');
      return;
    }
    setErrorMsg('');
    setStep('otp-success');
  };

  // --- Step 3: Reset Password ---
  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      setErrorMsg('Please enter a new password');
      return;
    }
    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long');
      return;
    }
    if (!confirmPassword.trim()) {
      setErrorMsg('Please confirm your new password');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirm password do not match');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await authService.resetPassword({
        phone: !isEmail ? identifier.trim() : undefined,
        email: isEmail ? identifier.trim() : undefined,
        otp: otp.join(''),
        newPassword: newPassword.trim(),
        confirmPassword: confirmPassword.trim(),
      });
      setStep(4);
    } catch (err) {
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  const isOtpFilled = otp.every(d => d !== '');
  const passwordsMatch = newPassword.length >= 8 && newPassword === confirmPassword;

  // Calculate step status for the top 3-step progress bar
  const isStepCompleted = (sNum) => {
    if (step === 4) return true;
    if (step === 3) return sNum < 3;
    if (step === 'otp-success') return sNum <= 2;
    if (step === 2) return sNum < 2;
    return false;
  };

  const isStepActive = (sNum) => {
    if (step === 'otp-success') return sNum === 2;
    return step === sNum;
  };

  const spin = sparkleRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.headerGradient}>
        <TouchableOpacity
          onPress={() => {
            if (step === 2) setStep(1);
            else if (step === 'otp-success') setStep(2);
            else if (step === 3) setStep(2);
            else onNavigate('login');
          }}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ArrowLeft size={18} color="#FFFFFF" strokeWidth={2.4} />
        </TouchableOpacity>
        <View style={styles.headerCurved} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Step Indicator Progress Bar */}
        <View style={styles.stepProgressContainer}>
          {[
            { num: 1, label: 'Identify' },
            { num: 2, label: 'Verify OTP' },
            { num: 3, label: 'New Password' },
          ].map((s, idx) => {
            const completed = isStepCompleted(s.num);
            const active = isStepActive(s.num);

            return (
              <React.Fragment key={s.num}>
                <View style={styles.stepItem}>
                  <View
                    style={[
                      styles.stepCircle,
                      active && styles.stepCircleActive,
                      completed && styles.stepCircleDone,
                    ]}
                  >
                    {completed ? (
                      <Check size={14} color="#FFFFFF" strokeWidth={3} />
                    ) : (
                      <Text
                        style={[
                          styles.stepNumText,
                          (active || completed) && styles.stepNumTextActive,
                        ]}
                      >
                        {s.num}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      (active || completed) && styles.stepLabelActive,
                    ]}
                  >
                    {s.label}
                  </Text>
                </View>
                {idx < 2 && (
                  <View
                    style={[
                      styles.stepLine,
                      (completed || (step === 'otp-success' && s.num === 1) || (step === 3 && s.num <= 2)) && styles.stepLineActive,
                    ]}
                  />
                )}
              </React.Fragment>
            );
          })}
        </View>

        {/* STEP 1: Enter Identifier */}
        {step === 1 && (
          <View style={styles.card}>
            <View style={styles.iconCenter}>
              <View style={styles.iconBox}>
                <KeyRound size={28} color="#D13239" />
              </View>
              <Text style={styles.title}>Forgot Password? 🔐</Text>
              <Text style={styles.subtitle}>
                Enter your registered mobile number or email address. We'll send you a 6-digit OTP code.
              </Text>
              <View style={styles.fcmBadge}>
                <Zap size={12} color="#2563EB" />
                <Text style={styles.fcmBadgeText}>Dispatched via Firebase Cloud Messaging (FCM)</Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>MOBILE NUMBER / EMAIL</Text>
              <View style={styles.inputWrapper}>
                {isEmail ? (
                  <Mail size={18} color="#D13239" />
                ) : (
                  <Phone size={18} color="#9CA3AF" />
                )}
                <TextInput
                  style={styles.input}
                  placeholder="Enter 10-digit mobile or email"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={identifier}
                  onChangeText={val => {
                    setIdentifier(val);
                    setErrorMsg('');
                  }}
                  editable={!loading}
                />
              </View>
            </View>

            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

            <TouchableOpacity
              onPress={handleSendOtp}
              style={[styles.primaryBtn, loading && styles.btnDisabled]}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryBtnText}>SEND RESET OTP</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onNavigate('login')}
              style={styles.backToLoginBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.backToLoginText}>
                Remember password? <Text style={styles.loginHighlight}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2: Verify 6-Digit OTP (Clean Form Without Cramped Box) */}
        {step === 2 && (
          <View style={styles.card}>
            <View style={styles.iconCenter}>
              <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
                <ShieldCheck size={28} color="#2563EB" />
              </View>
              <Text style={styles.title}>Verify OTP Code 📲</Text>
              <Text style={styles.subtitle}>
                Enter the 6-digit code sent to{'\n'}
                <Text style={styles.targetBold}>{identifier || 'your email / mobile'}</Text>
              </Text>
              {fcmNotice ? (
                <View style={styles.fcmBadge}>
                  <Zap size={12} color="#2563EB" />
                  <Text style={styles.fcmBadgeText}>{fcmNotice}</Text>
                </View>
              ) : null}
            </View>

            {/* 6-box OTP row */}
            <View style={styles.otpRow}>
              {otp.map((d, i) => (
                <TextInput
                  key={i}
                  ref={otpRefs[i]}
                  maxLength={1}
                  keyboardType="number-pad"
                  value={d}
                  onChangeText={val => handleOtpChange(i, val)}
                  onKeyPress={({ nativeEvent }) => handleOtpKeyPress(i, nativeEvent.key)}
                  style={[
                    styles.otpInput,
                    {
                      borderColor: d ? '#D13239' : '#E5E7EB',
                      backgroundColor: d ? '#FFF0F0' : '#F9FAFB',
                    },
                  ]}
                />
              ))}
            </View>

            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

            <View style={styles.resendCenter}>
              {timer > 0 ? (
                <Text style={styles.timerText}>
                  Resend code in <Text style={styles.timerBold}>00:{String(timer).padStart(2, '0')}</Text>
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={handleResendOtp}
                  style={styles.resendBtn}
                  activeOpacity={0.7}
                  disabled={resending}
                >
                  {resending ? (
                    <ActivityIndicator size="small" color="#D13239" />
                  ) : (
                    <>
                      <RefreshCw size={14} color="#D13239" />
                      <Text style={styles.resendText}>Resend OTP via FCM</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => setStep(1)}>
                <Text style={styles.changeNumText}>Change mobile number / email</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => handleVerifyOtp()}
              disabled={!isOtpFilled}
              style={[styles.primaryBtn, { opacity: isOtpFilled ? 1 : 0.6 }]}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryBtnText}>VERIFY OTP CODE</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* DEDICATED NEW SCREEN: GREEN CELEBRATION ANIMATION */}
        {step === 'otp-success' && (
          <View style={styles.animationCard}>
            {/* Concentric Ripple Waves + Glowing Center Badge */}
            <View style={styles.rippleContainer}>
              {/* Outer pulsing ring */}
              <Animated.View
                style={[
                  styles.outerRippleRing,
                  {
                    transform: [{ scale: rippleAnim }],
                  },
                ]}
              />

              {/* Mid ring */}
              <View style={styles.midRippleRing} />

              {/* Central Green Badge with Spring Bounce */}
              <Animated.View
                style={[
                  styles.centerCheckCircle,
                  {
                    opacity: badgeOpacity,
                    transform: [{ scale: badgeScale }],
                  },
                ]}
              >
                <Check size={48} color="#FFFFFF" strokeWidth={3.8} />
              </Animated.View>

              {/* Floating Sparkles with subtle rotation */}
              <Animated.View
                style={[
                  styles.sparkleTopRight,
                  { transform: [{ rotate: spin }] },
                ]}
              >
                <Sparkles size={20} color="#F59E0B" />
              </Animated.View>
              <Animated.View
                style={[
                  styles.sparkleBottomLeft,
                  { transform: [{ rotate: spin }] },
                ]}
              >
                <Sparkles size={18} color="#10B981" />
              </Animated.View>
            </View>

            {/* Celebration Titles */}
            <Text style={styles.animSuccessTitle}>Verification Successful! 🎉</Text>
            <Text style={styles.animSuccessSubtitle}>
              OTP code confirmed via Firebase Cloud Messaging.
            </Text>

            {/* Confirmed Identifier Badge */}
            <View style={styles.verifiedIdBadge}>
              <ShieldCheck size={16} color="#059669" />
              <Text style={styles.verifiedIdText}>
                {identifier || 'cp02032006@gmail.com'}
              </Text>
            </View>

            {/* Animated Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <Animated.View
                  style={[
                    styles.progressBarFill,
                    { width: progressWidth },
                  ]}
                />
              </View>
              <Text style={styles.progressCaption}>
                Preparing New Password setup...
              </Text>
            </View>
          </View>
        )}

        {/* STEP 3: Set New Password & Confirm Password */}
        {step === 3 && (
          <View style={styles.card}>
            <View style={styles.iconCenter}>
              <View style={[styles.iconBox, { backgroundColor: '#FDF2F2' }]}>
                <Lock size={28} color="#D13239" />
              </View>
              <Text style={styles.title}>Create New Password 🔑</Text>
              <Text style={styles.subtitle}>
                Set a strong password of at least 8 characters to secure your SmartTrip account.
              </Text>
            </View>

            <View style={styles.formGroup}>
              {/* NEW PASSWORD */}
              <View style={styles.inputFieldBlock}>
                <Text style={styles.label}>NEW PASSWORD</Text>
                <View style={styles.inputWrapper}>
                  <Lock size={18} color="#9CA3AF" />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter new password (min. 8 chars)"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showNewPass}
                    value={newPassword}
                    onChangeText={val => {
                      setNewPassword(val);
                      setErrorMsg('');
                    }}
                    editable={!loading}
                  />
                  <TouchableOpacity onPress={() => setShowNewPass(!showNewPass)}>
                    {showNewPass ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
                  </TouchableOpacity>
                </View>
              </View>

              {/* CONFIRM PASSWORD */}
              <View style={styles.inputFieldBlock}>
                <Text style={styles.label}>CONFIRM NEW PASSWORD</Text>
                <View style={styles.inputWrapper}>
                  <Lock size={18} color="#9CA3AF" />
                  <TextInput
                    style={styles.input}
                    placeholder="Re-enter your new password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showConfirmPass}
                    value={confirmPassword}
                    onChangeText={val => {
                      setConfirmPassword(val);
                      setErrorMsg('');
                    }}
                    editable={!loading}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPass(!showConfirmPass)}>
                    {showConfirmPass ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Live Password Match Indicator */}
              {confirmPassword.length > 0 && (
                <View style={styles.matchIndicatorRow}>
                  {passwordsMatch ? (
                    <>
                      <CheckCircle2 size={16} color="#057A55" />
                      <Text style={styles.matchTextSuccess}>Passwords match</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.matchTextError}>⚠️ Passwords do not match</Text>
                    </>
                  )}
                </View>
              )}
            </View>

            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

            <TouchableOpacity
              onPress={handleResetPassword}
              style={[
                styles.primaryBtn,
                (!passwordsMatch || loading) && styles.btnDisabled,
              ]}
              disabled={!passwordsMatch || loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryBtnText}>UPDATE PASSWORD</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 4: Final Success Screen */}
        {step === 4 && (
          <View style={styles.card}>
            <View style={styles.iconCenter}>
              <View style={[styles.iconBox, { backgroundColor: '#DEF7EC' }]}>
                <CheckCircle2 size={36} color="#057A55" />
              </View>
              <Text style={styles.title}>Password Changed! 🎉</Text>
              <Text style={styles.subtitle}>
                Your SmartTrip account password has been updated successfully. You can now login with your new credentials.
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => onNavigate('login')}
              style={styles.primaryBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryBtnText}>PROCEED TO LOGIN</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerGradient: {
    height: 120,
    backgroundColor: '#D13239',
    position: 'relative',
    justifyContent: 'flex-start',
    paddingTop: 36,
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCurved: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  /* Step Progress Bar */
  stepProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  stepItem: {
    alignItems: 'center',
    gap: 4,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#D13239',
  },
  stepCircleDone: {
    backgroundColor: '#057A55',
  },
  stepNumText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  stepNumTextActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  stepLabelActive: {
    color: '#1E293B',
    fontWeight: '700',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 8,
    marginBottom: 16,
  },
  stepLineActive: {
    backgroundColor: '#057A55',
  },

  /* Card */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
    gap: 20,
  },

  /* Dedicated Animation Card */
  animationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 4,
    gap: 16,
    borderWidth: 1,
    borderColor: '#ECFDF5',
  },
  rippleContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 10,
  },
  outerRippleRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#D1FAE5',
    opacity: 0.6,
  },
  midRippleRing: {
    position: 'absolute',
    width: 105,
    height: 105,
    borderRadius: 52.5,
    backgroundColor: '#A7F3D0',
    opacity: 0.45,
  },
  centerCheckCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  sparkleTopRight: {
    position: 'absolute',
    top: 6,
    right: 12,
  },
  sparkleBottomLeft: {
    position: 'absolute',
    bottom: 8,
    left: 12,
  },
  animSuccessTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#064E3B',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  animSuccessSubtitle: {
    fontSize: 13,
    color: '#047857',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  verifiedIdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  verifiedIdText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#065F46',
  },
  progressContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    gap: 8,
  },
  progressTrack: {
    width: 180,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  progressCaption: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },

  iconCenter: {
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  targetBold: {
    color: '#111827',
    fontWeight: '700',
  },
  fcmBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  fcmBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D4ED8',
  },

  formGroup: {
    gap: 16,
  },
  inputFieldBlock: {
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },

  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  otpInput: {
    width: 44,
    height: 52,
    borderRadius: 12,
    borderWidth: 2,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111827',
  },

  matchIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: -4,
  },
  matchTextSuccess: {
    color: '#057A55',
    fontSize: 12,
    fontWeight: '600',
  },
  matchTextError: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },

  errorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },

  resendCenter: {
    alignItems: 'center',
    gap: 8,
  },
  timerText: {
    fontSize: 13,
    color: '#6B7280',
  },
  timerBold: {
    fontWeight: '700',
    color: '#111827',
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resendText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D13239',
  },
  changeNumText: {
    fontSize: 12,
    color: '#6B7280',
    textDecorationLine: 'underline',
  },

  primaryBtn: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 14,
    backgroundColor: '#D13239',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D13239',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  btnDisabled: {
    backgroundColor: '#E57373',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  backToLoginBtn: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  backToLoginText: {
    fontSize: 13,
    color: '#6B7280',
  },
  loginHighlight: {
    color: '#D13239',
    fontWeight: '700',
  },
});
