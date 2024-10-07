//유저는 스테이지를 하나씩 올라갈 수 있다.(1스테이지->2,2->3)
//일정점수가 되면 다음 스테이지로 이동한다.

import { getGameAssets } from "../init/assets.js";
import { getStage, setStage } from '../models/stage.models.js'

export const moveStageHandler = (userId, payload) => {
    //console.log(payload);
    //유저의 현재 스테이지 정보
    let currentStages = getStage(userId);
    if (!currentStages.length) {
        return { status: 'fail', message: "No stages found for user" };
    }

    //오름차순-> 가장 큰 스테이지 ID 확인<-현재 유저의 스테이지
    currentStages.sort((a, b) => a.id - b.id);
    const currentStage = currentStages[currentStages.length - 1];

    if (currentStage.id !== payload.currentStage) {
        return { status: 'fail', message: "Current Stage mismatch" };
    }

    //점수검증
    const serverTime = Date.now();
    const elapsedTime = (serverTime - currentStage.timeStamp) / 1000;

    //1스테이지->2스테이지로 넘어가는 과정
    //5=>임의로 정한 오차 범위
    if (elapsedTime < 100 || elapsedTime > 105) {
        return { status: 'fail', message: 'Invalid elapsed time' };
    }

    //targetStage에 대한 검증<-게임 에셋에 존재 하는가?
    const { stages } = getGameAssets();
    if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
        return { status: 'fail', message: "Target Stage not found" };
    }
    setStage(userId, payload.targetStage, serverTime);
    //console.log(getStage(userId));
    return { status: "success" };
};