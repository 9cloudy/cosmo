"use client";

import { Github, Inbox, LogOut, Search, Settings } from "lucide-react";
import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { ModeToggle } from "./theme-toggle";
import { LoginForm } from "../forms/login-form";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useToast } from "@repo/ui/hooks/use-toast";
import { signOut, useSession } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

export function Navbar() {
  const { toast } = useToast();
  const session = useSession();
  const image = localStorage.getItem("avatar")! || session.data?.user?.image!;
  async function loadChats() {
    const res = await axios.get("/api/chats/load");

    if (res.data.msg) {
      return toast({
        title: res.data.msg,
      });
    }
    console.log(res.data);
    window.location.href = `/inbox#${JSON.stringify(res.data)}`;
  }
  return (
    <header className="relative border-b border-white/10 bg-black backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <a href="/" className="text-3xl font-sans font-bold text-white">
            cosmo
          </a>

          <nav className="flex items-center space-x-8">
            <div className="hidden md:flex items-center space-x-8">
              <a
                onClick={loadChats}
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                <Inbox className="h-5 w-5" />
                <span className="sr-only">Inbox</span>
              </a>
              <a
                href="/find"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Find Friends</span>
              </a>
              <a
                href="https://github.com/aarush-sharma/chat-app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
            <ModeToggle />
            <LoginForm hide={true} />
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={image} alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64 bg-black p-0">
                  <SheetHeader className="border-b border-white/10 p-4">
                    <SheetTitle className="text-white">Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col p-4">
                    <a
                      onClick={loadChats}
                      className="flex items-center space-x-2 rounded-lg px-2 py-2 text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                      <Inbox className="h-5 w-5" />
                      <span>Inbox</span>
                    </a>
                    <a
                      href="/find"
                      className="flex items-center space-x-2 rounded-lg px-2 py-2 text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                      <Search className="h-5 w-5" />
                      <span>Find Friends</span>
                    </a>
                    <a
                      href="https://github.com/aarush-sharma/chat-app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 rounded-lg px-2 py-2 text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                      <Github className="h-5 w-5" />
                      <span>GitHub</span>
                    </a>
                    <div className="my-2 border-t border-white/10" />
                    <Button
                      variant="ghost"
                      className="justify-start px-2 text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                    <LoginForm />
                    <Button
                      variant="ghost"
                      className="justify-start px-2 text-gray-300 hover:bg-white/10 hover:text-white"
                      onClick={() => signOut()}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={image} alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-black border-white/10"
                  align="end"
                  forceMount
                >
                  <DropdownMenuItem className="text-gray-200 focus:bg-white/10 focus:text-white">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem>
                    <LoginForm />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="text-gray-200 focus:bg-white/10 focus:text-white">
                    <LogOut
                      className="mr-2 h-4 w-4"
                      onClick={() => signOut()}
                    />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
