import React from 'react';

export default function BookingStatusChart({ data }) {
  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Visual Stacked Progress Bar */}
      <div>
        <div
          style={{
            height: '14px',
            backgroundColor: '#F1F5F9',
            borderRadius: '9999px',
            overflow: 'hidden',
            display: 'flex',
            width: '100%',
          }}
        >
          {data.map((item) => (
            <div
              key={item.label}
              style={{
                width: `${item.percentage}%`,
                backgroundColor: item.color,
                height: '100%',
                transition: 'width 250ms ease',
              }}
              title={`${item.label}: ${item.count} (${item.percentage}%)`}
            />
          ))}
        </div>
      </div>

      {/* Grid of Status stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '12px',
        }}
      >
        {data.map((item) => (
          <div
            key={item.label}
            style={{
              padding: '12px',
              backgroundColor: '#F8FAFC',
              borderRadius: '8px',
              border: '1px solid #F1F5F9',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: item.color,
                }}
              />
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748B' }}>
                {item.label}
              </span>
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: '800', color: '#0F172A' }}>
              {item.count.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#94A3B8', fontWeight: '500' }}>
              {item.percentage}% of all bookings
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
