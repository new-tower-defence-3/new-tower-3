import { getUserBySocket } from '../../sessions/user.session.js';

export const matchRequestHandler = async (socket) => {
  console.log('matchRequestHandler Called');
  console.log(socket);

  const user = getUserBySocket(socket);
  console.log(user);
  // 무한루프로 상대 올때까지 기다리기
};
export default matchRequestHandler;
