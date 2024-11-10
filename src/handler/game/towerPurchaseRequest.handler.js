// handlers/requests/towerPurchaseRequest.handler.js

import { getUserBySocket } from '../../sessions/user.session.js';
import { getGameSessionById } from '../../sessions/game.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/header.js';
import { sendAddEnemyTowerNotification } from '../notification/addEnemyTower.notification.js';

const TOWER_COST = 3000;

export const towerPurchaseRequestHandler = async ({ socket, payload }) => {
  console.log('towerPurchaseRequestHandler Called');

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
  console.log("New Tower Data:", newTower);
  
  // 클라이언트에게 타워 구매 응답 전송
  const towerPurchaseResponse = {
    towerId: newTower.towerId
  };

  const responsePayload = createResponse(PacketType.TOWER_PURCHASE_RESPONSE, towerPurchaseResponse);
  socket.write(responsePayload);
  console.error(`TowerPurchaseResponse sent to ${user.id}`);

  const opponentUser = gameSession.users.find(u => u.id !== user.id);
  if (opponentUser) {
    await sendAddEnemyTowerNotification(opponentUser, newTower.towerId, newTower.x, newTower.y);
  } else {
    console.error('Opponent user not found');
  }
};

export default towerPurchaseRequestHandler;

