import { PacketType } from '../../constants/header.js';
import { saveSocket } from '../../events/onConnection.js';
import { deleteMatchingUserRedis, startMatchGameRedis } from '../../sessions/matching.redis.js';
import { createResponse } from '../../utils/response/createResponse.js';

const matchStartNotification = async (users) => {
  try {
    // matching 리스트의 길이 확인
    const listLength = await startMatchGameRedis();

    // 대기 유저가 2명 이상일 때
    if (listLength.length >= 2) {
      const responsePayload = {};
      const registerResponse = createResponse(PacketType.MATCH_START_NOTIFICATION, responsePayload);
      await deleteMatchingUserRedis();

      for (let i = 0; i < 2; i++) {
        saveSocket.get(listLength[i]).write(registerResponse);
      }
    } else {
      console.log('대기 유저 인원 부족... ', listLength);
    }
  } catch (error) {
    console.error('매칭 대기 에러', error);
  }

  /*

  // `S2CMatchStartNotification` 메시지 생성
  const matchStartNotification = {
    initialGameState: initialGameState,
    playerData: playerData,
    opponentData: opponentData,
  };

  // `GamePacket`에 래핑
  const gamePacket = {
    matchStartNotification: matchStartNotification,
  };

  // 응답 생성 및 전송
  try {
    const payload = createResponse(6, gamePacket.matchStartNotification);
    users.forEach((user) => {
      const socket = user.socket;
      socket.write(payload);
    });
    console.log('MatchStartNotification sent successfully.');
  } catch (error) {
    console.error('Failed to send MatchStartNotification:', error);
    // 필요 시 에러 처리 로직 추가
  }
};
*/

  /**
   * 여기서부터 깡통 데이터!
   * 이걸 그대로 쓰는 게 아니라,
   * 이런 구조로 데이터를 넘겨주면 된다는 것을 참고해야 하는 것!
   */

  /* 

const generatedPath = generateSinePath();

// 게임 초기 설정
const initialGameState = {
  baseHp: 100, // 기지 초기 체력
  towerCost: 500, // 타워 구매 비용
  initialGold: 1000, // 초기 골드
  monsterSpawnInterval: 1, // 몬스터 스폰 간격 (초 단위)
};

// 플레이어의 게임 상태
const playerData = {
  gold: initialGameState.initialGold,
  base: {
    hp: initialGameState.baseHp,
    maxHp: initialGameState.baseHp,
  },
  highScore: 0,
  towers: [
    { towerId: 1, x: 600.0, y: 350.0 },
    { towerId: 2, x: 800.0, y: 350.0 },
    { towerId: 3, x: 1000.0, y: 350.0 },
  ], // 초기 타워 없음
  monsters: [],
  monsterLevel: 1,
  score: 0,
  monsterPath: generatedPath,
  basePosition: { x: 1380.0, y: 350.0 },
};

// 상대방의 게임 상태
const opponentData = {
  gold: initialGameState.initialGold,
  base: {
    hp: initialGameState.baseHp,
    maxHp: initialGameState.baseHp,
  },
  highScore: 0,
  towers: [
    { towerId: 11, x: 600.0, y: 350.0 },
    { towerId: 21, x: 800.0, y: 350.0 },
    { towerId: 31, x: 1000.0, y: 350.0 },
  ],
  monsters: [],
  monsterLevel: 1,
  score: 0,
  monsterPath: generatedPath,
  basePosition: { x: 1380.0, y: 350.0 },
};

function generateSinePath() {
  const monsterPath = [];

  // 설정 범위
  // 유니티에서 측정한 맵을 안벗어나는 적정 범위
  const xStart = 65;
  const xEnd = 1320;
  const yMin = 220;
  const yMax = 370;

  // 사인 함수 파라미터
  const amplitude = (yMax - yMin) / 1.5; // 진폭
  const yMid = yMin + amplitude; // 중간 y값
  const frequency = (2 * Math.PI) / (xEnd - xStart); // 주파수 조정

  // 포인트 생성 간격
  const step = 50; // x가 50씩 증가하도록 설정 (필요에 따라 조정 가능)

  for (let x = xStart; x <= xEnd; x += step) {
    // 사인 함수 계산
    const y = yMid + amplitude * Math.sin(frequency * (x - xStart));
    monsterPath.push({ x: parseFloat(x.toFixed(1)), y: parseFloat(y.toFixed(1)) });
  }

  // 도착점은 베이스 좌표와 같게 설정
  // 마지막 포인트 추가
  monsterPath.push({ x: 1380.0, y: 350.0 });

  return monsterPath;
  */
};

export default matchStartNotification;
