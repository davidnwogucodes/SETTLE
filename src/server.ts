import "dotenv/config";
const PORT = process.env.SERVER_PORT;
import {createServer} from "http";
import app from "./app";


const server = createServer(app);

// TODO: initChatServer(server);

server.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}...\n`)
});