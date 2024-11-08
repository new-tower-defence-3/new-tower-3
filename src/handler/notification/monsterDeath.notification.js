// handlers/notifications/monsterDeath.notification.js

import { getUserBySocket } from '../../sessions/user.session.js';
import { getGameSessionById } from '../../sessions/game.session.js';
import { sendEnemyMonsterDeathNotification } from './enemyMonsterDeath.notification.js';
import { findEnemyRedis, getMonsterRedis, setMonsterRedis } from '../../sessions/game.redis.js';
import { saveSocket } from '../../events/onConnection.js';

export const monsterDeathNotificationHandler = async ({ socket, payload }) => {
  console.log('monsterDeathNotificationHandler Called');

  // const user = await getUserBySocket(socket);
  // const gameSession = getGameSessionById(user.currentSessionId);

  // if (!gameSession) {
  //   console.error('Game session not found for user:', user.id);
  //   return;
  // }

  const { monsterId } = payload;

  // 현재 플레이어의 몬스터 목록에서 몬스터 제거

  const beforeMonster = await getMonsterRedis(socket.id);

  const afterMonster = beforeMonster.filter((monster) => monster.monsterId !== monsterId);

  console.log('afterMonster', afterMonster);
  await setMonsterRedis(socket.id, afterMonster);

  const findEnemySocketId = await findEnemyRedis(socket.id);
  const enemySocket = saveSocket.get(findEnemySocketId);

  // 상대방에게 EnemyMonsterDeathNotification 전송
  if (enemySocket) {
    await sendEnemyMonsterDeathNotification(enemySocket, monsterId);
  } else {
    console.error('Opponent user not found in game session');
  }
};

export default monsterDeathNotificationHandler;
