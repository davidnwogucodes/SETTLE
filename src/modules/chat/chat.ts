import {Server,Socket,ServerOptions} from "socket.io";
import db from "../../database/models";

export enum ChatEvent{
    DM = "direct_message",
    GM = "group_message",
    MSGS ="view_chat_messages",
    JG = "join_group",
    CG = "create_group"
}


export interface UserProperty{
    id:string;
    userId:string;
}

interface IDirectMessage{
    senderId:string,
    reciepientId:string,
    message:string,
}

export const initSocketConnection = (server:ServerOptions)=>{
    try {
        const chatServer = new Server(server);
        // userIds are actually socket ids
        // extract userId from Token and check if they're following each other....
        chatServer.on("connection",(socket:Socket)=>{
            socket.on(ChatEvent.DM,async (senderId:string,recipientId:string,message:string)=>{
                // push current user detail to a dictionary
                const chat = await db.Chat.findOrCreate({where:{senderId,recipientId}});

                // @ts-ignore
                const newMessage = await db.ChatMessage.create({ChatId:chat.id}); 
                
                const sender:UserProperty = {
                    id:socket.id,
                    userId:senderId,
                }
                
                socket.to(recipientId).emit(ChatEvent.DM,{message,sender});
            });


            socket.on(ChatEvent.CG,async(senderId:string,groupName:string)=>{
                const newChatRoom = await db.Room.create({name:groupName});
                // @ts-ignore
                await newChatRoom.addUser(senderId);
                 
            })
        })
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// FROM STACK-OVERFLOW
// --------------------
// socket.emit('message', "this is a test"); //sending to sender-client only
// socket.broadcast.emit('message', "this is a test"); //sending to all clients except sender
// socket.broadcast.to('game').emit('message', 'nice game'); //sending to all clients in 'game' room(channel) except sender
// socket.to('game').emit('message', 'enjoy the game'); //sending to sender client, only if they are in 'game' room(channel)
// socket.broadcast.to(socketid).emit('message', 'for your eyes only'); //sending to individual socketid
// io.emit('message', "this is a test"); //sending to all clients, include sender
// io.in('game').emit('message', 'cool game'); //sending to all clients in 'game' room(channel), include sender
// io.of('myNamespace').emit('message', 'gg'); //sending to all clients in namespace 'myNamespace', include sender
// socket.emit(); //send to all connected clients
// socket.broadcast.emit(); //send to all connected clients except the one that sent the message
// socket.on(); //event listener, can be called on client to execute on server
// io.sockets.socket(); //for emiting to specific clients
// io.sockets.emit(); //send to all connected clients (same as socket.emit)
// io.sockets.on() ; //initial connection from a client.