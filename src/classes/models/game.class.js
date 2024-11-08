// src/classes/models/game.class.js

import { MAX_PLAYERS } from '../../constants/header.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];

    // 각 플레이어별 상태 관리
    this.gameStates = {}; // { userId: { towers: [], monsters: [], baseHp: 100, gold: 1000, ... } }
    this.monsterIdCounter = 1000;
    this.towerIdCounter = 1;
  }

  addUser(user) {
    if (this.users.length >= MAX_PLAYERS) {
      throw new CustomError(ErrorCodes.GAME_FULL_USERS, `방이 찼습니다.`);
    } else {
      this.users.push(user);
      // 사용자별 초기 상태 설정
      this.gameStates[user.id] = {
        towers: [
          { towerId: this.towerIdCounter++, x: 600.0, y: 350.0 },
          { towerId: this.towerIdCounter++, x: 800.0, y: 350.0 },
          { towerId: this.towerIdCounter++, x: 1000.0, y: 350.0 },
        ],
        monsters: [],
        baseHp: 100,
        gold: 1000,
      };
    }
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  getUserState(userId) {
    return this.gameStates[userId];
  }

  getOpponentState(userId) {
    const opponentUser = this.users.find((user) => user.id !== userId);
    return opponentUser ? this.gameStates[opponentUser.id] : null;
  }

  removeUser(socket) {
    const index = this.users.findIndex((user) => user.socket === socket);
    if (index !== -1) {
      const removedUser = this.users.splice(index, 1)[0];
      delete this.gameStates[removedUser.id];
      return removedUser;
    }
  }

  addTower(userId, towerData) {
    const userState = this.getUserState(userId);
    const towerId = this.towerIdCounter++;
    const newTower = { towerId, ...towerData };
    userState.towers.push(newTower);
    return newTower;
  }

  addMonster(userId, monsterNumber, level) {
    const monsterId = this.monsterIdCounter++;
    const monsterData = {
      monsterId,
      monsterNumber,
      level,
      // 추가 정보 필요 시 추가
    };

    const userState = this.getUserState(userId);
    userState.monsters.push(monsterData);
    return monsterData;
  }

  findMonster(userId, monsterId) {
    const userState = this.getUserState(userId);
    return userState.monsters.find((monster) => monster.monsterId === monsterId);
  }

  removeMonster(userId, monsterId) {
    const userState = this.getUserState(userId);
    const index = userState.monsters.findIndex((monster) => monster.monsterId === monsterId);
    if (index !== -1) {
      userState.monsters.splice(index, 1);
    }
  }

  reduceBaseHp(userId, damage) {
    const userState = this.getUserState(userId);
    userState.baseHp -= damage;
    return userState.baseHp;
  }

  // 필요에 따라 추가 메서드 작성
}

export default Game;
