"use client";

import * as React from "react";

import { cn } from "../../lib/utils";
import { Icons } from "../ui/icons";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@repo/ui/components/dialog";
import { X } from "lucide-react";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [username, setUsername] = React.useState<string>("");
  const session = useSession();
  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    const res = await axios("/api/user", {
      method: "post",
      data: {
        email,
        password,
        username,
      },
    });
    console.log(res.data.msg);
    if (res.data.msg === "account created successfully") {
      window.location.href = "/#login";
    }
    setIsLoading(false);
  }
  async function googleSignIn() {
    setIsLoading(true);
    await signIn("google", {
      callbackUrl: "/inbox",
    });
    setIsLoading(false);
  }
  async function githubSignIn() {
    setIsLoading(true);
    await signIn("github", {
      callbackUrl: "/inbox",
    });
    setIsLoading(false);
  }
  return (
    <div className={cn("grid gap-6 ", className)} {...props}>
      <div className="grid gap-2 ">
        <div className="grid gap-1">
          <Label className="sr-only" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Label className="sr-only" htmlFor="email">
            Password
          </Label>
          <Input
            id="password"
            placeholder="xyz123"
            type="password"
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect="off"
            disabled={isLoading}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Sign In with Email</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogClose asChild>
                <button
                  aria-label="Close"
                  className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-zinc-100 data-[state=open]:text-zinc-500 dark:ring-offset-zinc-950 dark:focus:ring-zinc-300 dark:data-[state=open]:bg-zinc-800 dark:data-[state=open]:text-zinc-400 "
                >
                  <X className="h-4 w-4" />
                </button>
              </DialogClose>
              <DialogTitle>Choose a username.</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid  items-center gap-4">
                <Input
                  id="name"
                  placeholder="krishna?"
                  className="col-span-3"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <DialogDescription>
                This will be your public display name.
              </DialogDescription>
            </div>

            <Button type="submit" onClick={onSubmit} disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Finish Sign In
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={googleSignIn}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={githubSignIn}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        Github
      </Button>
      <button onClick={() => signOut()}>log out</button>
      <Button onClick={() => console.log(session)}>check</Button>
    </div>
  );
}
