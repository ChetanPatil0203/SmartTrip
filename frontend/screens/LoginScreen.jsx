import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ArrowLeft, Phone, Lock, Eye, EyeOff, ChevronRight } from 'lucide-react-native';

export default function LoginScreen({ onNavigate }) {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  return (
    <View style={styles.container}>
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
            <Text style={styles.label}>MOBILE NUMBER</Text>
            <View style={styles.inputWrapper}>
              <Phone size={18} color="#9CA3AF" />
              <TextInput
                style={styles.input}
                placeholder="Enter your mobile number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                value={mobile}
                onChangeText={setMobile}
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
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => onNavigate('home')}
          style={styles.loginBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.loginBtnText}>LOGIN</Text>
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
        >
          <Text style={styles.noAccountText}>Don't have an account?</Text>
          <View style={styles.createBtn}>
            <Text style={styles.createText}>Create Account</Text>
            <ChevronRight size={14} color="#D13239" />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerGradient: {
    height: 128,
    backgroundColor: '#D13239',
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    top: 24,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCurved: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 24,
  },
  titleBlock: {
    marginTop: -8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    padding: 0,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    color: '#D13239',
    fontSize: 14,
    fontWeight: '600',
  },
  loginBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#D13239',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  dividerText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
  },
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
    paddingVertical: 14,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
  },
  socialIconBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIconText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  socialLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  noAccountText: {
    fontSize: 14,
    color: '#6B7280',
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  createText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D13239',
  },
});
