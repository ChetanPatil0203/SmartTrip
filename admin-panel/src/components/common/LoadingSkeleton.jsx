import React from 'react';

export default function LoadingSkeleton({ rows = 4, height = '36px' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', padding: '16px' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            height,
            backgroundColor: '#F1F5F9',
            borderRadius: '6px',
            animation: 'pulseGlow 1.5s infinite ease-in-out',
            width: i === 0 ? '100%' : `${100 - (i % 3) * 15}%`,
          }}
        />
      ))}
    </div>
  );
}
