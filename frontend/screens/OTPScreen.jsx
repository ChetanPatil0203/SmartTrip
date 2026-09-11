import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ArrowLeft, ShieldCheck, RefreshCw } from 'lucide-react-native';

export default function OTPScreen({ onNavigate }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);

  const r0 = useRef(null);
  const r1 = useRef(null);
  const r2 = useRef(null);
  const r3 = useRef(null);
  const r4 = useRef(null);
  const r5 = useRef(null);
  const refs = [r0, r1, r2, r3, r4, r5];

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) refs[i + 1].current?.focus();
  };

  const handleKeyPress = (i, key) => {
    if (key === 'Backspace' && !otp[i] && i > 0) refs[i - 1].current?.focus();
  };

  const filled = otp.every(d => d !== '');

  return (
    <View style={styles.container}>
      <View style={styles.headerGradient}>
        <TouchableOpacity onPress={() => onNavigate('register')} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCurved} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.iconCenter}>
          <View style={styles.iconBox}>
            <ShieldCheck size={32} color="#D13239" />
          </View>
          <View style={styles.textCenter}>
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to{'\n'}
              <Text style={styles.phoneHighlight}>+91 98765 43210</Text>
            </Text>
          </View>
        </View>

        <View style={styles.otpRow}>
          {otp.map((d, i) => (
            <TextInput
              key={i}
              ref={refs[i]}
              maxLength={1}
              keyboardType="number-pad"
              value={d}
              onChangeText={val => handleChange(i, val)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(i, nativeEvent.key)}
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

        <View style={styles.resendCenter}>
          {timer > 0 ? (
            <Text style={styles.timerText}>
              Resend OTP in{' '}
              <Text style={styles.timerBold}>00:{String(timer).padStart(2, '0')}</Text>
            </Text>
          ) : (
            <TouchableOpacity onPress={() => setTimer(30)} style={styles.resendBtn} activeOpacity={0.7}>
              <RefreshCw size={14} color="#D13239" />
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => onNavigate('login')}>
            <Text style={styles.changeNumText}>Change mobile number</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => onNavigate('home')}
          disabled={!filled}
          style={[styles.submitBtn, { opacity: filled ? 1 : 0.5 }]}
          activeOpacity={0.8}
        >
          <Text style={styles.submitBtnText}>VERIFY & CONTINUE</Text>
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
    height: 112,
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
    gap: 32,
  },
  iconCenter: {
    alignItems: 'center',
    gap: 16,
    marginTop: -8,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCenter: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 20,
  },
  phoneHighlight: {
    fontWeight: '600',
    color: '#374151',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  otpInput: {
    width: 46,
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  resendCenter: {
    alignItems: 'center',
    gap: 12,
  },
  timerText: {
    fontSize: 14,
    color: '#9CA3AF',
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
    fontSize: 14,
    fontWeight: '700',
    color: '#D13239',
  },
  changeNumText: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'underline',
  },
  submitBtn: {
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
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
