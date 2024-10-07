
import { cookies } from "next/headers";
import MessageFeed from "@repo/ui/components/inbox"

export default async function Inbox() {
  const token = cookies().get("next-auth.session-token")! as unknown as string;
  
  return (
    <>
    <MessageFeed token={token} ></MessageFeed>
    
    </>
  )
}
