import { auth } from "@/auth";
import { AuthenticateUser, CheckIfValid } from "@/lib/customFuncs";
import { ConnectStruct } from "@/lib/customTypes";
import { prisma } from "@/lib/db";
import { Tag } from "@prisma/client";
import { NextAuthRequest } from "next-auth";
import { NextResponse } from "next/server";

export const GET = auth(async function GET(req : NextAuthRequest) {
    const session = req.auth
    
    const valid = AuthenticateUser(session)

    if (typeof valid === 'string') {
        const searchParams = req.nextUrl.searchParams
        const name = searchParams.get('name') || ''
        const userID = valid

        try {
            const tagList : Tag[] = await prisma.tag.findMany({
                where: {
                    userID: userID,
                    name: {
                        contains: name // if name is an empty string then this will just return every name that's not null
                    }
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
        return valid
    }
})

export const POST = auth(async function POST(req : NextAuthRequest) {
    const session = req.auth

    const valid = AuthenticateUser(session)

    if (typeof valid === 'string') {
        const body = await req.json()
        const { tagName, tagColor, studyGuideIDs } : { tagName : string, tagColor : string, studyGuideIDs : ConnectStruct[] } = body
        const check = CheckIfValid(tagName, tagColor, studyGuideIDs)


        const userID = valid
        if (check === true) {
            const createdTag = await prisma.tag.create({
                data : {
                    name: tagName,
                    color: tagColor,
                    userID: userID,
                    studyGuides : {
                        connect : studyGuideIDs
                    }
                }
            })
            return NextResponse.json(createdTag)   
        } else {
            return check
        }
    } else {
        return valid
    }
})

export const PATCH = auth(async function PATCH(req : NextAuthRequest) { 
    const session = req.auth

    const valid = AuthenticateUser(session)

    if (typeof valid === 'string') {
        const userID = valid
        const body = await req.json()

        const { tagName, tagColor, tagID, studyGuideIDs } : { tagName : string, tagColor : string, tagID : string, studyGuideIDs : ConnectStruct[] } = body

        const check = CheckIfValid(tagName, tagColor, tagID, studyGuideIDs)

        if (check === true) {
            const matchingTag = await prisma.tag.findUnique({
                where: {
                    tagId : {
                        name: tagName,
                        userID: userID
                    }
                }
            })

            if (!matchingTag || matchingTag.id === tagID) {
                const updatedTag = await prisma.tag.update({
                    where: {
                        id: tagID
                    },
                    data : {
                        name: tagName,
                        color: tagColor,
                        studyGuides : {
                            connect : studyGuideIDs
                        }
                    }
                })
                return NextResponse.json(updatedTag)
            } else {
                return NextResponse.json(
                    { message: "Same Tag Name Error" },
                    { status: 400 }
                )
            }
        } else {
            return check
        }
        
    } else {
        return valid
    }
})

export const DELETE = auth(async function DELETE(req: NextAuthRequest) {
    const session = req.auth

    const valid = AuthenticateUser(session)

    if (typeof valid === 'string') {
        const body = await req.json()
        const { tagID } : { tagID : string } = body

        const check = CheckIfValid(tagID)

        if (check === true) {
            await prisma.tag.delete({
                where: {
                    id: tagID
                }
            })

            return NextResponse.json(
                { message: "Tag deleted successfully :D " },
                { status: 200 }
            )
        } else {
            return check
        }

    } else {
        return valid
    }
})
