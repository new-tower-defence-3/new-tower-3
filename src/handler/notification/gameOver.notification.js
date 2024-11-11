// handlers/notifications/gameOver.notification.js

import { createResponse } from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/header.js';
import { createActionLog, createResultLog } from '../../db/log/log.db.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { getGameSessionById } from '../../sessions/game.session.js';

export const sendGameOverNotification = async (opponent, user) => {
  const opponentNotification = {
    isWin: true,
  };

  const userNotification = {
    isWin: false,
  };

  const opponentPayload = createResponse(PacketType.GAME_OVER_NOTIFICATION, opponentNotification);
  const userPayload = createResponse(PacketType.GAME_OVER_NOTIFICATION, userNotification);

  try {
    opponent.socket.write(opponentPayload);
    user.socket.write(userPayload);
    console.log('GameOverNotification sent to user:', opponent.id);
  } catch (error) {
    console.error('Failed to send GameOverNotification:', error);
  }

  const gameSession = getGameSessionById(user.currentSessionId);
  if (!gameSession) {
    console.error(`Game session not found for user: ${user.id}`);
    return;
  }  

  const userState = gameSession.getUserState(user.id);
  const opponentState = gameSession.getUserState(opponent.id);
  
  console.log(userState);
  console.log(opponentState);

  try {
    createResultLog(user.id, opponent.id, userState.score, opponentState.score);
  }
  catch (e) {
    throw new CustomError(ErrorCodes.DB_UPDATE_FAILED, e.message);
  }
};
