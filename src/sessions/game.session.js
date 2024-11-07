// src/sessions/game.session.js

import Game from '../classes/models/game.class.js';
import { gameSessions } from './sessions.js';

export const addGameSession = (id) => {
  const session = new Game(id);
  gameSessions.push(session);
  return session;
};

export const inviteGameSession = (id, user) => {
  const session = getGameSessionById(id);
  session.addUser(user);
  return session;
};

export const removeGameSession = (id) => {
  const index = gameSessions.findIndex((session) => session.id === id);
  if (index !== -1) {
    gameSessions.splice(index, 1);
  }
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
