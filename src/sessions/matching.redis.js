import redisClient from '../init/redis.js';

const KEY_PREFIX = 'matching';

export const addMatchingUser = async (socketId) => {
  //매칭에 등록
  await redisClient.rPush(KEY_PREFIX, socketId);
};

export const findMatchingUserRedis = async () => {
  return await redisClient.lLen(KEY_PREFIX);
};

export const startMatchGameRedis = async () => {
  const waitMatchUser = await redisClient.lRange(KEY_PREFIX, 0, 1);
  return waitMatchUser;
};

export const deleteMatchingUserRedis = async () => {
  const waitMatchUser = await redisClient.lTrim(KEY_PREFIX, 2, -1);
};
