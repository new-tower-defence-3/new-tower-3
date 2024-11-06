import { findMatchingUser, getUserBySocket } from '../../sessions/user.session.js';

export const matchRequestHandler = async (socket) => {
  console.log('matchRequestHandler Called');
  console.log(socket);
  console.log('----------------------');
  const user = await getUserBySocket(socket);
  console.log(user);
  const session = await findMatchingUser();
  console.log(session);
  // 무한루프로 상대 올때까지 기다리기
};
export default matchRequestHandler;
