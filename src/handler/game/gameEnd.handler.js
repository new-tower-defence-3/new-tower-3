// src/handler/game/gameEnd.handler.js

import { getGameSessionById, removeGameSession } from '../../sessions/game.session.js';
import { getUserBySocket } from '../../sessions/user.session.js';

const gameEndRHandler = async (socket) => {
  try {
    const user = await getUserBySocket(socket);
    const gameSession = getGameSessionById(user.currentSessionId);

    gameSession.removeUser(socket);
    gameSession.removeInterval(gameSession);
    removeGameSession(gameSession.id);
  } catch (e) {
    console.error(e);
  }
};

export default gameEndRHandler;