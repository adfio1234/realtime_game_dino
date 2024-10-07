import {sendEvent} from './socket.js';


class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange=[true,true,true,true,true,true];//스테이지별 이벤트 통제
  currentStage=1000;//현재 스테이지id\
  stageIndex=0;//스테이지별 이벤트통제를 위한 인덱스

  constructor(ctx, scaleRatio,stageTable,itemTable,itemUnlockTable) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;

    this.stageTable=stageTable;
    this.itemTable=itemTable;
    this.itemUnlockTable=itemUnlockTable;
  }
 

  update(deltaTime) {
    this.score += deltaTime * 0.001*this.stageTable[this.stageIndex].scorePerSecond;
   
    // 점수가 100점 이상이 될 시 서버에 메세지 전송
    if (Math.floor(this.score) >= this.stageTable[this.stageIndex].score && this.stageChange[this.stageIndex]) {
      this.stageChange[this.stageIndex++] = false;//index를 활용하여 이벤트를 false로만든다.  
      sendEvent(11, { currentStage: this.currentStage, targetStage: this.currentStage+1 }); //currentStage+1을 하여 타겟 stage로 이동한다.
      this.currentStage+=1;
      console.log(this.currentStage);
    }
  }
  //item획득시 점수 추가 부분
  getItem(itemId) {
    this.score+=this.itemTable[itemId-1].score; 
    console.log(`Get Item you got ${this.itemTable[itemId-1].score}`);
  }

  reset() {
    this.score = 0;
    this.currentStage=1000;
    this.stageIndex=0;
    for(let i=0;i<this.stageChange.length;i++){
      this.stageChange[i]=true;
    }
  }
  

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;
    

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;
    const stageX=highScoreX-125*this.scaleRatio;//STAGE정보를 뛰우는역활

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);
    const stagePadded=this.currentStage-1000;

    this.ctx.fillText(`STAGE ${stagePadded}`, stageX, y);
    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
