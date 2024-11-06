import {handleError} from "../../utils/error/errorHandler.js";

/**
 * 패킷 구조
 * message S2CStateSyncNotification {
 *     int32 userGold = 1;
 *     int32 baseHp = 2;
 *     int32 monsterLevel = 3;
 *     int32 score = 4;
 *     repeated TowerData towers = 5;
 *     repeated MonsterData monsters = 6;
 * }
 */

const stateSyncNotyHandler = ({socket, payload}) => {
    try {
        const {userGold, baseHp, monsterLevel, score, towers, monsters} = payload;
        
        
        
    }
    catch (e) {
        handleError(socket, e);
    }
};

export default stateSyncNotyHandler