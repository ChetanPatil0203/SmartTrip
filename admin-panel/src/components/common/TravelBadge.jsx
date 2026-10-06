import React from 'react';
import { Bus, Train, Plane, Building2, Car } from 'lucide-react';
import { colors } from '../../styles/tokens';

export default function TravelBadge({ type, showIcon = true, size = 'md' }) {
  if (!type) return null;
  const t = String(type).toLowerCase();

  let Icon = Bus;
  let config = colors.travel.bus;
  let customEmoji = null;

  if (t === 'train') {
    Icon = Train;
    config = colors.travel.train;
  } else if (t === 'flight') {
    Icon = Plane;
    config = colors.travel.flight;
  } else if (t === 'hotel') {
    Icon = Building2;
    config = colors.travel.hotel;
  } else if (t === 'cab') {
    Icon = Car;
    config = colors.travel.cab;
  } else if (t === 'auto') {
    customEmoji = '🛺';
    config = colors.travel.auto;
  }

  const isSmall = size === 'sm';
  const iconSize = isSmall ? 12 : 14;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: isSmall ? '2px 8px' : '4px 10px',
        borderRadius: '6px',
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        fontSize: isSmall ? '0.75rem' : '0.8125rem',
        fontWeight: '700',
        lineHeight: 1.2,
      }}
    >
      {showIcon && (
        customEmoji ? (
          <span style={{ fontSize: iconSize, lineHeight: 1 }}>{customEmoji}</span>
        ) : (
          <Icon size={iconSize} strokeWidth={2.4} />
        )
      )}
      <span>{config.label}</span>
    </span>
  );
}
