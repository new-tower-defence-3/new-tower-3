// File: handlers/requests/towerAttackRequest.handler.js

import { getUserBySocket } from '../../sessions/user.session.js';
import { getGameSessionById } from '../../sessions/game.session.js';
import { sendEnemyTowerAttackNotification } from '../notification/enemyTowerAttack.notification.js';

export const towerAttackRequestHandler = async ({ socket, data }) => {
  console.log('towerAttackRequestHandler Called');

  const user = await getUserBySocket(socket);
  const gameSession = getGameSessionById(user.currentSessionId);

  if (!gameSession) {
    console.error('Game session not found for user:', user.username);
    return;
  }
  console.log(data);

  const { towerId, monsterId } = data;

  // Update game state if necessary (e.g., validate tower and monster)

  // Notify the opponent
  const opponentUser = gameSession.users.find(u => u !== user);
  if (opponentUser) {
    await sendEnemyTowerAttackNotification(opponentUser, towerId, monsterId);
  } else {
    console.error('Opponent user not found in game session');
  }
};

export default towerAttackRequestHandler;
