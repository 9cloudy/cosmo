"use client";

import { Button } from "@repo/ui/components/button";
import {  useEffect, useRef, useState } from "react";
import { MessageCircle, Search, Users, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { token } from "~/types";
import ChatArea from "@repo/ui/components/chatarea";
import ChatList from "@repo/ui/components/chatlist";

export default function Inbox() {
  const [recipient, setRecipient] = useState<string | null>(null);
  const socket = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<
    {
      senderId: string;
      recipientId: string;
      message: string;
      timestamp: Date;
    }[]
  >([]);
  const [inputMessage, setInputMessage] = useState("");
  const { data: session, status } = useSession() as any as token;

  useEffect(() => {
    const ws = new WebSocket(
      `ws://localhost:8080?authorization=Bearer*${JSON.stringify(session)}*?isAuthenticated=*${status}`
    );

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      console.log("Message from server:", event.data);
      setMessages((prev) => [...prev, JSON.parse(event.data)]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
      setIsConnected(false);
    };

    socket.current = ws;

    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, [session]);

  const sendMessage = () => {
    if (socket.current && isConnected && inputMessage) {
      socket.current.send(
        JSON.stringify({ clientId: recipient, message: inputMessage })
      );
      setMessages((prev) => [
        ...prev,
        {
          senderId: "",
          recipientId: recipient!,
          timestamp: new Date(),
          message: inputMessage,
        },
      ]);
      setInputMessage("");
    }
  };
  const chats = JSON.parse(
    window.location.hash.replace("#", "").replaceAll("%22", `"`)
  ) as any as {
    publicId: string;
    name: string;
    image: string;
  }[];
  const filteredMessages = messages.filter(
    (msg) => msg.senderId === recipient || msg.recipientId === recipient
  );
  return (
    <>
      <div className="flex h-[calc(100vh-4rem)] bg-white dark:bg-[#313338] text-gray-900 dark:text-gray-100">
        <SidebarNav />
        <ChatList
          chats={chats}
          recipient={recipient}
          setRecipient={setRecipient}
        />
        <ChatArea
          recipient={recipient}
          chats={chats}
          messages={filteredMessages}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          sendMessage={sendMessage}
          session={session}
          setRecipient={setRecipient}
        />
      </div>
    </>
  );
}

function SidebarNav() {
  return (
    <div className="w-16 bg-gray-100 dark:bg-[#2B2D31] flex-shrink-0 flex-col items-center py-4 space-y-4 border-r border-gray-200 dark:border-gray-800 hidden md:flex">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
      <div className="w-10 h-[2px] bg-gray-300 dark:bg-gray-700 rounded-full" />
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
      >
        <Users className="h-5 w-5" />
      </Button>
    </div>
  );
}
