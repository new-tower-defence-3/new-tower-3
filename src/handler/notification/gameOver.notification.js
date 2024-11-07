// handlers/notifications/gameOver.notification.js

import { createResponse } from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/header.js';

export const sendGameOverNotification = async (user, isWin) => {
  const notification = {
    isWin,
  };

  const payload = createResponse(PacketType.GAME_OVER_NOTIFICATION, notification);

  try {
    user.socket.write(payload);
    console.log('GameOverNotification sent to user:', user.username);
  } catch (error) {
    console.error('Failed to send GameOverNotification:', error);
  }
};
