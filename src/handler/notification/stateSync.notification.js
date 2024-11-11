import { createResponse } from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/header.js';
import { getGameProgressRedis } from '../../sessions/game.redis.js';

export const sendStateSyncNotification = async (socket) => {
  console.log('sendStateSyncNotification 실행');

  const gameState = await getGameProgressRedis(socket.id);

  // const stateSyncNotification = {
  // userGold: userState.gold,
  // baseHp: userState.baseHp,
  // monsterLevel: userState.monsterLevel || 1,
  // score: userState.score || 0,
  //   towers: userState.towers,
  //   monsters: userState.monsters,
  // };

  const payload = createResponse(PacketType.STATE_SYNC_NOTIFICATION, gameState);

  try {
    socket.write(payload);
  } catch (error) {
    console.error(error);
  }
};

export default sendStateSyncNotification;
