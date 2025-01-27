import http from "http";
import { WebSocket, WebSocketServer } from "ws";
import type { authToken } from "../types/ws";

interface payload {
    clientId: string;
    message: string;
}
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
        try {
            const { clientId, message }: payload = JSON.parse(data.toString());

            const recipientSocket = clients.get(clientId);
            if (!recipientSocket) {
                console.error(`Recipient ${clientId} not connected`);
                ws.send(JSON.stringify({ error: 'Recipient not connected' }));
                return;
            }

            recipientSocket.send(
                JSON.stringify({
                    senderId: token.user.id,
                    message,
                    recipientId: "",
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                })
            );
        } catch (err) {
            console.error('Error processing message:', err);
            ws.send(JSON.stringify({ error: 'Invalid message format' }));
        }
    });

    ws.on("error", (err) => {
        console.error("WebSocket error:", err);
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});
