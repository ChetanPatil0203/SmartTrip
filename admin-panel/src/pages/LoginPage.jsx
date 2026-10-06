import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { useAdmin } from '../context/AdminContext';

export default function LoginPage() {
  const [email, setEmail] = useState('chetan.admin@smarttrip.com');
  const [password, setPassword] = useState('SuperAdmin@2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      login(email, password);
      setIsSubmitting(false);
      navigate('/dashboard');
    }, 600);
  };

  const handleDemoFill = () => {
    setEmail('chetan.admin@smarttrip.com');
    setPassword('SuperAdmin@2026');
    setErrorMsg('');
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Left Column: Brand Message & Travel Visuals */}
      <div
        style={{
          flex: '1 1 45%',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '60px 48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle Ambient Background Glows */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '-10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(209, 50, 57, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-10%',
            right: '-10%',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top Logo */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Logo light={true} />
        </div>

        {/* Hero Travel Pitch */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '480px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(209, 50, 57, 0.15)',
              border: '1px solid rgba(209, 50, 57, 0.4)',
              color: '#F87171',
              fontSize: '0.75rem',
              fontWeight: '700',
              marginBottom: '20px',
            }}
          >
            <ShieldCheck size={14} />
            <span>ENTERPRISE MOBILITY PORTAL</span>
          </div>

          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: '900',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '16px',
            }}
          >
            Unified Control for All 6 Travel Networks.
          </h2>

          <p
            style={{
              fontSize: '1rem',
              color: '#94A3B8',
              lineHeight: 1.6,
              marginBottom: '32px',
            }}
          >
            Orchestrate Bus, Train, Flight, Hotel, Cab, and Auto fleets across Maharashtra and India with instant booking verification, mock financial audits, and real-time operations.
          </p>

          {/* Feature Highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              'Complete multi-modal booking oversight (Bus, Train, Flight, Hotel, Cab, Auto)',
              'Simulated mock payment verification & refund reconciliation',
              'Instant delay alerts broadcast and passenger safety telemetry',
            ].map((feat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="#D13239" />
                <span style={{ fontSize: '0.875rem', color: '#E2E8F0', fontWeight: '500' }}>
                  {feat}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: '#64748B',
          }}
        >
          <span>SmartTrip Core Engine v2.4</span>
          <span>Role: Super Admin Restricted</span>
        </div>
      </div>

      {/* Right Column: Premium Login Form */}
      <div
        style={{
          flex: '1 1 55%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 32px',
          backgroundColor: '#FFFFFF',
        }}
      >
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1
              style={{
                fontSize: '1.875rem',
                fontWeight: '900',
                color: '#0F172A',
                letterSpacing: '-0.02em',
                margin: '0 0 8px 0',
              }}
            >
              Super Admin Sign In
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#64748B', margin: 0 }}>
              Enter your privileged credentials to manage the platform.
            </p>
          </div>

          {/* Quick Demo Fill Button */}
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#FFF0F0',
              border: '1px solid #FECACA',
              borderRadius: '10px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#D13239' }}>
                Quick Test Credentials
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#475569' }}>
                chetan.admin@smarttrip.com • SuperAdmin@2026
              </div>
            </div>
            <button
              type="button"
              onClick={handleDemoFill}
              style={{
                background: '#D13239',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              Fill Demo
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div
              style={{
                padding: '10px 14px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '8px',
                color: '#DC2626',
                fontSize: '0.8125rem',
                marginBottom: '20px',
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Email Field */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: '700',
                  color: '#1E293B',
                  marginBottom: '6px',
                }}
              >
                Admin Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  color="#94A3B8"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@smarttrip.com"
                  className="st-input"
                  style={{ paddingLeft: '38px', height: '44px' }}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: '700',
                  color: '#1E293B',
                  marginBottom: '6px',
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  color="#94A3B8"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="st-input"
                  style={{ paddingLeft: '38px', height: '44px' }}
                  required
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8125rem',
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#475569' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#D13239', width: '16px', height: '16px' }}
                />
                <span>Remember this device</span>
              </label>
              <button
                type="button"
                onClick={() => alert('Password reset link sent to super admin corporate address.')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#D13239',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '0.8125rem',
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="st-btn st-btn-primary st-btn-lg"
              style={{
                width: '100%',
                height: '46px',
                fontSize: '0.9375rem',
                fontWeight: '700',
                marginTop: '8px',
              }}
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Access Super Admin Panel'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Security footnote */}
          <div
            style={{
              marginTop: '32px',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              textAlign: 'center',
              fontSize: '0.75rem',
              color: '#64748B',
            }}
          >
            🔒 Protected by 256-bit TLS encryption & Super Admin MFA.
          </div>
        </div>
      </div>
    </div>
  );
}
