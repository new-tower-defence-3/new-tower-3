import { PacketType } from '../constants/header.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import CustomError from '../utils/error/customError.js';
import registerRequestHandler from './user/registerRequest.handler.js';
import matchRequestHandler from './user/matchRequest.handler.js';
const handlers = {
  // 회원가입 및 로그인
  [PacketType.REGISTER_REQUEST]: {
    handler: registerRequestHandler,
    protoType: 'C2SRegisterRequest',
  },
  [PacketType.REGISTER_RESPONSE]: {
    handler: undefined,
    protoType: 'S2CRegisterResponse',
  },
  [PacketType.LOGIN_REQUEST]: {
    handler: undefined,
    protoType: 'C2SLoginRequest',
  },
  [PacketType.LOGIN_RESPONSE]: {
    handler: undefined,
    protoType: 'S2CLoginResponse',
  },

  // 매칭
  [PacketType.MATCH_REQUEST]: {
    handler: matchRequestHandler,
    protoType: 'C2SMatchRequest',
  },
  [PacketType.MATCH_START_NOTIFICATION]: {
    handler: undefined,
    protoType: 'S2CMatchStartNotification',
  },

  // 상태 동기화
  [PacketType.STATE_SYNC_NOTIFICATION]: {
    handler: undefined,
    protoType: 'S2CStateSyncNotification',
  },

  // 타워 구입 및 배치
  [PacketType.TOWER_PURCHASE_REQUEST]: {
    handler: undefined,
    protoType: 'C2STowerPurchaseRequest',
  },
  [PacketType.TOWER_PURCHASE_RESPONSE]: {
    handler: undefined,
    protoType: 'S2CTowerPurchaseResponse',
  },
  [PacketType.ADD_ENEMY_TOWER_NOTIFICATION]: {
    handler: undefined,
    protoType: 'S2CAddEnemyTowerNotification',
  },

  // 몬스터 생성
  [PacketType.SPAWN_MONSTER_REQUEST]: {
    handler: undefined,
    protoType: 'C2SSpawnMonsterRequest',
  },
  [PacketType.SPAWN_MONSTER_RESPONSE]: {
    handler: undefined,
    protoType: 'S2CSpawnMonsterResponse',
  },
  [PacketType.SPAWN_ENEMY_MONSTER_NOTIFICATION]: {
    handler: undefined,
    protoType: 'S2CSpawnEnemyMonsterNotification',
  },

  // 전투 액션
  [PacketType.TOWER_ATTACK_REQUEST]: {
    handler: undefined,
    protoType: 'C2STowerAttackRequest',
  },
  [PacketType.ENEMY_TOWER_ATTACK_NOTIFICATION]: {
    handler: undefined,
    protoType: 'S2CEnemyTowerAttackNotification',
  },
  [PacketType.MONSTER_ATTACK_BASE_REQUEST]: {
    handler: undefined,
    protoType: 'C2SMonsterAttackBaseRequest',
  },

  // 기지 HP 업데이트 및 게임 오버
  [PacketType.UPDATE_BASE_HP_NOTIFICATION]: {
    handler: undefined,
    protoType: 'S2CUpdateBaseHPNotification',
  },
  [PacketType.GAME_OVER_NOTIFICATION]: {
    handler: undefined,
    protoType: 'S2CGameOverNotification',
  },

  // 게임 종료
  [PacketType.GAME_END_REQUEST]: {
    handler: undefined,
    protoType: 'C2SGameEndRequest',
  },

  // 몬스터 사망 통지
  [PacketType.MONSTER_DEATH_NOTIFICATION]: {
    handler: undefined,
    protoType: 'C2SMonsterDeathNotification',
  },
  [PacketType.ENEMY_MONSTER_DEATH_NOTIFICATION]: {
    handler: undefined,
    protoType: 'S2CEnemyMonsterDeathNotification',
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
