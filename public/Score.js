import {sendEvent} from './socket.js';
let stageInformation=1;
class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange=[true,true,true,true,true,true];//스테이지별 이벤트 통제
  scoreMultiple=1;//점수 배율

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {
    
    this.score += deltaTime * 0.001*this.scoreMultiple;
    // 점수가 100점 이상이 될 시 서버에 메세지 전송
    if (Math.floor(this.score) >= 1500 && this.stageChange[5]) {
      this.scoreMultiple=64;
      this.stageChange[5] = false;
      sendEvent(11, { currentStage: 1005, targetStage: 1006 }); 
      stageInformation=7;
    }
    else if (Math.floor(this.score) >= 1000 && this.stageChange[4]) {
      this.scoreMultiple=32;
      this.stageChange[4] = false;
      sendEvent(11, { currentStage: 1004, targetStage: 1005 }); 
      stageInformation=6;
    }
    else if (Math.floor(this.score) >= 600 && this.stageChange[3]) {
      this.scoreMultiple=16;
      this.stageChange[3] = false;
      sendEvent(11, { currentStage: 1003, targetStage: 1004 }); 
      stageInformation=5;
    }
    else if (Math.floor(this.score) >= 400 && this.stageChange[2]) {
      this.scoreMultiple=8;
      this.stageChange[2] = false;
      sendEvent(11, { currentStage: 1002, targetStage: 1003 }); 
      stageInformation=4;
    }
    else if (Math.floor(this.score) >= 200 && this.stageChange[1]) {
      this.scoreMultiple=4;
      this.stageChange[1] = false;
      sendEvent(11, { currentStage: 1001, targetStage: 1002 }); 
      stageInformation=3;
    }
    else if (Math.floor(this.score) >= 100 && this.stageChange[0]) {
      this.scoreMultiple=2;
      this.stageChange[0] = false;
      sendEvent(11, { currentStage: 1000, targetStage: 1001 }); 
      stageInformation=2;
    }
  }
  //item획득시 점수 추가 부분
  getItem(itemId) {
    this.score += 100;
  }

  reset() {
    this.score = 0;
    this.stageInformation=1;
    this.scoreMultiple=1;
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
    const stagePadded=stageInformation;

    this.ctx.fillText(`STAGE ${stagePadded}`, stageX, y);
    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
