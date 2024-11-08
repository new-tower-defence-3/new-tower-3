// src/classes/models/user.class.js

class User {

  constructor(socket, username, latency, highScore) {
    this.socket = socket;
    this.id = username;
    this.latency = latency;
    this.sequence = 0;
    this.highScore = highScore;
    this.isMatching = false;
    this.currentSessionId = '';
    this.lastUpdateTime = Date.now();
  }

  updateTime() {
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
}

export default User;
