const { activeVehicles, emitSosAlert, emitDelayAlert } = require("../socket");
const { sendSuccess, sendError } = require("../utils/response");

// In-memory safety reports
let safetyIncidents = [
  {
    id: "SOS-9021",
    userId: "USR-8821",
    userName: "Neha Kulkarni",
    userPhone: "+91 98223 44551",
    tripId: "TRK-BUS-102",
    mode: "BUS",
    location: {
      lat: 16.6956,
      lng: 74.2317,
      address: "Near Kolhapur Bypass Toll, NH48",
    },
    severity: "HIGH",
    note: "Bus stopped at isolated dark patch for >45 mins without driver explanation. Passenger felt unsafe.",
    status: "INVESTIGATING",
    timestamp: "2026-09-29 10:15 IST",
    adminNotes: "Dispatched local highway patrol and contacted Shivneri control desk.",
  },
  {
    id: "SOS-8910",
    userId: "USR-4412",
    userName: "Rahul Sharma",
    userPhone: "+91 97112 33445",
    tripId: "TRK-CAB-301",
    mode: "CAB",
    location: {
      lat: 19.0896,
      lng: 72.8656,
      address: "Santacruz Western Express Highway",
    },
    severity: "MEDIUM",
    note: "Cab tyre punctured on highway flyover.",
    status: "RESOLVED",
    timestamp: "2026-09-29 08:45 IST",
    adminNotes: "Backup cab assigned within 12 minutes. Passenger safely reached terminal.",
  },
];

// In-memory support tickets
let supportTickets = [
  {
    id: "TCK-5501",
    passenger: "Sachin Tendulkar",
    email: "sachin.t@example.com",
    category: "Refund Delay",
    priority: "HIGH",
    status: "Open",
    subject: "Refund not credited for cancelled flight AI-804",
    lastUpdated: "10 mins ago",
    messages: [
      { sender: "user", time: "10:15 AM", text: "I cancelled my flight ticket 3 days back, but amount ₹4,200 is still pending." },
      { sender: "admin", time: "10:22 AM", text: "Hello Sachin, checking bank transaction reference with Razorpay settlement now." },
    ],
  },
  {
    id: "TCK-5502",
    passenger: "Pooja Jadhav",
    email: "pooja.j@example.com",
    category: "Seat Allocation",
    priority: "MEDIUM",
    status: "In Progress",
    subject: "Senior citizen lower berth preference not assigned",
    lastUpdated: "25 mins ago",
    messages: [
      { sender: "user", time: "09:40 AM", text: "Requested lower berth for my mother on Deccan Queen, but middle berth was allotted." },
    ],
  },
];

const getOverview = async (req, res, next) => {
  try {
    const overview = {
      totalRevenue: 1482450,
      totalBookings: 1489,
      activeUsers: 3420,
      liveTripsCount: activeVehicles.length,
      openTicketsCount: supportTickets.filter((t) => t.status !== "Resolved").length,
      activeSosCount: safetyIncidents.filter((s) => s.status !== "RESOLVED").length,
      monthlyGrowth: "+18.4%",
      systemStatus: {
        apiServer: "ONLINE",
        socketServer: "HEALTHY",
        database: "READY",
        timestamp: new Date().toISOString(),
      },
    };
    return sendSuccess(res, "Admin overview stats retrieved", overview);
  } catch (error) {
    next(error);
  }
};

const getLiveTracking = async (req, res, next) => {
  try {
    return sendSuccess(res, "Live tracking vehicles retrieved", {
      vehicles: activeVehicles,
      totalActive: activeVehicles.length,
    });
  } catch (error) {
    next(error);
  }
};

const broadcastDelay = async (req, res, next) => {
  try {
    const { tripId, delayMinutes, message } = req.body;
    if (!tripId || !delayMinutes) {
      return sendError(res, "tripId and delayMinutes are required", 400);
    }

    const payload = {
      tripId,
      delayMinutes: Number(delayMinutes),
      message: message || `Trip ${tripId} is delayed by ${delayMinutes} minutes due to traffic.`,
      broadcastAt: new Date().toISOString(),
    };

    emitDelayAlert(payload);
    return sendSuccess(res, "Delay alert broadcasted via Socket.io", payload);
  } catch (error) {
    next(error);
  }
};

const getSafetyReports = async (req, res, next) => {
  try {
    return sendSuccess(res, "Safety reports retrieved", {
      reports: safetyIncidents,
      activeSosCount: safetyIncidents.filter((s) => s.status !== "RESOLVED").length,
    });
  } catch (error) {
    next(error);
  }
};

const triggerSos = async (req, res, next) => {
  try {
    const { userId, userName, userPhone, tripId, mode, location, note, severity } = req.body;
    const newIncident = {
      id: `SOS-${Date.now().toString().slice(-4)}`,
      userId: userId || "USR-MOCK",
      userName: userName || "Traveler in Distress",
      userPhone: userPhone || "+91 98000 12345",
      tripId: tripId || "TRK-BUS-101",
      mode: mode || "BUS",
      location: location || { lat: 18.5204, lng: 73.8567, address: "Pune Swargate Bus Stand" },
      severity: severity || "CRITICAL",
      note: note || "Emergency SOS Triggered from Mobile App",
      status: "INVESTIGATING",
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      adminNotes: "Alerted control team via real-time Socket.IO dispatch.",
    };

    safetyIncidents.unshift(newIncident);
    emitSosAlert(newIncident);

    return sendSuccess(res, "Emergency SOS triggered and dispatched", newIncident, 201);
  } catch (error) {
    next(error);
  }
};

const updateSafetyIncident = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const incident = safetyIncidents.find((s) => s.id === id);
    if (!incident) {
      return sendError(res, "Safety incident not found", 404);
    }

    if (status) incident.status = status;
    if (note) incident.adminNotes = `${incident.adminNotes ? incident.adminNotes + " | " : ""}${note}`;

    return sendSuccess(res, "Safety incident updated", incident);
  } catch (error) {
    next(error);
  }
};

const getSupportTickets = async (req, res, next) => {
  try {
    return sendSuccess(res, "Support tickets retrieved", { tickets: supportTickets });
  } catch (error) {
    next(error);
  }
};

const replySupportTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text, sender } = req.body;

    const ticket = supportTickets.find((t) => t.id === id);
    if (!ticket) {
      return sendError(res, "Support ticket not found", 404);
    }

    const newMsg = {
      sender: sender || "admin",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text,
    };
    ticket.messages.push(newMsg);
    ticket.status = "In Progress";
    ticket.lastUpdated = "Just now";

    return sendSuccess(res, "Reply added to ticket", { ticket, message: newMsg });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverview,
  getLiveTracking,
  broadcastDelay,
  getSafetyReports,
  triggerSos,
  updateSafetyIncident,
  getSupportTickets,
  replySupportTicket,
};
