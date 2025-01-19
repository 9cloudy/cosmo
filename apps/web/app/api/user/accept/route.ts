import prisma, { status } from "@repo/db/prisma-client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/options";
import { Servertoken } from "~/types";

export async function POST(req: NextRequest) {
  const { id, accept }: { id: string,accept:boolean} = await req.json();
  const session = await getServerSession(options) as Servertoken
  const newStatus = accept ? status.CONFIRMED : status.DENIED;
  if(accept){
    await prisma.friends.create({
    data: {
      friendIds: id,
      status: newStatus,
      users: {
        connect: {
          publicId: session.user.id
        }
      }
    }, select: {
      friendIds: true
    }
  });
  }
 const user =  await prisma.friends.findFirst({
    where: {
      friendIds: session.user.id,
      user_Id: id,
      status: status.PENDING,
    },select:{
      fnd_id:true
    }
  });
  await prisma.friends.update({
    where:{
      fnd_id:user?.fnd_id
    },
    data: {
      status: newStatus,
    }, select: {
      friendIds: true
    }
  });
  return NextResponse.json({ msg: "friend added succesfully" }, { status: 200 })
}