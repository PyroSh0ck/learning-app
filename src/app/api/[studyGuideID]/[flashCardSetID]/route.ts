import { prisma } from '@/lib/db'
import { FlashCard } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { DateTime } from 'next-auth/providers/kakao'
import { NextResponse, NextRequest } from 'next/server'

export async function POST(req: NextRequest, { params } : { params: { studyGuideID : string, flashCardSetID : string}}) {

    // URL format: /api/[studyGuideID]/[flashCardSetID]

    // if there's an issue its likely to do with searchParams or the lack of the use of the 'await' keyword somewhere

    // assuming url is in this format /*?setID=0x840292&limit=50
    // req.nextUrl.searchParams = { 'setID' : '0x840292'}

    const flashCardArr = await req.json()
    const flashCardSetID = params.flashCardSetID

    if (flashCardSetID === "") {
        return NextResponse.json({
            message: "Flashcard(s) were unable to be saved. The URL's dynamic route returned blank",
            status: 500,
        })
    }
    
    // This one can return null 
    const setIDRes = await prisma.flashCardSet.findUnique({
        where: {
            id: flashCardSetID
        }
    })

    if (setIDRes === null) {
        return NextResponse.json({
            message: "Flashcard(s) were unable to be saved. The setID provided by the URL search parameters does not exist",
            status: 500,
        })
    }

    const newArr : { frontContent: string, backContent: string, flashCardSetID: string }[] = []

    JSON.parse(flashCardArr).forEach((element : { frontData: string, backData: string }) => {

        const newElement = {
            frontContent: element.frontData,
            backContent: element.backData,
            flashCardSetID: flashCardSetID,
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
    // And we've already coded a check for flashCardSetID

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

export async function GET(req: NextRequest, { params }: { params : { studyGuideID: string, flashCardSetID: string }}) {
    const searchParams = req.nextUrl.searchParams
    const id = params.studyGuideID
    const limit = Number(searchParams.get("limit"))
    const iteration = Number(searchParams.get("iteration"))

    if (id === "") {
        return NextResponse.json({
            message: "Flashcard(s) unable to be retrieved. The URL dynamic route was blank.",
            status: 500,
        })
    }

    const numCards = await prisma.flashCard.count({
        where: {
            flashCardSetID: id
        }
    })

    if ((limit === null) || (limit > 50)) {
        return NextResponse.json({
            message: "Flashcard(s) unable to be retrieved. The limit search parameter was NaN, or the limit was greater than 50.",
            status: 400,
        })
    }

    if ((iteration === null) || (iteration * limit - limit > numCards)) {
        return NextResponse.json({
            message: "Flashcard(s) unable to be retrieved. The iteration search parameter was NaN, or the iteration was too high.",
            status: 400,
        })
    }


    const flashcardsWithID = await prisma.flashCard.findMany({
        skip: iteration * limit,
        take: limit, // won't be an issue if there are less cards than the limit left
        where: {
            flashCardSetID: id! // not an issue because we checked if it was null already
        }
    })

    if (flashcardsWithID.length === 0) {
        return NextResponse.json({
            message: "Unable to retrieve flashcard(s). No flashcards found for some reason.",
            status: 500,
        })
    }

    return NextResponse.json(flashcardsWithID)
}

export async function PATCH(req: NextRequest) {
    // data should be formatted via a server function to have all parameters
    // and if the paramter isn't changed, it just sets it to the current value
    const data = await req.json()

    // Format:
    // [{ id, flashCardSetID, frontContent, backContent, learnedCount, lastLearned, image}]

    const updatedCards : FlashCard[] = []

    data.forEach( async (element: { id: string, frontContent: string, backContent: string, learnedCount: number, lastLearned: DateTime}) => {
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
            })
            updatedCards.push(updatedCard)
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
                return NextResponse.json({
                    message: "Unable to update flashcard(s). The flashcard doesn't exist, which means that the id must have been invalid.",
                    status: 400,
                })
            } else {
                return NextResponse.json({
                    message: "Unexpected error? Unknown issue with updating cards",
                    status: 500,
                })
            }
        }    
    });

    return NextResponse.json(updatedCards)
}

export async function DELETE(req: NextRequest) {
    const data = await req.json()

    // Format:
    // [{id: ajfoiwefj}, {id: iowaepjf}, ...]

    data.forEach(async(element : { id: string }) => {
        try {
            await prisma.flashCard.delete({
                where: {
                    id: element.id
                }
            })
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
                return NextResponse.json({
                    message: "Unable to delete flashcard(s). Invalid id.",
                    status: 400,
                })
            } else {
                return NextResponse.json({
                    message: "Unable to delete flashcard(s). Unknown error.",
                    status: 400,
                })
            }
        }
    });

    return NextResponse.json({
        message: "Deleted flashcard(s) successfully.",
        status: 500,
    })

}
