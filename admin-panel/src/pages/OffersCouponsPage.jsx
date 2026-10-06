import React, { useState } from 'react';
import {
  TicketPercent,
  Plus,
  Edit,
  Trash2,
  Tag,
  Calendar,
  Eye,
  CheckCircle2,
  AlertCircle,
  Copy,
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import TravelBadge from '../components/common/TravelBadge';
import Modal from '../components/common/Modal';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import { useAdmin } from '../context/AdminContext';

export default function OffersCouponsPage() {
  const { offers, addOffer, coupons, addCoupon, toggleCouponStatus, showToast } = useAdmin();
  const [activeTab, setActiveTab] = useState('offers'); // 'offers' | 'coupons'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('offer'); // 'offer' | 'coupon'
  const [formData, setFormData] = useState({});

  // Columns for Offers Table
  const offerColumns = [
    {
      header: 'Offer Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '700', color: '#0F172A' }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>ID: {row.id}</div>
        </div>
      ),
    },
    {
      header: 'Travel Type',
      accessor: 'travelType',
      render: (row) => <TravelBadge type={row.travelType} />,
    },
    {
      header: 'Discount',
      accessor: 'discount',
      render: (row) => (
        <span
          style={{
            fontWeight: '800',
            color: '#D13239',
            backgroundColor: '#FFF0F0',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '0.8125rem',
          }}
        >
          {row.discount}
        </span>
      ),
    },
    {
      header: 'Validity',
      accessor: 'validity',
      render: (row) => <span style={{ fontSize: '0.75rem', color: '#334155' }}>Until {row.validity}</span>,
    },
    {
      header: 'Usage',
      accessor: 'usageCount',
      render: (row) => (
        <span style={{ fontWeight: '700', color: '#1E293B' }}>
          {row.usageCount.toLocaleString()} times
        </span>
      ),
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
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            onClick={() => showToast(`Offer ${row.name} details viewed`, 'info')}
            className="st-btn st-btn-secondary st-btn-sm"
            style={{ padding: '4px 8px' }}
          >
            <Eye size={13} />
            <span>Details</span>
          </button>
        </div>
      ),
    },
  ];

  // Columns for Coupons Table
  const couponColumns = [
    {
      header: 'Code',
      accessor: 'code',
      render: (row) => (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              fontFamily: 'monospace',
              fontWeight: '900',
              color: '#0F172A',
              backgroundColor: '#F1F5F9',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px dashed #CBD5E1',
              letterSpacing: '0.06em',
            }}
          >
            {row.code}
          </span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(row.code);
              showToast(`Coupon code ${row.code} copied!`, 'success');
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
            title="Copy code"
          >
            <Copy size={13} />
          </button>
        </div>
      ),
    },
    {
      header: 'Discount',
      accessor: 'discount',
      render: (row) => <span style={{ fontWeight: '700', color: '#D13239' }}>{row.discount}</span>,
    },
    {
      header: 'Usage Limit',
      accessor: 'usageLimit',
      render: (row) => (
        <span style={{ fontSize: '0.8125rem', color: '#1E293B' }}>
          <strong>{row.usedCount}</strong> / {row.usageLimit}
        </span>
      ),
    },
    {
      header: 'Validity',
      accessor: 'validity',
      render: (row) => <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Until {row.validity}</span>,
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
          onClick={() => toggleCouponStatus(row.id)}
          className={`st-btn st-btn-sm ${row.status === 'ACTIVE' ? 'st-btn-secondary' : 'st-btn-primary'}`}
          style={{ padding: '4px 8px' }}
        >
          {row.status === 'ACTIVE' ? 'Pause' : 'Activate'}
        </button>
      ),
    },
  ];

  const handleOpenCreateModal = (type) => {
    setModalType(type);
    if (type === 'offer') {
      setFormData({
        name: '',
        travelType: 'bus',
        discount: 'Flat ₹150 OFF',
        validity: '2026-11-30',
      });
    } else {
      setFormData({
        code: '',
        discount: 'Flat ₹100 OFF',
        usageLimit: 1000,
        validity: '2026-12-31',
      });
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (modalType === 'offer') {
      addOffer(formData);
    } else {
      addCoupon(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Offers & Coupons"
        subtitle="Manage seasonal travel discounts, promo vouchers, and code redemption rules"
        breadcrumbs={[{ label: 'Offers & Coupons' }]}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleOpenCreateModal('offer')}
              className="st-btn st-btn-secondary"
            >
              <Plus size={15} />
              <span>Create Offer</span>
            </button>
            <button
              type="button"
              onClick={() => handleOpenCreateModal('coupon')}
              className="st-btn st-btn-primary"
            >
              <Plus size={15} />
              <span>Create Coupon</span>
            </button>
          </div>
        }
      />

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
          onClick={() => setActiveTab('offers')}
          style={{
            padding: '12px 20px',
            border: 'none',
            borderBottom: activeTab === 'offers' ? '3px solid #D13239' : '3px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'offers' ? '#D13239' : '#64748B',
            fontWeight: activeTab === 'offers' ? '800' : '600',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
        >
          Special Travel Offers ({offers.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('coupons')}
          style={{
            padding: '12px 20px',
            border: 'none',
            borderBottom: activeTab === 'coupons' ? '3px solid #D13239' : '3px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'coupons' ? '#D13239' : '#64748B',
            fontWeight: activeTab === 'coupons' ? '800' : '600',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
        >
          Promo Coupon Codes ({coupons.length})
        </button>
      </div>

      {/* Tables */}
      {activeTab === 'offers' ? (
        <DataTable
          columns={offerColumns}
          data={offers}
          searchPlaceholder="Search offers by name, discount..."
          searchKeys={['name', 'discount', 'travelType']}
          exportFileName="smarttrip_offers"
          pageSize={8}
        />
      ) : (
        <DataTable
          columns={couponColumns}
          data={coupons}
          searchPlaceholder="Search coupons by code, discount..."
          searchKeys={['code', 'discount']}
          exportFileName="smarttrip_coupons"
          pageSize={8}
        />
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'offer' ? 'Create New Travel Offer' : 'Create New Coupon Code'}
        subtitle="Configure discount specifications and validity window"
        maxWidth="500px"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="st-btn st-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleFormSubmit}
              className="st-btn st-btn-primary"
            >
              Publish {modalType === 'offer' ? 'Offer' : 'Coupon'}
            </button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {modalType === 'offer' ? (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  Offer Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pune-Goa Weekend Super Saver"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="st-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  Target Travel Category
                </label>
                <select
                  value={formData.travelType || 'bus'}
                  onChange={(e) => setFormData({ ...formData, travelType: e.target.value })}
                  className="st-input st-select"
                >
                  <option value="bus">Bus</option>
                  <option value="train">Train</option>
                  <option value="flight">Flight</option>
                  <option value="hotel">Hotel</option>
                  <option value="cab">Cab</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  Discount Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 15% OFF up to ₹250"
                  value={formData.discount || ''}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  className="st-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  Expiry Validity Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.validity || ''}
                  onChange={(e) => setFormData({ ...formData, validity: e.target.value })}
                  className="st-input"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  Coupon Code (Uppercase)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DIWALI2026"
                  value={formData.code || ''}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="st-input"
                  style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  Discount Value
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat ₹150 OFF"
                  value={formData.discount || ''}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  className="st-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  Total Usage Quota / Limit
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 2500"
                  value={formData.usageLimit || ''}
                  onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                  className="st-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  Validity Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.validity || ''}
                  onChange={(e) => setFormData({ ...formData, validity: e.target.value })}
                  className="st-input"
                />
              </div>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
}
