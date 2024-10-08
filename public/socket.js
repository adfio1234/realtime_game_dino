import { CLIENT_VERSION } from './constants.js';

const socket = io('http://localhost:3000', {
  query: {
    clientVersion: CLIENT_VERSION,
  },//connection에서 버전체크를 위해사용
});

let userId = null;//null로 초기화 하여 선언
socket.on('response', (data) => {
  //console.log(data);
});

//
socket.on('connection', (data) => {
  console.log('connection: ', data);
  userId = data.uuid;
});

const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

export { sendEvent };
