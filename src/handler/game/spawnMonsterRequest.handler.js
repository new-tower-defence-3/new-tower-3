import { sendSpawnEnemyMonsterNotification } from '../notification/spawnEnemyMonster.notification.js';
import { PacketType } from '../../constants/header.js';
import { createResponse } from '../../utils/response/createResponse.js';
import {
  findEnemyRedis,
  getMonsterRedis,
  increaseMonsterIdRedis,
  setMonsterRedis,
} from '../../sessions/game.redis.js';
import { saveSocket } from '../../events/onConnection.js';

export const spawnMonsterRequestHandler = async ({ socket }) => {
  console.log('spawnMonsterRequestHandler Called');

  const monsterNumber = Math.floor(Math.random() * 5) + 1;
  const monsterId = await increaseMonsterIdRedis(socket.id);

  const monsterData = {
    monsterId: monsterId,
    monsterNumber: monsterNumber,
  };

  const payload = createResponse(PacketType.SPAWN_MONSTER_RESPONSE, monsterData);
  socket.write(payload);

  // 상대방에게 SpawnEnemyMonsterNotification 전송
  const enemySocketId = await findEnemyRedis(socket.id);
  if (enemySocketId === null) {
    return;
  }
  const enemySocket = saveSocket.get(enemySocketId);

  await sendSpawnEnemyMonsterNotification(
    enemySocket,
    monsterData.monsterId,
    monsterData.monsterNumber,
  );

  // Redis 갱신........
  const getMonsterR = await getMonsterRedis(socket.id);

  if (getMonsterR === null) {
    return;
  }
  getMonsterR.push(monsterData);

  await setMonsterRedis(socket.id, getMonsterR);
};

export default spawnMonsterRequestHandler;
