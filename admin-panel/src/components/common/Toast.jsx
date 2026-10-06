import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function Toast() {
  const { toasts, removeToast } = useAdmin();

  if (!toasts.length) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error' || toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className="animate-fade-in"
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 18px',
              borderRadius: '12px',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
              fontSize: '0.875rem',
              fontWeight: '500',
              minWidth: '280px',
              maxWidth: '420px',
              borderLeft: `4px solid ${
                isSuccess ? '#10B981' : isError ? '#EF4444' : '#3B82F6'
              }`,
            }}
          >
            {isSuccess && <CheckCircle2 size={18} color="#10B981" />}
            {isError && <AlertCircle size={18} color="#EF4444" />}
            {!isSuccess && !isError && <Info size={18} color="#3B82F6" />}

            <span style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</span>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
