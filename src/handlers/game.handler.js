import { getGameAssets } from "../init/assets.js";
import {clearStage,getStage,setStage} from '../models/stage.models.js'

export const gameStart=(uuid,payload)=>{

    const { stages } = getGameAssets();

    clearStage(uuid);
    
    //stages 배열에서 0번쨰 =첫번째 스테이지
    setStage(uuid, stages.data[0].id,payload.timestamp);
    console.log(`stage: `, getStage(uuid));

    return {status:'success'};
}

export const gameEnd=(uuid,payload)=>{


    //클라이너트는 게임 종료시 타임스탬프와 총 점수
    const{timestamp:gameEndTime,score}=payload;
    const stages=getStage(uuid);

    if(!stages.length){
        return {status:'success',message:"No stages found for user"};
    }

    //각 스테이지의 지속 시간을 계산하여 총 점수 계산
    let totalScore=0;
    stages.forEach((stage,index)=>{
        let stageEndTime;
        if(index===stages.length-1){
            stageEndTime=gameEndTime;
        }
        else{
            stageEndTime=stages[index+1].timestamp;
        }

        const stageDuration=(stageEndTime-stage.timestamp)/1000;
        totalScore+=stageDuration;//1초당 1점

    })
    //점수와 타임스탬프 검증

    if(Math.abs(score-totalScore)>5){
        return {status:'fail',message:"Score verification failed"};
    }

    //DB에 저장한다면 여기부분에 저장한다.
    return {status:'success',message:"Game ended",score};
}