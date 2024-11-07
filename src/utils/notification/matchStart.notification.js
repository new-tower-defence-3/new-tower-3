import { createResponse } from '../response/createResponse.js';

const matchStartNotification = (users) => {
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

// 상대방의 게임 상태 (예시로 동일한 초기 설정 사용)
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
  const xStart = 65;
  const xEnd = 1320;
  const yMin = 220;
  const yMax = 370;

  // 사인 함수 파라미터
  const amplitude = (yMax - yMin) / 1.5; // 진폭
  const yMid = yMin + amplitude;       // 중간 y값
  const frequency = 2 * Math.PI / (xEnd - xStart); // 주파수 조정

  // 포인트 생성 간격
  const step = 50; // x가 50씩 증가하도록 설정 (필요에 따라 조정 가능)

  for (let x = xStart; x <= xEnd; x += step) {
    // 사인 함수 계산
    const y = yMid + amplitude * Math.sin(frequency * (x - xStart));
    monsterPath.push({ x: parseFloat(x.toFixed(1)), y: parseFloat(y.toFixed(1)) });
  }

  // 마지막 포인트 추가
  monsterPath.push({ x: 1380.0, y: 350.0 });

  return monsterPath;
}

export default matchStartNotification;
