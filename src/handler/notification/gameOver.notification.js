// handlers/notifications/gameOver.notification.js

import { createResponse } from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/header.js';

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
};
