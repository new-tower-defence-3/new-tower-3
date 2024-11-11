// handlers/requests/monsterAttackBaseRequest.handler.js

import { getUserBySocket } from '../../sessions/user.session.js';
import { getGameSessionById } from '../../sessions/game.session.js';
import { sendUpdateBaseHpNotification } from '../notification/updateBaseHp.notification.js';
import { sendGameOverNotification } from '../notification/gameOver.notification.js';
import gameEndRHandler from './gameEnd.handler.js';
import { createActionLog } from '../../db/log/log.db.js';
import { PacketType } from '../../constants/header.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';

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
      await sendGameOverNotification(user, opponentUser);
      await gameEndRHandler(socket);
      return;
    }
  }
  
  try {
    createActionLog(PacketType.MONSTER_ATTACK_BASE_REQUEST, `${user.id}의 기지가 ${damage}만큼 피격`);
  }
  catch (e) {
    throw new CustomError(ErrorCodes.DB_UPDATE_FAILED, e.message);
  }
};

export default monsterAttackBaseRequestHandler;
