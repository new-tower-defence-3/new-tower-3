// handlers/notifications/addEnemyTower.notification.js

import { createResponse } from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/header.js';

export const sendAddEnemyTowerNotification = async (user, towerId, x, y, start) => {
  const addEnemyTowerNotification = {
    towerId,
    x,
    y,
  };

  const payload = createResponse(
    PacketType.ADD_ENEMY_TOWER_NOTIFICATION,
    addEnemyTowerNotification,
  );

  try {
    user.write(payload);

    const end = performance.now();
    console.log(`Execution time: ${end - start} ms`);
    console.log('상대가 타워구입');
  } catch (error) {
    console.error('Failed to send AddEnemyTowerNotification:', error);
  }
};

export default sendAddEnemyTowerNotification;
