"use client";

import { useState } from "react";
import { Search, UserPlus, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from ".././ui/button";
import { Input } from ".././ui/input";
import { Card, CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import axios from "axios";
import { useToast } from "../../hooks/use-toast";
import "../ui/styles/query.css";
import { Icons } from "../ui/icons";

type User = {
  publicId: string;
  name: string;
  image: string;
};

export default function QueryForm() {
  const [searchResults, setSearchResults] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const searchUsers = async (id?: string) => {
    if (id === "") {
      setSearchResults([]);
      return;
    }
    const user = await axios.post("/api/query", {
      id: id,
    });
    console.log(user.data);
    setSearchResults(user.data);
  };

  const handleAddFriend = async (userId: string) => {
    try {
      await axios.post("/api/user/add", {
        id: [userId],
      });
      toast({
        title: "friend added :D",
      });
    } catch (err) {
      console.log("not added");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[90%] bg-gradient-to-br from-background to-secondary">
      <aside className="hidden md:flex flex-col w-80 bg-card shadow-lg">
        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold text-primary">Find Friends</h2>
          </div>
          <form className="space-y-4">
            <Input
              type="text"
              placeholder="Search for users..."
              onChange={(e) => searchUsers(e.target.value)}
              className="bg-background/50 border-primary/20 focus:border-primary"
            />
            <Button className="w-full bg-primary hover:bg-primary/90">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="md:hidden sticky top-0 z-10 bg-card shadow-md p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-primary">Find Friends</h1>
            </div>
          </div>
          <form className="flex gap-2">
            <Input
              type="text"
              placeholder="Search for users..."
              onChange={(e) => searchUsers(e.target.value)}
              className="flex-grow bg-background/50 border-primary/20 focus:border-primary"
            />
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          <h1 className="text-3xl font-bold mb-6 hidden md:block text-primary">
            Search Results
          </h1>
          <ScrollArea className="h-[calc(100vh-140px)] md:h-[calc(100vh-100px)]">
            <div className="space-y-4 pr-4">
              {searchResults !== null
                ? searchResults.map((user) => (
                    <Card
                      key={user.publicId}
                      className="bg-card hover:bg-card/90 transition-colors duration-200"
                    >
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12 border-2 border-primary">
                            <AvatarImage src={user.image} alt={user.name} />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-primary">
                              {user.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ID: {user.publicId}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            setLoading(true);
                            handleAddFriend(user.publicId);
                          }}
                          disabled={loading}
                          variant="outline"
                          size="sm"
                          className="md:size-default bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
                        >
                          {loading ? (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-2" />
                              <span className="hidden md:inline">
                                Add Friend
                              </span>
                              <span className="md:hidden">Add</span>
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                : ""}
              {searchResults !== null ? (
                searchResults.length === 0 && (
                  <p className="text-center text-muted-foreground">
                    No users found ＞︿＜.
                  </p>
                )
              ) : (
                <>
                  <p className="text-center text-muted-foreground">
                    Enter the USER_ID to find the user {"(✿◠‿◠)"}.
                  </p>
                  
                  <p className="text-center text-muted-foreground">
                    find your USER_ID in settings {">"} profile.
                  </p>
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      </main>
    </div>
  );
}
