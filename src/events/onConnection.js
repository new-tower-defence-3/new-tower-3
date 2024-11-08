import { onData } from './onData.js';
import { onEnd } from './onEnd.js';
import { onError } from './onError.js';
import { v4 as uuidv4 } from 'uuid';

export const saveSocket = new Map();
export const onConnection = (socket) => {
  console.log(`Client connected from: ${socket.remoteAddress}:${socket.remotePort}`);

  socket.buffer = Buffer.alloc(0);
  socket.id = uuidv4();
  saveSocket.set(socket.id, socket);

  socket.on('data', onData(socket));
  socket.on('end', onEnd(socket));
  socket.on('error', onError(socket));
};
