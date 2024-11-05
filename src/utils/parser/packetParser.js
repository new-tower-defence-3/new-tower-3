// packetParser.js
import { getProtoMessages } from '../../init/loadProto.js';

export const packetParser = (data) => {
  const protoMessages = getProtoMessages();

  const gamePacket = protoMessages.GamePacket;

  if (!gamePacket) {
    throw new Error('GamePacket 메시지를 찾을 수 없습니다.');
  }

  let packet;
  try {
    packet = gamePacket.decode(data);
    console.log('Decoded GamePacket:', packet);
  } catch (e) {
    console.error('GamePacket 디코딩 오류:', e);
    throw e;
  }

  // 'payload' oneof 필드 객체 가져오기
  const payloadOneOf = packet.$type.oneofs.payload;
  if (!payloadOneOf) {
    throw new Error('payload oneof 필드를 찾을 수 없습니다.');
  }

  // 'oneof' 배열 내에서 활성화된 필드 찾기
  const activeField = payloadOneOf.oneof.find(field => packet[field] !== undefined);
  if (!activeField) {
    throw new Error('Payload가 비어 있습니다.');
  }

  console.log(activeField);
  const messageData = packet[activeField];
  if (!messageData) {
    throw new Error(`Payload에 ${activeField} 데이터가 없습니다.`);
  }

  return messageData;
};
