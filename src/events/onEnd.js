// src/events/onEnd.js

import gameEndRHandler from '../handler/game/gameEnd.handler.js';
import { sendGameOverNotification } from '../handler/notification/gameOver.notification.js';
import { getGameSessionById } from '../sessions/game.session.js';
import { getUserBySocket, removeUser } from '../sessions/user.session.js';

export const onEnd = (socket) => async () => {
  console.log('클라이언트 연결이 종료되었습니다.');

  const user = await getUserBySocket(socket);
  if (user) {
    const gameSession = getGameSessionById(user.currentSessionId);

    if (gameSession) {
      const opponentUser = gameSession.users.find((u) => u.id !== user.id);

      if (opponentUser) {
        sendGameOverNotification(opponentUser, user);
      }

      if (socket) {
        await gameEndRHandler(socket);
      }

    } else {
      await removeUser(socket);
    }
  }
};


