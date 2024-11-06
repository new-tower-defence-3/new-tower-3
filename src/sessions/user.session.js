import { userSessions } from './sessions.js';

export const addUser = async (user) => {
  userSessions.push(user);
  return user;
};

export const getUserByUserId = (userId) => {
  return userSessions.find((user) => user.userId === userId);
};

export const removeUser = async (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);
  if (index != -1) {
    return userSessions.splice(index, 1)[0];
  }
};

export const getUserBySocket = (socket) => {
  const user = userSessions.find((user) => user.socket === socket);
  if (!user) {
    console.error('User not found');
  }
  return user;
};

export const getAllUser = async () => {
  return userSessions;
};

export const findUser = async (username) => {
  const findSession = userSessions.find((a) => a.username === username);
  return findSession;
};

export const findMatchingUser = async () => {
  const findSession = userSessions.filter((user) => user.isMatching === true);
  return findSession;
};
