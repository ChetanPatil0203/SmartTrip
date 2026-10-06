import React from 'react';

export default function StatusBadge({ status, size = 'md' }) {
  if (!status) return null;

  const s = String(status).toLowerCase();

  let bg = '#F1F5F9';
  let color = '#475569';
  let border = '#E2E8F0';
  let dotColor = '#64748B';
  let label = status;

  if (s === 'confirmed' || s === 'success' || s === 'active' || s === 'resolved' || s === 'published' || s === 'completed' || s === 'processed' || s === 'on time' || s === 'on_time') {
    bg = '#ECFDF5';
    color = '#065F46';
    border = '#A7F3D0';
    dotColor = '#10B981';
    label = s === 'on_time' ? 'On Time' : label;
  } else if (s === 'pending' || s === 'in progress' || s === 'in_progress' || s === 'investigating' || s === 'open') {
    bg = '#FFFBEB';
    color = '#92400E';
    border = '#FDE68A';
    dotColor = '#F59E0B';
    label = s === 'in_progress' ? 'In Progress' : label;
  } else if (s === 'cancelled' || s === 'failed' || s === 'suspended' || s === 'critical' || s === 'high' || s === 'urgent') {
    bg = '#FEF2F2';
    color = '#991B1B';
    border = '#FECACA';
    dotColor = '#EF4444';
  } else if (s === 'refunded') {
    bg = '#F5F3FF';
    color = '#5B21B6';
    border = '#DDD6FE';
    dotColor = '#8B5CF6';
  } else if (s === 'delayed') {
    bg = '#FFF7ED';
    color = '#9A3412';
    border = '#FFEDD5';
    dotColor = '#EA580C';
  } else if (s === 'en route' || s === 'en_route') {
    bg = '#EFF6FF';
    color = '#1E40AF';
    border = '#BFDBFE';
    dotColor = '#3B82F6';
    label = 'En Route';
  } else if (s === 'hidden' || s === 'offline / gps inactive') {
    bg = '#F1F5F9';
    color = '#64748B';
    border = '#E2E8F0';
    dotColor = '#94A3B8';
  }

  const isSmall = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSmall ? '4px' : '6px',
        padding: isSmall ? '2px 7px' : '4px 10px',
        borderRadius: '9999px',
        backgroundColor: bg,
        color: color,
        border: `1px solid ${border}`,
        fontSize: isSmall ? '0.6875rem' : '0.75rem',
        fontWeight: '600',
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: isSmall ? '5px' : '6px',
          height: isSmall ? '5px' : '6px',
          borderRadius: '50%',
          backgroundColor: dotColor,
        }}
      />
      {label}
    </span>
  );
}
