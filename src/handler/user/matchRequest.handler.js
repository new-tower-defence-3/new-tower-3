import { getUserBySocket } from '../../sessions/user.session.js';
import { MAX_PLAYERS } from '../../constants/header.js';
import { addGameSession, getGameSession, inviteGameSession } from '../../sessions/game.session.js';
import matchStartNotification from '../../handler/notification/matchStart.notification.js';
import { getUserBySocketRedis } from '../../sessions/user.redis.js';
import { addGameSessionRedis } from '../../sessions/game.redis.js';
import { v4 as uuidv4 } from 'uuid';
import { addMatchingUser } from '../../sessions/matching.redis.js';

export const matchRequestHandler = async ({ socket }) => {
  console.log('matchRequestHandler Called');

  await addMatchingUser(socket.id);
  await matchStartNotification();
};

export default matchRequestHandler;
