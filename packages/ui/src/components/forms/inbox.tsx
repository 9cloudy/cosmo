"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function MessageFeed({ids}:{ids:string[]}) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const { data: session, status, update } = useSession();
  useEffect(() => {
    // Cleanup WebSocket connection when component unmounts
    
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  const connectToWebSocket = () => {
    const newSocket = new WebSocket(`ws://localhost:8080?authorization=Bearer*${JSON.stringify(session)}*?
    isAuthenticated=*${status}*${ids}`);

    newSocket.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    };

    newSocket.onmessage = (event) => {
      console.log("Message from server:", event.data);
      setMessages((prev) => [...prev, event.data as string]);
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    newSocket.onclose = () => {
      console.log("WebSocket closed");
      setIsConnected(false);
    };

    setSocket(newSocket);
  };
  const sendMessage = () => {
    if (socket && isConnected && inputMessage) {
      socket.send(inputMessage);
      setMessages((prev) => [...prev, `You: ${inputMessage}`]);
      setInputMessage("");
    }
  };
  return (
    <>
      <h1>Welcome to your chats</h1>
      <button onClick={connectToWebSocket} disabled={isConnected}>
        {isConnected ? "Connected" : "Connect to client"}
      </button>
      
    </>
  );
}
