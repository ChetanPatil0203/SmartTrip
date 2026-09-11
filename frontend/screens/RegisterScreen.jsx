import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { ArrowLeft, User, Phone, Mail, Lock, Eye, EyeOff, ChevronRight, CheckSquare, Square } from 'lucide-react-native';
import authService from '../services/authService';

export default function RegisterScreen({ onNavigate }) {
  const [agreed, setAgreed] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', mobile: '', email: '', password: '', confirm: '' });

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleRegister = async () => {
    if (!form.name.trim()) return Alert.alert('Error', 'Please enter your full name');
    if (!form.mobile.trim()) return Alert.alert('Error', 'Please enter your mobile number');
    if (!form.password.trim()) return Alert.alert('Error', 'Please enter a password');
    if (form.password !== form.confirm) return Alert.alert('Error', 'Passwords do not match');
    if (!agreed) return Alert.alert('Error', 'Please agree to Terms & Conditions');

    setLoading(true);
    try {
      await authService.register({
        name: form.name.trim(),
        phone: form.mobile.trim(),
        email: form.email.trim() || undefined,
        password: form.password,
      });
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => onNavigate('home') },
      ]);
    } catch (error) {
      Alert.alert('Registration Failed', error.message || 'Could not create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', label: 'FULL NAME', Icon: User, keyboard: 'default', placeholder: 'Enter your full name' },
    { key: 'mobile', label: 'MOBILE NUMBER', Icon: Phone, keyboard: 'phone-pad', placeholder: '+91 98765 43210' },
    { key: 'email', label: 'EMAIL (OPTIONAL)', Icon: Mail, keyboard: 'email-address', placeholder: 'your@email.com' },
    { key: 'password', label: 'PASSWORD', Icon: Lock, keyboard: 'default', placeholder: 'Create a strong password' },
    { key: 'confirm', label: 'CONFIRM PASSWORD', Icon: Lock, keyboard: 'default', placeholder: 'Re-enter password' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerGradient}>
        <TouchableOpacity onPress={() => onNavigate('login')} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCurved} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Create Account ✨</Text>
          <Text style={styles.subtitle}>Sign up to start booking</Text>
        </View>

        <View style={styles.form}>
          {fields.map(f => (
            <View key={f.key} style={styles.inputGroup}>
              <Text style={styles.label}>{f.label}</Text>
              <View style={styles.inputWrapper}>
                <f.Icon size={17} color="#9CA3AF" />
                <TextInput
                  style={styles.input}
                  placeholder={f.placeholder}
                  placeholderTextColor="#9CA3AF"
                  keyboardType={f.keyboard}
                  secureTextEntry={(f.key === 'password' || f.key === 'confirm') && !showPass}
                  value={form[f.key]}
                  onChangeText={v => setField(f.key, v)}
                  editable={!loading}
                />
                {f.key === 'password' && (
                  <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={17} color="#9CA3AF" /> : <Eye size={17} color="#9CA3AF" />}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity onPress={() => setAgreed(!agreed)} style={styles.termsRow} activeOpacity={0.7}>
          {agreed ? <CheckSquare size={20} color="#D13239" /> : <Square size={20} color="#D1D5DB" />}
          <Text style={styles.termsText}>
            I agree to the <Text style={styles.termsHighlight}>Terms & Conditions</Text> and{' '}
            <Text style={styles.termsHighlight}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleRegister}
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitBtnText}>CREATE ACCOUNT</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onNavigate('login')} style={styles.loginRow} activeOpacity={0.7}>
          <Text style={styles.alreadyText}>Already have an account?</Text>
          <View style={styles.loginBtn}>
            <Text style={styles.loginText}>Login</Text>
            <ChevronRight size={14} color="#D13239" />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerGradient: { height: 112, backgroundColor: '#D13239', position: 'relative' },
  backBtn: {
    position: 'absolute', top: 24, left: 16, width: 36, height: 36,
    borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerCurved: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 32,
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24,
  },
  content: { paddingHorizontal: 24, paddingBottom: 32, gap: 20 },
  titleBlock: { marginTop: -8 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827' },
  subtitle: { color: '#9CA3AF', fontSize: 14, marginTop: 4 },
  form: { gap: 14 },
  inputGroup: { gap: 6 },
  label: { fontSize: 12, fontWeight: '600', color: '#6B7280', letterSpacing: 0.5 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14,
  },
  input: { flex: 1, fontSize: 14, color: '#111827', padding: 0 },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  termsText: { flex: 1, fontSize: 14, color: '#4B5563', lineHeight: 20 },
  termsHighlight: { fontWeight: '700', color: '#D13239' },
  submitBtn: {
    width: '100%', paddingVertical: 16, borderRadius: 16,
    backgroundColor: '#D13239', alignItems: 'center', justifyContent: 'center',
    elevation: 4, shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8,
  },
  submitBtnDisabled: { backgroundColor: '#E57373' },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  loginRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 4 },
  alreadyText: { fontSize: 14, color: '#6B7280' },
  loginBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  loginText: { fontSize: 14, fontWeight: '700', color: '#D13239' },
});
