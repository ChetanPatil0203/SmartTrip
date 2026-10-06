import React from 'react';
import TravelBadge from '../common/TravelBadge';

export default function TravelDistributionChart({ data }) {
  // SVG Donut calculation
  const size = 180;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '28px',
          flexWrap: 'wrap',
        }}
      >
        {/* SVG Donut */}
        <div style={{ position: 'relative', width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
              {data.map((item, idx) => {
                const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
                accumulatedPercent += item.percentage;

                return (
                  <circle
                    key={idx}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: 'stroke-dasharray 300ms ease' }}
                  />
                );
              })}
            </g>
          </svg>

          {/* Donut Center Label */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', lineHeight: 1 }}>
              18.4k
            </div>
            <div style={{ fontSize: '0.6875rem', fontWeight: '600', color: '#64748B', marginTop: '2px' }}>
              Total Trips
            </div>
          </div>
        </div>

        {/* Legend List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '180px' }}>
          {data.map((item) => (
            <div
              key={item.type}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8125rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: item.color,
                  }}
                />
                <span style={{ fontWeight: '600', color: '#1E293B' }}>{item.type}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: '700', color: '#0F172A' }}>{item.percentage}%</span>
                <span style={{ color: '#64748B', fontSize: '0.75rem' }}>({item.count})</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bars Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
        {data.map((item) => (
          <div key={item.type}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                marginBottom: '4px',
                fontWeight: '600',
              }}
            >
              <span style={{ color: '#334155' }}>{item.type} Share</span>
              <span style={{ color: '#64748B' }}>Revenue: <strong style={{ color: '#0F172A' }}>{item.revenue}</strong></span>
            </div>
            <div
              style={{
                height: '6px',
                backgroundColor: '#F1F5F9',
                borderRadius: '9999px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                  borderRadius: '9999px',
                  transition: 'width 300ms ease',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
