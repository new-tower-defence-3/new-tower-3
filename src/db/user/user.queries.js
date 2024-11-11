export const USER_QUERIES = {
  FIND_USER_BY_ID: 'SELECT * FROM users WHERE username = ?',
  CREATE_USER: 'INSERT INTO users (userName,email,password) VALUES (?, ?, ?)',
  UPDATE_USER_LOGIN: 'UPDATE users SET updateAt = CURRENT_TIMESTAMP WHERE username = ?',
  UPDATE_USER_SCORE: 'UPDATE users SET highScore = ? WHERE username = ?',
};
