// src/handler/game/towerAttackRequest.handler.js

import { getUserBySocket } from '../../sessions/user.session.js';
import { getGameSessionById } from '../../sessions/game.session.js';
import { sendEnemyTowerAttackNotification } from '../notification/enemyTowerAttack.notification.js';

export const towerAttackRequestHandler = async ({ socket, payload }) => {
  console.log('towerAttackRequestHandler Called');

  const user = await getUserBySocket(socket);
  const gameSession = getGameSessionById(user.currentSessionId);

  if (!gameSession) {
    console.error('Game session not found for user:', user.username);
    return;
  }

  const { towerId, monsterId } = payload;

  // 서버에서 데미지 처리를 하지 않고, 받은 ID를 그대로 상대방에게 전달합니다.
  const opponentUser = gameSession.users.find(u => u.id !== user.id);
  if (opponentUser) {
    await sendEnemyTowerAttackNotification(opponentUser, towerId, monsterId);
    console.log(`EnemyTowerAttackNotification sent to ${opponentUser.username}`);
  } else {
    console.error('Opponent user not found in game session');
  }
};

export default towerAttackRequestHandler;
