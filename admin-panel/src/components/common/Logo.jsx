import React from 'react';

export function SmartTripLogoIcon({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 100 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      {/* Red Location Pin Base */}
      <path
        d="M50 5C27.91 5 10 22.91 10 45C10 70 50 110 50 110C50 110 90 70 90 45C90 22.91 72.09 5 50 5Z"
        fill="#D13239"
      />
      {/* Inner White Road Curve */}
      <path
        d="M36 78C42 60 42 46 60 26C64 22 70 20 74 18C64 26 54 38 48 56C45 65 44 73 42 80Z"
        fill="#FFFFFF"
      />
      <path
        d="M48 80C50 71 54 58 64 44C68 38 74 31 80 26C76 32 70 40 64 48C58 60 54 70 52 80Z"
        fill="#FFFFFF"
        opacity="0.8"
      />
      {/* Top Right Flying Airplane accent */}
      <path d="M74 10L94 3L86 23L78 16L71 18L76 11L74 10Z" fill="#D13239" />
    </svg>
  );
}

export function Logo({ collapsed = false, showBadge = true, light = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
      <SmartTripLogoIcon size={collapsed ? 28 : 34} />
      {!collapsed && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <span
              style={{
                fontSize: '1.25rem',
                fontWeight: '900',
                color: light ? '#FFFFFF' : '#1E293B',
                letterSpacing: '-0.5px',
              }}
            >
              Smart
            </span>
            <span
              style={{
                fontSize: '1.25rem',
                fontWeight: '900',
                color: '#D13239',
                letterSpacing: '-0.5px',
              }}
            >
              Trip
            </span>
          </div>
          {showBadge && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
              <span
                style={{
                  fontSize: '0.625rem',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: light ? '#94A3B8' : '#D13239',
                  background: light ? 'rgba(255,255,255,0.1)' : '#FFF0F0',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  border: light ? '1px solid rgba(255,255,255,0.15)' : '1px solid #FECACA',
                }}
              >
                SUPER ADMIN
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Logo;
