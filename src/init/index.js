import { loadProtos } from './loadProto.js';

const initServer = async () => {
  try {
    await loadProtos();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

export default initServer;
