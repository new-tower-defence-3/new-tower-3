// src/events/onEnd.js

import gameEndRHandler from '../handler/game/gameEnd.handler.js';
import { sendGameOverNotification } from '../handler/notification/gameOver.notification.js';
import { findEnemyRedis, findUserGameRedis, removeGameRedis } from '../sessions/game.redis.js';
import { findMatchingUserRedis, outMatchingUserRedis } from '../sessions/matching.redis.js';
import { removeUserRedis } from '../sessions/user.redis.js';
import { removeUser } from '../sessions/user.session.js';
import CustomError from '../utils/error/customError.js';
import { saveSocket } from './onConnection.js';

export const onEnd = (socket) => async () => {
  console.log('클라이언트 연결이 종료되었습니다.');

  const gameSession = await findUserGameRedis(socket.id);

  if (gameSession > 0) {
    const enemySocketId = await findEnemyRedis(socket.id);
    const enemySocket = saveSocket.get(enemySocketId);

    try {
      sendGameOverNotification(enemySocket, socket);
    } catch (e) {
      throw new CustomError(ErrorCodes.FAIL_TO_SEND_NOTY, e.message);
    }
    await removeUserRedis(socket.id);
    console.log('이것은 게임 중 종료 입니다.');
  } else {
    await removeUserRedis(socket.id);
    // 매칭중이었다면 매칭에서 제외
    await outMatchingUserRedis(socket.id);
    console.log('이것은 게임 중이 아닌 종료입니다..');
  }
};
