// handlers/notifications/monsterDeath.notification.js

import { getUserBySocket } from '../../sessions/user.session.js';
import { getGameSessionById } from '../../sessions/game.session.js';
import { sendEnemyMonsterDeathNotification } from './enemyMonsterDeath.notification.js';
import { GOLD_PER_MONSTER, SCORE_PER_MONSTER } from '../../constants/constants.js';

export const monsterDeathNotificationHandler = async ({ socket, payload }) => {

  const user = await getUserBySocket(socket);
  const gameSession = getGameSessionById(user.currentSessionId);

  if (!gameSession) {
    console.error('Game session not found for user:', user.id);
    return;
  }

  const { monsterId } = payload;

  // 현재 플레이어의 몬스터 목록에서 몬스터 제거
  gameSession.removeMonster(user.id, monsterId);

  const state = gameSession.getUserState(user.id);
  state.score += SCORE_PER_MONSTER;
  state.gold += GOLD_PER_MONSTER;

  const previousLevel = state.monsterLevel || 1;
  const newLevel = Math.floor(state.score / 3000) + 1;
  if (newLevel > previousLevel) {
    state.monsterLevel = newLevel;
  }

  // 상대방에게 EnemyMonsterDeathNotification 전송
  const opponentUser = gameSession.users.find(u => u.id !== user.id);
  if (opponentUser) {
    await sendEnemyMonsterDeathNotification(opponentUser, monsterId);
  } else {
    console.error('Opponent user not found in game session');
  }
};

export default monsterDeathNotificationHandler;
