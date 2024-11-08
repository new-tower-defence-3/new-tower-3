import { v4 as uuidv4 } from 'uuid';

class Tower {
    constructor({ x, y }) {
        this.id = uuidv4();
        this.x = x;
        this.y = y;
    }
}

export default Tower;
