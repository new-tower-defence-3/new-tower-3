export const USER_QUERIES = {
  // 기존 코드 참고용
  // UPDATE_USER_LOCATION: 'UPDATE user SET x_coord = ?, y_coord = ? WHERE device_id = ?',
  FIND_USER_BY_ID: 'SELECT * FROM users WHERE username = ?',
  CREATE_USER: 'INSERT INTO users (userName,email,password) VALUES (?, ?, ?)',
  UPDATE_USER_LOGIN: 'UPDATE users SET updateAt = CURRENT_TIMESTAMP WHERE username = ?',
};
