import { getUserBySocket } from '../../sessions/user.session.js';
import { MAX_PLAYERS } from '../../constants/header.js';
import { addGameSession, getGameSession, inviteGameSession } from '../../sessions/game.session.js';
import matchStartNotification from '../../handler/notification/matchStart.notification.js';

export const matchRequestHandler = async ({ socket }) => {
  console.log('matchRequestHandler Called');
  const user = await getUserBySocket(socket);
  //user.matchingOn();

  // 현재 존재하는 게임 섹션 가져오기
  const gameSessions = getGameSession();
  // 생성된 게임 섹션이 없으면 생성
  if (gameSessions.length === 0) {
    const gameId = user.username;
    const gameSession = addGameSession(gameId, user);
    user.currentSessionId = gameId;
  } else {
    let isNotFull = false;
    // 생성된 게임 섹션 중 빈 곳이 있는지 탐색
    for (let i = 0; i < gameSessions.length; i++) {
      if (gameSessions[i].users.length < MAX_PLAYERS) {
        const gameSessionUsers = inviteGameSession(gameSessions[i].id, user);
        user.currentSessionId = gameSessions[i].id;
        matchStartNotification(gameSessionUsers);
        isNotFull = true;
        break;
      }
    }

    // 빈 곳이 없다면 새로운 게임 섹션 생성
    if (!isNotFull) {
      const gameId = user.username;
      const gameSession = addGameSession(gameId, user);
    }
  }
};

export default matchRequestHandler;
