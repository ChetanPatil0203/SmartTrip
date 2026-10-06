import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  HelpCircle,
  Menu,
  ChevronDown,
  User,
  ShieldCheck,
  Settings,
  LogOut,
  ExternalLink,
  Check,
  Radio,
  AlertTriangle,
  X,
  ShieldAlert,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import MockPaymentBadge from '../common/MockPaymentBadge';
import Modal from '../common/Modal';
import { useNavigate } from 'react-router-dom';

export default function Topbar() {
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    setMobileMenuOpen,
    currentUser,
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    logout,
    backendOnline,
    socketConnected,
    activeEmergencyAlert,
    clearActiveEmergency,
    simulateSos,
  } = useAdmin();

  const navigate = useNavigate();

  // Dropdowns
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Close popovers on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header
        style={{
          height: '70px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          position: 'sticky',
          top: 0,
          zIndex: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        {/* Left Side: Collapse Toggle & Global Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="st-btn st-btn-ghost st-btn-icon"
            style={{ display: 'flex', color: '#475569' }}
            title="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>

          {/* Global Search Bar */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
            <Search
              size={17}
              color="#94A3B8"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search bookings, users, PNRs, tickets..."
              className="st-input"
              style={{
                paddingLeft: '38px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                fontSize: '0.84rem',
              }}
            />
          </div>
        </div>

        {/* Right Side: Socket.io Badge, SOS Test, Mock Payment Badge, Help, Notifications, Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Real-time Socket.IO Connection Badge */}
          <div
            title={socketConnected ? 'Real-time WebSocket connected to Backend' : 'Connecting to Socket.io server...'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '9999px',
              backgroundColor: socketConnected ? '#ECFDF5' : '#FFFBEB',
              border: `1px solid ${socketConnected ? '#A7F3D0' : '#FDE68A'}`,
              color: socketConnected ? '#065F46' : '#92400E',
              fontSize: '0.75rem',
              fontWeight: '700',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: socketConnected ? '#10B981' : '#F59E0B',
                boxShadow: socketConnected ? '0 0 6px #10B981' : 'none',
              }}
            />
            <span>{socketConnected ? 'Live Socket Online' : 'Connecting...'}</span>
          </div>

          {/* Test SOS Button (Demo & Simulation) */}
          <button
            type="button"
            onClick={() => simulateSos('Pooja Patil (Kolhapur-Goa Bus)')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: '8px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#DC2626',
              fontSize: '0.72rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
            title="Simulate real-time traveler SOS emergency trigger"
          >
            <ShieldAlert size={14} />
            <span>Test SOS</span>
          </button>

          {/* Mock Payment Environment indicator */}
          <MockPaymentBadge />

          {/* Quick Help Modal Trigger */}
          <button
            type="button"
            onClick={() => setHelpOpen(true)}
            className="st-btn st-btn-ghost st-btn-icon"
            style={{ color: '#64748B' }}
            title="SmartTrip Admin Help & Guidelines"
          >
            <HelpCircle size={20} />
          </button>

          {/* Notifications Dropdown */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen(!notifOpen)}
              className="st-btn st-btn-ghost st-btn-icon"
              style={{ position: 'relative', color: '#64748B' }}
              title="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    backgroundColor: '#D13239',
                    border: '2px solid #FFFFFF',
                  }}
                />
              )}
            </button>

            {/* Notifications Panel */}
            {notifOpen && (
              <div
                className="animate-fade-in"
                style={{
                  position: 'absolute',
                  top: '46px',
                  right: 0,
                  width: '360px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                  border: '1px solid #E2E8F0',
                  overflow: 'hidden',
                  zIndex: 200,
                }}
              >
                <div
                  style={{
                    padding: '14px 18px',
                    borderBottom: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#F8FAFC',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.875rem', color: '#0F172A' }}>
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: '800',
                          backgroundColor: '#D13239',
                          color: '#FFFFFF',
                          padding: '1px 6px',
                          borderRadius: '9999px',
                        }}
                      >
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#D13239',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                  {notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #F1F5F9',
                        backgroundColor: n.read ? '#FFFFFF' : '#FFF9F9',
                        cursor: 'pointer',
                        transition: 'background-color 150ms ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: n.read ? '600' : '700', color: '#1E293B' }}>
                          {n.title}
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>{n.date}</span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                        {n.message}
                      </p>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    padding: '10px',
                    textAlign: 'center',
                    borderTop: '1px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setNotifOpen(false);
                      navigate('/notifications');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#D13239',
                      fontSize: '0.8125rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    View All Notifications →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile Dropdown */}
          <div style={{ position: 'relative' }} ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '4px 8px',
                borderRadius: '10px',
                background: profileOpen ? '#F1F5F9' : 'transparent',
                border: '1px solid transparent',
                cursor: 'pointer',
                transition: 'background-color 150ms ease',
              }}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  border: '2px solid #E2E8F0',
                }}
              />
              <div style={{ textAlign: 'left', display: 'none', lg: 'block' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#0F172A', lineHeight: 1.2 }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: '0.6875rem', fontWeight: '600', color: '#D13239' }}>
                  Super Admin
                </div>
              </div>
              <ChevronDown size={14} color="#64748B" />
            </button>

            {/* Profile Dropdown Menu */}
            {profileOpen && (
              <div
                className="animate-fade-in"
                style={{
                  position: 'absolute',
                  top: '50px',
                  right: 0,
                  width: '240px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                  border: '1px solid #E2E8F0',
                  padding: '8px 0',
                  zIndex: 200,
                }}
              >
                <div style={{ padding: '10px 16px', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.875rem', color: '#0F172A' }}>
                    {currentUser.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {currentUser.email}
                  </div>
                  <div
                    style={{
                      display: 'inline-block',
                      marginTop: '6px',
                      fontSize: '0.6875rem',
                      fontWeight: '800',
                      color: '#D13239',
                      backgroundColor: '#FFF0F0',
                      border: '1px solid #FECACA',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    SUPER ADMIN ACCESS
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/settings');
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 16px',
                    background: 'none',
                    border: 'none',
                    fontSize: '0.8125rem',
                    color: '#1E293B',
                    fontWeight: '500',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <User size={16} color="#64748B" />
                  <span>Admin Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/settings');
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 16px',
                    background: 'none',
                    border: 'none',
                    fontSize: '0.8125rem',
                    color: '#1E293B',
                    fontWeight: '500',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <Settings size={16} color="#64748B" />
                  <span>Platform Settings</span>
                </button>

                <div style={{ height: '1px', backgroundColor: '#F1F5F9', margin: '4px 0' }} />

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 16px',
                    background: 'none',
                    border: 'none',
                    fontSize: '0.8125rem',
                    color: '#DC2626',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <LogOut size={16} color="#DC2626" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Real-time Emergency SOS Active Banner */}
      {activeEmergencyAlert && (
        <div
          style={{
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
            zIndex: 75,
            position: 'sticky',
            top: '70px',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                display: 'inline-flex',
                padding: '6px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
              }}
            >
              <AlertTriangle size={18} color="#FFFFFF" />
            </span>
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: '800', letterSpacing: '0.025em' }}>
                🚨 आणीबाणी सूचना (CRITICAL SOS ALERT): {activeEmergencyAlert.userName}
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                स्थान: {activeEmergencyAlert.location?.address || 'GPS Coords received'} • {activeEmergencyAlert.note}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={() => {
                navigate('/safety');
              }}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#DC2626',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 14px',
                fontWeight: '700',
                fontSize: '0.78rem',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              }}
            >
              तपासणी करा (Investigate) →
            </button>
            <button
              type="button"
              onClick={clearActiveEmergency}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: '#FFFFFF',
                borderRadius: '6px',
                padding: '6px',
                cursor: 'pointer',
              }}
              title="Dismiss banner"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Help & Documentation Modal */}
      <Modal
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
        title="SmartTrip Super Admin Guide"
        subtitle="Platform operation protocols and environment information"
        footer={
          <button
            type="button"
            onClick={() => setHelpOpen(false)}
            className="st-btn st-btn-primary"
          >
            Got it
          </button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.84rem', color: '#334155' }}>
          <div style={{ padding: '12px 14px', backgroundColor: '#FFFBEB', borderRadius: '10px', border: '1px solid #FDE68A' }}>
            <strong style={{ color: '#92400E', display: 'block', marginBottom: '4px' }}>
              ⚠️ Mock Payment Environment Active
            </strong>
            <p style={{ margin: 0, color: '#B45309', fontSize: '0.8rem' }}>
              All transactions, cancellations, and refunds are running in a simulated mock payment sandbox. Real credit cards or banking rails are not charged.
            </p>
          </div>

          <div>
            <h4 style={{ fontWeight: '700', color: '#0F172A', marginBottom: '6px' }}>
              Role Permissions
            </h4>
            <p style={{ margin: 0, lineHeight: 1.5 }}>
              You are logged in as <strong>Super Admin</strong>. You possess unrestricted authority over travel scheduling, user accounts, refund approvals, and delay broadcasts across all 6 transport verticals (Bus, Train, Flight, Hotel, Cab, and Auto).
            </p>
          </div>

          <div>
            <h4 style={{ fontWeight: '700', color: '#0F172A', marginBottom: '6px' }}>
              Support Escalations
            </h4>
            <p style={{ margin: 0, lineHeight: 1.5 }}>
              Customer tickets and safety incidents are monitored 24/7. Use the <strong>Safety</strong> tab to investigate high-priority driver reports and telemetry alerts.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
