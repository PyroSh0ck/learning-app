/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from '@/lib/db'
import { FlashCard, QuestionType } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { DateTime } from 'next-auth/providers/kakao'
import { NextResponse, NextRequest } from 'next/server'
import { NextAuthRequest } from 'next-auth'
import { auth } from '@/auth'
import { stringify } from 'querystring'


export const GET = auth(async function GET(req, { params }) {    
    if (req.auth!) {
        const { studyGuideID, studySetID, studyMethodID } = await params;

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
        if (studyMethodID === "" || !studyMethodID) {
            return NextResponse.json(
                { message: `studyMethodID returned blank, null, or undefined. studyMethodID is ${studyMethodID}`}, 
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

        if (method === "flashcard"){

            const flashcardSet = await prisma.flashCardSet.findUnique({
                where: {
                    id: studyMethodID
                }
            })

            if (!flashcardSet) {
                return NextResponse.json(
                    {message: `Could not find flashcard set. Maybe it is a different study method?`}, 
                    { status: 500 }
                )
            }
            
            
            const numCards = await prisma.flashCard.count({
                where: {
                    flashCardSetID: studyMethodID
                }
            })

            if (numCards === 0) {
                return NextResponse.json([])
            }

            if ((limit === null) || (limit > 50)) {
                return NextResponse.json(
                {message: `Flashcard(s) unable to be retrieved. The limit search parameter was NaN, or the limit was greater than 50.`}, 
                { status: 400 }
                )
            }

            if ((iteration === null) || (iteration * limit - limit > numCards)) { 
                return NextResponse.json(
                {message: `Flashcard(s) unable to be retrieved. The iteration search parameter was NaN, or the iteration was too high.`}, 
                { status: 400 }
                )
            }
            const flashcardsWithID = await prisma.flashCard.findMany({
                skip: iteration * limit,
                take: limit, // won't be an issue if there are less cards than the limit left
                where: {
                    flashCardSetID: studyMethodID // not an issue because we checked if it was null already
                }
            })

            return NextResponse.json(flashcardsWithID)
        }
        if (method === "video") {
            const playlist = await prisma.playlist.findUnique({
                where: {
                    id: studyMethodID
                }
            })

            if (!playlist) {
                return NextResponse.json(
                    {message: `Could not find flashcard set. Maybe it is a different study method?`}, 
                    { status: 500 }
                )
            }

            const numVideos = await prisma.flashCard.count({
                where: {
                    flashCardSetID: studyMethodID
                }
            })

            if ((limit === null) || (limit > 50)) {
                return NextResponse.json(
                {message: `Videos(s) unable to be retrieved. The limit search parameter was NaN, or the limit was greater than 50.`}, 
                { status: 400 }
                )
            }

            
            if ((iteration === null) || (iteration * limit - limit > numVideos)) {
                return NextResponse.json(
                {message: `Videos(s) unable to be retrieved. The iteration search parameter was NaN, or the iteration was too high.`}, 
                { status: 400 }
                )
            }

            const videosWithID = await prisma.video.findMany({
                skip: iteration * limit,
                take: limit, // won't be an issue if there are less cards than the limit left
                where: {
                    playlistID: studyMethodID // not an issue because we checked if it was null already
                }
            })

            return NextResponse.json(videosWithID)
        }
        if (method === "practice"){
            const qType = searchParams.get("type")
            const practiceSet = await prisma.practiceQuestionSet.findUnique({
                where: {
                    id: studyMethodID
                }
            })

            if (!practiceSet) {
                return NextResponse.json(
                    {message: `Could not find flashcard set. Maybe it is a different study method?`}, 
                    { status: 500 }
                )
            }
            
            
            const numQuestions = await prisma.practiceQuestion.count({
                where: {
                    practiceQuestionSetID: studyMethodID,
                    ...(qType && { type: qType as QuestionType }) 
                }
            })

            if ((limit === null) || (limit > 50)) {
                return NextResponse.json(
                {message: `Flashcard(s) unable to be retrieved. The limit search parameter was NaN, or the limit was greater than 50.`}, 
                { status: 400 }
                )
            }

            if ((iteration === null) || (iteration * limit - limit > numQuestions)) {
                return NextResponse.json(
                {message: `Flashcard(s) unable to be retrieved. The iteration search parameter was NaN, or the iteration was too high.`}, 
                { status: 400 }
                )
            }
            const practiceQuestionWithID = await prisma.practiceQuestion.findMany({
                skip: iteration * limit,
                take: limit, // won't be an issue if there are less cards than the limit left
                where: {
                    practiceQuestionSetID: studyMethodID,
                    ...(qType && { type: qType as QuestionType }) 
                }
            })

            return NextResponse.json(practiceQuestionWithID)
        }
    } else return NextResponse.json(
        { message: `Session is invalid`}, 
        { status: 400 }
    ) 
})

export const POST = auth(async function POST(req, { params }) {    
    if (req.auth!) {
        const { studyGuideID, studySetID, studyMethodID } = await params;

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
        if (studyMethodID === "" || !studyMethodID) {
            return NextResponse.json(
                { message: `studyMethodID returned blank, null, or undefined. studyMethodID is ${studyMethodID}`}, 
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
        if ((currentUserID != ownerUserID)) {
            return NextResponse.json(
                {message: `You can not edit another person's studyguide`}, 
                { status: 400 }
            ) 
        }

        const searchParams = req.nextUrl.searchParams
        const method = searchParams.get("method")
        const body = await req.json();

        if (method === "flashcard"){
            const flashcardSet = await prisma.flashCardSet.findUnique({
                where: {
                    id: studyMethodID
                }
            })

            if (!flashcardSet) {
                return NextResponse.json(
                    {message: `Could not find flashcard set. Maybe it is a different study method?`}, 
                    { status: 500 }
                )
            }

            const newArr : { frontContent: string, backContent: string, flashCardSetID: string }[] = []

            JSON.parse(body).forEach((element : { frontData: string, backData: string }) => {

                const newElement = {
                    frontContent: element.frontData,
                    backContent: element.backData,
                    flashCardSetID: studyMethodID,
                }

                newArr.push(newElement)

            });

            if (newArr.length === 0) {
                return NextResponse.json({
                    message: "Flashcard(s) were unable to be saved. Appropriate data was not passed in from the client",
                    status: 400,
                })
            }

            // This one will throw an err if the constraint fails
            // However, P2002 and P2003 (which are the main known errors)
            // Cannot happen, as there are no @unique or @@unique fields being updated
            // And we've already coded a check for studySetID

            try {
                const createdCards = await prisma.flashCard.createMany({
                    data: newArr,
                })

                return NextResponse.json(createdCards)  
            } catch {
                return NextResponse.json({
                    message: "Unknown error reached with POST request. The bulk creation of flashcards failed (although it wasn't due to a foreign key constraint or a unique constraint validation",
                    status: 500,
                })
            }
        }
        if (method === "video") {
            const playlist = await prisma.playlist.findUnique({
                where: {
                    id: studyMethodID
                }
            })

            if (!playlist) {
                return NextResponse.json(
                    {message: `Could not find flashcard set. Maybe it is a different study method?`}, 
                    { status: 500 }
                )
            }

            const newArr : {name : string, url : string, playlistID : string}[] = []

            JSON.parse(body).forEach((element : { name: string, url: string }) => {

                const newElement = {
                    name: element.name,
                    url: element.url,
                    playlistID: studyMethodID,
                }

                newArr.push(newElement)

            });

            if (newArr.length === 0) {
                return NextResponse.json({
                    message: "Flashcard(s) were unable to be saved. Appropriate data was not passed in from the client",
                    status: 400,
                })
            }

            // This one will throw an err if the constraint fails
            // However, P2002 and P2003 (which are the main known errors)
            // Cannot happen, as there are no @unique or @@unique fields being updated
            // And we've already coded a check for studySetID

            try {
                const videos = await prisma.video.createMany({
                    data: newArr,
                })

                return NextResponse.json(videos)  
            } catch {
                return NextResponse.json(
                    {message: "Unknown error reached with POST request. The bulk creation of videos failed (although it wasn't due to a foreign key constraint or a unique constraint validation"},
                    {status: 500},
                )
            }
            
        }
        if (method === "practice"){
            const practiceSet = await prisma.practiceQuestionSet.findUnique({
                where: { id: studyMethodID }
            });

            if (!practiceSet) {
                return NextResponse.json(
                    { message: `Could not find practice question set. Maybe it is a different study method?` },
                    { status: 500 }
                );
            }

            const newArr: {
                question: string;
                answer: string[];
                options: string[];
                type: QuestionType;
                practiceQuestionSetID: string;
            }[] = [];

            JSON.parse(body).forEach((element: {
                question: string;
                answer: string[];
                options: string[];
                type: QuestionType;
            }) => {
                newArr.push({
                    question: element.question,
                    answer: element.answer,
                    options: element.options,
                    type: element.type,
                    practiceQuestionSetID: studyMethodID
                });
            });

            if (newArr.length === 0) {
                return NextResponse.json({
                    message: "Practice question(s) were unable to be saved. Appropriate data was not passed in from the client.",
                    status: 400
                });
            }

            try {
                const createdQuestions = await prisma.practiceQuestion.createMany({
                    data: newArr
                });

            return NextResponse.json(createdQuestions);
                } catch {
                    return NextResponse.json({
                        message: "Unknown error reached with POST request. The bulk creation of practice questions failed.",
                    status: 500
                });
            }
        }
    } else return NextResponse.json(
        { message: `Session is invalid`}, 
        { status: 400 }
    ) 
})

export const PATCH = auth(async function PATCH(req, { params }) {    
    if (req.auth!) {
        const { studyGuideID, studySetID, studyMethodID } = await params;

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
        if (studyMethodID === "" || !studyMethodID) {
            return NextResponse.json(
                { message: `studyMethodID returned blank, null, or undefined. studyMethodID is ${studyMethodID}`}, 
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
        if ((currentUserID != ownerUserID)) {
            return NextResponse.json(
                {message: `You can not edit another person's studyguide`}, 
                { status: 400 }
            ) 
        }

        const searchParams = req.nextUrl.searchParams
        const method = searchParams.get("method")
        const body = await req.json();

        if (method === "flashcard"){
            const flashcardSet = await prisma.flashCardSet.findUnique({
                where: {
                    id: studyMethodID
                }
            })

            if (!flashcardSet) {
                return NextResponse.json(
                    {message: `Could not find flashcard set. Maybe it is a different study method?`}, 
                    { status: 500 }
                )
            }

            const updatedCards : FlashCard[] = []

            for (const element of body) {
                try {
                    const updatedCard = await prisma.flashCard.update({
                        where: {
                            id: element.id,
                        },
                        data: {
                            frontContent: element.frontContent,
                            backContent: element.backContent,
                            learnedCount: element.learnedCount,
                            lastLearned: element.lastLearned,
                        }
                    });
                    updatedCards.push(updatedCard);
                } catch (err) {
                    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
                        return NextResponse.json({
                            message: "Unable to update flashcard(s). The flashcard doesn't exist, which means that the id must have been invalid.",
                            status: 400,
                        });
                    } else {
                        return NextResponse.json({
                            message: "Unexpected error? Unknown issue with updating cards",
                            status: 500,
                        });
                    }
                }
            }

            return NextResponse.json(updatedCards)
        }
        if (method === "video") {
            const playlist = await prisma.playlist.findUnique({
                where: { id: studyMethodID }
            });

            if (!playlist) {
                return NextResponse.json(
                    { message: `Could not find playlist. Maybe it is a different study method?` },
                    { status: 500 }
                );
            }

            const updatedVideos = [];

            for (const element of body) {
                try {
                    const updatedVideo = await prisma.video.update({
                        where: { id: element.id },
                        data: {
                            name: element.name,
                            url: element.url,
                            watched: element.watched
                        }
                    });
                    updatedVideos.push(updatedVideo);
                } catch (err) {
                    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
                        return NextResponse.json({
                            message: "Unable to update video(s). Invalid id.",
                            status: 400
                        });
                    } else {
                        return NextResponse.json({
                            message: "Unexpected error while updating video(s).",
                            status: 500
                        });
                    }
                }
            }

            return NextResponse.json(updatedVideos);
        }
        if (method === "practice"){
            const practiceSet = await prisma.practiceQuestionSet.findUnique({
                where: { id: studyMethodID }
            });

            if (!practiceSet) {
                return NextResponse.json(
                    { message: `Could not find practice question set. Maybe it is a different study method?` },
                    { status: 500 }
                );
            }

            const updatedQuestions = [];

            for (const element of body) {
                try {
                    const updated = await prisma.practiceQuestion.update({
                        where: { id: element.id },
                        data: {
                            question: element.question,
                            answer: element.answer,
                            options: element.options,
                            type: element.type,
                            timesAnsweredRight: element.timesAnsweredRight ?? 0,
                            timesAnsweredWrong: element.timesAnsweredWrong ?? 0,
                            image: element.image ?? undefined
                        }
                    });
                    updatedQuestions.push(updated);
                } catch (err) {
                    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
                        return NextResponse.json({
                            message: "Unable to update practice question(s). Invalid id.",
                            status: 400
                        });
                    } else {
                        return NextResponse.json({
                            message: "Unexpected error while updating practice question(s).",
                            status: 500
                        });
                    }
                }
            }

            return NextResponse.json(updatedQuestions);
        }
    } else return NextResponse.json(
         {message: `Session is invalid`}, 
        { status: 400 }
    ) 
})

export const DELETE = auth(async function DELETE(req, { params }) {    
    if (req.auth!) {
        const { studyGuideID, studySetID, studyMethodID } = await params;

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
        if (studyMethodID === "" || !studyMethodID) {
            return NextResponse.json(
                { message: `studyMethodID returned blank, null, or undefined. studyMethodID is ${studyMethodID}`}, 
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
        if ((currentUserID != ownerUserID)) {
            return NextResponse.json(
                {message: `You can not edit another person's studyguide`}, 
                { status: 400 }
            ) 
        }

        const searchParams = req.nextUrl.searchParams
        const method = searchParams.get("method")
        const body = await req.json();

        if (method === "flashcard"){
            const flashcardSet = await prisma.flashCardSet.findUnique({
                where: {
                    id: studyMethodID
                }
            })

            if (!flashcardSet) {
                return NextResponse.json(
                    {message: `Could not find flashcard set. Maybe it is a different study method?`}, 
                    { status: 500 }
                )
            }

            // Format:
            // [{id: ajfoiwefj}, {id: iowaepjf}, ...]

            for (const element of body) {
                try {
                    await prisma.flashCard.delete({
                        where: {
                            id: element.id
                        }
                    });
                } catch (err) {
                    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
                        return NextResponse.json({
                            message: "Unable to delete flashcard(s). Invalid id.",
                            status: 400,
                        });
                    } else {
                        return NextResponse.json({
                            message: "Unable to delete flashcard(s). Unknown error.",
                            status: 400,
                        });
                    }
                }
            }


            return NextResponse.json({
                message: "Deleted flashcard(s) successfully.",
                status: 500,
            })
        }
        if (method === "video") {
            const playlist = await prisma.playlist.findUnique({
                    where: { id: studyMethodID }
                });

                if (!playlist) {
                    return NextResponse.json(
                        { message: `Could not find playlist. Maybe it is a different study method?` },
                        { status: 500 }
                    );
                }

                for (const element of body) {
                    try {
                        await prisma.video.delete({
                            where: { id: element.id }
                        });
                    } catch (err) {
                        if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
                            return NextResponse.json({
                                message: "Unable to delete video(s). Invalid id.",
                                status: 400
                            });
                        } else {
                            return NextResponse.json({
                                message: "Unable to delete video(s). Unknown error.",
                                status: 500
                            });
                        }
                    }
                }

                return NextResponse.json({
                    message: "Deleted video(s) successfully.",
                    status: 200
                });
        }
        if (method === "practice"){
            const practiceSet = await prisma.practiceQuestionSet.findUnique({
                where: { id: studyMethodID }
            });

            if (!practiceSet) {
                return NextResponse.json(
                    { message: `Could not find practice question set. Maybe it is a different study method?` },
                    { status: 500 }
                );
            }

            for (const element of body) {
                try {
                    await prisma.practiceQuestion.delete({
                        where: { id: element.id }
                    });
                } catch (err) {
                    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
                        return NextResponse.json({
                            message: "Unable to delete practice question(s). Invalid id.",
                            status: 400
                        });
                    } else {
                        return NextResponse.json({
                            message: "Unable to delete practice question(s). Unknown error.",
                            status: 500
                        });
                    }
                }
            }

            return NextResponse.json({
                message: "Deleted practice question(s) successfully.",
                status: 200
            });
        }
    } else return NextResponse.json(
        { message: `Session is invalid`}, 
        { status: 400 }
    ) 
})
