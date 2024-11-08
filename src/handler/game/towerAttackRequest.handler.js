// src/handler/game/towerAttackRequest.handler.js

import { getUserBySocket } from '../../sessions/user.session.js';
import { getGameSessionById } from '../../sessions/game.session.js';
import { sendEnemyTowerAttackNotification } from '../notification/enemyTowerAttack.notification.js';
import { findEnemyRedis } from '../../sessions/game.redis.js';
import { saveSocket } from '../../events/onConnection.js';

export const towerAttackRequestHandler = async ({ socket, payload }) => {
  console.log('towerAttackRequestHandler Called');

  // const user = await getUserBySocket(socket);
  // const gameSession = getGameSessionById(user.currentSessionId);

  // if (!gameSession) {
  //   console.error('Game session not found for user:', user.id);
  //   return;

  const { towerId, monsterId } = payload;
  const findEnemySocketId = await findEnemyRedis(socket.id);
  const enemySocket = saveSocket.get(findEnemySocketId);

  // 서버에서 데미지 처리를 하지 않고, 받은 ID를 그대로 상대방에게 전달합니다.
  if (enemySocket) {
    await sendEnemyTowerAttackNotification(enemySocket, towerId, monsterId);
  } else {
    console.error('Opponent user not found in game session');
  }
};
export default towerAttackRequestHandler;
