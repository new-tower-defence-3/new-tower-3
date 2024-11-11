import redisClient from '../init/redis.js';

const KEY_PREFIX = 'matching';

export const addMatchingUser = async (socketId) => {
  await redisClient.rPush(KEY_PREFIX, socketId);
};

export const findMatchingUserRedis = async () => {
  return await redisClient.lRange(KEY_PREFIX, 0, -1);
};

export const startMatchGameRedis = async () => {
  const waitMatchUser = await redisClient.lRange(KEY_PREFIX, 0, 1);
  return waitMatchUser;
};

export const deleteMatchingUserRedis = async () => {
  const waitUser = await redisClient.lTrim(KEY_PREFIX, 2, -1);
};

export const outMatchingUserRedis = async (socketId) => {
  const outUser = await redisClient.lRem(KEY_PREFIX, 2, socketId);
  return outUser;
};
