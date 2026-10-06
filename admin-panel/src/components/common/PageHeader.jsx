import React from 'react';
import Breadcrumb from './Breadcrumb';

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs = [],
  actions = null,
}) {
  return (
    <div style={{ marginBottom: '24px' }}>
      {breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.625rem',
              fontWeight: '800',
              color: '#0F172A',
              letterSpacing: '-0.02em',
              margin: 0,
              lineHeight: 1.25,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                fontSize: '0.875rem',
                color: '#64748B',
                marginTop: '4px',
                margin: 0,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
