import redisClient from '../init/redis.js';

const KEY_PREFIX = 'gamesession:';

export const addGameSessionRedis = async (sessionname) => {
  await redisClient.hSet(KEY_PREFIX + sessionname, { sokcetId: sessionname });
};

export const getGameSessionRedis = () => {
  return;
};

export const createGameSessionRedis = (uuid) => {
  return;
};
