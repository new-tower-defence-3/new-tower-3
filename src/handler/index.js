import { PacketType } from '../constants/header.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import CustomError from '../utils/error/customError.js';
import registerRequestHandler from './user/registerRequest.handler.js';
import loginRequestHandler from './user/loginRequest.handler.js';
import matchRequestHandler from './user/matchRequest.handler.js';
import SpawnMonsterRequestHandler from './game/spawnMonsterRequest.handler.js';

const handlers = {
  // 회원가입 및 로그인
  [PacketType.REGISTER_REQUEST]: {
    handler: registerRequestHandler,
    protoType: 'registerRequest',
  },
  [PacketType.REGISTER_RESPONSE]: {
    handler: undefined,
    protoType: 'registerResponse',
  },
  [PacketType.LOGIN_REQUEST]: {
    handler: loginRequestHandler,
    protoType: 'loginRequest',
  },
  [PacketType.LOGIN_RESPONSE]: {
    handler: undefined,
    protoType: 'loginResponse',
  },

  // 매칭
  [PacketType.MATCH_REQUEST]: {
    handler: matchRequestHandler,
    protoType: 'matchRequest',
  },
  [PacketType.MATCH_START_NOTIFICATION]: {
    handler: undefined,
    protoType: 'matchStartNotification',
  },

  // 상태 동기화
  [PacketType.STATE_SYNC_NOTIFICATION]: {
    handler: undefined,
    protoType: 'stateSyncNotification',
  },

  // 타워 구입 및 배치
  [PacketType.TOWER_PURCHASE_REQUEST]: {
    handler: undefined,
    protoType: 'towerPurchaseRequest',
  },
  [PacketType.TOWER_PURCHASE_RESPONSE]: {
    handler: undefined,
    protoType: 'towerPurchaseResponse',
  },
  [PacketType.ADD_ENEMY_TOWER_NOTIFICATION]: {
    handler: undefined,
    protoType: 'addEnemyTowerNotification',
  },

  // 몬스터 생성
  [PacketType.SPAWN_MONSTER_REQUEST]: {
    handler: SpawnMonsterRequestHandler,
    protoType: 'spawnMonsterRequest',
  },
  [PacketType.SPAWN_MONSTER_RESPONSE]: {
    handler: undefined,
    protoType: 'spawnMonsterResponse',
  },
  [PacketType.SPAWN_ENEMY_MONSTER_NOTIFICATION]: {
    handler: undefined,
    protoType: 'spawnEnemyMonsterNotification',
  },

  // 전투 액션
  [PacketType.TOWER_ATTACK_REQUEST]: {
    handler: undefined,
    protoType: 'towerAttackRequest',
  },
  [PacketType.ENEMY_TOWER_ATTACK_NOTIFICATION]: {
    handler: undefined,
    protoType: 'enemyTowerAttackNotification',
  },
  [PacketType.MONSTER_ATTACK_BASE_REQUEST]: {
    handler: undefined,
    protoType: 'monsterAttackBaseRequest',
  },

  // 기지 HP 업데이트 및 게임 오버
  [PacketType.UPDATE_BASE_HP_NOTIFICATION]: {
    handler: undefined,
    protoType: 'updateBaseHpNotification',
  },
  [PacketType.GAME_OVER_NOTIFICATION]: {
    handler: undefined,
    protoType: 'gameOverNotification',
  },

  // 게임 종료
  [PacketType.GAME_END_REQUEST]: {
    handler: undefined,
    protoType: 'gameEndRequest',
  },

  // 몬스터 사망 통지
  [PacketType.MONSTER_DEATH_NOTIFICATION]: {
    handler: undefined,
    protoType: 'monsterDeathNotification',
  },
  [PacketType.ENEMY_MONSTER_DEATH_NOTIFICATION]: {
    handler: undefined,
    protoType: 'enemyMonsterDeathNotification',
  },
};

export const getHandlerByPacketType = (packetType) => {
  if (!handlers[packetType]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러를 찾을 수 없습니다: ID ${packetType}`,
    );
  }
  return handlers[packetType].handler;
};

export const getProtoTypeNameByPacketType = (packetType) => {
  if (!handlers[packetType]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `프로토타입를 찾을 수 없습니다: ID ${packetType}`,
    );
  }
  return handlers[packetType].protoType;
};