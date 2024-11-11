import { sendEnemyMonsterDeathNotification } from './enemyMonsterDeath.notification.js';
import {
  findEnemyRedis,
  getGoldRedis,
  getMonsterLvRedis,
  getMonsterRedis,
  getScoreRedis,
  setGoldRedis,
  setMonsterLvRedis,
  setMonsterRedis,
  setScoreRedis,
} from '../../sessions/game.redis.js';
import { saveSocket } from '../../events/onConnection.js';

export const monsterDeathNotificationHandler = async ({ socket, payload }) => {
  console.log('monsterDeathNotificationHandler Called');

  const rewardGold = 100;
  const rewardScore = 300;

  const { monsterId } = payload;

  // 상대방에게 EnemyMonsterDeathNotification 전송
  const findEnemySocketId = await findEnemyRedis(socket.id);
  const enemySocket = saveSocket.get(findEnemySocketId);

  if (enemySocket) {
    await sendEnemyMonsterDeathNotification(enemySocket, monsterId);
  } else {
    console.error('Opponent user not found in game session');
  }

  // 현재 플레이어의 몬스터 목록에서 몬스터 제거
  const beforeMonster = await getMonsterRedis(socket.id);
  const afterMonster = beforeMonster.filter((monster) => monster.monsterId !== monsterId);
  await setMonsterRedis(socket.id, afterMonster);

  // 골드 획득
  let getGold = await getGoldRedis(socket.id);
  getGold += rewardGold;
  await setGoldRedis(socket.id, getGold);

  // 스코어 획득
  let getScore = await getScoreRedis(socket.id);
  getScore += rewardScore;
  await setScoreRedis(socket.id, getScore);

  const monsterLevel = await getMonsterLvRedis(socket.id);
  const nextLevel = Math.floor(getScore / 3000) + 1;
  if (nextLevel > monsterLevel) {
    await setMonsterLvRedis(socket.id, nextLevel);
  }
};

export default monsterDeathNotificationHandler;
