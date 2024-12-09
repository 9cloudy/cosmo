"use client";

import { useState, useEffect } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { useToast } from "@repo/ui/hooks/use-toast.";
import { useSession } from "next-auth/react";
import { token } from "~/types";
import convertToUrl from "@repo/ui/lib/imageToUrl";
import axios from "axios";
import { Icons } from "@repo/ui/components/icons";

export default function UserSettings() {
  const { toast } = useToast();
  const { data } = useSession() as any as token;
  const [isEditing, setIsEditing] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [user, setuser] = useState({
    id: "",
    name: "",
    email: "",
    avatarUrl: "",
  });
  useEffect(() => {
    if (data) {
      setuser({
        id: data?.user?.id || "",
        name: data?.user?.name || "",
        email: data?.user?.email || "",
        avatarUrl: data?.user?.image || localStorage.getItem("avatar") || "",
      });
      return;
    }
  }, [data]);
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(user.id);
    setHasCopied(true);
    toast({
      title: "Copied!",
      description: "User ID copied to clipboard",
    });
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setuser((prev) => ({ ...prev, [name]: value }));
    console.log(user);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const image = await convertToUrl(file);
    setuser((prev) => ({ ...prev, avatarUrl: image }));
    console.log(user);
  };
  const handleSubmit = async () => {
    const res = await axios.put("/api/user/update", user);
    setisLoading(true);
    if (res.data.msg === "done") {
      window.location.href = "/settings#login";
      setIsEditing(false);
      setisLoading(true);
      return toast({
        title: "credentials updated successfully",
      });
    }
    setIsEditing(false);
    setisLoading(true);
    return toast({
      title: "something went wrong",
    });
  };

  return (
    <Card className="border-none shadow-none h-full">
      <CardHeader>
        <CardDescription>
          Manage your profile settings and account preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-lg font-medium">{user.name}</h3>
              <p className="text-sm text-muted-foreground">
                User ID: {user.id}
              </p>
              {isEditing && (
                <div className="mt-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="text-sm"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={user.name}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={user.email}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="id">User ID</Label>
              <div className="flex space-x-2">
                <Input
                  id="id"
                  name="id"
                  value={user.id}
                  disabled
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                >
                  {hasCopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="sr-only">Copy ID</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save changes
            </Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Edit profile
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
