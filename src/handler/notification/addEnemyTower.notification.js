// handlers/notifications/addEnemyTower.notification.js

import { createResponse } from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/header.js';

export const sendAddEnemyTowerNotification = async (user, towerId, x, y) => {
  const addEnemyTowerNotification = {
    towerId,
    x,
    y,
  };

  const payload = createResponse(PacketType.ADD_ENEMY_TOWER_NOTIFICATION, addEnemyTowerNotification);

  try {
    user.socket.write(payload);
  } catch (error) {
    console.error('Failed to send AddEnemyTowerNotification:', error);
  }
};

export default sendAddEnemyTowerNotification;
