import Game from '../classes/models/game.class.js';
import { gameSessions } from './sessions.js';
import { findUser } from './user.session.js';

export const addGameSession = (id, user) => {
  const session = new Game(id);
  session.addUser(user);
  gameSessions.push(session);
  return session;
};
export const inviteGameSession = (id, user) => {
  const session = getGameSessionById(id);
  session.addUser(user);
  return session.users;
};
export const removeGameSession = () => {
  delete gameSessions[0];
};

export const getGameSession = () => {
  return gameSessions;
};

export const getGameSessionById = (id) => {
  const game = gameSessions.find((game) => game.id === id);
  if (!game) {
    console.error('gameRoom not found');
  }
  return game;
};
