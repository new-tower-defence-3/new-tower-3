// src/handler/game/spawnMonsterRequest.handler.js

import { getUserBySocket } from '../../sessions/user.session.js';
import { getGameSessionById } from '../../sessions/game.session.js';
import { sendSpawnEnemyMonsterNotification } from '../notification/spawnEnemyMonster.notification.js';
import { PacketType } from '../../constants/header.js';
import { createResponse } from '../../utils/response/createResponse.js';

export const spawnMonsterRequestHandler = async ({ socket }) => {
  console.log('spawnMonsterRequestHandler Called');

  const user = await getUserBySocket(socket);
  const gameSession = getGameSessionById(user.currentSessionId);

  if (!gameSession) {
    console.error('Game session not found for user:', user.id);
    return;
  }

  const userState = gameSession.getUserState(user.id);
  const opponentUser = gameSession.users.find(u => u.id !== user.id);
  const opponentState = gameSession.getUserState(opponentUser.id);

  const monsterLevel = 1;
  const monsterNumber = Math.floor(Math.random() * 5) + 1;

  const newMonster = gameSession.addMonster(user.id, monsterNumber, monsterLevel);

  // 플레이어에게 SpawnMonsterResponse 전송
  const spawnMonsterResponse = {
    monsterId: newMonster.monsterId,
    monsterNumber: newMonster.monsterNumber,
  };

  const payload = createResponse(PacketType.SPAWN_MONSTER_RESPONSE, spawnMonsterResponse);
  user.socket.write(payload);
  console.log('SpawnMonsterResponse sent to player:', user.id);

  // 상대방에게 SpawnEnemyMonsterNotification 전송
  await sendSpawnEnemyMonsterNotification(opponentUser, newMonster.monsterId, newMonster.monsterNumber);
};

export default spawnMonsterRequestHandler;
