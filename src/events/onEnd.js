// src / events / onEnd.js

import gameEndRHandler from '../handler/game/gameEnd.handler.js';
import { sendGameOverNotification } from '../handler/notification/gameOver.notification.js';
import { getGameSessionById } from '../sessions/game.session.js';
import { getUserBySocket, removeUser } from '../sessions/user.session.js';

export const onEnd = (socket) => async () => {
  console.log('클라이언트 연결이 종료되었습니다.');

  const user = await getUserBySocket(socket);
  const gameSession = getGameSessionById(user.currentSessionId);

  if (gameSession) {
    const opponentUser = gameSession.users.find((u) => u.id !== user.id);
    sendGameOverNotification(opponentUser, user);
    await gameEndRHandler(socket);
    console.log('이것은 강제종료입니다.')
  } else {
    await removeUser(socket);
    console.log('이것은 일반종료입니다..')
  }
};

