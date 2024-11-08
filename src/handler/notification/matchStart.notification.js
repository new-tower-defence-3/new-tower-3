// src/handler/notification/matchStart.notification.js

import { createResponse } from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/header.js';

const matchStartNotification = (gameSession) => {
  gameSession.users.forEach((user) => {
    const userState = gameSession.getUserState(user.id);
    const opponentState = gameSession.getOpponentState(user.id);

    const initialGameState = {
      baseHp: 100,
      towerCost: 500,
      initialGold: userState.gold,
      monsterSpawnInterval: 1,
    };

    const playerData = {
      gold: userState.gold,
      base: {
        hp: userState.baseHp,
        maxHp: 100,
      },
      highScore: user.highScore || 0,
      towers: userState.towers,
      monsters: userState.monsters,
      monsterLevel: 1,
      score: 0,
      monsterPath: generateSinePath(), // 기존 경로 생성 함수 사용
      basePosition: { x: 1380.0, y: 350.0 },
    };

    const opponentData = {
      gold: opponentState.gold,
      base: {
        hp: opponentState.baseHp,
        maxHp: 100,
      },
      highScore: 0,
      towers: opponentState.towers,
      monsters: opponentState.monsters,
      monsterLevel: 1,
      score: 0,
      monsterPath: generateSinePath(),
      basePosition: { x: 1380.0, y: 350.0 },
    };

    const matchStartNotification = {
      initialGameState,
      playerData,
      opponentData,
    };

    const payload = createResponse(PacketType.MATCH_START_NOTIFICATION, matchStartNotification);
    user.socket.write(payload);
    console.log(`MatchStartNotification sent to ${user.id}`);
  });
};

/**
 * 여기서부터 깡통 데이터!
 * 이걸 그대로 쓰는 게 아니라,
 * 이런 구조로 데이터를 넘겨주면 된다는 것을 참고해야 하는 것!
 */

const getInitialData = () => {
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
    ],
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

  return { initialGameState, playerData, opponentData };
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
  const yMid = yMin + amplitude;       // 중간 y값
  const frequency = 2 * Math.PI / (xEnd - xStart); // 주파수 조정

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
}

export default matchStartNotification;
