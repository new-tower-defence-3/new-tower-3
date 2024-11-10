// src/classes/models/game.class.js

import { MAX_PLAYERS } from '../../constants/header.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import IntervalManager from '../managers/intervalManager.js';
import sendStateSyncNotification from '../../handler/notification/stateSync.notification.js';

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];

    // 각 플레이어별 상태 관리
    this.gameStates = {}; // { userId: { towers: [], monsters: [], baseHp: 100, gold: 1000, ... } }

    // 역할 별 ID 카운터
    this.counters = {
      player: {
        towerId: 110000,
        monsterId: 10000,
      },
      opponent: {
        towerId: 210000,
        monsterId: 20000,
      },
    };

    this.intervalManager = new IntervalManager();
  }

  addUser(user) {
    if (this.users.length >= MAX_PLAYERS) {
      throw new CustomError(ErrorCodes.GAME_FULL_USERS, `방이 찼습니다.`);
    } else {
      // 첫 번째 호스트는 'player', 상대는 'opponent'
      let role;
      if (this.users.length === 0) {
        role = 'player';
      } else if (this.users.length === 1) {
        role = 'opponent';
      }

      user.role = role;
      this.users.push(user);

      // 사용자별 초기 상태 설정
      this.gameStates[user.id] = this.initializeUserState(user, role);
    }
  }

  initializeUserState(user, role) {
    return {
      towers: [
        { towerId: this.counters[role].towerId++, x: 600.0, y: 350.0 },
        { towerId: this.counters[role].towerId++, x: 800.0, y: 350.0 },
        { towerId: this.counters[role].towerId++, x: 1000.0, y: 350.0 },
      ],
      monsters: [],
      baseHp: 200,
      gold: 5000,
      score: 0,
      monsterLevel: 1,
    };
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

  removeInterval(session) {
    this.intervalManager.removeUser(session.id);
  }

  addTower(userId, towerData) {
    const userState = this.getUserState(userId);
    const user = this.getUser(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, `사용자를 찾을 수 없습니다.`);
    }

    const role = user.role;
    if (!role) {
      throw new CustomError(ErrorCodes.INVALID_ROLE, `사용자의 역할이 지정되지 않았습니다.`);
    }

    // 최대 타워 수 제한 (예: 10개)
    if (userState.towers.length >= 10) {
      throw new CustomError(ErrorCodes.MAX_TOWERS, `타워의 최대 개수에 도달했습니다.`);
    }

    const towerId = this.counters[role].towerId++;
    const newTower = { towerId, ...towerData };
    userState.towers.push(newTower);
    return newTower;
  }

  addMonster(userId, monsterNumber, level) {
    const userState = this.getUserState(userId);
    const user = this.getUser(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, `사용자를 찾을 수 없습니다.`);
    }

    const role = user.role;
    if (!role) {
      throw new CustomError(ErrorCodes.INVALID_ROLE, `사용자의 역할이 지정되지 않았습니다.`);
    }

    const monsterId = this.counters[role].monsterId++;
    const monsterData = {
      monsterId,
      monsterNumber,
      level,
    };

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

  commenceSync() {
    this.intervalManager.addUser(this.id, () => sendStateSyncNotification(this.id), 1000);
  }

}

export default Game;
