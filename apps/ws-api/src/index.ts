import http from "http";
import { WebSocket, WebSocketServer } from "ws";
import type { authToken } from "../types/ws";
import prisma from "@repo/db/prisma-client"
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
    const clientId = req.url?.split("*")[4] as string;
    console.log("Client connected", token);
    if (!token) return null;
    clients.set(token?.user.id, ws)
    
    ws.on("message", (data, isBinary) => {
        const client = clients.get(clientId)!;
        const admin = clients.get(token?.user.id)!;
            console.log(clients.has(clientId));
        if (admin.readyState === WebSocket.OPEN && client.readyState === WebSocket.OPEN ) {
            if (ws == admin) {
                client.send(data, { binary: isBinary })
            } else {
                admin.send(data, { binary: isBinary })
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
