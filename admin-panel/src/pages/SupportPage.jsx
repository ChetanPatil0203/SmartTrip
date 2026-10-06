import React, { useState } from 'react';
import {
  Headphones,
  Send,
  MessageSquare,
  Clock,
  User,
  AlertCircle,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import Drawer from '../components/common/Drawer';
import { useAdmin } from '../context/AdminContext';

export default function SupportPage() {
  const { tickets, replyToTicket, updateTicketStatus, showToast } = useAdmin();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Status Filter
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredTickets = tickets.filter((t) => {
    if (statusFilter !== 'ALL' && t.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    return true;
  });

  const columns = [
    {
      header: 'Ticket ID',
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
          <div style={{ fontWeight: '700', color: '#0F172A' }}>{row.user}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{row.email}</div>
        </div>
      ),
    },
    {
      header: 'Subject',
      accessor: 'subject',
      render: (row) => (
        <div style={{ maxWidth: '240px' }}>
          <div style={{ fontWeight: '600', color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {row.subject}
          </div>
          {row.bookingRef && (
            <div style={{ fontSize: '0.6875rem', color: '#94A3B8', fontFamily: 'monospace' }}>
              Ref: {row.bookingRef}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (row) => (
        <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: '500' }}>
          {row.category}
        </span>
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
      header: 'Created',
      accessor: 'created',
      render: (row) => <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{row.created}</span>,
    },
    {
      header: 'Action',
      accessor: 'action',
      sortable: false,
      render: (row) => (
        <button
          type="button"
          onClick={() => setSelectedTicket(row)}
          className="st-btn st-btn-secondary st-btn-sm"
          style={{ padding: '4px 8px' }}
        >
          <Eye size={13} />
          <span>Reply</span>
        </button>
      ),
    },
  ];

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    replyToTicket(selectedTicket.id, replyText);
    setSelectedTicket((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        { sender: 'admin', time: 'Just now', text: replyText },
      ],
    }));
    setReplyText('');
  };

  return (
    <div>
      <PageHeader
        title="Support & Helpdesk"
        subtitle="Manage user support tickets, triage urgent customer escalations, and send official admin replies"
        breadcrumbs={[{ label: 'Support' }]}
      />

      {/* Ticket Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px',
          marginBottom: '22px',
        }}
      >
        <div className="st-card" style={{ padding: '14px 18px', borderLeft: '4px solid #2563EB' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>ALL TICKETS</span>
          <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0F172A' }}>
            {tickets.length} Active
          </div>
        </div>
        <div className="st-card" style={{ padding: '14px 18px', borderLeft: '4px solid #D97706' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>OPEN & UNASSIGNED</span>
          <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#D97706' }}>
            {tickets.filter((t) => t.status === 'Open').length}
          </div>
        </div>
        <div className="st-card" style={{ padding: '14px 18px', borderLeft: '4px solid #0284C7' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>IN PROGRESS</span>
          <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0284C7' }}>
            {tickets.filter((t) => t.status === 'In Progress').length}
          </div>
        </div>
        <div className="st-card" style={{ padding: '14px 18px', borderLeft: '4px solid #059669' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>RESOLVED</span>
          <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#059669' }}>
            {tickets.filter((t) => t.status === 'Resolved').length}
          </div>
        </div>
      </div>

      {/* Ticket Table */}
      <DataTable
        columns={columns}
        data={filteredTickets}
        searchPlaceholder="Search tickets by subject, user, booking ref..."
        searchKeys={['id', 'user', 'subject', 'category', 'bookingRef']}
        filterNode={
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="st-input st-select"
            style={{ width: '130px', height: '38px', fontSize: '0.75rem', fontWeight: '600' }}
          >
            <option value="ALL">All Status</option>
            <option value="open">Open</option>
            <option value="in progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        }
        exportFileName="smarttrip_support_tickets"
        pageSize={8}
        onRowClick={(row) => setSelectedTicket(row)}
      />

      {/* Ticket Details & Chat Drawer */}
      <Drawer
        isOpen={Boolean(selectedTicket)}
        onClose={() => setSelectedTicket(null)}
        title={`Ticket ${selectedTicket?.id}`}
        subtitle={selectedTicket?.subject}
        width="540px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {selectedTicket?.status !== 'Resolved' ? (
                <button
                  type="button"
                  onClick={() => {
                    updateTicketStatus(selectedTicket.id, 'Resolved');
                    setSelectedTicket((prev) => ({ ...prev, status: 'Resolved' }));
                  }}
                  className="st-btn st-btn-primary st-btn-sm"
                >
                  <CheckCircle2 size={14} />
                  <span>Mark Resolved</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    updateTicketStatus(selectedTicket.id, 'In Progress');
                    setSelectedTicket((prev) => ({ ...prev, status: 'In Progress' }));
                  }}
                  className="st-btn st-btn-secondary st-btn-sm"
                >
                  Reopen Ticket
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSelectedTicket(null)}
              className="st-btn st-btn-secondary st-btn-sm"
            >
              Close
            </button>
          </div>
        }
      >
        {selectedTicket && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Meta Strip */}
            <div style={{ padding: '14px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>User Information:</span>
                <strong style={{ color: '#0F172A', fontSize: '0.8125rem' }}>{selectedTicket.user} ({selectedTicket.email})</strong>
              </div>
              {selectedTicket.bookingRef && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Linked Booking Reference:</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: '800', color: '#D13239' }}>{selectedTicket.bookingRef}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Priority & Status:</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <StatusBadge status={selectedTicket.priority} size="sm" />
                  <StatusBadge status={selectedTicket.status} size="sm" />
                </div>
              </div>
            </div>

            {/* Conversation Thread */}
            <div>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '12px' }}>
                Conversation History
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {selectedTicket.messages?.map((msg, idx) => {
                  const isAdmin = msg.sender === 'admin';
                  return (
                    <div
                      key={idx}
                      style={{
                        alignSelf: isAdmin ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        backgroundColor: isAdmin ? '#D13239' : '#F1F5F9',
                        color: isAdmin ? '#FFFFFF' : '#1E293B',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        borderBottomRightRadius: isAdmin ? '2px' : '12px',
                        borderBottomLeftRadius: !isAdmin ? '2px' : '12px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: '700',
                          marginBottom: '4px',
                          color: isAdmin ? '#FEE2E2' : '#64748B',
                        }}
                      >
                        {isAdmin ? 'Super Admin Support' : selectedTicket.user} • {msg.time}
                      </div>
                      <div style={{ fontSize: '0.8125rem', lineHeight: 1.45 }}>{msg.text}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Admin Reply Form */}
            <form onSubmit={handleSendReply} style={{ marginTop: '10px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                Dispatch Super Admin Reply
              </label>
              <textarea
                rows={3}
                required
                placeholder="Type official reply to passenger..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="st-input"
                style={{ resize: 'none', marginBottom: '8px' }}
              />
              <button
                type="submit"
                className="st-btn st-btn-primary st-btn-sm"
                style={{ width: '100%' }}
              >
                <Send size={14} />
                <span>Send Official Reply</span>
              </button>
            </form>
          </div>
        )}
      </Drawer>
    </div>
  );
}
