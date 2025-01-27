import { Button } from "@repo/ui/components/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Input } from "@repo/ui/components/input";
import { ArrowLeft, Send } from "lucide-react";


export default function ChatArea({
    recipient,
    chats,
    messages,
    inputMessage,
    setInputMessage,
    sendMessage,
    session,
    setRecipient
  }: {
    recipient: string | null
    chats: Chat[]
    messages: Message[]
    inputMessage: string
    setInputMessage: (message: string) => void
    sendMessage: () => void
    session: any
    setRecipient: (id: string | null) => void
  }) {
    if (!recipient) {
      return (
        <div className="flex-grow flex items-center justify-center bg-gray-50 dark:bg-[#313338] text-gray-500 dark:text-gray-400">
          Select a chat to start messaging
        </div>
      )
    }
  
    const selectedChat = chats.find((chat) => chat.publicId === recipient)
  
    return (
      <div className="flex-grow flex flex-col bg-gray-50 dark:bg-[#313338]">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center">
          <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={() => setRecipient(null)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-8 w-8 mr-3">
            <AvatarImage src={selectedChat?.image} alt={selectedChat?.name} />
            <AvatarFallback>{selectedChat?.name[0]}</AvatarFallback>
          </Avatar>
          <h2 className="font-semibold">{selectedChat?.name}</h2>
        </div>
        <ScrollArea className="flex-grow p-4">
          {messages.map((message,id) => (
            <MessageBubble key={id} message={message} selectedChat={selectedChat} session={session} />
          ))}
        </ScrollArea>
        <MessageInput inputMessage={inputMessage} setInputMessage={setInputMessage} sendMessage={sendMessage} />
      </div>
    )
  }
  
  function MessageBubble({
    message,
    selectedChat,
    session,
  }: { message: Message; selectedChat: Chat | undefined; session: any }) {
    const isOutgoing = message.senderId === ""
    return (
      <div className={`mb-4 flex ${isOutgoing ? "justify-end" : "justify-start"}`}>
        <div className={`flex items-start gap-2 max-w-[70%] ${isOutgoing ? "flex-row-reverse" : ""}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={isOutgoing ? session?.user?.image : selectedChat?.image}
              alt={isOutgoing ? session?.user?.name : selectedChat?.name}
            />
            <AvatarFallback>{isOutgoing ? session?.user?.name[0] : selectedChat?.name[0]}</AvatarFallback>
          </Avatar>
          <div className={`rounded-lg p-3 ${isOutgoing ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`}>
            <p className="text-sm">{message.message}</p>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
              {isOutgoing ?  message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }): message.timestamp as any as string  }
            </span>
          </div>
        </div>
      </div>
    )
  }
  
  function MessageInput({
    inputMessage,
    setInputMessage,
    sendMessage,
  }: { inputMessage: string; setInputMessage: (message: string) => void; sendMessage: () => void }) {
    return (
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            placeholder="Type a message..."
            className="flex-grow bg-gray-100 dark:bg-[#383A40] border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button onClick={sendMessage} variant="ghost" size="icon" className="bg-blue-500 hover:bg-blue-600 text-white">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    )
  }

  type Chat = {
  publicId: string
  name: string
  image: string
}

type Message = {
  senderId: string
  recipientId: string
  message: string
  timestamp: Date
}