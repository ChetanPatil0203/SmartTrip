import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function KpiCard({
  icon: Icon,
  label,
  value,
  change,
  period = 'vs last month',
  trend = 'up',
  accentColor = '#D13239',
  bgTint = '#FFF0F0',
}) {
  const isPositive = trend === 'up';

  return (
    <div
      className="st-card st-card-hover"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Accent Strip */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          backgroundColor: accentColor,
        }}
      />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: '600',
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {label}
          </span>
          <div
            style={{
              fontSize: '1.75rem',
              fontWeight: '800',
              color: '#0F172A',
              letterSpacing: '-0.02em',
              marginTop: '4px',
              lineHeight: 1.1,
            }}
          >
            {value}
          </div>
        </div>

        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: bgTint,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accentColor,
            flexShrink: 0,
          }}
        >
          {Icon && <Icon size={22} strokeWidth={2.2} />}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            fontWeight: '700',
            color: isPositive ? '#059669' : '#DC2626',
            backgroundColor: isPositive ? '#ECFDF5' : '#FEF2F2',
            padding: '2px 6px',
            borderRadius: '4px',
          }}
        >
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change}
        </span>
        <span style={{ color: '#64748B' }}>{period}</span>
      </div>
    </div>
  );
}
