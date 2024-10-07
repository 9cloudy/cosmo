import http from "http";
import  { WebSocket , WebSocketServer } from "ws";

const server = http.createServer((req, res) => {
    res.setHeader("content-type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify({ message: "HTTP server is running" }));
}).listen(8080, () => {
    console.log("Server running on port 8080");
});

const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (req, socket, head) => {
    socket.on("error", (err: Error) => {
        console.error(err);
    });
   
    console.log( req.url);

    // if (!!req.url?.includes("authorization") && req.url.includes("isAuthenticated") !== false) {
    //     const url = new URL(req.url!)
    // console.log( url);
    //     socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    //     socket.destroy();
    //     return;
    // }

    wss.handleUpgrade(req, socket, head, (ws) => {
        ws.on("error", (err: Error) => {
            console.error(err);
        });
       
        wss.emit("connection", ws, req);
    });
});

wss.on("connection", (ws, req) => {
    
    
    console.log("Client connected");
    
    ws.on("message", (data, isBinary) => {
        const url = new URL(req.url!)
    console.log( url);
        console.log("Data received:", data.toString());
        
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    });

    ws.on("error", (err) => {
        console.error("WebSocket error:", err);
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });

    ws.send("Welcome to the WebSocket server!");
});
