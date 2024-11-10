// src/init/index.js

import { loadProtos } from './loadProto.js';
import testConnection from '../utils/db/testConnection.js';

const initServer = async () => {
  try {
    await loadProtos();
    await testConnection();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

export default initServer;
