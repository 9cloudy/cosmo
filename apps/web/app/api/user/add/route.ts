import prisma, { status } from "@repo/db/prisma-client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/options";
import { Servertoken } from "~/types";

export async function POST(req: NextRequest) {
  const { id }: { id: string } = await req.json();
  const session = await getServerSession(options) as Servertoken
  await prisma.friends.create({
    data: {
      friendIds: id,
      status: status.PENDING,
      users: {
        connect: {
          publicId: session.user.id
        }
      }
    }
  })

  return NextResponse.json({ msg: "friend added succesfully" }, { status: 200 })
}