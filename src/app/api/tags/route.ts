import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextAuthRequest } from "next-auth";
import { NextResponse } from "next/server";

export const GET = auth(async function GET(req : NextAuthRequest) {
    const session = req.auth

    if (session?.user) {
        const userID = session.user.id!


        try {
            const tagList = await prisma.tag.findMany({
                where: {
                    userID: userID
                }
            })

            return NextResponse.json(tagList)
        } catch (err) {
            console.error("An error with requesting all the tags for a user (that is signed in) has occurred: ", err)
            return NextResponse.json(
                { message: "Unable to request user tags. A prisma query error has occurred." },
                { status: 500 }
            )

        }
        

    } else {
        return NextResponse.json(
            { message: "Error, unable to get tags. User is not signed in." }, 
            { status: 400 }
        )
    }
})

export const POST = auth(async function POST(req : NextAuthRequest) {
    const session = req.auth

    if (session?.user) {
        const createdTag = prisma.tag.create({
            data : {
                
            }
        })
    } else {

    }
})

export const PATCH = auth(async function PATCH(req : NextAuthRequest) { 
    const session = req.auth

    if (session?.user) {
        
    } else {

    }
})
