// handlers/notifications/enemyTowerAttack.notification.js

import { createResponse } from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/header.js';

export const sendEnemyTowerAttackNotification = async (user, towerId, monsterId) => {
  const notification = {
    towerId,
    monsterId,
  };

  const payload = createResponse(PacketType.ENEMY_TOWER_ATTACK_NOTIFICATION, notification);

  try {
    user.socket.write(payload);
    console.log('EnemyTowerAttackNotification sent to user:', user.id);
  } catch (error) {
    console.error('Failed to send EnemyTowerAttackNotification:', error);
  }
};
