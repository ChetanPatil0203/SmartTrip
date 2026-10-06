import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  Filter,
  Plus,
  CalendarCheck,
  CreditCard,
  XCircle,
  RotateCcw,
  Clock,
  TicketPercent,
  Info,
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Modal from '../components/common/Modal';
import { useAdmin } from '../context/AdminContext';

export default function NotificationsPage() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    showToast,
    logAudit,
  } = useAdmin();

  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    type: 'General',
    message: '',
  });

  const categories = [
    'ALL',
    'Booking',
    'Payment',
    'Cancellation',
    'Refund',
    'Delay',
    'Offer',
    'General',
  ];

  const getIconForType = (type) => {
    switch (type.toLowerCase()) {
      case 'booking':
        return <CalendarCheck size={18} color="#D13239" />;
      case 'payment':
        return <CreditCard size={18} color="#059669" />;
      case 'cancellation':
        return <XCircle size={18} color="#DC2626" />;
      case 'refund':
        return <RotateCcw size={18} color="#7C3AED" />;
      case 'delay':
        return <Clock size={18} color="#D97706" />;
      case 'offer':
        return <TicketPercent size={18} color="#0284C7" />;
      default:
        return <Info size={18} color="#64748B" />;
    }
  };

  const filtered = notifications.filter((n) => {
    if (activeCategory !== 'ALL' && n.type.toLowerCase() !== activeCategory.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q);
    }
    return true;
  });

  const handleBroadcast = (e) => {
    e.preventDefault();
    showToast(`Broadcast notification dispatched to mobile users: "${broadcastForm.title}"`, 'success');
    logAudit('BROADCAST_NOTIFICATION', 'Notifications', broadcastForm.title);
    setBroadcastModalOpen(false);
    setBroadcastForm({ title: '', type: 'General', message: '' });
  };

  return (
    <div>
      <PageHeader
        title="Notifications Center"
        subtitle="Review platform alerts, trigger passenger broadcasts, and triage automated event webhooks"
        breadcrumbs={[{ label: 'Notifications' }]}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={markAllNotificationsRead}
              className="st-btn st-btn-secondary"
            >
              <CheckCheck size={16} />
              <span>Mark All Read</span>
            </button>
            <button
              type="button"
              onClick={() => setBroadcastModalOpen(true)}
              className="st-btn st-btn-primary"
            >
              <Plus size={16} />
              <span>New Broadcast</span>
            </button>
          </div>
        }
      />

      {/* Category Filter Pills */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '20px',
        }}
      >
        {categories.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: isSelected ? '1px solid #D13239' : '1px solid #E2E8F0',
                backgroundColor: isSelected ? '#FFF0F0' : '#FFFFFF',
                color: isSelected ? '#D13239' : '#475569',
                fontWeight: isSelected ? '800' : '600',
                fontSize: '0.8125rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 140ms ease',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <div className="st-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
          <input
            type="text"
            placeholder="Search notification messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="st-input"
            style={{ maxWidth: '360px', height: '38px', fontSize: '0.8125rem' }}
          />
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>
            No notifications in this category.
          </div>
        ) : (
          <div>
            {filtered.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px',
                  padding: '16px 20px',
                  borderBottom: '1px solid #F1F5F9',
                  backgroundColor: item.read ? '#FFFFFF' : '#FFFBFB',
                  transition: 'background-color 140ms ease',
                }}
              >
                <div style={{ display: 'flex', gap: '14px', flex: 1 }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      backgroundColor: item.read ? '#F1F5F9' : '#FFF0F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {getIconForType(item.type)}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: item.read ? '600' : '800', color: '#0F172A' }}>
                        {item.title}
                      </span>
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: '700',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          backgroundColor: '#F1F5F9',
                          color: '#475569',
                        }}
                      >
                        {item.type}
                      </span>
                      {!item.read && (
                        <span
                          style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            backgroundColor: '#D13239',
                            display: 'inline-block',
                          }}
                        />
                      )}
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: '#475569', margin: '0 0 6px 0', lineHeight: 1.4 }}>
                      {item.message}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{item.date}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {!item.read && (
                    <button
                      type="button"
                      onClick={() => markNotificationRead(item.id)}
                      className="st-btn st-btn-ghost st-btn-sm"
                      style={{ color: '#D13239', fontSize: '0.75rem' }}
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteNotification(item.id)}
                    className="st-btn st-btn-ghost st-btn-icon"
                    style={{ color: '#94A3B8' }}
                    title="Delete notification"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Broadcast Modal */}
      <Modal
        isOpen={broadcastModalOpen}
        onClose={() => setBroadcastModalOpen(false)}
        title="Broadcast System Notification"
        subtitle="Dispatch an urgent push notification to active SmartTrip app users"
        maxWidth="500px"
        footer={
          <>
            <button
              type="button"
              onClick={() => setBroadcastModalOpen(false)}
              className="st-btn st-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleBroadcast}
              className="st-btn st-btn-primary"
            >
              Broadcast Now
            </button>
          </>
        }
      >
        <form onSubmit={handleBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
              Notification Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Weather Advisory: Heavy Rains in Konkan Region"
              value={broadcastForm.title}
              onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
              className="st-input"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
              Notification Category
            </label>
            <select
              value={broadcastForm.type}
              onChange={(e) => setBroadcastForm({ ...broadcastForm, type: e.target.value })}
              className="st-input st-select"
            >
              <option value="General">General Announcement</option>
              <option value="Delay">Delay Alert</option>
              <option value="Offer">Promotional Offer</option>
              <option value="Booking">Booking Advisory</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
              Message Content
            </label>
            <textarea
              required
              rows={4}
              placeholder="Enter message details for passenger push notification..."
              value={broadcastForm.message}
              onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
              className="st-input"
              style={{ resize: 'vertical' }}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
