// createResponse.js
import { PACKET_TYPE } from "../../constants/header.js";
import { getProtoMessages } from "../../init/loadProto.js";

// 임시 시퀀스
// 나중에 유저 정의로 옮겨야 함
let sequenceNumber = 0;

export const createResponse = (packetType, payloadType, data = null) => {
    const protoMessages = getProtoMessages();
    const GamePacket = protoMessages.GamePacket;

    if (!GamePacket) {
        throw new Error('GamePacket 메시지를 찾을 수 없습니다.');
    }

    const PayloadMessage = protoMessages[payloadType];
    if (!PayloadMessage) {
        throw new Error(`알 수 없는 payloadType: ${payloadType}`);
    }

    // payload 데이터 생성
    const payloadData = data ? PayloadMessage.create(data) : null;

    // GamePacket 메시지 생성
    const gamePacketPayload = {};
    gamePacketPayload[payloadType] = payloadData;
    const gamePacket = GamePacket.create(gamePacketPayload);

    // GamePacket 인코딩
    const encodedGamePacket = GamePacket.encode(gamePacket).finish();

    // 헤더 구성
    const packetTypeBuffer = Buffer.alloc(2); // ushort (2바이트)
    packetTypeBuffer.writeUInt16BE(PACKET_TYPE, 0); // PACKET_TYPE = ushort
    
    // 버전도 일단 하드코딩
    // 나중에 constants 같은 데에서 가져와야 함
    const versionBuffer = Buffer.from("1.0.0", 'utf-8');
    const versionLengthBuffer = Buffer.alloc(1); // ubyte (1바이트)
    versionLengthBuffer.writeUInt8(versionBuffer.length, 0); // 1.0.0은 5바이트

    const sequenceBuffer = Buffer.alloc(4); // uint32 (4바이트)
    sequenceBuffer.writeUInt32BE(sequenceNumber++, 0); // 시퀀스 번호 할당 및 증가

    const payloadLengthBuffer = Buffer.alloc(4); // uint32 (4바이트)
    payloadLengthBuffer.writeUInt32BE(encodedGamePacket.length, 0);

    // 최종 패킷 생성: [packetType][versionLength][version][sequence][payloadLength][payload]
    const header = Buffer.concat([
        packetTypeBuffer,
        versionLengthBuffer,
        versionBuffer,
        sequenceBuffer,
        payloadLengthBuffer
    ]);

    const packet = Buffer.concat([header, Buffer.from(encodedGamePacket)]);
    return packet;
};
