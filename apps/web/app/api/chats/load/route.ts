import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import prisma, { status } from "@repo/db/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import { Servertoken } from "~/types";

export async function GET(req: NextRequest ) {
    const session = await getServerSession(options) as Servertoken;
    if (!session) return NextResponse.json({ msg: "please sign in" });

    const chat_ids = await prisma.friends.findMany({
        where: {
            user_Id: session.user.id,
            status:status.CONFIRMED,
        },
        select: {
            friendIds: true
        }
    })
    let data: {
        publicId: string;
        name: string;
        image: string;
    }[] = [];
    for (let i = 0; i < chat_ids.length!; i++) {
        const id = chat_ids[i]!.friendIds
        const each = await prisma.users.findFirst({
            where: {
                publicId: id
            }, select: {
                image: true,
                name: true,
                publicId: true
            }
        })
        data.push(each!)
    }
    return NextResponse.json(data!);
}