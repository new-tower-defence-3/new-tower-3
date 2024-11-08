import redisClient from '../init/redis.js';

const KEY_PREFIX = 'game:';

export const addGameSessionRedis = async (socketId, enemySocketId) => {
  await redisClient.hSet(KEY_PREFIX + socketId, {
    mySocketId: socketId,
    enemySocketId: enemySocketId,
  });
};

export const getGameSessionRedis = () => {
  return;
};

export const createGameSessionRedis = (uuid) => {
  return;
};

export const getMonsterRedis = async (socketId) => {
  const getMonster = await redisClient.hGet(KEY_PREFIX + socketId, 'monster');
  const parse = getMonster ? JSON.parse(getMonster) : [];
  return parse;
};

export const findEnemyRedis = async (socketId) => {
  const enemySocketId = redisClient.hGet(KEY_PREFIX + socketId, 'enemySocketId');
  return enemySocketId;
};

export const setMonsterRedis = async (socketId, monsterData) => {
  await redisClient.hSet(KEY_PREFIX + socketId, 'monster', JSON.stringify(monsterData));
};
