import redisClient from '../init/redis.js';

const KEY_PREFIX = 'game:';

// game 세션 관련
export const addGameSessionRedis = async (socketId, enemySocketId, data) => {
  await redisClient.hSet(KEY_PREFIX + socketId, {
    mySocketId: socketId,
    enemySocketId: enemySocketId,
    baseHp: data.initialGameState.baseHp,
    userGold: data.initialGameState.initialGold,
    monsterLevel: 1,
    score: 0,
    towers: JSON.stringify(data.playerData.towers),
    monsters: 'null',
    monsterId: data.playerData.monsterId,
    towerId: data.playerData.towerId,
  });
};

export const findUserGameRedis = async (socketId) => {
  const findUser = await redisClient.exists(KEY_PREFIX + socketId);
  return findUser;
};

export const getGameProgressRedis = async (socketId) => {
  const gameProgress = await redisClient.hGetAll(KEY_PREFIX + socketId);
  gameProgress['monsters'] = JSON.parse(gameProgress['monsters']);
  gameProgress['towers'] = JSON.parse(gameProgress['towers']);
  return gameProgress;
};

export const findEnemyRedis = async (socketId) => {
  const enemySocketId = redisClient.hGet(KEY_PREFIX + socketId, 'enemySocketId');
  return enemySocketId;
};

export const removeGameRedis = async (socketId) => {
  await redisClient.del(KEY_PREFIX + socketId);
};

// Monster 관련
export const getMonsterRedis = async (socketId) => {
  const getMonster = await redisClient.hGet(KEY_PREFIX + socketId, 'monsters');
  return getMonster === 'null' ? [] : JSON.parse(getMonster);
};

export const setMonsterRedis = async (socketId, monsterData) => {
  await redisClient.hSet(KEY_PREFIX + socketId, 'monsters', JSON.stringify(monsterData));
};

export const getMonsterIdRedis = async (socketId) => {
  const getMonsterId = await redisClient.hGet(KEY_PREFIX + socketId, 'monsterId');
  return getMonsterId;
};

export const increaseMonsterIdRedis = async (socketId) => {
  const incMonsterId = await redisClient.hIncrBy(KEY_PREFIX + socketId, 'monsterId', 1);
  return incMonsterId;
};

// gold 관련
export const getGoldRedis = async (socketId) => {
  const getGold = await redisClient.hGet(KEY_PREFIX + socketId, 'userGold');
  return parseInt(getGold);
};

export const setGoldRedis = async (socketId, gold) => {
  const setGold = await redisClient.hSet(KEY_PREFIX + socketId, 'userGold', gold);
  return parseInt(setGold);
};

// score 관련

export const getScoreRedis = async (socketId) => {
  const getScore = await redisClient.hGet(KEY_PREFIX + socketId, 'score');
  return parseInt(getScore);
};

export const setScoreRedis = async (socketId, score) => {
  const setScore = await redisClient.hSet(KEY_PREFIX + socketId, 'score', score);
  return setScore;
};

// montser Level 관련

export const getMonsterLvRedis = async (socketId) => {
  const getMonsterLevel = await redisClient.hGet(KEY_PREFIX + socketId, 'monsterLevel');
  return getMonsterLevel;
};

export const setMonsterLvRedis = async (socketId, level) => {
  const setMonsterLevel = await redisClient.hSet(KEY_PREFIX + socketId, 'monsterLevel', level);
  return setMonsterLevel;
};

// tower 관련
export const getTowerRedis = async (socketId) => {
  const getTowers = await redisClient.hGet(KEY_PREFIX + socketId, 'towers');
  return getTowers === 'null' ? [] : JSON.parse(getTowers);
};

export const setTowerRedis = async (socketId, towerData) => {
  await redisClient.hSet(KEY_PREFIX + socketId, 'towers', JSON.stringify(towerData));
};

export const increaseTowerIdRedis = async (socketId) => {
  const incTowerId = await redisClient.hIncrBy(KEY_PREFIX + socketId, 'towerId', 1);
  return incTowerId;
};

// base 관련
export const setBaseHpRedis = async (socketId, damage) => {
  const baseHp = await redisClient.hIncrBy(KEY_PREFIX + socketId, 'baseHp', -damage);
  return baseHp;
};
