import prisma, { Providers } from "@repo/db/prisma-client";
import { NextRequest, NextResponse } from "next/server"
import * as bcrypt from "bcrypt"
import * as z from "zod"
import { generateId } from "~/utils/generator";
const userSchema = z.object({
    username:z.string().min(1,"username required").max(100),
    email:z.string().min(1,"email required").email("enter a valid email"),
    password:z.string().min(1,"password required").max(10),
    avatar:z.string()
})
export async function POST(req:NextRequest){
    const {username ,email,password,avatar}:{username:string,email:string,password:string,avatar:string}= userSchema.parse(await req.json())

    const existingUser = await prisma.users.findFirst({
        where:{
            email:email,
        }
    });
    if(!existingUser){
        const hashedPassword = await bcrypt.hash(password,10)
        const publicID = generateId();
        try{
             await prisma.users.create({
                data:{
                  name:username,
                  email:email,
                  password:hashedPassword,
                  provider:Providers.CREDENTIALS,
                  publicId:publicID,
                  image:avatar
                }
            })

            return NextResponse.json({msg:"account created successfully"})
            
        }catch(err){
          return NextResponse.json({err})
        }
    }
        return NextResponse.json({msg:"user already exixts"})
    }