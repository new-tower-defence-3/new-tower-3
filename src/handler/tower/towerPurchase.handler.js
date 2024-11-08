import { PacketType } from "../../constants/header.js";
import { gameSessions } from "../../sessions/sessions";
// import { towerDataTable as towerData } from "../../../public/src/init/asset";
import { getUserBySocket } from "../../sessions/user.session.js";
import { createResponse } from "../../utils/response/createResponse.js";
import Tower from "../../classes/models/tower.class.js";

const towerPurchaseHandler = ({ socket, payload }) => {
    const { x, y } = payload;

    // 유저가 존재함
    const user = getUserBySocket(socket);
    if (!user) {
        const errorResponse = createResponse(PacketType.ERROR, { message: '유저가 세션에 존재하지 않습니다.' });
        socket.write(errorResponse);
        return;
    }

    // 게임세션 불러오기 (유저가 참가하고 있는 게임세션 을 불러오기)
    // 작성해야 할 코드

    // 상대 유저 찾기
    const getOpponent = gameSessions.getOpponent(user.id)

    const tower = new Tower({ x, y });
    gameSessions.addTower(tower);

    // 타워 설치했음을 알림
    const responseData = { towerId: tower.id }
    const towerPurchaseResponse = createResponse(PacketType.TOWER_PURCHASE_RESPONSE, responseData)
    socket.write(towerPurchaseResponse);

    // 상대에게 알려줄 알림
    const notificationData = { towerId: tower.id, x, y }
    const enemyTowerPurchaseResponse = createResponse(PacketType.ADD_ENEMY_TOWER_NOTIFICATION, notificationData)
    getOpponent.socket.write(enemyTowerPurchaseResponse);
    //createResponse부분을 notification으로 바꿔줘야 함
}

export default towerPurchaseHandler;


// socket 은 '유저의 정보값 ip주소나 연결포트'
// socket은 신청자고, payload는 request처럼 '요청한 내용'