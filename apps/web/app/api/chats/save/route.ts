import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import prisma, { status } from "@repo/db/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import { Servertoken } from "~/types";

export async function GET(req: NextRequest ) {
    const session = await getServerSession(options) as Servertoken;
    if (!session) return NextResponse.json({ msg: "please sign in" });

    // const chat_ids = await prisma.chat.create({
    //     data:{
    //     user_id:session.user.id
    //     }
    // })
    let data: {
        publicId: string;
        name: string;
        image: string;
    }[] = [];
  
    return NextResponse.json(data!);
}