// matchRequestHandler.js
import { createResponse } from '../../utils/response/createResponse.js';

let id = 1;

export const matchRequestHandler = async ({ socket }) => {
  console.log('spawnMonsterRequest Called');

  const monster = {
    monsterId: id++,
    monsterNumber: Math.floor(Math.random() * 5) + 1,
  };

  const gamePacket = {
    monster: monster,
  };

  // 응답 생성 및 전송
  try {
    const payload = createResponse(12, gamePacket.monster);
    console.log(payload);
    socket.write(payload);
    console.log('spawnMonsterRequest sent successfully.');
  } catch (error) {
    console.error('Failed to send spawnMonsterRequest:', error);
    // 필요 시 에러 처리 로직 추가
  }
};

export default matchRequestHandler;
