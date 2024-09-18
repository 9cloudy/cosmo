import http from "http"
import { WebSocketServer } from "ws"

const server = http.createServer((req, res) => {
    res.setHeader("content-type", "application/json")
    res.writeHead(200)
}).listen(8080, () => {
    console.log("server running on port 8000");
});

const wss = new WebSocketServer({ noServer: true })

server.on("upgrade", (req, socket, head) => {
    socket.on("error", (err: Error) => {
        console.error(err)
    })
    //auth here
    if (!!req.headers.authorization && req.headers.authstatus !== "authurised") {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();  
        return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
        ws.on("error", (err: Error) => {
            console.error(err)
        })
        ws.emit("connection", ws, req)
    })
})

wss.on("connection", (ws, req) => {

    ws.on("error", (err) => {
        console.error(err)
    })
    ws.on("message", (data, isBinary) => {
        console.log("data recived", data)
        wss.clients.forEach((client) => {
            if (client.readyState === ws.OPEN && !isBinary) {
                ws.send(data)
            }
        })
    })
    ws.send("welcome")
})