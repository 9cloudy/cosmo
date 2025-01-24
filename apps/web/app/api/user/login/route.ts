import prisma, { status } from "@repo/db/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest ) {
    const {email}:{email:string} = await req.json();
console.log(email)
    const data = await prisma.users.findFirst({
        where:{
            email:email,
        },select:{
            image:true
        }
    })
    
    return NextResponse.json(data?.image);
}