import React, { useState } from 'react';
import {
  CreditCard,
  RotateCcw,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Download,
  Eye,
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import MockPaymentBadge from '../components/common/MockPaymentBadge';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import { useAdmin } from '../context/AdminContext';

export default function PaymentsRefundsPage() {
  const { payments, refunds, processRefund, showToast } = useAdmin();
  const [activeTab, setActiveTab] = useState('payments'); // 'payments' | 'refunds'

  // Refund processing modal
  const [processDialog, setProcessDialog] = useState({ isOpen: false, refund: null });

  // Columns for Payments Table
  const paymentColumns = [
    {
      header: 'Payment ID',
      accessor: 'id',
      render: (row) => (
        <span style={{ fontFamily: 'monospace', fontWeight: '800', color: '#0F172A', fontSize: '0.8125rem' }}>
          {row.id}
        </span>
      ),
    },
    {
      header: 'Booking Reference',
      accessor: 'bookingId',
      render: (row) => (
        <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#D13239', fontSize: '0.8125rem' }}>
          {row.bookingId}
        </span>
      ),
    },
    {
      header: 'User',
      accessor: 'user',
      render: (row) => <strong style={{ color: '#1E293B' }}>{row.user}</strong>,
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (row) => (
        <span style={{ fontWeight: '800', color: '#0F172A' }}>
          ₹{row.amount.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Payment Method',
      accessor: 'method',
      render: (row) => (
        <span
          style={{
            fontSize: '0.75rem',
            padding: '2px 8px',
            borderRadius: '4px',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            color: '#334155',
            fontWeight: '600',
          }}
        >
          {row.method}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      header: 'Date & Time',
      accessor: 'date',
      render: (row) => <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{row.date}</span>,
    },
  ];

  // Columns for Refunds Table
  const refundColumns = [
    {
      header: 'Refund ID',
      accessor: 'id',
      render: (row) => (
        <span style={{ fontFamily: 'monospace', fontWeight: '800', color: '#7C3AED', fontSize: '0.8125rem' }}>
          {row.id}
        </span>
      ),
    },
    {
      header: 'Booking Reference',
      accessor: 'bookingId',
      render: (row) => (
        <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#D13239', fontSize: '0.8125rem' }}>
          {row.bookingId}
        </span>
      ),
    },
    {
      header: 'User',
      accessor: 'user',
      render: (row) => <strong style={{ color: '#1E293B' }}>{row.user}</strong>,
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (row) => (
        <span style={{ fontWeight: '800', color: '#7C3AED' }}>
          ₹{row.amount.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      header: 'Requested Date',
      accessor: 'requestedDate',
      render: (row) => <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{row.requestedDate}</span>,
    },
    {
      header: 'Processed Date',
      accessor: 'processedDate',
      render: (row) => <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{row.processedDate}</span>,
    },
    {
      header: 'Action',
      accessor: 'action',
      sortable: false,
      render: (row) => (
        row.status === 'PENDING' ? (
          <button
            type="button"
            onClick={() => setProcessDialog({ isOpen: true, refund: row })}
            className="st-btn st-btn-primary st-btn-sm"
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
          >
            Process Refund
          </button>
        ) : (
          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700' }}>
            ✓ Dispatched
          </span>
        )
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Payments & Refunds"
        subtitle="Manage settlement journals, mock gateway transactions, and customer refunds"
        breadcrumbs={[{ label: 'Payments & Refunds' }]}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MockPaymentBadge />
            <button
              type="button"
              onClick={() => showToast('Exporting settlement statement...', 'info')}
              className="st-btn st-btn-secondary"
            >
              <Download size={15} />
              <span>Export Statement</span>
            </button>
          </div>
        }
      />

      {/* Prominent Mock Payment Environment Notice Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          backgroundColor: '#FFFBEB',
          borderRadius: '12px',
          border: '1px solid #FDE68A',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D97706',
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: '800', color: '#92400E' }}>
              Simulated Mock Payment Environment
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#B45309', marginTop: '2px' }}>
              SmartTrip operates on a mock payment ledger for testing and simulated bookings. Gateway webhooks and refunds resolve immediately without third-party banking charges.
            </div>
          </div>
        </div>

        <span
          style={{
            fontSize: '0.6875rem',
            fontWeight: '800',
            backgroundColor: '#FDE68A',
            color: '#78350F',
            padding: '4px 10px',
            borderRadius: '6px',
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
          }}
        >
          SANDBOX ACTIVE
        </span>
      </div>

      {/* KPI Cards for Financials */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div className="st-card" style={{ padding: '16px 20px', borderLeft: '4px solid #059669' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>TOTAL CLEARED (MOCK)</span>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
            ₹1,84,20,500
          </div>
          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '600' }}>17,890 transactions</span>
        </div>

        <div className="st-card" style={{ padding: '16px 20px', borderLeft: '4px solid #7C3AED' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>TOTAL REFUNDED</span>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#7C3AED', marginTop: '2px' }}>
            ₹2,45,000
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '500' }}>380 tickets refunded</span>
        </div>

        <div className="st-card" style={{ padding: '16px 20px', borderLeft: '4px solid #D97706' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>PENDING REFUNDS</span>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#D97706', marginTop: '2px' }}>
            {refunds.filter((r) => r.status === 'PENDING').length} Queued
          </div>
          <span style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: '700' }}>Requires Admin Approval</span>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid #E2E8F0',
          marginBottom: '20px',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('payments')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            border: 'none',
            borderBottom: activeTab === 'payments' ? '3px solid #D13239' : '3px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'payments' ? '#D13239' : '#64748B',
            fontWeight: activeTab === 'payments' ? '800' : '600',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
        >
          <CreditCard size={17} />
          <span>Payments Ledger ({payments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('refunds')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            border: 'none',
            borderBottom: activeTab === 'refunds' ? '3px solid #7C3AED' : '3px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'refunds' ? '#7C3AED' : '#64748B',
            fontWeight: activeTab === 'refunds' ? '800' : '600',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
        >
          <RotateCcw size={17} />
          <span>Refund Requests ({refunds.length})</span>
          {refunds.filter((r) => r.status === 'PENDING').length > 0 && (
            <span
              style={{
                fontSize: '0.6875rem',
                backgroundColor: '#D97706',
                color: '#FFFFFF',
                padding: '1px 6px',
                borderRadius: '9999px',
                fontWeight: '800',
              }}
            >
              {refunds.filter((r) => r.status === 'PENDING').length}
            </span>
          )}
        </button>
      </div>

      {/* Render Active Tab */}
      {activeTab === 'payments' ? (
        <DataTable
          columns={paymentColumns}
          data={payments}
          searchPlaceholder="Search payment ID, booking ref, user..."
          searchKeys={['id', 'bookingId', 'user', 'method']}
          exportFileName="smarttrip_payments_mock"
          pageSize={8}
        />
      ) : (
        <DataTable
          columns={refundColumns}
          data={refunds}
          searchPlaceholder="Search refund ID, booking ref, user..."
          searchKeys={['id', 'bookingId', 'user', 'reason']}
          exportFileName="smarttrip_refunds_mock"
          pageSize={8}
        />
      )}

      {/* Process Refund Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={processDialog.isOpen}
        onClose={() => setProcessDialog({ isOpen: false, refund: null })}
        onConfirm={() => {
          if (processDialog.refund) {
            processRefund(processDialog.refund.id);
          }
        }}
        title={`Approve & Process Mock Refund ${processDialog.refund?.id}?`}
        message={`Are you sure you want to approve simulated mock refund ${processDialog.refund?.id} for ₹${processDialog.refund?.amount}? Reason: "${processDialog.refund?.reason}". The funds will be credited immediately to the user's SmartTrip mock wallet.`}
        confirmText="Approve Mock Refund"
      />
    </div>
  );
}
