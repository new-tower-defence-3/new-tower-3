import matchStartNotification from '../../handler/notification/matchStart.notification.js';
import { addMatchingUser } from '../../sessions/matching.redis.js';

export const matchRequestHandler = async ({ socket }) => {
  console.log('matchRequestHandler Called');

  await addMatchingUser(socket.id);
  await matchStartNotification();
};

export default matchRequestHandler;
