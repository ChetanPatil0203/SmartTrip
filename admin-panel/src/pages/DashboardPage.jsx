import React, { useState } from 'react';
import {
  Users,
  CalendarCheck,
  TrendingUp,
  CreditCard,
  XCircle,
  RotateCcw,
  Calendar,
  Download,
  Eye,
  ArrowRight,
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import KpiCard from '../components/common/KpiCard';
import StatusBadge from '../components/common/StatusBadge';
import TravelBadge from '../components/common/TravelBadge';
import DataTable from '../components/common/DataTable';
import ActivityTimeline from '../components/common/ActivityTimeline';
import Drawer from '../components/common/Drawer';
import RevenueChart from '../components/charts/RevenueChart';
import BookingTrendChart from '../components/charts/BookingTrendChart';
import TravelDistributionChart from '../components/charts/TravelDistributionChart';
import BookingStatusChart from '../components/charts/BookingStatusChart';
import {
  mockKpis,
  mockRevenueTrends,
  mockTravelDistribution,
  mockBookingStatusOverview,
  mockRecentActivity,
} from '../data/mockData';
import { useAdmin } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { bookings, dateRange, setDateRange, updateBookingStatus, showToast } = useAdmin();
  const navigate = useNavigate();

  // Booking details drawer
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Travel type filter for recent bookings
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filteredBookings = bookings.filter((b) => {
    if (typeFilter === 'ALL') return true;
    return b.travelType.toUpperCase() === typeFilter.toUpperCase();
  });

  const columns = [
    {
      header: 'Booking ID',
      accessor: 'id',
      render: (row) => (
        <span style={{ fontWeight: '700', color: '#D13239', fontFamily: 'monospace', fontSize: '0.8125rem' }}>
          {row.id}
        </span>
      ),
    },
    {
      header: 'User',
      accessor: 'user',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '600', color: '#0F172A' }}>{row.user?.name}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{row.user?.phone}</div>
        </div>
      ),
    },
    {
      header: 'Travel Type',
      accessor: 'travelType',
      render: (row) => <TravelBadge type={row.travelType} />,
    },
    {
      header: 'Route / Hotel',
      accessor: 'route',
      render: (row) => (
        <div style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <div style={{ fontWeight: '600', color: '#1E293B' }} title={row.route}>
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
        <span style={{ fontWeight: '700', color: '#0F172A' }}>
          ₹{row.amount.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Payment Status',
      accessor: 'paymentStatus',
      render: (row) => <StatusBadge status={row.paymentStatus} size="sm" />,
    },
    {
      header: 'Booking Status',
      accessor: 'bookingStatus',
      render: (row) => <StatusBadge status={row.bookingStatus} size="sm" />,
    },
    {
      header: 'Actions',
      accessor: 'actions',
      sortable: false,
      render: (row) => (
        <button
          type="button"
          onClick={() => setSelectedBooking(row)}
          className="st-btn st-btn-secondary st-btn-sm"
          style={{ padding: '4px 8px' }}
        >
          <Eye size={13} />
          <span>View</span>
        </button>
      ),
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        subtitle="Monitor and manage your SmartTrip platform."
        breadcrumbs={[]}
        actions={
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#FFFFFF', padding: '4px 10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <Calendar size={15} color="#64748B" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontFamily: 'inherit',
                  fontSize: '0.8125rem',
                  fontWeight: '600',
                  color: '#1E293B',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="Today">Today</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Last 3 Months">Last 3 Months</option>
                <option value="Year to Date">Year to Date</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => showToast('Exporting executive summary report to CSV...', 'info')}
              className="st-btn st-btn-secondary"
            >
              <Download size={15} />
              <span>Export Report</span>
            </button>
          </>
        }
      />

      {/* KPI Cards Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <KpiCard
          icon={Users}
          label="Total Users"
          value={mockKpis.totalUsers.value}
          change={mockKpis.totalUsers.change}
          period={mockKpis.totalUsers.period}
          trend={mockKpis.totalUsers.trend}
          accentColor="#2563EB"
          bgTint="#EFF6FF"
        />
        <KpiCard
          icon={CalendarCheck}
          label="Total Bookings"
          value={mockKpis.totalBookings.value}
          change={mockKpis.totalBookings.change}
          period={mockKpis.totalBookings.period}
          trend={mockKpis.totalBookings.trend}
          accentColor="#D13239"
          bgTint="#FFF0F0"
        />
        <KpiCard
          icon={TrendingUp}
          label="Revenue"
          value={mockKpis.revenue.value}
          change={mockKpis.revenue.change}
          period={mockKpis.revenue.period}
          trend={mockKpis.revenue.trend}
          accentColor="#059669"
          bgTint="#ECFDF5"
        />
        <KpiCard
          icon={CreditCard}
          label="Successful Payments"
          value={mockKpis.successfulPayments.value}
          change={mockKpis.successfulPayments.change}
          period={mockKpis.successfulPayments.period}
          trend={mockKpis.successfulPayments.trend}
          accentColor="#0284C7"
          bgTint="#F0F9FF"
        />
        <KpiCard
          icon={XCircle}
          label="Cancellations"
          value={mockKpis.cancellations.value}
          change={mockKpis.cancellations.change}
          period={mockKpis.cancellations.period}
          trend={mockKpis.cancellations.trend}
          accentColor="#DC2626"
          bgTint="#FEF2F2"
        />
        <KpiCard
          icon={RotateCcw}
          label="Refunds"
          value={mockKpis.refunds.value}
          change={mockKpis.refunds.change}
          period={mockKpis.refunds.period}
          trend={mockKpis.refunds.trend}
          accentColor="#7C3AED"
          bgTint="#F5F3FF"
        />
      </div>

      {/* Main Charts Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '24px',
          marginBottom: '28px',
        }}
      >
        {/* Revenue Overview Chart */}
        <div className="st-card" style={{ padding: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                Revenue Overview
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '2px 0 0 0' }}>
                Monthly gross revenue performance (in Lakhs INR)
              </p>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: '#D13239',
                backgroundColor: '#FFF0F0',
                padding: '3px 8px',
                borderRadius: '6px',
              }}
            >
              Current: ₹184L
            </span>
          </div>
          <RevenueChart data={mockRevenueTrends} />
        </div>

        {/* Booking Trend Chart */}
        <div className="st-card" style={{ padding: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                Booking Trend
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '2px 0 0 0' }}>
                Multi-modal confirmed trips across 6 networks
              </p>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: '#2563EB',
                backgroundColor: '#EFF6FF',
                padding: '3px 8px',
                borderRadius: '6px',
              }}
            >
              +18.2% Growth
            </span>
          </div>
          <BookingTrendChart data={mockRevenueTrends} />
        </div>
      </div>

      {/* Secondary Charts: Travel Types & Booking Status */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '24px',
          marginBottom: '28px',
        }}
      >
        {/* Travel Type Distribution */}
        <div className="st-card" style={{ padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
              Travel Type Distribution
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '2px 0 0 0' }}>
              Volume breakdown: Bus, Train, Flight, Hotel, Cab, Auto
            </p>
          </div>
          <TravelDistributionChart data={mockTravelDistribution} />
        </div>

        {/* Booking Status Overview */}
        <div className="st-card" style={{ padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
              Booking Status Breakdown
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '2px 0 0 0' }}>
              Real-time platform lifecycle distribution
            </p>
          </div>
          <BookingStatusChart data={mockBookingStatusOverview} />

          {/* Quick Shortcuts */}
          <div
            style={{
              marginTop: '20px',
              padding: '14px',
              borderRadius: '10px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#0F172A' }}>
                Pending Action Items
              </span>
              <span style={{ fontSize: '0.6875rem', color: '#D97706', fontWeight: '800' }}>
                3 Awaiting Super Admin
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem' }}>
              <div
                onClick={() => navigate('/payments')}
                style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', color: '#334155' }}
              >
                <span>• 1 Pending Mock Refund (REF-4922)</span>
                <span style={{ color: '#D13239', fontWeight: '600' }}>Review →</span>
              </div>
              <div
                onClick={() => navigate('/safety')}
                style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', color: '#334155' }}
              >
                <span>• 1 Open Safety Investigation (SAF-301)</span>
                <span style={{ color: '#D13239', fontWeight: '600' }}>Inspect →</span>
              </div>
              <div
                onClick={() => navigate('/tracking')}
                style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', color: '#334155' }}
              >
                <span>• 1 Active Delay Alert Broadcast</span>
                <span style={{ color: '#D13239', fontWeight: '600' }}>Live Map →</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Split Row: Recent Bookings Table (Left) & Recent Activity Timeline (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Recent Bookings */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                Recent Bookings
              </h2>
              <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '2px 0 0 0' }}>
                Latest reservations from the SmartTrip mobile ecosystem
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/bookings')}
              className="st-btn st-btn-ghost st-btn-sm"
              style={{ color: '#D13239', fontWeight: '700' }}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <DataTable
            columns={columns}
            data={filteredBookings}
            searchPlaceholder="Search by ID, user, route..."
            searchKeys={['id', 'route', 'operator']}
            filterNode={
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="st-input st-select"
                style={{ width: '130px', height: '38px', fontSize: '0.75rem', fontWeight: '600' }}
              >
                <option value="ALL">All Travel</option>
                <option value="BUS">Bus</option>
                <option value="TRAIN">Train</option>
                <option value="FLIGHT">Flight</option>
                <option value="HOTEL">Hotel</option>
                <option value="CAB">Cab</option>
                <option value="AUTO">Auto</option>
              </select>
            }
            pageSize={5}
            onRowClick={(row) => setSelectedBooking(row)}
          />
        </div>

        {/* Recent Activity Timeline */}
        <div className="st-card" style={{ padding: '20px' }}>
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
              Recent Activity
            </h2>
            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '2px 0 0 0' }}>
              Live audit trail of platform events
            </p>
          </div>
          <ActivityTimeline activities={mockRecentActivity} />
        </div>
      </div>

      {/* Booking Details Drawer */}
      <Drawer
        isOpen={Boolean(selectedBooking)}
        onClose={() => setSelectedBooking(null)}
        title={`Booking ${selectedBooking?.id}`}
        subtitle={`${selectedBooking?.travelType?.toUpperCase()} RESERVATION SUMMARY`}
        width="540px"
        footer={
          <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={() => {
                updateBookingStatus(selectedBooking.id, 'cancelled');
                setSelectedBooking(null);
              }}
              className="st-btn st-btn-danger st-btn-sm"
              disabled={selectedBooking?.bookingStatus === 'cancelled'}
            >
              Cancel Ticket
            </button>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="st-btn st-btn-secondary st-btn-sm"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  updateBookingStatus(selectedBooking.id, 'confirmed');
                  setSelectedBooking(null);
                }}
                className="st-btn st-btn-primary st-btn-sm"
              >
                Confirm Ticket
              </button>
            </div>
          </div>
        }
      >
        {selectedBooking && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Status Strip */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                backgroundColor: '#F8FAFC',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Status</span>
                <StatusBadge status={selectedBooking.bookingStatus} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Travel Vertical</span>
                <TravelBadge type={selectedBooking.travelType} />
              </div>
            </div>

            {/* Travel Route & Operator */}
            <div>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
                Travel Details
              </h4>
              <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.9375rem', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
                  {selectedBooking.route}
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#475569', marginBottom: '8px' }}>
                  {selectedBooking.operator}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B' }}>
                  <span>Departure: <strong>{selectedBooking.travelDate}</strong></span>
                  <span>Seats/Room: <strong>{selectedBooking.seats?.join(', ')}</strong></span>
                </div>
              </div>
            </div>

            {/* Passenger List */}
            <div>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
                Passenger Information
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedBooking.passengers?.map((p, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.8125rem',
                    }}
                  >
                    <div>
                      <strong style={{ color: '#0F172A' }}>{p.name}</strong>
                      <span style={{ color: '#64748B', marginLeft: '6px' }}>({p.gender}, {p.age} yrs)</span>
                    </div>
                    <span style={{ fontWeight: '700', color: '#D13239' }}>{p.seat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock Payment Details */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', margin: 0 }}>
                  Payment Details
                </h4>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    backgroundColor: '#FFFBEB',
                    color: '#92400E',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid #FDE68A',
                    fontWeight: '700',
                  }}
                >
                  MOCK PAYMENT
                </span>
              </div>
              <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                  <span style={{ color: '#64748B' }}>Mock Transaction ID:</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: '700' }}>{selectedBooking.mockPaymentId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                  <span style={{ color: '#64748B' }}>Payment Method:</span>
                  <span>{selectedBooking.paymentMethod}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                  <span style={{ color: '#64748B' }}>Base Fare:</span>
                  <span>₹{selectedBooking.fareBreakdown?.baseFare}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                  <span style={{ color: '#64748B' }}>Taxes & GST:</span>
                  <span>₹{selectedBooking.fareBreakdown?.gst}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.9375rem',
                    fontWeight: '800',
                    color: '#0F172A',
                    borderTop: '1px solid #F1F5F9',
                    paddingTop: '8px',
                    marginTop: '8px',
                  }}
                >
                  <span>Total Amount Paid:</span>
                  <span style={{ color: '#D13239' }}>₹{selectedBooking.amount}</span>
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
                Booking Audit Timeline
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '8px' }}>
                {selectedBooking.timeline?.map((t, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', fontSize: '0.75rem' }}>
                    <span style={{ color: '#94A3B8', width: '110px', flexShrink: 0 }}>{t.time}</span>
                    <span style={{ color: '#334155', fontWeight: '500' }}>{t.event}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
