export const USER_QUERIES = {
  // 기존 코드 참고용
  // FIND_USER_BY_DEVICE_ID: 'SELECT * FROM user WHERE device_id = ?',
  // UPDATE_USER_LOGIN: 'UPDATE user SET last_login = CURRENT_TIMESTAMP WHERE device_id = ?',
  // UPDATE_USER_LOCATION: 'UPDATE user SET x_coord = ?, y_coord = ? WHERE device_id = ?',
  FIND_USER_BY_ID: 'SELECT * FROM users WHERE userName = ?',
  CREATE_USER: 'INSERT INTO users (userName,email,password) VALUES (?, ?, ?)',
};
