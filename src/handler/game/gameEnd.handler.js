import { getGameSession, removeGameSession } from "../../sessions/game.session.js";

const gameEndRequestHandler = ({ socket, payload, sequence }) => {
    try {
        const gameSession = getGameSession();
        if (!gameSession) {
            console.error("Game session not found");
        }

        // 게임 세션 종료
        removeGameSession();
        console.log(`Game End`)

    } catch (e) {

    }
}

export default gameEndRequestHandler;