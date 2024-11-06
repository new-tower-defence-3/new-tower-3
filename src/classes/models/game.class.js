import LatencyManager from '../managers/latency.manager.js';
import { MAX_PLAYERS } from '../../constants/header.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { v4 as uuidv4 } from 'uuid';
import { addGameSession } from '../../sessions/game.session.js';
class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.latencyManaager = new LatencyManager();
  }

  addUser(user) {
    // 한 게임섹션에 이미 유저가 2명 이상이면 에러 발생
    if (this.users.length >= MAX_PLAYERS) {
      throw new CustomError(ErrorCodes.GAME_FULL_USERS, `방이 찼습니다.`);
    }
    this.users.push(user);
    this.latencyManaager.addUser(user.id, user.ping.bind(user), 1000);
    if (this.users.length == MAX_PLAYERS) {
      // 유저가 2명이면 게임 시작
      const gameId = uuidv4();
      const gameSessions = addGameSession(gameId);
      console.log(gameSessions);
    }
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  removeUser(socket) {
    const index = this.users.findIndex((user) => user.socket === socket);
    if (index != -1) {
      if (this.users.length === 1) {
        this.latencyManaager.clearAll();
      }
      this.latencyManaager.removeUser(this.user[index].id);
      return this.users.splice(index, 1)[0];
    }
  }

  getMaxLatency() {
    let maxLatency = 0;
    this.users.forEach((user) => {
      maxLatency = Math.max(maxLatency, user.latency);
    });

    return maxLatency;
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
