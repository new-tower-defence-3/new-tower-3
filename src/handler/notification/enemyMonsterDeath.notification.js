// handlers/notifications/enemyMonsterDeath.notification.js

import { createResponse } from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/header.js';

export const sendEnemyMonsterDeathNotification = async (user, monsterId) => {
  const notification = {
    monsterId,
  };

  const payload = createResponse(PacketType.ENEMY_MONSTER_DEATH_NOTIFICATION, notification);

  try {
    user.socket.write(payload);
    console.log('EnemyMonsterDeathNotification sent to user:', user.id);
  } catch (error) {
    console.error('Failed to send EnemyMonsterDeathNotification:', error);
  }
};
