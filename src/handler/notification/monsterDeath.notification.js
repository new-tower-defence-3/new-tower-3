// handlers/notifications/monsterDeath.notification.js

import { getUserBySocket } from '../../sessions/user.session.js';
import { getGameSessionById } from '../../sessions/game.session.js';
import { sendEnemyMonsterDeathNotification } from './enemyMonsterDeath.notification.js';

export const monsterDeathNotificationHandler = async ({ socket, payload }) => {
  console.log('monsterDeathNotificationHandler Called');

  const user = await getUserBySocket(socket);
  const gameSession = getGameSessionById(user.currentSessionId);

  if (!gameSession) {
    console.error('Game session not found for user:', user.username);
    return;
  }

  const { monsterId } = payload;

  // 현재 플레이어의 몬스터 목록에서 몬스터 제거
  gameSession.removeMonster(user.id, monsterId);

  // 상대방에게 EnemyMonsterDeathNotification 전송
  const opponentUser = gameSession.users.find(u => u.id !== user.id);
  if (opponentUser) {
    await sendEnemyMonsterDeathNotification(opponentUser, monsterId);
    console.log(`EnemyMonsterDeathNotification sent to ${opponentUser.username}`);
  } else {
    console.error('Opponent user not found in game session');
  }
};

export default monsterDeathNotificationHandler;
