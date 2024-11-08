import redisClient from '../init/redis.js';

const KEY_PREFIX = 'login:';

export const addUserRedis = async (socketId, data) => {
  await redisClient.hSet(KEY_PREFIX + data.username + ':' + socketId, data);
};

export const checkUserRedis = async (username) => {
  // scanIterator를 사용하여 패턴에 맞는 키를 반복 탐색
  for await (const key of redisClient.scanIterator({ MATCH: '*' + username + '*' })) {
    console.log(`해당 계정이 이미 로그인 중: ${key}`);
    return true; // 첫 번째 매칭된 키 발견 시 true 반환
  }

  return false; // 매칭되는 키가 없을 경우 false 반환
};

export const removeUserRedis = async (socketId) => {
  for await (const key of redisClient.scanIterator({ MATCH: '*' + socketId })) {
    await redisClient.del(key);
    console.log(`Deleted key: ${key}`);
  }
  console.log('All matching keys deleted.');
};

export const getUserBySocketRedis = async (socketId) => {
  const result = []; // 결과를 담을 배열

  // scanIterator를 사용하여 패턴에 맞는 키를 찾음
  for await (const key of redisClient.scanIterator({ MATCH: '*' + socketId })) {
    // 해당 키의 모든 해시 값 가져오기
    const hashValues = await redisClient.hGetAll(key);
    V;
    // 해시 값이 존재하면 배열에 추가
    if (Object.keys(hashValues).length > 0) {
      result.push({ key, hashalues });
    }
  }

  // 찾은 해시 값들 배열 반환
  return result;
};
