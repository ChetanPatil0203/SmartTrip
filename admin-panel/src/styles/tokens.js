/**
 * SmartTrip Centralized Design Tokens
 * Reused faithfully from the SmartTrip mobile ecosystem.
 * Primary Brand: SmartTrip Red #D13239
 */

export const colors = {
  // Brand
  primary: '#D13239',
  primaryHover: '#B8282F',
  primaryLight: '#FFF0F0',
  primarySubtle: '#FEE2E2',
  primaryDark: '#991B1B',

  // Slate & Dark Brand Neutrals
  slateNavy: '#1E293B',
  darkTitle: '#0F172A',
  textPrimary: '#1E293B',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textLight: '#94A3B8',

  // Surfaces & Backgrounds
  appBg: '#F8FAFC',
  cardBg: '#FFFFFF',
  cardAlt: '#F1F5F9',
  sidebarBg: '#0F172A',
  sidebarHover: '#1E293B',
  sidebarActive: '#D13239',
  topbarBg: '#FFFFFF',

  // Borders & Dividers
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderDark: '#CBD5E1',

  // Travel Categories (Matched 1:1 with SmartTrip App)
  travel: {
    bus: {
      color: '#D13239',
      bg: '#FFF0F0',
      border: '#FECACA',
      label: 'Bus',
    },
    train: {
      color: '#2563EB',
      bg: '#EFF6FF',
      border: '#BFDBFE',
      label: 'Train',
    },
    flight: {
      color: '#0284C7',
      bg: '#F0F9FF',
      border: '#BAE6FD',
      label: 'Flight',
    },
    hotel: {
      color: '#059669',
      bg: '#ECFDF5',
      border: '#A7F3D0',
      label: 'Hotel',
    },
    cab: {
      color: '#475569',
      bg: '#F8FAFC',
      border: '#E2E8F0',
      label: 'Cab',
    },
    auto: {
      color: '#D97706',
      bg: '#FFFBEB',
      border: '#FDE68A',
      label: 'Auto',
    },
  },

  // Semantic Status Colors
  status: {
    confirmed: {
      color: '#059669',
      bg: '#ECFDF5',
      border: '#A7F3D0',
      label: 'Confirmed',
    },
    success: {
      color: '#059669',
      bg: '#ECFDF5',
      border: '#A7F3D0',
      label: 'Success',
    },
    pending: {
      color: '#D97706',
      bg: '#FFFBEB',
      border: '#FDE68A',
      label: 'Pending',
    },
    cancelled: {
      color: '#DC2626',
      bg: '#FEF2F2',
      border: '#FECACA',
      label: 'Cancelled',
    },
    refunded: {
      color: '#7C3AED',
      bg: '#F5F3FF',
      border: '#DDD6FE',
      label: 'Refunded',
    },
    completed: {
      color: '#2563EB',
      bg: '#EFF6FF',
      border: '#BFDBFE',
      label: 'Completed',
    },
    onTime: {
      color: '#059669',
      bg: '#ECFDF5',
      border: '#A7F3D0',
      label: 'On Time',
    },
    delayed: {
      color: '#EA580C',
      bg: '#FFF7ED',
      border: '#FFEDD5',
      label: 'Delayed',
    },
    active: {
      color: '#059669',
      bg: '#ECFDF5',
      border: '#A7F3D0',
      label: 'Active',
    },
    suspended: {
      color: '#DC2626',
      bg: '#FEF2F2',
      border: '#FECACA',
      label: 'Suspended',
    },
  },

  // Mock Payment Environment
  mockPayment: {
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
    badgeBorder: '#FCD34D',
    iconColor: '#D97706',
  },
};

export const typography = {
  fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.8125rem',  // 13px
    base: '0.875rem', // 14px
    md: '0.9375rem',  // 15px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
};

export const borderRadius = {
  sm: '6px',
  md: '10px',
  lg: '14px',
  xl: '18px',
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
  card: '0 2px 8px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.02)',
  glow: '0 0 20px rgba(209, 50, 57, 0.15)',
};
