import http from "http"
import { WebSocketServer,WebSocket } from "ws"

const server = http.createServer((req,res)=>{
    res.setHeader("content-type","application/json")
    res.writeHead(200)
}).listen(8080);

const wss = new WebSocketServer({noServer:true})

server.on("upgrade",(req,socket,head)=>{
    socket.on("error",(err:Error)=>{
        console.log(err)
    })
})