import { PacketType } from "../../constants/header.js"
import { getUserBySocket } from '../../sessions/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { getGameSessionById } from '../../sessions/game.session.js';

const towerPurchaseHandler = async ({ socket, payload }) => {
    const { x, y } = payload;

    // 유저 정보 갖고 오기, 검증
    const user = await getUserBySocket(socket);
    if (!user) {
        return;
    }

    // 유저의 게임 세션 불러오기
    const gameSession = getGameSessionById(user.currentSessionId);
    if (!gameSession) {
        return;
    }

    // 상대 유저 찾기
    const opponentUser = gameSession.users.find(u => u.id !== user.id);
    if (!opponentUser) {
        return;
    }

    // 타워 id를 발급하는 부분
    const newTower = gameSession.addTower(user.id, { x, y });

    // 타워 설치했음을 사용자에게 알림
    const responseData = { towerId: newTower.id };
    const towerPurchaseResponse = createResponse(PacketType.TOWER_PURCHASE_RESPONSE, responseData);
    socket.write(towerPurchaseResponse);

    // 상대에게 타워 설치 알림 
    const notificationData = { towerId: newTower.id, x: newTower.x, y: newTower.y };
    console.log(newTower);
    const enemyTowerPurchaseResponse = createResponse(PacketType.ADD_ENEMY_TOWER_NOTIFICATION, notificationData);
    opponentUser.socket.write(enemyTowerPurchaseResponse);
};

export default towerPurchaseHandler;