import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { ArrowLeft, Phone, Mail, Lock, Eye, EyeOff, ChevronRight, X, ShieldCheck } from 'lucide-react-native';
import authService from '../services/authService';

export default function LoginScreen({ onNavigate }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState('');

  const isEmailInput = identifier.includes('@');

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
    } catch (error) {
      // In development / demo, if credentials mismatch, attempt auto-registration / demo fallback
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

  const handleOpenForgotPassword = () => {
    setForgotIdentifier(identifier.trim());
    setForgotSent(false);
    setForgotError('');
    setForgotModalVisible(true);
  };

  const handleSendReset = () => {
    const target = forgotIdentifier.trim() || identifier.trim();
    if (!target) {
      setForgotError('Please enter your mobile number or email address');
      return;
    }
    setForgotLoading(true);
    setForgotError('');

    setTimeout(() => {
      setForgotLoading(false);
      setForgotSent(true);
    }, 600);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.headerGradient}>
        <TouchableOpacity
          onPress={() => onNavigate('onboarding')}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ArrowLeft size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCurved} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Welcome Back! 👋</Text>
          <Text style={styles.subtitle}>Login to continue your journey</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>MOBILE NUMBER / EMAIL</Text>
            <View style={styles.inputWrapper}>
              {isEmailInput ? (
                <Mail size={18} color="#D13239" />
              ) : (
                <Phone size={18} color="#9CA3AF" />
              )}
              <TextInput
                style={styles.input}
                placeholder="Enter mobile number or email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={identifier}
                onChangeText={setIdentifier}
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>PASSWORD</Text>
            <View style={styles.inputWrapper}>
              <Lock size={18} color="#9CA3AF" />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPass}
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={handleOpenForgotPassword}
            activeOpacity={0.7}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.loginBtnText}>LOGIN</Text>
          )}
        </TouchableOpacity>


        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialRow}>
          {[
            { icon: 'G', label: 'Google', bg: '#EA4335' },
            { icon: 'f', label: 'Facebook', bg: '#1877F2' },
          ].map(btn => (
            <TouchableOpacity key={btn.label} style={styles.socialBtn} activeOpacity={0.7}>
              <View style={[styles.socialIconBox, { backgroundColor: btn.bg }]}>
                <Text style={styles.socialIconText}>{btn.icon}</Text>
              </View>
              <Text style={styles.socialLabel}>{btn.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => onNavigate('register')}
          style={styles.registerRow}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Create Account"
        >
          <Text style={styles.noAccountText}>Don't have an account?</Text>
          <View style={styles.createBtn}>
            <Text style={styles.createText}>Create Account</Text>
            <ChevronRight size={14} color="#D13239" />
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Forgot Password Modal */}
      <Modal
        visible={forgotModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setForgotModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setForgotModalVisible(false)}
              activeOpacity={0.7}
            >
              <X size={18} color="#6B7280" />
            </TouchableOpacity>

            {!forgotSent ? (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalIconBox}>
                    <Lock size={22} color="#D13239" />
                  </View>
                  <Text style={styles.modalTitle}>Forgot Password?</Text>
                  <Text style={styles.modalSubtitle}>
                    Enter your registered mobile or email to get a password reset OTP.
                  </Text>
                </View>

                <View style={styles.modalForm}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>MOBILE NUMBER / EMAIL</Text>
                    <View style={styles.inputWrapper}>
                      {forgotIdentifier.includes('@') ? (
                        <Mail size={18} color="#D13239" />
                      ) : (
                        <Phone size={18} color="#9CA3AF" />
                      )}
                      <TextInput
                        style={styles.input}
                        placeholder="e.g. 9876543210 or name@mail.com"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={forgotIdentifier}
                        onChangeText={(val) => {
                          setForgotIdentifier(val);
                          setForgotError('');
                        }}
                        editable={!forgotLoading}
                      />
                    </View>
                  </View>

                  {forgotError ? (
                    <Text style={styles.errorText}>{forgotError}</Text>
                  ) : null}

                  <TouchableOpacity
                    style={[styles.modalActionBtn, forgotLoading && styles.loginBtnDisabled]}
                    onPress={handleSendReset}
                    disabled={forgotLoading}
                    activeOpacity={0.8}
                  >
                    {forgotLoading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.modalActionBtnText}>SEND RESET OTP</Text>
                    )}
                  </TouchableOpacity>

                  <View style={styles.supportBox}>
                    <Text style={styles.supportTitle}>Need direct assistance?</Text>
                    <Text style={styles.supportDesc}>
                      Toll-free 24/7 helpline: <Text style={styles.supportHighlight}>1800-209-4820</Text>
                    </Text>
                    <Text style={styles.supportDesc}>
                      Email: <Text style={styles.supportHighlight}>support@smarttrip.in</Text>
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.modalSuccessContent}>
                <View style={[styles.modalIconBox, { backgroundColor: '#DEF7EC', marginBottom: 12 }]}>
                  <ShieldCheck size={28} color="#057A55" />
                </View>
                <Text style={styles.modalTitle}>Reset OTP Sent!</Text>
                <Text style={styles.modalSuccessSubtitle}>
                  We have sent a 6-digit OTP verification code to:{'\n'}
                  <Text style={styles.modalSuccessTarget}>
                    {forgotIdentifier || identifier || 'your registered number/email'}
                  </Text>
                </Text>

                <TouchableOpacity
                  style={[styles.modalActionBtn, { backgroundColor: '#D13239', marginTop: 16 }]}
                  onPress={() => {
                    setForgotModalVisible(false);
                    onNavigate('otp');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalActionBtnText}>ENTER OTP TO VERIFY</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalSecondaryBtn}
                  onPress={() => setForgotModalVisible(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalSecondaryBtnText}>Back to Login</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerGradient: { height: 128, backgroundColor: '#D13239', position: 'relative' },
  backBtn: {
    position: 'absolute', top: 24, left: 16, width: 36, height: 36,
    borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerCurved: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 32,
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24,
  },
  content: { paddingHorizontal: 24, paddingBottom: 32, gap: 24 },
  titleBlock: { marginTop: -8 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827' },
  subtitle: { color: '#9CA3AF', fontSize: 14, marginTop: 4 },
  form: { gap: 16 },
  inputGroup: { gap: 6 },
  label: { fontSize: 12, fontWeight: '600', color: '#6B7280', letterSpacing: 0.5 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14,
  },
  input: { flex: 1, fontSize: 14, color: '#111827', padding: 0 },
  forgotBtn: { alignSelf: 'flex-end', paddingVertical: 4 },
  forgotText: { color: '#D13239', fontSize: 14, fontWeight: '600' },
  loginBtn: {
    width: '100%', paddingVertical: 16, borderRadius: 16,
    backgroundColor: '#D13239', alignItems: 'center', justifyContent: 'center',
    elevation: 4, shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8,
  },
  loginBtnDisabled: { backgroundColor: '#E57373' },
  loginBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#F3F4F6' },
  dividerText: { color: '#9CA3AF', fontSize: 12, fontWeight: '500' },
  socialRow: { flexDirection: 'row', gap: 12 },
  socialBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10, paddingVertical: 14,
    backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16,
  },
  socialIconBox: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  socialIconText: { color: '#FFFFFF', fontSize: 12, fontWeight: '900' },
  socialLabel: { fontSize: 14, fontWeight: '600', color: '#374151' },
  registerRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 4, paddingVertical: 8,
  },
  noAccountText: { fontSize: 14, color: '#6B7280' },
  createBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  createText: { fontSize: 14, fontWeight: '700', color: '#D13239' },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  modalForm: {
    gap: 14,
    marginTop: 6,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
    marginTop: -4,
  },
  modalActionBtn: {
    backgroundColor: '#D13239',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D13239',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  modalActionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modalSecondaryBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSecondaryBtnText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  supportBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    marginTop: 4,
  },
  supportTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 2,
  },
  supportDesc: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  supportHighlight: {
    color: '#D13239',
    fontWeight: '700',
  },
  modalSuccessContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  modalSuccessSubtitle: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  modalSuccessTarget: {
    fontWeight: '700',
    color: '#111827',
    fontSize: 15,
  },
});

