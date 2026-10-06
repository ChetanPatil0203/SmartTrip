import React from 'react';
import {
  CalendarCheck,
  CreditCard,
  AlertTriangle,
  RotateCcw,
  UserPlus,
  ShieldCheck,
  Bell,
  Clock,
} from 'lucide-react';

export default function ActivityTimeline({ activities = [] }) {
  const getIcon = (type) => {
    switch (type) {
      case 'booking':
        return { Icon: CalendarCheck, color: '#D13239', bg: '#FFF0F0' };
      case 'payment':
        return { Icon: CreditCard, color: '#059669', bg: '#ECFDF5' };
      case 'delay':
        return { Icon: Clock, color: '#D97706', bg: '#FFFBEB' };
      case 'refund':
        return { Icon: RotateCcw, color: '#7C3AED', bg: '#F5F3FF' };
      case 'user':
        return { Icon: UserPlus, color: '#2563EB', bg: '#EFF6FF' };
      case 'safety':
        return { Icon: ShieldCheck, color: '#DC2626', bg: '#FEF2F2' };
      default:
        return { Icon: Bell, color: '#475569', bg: '#F1F5F9' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {activities.map((item, index) => {
        const { Icon, color, bg } = getIcon(item.type);
        const isLast = index === activities.length - 1;

        return (
          <div
            key={item.id}
            style={{
              display: 'flex',
              gap: '14px',
              position: 'relative',
              paddingBottom: isLast ? '0' : '20px',
            }}
          >
            {/* Vertical connector line */}
            {!isLast && (
              <div
                style={{
                  position: 'absolute',
                  left: '17px',
                  top: '36px',
                  bottom: '0',
                  width: '2px',
                  backgroundColor: '#E2E8F0',
                }}
              />
            )}

            {/* Icon Bubble */}
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color,
                flexShrink: 0,
                zIndex: 2,
                border: '2px solid #FFFFFF',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              <Icon size={16} />
            </div>

            {/* Details */}
            <div style={{ flex: 1, paddingTop: '4px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}
              >
                <p
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: '600',
                    color: '#1E293B',
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {item.description}
                </p>
                {item.badge && (
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: '700',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: '#F1F5F9',
                      color: '#475569',
                      border: '1px solid #E2E8F0',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '4px',
                  fontSize: '0.75rem',
                  color: '#94A3B8',
                }}
              >
                {item.user && (
                  <span style={{ fontWeight: '500', color: '#64748B' }}>
                    By {item.user}
                  </span>
                )}
                {item.user && <span>•</span>}
                <span>{item.time}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
