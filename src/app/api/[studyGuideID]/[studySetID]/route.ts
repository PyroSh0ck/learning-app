import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { NextAuthRequest } from 'next-auth'
import { auth } from '@/auth'
import { AuthenticateUser, CheckIfValid, CheckValidStudyGuide } from '@/lib/customFuncs'


export const POST = auth(async function POST(req : NextAuthRequest, { params } : { params : Promise<{ studyGuideID : string, studySetID : string }> }) {
    // URL format: /api/[studyGuideID]/[studySetID]

    // if there's an issue its likely to do with searchParams or the lack of the use of the 'await' keyword somewhere

    // assuming url is in this format /*?setID=0x840292&limit=50
    // req.nextUrl.searchParams = { 'setID' : '0x840292'}

    const session = req.auth

    const valid = AuthenticateUser(session)

    if (typeof valid === 'string') {
        const body = await req.json()

        const { studyGuideID, studySetID } = await params

        const check = CheckIfValid(studyGuideID, studySetID)

        if (check === true) {
            const userID = valid
            const studyGuide = await prisma.studyGuide.findUnique({
                where: {
                    id: studyGuideID
                }
            })

            const studyCheck = CheckValidStudyGuide(studyGuide, userID)

            if (studyCheck === true) {
                const searchParams = req.nextUrl.searchParams
                const method = searchParams.get("method")

                const studySet = await prisma.studySet.findUnique({
                    where: {
                        id: studySetID
                    }
                })

                if (!studySet) {
                    return NextResponse.json(
                        {message: `Could not find flashcard set. Maybe it is a different study method?`}, 
                        { status: 500 }
                    )
                }   
                switch (method) {
                    case "flashCardSet": {
                        const data = await prisma[method].create({
                            data: {
                                ...body,
                                studySetID: studySetID
                            }
                        })
                        return NextResponse.json(data)
                    }
                    case "playlist": {
                        const data = await prisma.playlist.create({
                            data: {
                                ...body,
                                studySetID: studySetID
                            }
                        })
                        return NextResponse.json(data)
                    }
                    case "practiceQuestionSet": {
                        const data = await prisma.practiceQuestionSet.create({
                            data: {
                                ...body,
                                studySetID: studySetID
                            }
                        })
                        return NextResponse.json(data)
                    }
                    default:  
                        return NextResponse.json(
                            {message: `Method not recognized. Method is ${method}`}, 
                            { status: 400 }
                        )
                }
            } else {
                return studyCheck
            }
        } else {
            return check
        }

    } else {
        return valid
    }
})
   


export const GET = auth(async function GET(req, { params }) {
    
    if (req.auth!) {

        const { studyGuideID, studySetID } = await params;

        if (studyGuideID === "" || !studyGuideID) {
            return NextResponse.json(
                {message: `studyGuideID returned blank, null, or undefined. studyGuideID is ${studyGuideID}`}, 
                { status: 400 }
            ) 
        }
        if (studySetID === "" || !studySetID) {
            return NextResponse.json(
                { message: `studySetID returned blank, null, or undefined. studySetID is ${studySetID}`}, 
                { status: 400 }
            )
        }


        if (!req.auth.user?.id) {
            return NextResponse.json(
                {message: `Session is likely invalid, UserID was not found. UserID is ${req.auth.user?.id}`}, 
                { status: 400 }
            ) 
        }
        const currentUserID = req.auth.user.id;

        const studyGuide = await prisma.studyGuide.findUnique({
            where: {
                id: studyGuideID
            }
        })
        if (!studyGuide){
            return NextResponse.json(
                {message: `StudyGuide could not be found. StudyGuideID is ${studyGuideID}`}, 
                { status: 500 }
            ) 
        }
        const ownerUserID = studyGuide.userID
        if ((studyGuide.private) && (currentUserID != ownerUserID)) {
            return NextResponse.json(
                {message: `You can not access a private studyguide's contents without being the owner.`}, 
                { status: 400 }
            ) 
        }

        const searchParams = req.nextUrl.searchParams
        const method = searchParams.get("method")
        const limit = Number(searchParams.get("limit"))
        const iteration = Number(searchParams.get("iteration"))
        const completed = searchParams.get("completed")

        const studySet = await prisma.studySet.findUnique({
            where: {
                id: studySetID
            }
        })

        if (!studySet) {
            return NextResponse.json(
                {message: `Could not find flashcard set. Maybe it is a different study method?`}, 
                { status: 500 }
            )
        }

        if (method === "flashCardSet") {
            const numOfSets = await prisma.flashCardSet.count({
                where: {
                    studySetID: studySetID
                }
            })
            if (numOfSets === 0) {
                return NextResponse.json([])
            }
            
            if ((limit === null) || (limit > 50)) {
                return NextResponse.json(
                {message: `Flashcard(s) unable to be retrieved. The limit search parameter was NaN, or the limit was greater than 50.`}, 
                { status: 400 }
                )
            }

            if ((iteration === null) || (iteration * limit - limit > numOfSets)) { 
                return NextResponse.json(
                {message: `Flashcard(s) unable to be retrieved. The iteration search parameter was NaN, or the iteration was too high.`}, 
                { status: 400 }
                )
            }
            const data = await prisma.flashCardSet.findMany({
                skip: iteration * limit,
                take: limit, // won't be an issue if there are less cards than the limit left
                where: {
                    studySetID: studySetID, // not an issue because we checked if it was null already
                    ...((completed === "true") ? { completed: true } : {}),
                }
            })
            return NextResponse.json(data)
        } else if (method === "playlist") {

            const numOfSets = await prisma.playlist.count({
                where: {
                    studySetID: studySetID
                }
            })
            if (numOfSets === 0) {
                return NextResponse.json([])
            }
            
            if ((limit === null) || (limit > 50)) {
                return NextResponse.json(
                {message: `Playlist(s) unable to be retrieved. The limit search parameter was NaN, or the limit was greater than 50.`}, 
                { status: 400 }
                )
            }

            if ((iteration === null) || (iteration * limit - limit > numOfSets)) { 
                return NextResponse.json(
                {message: `Playlist(s) unable to be retrieved. The iteration search parameter was NaN, or the iteration was too high.`}, 
                { status: 400 }
                )
            }
            const data = await prisma.playlist.findMany({
                skip: iteration * limit,
                take: limit, // won't be an issue if there are less cards than the limit left
                where: {
                    studySetID: studySetID, // not an issue because we checked if it was null already
                    ...((completed === "true") ? { completed: true } : {}),
                }
            })
            return NextResponse.json(data)
        } else if (method === "PracticeQuestionSet") {
            const numOfSets = await prisma.practiceQuestionSet.count({
                where: {
                    studySetID: studySetID
                }
            })
            if (numOfSets === 0) {
                return NextResponse.json([])
            }
            
            if ((limit === null) || (limit > 50)) {
                return NextResponse.json(
                {message: `practiceQuestionSet(s) unable to be retrieved. The limit search parameter was NaN, or the limit was greater than 50.`}, 
                { status: 400 }
                )
            }

            if ((iteration === null) || (iteration * limit - limit > numOfSets)) { 
                return NextResponse.json(
                {message: `practiceQuestionSet(s) unable to be retrieved. The iteration search parameter was NaN, or the iteration was too high.`}, 
                { status: 400 }
                )
            }
            const data = await prisma.practiceQuestionSet.findMany({
                skip: iteration * limit,
                take: limit, // won't be an issue if there are less cards than the limit left
                where: {
                    studySetID: studySetID, // not an issue because we checked if it was null already
                    ...((completed === "true") ? { completed: true } : {}),
                }
            })
            return NextResponse.json(data)
        } else {   
            return NextResponse.json(
                {message: `Method not recognized. Method is ${method}`}, 
                { status: 400 }
            )
        }
    }
})


export const PATCH = auth(async function PATCH(req, { params }) {
    if (req.auth!) {

        const { studyGuideID, studySetID } = await params;

        if (studyGuideID === "" || !studyGuideID) {
            return NextResponse.json(
                {message: `studyGuideID returned blank, null, or undefined. studyGuideID is ${studyGuideID}`}, 
                { status: 400 }
            ) 
        }
        if (studySetID === "" || !studySetID) {
            return NextResponse.json(
                { message: `studySetID returned blank, null, or undefined. studySetID is ${studySetID}`}, 
                { status: 400 }
            )
        }

        if (!req.auth.user?.id) {
            return NextResponse.json(
                {message: `Session is likely invalid, UserID was not found. UserID is ${req.auth.user?.id}`}, 
                { status: 400 }
            ) 
        }
        const currentUserID = req.auth.user.id;

        const studyGuide = await prisma.studyGuide.findUnique({
            where: {
                id: studyGuideID
            }
        })
        if (!studyGuide){
            return NextResponse.json(
                {message: `StudyGuide could not be found. StudyGuideID is ${studyGuideID}`}, 
                { status: 500 }
            ) 
        }
        const ownerUserID = studyGuide.userID
        if (currentUserID != ownerUserID) {
            return NextResponse.json(
                {message: `You can not access a private studyguide's contents without being the owner.`}, 
                { status: 400 }
            ) 
        }

        const searchParams = req.nextUrl.searchParams
        const method = searchParams.get("method")

        const body = await req.json()
        const { id, ...updateData } = body

        if (!id) {
            return NextResponse.json(
                {message: `No ID provided to update.`}, 
                { status: 400 }
            )
        }

        if (method === "flashCardSet") {
            const data = await prisma.flashCardSet.update({
                where: { id },
                data: updateData
            })
            return NextResponse.json(data)
        } else if (method === "playlist") {
            const data = await prisma.playlist.update({
                where: { id },
                data: updateData
            })
            return NextResponse.json(data)
        } else if (method === "practiceQuestionSet") {
            const data = await prisma.practiceQuestionSet.update({
                where: { id },
                data: updateData
            })
            return NextResponse.json(data)
        } else {   
            return NextResponse.json(
                {message: `Method not recognized. Method is ${method}`}, 
                { status: 400 }
            )
        }
    }
})


export const DELETE = auth(async function DELETE(req, { params }) {
    if (req.auth!) {

        const { studyGuideID, studySetID } = await params;

        if (studyGuideID === "" || !studyGuideID) {
            return NextResponse.json(
                {message: `studyGuideID returned blank, null, or undefined. studyGuideID is ${studyGuideID}`}, 
                { status: 400 }
            ) 
        }
        if (studySetID === "" || !studySetID) {
            return NextResponse.json(
                { message: `studySetID returned blank, null, or undefined. studySetID is ${studySetID}`}, 
                { status: 400 }
            )
        }

        if (!req.auth.user?.id) {
            return NextResponse.json(
                {message: `Session is likely invalid, UserID was not found. UserID is ${req.auth.user?.id}`}, 
                { status: 400 }
            ) 
        }
        const currentUserID = req.auth.user.id;

        const studyGuide = await prisma.studyGuide.findUnique({
            where: {
                id: studyGuideID
            }
        })
        if (!studyGuide){
            return NextResponse.json(
                {message: `StudyGuide could not be found. StudyGuideID is ${studyGuideID}`}, 
                { status: 500 }
            ) 
        }
        const ownerUserID = studyGuide.userID
        if (currentUserID != ownerUserID) {
            return NextResponse.json(
                {message: `You can not access a private studyguide's contents without being the owner.`}, 
                { status: 400 }
            ) 
        }

        const searchParams = req.nextUrl.searchParams
        const method = searchParams.get("method")

        const body = await req.json()
        const { id } = body

        if (!id) {
            return NextResponse.json(
                {message: `No ID provided to delete.`}, 
                { status: 400 }
            )
        }

        if (method === "flashCardSet") {
            const data = await prisma.flashCardSet.delete({
                where: { id }
            })
            return NextResponse.json(data)
        } else if (method === "playlist") {
            const data = await prisma.playlist.delete({
                where: { id }
            })
            return NextResponse.json(data)
        } else if (method === "practiceQuestionSet") {
            const data = await prisma.practiceQuestionSet.delete({
                where: { id }
            })
            return NextResponse.json(data)
        } else {   
            return NextResponse.json(
                {message: `Method not recognized. Method is ${method}`}, 
                { status: 400 }
            )
        }
    }
})

