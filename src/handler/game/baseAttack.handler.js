import { getGameSession } from "../../sessions/game.session.js";
import updateBaseHpNotification from "../../utils/notification/updateBaseHpNotification.js"; // 알림 전송 핸들러 불러오기
import gameOverNotification from "../../utils/notification/gameOverNotification.js";

const handleBaseAttackRequest = ({ socket, payload, sequence }) => {
    try {
        const { damage } = payload; // 클라이언트에서 전달받은 데미지
        const userId = socket.userId

        // 게임 세션 찾기
        const gameSession = getGameSession();
        if (!gameSession) {
            console.error("Game session not found");
        }

        // 게임 세션에서 유저 찾기
        const user = gameSession.getUser(userId);
        if (!user) {
            console.error("User not found");
        }

        // 게임 세션에서 상대방 찾기
        const opponent = gameSession.getOpponent(user);

        if (!opponent) {
            console.error("Opponent not found");
        }

        // 해당 유저의 기지 HP 업데이트
        user.updateBaseHp(damage);

        // 기지 HP 업데이트 알림을 전달하는 핸들러 호출
        updateBaseHpNotification(user, opponent);

        // 베이스 체력이 0이 된다면 게임 오버 패킷 전달
        if (user.basehp <= 0) {
            gameOverNotification(user, opponent);
        }

    } catch (e) {
        console.error(e);
    }
};

export default handleBaseAttackRequest;
