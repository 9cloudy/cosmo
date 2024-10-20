import http from "http";
import { WebSocket, WebSocketServer } from "ws";
import type { authToken } from "../types/ws";

const server = http.createServer((req, res) => {
    res.setHeader("content-type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify({ message: "HTTP server is running" }));
}).listen(8080, () => {
    console.log("Server running on port 8080");
});

const wss = new WebSocketServer({ noServer: true });
const clients = new Map<authToken["user"]["id"], WebSocket>();

server.on("upgrade", (req, socket, head) => {
    socket.on("error", (err: Error) => {
        console.error(err);
    });

    const authStatus = req.url?.split("*")[3]
    if (authStatus !== "authenticated") {

        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
        ws.on("error", (err: Error) => {
            console.error(err);
        });

        wss.emit("connection", ws, req);
    });
});

wss.on("connection", (ws, req) => {

    const token = req.url ? JSON.parse(req.url?.split("*")[1].replaceAll("%22", `"`)) as authToken : null;
    console.log("Client connected", token);
    if (!token) return null;
    clients.set(token?.user.id, ws)
    ws.on("message", (data, isBinary) => {

        const client = clients.get(token?.user.id)!
        console.log("Data received:", data.toString());
        const admin = clients.get("9976226646")!
        if (client.readyState === WebSocket.OPEN) {
            if(client != admin){
                admin.send(data,{binary:isBinary})
            }else{
                client.send(data,{binary:isBinary})
            }
            
        }
        // wss.clients.forEach((client) => {
        //     if (client.readyState === WebSocket.OPEN) {
        //         client.send(data, { binary: isBinary });
        //     }
        // }); 
    });


    ws.on("error", (err) => {
        console.error("WebSocket error:", err);
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });

    ws.send("Welcome to the WebSocket server!");
});
