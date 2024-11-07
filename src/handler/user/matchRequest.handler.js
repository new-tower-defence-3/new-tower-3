// src/handler/user/matchRequest.handler.js

import { getUserBySocket } from '../../sessions/user.session.js';
import { MAX_PLAYERS } from '../../constants/header.js';
import { addGameSession, getGameSession } from '../../sessions/game.session.js';
import matchStartNotification from '../../handler/notification/matchStart.notification.js';

export const matchRequestHandler = async ({ socket }) => {
  console.log('matchRequestHandler Called');
  const user = await getUserBySocket(socket);

  const gameSessions = getGameSession();
  let joinedSession = null;

  for (let session of gameSessions) {
    if (session.users.length < MAX_PLAYERS) {
      session.addUser(user);
      user.currentSessionId = session.id;
      joinedSession = session;
      break;
    }
  }

  if (!joinedSession) {
    const gameId = user.username;
    const gameSession = addGameSession(gameId);
    gameSession.addUser(user);
    user.currentSessionId = gameId;
    joinedSession = gameSession;
  }

  if (joinedSession.users.length === MAX_PLAYERS) {
    matchStartNotification(joinedSession);
  }
};

export default matchRequestHandler;
