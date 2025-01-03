// src/db/database.js

import { dbConfig } from '../config/dbConfig.js';
import mysql from 'mysql2/promise';

const createPool = () => {
  const pool = mysql.createPool({
    ...dbConfig.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const originalQuery = pool.query;

  pool.query = (sql, params) => {
    const date = new Date();

    return originalQuery.call(pool, sql, params);
  };

  return pool;
};

const dbPool = createPool();

export default dbPool;
