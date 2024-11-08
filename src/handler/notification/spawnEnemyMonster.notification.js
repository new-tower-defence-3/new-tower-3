// handler/notification/spawnEnemyMonster.notification.js

import { createResponse } from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/header.js';
import { saveSocket } from '../../events/onConnection.js';

export const sendSpawnEnemyMonsterNotification = async (opponentUser, monsterId, monsterNumber) => {
  const spawnEnemyMonsterNotification = {
    monsterId: monsterId,
    monsterNumber: monsterNumber,
  };

  const gamePacketNotification = {
    spawnEnemyMonsterNotification: spawnEnemyMonsterNotification,
  };

  try {
    const notificationPayload = createResponse(
      PacketType.SPAWN_ENEMY_MONSTER_NOTIFICATION,
      gamePacketNotification.spawnEnemyMonsterNotification,
    );
    opponentUser.write(notificationPayload);
  } catch (error) {
    console.error('S2CSpawnEnemyMonsterNotification 전송 중 오류 발생:', error);
    throw error; // 호출자에게 에러를 전달
  }
};
