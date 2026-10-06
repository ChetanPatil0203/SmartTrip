import React, { useState } from 'react';
import { Eye, Download } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import TravelBadge from '../components/common/TravelBadge';
import Drawer from '../components/common/Drawer';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import { useAdmin } from '../context/AdminContext';

export default function BookingsPage() {
  const { bookings, updateBookingStatus, showToast, logAudit } = useAdmin();

  // Filters
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');

  // Selected Booking Drawer
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'passengers' | 'fare' | 'payment' | 'timeline'

  // Cancellation Confirm Dialog
  const [cancelDialog, setCancelDialog] = useState({ isOpen: false, booking: null });

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    if (typeFilter !== 'ALL' && b.travelType.toUpperCase() !== typeFilter.toUpperCase()) return false;
    if (statusFilter !== 'ALL' && b.bookingStatus.toUpperCase() !== statusFilter.toUpperCase()) return false;
    if (paymentFilter !== 'ALL' && b.paymentStatus.toUpperCase() !== paymentFilter.toUpperCase()) return false;
    return true;
  });

  const columns = [
    {
      header: 'Reference',
      accessor: 'id',
      render: (row) => (
        <span style={{ fontFamily: 'monospace', fontWeight: '800', color: '#D13239', fontSize: '0.8125rem' }}>
          {row.id}
        </span>
      ),
    },
    {
      header: 'User',
      accessor: 'user',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '700', color: '#0F172A' }}>{row.user?.name}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{row.user?.email}</div>
        </div>
      ),
    },
    {
      header: 'Travel Type',
      accessor: 'travelType',
      render: (row) => <TravelBadge type={row.travelType} />,
    },
    {
      header: 'Route / Property',
      accessor: 'route',
      render: (row) => (
        <div style={{ maxWidth: '220px' }}>
          <div style={{ fontWeight: '600', color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {row.route}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{row.operator}</div>
        </div>
      ),
    },
    {
      header: 'Travel Date',
      accessor: 'travelDate',
      render: (row) => <span style={{ fontSize: '0.75rem', color: '#334155' }}>{row.travelDate}</span>,
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
      header: 'Payment',
      accessor: 'paymentStatus',
      render: (row) => <StatusBadge status={row.paymentStatus} size="sm" />,
    },
    {
      header: 'Status',
      accessor: 'bookingStatus',
      render: (row) => <StatusBadge status={row.bookingStatus} size="sm" />,
    },
    {
      header: 'Action',
      accessor: 'actions',
      sortable: false,
      render: (row) => (
        <button
          type="button"
          onClick={() => {
            setSelectedBooking(row);
            setActiveTab('summary');
          }}
          className="st-btn st-btn-secondary st-btn-sm"
          style={{ padding: '4px 8px' }}
        >
          <Eye size={13} />
          <span>Details</span>
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="All Bookings"
        subtitle="Search, verify, inspect, and manage bookings across all travel networks"
        breadcrumbs={[{ label: 'Bookings' }]}
        actions={
          <button
            type="button"
            onClick={() => showToast('Exporting bookings database to CSV...', 'info')}
            className="st-btn st-btn-secondary"
          >
            <Download size={15} />
            <span>Export Bookings</span>
          </button>
        }
      />

      {/* Bookings Status Quick Counter */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px',
          marginBottom: '22px',
        }}
      >
        <div className="st-card" style={{ padding: '14px 18px', borderLeft: '4px solid #D13239' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>TOTAL BOOKINGS</span>
          <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0F172A' }}>
            {bookings.length} Orders
          </div>
        </div>
        <div className="st-card" style={{ padding: '14px 18px', borderLeft: '4px solid #059669' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>CONFIRMED</span>
          <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#059669' }}>
            {bookings.filter((b) => b.bookingStatus === 'confirmed').length}
          </div>
        </div>
        <div className="st-card" style={{ padding: '14px 18px', borderLeft: '4px solid #D97706' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>PENDING REVIEW</span>
          <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#D97706' }}>
            {bookings.filter((b) => b.bookingStatus === 'pending').length}
          </div>
        </div>
        <div className="st-card" style={{ padding: '14px 18px', borderLeft: '4px solid #DC2626' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>CANCELLED</span>
          <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#DC2626' }}>
            {bookings.filter((b) => b.bookingStatus === 'cancelled').length}
          </div>
        </div>
        <div className="st-card" style={{ padding: '14px 18px', borderLeft: '4px solid #7C3AED' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>REFUNDED</span>
          <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#7C3AED' }}>
            {bookings.filter((b) => b.bookingStatus === 'refunded').length}
          </div>
        </div>
      </div>

      {/* Bookings DataTable with Filter Toolbar */}
      <DataTable
        columns={columns}
        data={filteredBookings}
        searchPlaceholder="Search reference, user name, route..."
        searchKeys={['id', 'route', 'operator']}
        filterNode={
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {/* Travel Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="st-input st-select"
              style={{ width: '125px', height: '38px', fontSize: '0.75rem', fontWeight: '600' }}
            >
              <option value="ALL">All Travel</option>
              <option value="BUS">Bus</option>
              <option value="TRAIN">Train</option>
              <option value="FLIGHT">Flight</option>
              <option value="HOTEL">Hotel</option>
              <option value="CAB">Cab</option>
              <option value="AUTO">Auto</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="st-input st-select"
              style={{ width: '130px', height: '38px', fontSize: '0.75rem', fontWeight: '600' }}
            >
              <option value="ALL">All Status</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="REFUNDED">Refunded</option>
              <option value="COMPLETED">Completed</option>
            </select>

            {/* Payment Filter */}
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="st-input st-select"
              style={{ width: '130px', height: '38px', fontSize: '0.75rem', fontWeight: '600' }}
            >
              <option value="ALL">All Payments</option>
              <option value="SUCCESS">Success</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
        }
        exportFileName="smarttrip_all_bookings"
        pageSize={8}
        onRowClick={(row) => {
          setSelectedBooking(row);
          setActiveTab('summary');
        }}
      />

      {/* Booking Details Drawer with Modular Tabs */}
      <Drawer
        isOpen={Boolean(selectedBooking)}
        onClose={() => setSelectedBooking(null)}
        title={`Booking #${selectedBooking?.id}`}
        subtitle={`${selectedBooking?.travelType?.toUpperCase()} TICKET RESERVATION`}
        width="580px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            {selectedBooking?.bookingStatus !== 'cancelled' && selectedBooking?.bookingStatus !== 'refunded' ? (
              <button
                type="button"
                onClick={() => setCancelDialog({ isOpen: true, booking: selectedBooking })}
                className="st-btn st-btn-danger st-btn-sm"
              >
                Cancel Booking & Refund
              </button>
            ) : (
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontStyle: 'italic', alignSelf: 'center' }}>
                Booking finalized / cancelled
              </span>
            )}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="st-btn st-btn-secondary st-btn-sm"
              >
                Close
              </button>
              {selectedBooking?.bookingStatus === 'pending' && (
                <button
                  type="button"
                  onClick={() => {
                    updateBookingStatus(selectedBooking.id, 'confirmed');
                    setSelectedBooking((prev) => ({ ...prev, bookingStatus: 'confirmed' }));
                  }}
                  className="st-btn st-btn-primary st-btn-sm"
                >
                  Confirm Booking
                </button>
              )}
            </div>
          </div>
        }
      >
        {selectedBooking && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Drawer Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '4px',
                borderBottom: '1px solid #E2E8F0',
                paddingBottom: '8px',
                overflowX: 'auto',
              }}
            >
              {[
                { id: 'summary', label: 'Summary' },
                { id: 'passengers', label: 'Passengers' },
                { id: 'travel', label: 'Travel Route' },
                { id: 'fare', label: 'Fare Breakdown' },
                { id: 'payment', label: 'Mock Payment' },
                { id: 'timeline', label: 'Timeline' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: activeTab === tab.id ? '#D13239' : 'transparent',
                    color: activeTab === tab.id ? '#FFFFFF' : '#64748B',
                    fontWeight: activeTab === tab.id ? '700' : '600',
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 140ms ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB: SUMMARY */}
            {activeTab === 'summary' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <TravelBadge type={selectedBooking.travelType} />
                    <StatusBadge status={selectedBooking.bookingStatus} />
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '800', color: '#0F172A', margin: '0 0 4px 0' }}>
                    {selectedBooking.route}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#475569', margin: 0 }}>
                    {selectedBooking.operator}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ padding: '12px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>TRAVEL DATE</span>
                    <strong style={{ fontSize: '0.875rem', color: '#0F172A' }}>{selectedBooking.travelDate}</strong>
                  </div>
                  <div style={{ padding: '12px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>TOTAL AMOUNT</span>
                    <strong style={{ fontSize: '1rem', color: '#D13239' }}>₹{selectedBooking.amount}</strong>
                  </div>
                </div>

                <div style={{ padding: '14px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Primary Contact
                  </h4>
                  <div style={{ fontWeight: '700', color: '#0F172A' }}>{selectedBooking.user?.name}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#475569', marginTop: '2px' }}>
                    {selectedBooking.user?.email} • {selectedBooking.user?.phone}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PASSENGERS */}
            {activeTab === 'passengers' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedBooking.passengers?.map((p, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px 16px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '700', color: '#0F172A' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        {p.gender} • {p.age} years old
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.6875rem', color: '#64748B', display: 'block' }}>SEAT/BERTH</span>
                      <strong style={{ fontSize: '0.9375rem', color: '#D13239' }}>{p.seat}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: TRAVEL ROUTE */}
            {activeTab === 'travel' && (
              <div style={{ padding: '16px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: '800', color: '#0F172A', marginBottom: '12px' }}>
                  Trip Journey Details
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Sector / Route:</span>
                    <strong>{selectedBooking.route}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Service Provider:</span>
                    <span>{selectedBooking.operator}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Departure Schedule:</span>
                    <span>{selectedBooking.travelDate}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Allocated Unit:</span>
                    <span style={{ fontWeight: '700', color: '#D13239' }}>{selectedBooking.seats?.join(', ')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: FARE BREAKDOWN */}
            {activeTab === 'fare' && (
              <div style={{ padding: '16px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: '800', color: '#0F172A', marginBottom: '12px' }}>
                  Fare & Taxes Breakdown
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Base Ticket Fare:</span>
                    <span>₹{selectedBooking.fareBreakdown?.baseFare}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>SmartTrip Platform Fee:</span>
                    <span>₹{selectedBooking.fareBreakdown?.platformFee}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Applicable GST (5%):</span>
                    <span>₹{selectedBooking.fareBreakdown?.gst}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Promo Discount:</span>
                    <span style={{ color: '#059669' }}>-₹{selectedBooking.fareBreakdown?.discount}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderTop: '1px solid #E2E8F0',
                      paddingTop: '10px',
                      marginTop: '6px',
                      fontSize: '0.9375rem',
                      fontWeight: '800',
                      color: '#0F172A',
                    }}
                  >
                    <span>Total Charged:</span>
                    <span style={{ color: '#D13239' }}>₹{selectedBooking.fareBreakdown?.total}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: MOCK PAYMENT */}
            {activeTab === 'payment' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div
                  style={{
                    padding: '12px 14px',
                    backgroundColor: '#FFFBEB',
                    borderRadius: '8px',
                    border: '1px solid #FDE68A',
                    color: '#92400E',
                    fontSize: '0.75rem',
                    lineHeight: 1.4,
                  }}
                >
                  <strong>Mock Payment Sandbox:</strong> This transaction was simulated with mock gateway clearance. No credit card or real bank was debited.
                </div>

                <div style={{ padding: '16px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#64748B' }}>Mock Reference ID:</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: '800', color: '#D13239' }}>
                      {selectedBooking.mockPaymentId}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#64748B' }}>Payment Method:</span>
                    <span>{selectedBooking.paymentMethod}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#64748B' }}>Payment Status:</span>
                    <StatusBadge status={selectedBooking.paymentStatus} size="sm" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Amount Cleared:</span>
                    <strong>₹{selectedBooking.amount}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: TIMELINE */}
            {activeTab === 'timeline' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedBooking.timeline?.map((step, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '10px 14px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      fontSize: '0.8125rem',
                    }}
                  >
                    <span style={{ color: '#94A3B8', width: '120px', flexShrink: 0 }}>{step.time}</span>
                    <span style={{ color: '#1E293B', fontWeight: '500' }}>{step.event}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Cancellation Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={cancelDialog.isOpen}
        onClose={() => setCancelDialog({ isOpen: false, booking: null })}
        onConfirm={() => {
          if (cancelDialog.booking) {
            updateBookingStatus(cancelDialog.booking.id, 'cancelled');
            showToast(`Booking ${cancelDialog.booking.id} cancelled. Simulated refund initiated.`, 'info');
            logAudit('CANCEL_BOOKING', 'Bookings', `${cancelDialog.booking.id} (Refunded ₹${cancelDialog.booking.amount})`);
            setSelectedBooking(null);
          }
        }}
        title={`Cancel Booking ${cancelDialog.booking?.id}?`}
        message={`Are you sure you want to cancel booking ${cancelDialog.booking?.id}? A simulated mock refund of ₹${cancelDialog.booking?.amount} will be queued for the user.`}
        confirmText="Cancel & Initiate Refund"
        isDanger={true}
      />
    </div>
  );
}
