import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import prisma from "@repo/db/prisma-client";
import { NextResponse } from "next/server";

export async function GET(res: NextResponse) {
    const session = await getServerSession(options);
    if (!session) return NextResponse.json({ msg: "please sign in" });
    
    const user = await prisma.users.findFirst({
        where: {
            email: session?.user?.email!
        },
        select: {
            friends: {
                select: {
                    friendIds: true
                }
            }

        }
    })
    let data: {
        publicId: string;
        name: string;
        image: string;
    }[] = [];
    for (let i = 0; i < user?.friends.length!; i++) {
        const id = user?.friends[i]?.friendIds[i]
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
    return NextResponse.json(data!)
}