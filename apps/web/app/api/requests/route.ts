import prisma, { status } from "@repo/db/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const {user_id}:{user_id:string} = await req.json();
    const reqs = await prisma.friends.findMany({
        where:{
            friendIds:user_id
        },select:{
            user_Id:true,
            status:true
        }
    })
    const friends = reqs.filter((id)=> id.status == status.PENDING);
    let data: {
        publicId: string;
        name: string;
        image: string;
    }[] = [];
    if(reqs){
        for (let i = 0; i < friends.length!; i++) {
            const id = friends[i]!.user_Id
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
    return NextResponse.json(data);
    }
    return NextResponse.json("");
}