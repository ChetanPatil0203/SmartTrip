import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  Users,
  Compass,
  CalendarCheck,
  CreditCard,
  TicketPercent,
  Bell,
  Headphones,
  ShieldCheck,
  Star,
  Activity,
  BarChart3,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';
import Logo from '../common/Logo';
import { useAdmin } from '../../context/AdminContext';

export default function AdminSidebar() {
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileMenuOpen,
    setMobileMenuOpen,
    unreadCount,
    logout,
  } = useAdmin();

  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'AI Copilot & Planner', to: '/ai-copilot', icon: Sparkles, badge: 'AI' },
    { label: 'Users', to: '/users', icon: Users },
    {
      label: 'Travel Management',
      to: '/travel',
      icon: Compass,
      matchPrefix: '/travel',
    },
    { label: 'Bookings', to: '/bookings', icon: CalendarCheck },
    { label: 'Payments & Refunds', to: '/payments', icon: CreditCard },
    { label: 'Offers & Coupons', to: '/offers', icon: TicketPercent },
    {
      label: 'Notifications',
      to: '/notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : null,
    },
    { label: 'Support', to: '/support', icon: Headphones },
    { label: 'Safety', to: '/safety', icon: ShieldCheck },
    { label: 'Reviews', to: '/reviews', icon: Star },
    { label: 'Tracking & Delays', to: '/tracking', icon: Activity },
    { label: 'Reports & Analytics', to: '/reports', icon: BarChart3 },
    { label: 'Audit Logs', to: '/audit-logs', icon: FileText },
    { label: 'Settings', to: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 90,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Fixed Sidebar */}
      <aside
        style={{
          width: sidebarCollapsed ? '72px' : '260px',
          height: '100vh',
          backgroundColor: '#0F172A',
          color: '#E2E8F0',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.2)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            height: '70px',
            padding: sidebarCollapsed ? '0 12px' : '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Logo collapsed={sidebarCollapsed} light={true} />
        </div>

        {/* Navigation Items */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: sidebarCollapsed ? '16px 8px' : '16px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.matchPrefix
              ? location.pathname.startsWith(item.matchPrefix)
              : location.pathname === item.to;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                title={sidebarCollapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: sidebarCollapsed ? '10px 0' : '10px 14px',
                  justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                  borderRadius: '10px',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  backgroundColor: isActive ? '#D13239' : 'transparent',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '0.84rem',
                  textDecoration: 'none',
                  transition: 'all 150ms ease',
                  boxShadow: isActive ? '0 4px 14px rgba(209, 50, 57, 0.35)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#1E293B';
                    e.currentTarget.style.color = '#FFFFFF';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#94A3B8';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={19} strokeWidth={isActive ? 2.4 : 1.8} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </div>

                {!sidebarCollapsed && item.badge && (
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: '800',
                      backgroundColor: '#D13239',
                      color: '#FFFFFF',
                      padding: '2px 7px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer with Sign Out */}
        <div
          style={{
            padding: '14px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <button
            type="button"
            onClick={logout}
            title={sidebarCollapsed ? 'Sign Out' : undefined}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              backgroundColor: 'transparent',
              color: '#EF4444',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              cursor: 'pointer',
              fontSize: '0.84rem',
              fontWeight: '600',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FEF2F2';
              e.currentTarget.style.color = '#DC2626';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#EF4444';
            }}
          >
            <LogOut size={18} />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
