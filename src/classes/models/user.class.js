// src/classes/models/user.class.js

class User {
  constructor(socket, username, latency, highScore) {
    this.socket = socket;
    this.username = username;
    this.latency = latency;
    this.sequence = 0;
    this.lastUpdateTime = Date.now();
    this.highScore = highScore;
    this.isMatching = false;
    this.currentSessionId = '';

    // 사용자 ID 추가 (예: username을 ID로 사용)
    this.id = username; // 또는 고유한 ID 생성 로직 추가
  }

  updateTime(x, y) {
    this.lastUpdateTime = Date.now();
  }

  ping() {
    const now = Date.now();
    // this.socket.write(createPingPacket(now))
  }

  handlerPong(data) {
    const now = Date.now();
    this.latency = (now - data.timestamp) / 2;
  }

  matchingOn() {
    this.isMatching = true;
  }

  matchingOff() {
    this.isMatching = false;
  }
}

export default User;
