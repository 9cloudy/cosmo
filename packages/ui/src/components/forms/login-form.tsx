"use client";

import * as React from "react";
import { Icons } from "../ui/icons";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { signIn } from "next-auth/react";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@repo/ui/components/dialog";
import { LogIn, X } from "lucide-react";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  hide?: boolean;
}

export function LoginForm({ hide, className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    const path = window.location.hash;
    if (path.includes("#login")) setIsOpen(true);
  });

  async function onSubmit() {
    setIsLoading(true);
    window.location.hash = "";
    await signIn("credentials", {
      email,
      password,
    });
    const image = (await axios.post("/api/user/login", { email:email })).data;
    localStorage.setItem("avatar", image);
    setIsOpen(false);
    setIsLoading(false);
  }

  async function googleSignIn() {
    setIsLoading(true);
    await signIn("google");
    setIsLoading(false);
    window.location.hash = "";
  }

  async function githubSignIn() {
    setIsLoading(true);
    await signIn("github");
    setIsLoading(false);
    window.location.hash = "";
  }

  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild>
        {hide ? (
          ""
        ) : (
          <Button
            variant="ghost"
            onClick={() => {
              setIsOpen(true);
              window.location.href = "/#login";
            }}
            className={`${className ? className : "justify-start px-2 text-gray-300 hover:bg-white/10 hover:text-white"}`}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Log in
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="grid gap-2 ">
          <DialogHeader>
            <DialogClose asChild>
              <button
                onClick={() => {
                  setIsOpen(false);
                  window.location.hash = "";
                }}
                aria-label="Close"
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-zinc-100 data-[state=open]:text-zinc-500 dark:ring-offset-zinc-950 dark:focus:ring-zinc-300 dark:data-[state=open]:bg-zinc-800 dark:data-[state=open]:text-zinc-400 "
              >
                <X className="h-4 w-4" />
              </button>
            </DialogClose>
            <DialogTitle>Log Into your account</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid  items-center gap-4">
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
          </div>

          <Button type="submit" onClick={onSubmit} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            log in
          </Button>
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
      </DialogContent>
    </Dialog>
  );
}
