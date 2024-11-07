import { RESPONSE_SUCCESS_CODE } from "../../constants/handlerids.js";
import { PacketType } from "../../constants/header.js"
import { createResponse } from "../response/createResponse.js"

const gameOverNotification = (user, opponent) => {
    const userGameOverResponse = createResponse(PacketType.GAME_OVER_NOTIFICATION, {
        isWin: false,
    });
    user.socket.write(userGameOverResponse);

    const opponentGameOberResponse = createResponse(PacketType.GAME_OVER_NOTIFICATION, {
        isWin: true,
    });
    opponent.socket.write(opponentGameOberResponse);
}

export default gameOverNotification