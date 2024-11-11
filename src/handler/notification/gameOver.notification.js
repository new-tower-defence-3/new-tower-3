// handlers/notifications/gameOver.notification.js

import { createResponse } from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/header.js';
import { createResultLog } from '../../db/log/log.db.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { getGameSessionById } from '../../sessions/game.session.js';

export const sendGameOverNotification = async (opponent, user) => {
  let userNotification = {
    isWin: false,
  };

  let opponentNotification = {
    isWin: false,
  };

  const gameSession = getGameSessionById(user.currentSessionId);
  if (!gameSession) {
    console.error(`Game session not found for user: ${user.id}`);
    return;
  }

  const userScore = gameSession.getUserState(user.id).score;
  const opponentScore = gameSession.getUserState(opponent.id).score;

  if (userScore > opponentScore) {
    userNotification.isWin = true;
  } else if (userScore < opponentScore) {
    opponentNotification.isWin = true;
  } else {
    userNotification.isWin = true;
    opponentNotification.isWin = true;
  }

  const opponentPayload = createResponse(PacketType.GAME_OVER_NOTIFICATION, opponentNotification);
  const userPayload = createResponse(PacketType.GAME_OVER_NOTIFICATION, userNotification);

  try {
    user.socket.write(userPayload);
    opponent.socket.write(opponentPayload);
  } catch (error) {
    console.error('Failed to send GameOverNotification:', error);
  }

  try {
    createResultLog(user.id, opponent.id, userScore, opponentScore);
  } catch (e) {
    throw new CustomError(ErrorCodes.DB_UPDATE_FAILED, e.message);
  }
};
