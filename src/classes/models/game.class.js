import LatencyManager from '../managers/latency.manager.js';

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.towers = [];
    this.latencyManaager = new LatencyManager();
  }

  addUser(user) {
    this.users.push(user);
    this.latencyManaager.addUser(user.id, user.ping.bind(user), 1000);
  };

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  };

  removeUser(socket) {
    const index = this.users.findIndex((user) => user.socket === socket);
    if (index != -1) {
      if (this.users.length === 1) {
        this.latencyManaager.clearAll();
      }
      this.latencyManaager.removeUser(this.user[index].id);
      return this.users.splice(index, 1)[0];
    }
  };

  getMaxLatency() {
    let maxLatency = 0;
    this.users.forEach((user) => {
      maxLatency = Math.max(maxLatency, user.latency);
    });

    return maxLatency;
  }

  // 어떤 유저의 타워인지는 아직 안적힘
  addTower(tower) {
    this.towers.push(tower);
  }

  // 상대유저를 찾기
  getOpponent(userId) {
    return this.users.filter((user) => user.id !== userId)[0];
}
  // getAllLocation(userId) {
  //     const maxLatency = this.getMaxLatency();
  //
  //     const locationData = this.users
  //         .filter((user) => user.id !== userId)
  //         .map((user) => {
  //             const { x, y } = user.calculatePosition(maxLatency);
  //             return { id: user.id, playerId: user.playerId, x, y }
  //         })
  //
  //     return createLocationPacket(locationData)
  // };
}

export default Game;