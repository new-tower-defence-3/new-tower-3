import {createResponse} from "../../utils/response/createResponse.js";
import { PACKET_TYPE_LENGTH, GlobalFailCode } from "../../constants/header.js";

const registerRequestHandler = async ({ socket, payload, sequence }) => {
  console.log('registerRequestHandler Called');

  const responsePacket = createResponse(
      2, // payloadType을 문자열로 전달
      {
        // S2CRegisterResponse 데이터 구조에 맞게 데이터 전달
        success: true,
        message: "등록 성공",
        failCode: GlobalFailCode.NONE,
      }
  );

  // 패킷 전송
  socket.write(responsePacket);
};

export default registerRequestHandler;