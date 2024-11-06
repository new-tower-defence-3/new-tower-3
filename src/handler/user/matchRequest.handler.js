import { findMatchingUser, getUserBySocket, findUser } from '../../sessions/user.session.js';
import { MAX_PLAYERS } from '../../constants/header.js';
import { v4 as uuidv4 } from 'uuid';
import {
  addGameSession,
  getGameSession,
  getGameSessionById,
  inviteGameSession,
} from '../../sessions/game.session.js';
import { getProtoMessages } from '../../init/loadProto.js'; // Protobuf 메시지 로드 함수
import matchStartNotification from '../../utils/notification/matchStart.notification.js';

export const matchRequestHandler = async ({ socket }) => {
  console.log('matchRequestHandler Called');
  const user = await getUserBySocket(socket);
  //user.matchingOn();

  // 현재 존재하는 게임 섹션 가져오기
  const gameSessions = getGameSession();
  // 생성된 게임 섹션이 없으면 생성
  if (gameSessions.length === 0) {
    const gameId = uuidv4();
    const gameSession = addGameSession(gameId, user);
  } else {
    let isNotFull = false;
    // 생성된 게임 섹션 중 빈 곳이 있는지 탐색
    for (let i = 0; i < gameSessions.length; i++) {
      if (gameSessions[i].users.length < MAX_PLAYERS) {
        const gameSessionUsers = inviteGameSession(gameSessions[i].id, user);
        matchStartNotification(gameSessionUsers);
        isNotFull = true;
        break;
      }
    }

    // 빈 곳이 없다면 새로운 게임 섹션 생성
    if (!isNotFull) {
      const gameId = uuidv4();
      const gameSession = addGameSession(gameId, user);
    }
  }

  // Protobuf 메시지 로드
  const protoMessages = getProtoMessages();
  const S2CMatchStartNotification = protoMessages['S2CMatchStartNotification'];
};

export default matchRequestHandler;
