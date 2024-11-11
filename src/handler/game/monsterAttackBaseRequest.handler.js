import { sendUpdateBaseHpNotification } from '../notification/updateBaseHp.notification.js';
import {
  findEnemyRedis,
  getMonsterRedis,
  setBaseHpRedis,
  setMonsterRedis,
} from '../../sessions/game.redis.js';
import { saveSocket } from '../../events/onConnection.js';
import { sendGameOverNotification } from '../notification/gameOver.notification.js';
import gameEndRHandler from './gameEnd.handler.js';
import sendStateSyncNotification from '../notification/stateSync.notification.js';

export const monsterAttackBaseRequestHandler = async ({ socket, payload }) => {
  console.log('monsterAttackBaseRequestHandler Called');

  const { damage } = payload;

  const findEnemySocketId = await findEnemyRedis(socket.id);
  const enemySocket = saveSocket.get(findEnemySocketId);
  const newBaseHp = await setBaseHpRedis(socket.id, damage);

  // 공격한 몬스터도 삭제(사망) 하기 때문에 redis에서 제거
  const beforeMonster = await getMonsterRedis(socket.id);
  const afterMonster = beforeMonster.slice(1);
  await setMonsterRedis(socket.id, afterMonster);

  await sendUpdateBaseHpNotification(socket, false, newBaseHp);
  await sendUpdateBaseHpNotification(enemySocket, true, newBaseHp);

  if (newBaseHp <= 0) {
    sendGameOverNotification(enemySocket, socket);
    return;
  }
};

export default monsterAttackBaseRequestHandler;
