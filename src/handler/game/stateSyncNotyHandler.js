// src/handler/game/stateSyncNotyHandler.js

import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

/**
 * 패킷 구조
 * message S2CStateSyncNotification {
 *     int32 userGold = 1;
 *     int32 baseHp = 2;
 *     int32 monsterLevel = 3;
 *     int32 score = 4;
 *     repeated TowerData towers = 5;
 *     repeated MonsterData monsters = 6;
 * }
 */

/**
 * 클라이언트 수신 구조
 * towers와 monsters는 사용되지 않는다.
 * public void StateSyncNotification(GamePacket gamePacket)
 * {
 *     var response = gamePacket.StateSyncNotification;
 *     GameManager.instance.level = response.MonsterLevel;
 *     GameManager.instance.homeHp1 = response.BaseHp;
 *     GameManager.instance.score = response.Score;
 *     GameManager.instance.gold = response.UserGold;
 * }
 */

const stateSyncNotyHandler = ({ socket, payload }) => {
  try {
    const { userGold, baseHp, monsterLevel, score, towers, monsters } = payload;
    const data = { userGold, baseHp, monsterLevel, score, towers, monsters };

    // 세션 유효성 검증

    // 해당 세션의 유저 유효성 검증

    const response = createResponse(7, data);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};

export default stateSyncNotyHandler;