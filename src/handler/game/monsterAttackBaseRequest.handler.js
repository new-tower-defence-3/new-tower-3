// handlers/requests/monsterAttackBaseRequest.handler.js

import { getUserBySocket } from '../../sessions/user.session.js';
import { getGameSessionById } from '../../sessions/game.session.js';
import { sendUpdateBaseHpNotification } from '../notification/updateBaseHp.notification.js';
import { sendGameOverNotification } from '../notification/gameOver.notification.js';
import gameEndRHandler from './gameEnd.handler.js';

export const monsterAttackBaseRequestHandler = async ({ socket, payload }) => {

  const user = await getUserBySocket(socket);
  const gameSession = getGameSessionById(user.currentSessionId);

  if (!gameSession) {
    console.error('Game session not found for user:', user.id);
    return;
  }

  const { damage } = payload;

  // Find the opponent user
  const opponentUser = gameSession.users.find((u) => u.id !== user.id);

  if (!opponentUser) {
    console.error('Opponent not found for user:', user.id);
    return;
  }

  // Reduce the opponent's base HP
  const newBaseHp = gameSession.reduceBaseHp(user.id, damage);

  // Send base HP update to both users
  for (const sessionUser of gameSession.users) {
    const isOpponentNotification = sessionUser.id === opponentUser.id;
    const baseHp = gameSession.getUserState(opponentUser.id).baseHp;
    await sendUpdateBaseHpNotification(
      sessionUser,
      isOpponentNotification,
      newBaseHp,
    );

    if (newBaseHp <= 0) {
      sendGameOverNotification(opponentUser, user)
      await gameEndRHandler(socket);
      return;
    }
  }


};

export default monsterAttackBaseRequestHandler;
