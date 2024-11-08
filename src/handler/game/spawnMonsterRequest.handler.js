// src/handler/game/spawnMonsterRequest.handler.js

import { getUserBySocket } from '../../sessions/user.session.js';
import { getGameSessionById } from '../../sessions/game.session.js';
import { sendSpawnEnemyMonsterNotification } from '../notification/spawnEnemyMonster.notification.js';
import { PacketType } from '../../constants/header.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { getUserBySocketRedis } from '../../sessions/user.redis.js';
import { findEnemyRedis, getMonsterRedis, setMonsterRedis } from '../../sessions/game.redis.js';
import { saveSocket } from '../../events/onConnection.js';

export const spawnMonsterRequestHandler = async ({ socket }) => {
  console.log('spawnMonsterRequestHandler Called');

  // const user = await getUserBySocketRedis(socket.id);

  // console.log('sdfasdfasdfglkjansdflkjasdnflaksndgkj', user);

  // const gameSession = getGameSessionById(user.currentSessionId);

  // if (!gameSession) {
  //   console.error('Game session not found for user:', user.id);
  //   return;
  // }

  // const userState = gameSession.getUserState(user.id);
  // const opponentUser = gameSession.users.find((u) => u.id !== user.id);
  // const opponentState = gameSession.getUserState(opponentUser.id);

  // const monsterLevel = 1;

  // const newMonster = gameSession.addMonster(user.id, monsterNumber, monsterLevel);

  // 플레이어에게 SpawnMonsterResponse 전송
  // const spawnMonsterResponse = {
  //   monsterId: newMonster.monsterId,
  //   monsterNumber: newMonster.monsterNumber,
  // };

  const monsterNumber = Math.floor(Math.random() * 5) + 1;

  const monsterData = {
    monsterId: Math.floor(Math.random() * 50000) + 1,
    monsterNumber: monsterNumber,
  };

  // Redis
  const getMonsterR = await getMonsterRedis(socket.id);
  getMonsterR.push(monsterData);

  const newMonsterR = await setMonsterRedis(socket.id, getMonsterR);

  const payload = createResponse(PacketType.SPAWN_MONSTER_RESPONSE, monsterData);

  socket.write(payload);

  const enemySocketId = await findEnemyRedis(socket.id);

  const enemySocket = saveSocket.get(enemySocketId);
  // user.socket.write(payload);
  // console.log('SpawnMonsterResponse sent to player:', user.id);

  // 상대방에게 SpawnEnemyMonsterNotification 전송
  await sendSpawnEnemyMonsterNotification(
    enemySocket,
    monsterData.monsterId,
    monsterData.monsterNumber,
  );
};

export default spawnMonsterRequestHandler;
