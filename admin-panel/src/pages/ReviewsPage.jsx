import React, { useState } from 'react';
import {
  Star,
  Eye,
  EyeOff,
  ThumbsUp,
  ThumbsDown,
  Filter,
  MessageSquare,
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import TravelBadge from '../components/common/TravelBadge';
import { useAdmin } from '../context/AdminContext';

export default function ReviewsPage() {
  const { reviews, toggleReviewStatus, showToast } = useAdmin();
  const [ratingFilter, setRatingFilter] = useState('ALL');

  const filteredReviews = reviews.filter((r) => {
    if (ratingFilter !== 'ALL' && r.rating !== Number(ratingFilter)) {
      return false;
    }
    return true;
  });

  const columns = [
    {
      header: 'User',
      accessor: 'user',
      render: (row) => <strong style={{ color: '#0F172A' }}>{row.user}</strong>,
    },
    {
      header: 'Travel Type',
      accessor: 'travelType',
      render: (row) => <TravelBadge type={row.travelType} />,
    },
    {
      header: 'Operator / Service',
      accessor: 'operator',
      render: (row) => <span style={{ color: '#334155', fontWeight: '600' }}>{row.operator}</span>,
    },
    {
      header: 'Rating',
      accessor: 'rating',
      render: (row) => (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              fill={i < row.rating ? '#F59E0B' : '#E2E8F0'}
              color={i < row.rating ? '#F59E0B' : '#E2E8F0'}
            />
          ))}
          <span style={{ fontSize: '0.75rem', fontWeight: '700', marginLeft: '4px', color: '#1E293B' }}>
            {row.rating}.0
          </span>
        </div>
      ),
    },
    {
      header: 'Review Feedback',
      accessor: 'review',
      render: (row) => (
        <div style={{ maxWidth: '320px', color: '#475569', fontSize: '0.8125rem', lineHeight: 1.4 }}>
          "{row.review}"
        </div>
      ),
    },
    {
      header: 'Date',
      accessor: 'date',
      render: (row) => <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{row.date}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      header: 'Actions',
      accessor: 'actions',
      sortable: false,
      render: (row) => (
        <button
          type="button"
          onClick={() => toggleReviewStatus(row.id)}
          className={`st-btn st-btn-sm ${row.status === 'Published' ? 'st-btn-secondary' : 'st-btn-primary'}`}
          style={{ padding: '4px 8px' }}
        >
          {row.status === 'Published' ? (
            <>
              <EyeOff size={13} />
              <span>Hide</span>
            </>
          ) : (
            <>
              <Eye size={13} />
              <span>Restore</span>
            </>
          )}
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Ratings & Reviews"
        subtitle="Monitor customer feedback across bus operators, train journeys, airlines, and drivers"
        breadcrumbs={[{ label: 'Reviews' }]}
      />

      {/* Review KPIs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div className="st-card" style={{ padding: '16px 20px', borderLeft: '4px solid #F59E0B' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>AVERAGE RATING</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0F172A' }}>4.8</span>
            <div style={{ display: 'flex', gap: '2px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={15} fill="#F59E0B" color="#F59E0B" />
              ))}
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '600' }}>Platform satisfaction 96%</span>
        </div>

        <div className="st-card" style={{ padding: '16px 20px', borderLeft: '4px solid #2563EB' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>TOTAL REVIEWS</span>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
            8,420
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Verified mobile travelers</span>
        </div>

        <div className="st-card" style={{ padding: '16px 20px', borderLeft: '4px solid #059669' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>POSITIVE REVIEWS (4-5★)</span>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#059669', marginTop: '2px' }}>
            7,980
          </div>
          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '600' }}>94.8% of total</span>
        </div>

        <div className="st-card" style={{ padding: '16px 20px', borderLeft: '4px solid #DC2626' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>NEGATIVE REVIEWS (1-2★)</span>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#DC2626', marginTop: '2px' }}>
            140
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>1.6% of total</span>
        </div>
      </div>

      {/* Reviews DataTable */}
      <DataTable
        columns={columns}
        data={filteredReviews}
        searchPlaceholder="Search reviews by user, operator, feedback..."
        searchKeys={['user', 'operator', 'review']}
        filterNode={
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="st-input st-select"
            style={{ width: '130px', height: '38px', fontSize: '0.75rem', fontWeight: '600' }}
          >
            <option value="ALL">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        }
        exportFileName="smarttrip_reviews"
        pageSize={6}
      />
    </div>
  );
}
