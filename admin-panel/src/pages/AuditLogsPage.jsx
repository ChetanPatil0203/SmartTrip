import React, { useState } from 'react';
import {
  FileText,
  Shield,
  Download,
  Filter,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import { useAdmin } from '../context/AdminContext';

export default function AuditLogsPage() {
  const { auditLogs, showToast } = useAdmin();
  const [moduleFilter, setModuleFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    if (moduleFilter !== 'ALL' && !log.module.toLowerCase().includes(moduleFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  const columns = [
    {
      header: 'Timestamp',
      accessor: 'timestamp',
      render: (row) => (
        <span style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'monospace' }}>
          {row.timestamp}
        </span>
      ),
    },
    {
      header: 'Admin User',
      accessor: 'admin',
      render: (row) => (
        <strong style={{ color: '#0F172A', fontSize: '0.8125rem' }}>
          {row.admin}
        </strong>
      ),
    },
    {
      header: 'Action',
      accessor: 'action',
      render: (row) => (
        <span
          style={{
            fontFamily: 'monospace',
            fontWeight: '700',
            fontSize: '0.75rem',
            padding: '2px 6px',
            backgroundColor: '#F1F5F9',
            color: '#1E293B',
            borderRadius: '4px',
            border: '1px solid #E2E8F0',
          }}
        >
          {row.action}
        </span>
      ),
    },
    {
      header: 'Module',
      accessor: 'module',
      render: (row) => <span style={{ color: '#475569', fontSize: '0.8125rem' }}>{row.module}</span>,
    },
    {
      header: 'Target / Subject',
      accessor: 'target',
      render: (row) => (
        <span style={{ fontWeight: '600', color: '#D13239', fontSize: '0.8125rem' }}>
          {row.target}
        </span>
      ),
    },
    {
      header: 'IP Address',
      accessor: 'ip',
      render: (row) => (
        <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#64748B' }}>
          {row.ip}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Enterprise Audit Logs"
        subtitle="Immutable compliance audit trail tracking all privileged super admin operations and state changes"
        breadcrumbs={[{ label: 'Audit Logs' }]}
        actions={
          <button
            type="button"
            onClick={() => showToast('Exported signed audit journal (CSV)...', 'info')}
            className="st-btn st-btn-secondary"
          >
            <Download size={15} />
            <span>Export Audit Trail</span>
          </button>
        }
      />

      {/* Security Info Card */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '14px 18px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            backgroundColor: '#EFF6FF',
            color: '#2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Shield size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#0F172A' }}>
            SOC2 & ISO 27001 Tamper-Evident Logging
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
            Every configuration update, ticket reply, refund authorization, and account suspension is permanently stamped with Super Admin identity and origin IP.
          </div>
        </div>
      </div>

      {/* Audit Log DataTable */}
      <DataTable
        columns={columns}
        data={filteredLogs}
        searchPlaceholder="Search audit events by action, target, admin, IP..."
        searchKeys={['action', 'target', 'admin', 'module', 'ip']}
        filterNode={
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="st-input st-select"
            style={{ width: '150px', height: '38px', fontSize: '0.75rem', fontWeight: '600' }}
          >
            <option value="ALL">All Modules</option>
            <option value="Payments">Payments & Refunds</option>
            <option value="Travel">Travel Management</option>
            <option value="Users">Users</option>
            <option value="Offers">Offers & Coupons</option>
            <option value="Safety">Safety</option>
            <option value="Settings">Settings</option>
          </select>
        }
        exportFileName="smarttrip_audit_logs"
        pageSize={8}
      />
    </div>
  );
}
