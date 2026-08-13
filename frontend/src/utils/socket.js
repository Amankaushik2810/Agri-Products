import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (token, userId) => {
  if (!socket) {
    socket = io('https://agri-products.onrender.com', {
      auth: { token },
      query: { userId },
      transports: ['websocket'],
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
