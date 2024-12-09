import prisma from "@repo/db/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    const { id, email, avatarUrl, name }: {
        id: string;
        name: string;
        email: string;
        avatarUrl: string;
    } = await req.json();
    console.log({ id, email, avatarUrl, name })
    await prisma.users.update({
        where: {
            publicId: id
        },
        data: {
            email: email,
            image: avatarUrl,
            name: name
        }
    })
    return NextResponse.json({ msg: "done" }, { status: 200 })
}