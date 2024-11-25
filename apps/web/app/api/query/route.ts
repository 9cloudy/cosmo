import prisma from "@repo/db/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { id }: { id: string } = await req.json();

    console.log(id)
    const newUser = await prisma.users.findMany({
        where: {
            publicId:{
                startsWith:id,
                mode:"insensitive"
            }
        },
        select: {
            name: true,
            publicId: true,
            image:true
        }
    })

    return NextResponse.json(newUser, { status: 200 })
}