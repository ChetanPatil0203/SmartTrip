import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Breadcrumb({ items = [] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.8125rem',
        color: '#64748B',
        marginBottom: '10px',
      }}
    >
      <Link
        to="/dashboard"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: '#64748B',
          textDecoration: 'none',
          transition: 'color 150ms ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#D13239')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
      >
        <Home size={14} />
        <span>Dashboard</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight size={13} color="#94A3B8" />
            {isLast || !item.to ? (
              <span style={{ fontWeight: 600, color: '#1E293B' }}>{item.label}</span>
            ) : (
              <Link
                to={item.to}
                style={{
                  color: '#64748B',
                  textDecoration: 'none',
                  transition: 'color 150ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#D13239')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
