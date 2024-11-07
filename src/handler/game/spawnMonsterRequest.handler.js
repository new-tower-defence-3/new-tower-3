import { getUserBySocket } from '../../sessions/user.session.js';
import { getGameSessionById } from '../../sessions/game.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { sendSpawnEnemyMonsterNotification } from '../notification/spawnEnemyMonster.notification.js';
import { PacketType } from '../../constants/header.js';

let monsterIdCounter = 1000; // Global counter for unique monster IDs

export const spawnMonsterRequestHandler = async ({ socket }) => {
  console.log('spawnMonsterRequestHandler Called');

  const user = await getUserBySocket(socket);
  const gameSession = getGameSessionById(user.currentSessionId);

  if (!gameSession) {
    console.error('Game session not found for user:', user.username);
    return;
  }

  let isPlayer = false;
  console.log(user.username);
  if (gameSession.id === user.username)
    isPlayer = true;

  // Generate new monster data
  const monsterId = monsterIdCounter++;
  const monsterNumber = Math.floor(Math.random() * 5) + 1;
  const level = 1;

  const newMonster = {
    monsterId: monsterId,
    monsterNumber: monsterNumber,
    level: level,
  };

  if (isPlayer) {
    // Add monster to player's monster list
    gameSession.playerMonsters.push(newMonster);
  } else {
    gameSession.opponentMonsters.push(newMonster);
  }


// Send spawn monster response to player
  const spawnMonsterResponse = {
    monsterId: monsterId,
    monsterNumber: monsterNumber,
  };

  const gamePacketResponse = {
    spawnMonsterResponse: spawnMonsterResponse,
  };

  try {
    const responsePayload = createResponse(PacketType.SPAWN_MONSTER_RESPONSE, gamePacketResponse.spawnMonsterResponse);
    user.socket.write(responsePayload);
    console.log('SpawnMonsterResponse sent to player:', user.username);
  } catch (error) {
    console.error('Failed to send SpawnMonsterResponse:', error);
  }

// Notify opponent about the new enemy monster
  const opponentUser = gameSession.users.find(u => u !== user);
  if (!opponentUser) {
    console.error('Opponent user not found in game session');
    return;
  }

// Send S2CSpawnEnemyMonsterNotification
  await sendSpawnEnemyMonsterNotification(opponentUser, monsterId, monsterNumber);
};
