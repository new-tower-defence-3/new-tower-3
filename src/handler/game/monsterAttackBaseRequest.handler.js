// File: handlers/requests/monsterAttackBaseRequest.handler.js

import { getUserBySocket } from '../../sessions/user.session.js';
import { getGameSessionById } from '../../sessions/game.session.js';
import { sendUpdateBaseHpNotification } from '../notification/updateBaseHp.notification.js';
import { sendGameOverNotification } from '../notification/gameOver.notification.js';

export const monsterAttackBaseRequestHandler = async ({ socket, data }) => {
  console.log('monsterAttackBaseRequestHandler Called');

  const user = await getUserBySocket(socket);
  const gameSession = getGameSessionById(user.currentSessionId);

  if (!gameSession) {
    console.error('Game session not found for user:', user.username);
    return;
  }

  const { damage } = data;
  const isPlayer = gameSession.id === user.username;

  if (isPlayer) {
    gameSession.opponentBaseHp -= damage;
  } else {
    gameSession.playerBaseHp -= damage;
  }

  // Send base HP update to both users
  for (const sessionUser of gameSession.users) {
    const isOpponentNotification = sessionUser !== user;
    const baseHp = isOpponentNotification ? gameSession.playerBaseHp : gameSession.opponentBaseHp;
    await sendUpdateBaseHpNotification(sessionUser, isOpponentNotification, baseHp);
  }

  // Check for game over
  if (gameSession.playerBaseHp <= 0 || gameSession.opponentBaseHp <= 0) {
    for (const sessionUser of gameSession.users) {
      const isWin = (gameSession.playerBaseHp <= 0 && sessionUser !== user) || (gameSession.opponentBaseHp <= 0 && sessionUser === user);
      await sendGameOverNotification(sessionUser, isWin);
    }
  }
};

export default monsterAttackBaseRequestHandler;
