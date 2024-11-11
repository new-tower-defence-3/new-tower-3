// src/handler/user/matchRequest.handler.js

import { getUserBySocket } from '../../sessions/user.session.js';
import { MAX_PLAYERS } from '../../constants/header.js';
import { addGameSession, getGameSession, getGameSessionById } from '../../sessions/game.session.js';
import matchStartNotification from '../../handler/notification/matchStart.notification.js';

export const matchRequestHandler = async ({ socket }) => {
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
    const gameId = user.id;
    const gameSession = addGameSession(gameId);
    gameSession.addUser(user);
    user.currentSessionId = gameId;
    joinedSession = gameSession;
  }

  if (joinedSession.users.length === MAX_PLAYERS) {
    matchStartNotification(joinedSession);
    const currentGameSession = getGameSessionById(joinedSession.id);
    setTimeout(() => currentGameSession.commenceSync(), 1000);
  }
};

export default matchRequestHandler;
