import redisClient from '../init/redis.js';

const KEY_PREFIX = 'gamesession:';

export const addGameSessionRedis = async (sessionname, username) => {
  await redisClient.rPush(KEY_USER + sessionname, username);
};

export const getGameSessionRedis = () => {
  return;
};
