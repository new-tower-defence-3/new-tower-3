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
    console.log("TOWER NOTY SEND");
    user.socket.write(payload);
    console.log(`AddEnemyTowerNotification sent to ${user.id}`);
  } catch (error) {
    console.error('Failed to send AddEnemyTowerNotification:', error);
  }
};

export default sendAddEnemyTowerNotification;
