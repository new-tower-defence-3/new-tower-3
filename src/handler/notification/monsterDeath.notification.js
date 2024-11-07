// File: handlers/notifications/monsterDeathNotification.handler.js

import { getUserBySocket } from '../../sessions/user.session.js';
import { getGameSessionById } from '../../sessions/game.session.js';
import { sendEnemyMonsterDeathNotification } from './enemyMonsterDeath.notification.js';

export const monsterDeathNotification = async ({ socket, payload }) => {
  console.log('monsterDeathNotificationHandler Called');

  const user = await getUserBySocket(socket);
  const gameSession = getGameSessionById(user.currentSessionId);

  if (!gameSession) {
    console.error('Game session not found for user:', user.username);
    return;
  }

  const { monsterId } = payload;
  const isPlayer = gameSession.id === user.username;

  if (isPlayer) {
    gameSession.playerMonsters = gameSession.playerMonsters.filter(monster => monster.monsterId !== monsterId);
  } else {
    gameSession.opponentMonsters = gameSession.opponentMonsters.filter(monster => monster.monsterId !== monsterId);
  }

  const opponentUser = gameSession.users.find(u => u !== user);
  if (opponentUser) {
    await sendEnemyMonsterDeathNotification(opponentUser, monsterId);
  } else {
    console.error('Opponent user not found in game session');
  }
};

export default monsterDeathNotification;
