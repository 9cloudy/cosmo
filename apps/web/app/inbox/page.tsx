"use client";

import { Button } from "@repo/ui/components/button";
import { useEffect, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Input } from "@repo/ui/components/input";
import { Separator } from "@repo/ui/components/separator";
import { MessageCircle, Search, Users, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { token } from "~/types";
import { Icons } from "@repo/ui/components/icons";

export default function Inbox() {
  const [Recipant, setRecipant] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<
    {
      senderId: string;
      message: string;
    }[]
  >([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const { data: session, status } = useSession() as any as token;
  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);
  const connectToWebSocket = () => {
    const newSocket =
      new WebSocket(`ws://localhost:8080?authorization=Bearer*${JSON.stringify(session)}*?
    isAuthenticated=*${status}`);
    newSocket.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    };

    newSocket.onmessage = (event) => {
      console.log("Message from server:", event.data);
      setMessages((prev) => [...prev, JSON.parse(event.data)]);
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
      socket.send(
        JSON.stringify({ clientId: Recipant, message: inputMessage })
      );

      setMessages((prev) => [
        ...prev,
        {
          senderId: "",
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
  return (
    <>
      <div className="flex h-[calc(100vh-4rem)] bg-white dark:bg-[#313338] text-gray-900 dark:text-gray-100">
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

        <div
          className={`w-full md:w-64 bg-gray-50 dark:bg-[#2B2D31] border-r border-gray-200 dark:border-gray-800 flex flex-col ${Recipant ? "hidden md:flex" : "flex"}`}
        >
          <div className="p-4 flex items-center justify-between">
            <div className="font-semibold text-lg">Direct Messages</div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setRecipant(null)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          <div className="md:hidden flex items-center gap-2 px-4 pb-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
            <div className="h-6 w-[2px] bg-gray-300 dark:bg-gray-700 rounded-full" />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
            >
              <Users className="h-5 w-5" />
            </Button>
          </div>

          <div className="px-3 mb-2">
            <div className="relative">
              <Search
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={16}
              />
              <Input
                type="text"
                placeholder="Find or start a conversation"
                className="pl-8 bg-gray-100 dark:bg-[#383A40] border-none text-sm placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          <ScrollArea className="flex-grow">
            {chats.map((chat, index) => (
              <div key={chat.publicId}>
                <Button
                  variant="ghost"
                  className={`w-full h-[8vh] justify-start px-2 py-2 hover:bg-gray-300 dark:hover:bg-[#323539]`}
                  onClick={() => {
                    setRecipant(chat.publicId);
                    connectToWebSocket();
                  }}
                >
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={chat.image} alt={chat.name} />
                    <AvatarFallback>{chat.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col justify-start flex-1 min-w-0">
                    <span className=" font-medium text-sm truncate w-full">
                      {chat.name}
                    </span>
                    {/* <span className="text-xs text-gray-500 dark:text-gray-400 truncate w-full">
                    {chat.lastMessage}
                  </span> */}
                  </div>
                </Button>
                {index < chats.length && (
                  <Separator className=" bg-gray-200 dark:bg-gray-700" />
                )}
              </div>
            ))}
          </ScrollArea>
        </div>
        <div
          className={`flex-grow flex flex-col bg-gray-50 dark:bg-[#313338] ${Recipant ? "flex" : "hidden md:flex"}`}
        >
          {Recipant ? (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2 md:hidden"
                  onClick={() => setRecipant(null)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarImage
                    src={
                      chats.find((chat) => chat.publicId === Recipant)?.image
                    }
                    alt={chats.find((chat) => chat.publicId === Recipant)?.name}
                  />
                  <AvatarFallback>
                    {chats.find((chat) => chat.publicId === Recipant)?.name[0]}
                  </AvatarFallback>
                </Avatar>
                <h2 className="font-semibold">
                  {chats.find((chat) => chat.publicId === Recipant)?.name}
                </h2>
              </div>
              <ScrollArea className="flex-grow p-4">
                {messages.map((data, id) => (
                  <div key={id} className="mb-4 group">
                    <div className="flex items-start gap-4 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded p-2 -mx-2">
                      <Avatar className="h-10 w-10 mt-0.5">
                        <AvatarImage
                          src={
                            data.senderId === ""
                              ? session?.user?.image || localStorage.getItem("avatar")!
                              : chats.find((chat) => chat.publicId === Recipant)
                                  ?.image
                          }
                        />
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className=" font-thin">
                            {data.message}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              <div className="p-4 mx-4 mb-4">
                <Input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => {
                    setInputMessage(e.target.value);
                    console.log(inputMessage);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                        sendMessage()
                    }}
                  placeholder="Message"
                  className="bg-gray-100 dark:bg-[#383A40] border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <div className="w-full flex justify-end">
                  <Button
                    onClick={sendMessage}
                    disabled={isLoading}
                    variant={"ghost"}
                    className="absolute bottom-8"
                  >
                    {isLoading ? (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Icons.Send />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </>
  );
}
