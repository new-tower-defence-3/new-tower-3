// src/handler/notification/matchStart.notification.js

import { createResponse } from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/header.js';
import { findServerHighScore } from '../../db/user/user.db.js';

const matchStartNotification = (gameSession) => {
  gameSession.users.forEach(async (user) => {
    const userState = gameSession.getUserState(user.id);
    const opponentState = gameSession.getOpponentState(user.id);
    const serverHighScore = await findServerHighScore();

    console.log('현재 서버의 하이 스코어', serverHighScore);

    const initialGameState = {
      baseHp: userState.baseHp,
      towerCost: 1000,
      initialGold: userState.gold,
      monsterSpawnInterval: 3, // ms가 아니라 s
    };

    const playerData = {
      gold: userState.gold,
      base: {
        hp: userState.baseHp,
        maxHp: 100,
      },
      highScore: serverHighScore || 0,
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
      highScore: serverHighScore || 0,
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
  });
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
}

export default matchStartNotification;
