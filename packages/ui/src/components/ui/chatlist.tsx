import { ArrowLeft, MessageCircle, Search, Users } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-dropdown-menu";

export default function ChatList({
      chats,
      recipient,
      setRecipient,
    }: { chats: Chat[]; recipient: string | null; setRecipient: (id: string | null) => void }) {
      return (
        <div
          className={`w-full max-lg:min-w-[30%] lg:min-w-[20%] md:w-64 bg-gray-50 dark:bg-[#2B2D31] border-r border-gray-200 dark:border-gray-800 flex flex-col ${recipient ? "hidden md:flex" : "flex"}`}
        >
          <div className="p-4 flex items-center justify-between">
            <div className="font-semibold text-lg">Direct Messages</div>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setRecipient(null)}>
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
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
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
                  className={`w-full h-[8vh] justify-start px-2 py-2 hover:bg-gray-300 dark:hover:bg-[#323539] ${recipient === chat.publicId ? "bg-gray-200 dark:bg-gray-700" : ""}`}
                  onClick={() => {
                    setRecipient(chat.publicId)
                  }}
                >
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={chat.image} alt={chat.name} />
                    <AvatarFallback>{chat.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col justify-start flex-1 min-w-0">
                    <span className="font-medium text-sm truncate w-full">{chat.name}</span>
                  </div>
                </Button>
                {index < chats.length - 1 && <Separator className="bg-gray-200 dark:bg-gray-700" />}
              </div>
            ))}
          </ScrollArea>
        </div>
      )
    }
type Chat = {
  publicId: string
  name: string
  image: string
}

