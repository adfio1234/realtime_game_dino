import express from "express";
import { createServer} from 'http';
import initSocket from "./init/socket.js";
import { loadGameAssets } from "./init/assets.js";
const app = express();
const server = createServer(app);

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));//서버에 정적 파일 서빙


// app.get('/', (req, res) => {
//     res.send("Hello World");
// })

initSocket(server);

server.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);

    //이곳에서 파일 읽음
    try {
        const assets = await loadGameAssets();
        //console.log(assets);
        console.log('Assets loaded seccessfully');
    } catch (e) {
        console.error("Failed to load game assets" + e);
        console.error(e.stack);
    }
});