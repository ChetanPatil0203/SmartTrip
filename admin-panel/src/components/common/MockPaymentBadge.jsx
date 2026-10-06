import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export default function MockPaymentBadge({ minimal = false }) {
  if (minimal) {
    return (
      <span
        title="Transactions run in SmartTrip Simulated Mock Payment Sandbox"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '3px 8px',
          borderRadius: '9999px',
          backgroundColor: '#FFFBEB',
          border: '1px solid #FDE68A',
          color: '#92400E',
          fontSize: '0.6875rem',
          fontWeight: '600',
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#D97706',
            display: 'inline-block',
          }}
        />
        Mock Payment Environment
      </span>
    );
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '5px 12px',
        borderRadius: '8px',
        backgroundColor: '#FFFBEB',
        border: '1px solid #FDE68A',
        color: '#92400E',
        fontSize: '0.75rem',
        fontWeight: '600',
      }}
    >
      <ShieldCheck size={14} color="#D97706" />
      <span>Mock Payment Environment</span>
      <span
        style={{
          fontSize: '0.6875rem',
          color: '#B45309',
          padding: '1px 6px',
          background: '#FEF3C7',
          borderRadius: '4px',
          fontWeight: '700',
        }}
      >
        SIMULATED
      </span>
    </div>
  );
}
