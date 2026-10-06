import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Download,
  TrendingUp,
  Users,
  CreditCard,
  PieChart,
  FileSpreadsheet,
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import RevenueChart from '../components/charts/RevenueChart';
import BookingTrendChart from '../components/charts/BookingTrendChart';
import TravelDistributionChart from '../components/charts/TravelDistributionChart';
import BookingStatusChart from '../components/charts/BookingStatusChart';
import {
  mockRevenueTrends,
  mockTravelDistribution,
  mockBookingStatusOverview,
} from '../data/mockData';
import { useAdmin } from '../context/AdminContext';

export default function ReportsAnalyticsPage() {
  const { showToast } = useAdmin();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'bookings' | 'revenue' | 'users' | 'travelTypes'
  const [timeframe, setTimeframe] = useState('30 Days');

  const handleExport = () => {
    showToast(`Compiled ${timeframe} executive intelligence report. Generating PDF/CSV...`, 'success');
  };

  return (
    <div>
      <PageHeader
        title="Reports & Platform Analytics"
        subtitle="Deep dive performance metrics, revenue trajectories, cohort retention, and capacity utilization"
        breadcrumbs={[{ label: 'Reports & Analytics' }]}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#FFFFFF', padding: '4px 10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <Calendar size={15} color="#64748B" />
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
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
                <option value="7 Days">7 Days</option>
                <option value="30 Days">30 Days</option>
                <option value="3 Months">3 Months</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleExport}
              className="st-btn st-btn-primary"
            >
              <Download size={15} />
              <span>Export Report</span>
            </button>
          </div>
        }
      />

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          borderBottom: '1px solid #E2E8F0',
          marginBottom: '24px',
        }}
      >
        {[
          { id: 'overview', label: 'Executive Overview' },
          { id: 'bookings', label: 'Booking Growth' },
          { id: 'revenue', label: 'Revenue Trends' },
          { id: 'users', label: 'User Retention' },
          { id: 'travelTypes', label: 'Travel Modes Share' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px',
              border: 'none',
              borderBottom: activeTab === tab.id ? '3px solid #D13239' : '3px solid transparent',
              backgroundColor: 'transparent',
              color: activeTab === tab.id ? '#D13239' : '#64748B',
              fontWeight: activeTab === tab.id ? '800' : '600',
              fontSize: '0.875rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 140ms ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
            <div className="st-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0F172A', marginBottom: '14px' }}>
                Revenue Trajectory (H1 FY26)
              </h3>
              <RevenueChart data={mockRevenueTrends} />
            </div>

            <div className="st-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0F172A', marginBottom: '14px' }}>
                Booking Volume Expansion
              </h3>
              <BookingTrendChart data={mockRevenueTrends} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
            <div className="st-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0F172A', marginBottom: '14px' }}>
                Travel Vertical Mix
              </h3>
              <TravelDistributionChart data={mockTravelDistribution} />
            </div>

            <div className="st-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0F172A', marginBottom: '14px' }}>
                Order Fulfillment Health
              </h3>
              <BookingStatusChart data={mockBookingStatusOverview} />
            </div>
          </div>
        </div>
      )}

      {/* Booking Growth Tab */}
      {activeTab === 'bookings' && (
        <div className="st-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '800', color: '#0F172A', marginBottom: '16px' }}>
            Booking Growth & Route Occupancy
          </h3>
          <BookingTrendChart data={mockRevenueTrends} />
          <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '10px' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0F172A', marginBottom: '8px' }}>
              Top 3 Most Profitable Routes:
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.8125rem', color: '#475569', lineHeight: 1.6 }}>
              <li><strong>Pune Swargate ⇄ Goa Panaji (Bus):</strong> 88.4% Average Load Factor</li>
              <li><strong>Mumbai CSMT ⇄ Pune Jn (Train 12127):</strong> 94.6% Chair Car Utilization</li>
              <li><strong>Mumbai BOM ⇄ Delhi DEL (Flight 6E-2041):</strong> ₹68.9L Gross Quarterly Revenue</li>
            </ul>
          </div>
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div className="st-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '800', color: '#0F172A', marginBottom: '16px' }}>
            Financial Settlement Breakdown
          </h3>
          <RevenueChart data={mockRevenueTrends} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '24px' }}>
            <div style={{ padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Gross Travel Value</span>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A' }}>₹1.84 Cr</div>
            </div>
            <div style={{ padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Platform Convenience Fees</span>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#059669' }}>₹9.2 L</div>
            </div>
            <div style={{ padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Refund Deductions (1.3%)</span>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#DC2626' }}>₹2.45 L</div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="st-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '800', color: '#0F172A', marginBottom: '16px' }}>
            User Acquisition & Repeat Travel Rate
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '18px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>30-DAY RETENTION</span>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#2563EB', margin: '4px 0' }}>68.4%</div>
              <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>Travelers booking 2+ trips per month</p>
            </div>
            <div style={{ padding: '18px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>AVG ORDER VALUE</span>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#059669', margin: '4px 0' }}>₹1,420</div>
              <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>Across all 6 transport verticals</p>
            </div>
            <div style={{ padding: '18px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>APP RATINGS NPS</span>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#D13239', margin: '4px 0' }}>+72</div>
              <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>Benchmark travel-tech standard</p>
            </div>
          </div>
        </div>
      )}

      {/* Travel Types Tab */}
      {activeTab === 'travelTypes' && (
        <div className="st-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '800', color: '#0F172A', marginBottom: '16px' }}>
            Travel Modes Market Share & Revenue Realization
          </h3>
          <TravelDistributionChart data={mockTravelDistribution} />
        </div>
      )}
    </div>
  );
}
