import React, { useState } from 'react';
import {
  Activity,
  Radio,
  Clock,
  AlertTriangle,
  Send,
  Navigation,
  CheckCircle2,
  RefreshCw,
  MapPin,
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { useAdmin } from '../context/AdminContext';
import adminApi from '../services/api';

export default function TrackingDelaysPage() {
  const { trackingTrips, broadcastDelayAlert, showToast } = useAdmin();
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'alerts' | 'history'

  // Delay broadcast modal
  const [broadcastModal, setBroadcastModal] = useState({ isOpen: false, trip: null });
  const [delayMinutes, setDelayMinutes] = useState(15);
  const [delayReason, setDelayReason] = useState('Heavy traffic congestion near expressway toll plaza');

  const columns = [
    {
      header: 'Trip / Ref',
      accessor: 'trip',
      render: (row) => (
        <span style={{ fontFamily: 'monospace', fontWeight: '800', color: '#D13239', fontSize: '0.8125rem' }}>
          {row.trip}
        </span>
      ),
    },
    {
      header: 'Route',
      accessor: 'route',
      render: (row) => <strong style={{ color: '#0F172A' }}>{row.route}</strong>,
    },
    {
      header: 'Vehicle & Operator',
      accessor: 'vehicle',
      render: (row) => <span style={{ color: '#475569', fontSize: '0.8125rem' }}>{row.vehicle}</span>,
    },
    {
      header: 'Live Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      header: 'Delay',
      accessor: 'delay',
      render: (row) => {
        const isDelayed = row.delay && row.delay !== '+0m' && row.delay !== '—';
        return (
          <span
            style={{
              fontWeight: '700',
              color: isDelayed ? '#DC2626' : '#059669',
              backgroundColor: isDelayed ? '#FEF2F2' : '#ECFDF5',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.75rem',
            }}
          >
            {row.delay}
          </span>
        );
      },
    },
    {
      header: 'Telemetry & GPS',
      accessor: 'latLng',
      render: (row) => (
        row.liveGpsActive ? (
          <div style={{ fontSize: '0.75rem' }}>
            <div style={{ color: '#0F172A', fontWeight: '600' }}>{row.latLng}</div>
            <div style={{ color: '#64748B' }}>Speed: {row.speed}</div>
          </div>
        ) : (
          <span
            style={{
              fontSize: '0.75rem',
              color: '#94A3B8',
              fontStyle: 'italic',
              backgroundColor: '#F1F5F9',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            Live tracking currently unavailable.
          </span>
        )
      ),
    },
    {
      header: 'Last Updated',
      accessor: 'lastUpdated',
      render: (row) => <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{row.lastUpdated}</span>,
    },
    {
      header: 'Action',
      accessor: 'action',
      sortable: false,
      render: (row) => (
        <button
          type="button"
          onClick={() => setBroadcastModal({ isOpen: true, trip: row })}
          className="st-btn st-btn-secondary st-btn-sm"
          style={{ padding: '4px 8px' }}
        >
          <Clock size={13} />
          <span>Broadcast Delay</span>
        </button>
      ),
    },
  ];

  const handleBroadcastDelay = (e) => {
    e.preventDefault();
    if (!broadcastModal.trip) return;
    broadcastDelayAlert(broadcastModal.trip.id, delayMinutes, delayReason);
    adminApi.broadcastDelay(broadcastModal.trip.id, delayMinutes, delayReason).catch(() => {});
    setBroadcastModal({ isOpen: false, trip: null });
  };

  return (
    <div>
      <PageHeader
        title="Fleet Tracking & Delay Advisory"
        subtitle="Real-time multi-modal journey monitoring, GPS telemetry, and passenger delay broadcast engine"
        breadcrumbs={[{ label: 'Tracking & Delays' }]}
        actions={
          <button
            type="button"
            onClick={() => showToast('Refreshed live GPS telemetry signals.', 'success')}
            className="st-btn st-btn-secondary"
          >
            <RefreshCw size={15} />
            <span>Sync Fleet GPS</span>
          </button>
        }
      />

      {/* Live Fleet Status Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div className="st-card" style={{ padding: '16px 20px', borderLeft: '4px solid #059669' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>ACTIVE VEHICLES EN ROUTE</span>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#059669', marginTop: '2px' }}>
            3 Trips
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Real-time GPS online</span>
        </div>

        <div className="st-card" style={{ padding: '16px 20px', borderLeft: '4px solid #EA580C' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>DELAYED JOURNEYS</span>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#EA580C', marginTop: '2px' }}>
            1 Trip (+25m)
          </div>
          <span style={{ fontSize: '0.75rem', color: '#EA580C', fontWeight: '700' }}>Advisory dispatched</span>
        </div>

        <div className="st-card" style={{ padding: '16px 20px', borderLeft: '4px solid #94A3B8' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>GPS OFFLINE / INACTIVE</span>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#64748B', marginTop: '2px' }}>
            1 Vehicle
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Awaiting terminal check-in</span>
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
          onClick={() => setActiveTab('live')}
          style={{
            padding: '12px 20px',
            border: 'none',
            borderBottom: activeTab === 'live' ? '3px solid #D13239' : '3px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'live' ? '#D13239' : '#64748B',
            fontWeight: activeTab === 'live' ? '800' : '600',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
        >
          Live Tracking Board ({trackingTrips.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('alerts')}
          style={{
            padding: '12px 20px',
            border: 'none',
            borderBottom: activeTab === 'alerts' ? '3px solid #D13239' : '3px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'alerts' ? '#D13239' : '#64748B',
            fontWeight: activeTab === 'alerts' ? '800' : '600',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
        >
          Active Delay Alerts (1)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          style={{
            padding: '12px 20px',
            border: 'none',
            borderBottom: activeTab === 'history' ? '3px solid #D13239' : '3px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'history' ? '#D13239' : '#64748B',
            fontWeight: activeTab === 'history' ? '800' : '600',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
        >
          Punctuality History Log
        </button>
      </div>

      {/* Main Table */}
      {activeTab === 'live' && (
        <DataTable
          columns={columns}
          data={trackingTrips}
          searchPlaceholder="Search vehicle, route, trip ID..."
          searchKeys={['trip', 'route', 'vehicle', 'status']}
          exportFileName="smarttrip_live_tracking"
          pageSize={6}
        />
      )}

      {activeTab === 'alerts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: '#FFF7ED',
              borderRadius: '12px',
              border: '1px solid #FFEDD5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: '#FFEDD5',
                  color: '#EA580C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AlertTriangle size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '0.9375rem', color: '#9A3412' }}>
                  Train 12127 Mumbai-Pune Intercity Delay (+25m)
                </strong>
                <p style={{ fontSize: '0.8125rem', color: '#C2410C', margin: '2px 0 0 0' }}>
                  Signal clearance waiting at Kalyan junction. Revised arrival at Pune Jn: 10:22 AM. Push notifications broadcasted.
                </p>
              </div>
            </div>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: '800',
                backgroundColor: '#FFEDD5',
                color: '#9A3412',
                padding: '4px 10px',
                borderRadius: '6px',
              }}
            >
              DISPATCHED
            </span>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="st-card" style={{ padding: '24px', textAlign: 'center', color: '#64748B' }}>
          <p style={{ margin: 0 }}>
            Fleet on-time performance index: <strong>94.2%</strong> across 18,420 trips in Maharashtra.
          </p>
        </div>
      )}

      {/* Broadcast Delay Modal */}
      <Modal
        isOpen={broadcastModal.isOpen}
        onClose={() => setBroadcastModal({ isOpen: false, trip: null })}
        title={`Broadcast Delay for ${broadcastModal.trip?.trip}`}
        subtitle={`Route: ${broadcastModal.trip?.route}`}
        maxWidth="500px"
        footer={
          <>
            <button
              type="button"
              onClick={() => setBroadcastModal({ isOpen: false, trip: null })}
              className="st-btn st-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleBroadcastDelay}
              className="st-btn st-btn-primary"
            >
              Broadcast Alert
            </button>
          </>
        }
      >
        <form onSubmit={handleBroadcastDelay} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
              Estimated Delay (Minutes)
            </label>
            <input
              type="number"
              required
              min={5}
              max={240}
              value={delayMinutes}
              onChange={(e) => setDelayMinutes(Number(e.target.value))}
              className="st-input"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
              Reason & Passenger Notice Message
            </label>
            <textarea
              required
              rows={3}
              value={delayReason}
              onChange={(e) => setDelayReason(e.target.value)}
              className="st-input"
              style={{ resize: 'none' }}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
