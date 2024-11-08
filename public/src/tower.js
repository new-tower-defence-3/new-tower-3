import { towerDataTable } from './init/asset.js';

export class Tower {
  // 타워의 데이터를 담는 배열
  static towerData = [];

  // 전달받은 데이터를 Tower 클래스에 로드합니다.
  static loadTowerData(data) {
    this.towerData = data;
  }

  // 타워의 데이터가 담긴 배열에서 구매+배치할 타워를 고름
  // towerType에 타tower.json의 타워가 가지는 Type을 전달
  static getTowerData(towerType) {
    const splitTowerData = towerType.split('/');
    const fileName = splitTowerData[splitTowerData.length - 1];
    const towerName = fileName.slice(6, -4);

    const tower = this.towerData.find((t) => t.type === towerName);
    return tower;
  }
  
  constructor(x, y, towerType) {
    // 생성자 안에서 타워들의 속성을 정의한다고 생각하시면 됩니다!
    this.x = x; // 타워 이미지 x 좌표
    this.y = y; // 타워 이미지 y 좌표
    this.type = towerType;
    this.target = null; // 타워 광선의 목표
    this.upgradeCost = 50;
    this.level = 1;
    this.init();
  }

  upgrade(level) {
    const towerData = towerDataTable.data.find((tower) => tower.type === this.type);

    this.level = level;
    this.attackPower = towerData.attack_power + 10 * (this.level - 1); //타워 공격력
    this.range = towerData.range + 10 * (this.level - 1); // 타워 사거리
  }

  init() {
    const towerData = towerDataTable.data.find((tower) => tower.type === this.type);
    if (!towerData) {
      console.log(`Not Fonud tower Data : type [${this.type}]`);
      return;
    }
    this.width = towerData.width; // 타워 이미지 가로 길이 (이미지 파일 길이에 따라 변경 필요하며 세로 길이와 비율을 맞춰주셔야 합니다!)
    this.height = towerData.height; // 타워 이미지 세로 길이

    this.cost = towerData.cost; // 타워 구입 비용
    this.attackPower = towerData.attack_power + 10 * (this.level - 1); //타워 공격력
    this.range = towerData.range + 10 * (this.level - 1); // 타워 사거리
    this.defaultCooldown = towerData.cooldown;
    this.cooldown = towerData.cooldown; // 타워 공격 쿨타임
    this.defaultBeamDuration = towerData.beamDuration; // 타워 광선 디폴트 지속 시간
    this.beamDuration = towerData.beamDuration; // 타워 광선 지속 시간
  }

  draw(ctx, towerImages) {
    ctx.drawImage(
      towerImages[`${this.type}`],
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height,
    );

    ctx.font = '20px Times New Roman';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'yellow';
    let levelText = '';
    for (let i = 0; i < this.level; i++) {
      levelText += '★';
    }
    ctx.fillText(`${levelText}`, this.x, this.y - this.height / 2);

    if (this.beamDuration > 0 && this.target) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.target.x + this.target.width / 2, this.target.y);
      ctx.strokeStyle = 'skyblue';
      ctx.lineWidth = 10;
      ctx.stroke();
      ctx.closePath();
      this.beamDuration--;
    }
  }

  attack(monster) {
    if (this.cooldown <= 0) {
      monster.hp -= this.attackPower;
      this.cooldown = 180; // 3초 쿨타임 (초당 60프레임)
      this.beamDuration = this.defaultBeamDuration; // 광선 지속 시간 (0.5초)
      this.target = monster; // 광선의 목표 설정
    }
  }

  updateCooldown() {
    if (this.cooldown > 0) {
      this.cooldown--;
    }
  }
}

//사거리 짧은 단일 공격 타워
export class normalTower extends Tower {
  constructor(x, y, towerType) {
    super(x, y, towerType);
    this.upgradeCost = 50; //업그레이드 비용
  }
}
