import { getGameSession } from '../sessions/game.session.js';
import { removeUserRedis } from '../sessions/user.redis.js';

export const onEnd = (socket) => async () => {
  console.log('클라이언트 연결이 종료되었습니다.');

  console.log('소켓에서 ', socket);
  console.log('소켓에서 ', socket.id);

  await removeUserRedis(socket.id);

  //   const gameSession = getGameSession();
  //   gameSession.removeUser(socket);
};
