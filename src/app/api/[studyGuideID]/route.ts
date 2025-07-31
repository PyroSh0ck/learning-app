import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { NextAuthRequest, Session } from "next-auth";
import { auth } from "@/auth";
import { AuthenticateUser, CheckIfValid, CheckValidStudyGuide } from "@/lib/customFuncs";

const PrismaQuerier = async ( method : string, studyGuideID : string, studySetName : string, studySetID : string ) => {
    let data : unknown[] = []
    const genCheck = CheckIfValid(studyGuideID)
    switch (method) {
        case "GET": 
            data = await prisma.studySet.findMany({
                where: {
                    studyGuideID: studyGuideID
                }
            })
            break;
        case "POST":
            const createdSet = await prisma.studySet.create({
                data : {
                    name: studySetName,
                    studyGuideID: studyGuideID
                }
            })
            data.push(createdSet)
            break;
        case "PATCH":
            if (genCheck !== true) {
                return genCheck
            }
            const updatedSet = await prisma.studySet.update({
                where : {
                    id: studySetID
                },
                data : {
                    name: studySetName,
                }
            })
            data.push(updatedSet)
            break;
        case "DELETE":
            if (genCheck !== true) {
                return genCheck
            }
            await prisma.studySet.delete({
                where : {
                    id: studySetID
                }
            })
            data.push({ message: "Deleted StudySet Successfully." })
            break;
    }

    if (method !== 'GET') {
        if (data.length !== 1) {
            return NextResponse.json(
                { message : "Error with Prisma Querier function. Data length is greater than 1" },
                { status : 500 }
            )
        } else {
            return NextResponse.json(data[0])
        }
    } else {
        return NextResponse.json(data)
    }

}

const NetworkTemplate = async (session : Session | null, req : NextAuthRequest, { params } : { params : Promise<{ studyGuideID : string }> }, method : string ) => {
    const valid = AuthenticateUser(session)

    if (typeof valid === 'string') {
        const body = await req.json()

        const { studyGuideID } : { studyGuideID : string } = await params
        const { studySetName, studySetID } : { studySetName : string, studySetID : string } = body

        const genCheck = CheckIfValid(studyGuideID, studySetName) 

        if (genCheck === true) {
            const userID = valid

            const studyGuide = await prisma.studyGuide.findUnique({
                where: {
                    id: studyGuideID
                }
            })

            const studyCheck = CheckValidStudyGuide(studyGuide, userID) 

            if (studyCheck === true) {
                return PrismaQuerier(method, studyGuideID, studySetName, studySetID)
            } else {
                return studyCheck
            }
        } else { 
            return genCheck
        }
    } else {
        return valid
    }
}

export const GET = auth(async function GET(req : NextAuthRequest, { params } : { params : Promise<{ studyGuideID : string }> }) {
    const session = req.auth

    return NetworkTemplate(session, req, { params }, 'GET')

});



export const POST = auth(async function POST(req : NextAuthRequest, { params } : { params : Promise<{ studyGuideID : string }> }) {
    const session = req.auth

    return NetworkTemplate(session, req, { params }, 'POST')
});



export const PATCH = auth(async function PATCH(req : NextAuthRequest, { params } : { params : Promise<{ studyGuideID : string }> }) {  
    const session = req.auth

    return NetworkTemplate(session, req, { params }, 'PATCH')
});


export const DELETE = auth(async function DELETE(req : NextAuthRequest, { params } : { params : Promise<{ studyGuideID : string }> }) {  
    const session = req.auth

    return NetworkTemplate(session, req, { params }, 'DELETE')
});


