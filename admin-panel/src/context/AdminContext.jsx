import React, { createContext, useContext, useState, useEffect } from 'react';
import adminApi from '../services/api';
import { getSocket, subscribeToSos, subscribeToDelays, emitTriggerSos } from '../services/socket';
import {
  initialBookings,
  initialUsers,
  mockTravelData,
  initialPayments,
  initialRefunds,
  initialOffers,
  initialCoupons,
  initialNotifications,
  initialTickets,
  initialSafetyReports,
  initialReviews,
  initialTrackingTrips,
  initialAuditLogs,
} from '../data/mockData';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    name: 'Chetan Patil',
    email: 'chetan.admin@smarttrip.com',
    role: 'Super Admin',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    phone: '+91 99999 00001',
    department: 'SmartTrip Platform Operations',
    lastLogin: '2026-09-29 08:30 IST',
  });

  // Global UI & Connectivity State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [globalSearch, setGlobalSearch] = useState('');
  const [backendOnline, setBackendOnline] = useState(true);
  const [socketConnected, setSocketConnected] = useState(() => getSocket().connected);
  const [activeEmergencyAlert, setActiveEmergencyAlert] = useState(null);

  // App Domain Data States
  const [bookings, setBookings] = useState(initialBookings);
  const [users, setUsers] = useState(initialUsers);
  const [travelData, setTravelData] = useState(mockTravelData);
  const [payments, setPayments] = useState(initialPayments);
  const [refunds, setRefunds] = useState(initialRefunds);
  const [offers, setOffers] = useState(initialOffers);
  const [coupons, setCoupons] = useState(initialCoupons);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [tickets, setTickets] = useState(initialTickets);
  const [safetyReports, setSafetyReports] = useState(initialSafetyReports);
  const [reviews, setReviews] = useState(initialReviews);
  const [trackingTrips, setTrackingTrips] = useState(initialTrackingTrips);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);

  // Audio Beeper for Emergency Alerts
  const playAlarmBeep = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      // Audio permission
    }
  };

  // Toast System
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Audit Log Helper
  const logAudit = (action, module, target, status = 'SUCCESS') => {
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      admin: `${currentUser.name} (Super Admin)`,
      action,
      module,
      target,
      ip: '192.168.1.104',
      status,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Auth Handlers
  const login = (email, password) => {
    setIsAuthenticated(true);
    showToast('Super Admin access authenticated successfully!', 'success');
    logAudit('LOGIN_SUCCESS', 'Authentication', `Super Admin: ${email}`);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast('You have signed out safely.', 'info');
  };

  // Booking Actions
  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, bookingStatus: newStatus } : b))
    );
    showToast(`Booking ${bookingId} status updated to ${newStatus.toUpperCase()}`, 'success');
    logAudit('BOOKING_STATUS_UPDATE', 'Bookings', `${bookingId} -> ${newStatus}`);
  };

  // User Actions
  const toggleUserStatus = (userId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          showToast(`User ${u.name} marked as ${updated}`, updated === 'ACTIVE' ? 'success' : 'warning');
          logAudit('USER_STATUS_CHANGE', 'Users', `${userId} (${updated})`);
          return { ...u, status: updated };
        }
        return u;
      })
    );
  };

  // Refund Actions
  const processRefund = (refundId) => {
    setRefunds((prev) =>
      prev.map((r) => {
        if (r.id === refundId) {
          showToast(`Mock refund ${refundId} for ₹${r.amount} processed to user wallet`, 'success');
          logAudit('REFUND_PROCESSED', 'Payments & Refunds', `${refundId} (₹${r.amount})`);
          return {
            ...r,
            status: 'PROCESSED',
            processedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
          };
        }
        return r;
      })
    );
  };

  // Notification Actions
  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    showToast('Notification deleted', 'info');
  };

  // Support Actions
  const replyToTicket = (ticketId, replyText) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const updatedMessages = [
            ...t.messages,
            {
              sender: 'admin',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              text: replyText,
            },
          ];
          showToast('Reply dispatched to user successfully', 'success');
          logAudit('TICKET_REPLY', 'Support', `Ticket ${ticketId}`);
          return { ...t, status: 'In Progress', messages: updatedMessages };
        }
        return t;
      })
    );
  };

  const updateTicketStatus = (ticketId, newStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
    showToast(`Ticket ${ticketId} status changed to ${newStatus}`, 'info');
  };

  // Safety Actions
  const updateSafetyStatus = (reportId, newStatus, note = '') => {
    setSafetyReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          const updatedNotes = note ? `${r.adminNotes ? r.adminNotes + ' | ' : ''}${note}` : r.adminNotes;
          showToast(`Safety incident ${reportId} marked as ${newStatus}`, 'success');
          logAudit('SAFETY_STATUS_UPDATE', 'Safety', `${reportId} -> ${newStatus}`);
          return { ...r, status: newStatus, adminNotes: updatedNotes };
        }
        return r;
      })
    );
  };

  // Review Actions
  const toggleReviewStatus = (reviewId) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const next = r.status === 'Published' ? 'Hidden' : 'Published';
          showToast(`Review ${reviewId} is now ${next}`, 'info');
          logAudit('REVIEW_VISIBILITY_TOGGLE', 'Reviews', `${reviewId} -> ${next}`);
          return { ...r, status: next };
        }
        return r;
      })
    );
  };

  // Offers & Coupons
  const addOffer = (newOffer) => {
    const id = `OFF-${Date.now().toString().slice(-3)}`;
    setOffers((prev) => [{ id, ...newOffer, usageCount: 0, status: 'ACTIVE' }, ...prev]);
    showToast(`Offer "${newOffer.name}" created!`, 'success');
    logAudit('OFFER_CREATED', 'Offers & Coupons', newOffer.name);
  };

  const addCoupon = (newCoupon) => {
    const id = `CPN-${Date.now().toString().slice(-2)}`;
    setCoupons((prev) => [{ id, ...newCoupon, usedCount: 0, status: 'ACTIVE' }, ...prev]);
    showToast(`Coupon "${newCoupon.code}" published!`, 'success');
    logAudit('COUPON_CREATED', 'Offers & Coupons', newCoupon.code);
  };

  const toggleCouponStatus = (couponId) => {
    setCoupons((prev) =>
      prev.map((c) => {
        if (c.id === couponId) {
          const status = c.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
          showToast(`Coupon ${c.code} status changed to ${status}`, 'info');
          return { ...c, status };
        }
        return c;
      })
    );
  };

  // Tracking & Delays
  const broadcastDelayAlert = (tripId, delayMinutes, message) => {
    setTrackingTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, status: 'Delayed', delay: `+${delayMinutes}m` } : t))
    );
    // Also push a notification
    const newNotif = {
      id: `NTF-${Date.now().toString().slice(-4)}`,
      type: 'Delay',
      title: `Delay Alert: Trip ${tripId} (+${delayMinutes}m)`,
      message: message || `Trip ${tripId} running with a delay of ${delayMinutes} minutes due to traffic.`,
      date: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`Delay alert broadcasted to passengers (+${delayMinutes}m)`, 'warning');
    logAudit('DELAY_ALERT_BROADCAST', 'Tracking & Delays', `${tripId} (+${delayMinutes}m)`);
  };

  // Real-time Socket & Initial Data Hydration
  useEffect(() => {
    // 1. Initial backend ping & stats
    adminApi.getOverview()
      .then(() => {
        setBackendOnline(true);
      })
      .catch(() => {
        setBackendOnline(false);
      });

    // 2. Socket.io initialization & subscriptions
    const socket = getSocket();
    const handleConnect = () => setSocketConnected(true);
    const handleDisconnect = () => setSocketConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Subscribe to Emergency SOS Alerts
    const unsubscribeSos = subscribeToSos((alert) => {
      playAlarmBeep();
      setActiveEmergencyAlert(alert);
      setSafetyReports((prev) => [alert, ...prev.filter((r) => r.id !== alert.id)]);
      showToast(`🚨 आणीबाणी (SOS Alert): ${alert.userName} - ${alert.location?.address || 'Alert'}`, 'error', 9000);
      logAudit('EMERGENCY_SOS_RECEIVED', 'Safety SOS', `${alert.id} (${alert.userName})`, 'CRITICAL');
    });

    // Subscribe to Delay Alerts
    const unsubscribeDelays = subscribeToDelays((delayInfo) => {
      showToast(`⚠️ विलंब सूचना (Delay): गाडी ${delayInfo.tripId} (+${delayInfo.delayMinutes} मिनिटे)`, 'warning');
    });

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      unsubscribeSos();
      unsubscribeDelays();
    };
  }, []);

  const clearActiveEmergency = () => {
    setActiveEmergencyAlert(null);
  };

  const simulateSos = async (passengerName = 'Sneha Deshmukh') => {
    const mockSos = {
      userId: `USR-${Date.now().toString().slice(-4)}`,
      userName: passengerName,
      userPhone: '+91 98221 88990',
      tripId: 'TRK-BUS-101',
      mode: 'BUS',
      location: {
        lat: 18.7557,
        lng: 73.4091,
        address: 'Lonavala Ghat Expressway, KM 64',
      },
      severity: 'CRITICAL',
      note: 'Driver driving rashly in heavy fog. Passenger pressed SOS button in SmartTrip app.',
    };

    try {
      await adminApi.triggerSos(mockSos);
      showToast('इमर्जन्सी SOS backend आणि Socket.IO वर पाठवला गेला!', 'info');
    } catch (err) {
      emitTriggerSos(mockSos);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        setCurrentUser,
        login,
        logout,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileMenuOpen,
        setMobileMenuOpen,
        dateRange,
        setDateRange,
        globalSearch,
        setGlobalSearch,
        backendOnline,
        socketConnected,
        activeEmergencyAlert,
        clearActiveEmergency,
        simulateSos,
        bookings,
        updateBookingStatus,
        users,
        toggleUserStatus,
        travelData,
        setTravelData,
        payments,
        setPayments,
        refunds,
        processRefund,
        offers,
        addOffer,
        coupons,
        addCoupon,
        toggleCouponStatus,
        notifications,
        unreadCount,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        tickets,
        replyToTicket,
        updateTicketStatus,
        safetyReports,
        updateSafetyStatus,
        reviews,
        toggleReviewStatus,
        trackingTrips,
        broadcastDelayAlert,
        auditLogs,
        logAudit,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
