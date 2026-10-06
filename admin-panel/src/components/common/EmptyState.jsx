import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No records found',
  message = 'There is currently no data to display for this view.',
  action = null,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          backgroundColor: '#F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94A3B8',
          marginBottom: '16px',
        }}
      >
        <Icon size={28} />
      </div>
      <h3
        style={{
          fontSize: '1rem',
          fontWeight: '700',
          color: '#1E293B',
          margin: '0 0 6px 0',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: '0.8125rem',
          color: '#64748B',
          maxWidth: '380px',
          margin: '0 0 16px 0',
          lineHeight: 1.4,
        }}
      >
        {message}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
