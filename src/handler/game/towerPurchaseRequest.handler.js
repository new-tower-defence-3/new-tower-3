// handlers/requests/towerPurchaseRequest.handler.js

import { getUserBySocket } from '../../sessions/user.session.js';
import { getGameSessionById } from '../../sessions/game.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/header.js';
import { sendAddEnemyTowerNotification } from '../notification/addEnemyTower.notification.js';
import { createActionLog } from '../../db/log/log.db.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';

const TOWER_COST = 1000;

export const towerPurchaseRequestHandler = async ({ socket, payload }) => {

  const user = await getUserBySocket(socket);
  if (!user) {
    console.error('User not found for socket');
    return;
  }

  const gameSession = getGameSessionById(user.currentSessionId);
  if (!gameSession) {
    console.error(`Game session not found for user: ${user.id}`);
    return;
  }

  const userState = gameSession.getUserState(user.id);

  // 유저의 골드가 충분한지 확인
  if (userState.gold < TOWER_COST) {
    console.error('Not enough gold to purchase tower');
    return;
  }

  userState.gold -= TOWER_COST;

  const { x, y } = payload;
  const newTower = gameSession.addTower(user.id, { x, y });

  // 클라이언트에게 타워 구매 응답 전송
  const towerPurchaseResponse = {
    towerId: newTower.towerId,
  };

  const responsePayload = createResponse(PacketType.TOWER_PURCHASE_RESPONSE, towerPurchaseResponse);
  socket.write(responsePayload);

  const opponentUser = gameSession.users.find(u => u.id !== user.id);
  if (opponentUser) {
    await sendAddEnemyTowerNotification(opponentUser, newTower.towerId, newTower.x, newTower.y);
  } else {
    console.error('Opponent user not found');
  }

  try {
    createActionLog(PacketType.MONSTER_ATTACK_BASE_REQUEST, `${user.id}가 타워 구입`);
  } catch (e) {
    throw new CustomError(ErrorCodes.DB_UPDATE_FAILED, e.message);
  }
};

export default towerPurchaseRequestHandler;

