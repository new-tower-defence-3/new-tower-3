// handlers/notifications/updateBaseHp.notification.js

import { createResponse } from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/header.js';

export const sendUpdateBaseHpNotification = async (user, isOpponent, baseHp) => {
  const notification = {
    isOpponent,
    baseHp,
  };
  console.log(baseHp);

  const payload = createResponse(PacketType.UPDATE_BASE_HP_NOTIFICATION, notification);

  try {
    user.socket.write(payload);
    console.log('UpdateBaseHpNotification sent to user:', user.username);
  } catch (error) {
    console.error('Failed to send UpdateBaseHpNotification:', error);
  }
};
