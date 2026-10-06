import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Sliders,
  Bell,
  Save,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { useAdmin } from '../context/AdminContext';

export default function SettingsPage() {
  const { currentUser, setCurrentUser, showToast, logAudit } = useAdmin();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'security' | 'system' | 'notifications'

  // Profile Form
  const [profileForm, setProfileForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    department: currentUser.department,
    avatar: currentUser.avatar,
  });

  // Security Form
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });

  // System Config
  const [systemConfig, setSystemConfig] = useState({
    mockPaymentEnabled: true,
    platformFeePercent: 2.5,
    maxPassengersPerBooking: 6,
    maintenanceMode: false,
    currencySymbol: 'INR (₹)',
    autoConfirmMockBookings: true,
  });

  // Notification Preferences
  const [notifPrefs, setNotifPrefs] = useState({
    bookingAlerts: true,
    paymentAlerts: true,
    delayAlerts: true,
    supportAlerts: true,
    safetySosAlerts: true,
    dailyDigestEmail: false,
  });

  const handleProfileSave = (e) => {
    e.preventDefault();
    setCurrentUser((prev) => ({
      ...prev,
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
      department: profileForm.department,
      avatar: profileForm.avatar,
    }));
    showToast('Super Admin profile updated successfully!', 'success');
    logAudit('ADMIN_PROFILE_UPDATE', 'Settings', profileForm.email);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    showToast('Admin password changed successfully!', 'success');
    logAudit('PASSWORD_CHANGED', 'Security', 'Super Admin');
    setPasswords({ current: '', newPass: '', confirm: '' });
  };

  const handleSystemSave = (e) => {
    e.preventDefault();
    showToast('Platform system configuration updated.', 'success');
    logAudit('SYSTEM_CONFIG_UPDATE', 'Settings', 'Platform Configuration');
  };

  return (
    <div>
      <PageHeader
        title="Settings & System Configuration"
        subtitle="Manage super admin profile, security policies, mock payment parameters, and platform alerts"
        breadcrumbs={[{ label: 'Settings' }]}
      />

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid #E2E8F0',
          marginBottom: '24px',
          overflowX: 'auto',
        }}
      >
        {[
          { id: 'profile', label: 'Admin Profile', icon: User },
          { id: 'security', label: 'Security & Access', icon: Shield },
          { id: 'system', label: 'System Configuration', icon: Sliders },
          { id: 'notifications', label: 'Notification Rules', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 18px',
                border: 'none',
                borderBottom: isActive ? '3px solid #D13239' : '3px solid transparent',
                backgroundColor: 'transparent',
                color: isActive ? '#D13239' : '#64748B',
                fontWeight: isActive ? '800' : '600',
                fontSize: '0.875rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 140ms ease',
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB: PROFILE */}
      {activeTab === 'profile' && (
        <div className="st-card" style={{ padding: '28px', maxWidth: '680px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #F1F5F9' }}>
            <img
              src={profileForm.avatar}
              alt={currentUser.name}
              style={{ width: '72px', height: '72px', borderRadius: '16px', objectFit: 'cover', border: '3px solid #E2E8F0' }}
            />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', margin: '0 0 4px 0' }}>
                {currentUser.name}
              </h3>
              <div style={{ display: 'inline-block', fontSize: '0.6875rem', fontWeight: '800', color: '#D13239', backgroundColor: '#FFF0F0', border: '1px solid #FECACA', padding: '2px 8px', borderRadius: '4px' }}>
                SUPER ADMIN
              </div>
            </div>
          </div>

          <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>
                Full Name
              </label>
              <input
                type="text"
                required
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="st-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>
                Admin Email
              </label>
              <input
                type="email"
                required
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="st-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>
                Phone Number
              </label>
              <input
                type="text"
                required
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="st-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>
                Department / Responsibility
              </label>
              <input
                type="text"
                value={profileForm.department}
                onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                className="st-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>
                Avatar Image URL
              </label>
              <input
                type="text"
                value={profileForm.avatar}
                onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                className="st-input"
              />
            </div>

            <button
              type="submit"
              className="st-btn st-btn-primary"
              style={{ alignSelf: 'flex-start', marginTop: '10px' }}
            >
              <Save size={16} />
              <span>Save Changes</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB: SECURITY */}
      {activeTab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '680px' }}>
          <div className="st-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0F172A', marginBottom: '16px' }}>
              Change Super Admin Password
            </h3>
            <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  className="st-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwords.newPass}
                  onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                  className="st-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  className="st-input"
                />
              </div>

              <button
                type="submit"
                className="st-btn st-btn-primary"
                style={{ alignSelf: 'flex-start', marginTop: '8px' }}
              >
                <Lock size={15} />
                <span>Update Password</span>
              </button>
            </form>
          </div>

          <div className="st-card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>
              Active Super Admin Session
            </h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#334155' }}>
              <span>Current Session Origin: <strong>Windows PC (Chrome 128 / Edge)</strong></span>
              <span style={{ color: '#059669', fontWeight: '700' }}>Active Now</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
              IP: 192.168.1.104 • Signed in at 08:30 IST
            </div>
          </div>
        </div>
      )}

      {/* TAB: SYSTEM CONFIGURATION */}
      {activeTab === 'system' && (
        <div className="st-card" style={{ padding: '28px', maxWidth: '680px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '800', color: '#0F172A', marginBottom: '16px' }}>
            Platform Engine & Mock Payment Parameters
          </h3>

          <form onSubmit={handleSystemSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Mock Payment switch */}
            <div style={{ padding: '16px', backgroundColor: '#FFFBEB', borderRadius: '10px', border: '1px solid #FDE68A' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '0.875rem', color: '#92400E', display: 'block' }}>
                    Mock Payment Environment
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: '#B45309' }}>
                    Simulate instant approvals & wallet refunds without live payment gateways.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={systemConfig.mockPaymentEnabled}
                  onChange={(e) => setSystemConfig({ ...systemConfig, mockPaymentEnabled: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#D97706' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>
                Platform Convenience Fee (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={systemConfig.platformFeePercent}
                onChange={(e) => setSystemConfig({ ...systemConfig, platformFeePercent: Number(e.target.value) })}
                className="st-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>
                Maximum Seats / Travelers per Single Booking
              </label>
              <input
                type="number"
                value={systemConfig.maxPassengersPerBooking}
                onChange={(e) => setSystemConfig({ ...systemConfig, maxPassengersPerBooking: Number(e.target.value) })}
                className="st-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>
                Base Currency Standard
              </label>
              <input
                type="text"
                disabled
                value={systemConfig.currencySymbol}
                className="st-input"
                style={{ backgroundColor: '#F8FAFC' }}
              />
            </div>

            <button
              type="submit"
              className="st-btn st-btn-primary"
              style={{ alignSelf: 'flex-start' }}
            >
              <Save size={16} />
              <span>Save System Settings</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="st-card" style={{ padding: '28px', maxWidth: '680px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '800', color: '#0F172A', marginBottom: '16px' }}>
            Super Admin Notification Subscriptions
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { key: 'bookingAlerts', title: 'New Multi-Modal Booking Alerts', desc: 'Trigger toast whenever a passenger reserves Bus, Train, Flight, Hotel, Cab, or Auto.' },
              { key: 'paymentAlerts', title: 'Mock Payment & Refund Clearances', desc: 'Notify on simulated transaction failures or queued customer refunds.' },
              { key: 'delayAlerts', title: 'Real-Time Schedule Delays', desc: 'Send notifications when vehicles report >15m transit deviations.' },
              { key: 'safetySosAlerts', title: 'Safety Center SOS Escalations', desc: 'Immediate high-priority notification on reported in-cab incidents.' },
              { key: 'supportAlerts', title: 'Support Ticket Inquiries', desc: 'Alert when passengers submit urgent booking inquiries.' },
            ].map((item) => (
              <label
                key={item.key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px',
                  borderRadius: '8px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  cursor: 'pointer',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0F172A' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                    {item.desc}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifPrefs[item.key]}
                  onChange={(e) => {
                    setNotifPrefs({ ...notifPrefs, [item.key]: e.target.checked });
                    showToast('Notification preference saved', 'info');
                  }}
                  style={{ width: '18px', height: '18px', accentColor: '#D13239' }}
                />
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
