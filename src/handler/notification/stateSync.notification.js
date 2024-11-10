// src/handler/game/stateSyncNotyHandler.js

import { findUser } from '../../sessions/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/header.js';
import { getGameSessionById } from '../../sessions/game.session.js';
import { handleError } from '../../utils/error/errorHandler.js';

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

export const sendStateSyncNotification = async (userId) => {
  const user = await findUser(userId);
  if (!user) {
    console.error(`User not found for userId: ${userId}`);
    return;
  }

  const gameSession = getGameSessionById(user.currentSessionId);
  if (!gameSession) {
    console.error(`Game session not found for user: ${user.id}`);
    return;
  }

  const userState = gameSession.getUserState(user.id);

  const stateSyncNotification = {
    userGold: userState.gold,
    baseHp: userState.baseHp,
    monsterLevel: userState.monsterLevel || 1,
    score: userState.score || 0,
    towers: userState.towers,
    monsters: userState.monsters,
  };

  const opponentUser = gameSession.users.find(u => u.id !== user.id);
  const opponentState = gameSession.getOpponentState(user.id);

  const opponentStateSyncNotification = {
    userGold: opponentState.gold,
    baseHp: opponentState.baseHp,
    monsterLevel: opponentState.monsterLevel || 1,
    score: opponentState.score || 0,
    towers: opponentState.towers,
    monsters: opponentState.monsters,
  };


  const payload = createResponse(PacketType.STATE_SYNC_NOTIFICATION, stateSyncNotification);
  const opponentPayload = createResponse(PacketType.STATE_SYNC_NOTIFICATION, opponentStateSyncNotification);

  try {
    user.socket.write(payload);
    opponentUser.socket.write(opponentPayload);
  } catch (error) {
    handleError(user.socket, error);
  }
};

export default sendStateSyncNotification;