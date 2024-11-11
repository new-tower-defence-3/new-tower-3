import { removeGameRedis } from '../../sessions/game.redis.js';

const gameEndRHandler = async (socket) => {
  try {
    await removeGameRedis(socket.id);
  } catch (e) {
    console.error(e);
  }
};

export default gameEndRHandler;
