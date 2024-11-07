// File: handlers/requests/towerAttackRequest.handler.js

import { getUserBySocket } from '../../sessions/user.session.js';
import { getGameSessionById } from '../../sessions/game.session.js';

export const towerAttackRequestHandler = async ({ socket, payload }) => {
  console.log('towerAttackRequestHandler Called');

  const user = await getUserBySocket(socket);
  const gameSession = getGameSessionById(user.currentSessionId);

  if (!gameSession) {
    console.error('Game session not found for user:', user.username);
    return;
  }
  console.log(payload);

  const { towerId, monsterId } = payload;
};

export default towerAttackRequestHandler;
