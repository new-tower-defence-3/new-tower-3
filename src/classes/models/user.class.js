// src/classes/models/user.class.js

class User {

  constructor(socket, username, latency, highScore) {
    this.socket = socket;
    this.id = username;
    this.sequence = 0;
    this.highScore = highScore;
    this.currentSessionId = '';
  }
}

export default User;
