import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Eye,
  CheckCircle,
  Clock,
  Phone,
  User,
  FileText,
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import TravelBadge from '../components/common/TravelBadge';
import Drawer from '../components/common/Drawer';
import { useAdmin } from '../context/AdminContext';

export default function SafetyPage() {
  const { safetyReports, updateSafetyStatus, showToast, simulateSos } = useAdmin();
  const [selectedReport, setSelectedReport] = useState(null);
  const [newNote, setNewNote] = useState('');

  // Status Filter
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredReports = safetyReports.filter((r) => {
    if (statusFilter !== 'ALL' && r.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    return true;
  });

  const columns = [
    {
      header: 'Report ID',
      accessor: 'id',
      render: (row) => (
        <span style={{ fontFamily: 'monospace', fontWeight: '800', color: '#DC2626', fontSize: '0.8125rem' }}>
          {row.id}
        </span>
      ),
    },
    {
      header: 'User',
      accessor: 'user',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '700', color: '#0F172A' }}>{row.user}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{row.phone}</div>
        </div>
      ),
    },
    {
      header: 'Booking',
      accessor: 'booking',
      render: (row) => (
        <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#D13239', fontSize: '0.8125rem' }}>
          {row.booking}
        </span>
      ),
    },
    {
      header: 'Travel Type',
      accessor: 'travelType',
      render: (row) => <TravelBadge type={row.travelType} />,
    },
    {
      header: 'Issue Description',
      accessor: 'issue',
      render: (row) => (
        <div style={{ maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: '500', color: '#1E293B' }}>
          {row.issue}
        </div>
      ),
    },
    {
      header: 'Priority',
      accessor: 'priority',
      render: (row) => <StatusBadge status={row.priority} size="sm" />,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      header: 'Date',
      accessor: 'date',
      render: (row) => <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{row.date}</span>,
    },
    {
      header: 'Action',
      accessor: 'action',
      sortable: false,
      render: (row) => (
        <button
          type="button"
          onClick={() => setSelectedReport(row)}
          className="st-btn st-btn-secondary st-btn-sm"
          style={{ padding: '4px 8px' }}
        >
          <Eye size={13} />
          <span>Inspect</span>
        </button>
      ),
    },
  ];

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedReport) return;
    updateSafetyStatus(selectedReport.id, selectedReport.status, newNote);
    setSelectedReport((prev) => ({
      ...prev,
      adminNotes: prev.adminNotes ? `${prev.adminNotes} | ${newNote}` : newNote,
    }));
    setNewNote('');
  };

  return (
    <div>
      <PageHeader
        title="Safety & Emergency Center"
        subtitle="Real-time incident response, SOS reports, telemetry alerts, and driver conduct oversight"
        breadcrumbs={[{ label: 'Safety' }]}
        action={
          <button
            type="button"
            onClick={() => simulateSos('Traveler (Pune-Mumbai Expressway)')}
            className="st-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              fontWeight: '700',
              padding: '8px 16px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)',
            }}
          >
            <ShieldAlert size={16} />
            <span>Simulate Live SOS (Socket.io)</span>
          </button>
        }
      />

      {/* Safety Dashboard KPIs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div className="st-card" style={{ padding: '16px 20px', borderLeft: '4px solid #DC2626' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>TOTAL REPORTS</span>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#DC2626', marginTop: '2px' }}>
            {safetyReports.length} Incidents
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>All time</span>
        </div>

        <div className="st-card" style={{ padding: '16px 20px', borderLeft: '4px solid #EA580C' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>OPEN SOS ALERTS</span>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#EA580C', marginTop: '2px' }}>
            {safetyReports.filter((r) => r.status === 'Open').length} Active
          </div>
          <span style={{ fontSize: '0.75rem', color: '#EA580C', fontWeight: '700' }}>Immediate response</span>
        </div>

        <div className="st-card" style={{ padding: '16px 20px', borderLeft: '4px solid #D97706' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>INVESTIGATING</span>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#D97706', marginTop: '2px' }}>
            {safetyReports.filter((r) => r.status === 'Investigating').length} Cases
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Telemetry review</span>
        </div>

        <div className="st-card" style={{ padding: '16px 20px', borderLeft: '4px solid #059669' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>RESOLVED</span>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#059669', marginTop: '2px' }}>
            {safetyReports.filter((r) => r.status === 'Resolved').length} Cleared
          </div>
          <span style={{ fontSize: '0.75rem', color: '#059669' }}>100% resolution SLA</span>
        </div>
      </div>

      {/* Safety Table */}
      <DataTable
        columns={columns}
        data={filteredReports}
        searchPlaceholder="Search safety incidents by ID, user, booking..."
        searchKeys={['id', 'user', 'booking', 'issue']}
        filterNode={
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="st-input st-select"
            style={{ width: '140px', height: '38px', fontSize: '0.75rem', fontWeight: '600' }}
          >
            <option value="ALL">All Status</option>
            <option value="Open">Open</option>
            <option value="Investigating">Investigating</option>
            <option value="Resolved">Resolved</option>
          </select>
        }
        exportFileName="smarttrip_safety_reports"
        pageSize={8}
        onRowClick={(row) => setSelectedReport(row)}
      />

      {/* Safety Inspection Drawer */}
      <Drawer
        isOpen={Boolean(selectedReport)}
        onClose={() => setSelectedReport(null)}
        title={`Safety Incident ${selectedReport?.id}`}
        subtitle="INCIDENT TELEMETRY & PASSENGER ESCALATION"
        width="560px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            {selectedReport?.status !== 'Resolved' ? (
              <button
                type="button"
                onClick={() => {
                  updateSafetyStatus(selectedReport.id, 'Resolved');
                  setSelectedReport((prev) => ({ ...prev, status: 'Resolved' }));
                }}
                className="st-btn st-btn-primary st-btn-sm"
              >
                <CheckCircle size={14} />
                <span>Mark Incident Resolved</span>
              </button>
            ) : (
              <span style={{ color: '#059669', fontSize: '0.8125rem', fontWeight: '700' }}>
                ✓ Case Resolved & Archived
              </span>
            )}
            <button
              type="button"
              onClick={() => setSelectedReport(null)}
              className="st-btn st-btn-secondary st-btn-sm"
            >
              Close
            </button>
          </div>
        }
      >
        {selectedReport && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Incident Alert Box */}
            <div
              style={{
                padding: '16px',
                borderRadius: '10px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#DC2626' }}>
                  REPORTED ISSUE
                </span>
                <StatusBadge status={selectedReport.priority} size="sm" />
              </div>
              <p style={{ fontSize: '0.875rem', fontWeight: '700', color: '#991B1B', margin: 0, lineHeight: 1.4 }}>
                {selectedReport.issue}
              </p>
            </div>

            {/* User & Booking Info */}
            <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748B' }}>Reporting Passenger:</span>
                <strong>{selectedReport.user} ({selectedReport.phone})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748B' }}>Linked Booking Reference:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: '800', color: '#D13239' }}>{selectedReport.booking}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748B' }}>Travel Type:</span>
                <TravelBadge type={selectedReport.travelType} size="sm" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Incident Timestamp:</span>
                <span>{selectedReport.date}</span>
              </div>
            </div>

            {/* Admin Audit Notes */}
            <div>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
                Investigation Findings & Action Taken
              </h4>
              <div
                style={{
                  padding: '14px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.8125rem',
                  color: '#334155',
                  lineHeight: 1.5,
                }}
              >
                {selectedReport.adminNotes || 'No notes logged yet.'}
              </div>
            </div>

            {/* Add note */}
            <form onSubmit={handleAddNote}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                Append Super Admin Note
              </label>
              <textarea
                rows={3}
                required
                placeholder="Log internal telemetry findings or operator disciplinary actions..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="st-input"
                style={{ resize: 'none', marginBottom: '8px' }}
              />
              <button
                type="submit"
                className="st-btn st-btn-secondary st-btn-sm"
                style={{ width: '100%' }}
              >
                Save Investigation Note
              </button>
            </form>
          </div>
        )}
      </Drawer>
    </div>
  );
}
