import { createResponse } from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/header.js';
import { sendAddEnemyTowerNotification } from '../notification/addEnemyTower.notification.js';
import {
  findEnemyRedis,
  getGoldRedis,
  getTowerRedis,
  increaseTowerIdRedis,
  setGoldRedis,
  setTowerRedis,
} from '../../sessions/game.redis.js';
import { saveSocket } from '../../events/onConnection.js';

const TOWER_COST = 3000;

export const towerPurchaseRequestHandler = async ({ socket, payload }) => {
  const start = performance.now();

  // 여기에 측정할 코드

  console.log('towerPurchaseRequestHandler Called');

  const { x, y } = payload;

  const getTowerId = await increaseTowerIdRedis(socket.id);

  const newTowerData = {
    towerId: getTowerId,
    x: x,
    y: y,
  };

  const findEnemySocketId = await findEnemyRedis(socket.id);
  const enemySocket = saveSocket.get(findEnemySocketId);

  if (enemySocket) {
    await sendAddEnemyTowerNotification(
      enemySocket,
      newTowerData.towerId,
      newTowerData.x,
      newTowerData.y,
      start,
    );
  } else {
    console.error('Opponent user not found');
  }

  const towerPurchaseResponse = {
    towerId: getTowerId,
  };

  const responsePayload = createResponse(PacketType.TOWER_PURCHASE_RESPONSE, towerPurchaseResponse);
  socket.write(responsePayload);

  // 레디스 갱신
  const getTowers = await getTowerRedis(socket.id);

  getTowers.push(newTowerData);
  await setTowerRedis(socket.id, getTowers);

  // 돈 계산
  let userGold = await getGoldRedis(socket.id);

  if (userGold < TOWER_COST) {
    return;
  }

  userGold -= TOWER_COST;

  await setGoldRedis(socket.id, userGold);
};

export default towerPurchaseRequestHandler;
