import net from 'net';
import { HOST, PORT } from './constants/env.js';
import initServer from './init/index.js';
import { onConnection } from './events/onConnection.js';
import { initRedisClient } from './init/redis.js';
import { testRedisReset } from './sessions/user.redis.js';

const server = net.createServer(onConnection);

initServer()
  .then(() => {
    server.listen(PORT, HOST, async () => {
      await initRedisClient();

      // 임시로 서버 실행시 마다 레디스 초기화 하도록 설정
      await testRedisReset();
      console.log(`서버가 ${HOST}:${PORT}에서 실행 중입니다.`);
    });
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
