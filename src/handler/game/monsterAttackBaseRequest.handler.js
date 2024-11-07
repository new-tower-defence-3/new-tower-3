// File: handlers/requests/monsterAttackBaseRequest.handler.js

import { getUserBySocket } from '../../sessions/user.session.js';
import { getGameSessionById } from '../../sessions/game.session.js';
import { sendUpdateBaseHpNotification } from '../notification/updateBaseHp.notification.js';

export const monsterAttackBaseRequestHandler = async ({ socket, payload }) => {
  console.log('monsterAttackBaseRequestHandler Called');

  const user = await getUserBySocket(socket);
  const gameSession = getGameSessionById(user.currentSessionId);

  if (!gameSession) {
    console.error('Game session not found for user:', user.username);
    return;
  }

  const { damage } = payload;
  const isPlayer = gameSession.id === user.username;

  if (!isPlayer) {
    gameSession.opponentBaseHp -= damage;
  } else {
    gameSession.playerBaseHp -= damage;
  }

  if (isPlayer) {
    await sendUpdateBaseHpNotification(user, !isPlayer, gameSession.playerBaseHp);
  } else {
    await sendUpdateBaseHpNotification(user, isPlayer, gameSession.playerBaseHp);
  }
};

export default monsterAttackBaseRequestHandler;
