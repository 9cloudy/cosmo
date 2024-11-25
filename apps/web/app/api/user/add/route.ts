import prisma from "@repo/db/prisma-client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/options";
import { Servertoken } from "~/types";

export async function POST (req:NextRequest){
    const {id}:{id:string[]} = await req.json();
    const session  = await getServerSession(options) as Servertoken
    console.log(id)
    const newUser =  await prisma.friends.create({
        data:{
          friendIds:id,
          total_chats:1,
          users:{
            connect:{
                publicId:session.user.id 
            }
          }
        },select:{
        friendIds:true
        }
      })
   
      return NextResponse.json({msg:"friend added succesfully",newUser},{status:200})
}