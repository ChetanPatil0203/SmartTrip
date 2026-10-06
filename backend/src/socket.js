const { Server } = require("socket.io");
const logger = require("./utils/logger");

let io = null;

// In-memory simulation of active vehicles for live tracking
const activeVehicles = [
  {
    id: "TRK-BUS-101",
    mode: "BUS",
    title: "Shivneri Express (Pune -> Mumbai)",
    lat: 18.7557,
    lng: 73.4091,
    speed: "68 km/h",
    driverName: "Ramesh Pawar",
    driverPhone: "+91 98234 11223",
    status: "ON_TIME",
    delayMinutes: 0,
    currentLocation: "Lonavala Ghat",
    nextStop: "Panvel Expressway Toll",
    eta: "45 mins",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "TRK-BUS-102",
    mode: "BUS",
    title: "Purple Travels (Pune -> Goa)",
    lat: 16.6956,
    lng: 74.2317,
    speed: "55 km/h",
    driverName: "Sanjay Shinde",
    driverPhone: "+91 98220 55443",
    status: "DELAYED",
    delayMinutes: 25,
    currentLocation: "Kolhapur Bypass",
    nextStop: "Nipani Phata",
    eta: "3 hrs 20 mins",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "TRK-TRN-201",
    mode: "TRAIN",
    title: "Deccan Queen Superfast Express (Pune -> CSMT)",
    lat: 18.9902,
    lng: 73.1215,
    speed: "92 km/h",
    driverName: "Loco Pilot Deshmukh",
    driverPhone: "+91 98230 77889",
    status: "ON_TIME",
    delayMinutes: 0,
    currentLocation: "Kalyan Junction Outer",
    nextStop: "Dadar Central",
    eta: "35 mins",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "TRK-CAB-301",
    mode: "CAB",
    title: "SmartCab Sedan (Mumbai Airport -> Pune)",
    lat: 19.0896,
    lng: 72.8656,
    speed: "40 km/h",
    driverName: "Vijay Jadhav",
    driverPhone: "+91 97654 33221",
    status: "ON_TIME",
    delayMinutes: 0,
    currentLocation: "Santacruz Western Express",
    nextStop: "Vashi Bridge",
    eta: "2 hrs 40 mins",
    lastUpdated: new Date().toISOString(),
  }
];

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Join specific rooms: 'admin', 'user:123', 'trip:TRK-101'
    socket.on("join_room", (roomName) => {
      socket.join(roomName);
      logger.info(`Socket ${socket.id} joined room: ${roomName}`);
      socket.emit("joined_room_ack", { room: roomName, status: "ok" });
    });

    socket.on("leave_room", (roomName) => {
      socket.leave(roomName);
      logger.info(`Socket ${socket.id} left room: ${roomName}`);
    });

    // Request current vehicle locations
    socket.on("get_active_vehicles", () => {
      socket.emit("active_vehicles_data", activeVehicles);
    });

    // Traveler SOS emergency trigger
    socket.on("trigger_sos", (data) => {
      const alertPayload = {
        id: `SOS-${Date.now().toString().slice(-4)}`,
        userId: data.userId || "USER-ANON",
        userName: data.userName || "Traveler",
        userPhone: data.userPhone || "+91 98000 00000",
        tripId: data.tripId || "TRIP-LIVE",
        mode: data.mode || "BUS",
        location: data.location || { lat: 18.5204, lng: 73.8567, address: "Pune Swargate Bus Stand" },
        severity: data.severity || "HIGH",
        note: data.note || "Emergency SOS Button Pressed",
        timestamp: new Date().toISOString(),
        status: "ACTIVE",
      };

      logger.warn(`EMERGENCY SOS RECEIVED: ${JSON.stringify(alertPayload)}`);

      // Broadcast to admin room & all subscribers
      io.to("admin").emit("sos_alert", alertPayload);
      io.emit("sos_broadcast", alertPayload);
    });

    // Driver or Vehicle GPS ping
    socket.on("update_location", (locationData) => {
      const idx = activeVehicles.findIndex((v) => v.id === locationData.id);
      if (idx !== -1) {
        activeVehicles[idx] = {
          ...activeVehicles[idx],
          ...locationData,
          lastUpdated: new Date().toISOString(),
        };
      }
      io.to("admin").emit("vehicle_location_update", locationData);
      io.to(`trip:${locationData.id}`).emit("vehicle_location_update", locationData);
    });

    // Delay broadcast
    socket.on("broadcast_delay", (delayData) => {
      const idx = activeVehicles.findIndex((v) => v.id === delayData.tripId);
      if (idx !== -1) {
        activeVehicles[idx].status = "DELAYED";
        activeVehicles[idx].delayMinutes = delayData.delayMinutes;
      }
      io.emit("delay_alert", delayData);
      io.to("admin").emit("delay_alert_confirmed", delayData);
    });

    // Support chat live message
    socket.on("send_support_message", (messageData) => {
      const chatPayload = {
        id: `MSG-${Date.now()}`,
        ticketId: messageData.ticketId,
        sender: messageData.sender, // 'user' or 'admin'
        senderName: messageData.senderName || (messageData.sender === "admin" ? "SmartTrip Support" : "Passenger"),
        text: messageData.text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        timestamp: new Date().toISOString(),
      };
      io.emit(`ticket_message:${messageData.ticketId}`, chatPayload);
      io.to("admin").emit("admin_support_message", chatPayload);
    });

    socket.on("disconnect", () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    logger.warn("Socket.io is not initialized yet");
  }
  return io;
};

const emitSosAlert = (data) => {
  if (io) {
    io.to("admin").emit("sos_alert", data);
    io.emit("sos_broadcast", data);
  }
};

const emitDelayAlert = (data) => {
  if (io) {
    io.emit("delay_alert", data);
    io.to("admin").emit("delay_alert_confirmed", data);
  }
};

const emitNewBooking = (booking) => {
  if (io) {
    io.to("admin").emit("new_booking_event", booking);
  }
};

module.exports = {
  initSocket,
  getIO,
  emitSosAlert,
  emitDelayAlert,
  emitNewBooking,
  activeVehicles,
};
