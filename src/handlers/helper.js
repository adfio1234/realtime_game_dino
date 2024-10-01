import { CLIENT_VERSION } from "../constants.js";
import { getGameAssets } from "../init/assets.js";
import { getStage,createStage} from "../models/stage.models.js";
import { removeUser,getUser } from "../models/user.model.js";
import handlerMappings from "./handlerMapping.js";

export const handleDisconnect = (socket, uuid) => {
    removeUser(socket.id);
    console.log(`User disconnected: ${socket.id}`);
    console.log(`current users:`,getUser());
}


export const handleConnection = (socket, uuid) => {
    console.log(`New user connected!: ${uuid} with socket ID ${socket.id}`);
    console.log(`current users:`,getUser());

    // const { stages } = getGameAssets();
    // //stages 배열에서 0번쨰 =첫번째 스테이지

    // setStage(uuid, stages.data[0].id);
    // console.log(`stage: `, getStage(uuid));
    createStage(uuid);

    socket.emit(`connection`, { uuid });

}


export const handlerEvent = (io, socket, data) => {
    if (!CLIENT_VERSION.includes(data.clientVersion)) {
        socket.emit('response', { status: 'fail', message: "client vesion mismatch" });
        return;
    }

    const handler = handlerMappings[data.handlerId];
    if (!handler) {
        socket.emit('response', { status: 'fail', message: "Handler not found" });
        return;
    }

    const response = handler(data.userId, data.payload);

    if (response.broadcast) {
        io.emit('response', 'broadcast');
        return;
    }

    socket.emit('responnse', response);
}

//스테이지에 따라서 더 높은 점수 획득
//1스테이지 0->1점씩
//2스테이지 ,1000점-> 2점씩
