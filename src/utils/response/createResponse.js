// createResponse.js
import {
  PACKET_TYPE_LENGTH,
  PAYLOAD_LENGTH,
  SEQUENCE_LENGTH,
  VERSION,
  VERSION_LENGTH,
} from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { getProtoTypeNameByPacketType } from '../../handler/index.js';

// 임시 시퀀스
let sequenceNumber = 0;

export const createResponse = (packetType, data = null) => {
  // 패킷 타입 길이 2바이트
  const packetTypeBuffer = Buffer.alloc(PACKET_TYPE_LENGTH);
  packetTypeBuffer.writeUIntBE(packetType, 0, PACKET_TYPE_LENGTH);

  // 버전 길이 1바이트
  const versionLength = Buffer.alloc(VERSION_LENGTH);
  const versionBuffer = Buffer.from(VERSION);
  versionLength.writeUIntBE(versionBuffer.length, 0, VERSION_LENGTH);

  // 시퀀스 4바이트
  const sequenceBuffer = Buffer.alloc(SEQUENCE_LENGTH);
  sequenceBuffer.writeUInt32BE(sequenceNumber++, 0);

  // 페이로드 생성
  const protoMessages = getProtoMessages();
  const protoTypeName = getProtoTypeNameByPacketType(packetType);

  if (!protoTypeName) {
    throw new Error(`Unsupported packet type: ${packetType}`);
  }

  const GamePacket = protoMessages['GamePacket'];

  // 데이터 구조 확인
  const messageObject = {
    [protoTypeName]: data,
  };

  let actualPayload;
  try {
    actualPayload = GamePacket.encode(messageObject).finish();
  } catch (error) {
    console.error('Encoding failed:', error);
    throw error;
  }

  // 실제 데이터 길이 구함
  const payloadLength = Buffer.alloc(PAYLOAD_LENGTH);
  payloadLength.writeUInt32BE(actualPayload.length, 0);

  // 총 헤더 길이
  const headers = Buffer.concat([
    packetTypeBuffer,
    versionLength,
    versionBuffer,
    sequenceBuffer,
    payloadLength,
  ]);

  // 헤더와 페이로드 결합
  return Buffer.concat([headers, actualPayload]);
};
