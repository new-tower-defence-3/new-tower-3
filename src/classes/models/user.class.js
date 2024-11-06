// import { createPingPacket } from "../../utils/notification/game.notification.js";

class User {
  constructor(socket, username, latency, highScore) {
    this.socket = socket;
    this.username = username;
    this.latency = latency;
    this.sequence = 0;
    this.lastUpdateTime = Date.now();
    this.highScore = highScore;
    this.isMatching = false;
    this.baseHp = 100;
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

  // 기지 HP 업데이트 메서드
  updateBaseHp(damage) {
    this.baseHp -= damage;
  }
}

export default User;
