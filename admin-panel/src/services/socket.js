import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

let socketInstance = null;

export const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socketInstance.on('connect', () => {
      console.log('⚡ [Socket.IO] Connected to SmartTrip Backend with ID:', socketInstance.id);
      socketInstance.emit('join_room', 'admin');
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('⚠️ [Socket.IO] Disconnected:', reason);
    });

    socketInstance.on('connect_error', (error) => {
      console.warn('⚠️ [Socket.IO] Connection error:', error.message);
    });
  }
  return socketInstance;
};

// Real-time Event Subscription Helpers
export const subscribeToSos = (callback) => {
  const socket = getSocket();
  socket.on('sos_alert', callback);
  socket.on('sos_broadcast', callback);
  return () => {
    socket.off('sos_alert', callback);
    socket.off('sos_broadcast', callback);
  };
};

export const subscribeToVehicleLocations = (callback) => {
  const socket = getSocket();
  socket.on('vehicle_location_update', callback);
  return () => {
    socket.off('vehicle_location_update', callback);
  };
};

export const subscribeToDelays = (callback) => {
  const socket = getSocket();
  socket.on('delay_alert', callback);
  socket.on('delay_alert_confirmed', callback);
  return () => {
    socket.off('delay_alert', callback);
    socket.off('delay_alert_confirmed', callback);
  };
};

export const subscribeToSupportChat = (ticketId, callback) => {
  const socket = getSocket();
  const eventName = `ticket_message:${ticketId}`;
  socket.on(eventName, callback);
  socket.on('admin_support_message', callback);
  return () => {
    socket.off(eventName, callback);
    socket.off('admin_support_message', callback);
  };
};

// Dispatch Helpers
export const emitTriggerSos = (sosData) => {
  const socket = getSocket();
  socket.emit('trigger_sos', sosData);
};

export const emitDelayBroadcast = (delayData) => {
  const socket = getSocket();
  socket.emit('broadcast_delay', delayData);
};

export const emitSupportMessage = (messageData) => {
  const socket = getSocket();
  socket.emit('send_support_message', messageData);
};

export default {
  getSocket,
  subscribeToSos,
  subscribeToVehicleLocations,
  subscribeToDelays,
  subscribeToSupportChat,
  emitTriggerSos,
  emitDelayBroadcast,
  emitSupportMessage,
};
