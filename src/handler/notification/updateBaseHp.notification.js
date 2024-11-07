import { createResponse } from "../response/createResponse.js";
import { PacketType, RESPONSE_SUCCESS_CODE } from "../../constants/handlerids.js";

const updateBaseHpNotification = (user, opponent) => {
    // 현재 사용자에게 기지 HP 업데이트 패킷 전송
    const userResponse = createResponse(PacketType.UPDATE_BASE_HP_NOTIFICATION, {
        isOpponent: false,
        basehp: user.basehp,
    });
    user.socket.write(userResponse);

    // 상대방에게 기지 HP 업데이트 패킷 전송
    const opponentResponse = createResponse(PacketType.UPDATE_BASE_HP_NOTIFICATION, {
        isOpponent: true,
        basehp: user.basehp,
    });
    opponent.socket.write(opponentResponse);
};

export default updateBaseHpNotification;
