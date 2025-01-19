import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@repo/ui/components/dialog";
import { Button } from "./button";
import { UserPlus, X } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { session } from "@repo/ui/lib/types";
import { Card, CardContent } from "./card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Icons } from "./icons";
import { useToast } from "@repo/ui/hooks/use-toast";

export default function Requests({ title,className }: { title: string ,className:string}) {
  const [Requests, setRequests] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setopen] = useState<boolean | undefined>();
  const session = useSession() as any as session;
  const { toast } = useToast();
  async function getreq() {
    const res = await axios.post("/api/requests", {
      user_id: session.data.user.id,
    });
    setRequests(res.data.reverse());
    setLoading(false);
  }
  async function respond(id: string, allow: boolean) {
    const res = await axios.post("/api/user/accept", {
      id: id,
      accept: allow,
    });
    setopen(false);
    setLoading(false);
    toast({
      title: res.data,
    });
  }
  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button onClick={getreq} className={className} variant="outline">
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[80%] lg:max-w-[50%]">
        <div className="grid gap-2 ">
          <DialogHeader>
            <DialogClose asChild>
              <button
                aria-label="Close"
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-zinc-100 data-[state=open]:text-zinc-500 dark:ring-offset-zinc-950 dark:focus:ring-zinc-300 dark:data-[state=open]:bg-zinc-800 dark:data-[state=open]:text-zinc-400 "
              >
                <X className="h-4 w-4" />
              </button>
            </DialogClose>
            <DialogTitle>pending requests</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid  items-center gap-4">
              <div className="space-y-4 pr-4">
                {Requests &&
                  Requests.map((user) => (
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
                        <div>
                          <Button
                            onClick={() => {
                              setLoading(true);
                              respond(user.publicId, true);
                            }}
                            disabled={loading}
                            variant="outline"
                            size="sm"
                            className="md:size-default bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 mr-2"
                          >
                            {loading ? (
                              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <UserPlus className="h-4 w-4 mr-2" />
                                <span className="hidden md:inline">accept</span>
                                <span className="md:hidden">accept</span>
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => {
                              setLoading(true);
                              respond(user.publicId, false);
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
                                <X className="h-4 w-4 mr-2" />
                                <span className="hidden md:inline">reject</span>
                                <span className="md:hidden">reject</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                {Requests.length === 0 && (
                  <p className="text-center text-muted-foreground">
                    No requests found ＞︿＜.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type User = {
  publicId: string;
  name: string;
  image: string;
};
