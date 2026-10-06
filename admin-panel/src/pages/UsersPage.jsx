import React, { useState } from 'react';
import {
  Users as UsersIcon,
  UserCheck,
  UserX,
  Eye,
  Shield,
  Phone,
  Mail,
  Calendar,
  Lock,
  Download,
  AlertTriangle,
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import Drawer from '../components/common/Drawer';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import { useAdmin } from '../context/AdminContext';

export default function UsersPage() {
  const { users, toggleUserStatus, bookings, payments, showToast } = useAdmin();

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Selected User Drawer
  const [selectedUser, setSelectedUser] = useState(null);

  // Status Toggle Confirmation Dialog
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, user: null });

  // Filtered users
  const filteredUsers = users.filter((u) => {
    if (statusFilter !== 'ALL' && u.status !== statusFilter) return false;
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    return true;
  });

  const columns = [
    {
      header: 'User',
      accessor: 'name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#FFF0F0',
              color: '#D13239',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '0.875rem',
            }}
          >
            {row.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: '700', color: '#0F172A' }}>{row.name}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>ID: {row.id}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Email',
      accessor: 'email',
      render: (row) => <span style={{ color: '#334155', fontSize: '0.8125rem' }}>{row.email}</span>,
    },
    {
      header: 'Phone',
      accessor: 'phone',
      render: (row) => <span style={{ color: '#475569', fontSize: '0.8125rem' }}>{row.phone}</span>,
    },
    {
      header: 'Role',
      accessor: 'role',
      render: (row) => (
        <span
          style={{
            fontSize: '0.6875rem',
            fontWeight: '800',
            letterSpacing: '0.05em',
            padding: '3px 8px',
            borderRadius: '4px',
            backgroundColor: row.role === 'ADMIN' ? '#0F172A' : '#F1F5F9',
            color: row.role === 'ADMIN' ? '#FFFFFF' : '#475569',
          }}
        >
          {row.role === 'ADMIN' ? 'SUPER ADMIN' : 'USER'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      header: 'Joined',
      accessor: 'joined',
      render: (row) => <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{row.joined}</span>,
    },
    {
      header: 'Bookings',
      accessor: 'bookingsCount',
      render: (row) => (
        <span style={{ fontWeight: '700', color: '#1E293B' }}>
          {row.bookingsCount} trips
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      sortable: false,
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={() => setSelectedUser(row)}
            className="st-btn st-btn-secondary st-btn-sm"
            style={{ padding: '4px 8px' }}
          >
            <Eye size={13} />
            <span>Profile</span>
          </button>
          {row.role !== 'ADMIN' && (
            <button
              type="button"
              onClick={() => setConfirmDialog({ isOpen: true, user: row })}
              className={`st-btn st-btn-sm ${
                row.status === 'ACTIVE' ? 'st-btn-danger' : 'st-btn-primary'
              }`}
              style={{ padding: '4px 8px' }}
            >
              {row.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
            </button>
          )}
        </div>
      ),
    },
  ];

  // User details bookings
  const userBookings = bookings.filter((b) => b.user?.email === selectedUser?.email);
  const userPayments = payments.filter((p) => p.user === selectedUser?.name);

  return (
    <div>
      <PageHeader
        title="Users Management"
        subtitle="Manage customer profiles, saved passengers, roles, and account statuses"
        breadcrumbs={[{ label: 'Users' }]}
        actions={
          <button
            type="button"
            onClick={() => showToast('Exporting active users roster to CSV...', 'info')}
            className="st-btn st-btn-secondary"
          >
            <Download size={15} />
            <span>Export Roster</span>
          </button>
        }
      />

      {/* Users Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div className="st-card" style={{ padding: '16px 20px', borderLeft: '4px solid #2563EB' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>TOTAL REGISTERED</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
            {users.length} Users
          </div>
        </div>
        <div className="st-card" style={{ padding: '16px 20px', borderLeft: '4px solid #059669' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>ACTIVE ACCOUNTS</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#059669', marginTop: '2px' }}>
            {users.filter((u) => u.status === 'ACTIVE').length} Active
          </div>
        </div>
        <div className="st-card" style={{ padding: '16px 20px', borderLeft: '4px solid #DC2626' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>SUSPENDED</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#DC2626', marginTop: '2px' }}>
            {users.filter((u) => u.status === 'SUSPENDED').length} Suspended
          </div>
        </div>
        <div className="st-card" style={{ padding: '16px 20px', borderLeft: '4px solid #D13239' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>SUPER ADMINS</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#D13239', marginTop: '2px' }}>
            1 Super Admin
          </div>
        </div>
      </div>

      {/* Users DataTable */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        searchPlaceholder="Search users by name, email, phone..."
        searchKeys={['name', 'email', 'phone', 'id']}
        filterNode={
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="st-input st-select"
              style={{ width: '130px', height: '38px', fontSize: '0.75rem', fontWeight: '600' }}
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
            </select>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="st-input st-select"
              style={{ width: '130px', height: '38px', fontSize: '0.75rem', fontWeight: '600' }}
            >
              <option value="ALL">All Roles</option>
              <option value="USER">User</option>
              <option value="ADMIN">Super Admin</option>
            </select>
          </div>
        }
        exportFileName="smarttrip_users"
        pageSize={6}
        onRowClick={(row) => setSelectedUser(row)}
      />

      {/* User Detail Drawer */}
      <Drawer
        isOpen={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        title={selectedUser?.name || 'User Profile'}
        subtitle={`USER ID: ${selectedUser?.id} • JOINED ${selectedUser?.joined}`}
        width="560px"
        footer={
          selectedUser?.role !== 'ADMIN' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <button
                type="button"
                onClick={() => {
                  toggleUserStatus(selectedUser.id);
                  setSelectedUser((prev) => ({
                    ...prev,
                    status: prev.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE',
                  }));
                }}
                className={`st-btn ${
                  selectedUser?.status === 'ACTIVE' ? 'st-btn-danger' : 'st-btn-primary'
                }`}
              >
                {selectedUser?.status === 'ACTIVE' ? 'Suspend Account' : 'Reactivate Account'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="st-btn st-btn-secondary"
              >
                Close
              </button>
            </div>
          )
        }
      >
        {selectedUser && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
              }}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: '#D13239',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: '800',
                }}
              >
                {selectedUser.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    {selectedUser.name}
                  </h3>
                  <StatusBadge status={selectedUser.status} size="sm" />
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '4px' }}>
                  {selectedUser.email} • {selectedUser.phone}
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>TOTAL TRIPS BOOKED</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A' }}>
                  {selectedUser.bookingsCount}
                </span>
              </div>
              <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>LIFETIME SPEND (MOCK)</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#D13239' }}>
                  ₹{selectedUser.totalSpent?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Saved Passengers */}
            <div>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
                Saved Passengers ({selectedUser.savedPassengers?.length || 0})
              </h4>
              {selectedUser.savedPassengers?.length === 0 ? (
                <div style={{ fontSize: '0.8125rem', color: '#94A3B8', fontStyle: 'italic' }}>
                  No saved passenger profiles.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedUser.savedPassengers.map((sp, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 14px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.8125rem',
                      }}
                    >
                      <div>
                        <strong style={{ color: '#0F172A' }}>{sp.name}</strong>
                        <span style={{ color: '#64748B', marginLeft: '6px' }}>
                          ({sp.gender}, {sp.age} yrs)
                        </span>
                      </div>
                      <span style={{ color: '#D13239', fontWeight: '600' }}>{sp.relation}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Booking History */}
            <div>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
                Recent Bookings History
              </h4>
              {userBookings.length === 0 ? (
                <div style={{ fontSize: '0.8125rem', color: '#94A3B8', fontStyle: 'italic' }}>
                  No recent bookings on record.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {userBookings.map((b) => (
                    <div
                      key={b.id}
                      style={{
                        padding: '12px 14px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        fontSize: '0.8125rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <strong style={{ color: '#D13239' }}>{b.id}</strong>
                        <StatusBadge status={b.bookingStatus} size="sm" />
                      </div>
                      <div style={{ color: '#0F172A', fontWeight: '600' }}>{b.route}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.75rem', marginTop: '4px' }}>
                        <span>{b.travelDate}</span>
                        <span>₹{b.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, user: null })}
        onConfirm={() => {
          if (confirmDialog.user) {
            toggleUserStatus(confirmDialog.user.id);
          }
        }}
        title={`${confirmDialog.user?.status === 'ACTIVE' ? 'Suspend' : 'Activate'} User Account`}
        message={`Are you sure you want to ${
          confirmDialog.user?.status === 'ACTIVE' ? 'suspend' : 'reactivate'
        } ${confirmDialog.user?.name}'s account? ${
          confirmDialog.user?.status === 'ACTIVE'
            ? 'They will be prevented from booking trips or logging into the mobile app.'
            : 'Their full booking privileges will be restored immediately.'
        }`}
        confirmText={confirmDialog.user?.status === 'ACTIVE' ? 'Suspend Account' : 'Reactivate'}
        isDanger={confirmDialog.user?.status === 'ACTIVE'}
      />
    </div>
  );
}
